import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  Timestamp,
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const periodParam = searchParams.get('period') ?? 'all-time';
    const period: Period =
      periodParam === 'weekly' || periodParam === 'monthly' ? periodParam : 'all-time';

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
          displayName: isAnonymous ? 'Anonymous EcoHero' : (data.displayName ?? 'EcoHero'),
          avatar: isAnonymous ? '🌿' : (data.avatar ?? '🌱'),
          points: data.totalPoints ?? 0,
          level: data.level ?? 1,
          streak: data.currentStreak ?? 0,
          badges: (data.badges ?? []).length,
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
      const uid: string = data.userId;
      const pts: number = data.pointsAwarded ?? 0;
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
            displayName: isAnonymous ? 'Anonymous EcoHero' : (data.displayName ?? 'EcoHero'),
            avatar: isAnonymous ? '🌿' : (data.avatar ?? '🌱'),
            points: pts,
            level: data.level ?? 1,
            streak: data.currentStreak ?? 0,
            badges: (data.badges ?? []).length,
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
