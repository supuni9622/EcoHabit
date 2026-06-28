import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';
import { z } from 'zod';

const profileUpdateSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  avatar: z.string().max(10).optional(),
  weeklyGoal: z.number().int().min(1).max(50).optional(),
  preferredWasteTypes: z.array(z.string()).optional(),
  preferences: z
    .object({
      notifications: z
        .object({
          dailyReminder: z.boolean().optional(),
          achievementAlerts: z.boolean().optional(),
          streakAlerts: z.boolean().optional(),
          communityUpdates: z.boolean().optional(),
        })
        .optional(),
      privacy: z
        .object({
          shareProgress: z.boolean().optional(),
          showOnLeaderboard: z.boolean().optional(),
          allowFriendRequests: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
});

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

    const data = userSnap.data();
    // Don't expose sensitive fields
    return NextResponse.json({
      id: userSnap.id,
      displayName: data.displayName,
      avatar: data.avatar,
      level: data.level,
      totalPoints: data.totalPoints,
      currentStreak: data.currentStreak,
      badges: data.badges,
      completedLessons: data.completedLessons,
      weeklyGoal: data.weeklyGoal,
      preferredWasteTypes: data.preferredWasteTypes,
      preferences: data.preferences,
      onboardingCompleted: data.onboardingCompleted,
      createdAt: data.createdAt?.toDate?.()?.toISOString(),
    });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const userId: string = body.userId ?? '';

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const parsed = profileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await updateDoc(userRef, {
      ...parsed.data,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Profile PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
