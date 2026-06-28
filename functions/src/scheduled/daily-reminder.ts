import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const sendDailyReminder = functions.pubsub
  .schedule('0 8 * * *')  // 8 AM UTC daily
  .timeZone('Asia/Colombo')
  .onRun(async () => {
    const db = admin.firestore();
    const messaging = admin.messaging();
    const snapshot = await db.collection('users')
      .where('fcmToken', '!=', null)
      .where('preferences.notifications.dailyReminder', '==', true)
      .get();

    const sends = snapshot.docs.map(async (docSnap) => {
      const { fcmToken, displayName } = docSnap.data();
      if (!fcmToken) return;
      await messaging.send({
        token: fcmToken as string,
        notification: {
          title: 'Daily eco-action time! 🌿',
          body: `Hey ${(displayName as string) ?? 'there'}, make a difference today. Log your recycling!`,
        },
        webpush: {
          fcmOptions: { link: '/habits/log' },
        },
      });
    });
    await Promise.allSettled(sends);
    functions.logger.info(`Daily reminder sent to ${snapshot.size} users`);
  });
