import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';
import {
  calculateLevel,
  calculateEnvironmentalImpact,
  checkBadgeUnlocks,
  updateUserBadges,
} from '../../../../lib/services/gamification';

const DAILY_POINTS_CAP = 500;

const POINT_VALUES: Record<string, number> = {
  plastic: 10,
  paper: 8,
  'e-waste': 20,
  organic: 5,
  glass: 12,
  metal: 14,
  textile: 6,
  general: 5,
  other: 5,
};

const logSchema = z.object({
  wasteType: z.enum(['plastic', 'paper', 'e-waste', 'organic', 'glass', 'metal', 'textile', 'general', 'other']),
  quantity: z.number().int().min(1).max(100),
  notes: z.string().max(200).optional(),
  photoUrl: z.string().url().optional(),
});

async function getTodayPoints(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const q = query(
    collection(db, 'habitLogs'),
    where('userId', '==', userId),
    where('loggedAt', '>=', Timestamp.fromDate(today))
  );
  const snap = await getDocs(q);
  return snap.docs.reduce((sum, d) => sum + (d.data().pointsAwarded ?? 0), 0);
}

async function getUserTotalActions(userId: string): Promise<number> {
  const q = query(collection(db, 'habitLogs'), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.size;
}

/** Return the Monday 00:00:00 for the given date in local time */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function updateStreak(userId: string): Promise<number> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return 0;

  const userData = userSnap.data();
  const lastActionAt: Date | null = userData.lastActionAt?.toDate?.() ?? null;
  const currentStreak: number = userData.currentStreak ?? 0;
  const weeklyMissedDays: number = userData.weeklyMissedDays ?? 0;
  const weekStartAt: Date | null = userData.weekStartAt?.toDate?.() ?? null;
  const now = new Date();

  let newStreak = currentStreak;
  let newWeeklyMissedDays = weeklyMissedDays;

  // Reset weekly missed days counter at the start of a new week
  const currentWeekStart = getWeekStart(now);
  const lastWeekStart = weekStartAt ? getWeekStart(weekStartAt) : null;
  const isNewWeek = !lastWeekStart || lastWeekStart.getTime() < currentWeekStart.getTime();
  if (isNewWeek) {
    newWeeklyMissedDays = 0;
  }

  if (!lastActionAt) {
    newStreak = 1;
  } else {
    const hoursSinceLast =
      (now.getTime() - lastActionAt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLast > 48) {
      // Gap too large — streak always resets regardless of grace
      newStreak = 1;
      newWeeklyMissedDays = isNewWeek ? 0 : weeklyMissedDays;
    } else if (hoursSinceLast < 24) {
      // Same calendar day or within 24h — check if it's actually a new calendar day
      const lastDate = new Date(lastActionAt);
      lastDate.setHours(0, 0, 0, 0);
      const todayDate = new Date(now);
      todayDate.setHours(0, 0, 0, 0);
      if (lastDate.getTime() < todayDate.getTime()) {
        // New calendar day within 24h
        newStreak = currentStreak + 1;
      }
      // else same calendar day: no streak increment needed
    } else {
      // 24-48h gap: exactly one missed day — apply weekly grace if available
      const daysMissed = Math.floor(hoursSinceLast / 24) - 1;
      if (daysMissed >= 1 && newWeeklyMissedDays < 1) {
        // Use grace: keep streak, charge the missed day counter
        newWeeklyMissedDays = isNewWeek ? 1 : weeklyMissedDays + 1;
        newStreak = currentStreak + 1;
      } else {
        // Grace exhausted or more than one day missed — increment normally
        newStreak = currentStreak + 1;
      }
    }
  }

  await updateDoc(userRef, {
    currentStreak: newStreak,
    lastActionAt: serverTimestamp(),
    weeklyMissedDays: newWeeklyMissedDays,
    weekStartAt: Timestamp.fromDate(currentWeekStart),
  });

  return newStreak;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = logSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const userId: string = body.userId ?? '';
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { wasteType, quantity, notes, photoUrl } = parsed.data;

    // Calculate points with daily cap
    const basePoints = (POINT_VALUES[wasteType] ?? 5) * quantity;
    const alreadyEarned = await getTodayPoints(userId);
    const remaining = Math.max(0, DAILY_POINTS_CAP - alreadyEarned);
    const pointsEarned = Math.min(basePoints, remaining);

    // Calculate environmental impact
    const { co2Saved, waterSaved } = calculateEnvironmentalImpact(wasteType, quantity);

    // Save habit log
    const logData: Record<string, unknown> = {
      userId,
      wasteType,
      quantity,
      pointsAwarded: pointsEarned,
      notes: notes ?? '',
      co2Saved,
      waterSaved,
      loggedAt: serverTimestamp(),
    };
    if (photoUrl) {
      logData.photoUrl = photoUrl;
    }

    const docRef = await addDoc(collection(db, 'habitLogs'), logData);

    // Update user points and level
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userSnap.data();
    const newTotal = (userData.totalPoints ?? 0) + pointsEarned;
    const { level } = calculateLevel(newTotal);

    // Update streak
    const newStreak = await updateStreak(userId);

    // Check badge unlocks
    const totalActions = await getUserTotalActions(userId);
    const currentBadges: string[] = userData.badges ?? [];
    const newBadges = checkBadgeUnlocks(currentBadges, newTotal, newStreak, totalActions);
    const newBadgeIds = newBadges.map((b) => b.badgeId);

    let badgeBonusPoints = 0;
    if (newBadgeIds.length > 0) {
      await updateUserBadges(userId, newBadgeIds);
      badgeBonusPoints = newBadges.reduce((sum, b) => sum + b.bonusPoints, 0);
    }

    await updateDoc(userRef, {
      totalPoints: newTotal + badgeBonusPoints,
      level,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      logId: docRef.id,
      pointsEarned,
      badgeBonusPoints,
      newBadges: newBadges.map((b) => ({ id: b.badgeId, name: b.name, icon: b.icon })),
      newStreak,
      totalPoints: newTotal + badgeBonusPoints,
      co2Saved,
      waterSaved,
      capped: pointsEarned < basePoints,
    });
  } catch (error) {
    console.error('Habit log error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
