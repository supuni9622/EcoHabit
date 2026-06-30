import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { adminDb, COLLECTIONS } from '../utils/firebase-admin';

interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatar: string;
  totalPoints: number;
  level: number;
  currentStreak: number;
  badgeCount: number;
  isAnonymous: boolean;
  updatedAt: admin.firestore.FieldValue;
}

async function computeLeaderboard(
  period: 'all-time' | 'weekly' | 'monthly',
  periodStart: Date | null
): Promise<void> {
  const db = adminDb;

  // For all-time: read directly from users sorted by totalPoints
  if (period === 'all-time') {
    const snapshot = await db
      .collection(COLLECTIONS.USERS)
      .orderBy('totalPoints', 'desc')
      .limit(100)
      .get();

    const batch = db.batch();

    snapshot.docs.forEach((userDoc, i) => {
      const data = userDoc.data();
      const isAnonymous = data.preferences?.privacy?.showOnLeaderboard === false;
      const entry: LeaderboardEntry = {
        userId: userDoc.id,
        displayName: isAnonymous ? 'Anonymous EcoHero' : (data.displayName as string ?? 'EcoHero'),
        avatar: isAnonymous ? '🌿' : (data.avatar as string ?? '🌱'),
        totalPoints: data.totalPoints as number ?? 0,
        level: data.level as number ?? 1,
        currentStreak: data.currentStreak as number ?? 0,
        badgeCount: (data.badges as string[] ?? []).length,
        isAnonymous,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      const ref = db.collection('leaderboard').doc(`all-time_${String(i + 1).padStart(3, '0')}`);
      batch.set(ref, { ...entry, rank: i + 1, period: 'all-time' });
    });

    await batch.commit();
    functions.logger.info(`Leaderboard updated: all-time (${snapshot.size} entries)`);
    return;
  }

  // For weekly/monthly: aggregate habitLogs by userId since periodStart
  const logsQuery = db
    .collection(COLLECTIONS.HABIT_LOGS)
    .where('loggedAt', '>=', periodStart!.toISOString());

  const logsSnap = await logsQuery.get();

  // Sum points per user
  const pointsByUser = new Map<string, number>();
  for (const logDoc of logsSnap.docs) {
    const data = logDoc.data();
    const uid = data.userId as string;
    const pts = data.pointsAwarded as number ?? 0;
    pointsByUser.set(uid, (pointsByUser.get(uid) ?? 0) + pts);
  }

  // Sort descending and take top 100
  const sorted = Array.from(pointsByUser.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100);

  if (sorted.length === 0) {
    functions.logger.info(`Leaderboard: no ${period} data yet`);
    return;
  }

  // Fetch user profiles in batches of 10 (Firestore 'in' limit)
  const userIds = sorted.map(([uid]) => uid);
  const userDataMap = new Map<string, admin.firestore.DocumentData>();

  for (let i = 0; i < userIds.length; i += 10) {
    const chunk = userIds.slice(i, i + 10);
    const usersSnap = await db
      .collection(COLLECTIONS.USERS)
      .where(admin.firestore.FieldPath.documentId(), 'in', chunk)
      .get();
    usersSnap.docs.forEach((d) => userDataMap.set(d.id, d.data()));
  }

  const batch = db.batch();

  sorted.forEach(([userId, points], i) => {
    const data = userDataMap.get(userId);
    const isAnonymous = data?.preferences?.privacy?.showOnLeaderboard === false;
    const entry: LeaderboardEntry & { rank: number; period: string; points: number } = {
      userId,
      displayName: isAnonymous ? 'Anonymous EcoHero' : (data?.displayName as string ?? 'EcoHero'),
      avatar: isAnonymous ? '🌿' : (data?.avatar as string ?? '🌱'),
      totalPoints: data?.totalPoints as number ?? points,
      level: data?.level as number ?? 1,
      currentStreak: data?.currentStreak as number ?? 0,
      badgeCount: (data?.badges as string[] ?? []).length,
      isAnonymous,
      rank: i + 1,
      period,
      points,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const ref = db
      .collection('leaderboard')
      .doc(`${period}_${String(i + 1).padStart(3, '0')}`);
    batch.set(ref, entry);
  });

  await batch.commit();
  functions.logger.info(`Leaderboard updated: ${period} (${sorted.length} entries)`);
}

/**
 * Runs every hour to refresh all-time, weekly, and monthly leaderboard caches.
 * Writes to the `leaderboard` collection so the web app can read rankings
 * without expensive real-time aggregation queries.
 */
export const updateLeaderboard = functions.pubsub
  .schedule('0 * * * *') // every hour on the hour
  .timeZone('Asia/Colombo')
  .onRun(async () => {
    const now = new Date();

    const weekStart = new Date(now);
    const dayOfWeek = weekStart.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    weekStart.setDate(now.getDate() + diff);
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    await Promise.all([
      computeLeaderboard('all-time', null),
      computeLeaderboard('weekly', weekStart),
      computeLeaderboard('monthly', monthStart),
    ]);
  });
