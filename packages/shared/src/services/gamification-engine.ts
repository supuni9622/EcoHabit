import { User, HabitLog, Badge, LeaderboardEntry } from '../types';
import { POINT_VALUES, BADGE_REQUIREMENTS } from '../constants/gamification';

export class GamificationEngine {
  /**
   * Calculate points for a habit action
   */
  static calculatePoints(wasteType: string, quantity: number): number {
    const basePoints = POINT_VALUES[wasteType] || 10;
    const multiplier = this.getQuantityMultiplier(quantity);
    return Math.round(basePoints * quantity * multiplier);
  }

  /**
   * Get quantity multiplier for bonus points
   */
  private static getQuantityMultiplier(quantity: number): number {
    if (quantity >= 20) return 2.0; // 2x for 20+ items
    if (quantity >= 10) return 1.5; // 1.5x for 10+ items
    if (quantity >= 5) return 1.2;  // 1.2x for 5+ items
    return 1.0; // Base multiplier
  }

  /**
   * Calculate user level based on total points
   */
  static calculateLevel(totalPoints: number): number {
    return Math.floor(totalPoints / 1000) + 1;
  }

  /**
   * Check if user qualifies for new badges
   */
  static checkBadgeUnlocks(user: User, action: HabitLog): Badge[] {
    const unlockedBadges: Badge[] = [];
    
    for (const badge of BADGE_REQUIREMENTS) {
      if (this.meetsBadgeRequirements(user, badge, action)) {
        unlockedBadges.push(badge);
      }
    }
    
    return unlockedBadges;
  }

  /**
   * Check if user meets badge requirements
   */
  private static meetsBadgeRequirements(
    user: User, 
    badge: Badge, 
    action: HabitLog
  ): boolean {
    const { requirements } = badge;
    
    // Check points requirement
    if (requirements.points && user.totalPoints < requirements.points) {
      return false;
    }
    
    // Check streak requirement
    if (requirements.streak && user.currentStreak < requirements.streak) {
      return false;
    }
    
    // Check actions requirement
    if (requirements.actions && user.totalPoints < requirements.actions * 10) {
      return false;
    }
    
    // Check waste type requirement
    if (requirements.wasteTypes && !requirements.wasteTypes.includes(action.wasteType)) {
      return false;
    }
    
    return true;
  }

  /**
   * Calculate streak based on consecutive days
   */
  static calculateStreak(user: User, newAction: HabitLog): number {
    const lastAction = user.habits?.[user.habits.length - 1];
    if (!lastAction) return 1;
    
    const daysDiff = this.getDaysDifference(lastAction.loggedAt, newAction.loggedAt);
    
    if (daysDiff === 1) {
      return user.currentStreak + 1;
    } else if (daysDiff === 0) {
      return user.currentStreak;
    } else {
      return 1; // Reset streak
    }
  }

  /**
   * Get days difference between two dates
   */
  private static getDaysDifference(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.round(diffTime / oneDay);
  }

  /**
   * Calculate environmental impact
   */
  static calculateEnvironmentalImpact(action: HabitLog): {
    co2Saved: number;
    waterSaved: number;
    wildlifeSaved: number;
    treesEquivalent: number;
  } {
    const impactFactors = this.getImpactFactors(action.wasteType);
    
    return {
      co2Saved: action.quantity * impactFactors.co2PerKg,
      waterSaved: action.quantity * impactFactors.waterPerItem,
      wildlifeSaved: action.quantity * impactFactors.wildlifePerItem,
      treesEquivalent: action.quantity * impactFactors.treesPerItem,
    };
  }

  /**
   * Get impact factors for waste type
   */
  private static getImpactFactors(wasteType: string) {
    const factors = {
      plastic: { co2PerKg: 2.5, waterPerItem: 0.5, wildlifePerItem: 0.1, treesPerItem: 0.05 },
      paper: { co2PerKg: 1.2, waterPerItem: 0.3, wildlifePerItem: 0.05, treesPerItem: 0.1 },
      'e-waste': { co2PerKg: 5.0, waterPerItem: 1.0, wildlifePerItem: 0.2, treesPerItem: 0.15 },
      organic: { co2PerKg: 0.8, waterPerItem: 0.2, wildlifePerItem: 0.02, treesPerItem: 0.03 },
    };
    
    return factors[wasteType] || factors.plastic;
  }

  /**
   * Generate leaderboard entries
   */
  static generateLeaderboard(users: User[]): LeaderboardEntry[] {
    return users
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((user, index) => ({
        userId: user.id,
        displayName: user.displayName,
        avatar: user.avatar,
        points: user.totalPoints,
        level: user.level,
        rank: index + 1,
        streak: user.currentStreak,
        badges: user.badges.length,
      }));
  }

  /**
   * Calculate engagement score
   */
  static calculateEngagementScore(user: User): number {
    const factors = {
      points: Math.min(user.totalPoints / 1000, 1) * 0.3,
      streak: Math.min(user.currentStreak / 30, 1) * 0.3,
      badges: Math.min(user.badges.length / 10, 1) * 0.2,
      level: Math.min(user.level / 10, 1) * 0.2,
    };
    
    return Object.values(factors).reduce((sum, factor) => sum + factor, 0) * 100;
  }
}
