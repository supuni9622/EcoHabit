import * as functions from 'firebase-functions';
import { adminDb, COLLECTIONS } from '../../utils/firebase-admin';
import * as admin from 'firebase-admin';

const LEVEL_THRESHOLDS = [
  { level: 1, points: 0, title: 'Eco Beginner' },
  { level: 2, points: 500, title: 'Eco Explorer' },
  { level: 3, points: 1500, title: 'Eco Enthusiast' },
  { level: 4, points: 3000, title: 'Eco Warrior' },
  { level: 5, points: 5000, title: 'Eco Champion' },
  { level: 6, points: 10000, title: 'Eco Master' },
  { level: 7, points: 20000, title: 'Eco Legend' },
  { level: 8, points: 35000, title: 'Eco Guardian' },
  { level: 9, points: 50000, title: 'Eco Hero' },
  { level: 10, points: 100000, title: 'Eco Legendary' },
];

function getLevel(totalPoints: number): { level: number; title: string } {
  let result = LEVEL_THRESHOLDS[0];
  for (const threshold of LEVEL_THRESHOLDS) {
    if (totalPoints >= threshold.points) {
      result = threshold;
    }
  }
  return { level: result.level, title: result.title };
}

function updateStreak(
  currentStreak: number,
  lastActionAt: admin.firestore.Timestamp | null
): number {
  if (!lastActionAt) return 1;
  const now = new Date();
  const lastAction = lastActionAt.toDate();
  const hoursSinceLast = (now.getTime() - lastAction.getTime()) / (1000 * 60 * 60);

  if (hoursSinceLast > 48) return 1; // Streak broken
  if (hoursSinceLast < 24) {
    // Check if it's a different day
    const lastDate = new Date(lastAction);
    lastDate.setHours(0, 0, 0, 0);
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    return lastDate.getTime() < today.getTime() ? currentStreak + 1 : currentStreak;
  }
  return currentStreak + 1;
}

/**
 * Triggered when a new habit log is created in Firestore.
 * Updates user streak, points, and level.
 */
export const onHabitLog = functions.firestore
  .document(`${COLLECTIONS.HABIT_LOGS}/{logId}`)
  .onCreate(async (snapshot, context) => {
    const logData = snapshot.data();
    const { userId, pointsAwarded } = logData;

    if (!userId || !pointsAwarded) return;

    try {
      const userRef = adminDb.collection(COLLECTIONS.USERS).doc(userId);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        functions.logger.warn(`User ${userId} not found`);
        return;
      }

      const userData = userSnap.data()!;
      const currentStreak: number = userData.currentStreak ?? 0;
      const lastActionAt: admin.firestore.Timestamp | null = userData.lastActionAt ?? null;
      const totalPoints: number = (userData.totalPoints ?? 0) + pointsAwarded;

      const newStreak = updateStreak(currentStreak, lastActionAt);
      const { level, title: levelTitle } = getLevel(totalPoints);

      await userRef.update({
        totalPoints,
        currentStreak: newStreak,
        longestStreak: Math.max(userData.longestStreak ?? 0, newStreak),
        level,
        levelTitle,
        lastActionAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      functions.logger.info(
        `Updated user ${userId}: +${pointsAwarded}pts, streak=${newStreak}, level=${level}`
      );
    } catch (error) {
      functions.logger.error(`Error processing habit log for user ${userId}:`, error);
    }
  });
