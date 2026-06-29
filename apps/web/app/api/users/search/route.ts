import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') ?? '';
    const userId = searchParams.get('userId') ?? '';

    if (q.trim().length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        { status: 400 }
      );
    }

    const searchTerm = q.trim();
    const endTerm = searchTerm + '';

    const usersQuery = query(
      collection(db, 'users'),
      where('displayName', '>=', searchTerm),
      where('displayName', '<=', endTerm),
      limit(10)
    );

    const snap = await getDocs(usersQuery);

    const users = snap.docs
      .filter((d) => d.id !== userId)
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          displayName: data.displayName as string ?? 'EcoHero',
          avatar: data.avatar as string ?? '🌱',
          level: data.level as number ?? 1,
          totalPoints: data.totalPoints as number ?? 0,
        };
      });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('User search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
