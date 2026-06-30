import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Runs every hour. Finds users whose lastActionAt is 20-24 hours ago and
 * who have an active streak, then sends an FCM push notification urging
 * them to log before their streak resets at the 48-hour mark.
 */
export const checkStreakAlerts = functions.pubsub
  .schedule('every 60 minutes')
  .onRun(async () => {
    const db = admin.firestore();
    const messaging = admin.messaging();
    const now = new Date();

    const twentyHoursAgo = new Date(now.getTime() - 20 * 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    try {
      const snapshot = await db
        .collection('users')
        .where('lastActionAt', '>=', admin.firestore.Timestamp.fromDate(twentyFourHoursAgo))
        .where('lastActionAt', '<=', admin.firestore.Timestamp.fromDate(twentyHoursAgo))
        .get();

      const atRiskUsers = snapshot.docs.filter((d) => {
        const data = d.data();
        return (
          (data.currentStreak as number ?? 0) > 0 &&
          data.preferences?.notifications?.streakAlerts !== false
        );
      });

      if (atRiskUsers.length === 0) {
        functions.logger.info('Streak alert check: no users at risk', {
          checkedAt: now.toISOString(),
          window: '20-24h',
        });
        return;
      }

      functions.logger.info(`Streak alert: ${atRiskUsers.length} user(s) at risk`);

      const sends = atRiskUsers.map(async (userDoc) => {
        const data = userDoc.data();
        const fcmToken = data.fcmToken as string | undefined;
        if (!fcmToken) return;

        const streak = data.currentStreak as number ?? 0;
        try {
          await messaging.send({
            token: fcmToken,
            notification: {
              title: `Your ${streak}-day streak is at risk! 🔥`,
              body: 'Log an eco-action in the next few hours to keep your streak alive.',
            },
            webpush: {
              fcmOptions: { link: '/habits/log' },
            },
            data: { type: 'streak_alert', streak: String(streak) },
          });
        } catch (err) {
          // Token may be stale — remove it so future sends don't waste quota
          functions.logger.warn(`FCM send failed for user ${userDoc.id}, clearing token:`, err);
          await userDoc.ref.update({ fcmToken: admin.firestore.FieldValue.delete() });
        }
      });

      await Promise.allSettled(sends);
    } catch (error) {
      functions.logger.error('Streak alert check failed:', error);
    }
  });
