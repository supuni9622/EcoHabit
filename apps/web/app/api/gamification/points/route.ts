import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';
import { calculateLevel, calculateLevelProgress } from '../../../../lib/services/gamification';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const userSnap = await getDoc(doc(db, 'users', userId));
    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userSnap.data();
    const totalPoints: number = userData.totalPoints ?? 0;
    const { level, title } = calculateLevel(totalPoints);
    const { progress, pointsToNext } = calculateLevelProgress(totalPoints, level);

    return NextResponse.json({
      totalPoints,
      level,
      levelTitle: title,
      levelProgress: progress,
      pointsToNextLevel: pointsToNext,
    });
  } catch (error) {
    console.error('Points API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
