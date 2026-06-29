import { describe, it, expect } from 'vitest';
import { PointsCalculator } from '../utils/points-calculator';
import { DAILY_POINTS_CAP } from '../constants/gamification';

describe('PointsCalculator.calculateBasePoints', () => {
  it('returns correct points for known waste types', () => {
    expect(PointsCalculator.calculateBasePoints('plastic', 1)).toBe(10);
    expect(PointsCalculator.calculateBasePoints('paper', 1)).toBe(8);
    expect(PointsCalculator.calculateBasePoints('e-waste', 1)).toBe(20);
    expect(PointsCalculator.calculateBasePoints('organic', 1)).toBe(5);
    expect(PointsCalculator.calculateBasePoints('glass', 1)).toBe(12);
    expect(PointsCalculator.calculateBasePoints('metal', 1)).toBe(14);
    expect(PointsCalculator.calculateBasePoints('general', 1)).toBe(5);
  });

  it('scales linearly with quantity', () => {
    expect(PointsCalculator.calculateBasePoints('plastic', 3)).toBe(30);
    expect(PointsCalculator.calculateBasePoints('e-waste', 5)).toBe(100);
  });

  it('defaults to 5 pts for unknown waste type', () => {
    expect(PointsCalculator.calculateBasePoints('unknown', 2)).toBe(10);
  });
});

describe('PointsCalculator.applyDailyCap', () => {
  it('returns raw points when well under daily cap', () => {
    expect(PointsCalculator.applyDailyCap(100, 0)).toBe(100);
    expect(PointsCalculator.applyDailyCap(50, 200)).toBe(50);
  });

  it('clamps to remaining cap', () => {
    expect(PointsCalculator.applyDailyCap(200, 400)).toBe(100); // 500 - 400 = 100 remaining
    expect(PointsCalculator.applyDailyCap(200, 490)).toBe(10);
  });

  it('returns 0 when daily cap is already reached', () => {
    expect(PointsCalculator.applyDailyCap(100, DAILY_POINTS_CAP)).toBe(0);
    expect(PointsCalculator.applyDailyCap(100, DAILY_POINTS_CAP + 50)).toBe(0);
  });
});

describe('PointsCalculator.calculateQuantityBonus', () => {
  it('returns 1.0 for quantities below 5', () => {
    expect(PointsCalculator.calculateQuantityBonus(1)).toBe(1.0);
    expect(PointsCalculator.calculateQuantityBonus(4)).toBe(1.0);
  });

  it('returns 1.2 for 5–9 items', () => {
    expect(PointsCalculator.calculateQuantityBonus(5)).toBe(1.2);
    expect(PointsCalculator.calculateQuantityBonus(9)).toBe(1.2);
  });

  it('returns 1.5 for 10–19 items', () => {
    expect(PointsCalculator.calculateQuantityBonus(10)).toBe(1.5);
    expect(PointsCalculator.calculateQuantityBonus(19)).toBe(1.5);
  });

  it('returns 2.0 for 20+ items', () => {
    expect(PointsCalculator.calculateQuantityBonus(20)).toBe(2.0);
    expect(PointsCalculator.calculateQuantityBonus(100)).toBe(2.0);
  });
});

describe('PointsCalculator.calculateStreakBonus', () => {
  it('returns 1.0 for streaks below 3', () => {
    expect(PointsCalculator.calculateStreakBonus(0)).toBe(1.0);
    expect(PointsCalculator.calculateStreakBonus(2)).toBe(1.0);
  });

  it('returns 1.2 for streaks 3–6', () => {
    expect(PointsCalculator.calculateStreakBonus(3)).toBe(1.2);
    expect(PointsCalculator.calculateStreakBonus(6)).toBe(1.2);
  });

  it('returns 1.5 for streaks 7–13', () => {
    expect(PointsCalculator.calculateStreakBonus(7)).toBe(1.5);
    expect(PointsCalculator.calculateStreakBonus(13)).toBe(1.5);
  });

  it('returns 2.0 for streaks 14–29', () => {
    expect(PointsCalculator.calculateStreakBonus(14)).toBe(2.0);
    expect(PointsCalculator.calculateStreakBonus(29)).toBe(2.0);
  });

  it('returns 3.0 for streaks 30+', () => {
    expect(PointsCalculator.calculateStreakBonus(30)).toBe(3.0);
    expect(PointsCalculator.calculateStreakBonus(365)).toBe(3.0);
  });
});

