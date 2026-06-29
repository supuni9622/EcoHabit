import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  Timestamp,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';

type Period = 'all-time' | 'weekly' | 'monthly';

function getPeriodStart(period: Period): Date | null {
  if (period === 'all-time') return null;
  const now = new Date();
  if (period === 'weekly') {
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }
  if (period === 'monthly') {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  return null;
}

async function getUserData(userId: string): Promise<{
  displayName: string;
  avatar: string;
  level: number;
  streak: number;
  badges: number;
  isAnonymous: boolean;
  totalPoints: number;
} | null> {
  try {
    const userSnap = await getDoc(doc(db, 'users', userId));
    if (!userSnap.exists()) return null;
    const data = userSnap.data();
    const isAnonymous = data.preferences?.privacy?.showOnLeaderboard === false;
    return {
      displayName: isAnonymous ? 'Anonymous EcoHero' : (data.displayName as string ?? 'EcoHero'),
      avatar: isAnonymous ? '🌿' : (data.avatar as string ?? '🌱'),
      level: data.level as number ?? 1,
      streak: data.currentStreak as number ?? 0,
      badges: (data.badges as string[] ?? []).length,
      isAnonymous,
      totalPoints: data.totalPoints as number ?? 0,
    };
  } catch {
    return null;
  }
}

async function getFriendIds(userId: string): Promise<string[]> {
  const friendshipsQuery = query(
    collection(db, 'friendships'),
    where('userIds', 'array-contains', userId),
    where('status', '==', 'accepted')
  );
  const snap = await getDocs(friendshipsQuery);
  const friendIds: string[] = [];
  for (const d of snap.docs) {
    const data = d.data();
    const userIds: string[] = data.userIds ?? [];
    const friendId = userIds.find((id) => id !== userId);
    if (friendId) friendIds.push(friendId);
  }
  return friendIds;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const periodParam = searchParams.get('period') ?? 'all-time';
    const friendsOnly = searchParams.get('friendsOnly') === 'true';
    const period: Period =
      periodParam === 'weekly' || periodParam === 'monthly' ? periodParam : 'all-time';

    // Friends-only leaderboard
    if (friendsOnly && userId) {
      const friendIds = await getFriendIds(userId);

      if (friendIds.length === 0) {
        return NextResponse.json({ entries: [], userRank: null, total: 0, period, friendsOnly: true });
      }

      // Fetch friend user data and sort by totalPoints
      const friendDataResults = await Promise.all(friendIds.map((fid) => getUserData(fid)));

      const friendEntries = friendDataResults
        .filter((d) => d !== null)
        .map((d, i) => ({ ...d!, userId: friendIds[i]! }))
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .map((d, i) => ({
          rank: i + 1,
          userId: d.userId,
          displayName: d.displayName,
          avatar: d.avatar,
          points: d.totalPoints,
          level: d.level,
          streak: d.streak,
          badges: d.badges,
          isAnonymous: d.isAnonymous,
        }));

      let userRank: number | null = null;
      if (userId) {
        const currentUserData = await getUserData(userId);
        if (currentUserData) {
          const allEntries = [
            ...friendEntries,
            {
              rank: 0,
              userId,
              displayName: currentUserData.displayName,
              avatar: currentUserData.avatar,
              points: currentUserData.totalPoints,
              level: currentUserData.level,
              streak: currentUserData.streak,
              badges: currentUserData.badges,
              isAnonymous: currentUserData.isAnonymous,
            },
          ].sort((a, b) => b.points - a.points)
            .map((e, i) => ({ ...e, rank: i + 1 }));

          const userPos = allEntries.findIndex((e) => e.userId === userId);
          userRank = userPos >= 0 ? allEntries[userPos]!.rank : null;

          // Return only friend entries (not current user in the list unless also a friend)
          return NextResponse.json({
            entries: friendEntries,
            userRank,
            total: friendEntries.length,
            period,
            friendsOnly: true,
          });
        }
      }

      return NextResponse.json({
        entries: friendEntries,
        userRank,
        total: friendEntries.length,
        period,
        friendsOnly: true,
      });
    }

    if (period === 'all-time') {
      // Simple all-time leaderboard from users collection
      const q = query(
        collection(db, 'users'),
        orderBy('totalPoints', 'desc'),
        limit(20)
      );
      const snap = await getDocs(q);
      const entries = snap.docs.map((d, i) => {
        const data = d.data();
        const isAnonymous = data.preferences?.privacy?.showOnLeaderboard === false;
        return {
          rank: i + 1,
          userId: d.id,
          displayName: isAnonymous ? 'Anonymous EcoHero' : (data.displayName as string ?? 'EcoHero'),
          avatar: isAnonymous ? '🌿' : (data.avatar as string ?? '🌱'),
          points: data.totalPoints as number ?? 0,
          level: data.level as number ?? 1,
          streak: data.currentStreak as number ?? 0,
          badges: (data.badges as string[] ?? []).length,
          isAnonymous,
        };
      });

      let userRank: number | null = null;
      if (userId) {
        const userPos = snap.docs.findIndex((d) => d.id === userId);
        userRank = userPos >= 0 ? userPos + 1 : null;
      }

      return NextResponse.json({ entries, userRank, total: entries.length, period });
    }

    // Period-based leaderboard: sum points from habitLogs within the period
    const periodStart = getPeriodStart(period);
    if (!periodStart) {
      return NextResponse.json({ error: 'Invalid period' }, { status: 400 });
    }

    const logsQuery = query(
      collection(db, 'habitLogs'),
      where('loggedAt', '>=', Timestamp.fromDate(periodStart))
    );
    const logsSnap = await getDocs(logsQuery);

    // Aggregate points per user
    const pointsByUser = new Map<string, number>();
    for (const d of logsSnap.docs) {
      const data = d.data();
      const uid: string = data.userId as string;
      const pts: number = data.pointsAwarded as number ?? 0;
      pointsByUser.set(uid, (pointsByUser.get(uid) ?? 0) + pts);
    }

    // Sort by points descending, take top 20
    const sorted = Array.from(pointsByUser.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    // Fetch user details for top 20
    const entries = await Promise.all(
      sorted.map(async ([uid, pts], i) => {
        try {
          const userSnap = await getDocs(
            query(collection(db, 'users'), where('__name__', '==', uid))
          );
          if (userSnap.empty) {
            return {
              rank: i + 1,
              userId: uid,
              displayName: 'Anonymous EcoHero',
              avatar: '🌿',
              points: pts,
              level: 1,
              streak: 0,
              badges: 0,
              isAnonymous: true,
            };
          }
          const data = userSnap.docs[0]!.data();
          const isAnonymous = data.preferences?.privacy?.showOnLeaderboard === false;
          return {
            rank: i + 1,
            userId: uid,
            displayName: isAnonymous ? 'Anonymous EcoHero' : (data.displayName as string ?? 'EcoHero'),
            avatar: isAnonymous ? '🌿' : (data.avatar as string ?? '🌱'),
            points: pts,
            level: data.level as number ?? 1,
            streak: data.currentStreak as number ?? 0,
            badges: (data.badges as string[] ?? []).length,
            isAnonymous,
          };
        } catch {
          return {
            rank: i + 1,
            userId: uid,
            displayName: 'EcoHero',
            avatar: '🌱',
            points: pts,
            level: 1,
            streak: 0,
            badges: 0,
            isAnonymous: false,
          };
        }
      })
    );

    let userRank: number | null = null;
    if (userId) {
      const pos = entries.findIndex((e) => e.userId === userId);
      if (pos >= 0) {
        userRank = pos + 1;
      } else if (pointsByUser.has(userId)) {
        // User has logs in period but outside top 20 — find rank
        const allSorted = Array.from(pointsByUser.entries()).sort((a, b) => b[1] - a[1]);
        const userIdx = allSorted.findIndex(([uid]) => uid === userId);
        userRank = userIdx >= 0 ? userIdx + 1 : null;
      }
    }

    return NextResponse.json({ entries, userRank, total: entries.length, period });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
