import { HabitLog, User } from '../types';

export class HabitTracker {
  /**
   * Validate a habit action before logging
   */
  static validateAction(action: Partial<HabitLog>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!action.wasteType || !this.isValidWasteType(action.wasteType)) {
      errors.push('Invalid waste type');
    }
    
    if (!action.quantity || action.quantity < 1 || action.quantity > 100) {
      errors.push('Quantity must be between 1 and 100');
    }
    
    if (!action.userId) {
      errors.push('User ID is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Check if waste type is valid
   */
  private static isValidWasteType(wasteType: string): boolean {
    const validTypes = ['plastic', 'paper', 'e-waste', 'organic', 'glass', 'metal', 'textile', 'other'];
    return validTypes.includes(wasteType);
  }
  
  /**
   * Calculate environmental impact for a habit action
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
    const factors: Record<string, { co2PerKg: number; waterPerItem: number; wildlifePerItem: number; treesPerItem: number }> = {
      plastic: { co2PerKg: 2.5, waterPerItem: 0.5, wildlifePerItem: 0.1, treesPerItem: 0.05 },
      paper: { co2PerKg: 1.2, waterPerItem: 0.3, wildlifePerItem: 0.05, treesPerItem: 0.1 },
      'e-waste': { co2PerKg: 5.0, waterPerItem: 1.0, wildlifePerItem: 0.2, treesPerItem: 0.15 },
      organic: { co2PerKg: 0.8, waterPerItem: 0.2, wildlifePerItem: 0.02, treesPerItem: 0.03 },
      glass: { co2PerKg: 1.5, waterPerItem: 0.4, wildlifePerItem: 0.08, treesPerItem: 0.07 },
      metal: { co2PerKg: 3.0, waterPerItem: 0.6, wildlifePerItem: 0.12, treesPerItem: 0.1 },
      textile: { co2PerKg: 1.8, waterPerItem: 0.3, wildlifePerItem: 0.06, treesPerItem: 0.04 },
      other: { co2PerKg: 1.0, waterPerItem: 0.2, wildlifePerItem: 0.03, treesPerItem: 0.02 },
    };
    
    return factors[wasteType] || factors.other;
  }
  
  /**
   * Get user's habit statistics
   */
  static getUserHabitStats(user: User): {
    totalActions: number;
    totalImpact: {
      co2Saved: number;
      waterSaved: number;
      wildlifeSaved: number;
      treesEquivalent: number;
    };
    favoriteWasteType: string;
    averageDailyActions: number;
  } {
    const habits = user.habits || [];
    const totalActions = habits.length;
    
    const totalImpact = habits.reduce((acc, habit) => {
      const impact = this.calculateEnvironmentalImpact(habit);
      return {
        co2Saved: acc.co2Saved + impact.co2Saved,
        waterSaved: acc.waterSaved + impact.waterSaved,
        wildlifeSaved: acc.wildlifeSaved + impact.wildlifeSaved,
        treesEquivalent: acc.treesEquivalent + impact.treesEquivalent,
      };
    }, { co2Saved: 0, waterSaved: 0, wildlifeSaved: 0, treesEquivalent: 0 });
    
    const wasteTypeCounts = habits.reduce((acc, habit) => {
      acc[habit.wasteType] = (acc[habit.wasteType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const favoriteWasteType = Object.keys(wasteTypeCounts).reduce((a, b) => 
      wasteTypeCounts[a] > wasteTypeCounts[b] ? a : b, 'plastic'
    );
    
    const daysSinceStart = Math.max(1, Math.ceil((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)));
    const averageDailyActions = totalActions / daysSinceStart;
    
    return {
      totalActions,
      totalImpact,
      favoriteWasteType,
      averageDailyActions,
    };
  }
}
