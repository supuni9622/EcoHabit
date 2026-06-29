import { describe, it, expect } from 'vitest';
import { StreakManager } from '../utils/streak-manager';
import type { User } from '../types';

function makeUser(logDates: string[]): User {
  return {
    id: 'test-user',
    email: 'test@example.com',
    displayName: 'Tester',
    avatar: '🌱',
    totalPoints: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    badges: [],
    completedLessons: [],
    createdAt: new Date().toISOString(),
    habits: logDates.map((date, i) => ({
      id: `log-${i}`,
      userId: 'test-user',
      wasteType: 'plastic',
      quantity: 1,
      pointsAwarded: 10,
      loggedAt: date,
      notes: '',
    })),
  } as unknown as User;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

describe('StreakManager.calculateCurrentStreak', () => {
  it('returns 0 for user with no habits', () => {
    expect(StreakManager.calculateCurrentStreak(makeUser([]))).toBe(0);
  });

  it('returns 1 for a single log today', () => {
    expect(StreakManager.calculateCurrentStreak(makeUser([daysAgo(0)]))).toBe(1);
  });

  it('counts consecutive days correctly', () => {
    const user = makeUser([daysAgo(0), daysAgo(1), daysAgo(2)]);
    expect(StreakManager.calculateCurrentStreak(user)).toBe(3);
  });

  it('stops counting at a gap', () => {
    // Logged today and 2 days ago — 1-day gap breaks the streak
    const user = makeUser([daysAgo(0), daysAgo(2)]);
    expect(StreakManager.calculateCurrentStreak(user)).toBe(1);
  });

  it('returns 0 when last log was more than 1 day ago', () => {
    const user = makeUser([daysAgo(2), daysAgo(3)]);
    expect(StreakManager.calculateCurrentStreak(user)).toBe(0);
  });
});

describe('StreakManager.hasLoggedToday', () => {
  it('returns false for empty habits', () => {
    expect(StreakManager.hasLoggedToday(makeUser([]))).toBe(false);
  });

  it('returns true when there is a log today', () => {
    expect(StreakManager.hasLoggedToday(makeUser([daysAgo(0)]))).toBe(true);
  });

  it('returns false when last log was yesterday', () => {
    expect(StreakManager.hasLoggedToday(makeUser([daysAgo(1)]))).toBe(false);
  });
});

describe('StreakManager.calculateLongestStreak', () => {
  it('returns 0 for no habits', () => {
    expect(StreakManager.calculateLongestStreak(makeUser([]))).toBe(0);
  });

  it('returns the longer of two separate streaks', () => {
    // 3-day streak then a gap, then a 1-day entry
    const user = makeUser([daysAgo(0), daysAgo(5), daysAgo(6), daysAgo(7)]);
    expect(StreakManager.calculateLongestStreak(user)).toBe(3);
  });

  it('counts a single day as a streak of 1', () => {
    expect(StreakManager.calculateLongestStreak(makeUser([daysAgo(0)]))).toBe(1);
  });
});

describe('StreakManager.getNextStreakMilestone', () => {
  it('returns the 3-day milestone when streak is 0', () => {
    const milestone = StreakManager.getNextStreakMilestone(0);
    expect(milestone?.days).toBe(3);
  });

  it('returns the 7-day milestone when streak is 3', () => {
    const milestone = StreakManager.getNextStreakMilestone(3);
    expect(milestone?.days).toBe(7);
  });

  it('returns null when streak exceeds all milestones', () => {
    expect(StreakManager.getNextStreakMilestone(365)).toBeNull();
  });
});

describe('StreakManager.calculateStreakBonus', () => {
  it('returns 0 for streaks under 7', () => {
    expect(StreakManager.calculateStreakBonus(6)).toBe(0);
  });

  it('returns 50 for a 7-day streak', () => {
    expect(StreakManager.calculateStreakBonus(7)).toBe(50);
  });

  it('returns 1000 for a 365-day streak', () => {
    expect(StreakManager.calculateStreakBonus(365)).toBe(1000);
  });
});
