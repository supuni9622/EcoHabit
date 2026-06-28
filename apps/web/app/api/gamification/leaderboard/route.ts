import { NextRequest, NextResponse } from 'next/server';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const q = query(
      collection(db, 'users'),
      orderBy('totalPoints', 'desc'),
      limit(20)
    );

    const snap = await getDocs(q);
    const entries = snap.docs.map((d, i) => {
      const data = d.data();
      return {
        rank: i + 1,
        userId: d.id,
        displayName: data.displayName ?? 'EcoHero',
        avatar: data.avatar ?? '🌱',
        points: data.totalPoints ?? 0,
        level: data.level ?? 1,
        streak: data.currentStreak ?? 0,
        badges: (data.badges ?? []).length,
      };
    });

    let userRank = null;
    if (userId) {
      const userPos = entries.findIndex((e) => e.userId === userId);
      userRank = userPos >= 0 ? userPos + 1 : null;
    }

    return NextResponse.json({ entries, userRank, total: entries.length });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
