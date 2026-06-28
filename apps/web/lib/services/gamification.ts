import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { LEVEL_REQUIREMENTS, BADGE_REQUIREMENTS } from '@ecohabit/shared';

const DAILY_POINTS_CAP = 500;

export interface BadgeUnlockResult {
  badgeId: string;
  name: string;
  icon: string;
  rarity: string;
  bonusPoints: number;
}

export function calculateLevel(totalPoints: number): { level: number; title: string } {
  let level = 1;
  let title = 'Eco Beginner';
  for (const req of LEVEL_REQUIREMENTS) {
    if (totalPoints >= req.points) {
      level = req.level;
      title = req.title;
    }
  }
  return { level, title };
}

export function calculateLevelProgress(
  totalPoints: number,
  currentLevel: number
): { progress: number; pointsToNext: number } {
  const current = LEVEL_REQUIREMENTS.find((r) => r.level === currentLevel);
  const next = LEVEL_REQUIREMENTS.find((r) => r.level === currentLevel + 1);
  if (!next) return { progress: 100, pointsToNext: 0 };
  const currentLevelPoints = current?.points ?? 0;
  const range = next.points - currentLevelPoints;
  const progress = totalPoints - currentLevelPoints;
  return {
    progress: Math.min(100, Math.max(0, (progress / range) * 100)),
    pointsToNext: Math.max(0, next.points - totalPoints),
  };
}

export function checkBadgeUnlocks(
  unlockedBadges: string[],
  totalPoints: number,
  streak: number,
  totalActions: number
): BadgeUnlockResult[] {
  const newBadges: BadgeUnlockResult[] = [];

  for (const badge of BADGE_REQUIREMENTS) {
    if (unlockedBadges.includes(badge.id)) continue;

    const { requirements, rewards } = badge;
    let unlocked = true;

    if (requirements.points !== undefined && totalPoints < requirements.points) {
      unlocked = false;
    }
    if (requirements.streak !== undefined && streak < requirements.streak) {
      unlocked = false;
    }
    if (requirements.actions !== undefined && totalActions < requirements.actions) {
      unlocked = false;
    }

    if (unlocked) {
      newBadges.push({
        badgeId: badge.id,
        name: badge.name,
        icon: badge.icon,
        rarity: badge.rarity,
        bonusPoints: rewards.points,
      });
    }
  }

  return newBadges;
}

export async function awardPoints(
  userId: string,
  points: number,
  alreadyEarnedToday: number
): Promise<{ awarded: number; capped: boolean }> {
  const remaining = Math.max(0, DAILY_POINTS_CAP - alreadyEarnedToday);
  const awarded = Math.min(points, remaining);
  const capped = awarded < points;

  if (awarded > 0) {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const newTotal = (userData.totalPoints ?? 0) + awarded;
      const { level, title } = calculateLevel(newTotal);
      await updateDoc(userRef, {
        totalPoints: newTotal,
        level,
        updatedAt: serverTimestamp(),
      });
    }
  }

  return { awarded, capped };
}

export async function updateUserBadges(
  userId: string,
  newBadgeIds: string[]
): Promise<void> {
  if (newBadgeIds.length === 0) return;
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const existing: string[] = userSnap.data().badges ?? [];
    const merged = Array.from(new Set([...existing, ...newBadgeIds]));
    await updateDoc(userRef, {
      badges: merged,
      updatedAt: serverTimestamp(),
    });
  }
}

export function calculateEnvironmentalImpact(
  wasteType: string,
  quantity: number
): { co2Saved: number; waterSaved: number } {
  const factors: Record<string, { co2: number; water: number }> = {
    plastic: { co2: 0.5, water: 0.2 },
    paper: { co2: 0.3, water: 0.15 },
    'e-waste': { co2: 2.0, water: 0.5 },
    organic: { co2: 0.2, water: 0.1 },
    glass: { co2: 0.4, water: 0.18 },
    metal: { co2: 0.8, water: 0.3 },
    textile: { co2: 0.6, water: 0.25 },
    general: { co2: 0.3, water: 0.12 },
    other: { co2: 0.3, water: 0.12 },
  };

  const factor = factors[wasteType] ?? { co2: 0.3, water: 0.12 };
  return {
    co2Saved: Math.round(factor.co2 * quantity * 100) / 100,
    waterSaved: Math.round(factor.water * quantity * 1000) / 1000,
  };
}