describe('PointsCalculator.calculateTotalPoints', () => {
  it('applies all multipliers correctly', () => {
    // plastic(10) × qty=1 → base=10, quantityBonus=1.0, streakBonus=1.0, levelBonus=1.0
    expect(PointsCalculator.calculateTotalPoints('plastic', 1, 0, 1)).toBe(10);
    // plastic(10) × qty=10 → base=100, quantityBonus=1.5, streakBonus=1.0, levelBonus=1.0
    expect(PointsCalculator.calculateTotalPoints('plastic', 10, 0, 1)).toBe(150);
  });

  it('stacks streak and quantity bonuses multiplicatively', () => {
    // e-waste(20) × qty=20 → base=400, qty=2.0, streak=7→1.5, level=1→1.0 → 1200
    expect(PointsCalculator.calculateTotalPoints('e-waste', 20, 7, 1)).toBe(1200);
  });

  it('defaults to streak=0 and level=1', () => {
    expect(PointsCalculator.calculateTotalPoints('paper', 1)).toBe(8);
  });
});

describe('PointsCalculator.getLevelFromPoints', () => {
  it('returns level 1 at 0 points', () => {
    expect(PointsCalculator.getLevelFromPoints(0)).toBe(1);
  });

  it('returns level 2 at 500 points', () => {
    expect(PointsCalculator.getLevelFromPoints(500)).toBe(2);
    expect(PointsCalculator.getLevelFromPoints(1499)).toBe(2);
  });

  it('returns level 3 at 1500 points', () => {
    expect(PointsCalculator.getLevelFromPoints(1500)).toBe(3);
  });

  it('returns level 10 at 100000 points', () => {
    expect(PointsCalculator.getLevelFromPoints(100000)).toBe(10);
    expect(PointsCalculator.getLevelFromPoints(999999)).toBe(10);
  });
});

describe('PointsCalculator.getLevelProgress', () => {
  it('returns 0 at the start of a level', () => {
    expect(PointsCalculator.getLevelProgress(500, 2)).toBe(0); // 500 is the floor for level 2
  });

  it('returns 100 at max level', () => {
    expect(PointsCalculator.getLevelProgress(999999, 10)).toBe(100);
  });

  it('returns correct midpoint progress', () => {
    // Level 1: 0–500, midpoint at 250 → 50%
    expect(PointsCalculator.getLevelProgress(250, 1)).toBe(50);
  });
});

describe('PointsCalculator.calculateLessonPoints', () => {
  it('awards more points for later lessons', () => {
    const day1 = PointsCalculator.calculateLessonPoints(1);
    const day25 = PointsCalculator.calculateLessonPoints(25);
    expect(day25).toBeGreaterThan(day1);
  });

  it('caps at 100 for high day numbers', () => {
    expect(PointsCalculator.calculateLessonPoints(25)).toBeLessThanOrEqual(100);
  });
});

describe('PointsCalculator.calculateBadgePoints', () => {
  it('returns 50 for common badges', () => {
    expect(PointsCalculator.calculateBadgePoints('common')).toBe(50);
  });

  it('returns progressively more for higher rarities', () => {
    const common = PointsCalculator.calculateBadgePoints('common');
    const rare = PointsCalculator.calculateBadgePoints('rare');
    const legendary = PointsCalculator.calculateBadgePoints('legendary');
    expect(rare).toBeGreaterThan(common);
    expect(legendary).toBeGreaterThan(rare);
  });
});
