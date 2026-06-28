import * as functions from 'firebase-functions';

/**
 * Firestore trigger: fires when a user document is updated.
 * Detects level increases and logs the event.
 * TODO: Send FCM notification when VAPID key is configured.
 */
export const onLevelUp = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    const levelBefore: number = before.level ?? 1;
    const levelAfter: number = after.level ?? 1;

    if (levelAfter > levelBefore) {
      functions.logger.info(
        `User ${context.params.userId} leveled up from ${levelBefore} to ${levelAfter}`,
        {
          userId: context.params.userId,
          previousLevel: levelBefore,
          newLevel: levelAfter,
          totalPoints: after.totalPoints ?? 0,
          displayName: after.displayName ?? 'Unknown',
        }
      );

      // TODO: Send FCM notification when VAPID key is configured
      // const fcmToken: string | undefined = after.fcmToken;
      // if (fcmToken) {
      //   await admin.messaging().send({
      //     token: fcmToken,
      //     notification: {
      //       title: `Level Up! You reached Level ${levelAfter}`,
      //       body: `You are now "${after.levelTitle ?? 'Eco Explorer'}". Keep going!`,
      //     },
      //     data: { type: 'level_up', level: String(levelAfter) },
      //   });
      // }
    }
  });
