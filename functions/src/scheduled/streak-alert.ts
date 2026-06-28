import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Scheduled function that runs every hour.
 * Queries users whose lastActionAt is between 20-24 hours ago and who have an active streak.
 * Logs the users at risk and is ready for FCM notification integration.
 */
export const checkStreakAlerts = functions.pubsub
  .schedule('every 60 minutes')
  .onRun(async () => {
    const db = admin.firestore();
    const now = new Date();

    // Window: 20–24 hours ago
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
        return (data.currentStreak ?? 0) > 0;
      });

      if (atRiskUsers.length === 0) {
        functions.logger.info('Streak alert check: no users at risk', {
          checkedAt: now.toISOString(),
          window: '20-24h',
        });
        return;
      }

      functions.logger.info(`Streak alert: ${atRiskUsers.length} user(s) at risk`, {
        checkedAt: now.toISOString(),
        window: '20-24h',
        userIds: atRiskUsers.map((d) => d.id),
      });

      // TODO: Send FCM notifications when tokens are available
      // for (const userDoc of atRiskUsers) {
      //   const data = userDoc.data();
      //   const fcmToken: string | undefined = data.fcmToken;
      //   if (fcmToken) {
      //     await admin.messaging().send({
      //       token: fcmToken,
      //       notification: {
      //         title: `Your ${data.currentStreak}-day streak is at risk!`,
      //         body: 'Log an eco-action in the next few hours to keep your streak alive.',
      //       },
      //       data: { type: 'streak_alert', streak: String(data.currentStreak ?? 0) },
      //     });
      //   }
      // }
    } catch (error) {
      functions.logger.error('Streak alert check failed:', error);
    }
  });
