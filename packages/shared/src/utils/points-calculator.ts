import { POINT_VALUES, DAILY_POINTS_CAP, LEVEL_REQUIREMENTS } from '../constants/gamification';

export class PointsCalculator {
  /**
   * Calculate base points for a waste type and quantity
   */
  static calculateBasePoints(wasteType: string, quantity: number): number {
    const basePoints = POINT_VALUES[wasteType] ?? 5;
    return basePoints * quantity;
  }

  /**
   * Apply daily cap — returns how many points can still be awarded given what's already earned today
   */
  static applyDailyCap(rawPoints: number, alreadyEarnedToday: number): number {
    const remaining = Math.max(0, DAILY_POINTS_CAP - alreadyEarnedToday);
    return Math.min(rawPoints, remaining);
  }

  /**
   * Calculate bonus points based on quantity
   */
  static calculateQuantityBonus(quantity: number): number {
    if (quantity >= 20) return 2.0;
    if (quantity >= 10) return 1.5;
    if (quantity >= 5) return 1.2;
    return 1.0;
  }

  /**
   * Calculate streak bonus
   */
  static calculateStreakBonus(streak: number): number {
    if (streak >= 30) return 3.0;
    if (streak >= 14) return 2.0;
    if (streak >= 7) return 1.5;
    if (streak >= 3) return 1.2;
    return 1.0;
  }

  /**
   * Calculate level bonus
   */
  static calculateLevelBonus(level: number): number {
    if (level >= 10) return 2.0;
    if (level >= 5) return 1.5;
    if (level >= 3) return 1.2;
    return 1.0;
  }

  /**
   * Calculate total points for an action (before daily cap)
   */
  static calculateTotalPoints(
    wasteType: string,
    quantity: number,
    streak: number = 0,
    level: number = 1
  ): number {
    const basePoints = this.calculateBasePoints(wasteType, quantity);
    const quantityBonus = this.calculateQuantityBonus(quantity);
    const streakBonus = this.calculateStreakBonus(streak);
    const levelBonus = this.calculateLevelBonus(level);

    const totalMultiplier = quantityBonus * streakBonus * levelBonus;
    return Math.round(basePoints * totalMultiplier);
  }

  /**
   * Calculate total points for an action with daily cap applied
   */
  static calculateTotalPointsWithCap(
    wasteType: string,
    quantity: number,
    streak: number = 0,
    level: number = 1,
    alreadyEarnedToday: number = 0
  ): number {
    const rawPoints = this.calculateTotalPoints(wasteType, quantity, streak, level);
    return this.applyDailyCap(rawPoints, alreadyEarnedToday);
  }

  /**
   * Determine level from total points
   */
  static getLevelFromPoints(totalPoints: number): number {
    let level = 1;
    for (const req of LEVEL_REQUIREMENTS) {
      if (totalPoints >= req.points) {
        level = req.level;
      }
    }
    return level;
  }

  /**
   * Calculate points needed for next level
   */
  static getPointsForNextLevel(currentLevel: number): number {
    const next = LEVEL_REQUIREMENTS.find(r => r.level === currentLevel + 1);
    return next ? next.points : LEVEL_REQUIREMENTS[LEVEL_REQUIREMENTS.length - 1].points;
  }

  /**
   * Calculate points needed for specific level
   */
  static getPointsForLevel(level: number): number {
    const req = LEVEL_REQUIREMENTS.find(r => r.level === level);
    return req ? req.points : 0;
  }

  /**
   * Calculate points remaining to next level
   */
  static getPointsRemainingToNextLevel(currentPoints: number, currentLevel: number): number {
    const pointsNeeded = this.getPointsForNextLevel(currentLevel);
    return Math.max(0, pointsNeeded - currentPoints);
  }

  /**
   * Calculate progress percentage to next level
   */
  static getLevelProgress(currentPoints: number, currentLevel: number): number {
    const pointsForCurrentLevel = this.getPointsForLevel(currentLevel);
    const pointsForNextLevel = this.getPointsForNextLevel(currentLevel);
    const progress = currentPoints - pointsForCurrentLevel;
    const total = pointsForNextLevel - pointsForCurrentLevel;
    if (total <= 0) return 100;
    return Math.min(100, Math.max(0, (progress / total) * 100));
  }

  /**
   * Calculate daily goal points
   */
  static calculateDailyGoal(level: number): number {
    return Math.min(DAILY_POINTS_CAP, 50 + level * 25);
  }

  /**
   * Calculate weekly goal points
   */
  static calculateWeeklyGoal(level: number): number {
    return this.calculateDailyGoal(level) * 7;
  }

  /**
   * Calculate monthly goal points
   */
  static calculateMonthlyGoal(level: number): number {
    return this.calculateDailyGoal(level) * 30;
  }

  /**
   * Calculate points for completing a lesson
   */
  static calculateLessonPoints(lessonDay: number): number {
    return Math.min(100, 25 + lessonDay * 3);
  }

  /**
   * Calculate points for unlocking a badge
   */
  static calculateBadgePoints(badgeRarity: string): number {
    const rarityMultipliers: Record<string, number> = {
      common: 1,
      uncommon: 2,
      rare: 3,
      epic: 5,
      legendary: 10,
    };
    return 50 * (rarityMultipliers[badgeRarity] ?? 1);
  }

  /**
   * Calculate points for maintaining a streak
   */
  static calculateStreakPoints(streak: number): number {
    if (streak >= 365) return 1000;
    if (streak >= 100) return 500;
    if (streak >= 30) return 200;
    if (streak >= 7) return 50;
    return 0;
  }
}
