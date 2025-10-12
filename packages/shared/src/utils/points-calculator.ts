import { POINT_VALUES } from '../constants/gamification';

export class PointsCalculator {
  /**
   * Calculate base points for a waste type and quantity
   */
  static calculateBasePoints(wasteType: string, quantity: number): number {
    const basePoints = POINT_VALUES[wasteType] || 10;
    return basePoints * quantity;
  }
  
  /**
   * Calculate bonus points based on quantity
   */
  static calculateQuantityBonus(quantity: number): number {
    if (quantity >= 20) return 2.0; // 2x multiplier for 20+ items
    if (quantity >= 10) return 1.5; // 1.5x multiplier for 10+ items
    if (quantity >= 5) return 1.2;  // 1.2x multiplier for 5+ items
    return 1.0; // Base multiplier
  }
  
  /**
   * Calculate streak bonus
   */
  static calculateStreakBonus(streak: number): number {
    if (streak >= 30) return 3.0; // 3x multiplier for 30+ day streak
    if (streak >= 14) return 2.0; // 2x multiplier for 14+ day streak
    if (streak >= 7) return 1.5;  // 1.5x multiplier for 7+ day streak
    if (streak >= 3) return 1.2;  // 1.2x multiplier for 3+ day streak
    return 1.0; // Base multiplier
  }
  
  /**
   * Calculate level bonus
   */
  static calculateLevelBonus(level: number): number {
    if (level >= 10) return 2.0; // 2x multiplier for level 10+
    if (level >= 5) return 1.5;  // 1.5x multiplier for level 5+
    if (level >= 3) return 1.2;  // 1.2x multiplier for level 3+
    return 1.0; // Base multiplier
  }
  
  /**
   * Calculate total points for an action
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
   * Calculate points needed for next level
   */
  static getPointsForNextLevel(currentLevel: number): number {
    return currentLevel * 1000;
  }
  
  /**
   * Calculate points needed for specific level
   */
  static getPointsForLevel(level: number): number {
    return (level - 1) * 1000;
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
    
    return Math.min(100, Math.max(0, (progress / total) * 100));
  }
  
  /**
   * Calculate daily goal points
   */
  static calculateDailyGoal(level: number): number {
    return Math.min(500, 50 + (level * 25)); // Max 500 points per day
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
    return Math.min(100, 25 + (lessonDay * 3)); // Max 100 points per lesson
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
    
    return 50 * (rarityMultipliers[badgeRarity] || 1);
  }
  
  /**
   * Calculate points for maintaining a streak
   */
  static calculateStreakPoints(streak: number): number {
    if (streak >= 365) return 1000; // 1 year streak
    if (streak >= 100) return 500;  // 100 day streak
    if (streak >= 30) return 200;   // 30 day streak
    if (streak >= 7) return 50;     // 7 day streak
    return 0; // No bonus for short streaks
  }
}
