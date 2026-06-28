import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userSnap.data();

    // Get recent logs
    const logsQuery = query(
      collection(db, 'habitLogs'),
      where('userId', '==', userId),
      orderBy('loggedAt', 'desc'),
      limit(10)
    );
    const logsSnap = await getDocs(logsQuery);
    const recentLogs = logsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      loggedAt: d.data().loggedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    }));

    return NextResponse.json({
      currentStreak: userData.currentStreak ?? 0,
      lastActionAt: userData.lastActionAt?.toDate?.()?.toISOString() ?? null,
      totalPoints: userData.totalPoints ?? 0,
      level: userData.level ?? 1,
      recentLogs,
    });
  } catch (error) {
    console.error('Streak API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
