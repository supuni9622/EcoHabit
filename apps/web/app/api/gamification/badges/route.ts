import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';
import { BADGE_REQUIREMENTS } from '@ecohabit/shared';

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
    const unlockedIds: string[] = userData.badges ?? [];

    const badges = BADGE_REQUIREMENTS.map((badge) => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      rarity: badge.rarity,
      unlocked: unlockedIds.includes(badge.id),
      requirements: badge.requirements,
      rewards: badge.rewards,
    }));

    return NextResponse.json({ badges, unlockedCount: unlockedIds.length });
  } catch (error) {
    console.error('Badges API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
