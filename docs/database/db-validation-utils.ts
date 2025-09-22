// Database Validation & Helper Utilities for EcoHabit
// packages/shared/src/utils/database-helpers.ts

import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

// User validation schema
export const UserSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().min(1).max(100),
  photoURL: z.string().url().optional(),
  
  profile: z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    dateOfBirth: z.instanceof(Timestamp).optional(),
    location: z.object({
      city: z.string().min(1).max(100),
      country: z.string().min(1).max(100),
      coordinates: z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180)
      }).optional()
    }).optional(),
    bio: z.string().max(500).optional(),
    preferences: z.object({
      wasteCategories: z.array(z.enum(['plastic', 'paper', 'e-waste', 'organic', 'glass', 'metal'])),
      notificationsEnabled: z.boolean(),
      dailyReminderTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
      language: z.enum(['en', 'si', 'ta']),
      theme: z.enum(['light', 'dark', 'auto'])
    })
  }),
  
  gamification: z.object({
    level: z.number().min(1).max(100),
    totalPoints: z.number().min(0),
    currentStreakDays: z.number().min(0),
    longestStreakDays: z.number().min(0),
    rank: z.string().min(1).max(50),
    title: z.string().max(100).optional()
  }),
  
  progress: z.object({
    totalActionsLogged: z.number().min(0),
    totalWasteRecycled: z.number().min(0),
    co2Saved: z.number().min(0),
    waterSaved: z.number().min(0),
    wildlifeSaved: z.number().min(0),
    treesEquivalent: z.number().min(0)
  }),
  
  social: z.object({
    friendsCount: z.number().min(0),
    communityChallengesJoined: z.number().min(0),
    achievementsShared: z.number().min(0),
    publicProfile: z.boolean()
  }),
  
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
  lastActiveAt: z.instanceof(Timestamp),
  onboardingCompleted: z.boolean(),
  currentLessonDay: z.number().min(1).max(25)
});

// Habit Log validation schema
export const HabitLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['plastic', 'paper', 'e-waste', 'organic', 'glass', 'metal']),
  quantity: z.number().min(0.1).max(1000),
  unit: z.enum(['items', 'kg']),
  
  location: z.object({
    type: z.enum(['home', 'work', 'public', 'beach_cleanup', 'community_center']),
    coordinates: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180)
    }).optional()
  }).optional(),
  
  photo: z.object({
    url: z.string().url(),
    caption: z.string().max(200).optional()
  }).optional(),
  
  pointsAwarded: z.number().min(0),
  badgesUnlocked: z.array(z.string()).optional(),
  streakUpdated: z.boolean(),
  levelUpTriggered: z.boolean(),
  
  impactMessage: z.string().min(1).max(200),
  encouragementMessage: z.string().min(1).max(200),
  
  loggedAt: z.instanceof(Timestamp),
  date: z.instanceof(Timestamp),
  source: z.enum(['manual', 'photo_scan', 'challenge_completion'])
});

// Challenge validation schema
export const ChallengeSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  type: z.enum(['daily', 'weekly', 'monthly', 'seasonal', 'community']),
  
  requirements: z.object({
    actionType: z.enum(['plastic', 'paper', 'e-waste', 'any']),
    targetQuantity: z.number().min(1).max(1000),
    timeframe: z.object({
      duration: z.number().min(1).max(365),
      startDate: z.instanceof(Timestamp),
      endDate: z.instanceof(Timestamp)
    })
  }),
  
  rewards: z.object({
    points: z.number().min(0),
    badges: z.array(z.string()).optional(),
    title: z.string().max(50).optional()
  }),
  
  participants: z.object({
    currentCount: z.number().min(0),
    maxParticipants: z.number().min(1).optional(),
    leaderboard: z.array(z.object({
      userId: z.string(),
      progress: z.number().min(0).max(100),
      rank: z.number().min(1)
    }))
  }),
  
  createdAt: z.instanceof(Timestamp),
  isActive: z.boolean(),
  featured: z.boolean(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert'])
});

// ============================================================================
// GAMIFICATION CALCULATION HELPERS
// ============================================================================

export class GamificationEngine {
  // Points calculation based on action type and quantity
  static calculatePoints(wasteType: string, quantity: number, unit: string): number {
    const basePoints: Record<string, number> = {
      'plastic': 10,
      'paper': 5,
      'e-waste': 20,
      'organic': 8,
      'glass': 12,
      'metal': 15
    };
    
    const multiplier = unit === 'kg' ? 10 : 1;
    const points = (basePoints[wasteType] || 5) * quantity * multiplier;
    
    // Bonus for larger quantities
    const bonusMultiplier = quantity >= 10 ? 1.5 : quantity >= 5 ? 1.2 : 1;
    
    return Math.round(points * bonusMultiplier);
  }
  
  // Environmental impact calculations
  static calculateEnvironmentalImpact(wasteType: string, quantity: number) {
    // Estimates based on environmental research
    const impactFactors = {
      plastic: {
        co2PerKg: 2.5, // kg CO2 saved per kg plastic recycled
        waterPerItem: 22, // liters water saved per plastic bottle
        wildlifePerItem: 0.1 // fraction of animals helped per item
      },
      paper: {
        co2PerKg: 1.2,
        waterPerItem: 10,
        wildlifePerItem: 0.05
      },
      'e-waste': {
        co2PerKg: 15,
        waterPerItem: 50,
        wildlifePerItem: 0.2
      },
      organic: {
        co2PerKg: 0.8,
        waterPerItem: 5,
        wildlifePerItem: 0.02
      },
      glass: {
        co2PerKg: 0.5,
        waterPerItem: 8,
        wildlifePerItem: 0.03
      },
      metal: {
        co2PerKg: 3.0,
        waterPerItem: 15,
        wildlifePerItem: 0.08
      }
    };
    
    const factors = impactFactors[wasteType as keyof typeof impactFactors] || impactFactors.plastic;
    
    return {
      co2Saved: quantity * factors.co2PerKg,
      waterSaved: quantity * factors.waterPerItem,
      wildlifeSaved: quantity * factors.wildlifePerItem,
      treesEquivalent: (quantity * factors.co2PerKg) / 22 // ~22kg CO2 per tree annually
    };
  }
  
  // Level calculation based on total points
  static calculateLevel(totalPoints: number): number {
    // Progressive level system: 100, 300, 600, 1000, 1500, 2100, 2800...
    let level = 1;
    let pointsRequired = 100;
    let currentThreshold = 100;
    
    while (totalPoints >= currentThreshold) {
      level++;
      pointsRequired += level * 100;
      currentThreshold += pointsRequired;
    }
    
    return level;
  }
  
  // Check if user qualifies for badges
  static checkBadgeQualification(user: any, habitLog?: any): string[] {
    const earnedBadges: string[] = [];
    
    // Eco Starter badge
    if (user.progress.totalActionsLogged === 1) {
      earnedBadges.push('eco_starter');
    }
    
    // Plastic Protector badge
    if (user.progress.totalActionsLogged >= 10 && habitLog?.type === 'plastic') {
      earnedBadges.push('plastic_protector');
    }
    
    // Streak badges
    if (user.gamification.currentStreakDays === 7) {
      earnedBadges.push('streak_warrior_7');
    }
    
    // Community builder badge
    if (user.social.friendsCount >= 3) {
      earnedBadges.push('eco_community_builder');
    }
    
    // Lesson completion badges
    if (user.currentLessonDay >= 7) {
      earnedBadges.push('eco_hero_level_1');
    }
    
    // Impact champion badge
    if (user.gamification.totalPoints >= 5000) {
      earnedBadges.push('impact_champion');
    }
    
    return earnedBadges;
  }
  
  // Generate encouraging messages
  static generateImpactMessage(wasteType: string, quantity: number, impact: any): string {
    const messages = {
      plastic: [
        `Amazing! You just saved ${Math.round(impact.waterSaved)} liters of water from pollution.`,
        `Fantastic! You prevented ${Math.round(impact.wildlifeSaved * 10)} marine animals from plastic harm.`,
        `Incredible! Your action prevented ${quantity} plastic items from reaching the ocean.`
      ],
      paper: [
        `Great work! You saved ${Math.round(impact.treesEquivalent * 10)} trees worth of resources.`,
        `Excellent! You prevented ${Math.round(impact.co2Saved)} kg of CO2 emissions.`,
        `Well done! Your recycling contributes to sustainable forestry.`
      ],
      'e-waste': [
        `Outstanding! You prevented ${Math.round(impact.co2Saved)} kg of toxic emissions.`,
        `Brilliant! Your e-waste recycling protects soil and groundwater.`,
        `Perfect! You recovered valuable materials for reuse.`
      ]
    };
    
    const messageList = messages[wasteType as keyof typeof messages] || messages.plastic;
    return messageList[Math.floor(Math.random() * messageList.length)];
  }
  
  // Generate encouragement messages
  static generateEncouragementMessage(): string {
    const messages = [
      "You're making a real difference for our planet!",
      "Every action counts - keep up the amazing work!",
      "Your consistency is inspiring others to act!",
      "Small steps lead to big environmental wins!",
      "You're building a sustainable future!",
      "Your commitment to the environment is powerful!",
      "Together we're creating positive change!",
      "Your actions ripple out to help the whole community!"
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  }
}

// ============================================================================
// STREAK MANAGEMENT HELPERS
// ============================================================================

export class StreakManager {
  // Check if streak should continue or reset
  static updateStreak(lastLogDate: Date, currentLogDate: Date, currentStreak: number): {
    newStreak: number;
    streakMaintained: boolean;
    streakBroken: boolean;
  } {
    const daysDiff = Math.floor((currentLogDate.getTime() - lastLogDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Same day - maintain streak
      return { newStreak: currentStreak, streakMaintained: true, streakBroken: false };
    } else if (daysDiff === 1) {
      // Next day - increment streak
      return { newStreak: currentStreak + 1, streakMaintained: true, streakBroken: false };
    } else {
      // Gap > 1 day - break streak
      return { newStreak: 1, streakMaintained: false, streakBroken: true };
    }
  }
  
  // Get streak milestone rewards
  static getStreakMilestoneReward(streakDays: number): { points: number; badge?: string } {
    const milestones: Record<number, { points: number; badge?: string }> = {
      3: { points: 100 },
      7: { points: 300, badge: 'streak_warrior_7' },
      14: { points: 750, badge: 'streak_warrior_14' },
      30: { points: 2000, badge: 'streak_legend_30' },
      100: { points: 10000, badge: 'streak_master_100' }
    };
    
    return milestones[streakDays] || { points: 0 };
  }
}

// ============================================================================
// LEADERBOARD HELPERS
// ============================================================================

export class LeaderboardManager {
  // Calculate user rank based on points
  static calculateRank(userPoints: number, allUserPoints: number[]): number {
    const sortedPoints = allUserPoints.sort((a, b) => b - a);
    return sortedPoints.indexOf(userPoints) + 1;
  }
  
  // Generate leaderboard data structure
  static generateLeaderboard(users: any[], type: string, period: string): any {
    const sortedUsers = users
      .filter(user => user.gamification.totalPoints > 0)
      .sort((a, b) => b.gamification.totalPoints - a.gamification.totalPoints)
      .slice(0, 100) // Top 100
      .map((user, index) => ({
        rank: index + 1,
        userId: user.uid,
        displayName: user.displayName,
        avatar: user.photoURL,
        score: user.gamification.totalPoints,
        change: 0 // Would need historical data to calculate
      }));
    
    return {
      id: `${type}_${period}_${Date.now()}`,
      type,
      period,
      rankings: sortedUsers,
      updatedAt: Timestamp.now(),
      totalParticipants: users.length
    };
  }
}

// ============================================================================
// NOTIFICATION HELPERS
// ============================================================================

export class NotificationHelper {
  // Determine optimal notification time for user
  static getOptimalNotificationTime(userPreferences: any, analyticsData?: any): string {
    // Use user preference if available
    if (userPreferences.dailyReminderTime) {
      return userPreferences.dailyReminderTime;
    }
    
    // Use analytics to find most active time
    if (analyticsData?.patterns?.mostActiveTimeOfDay) {
      return analyticsData.patterns.mostActiveTimeOfDay;
    }
    
    // Default to 18:00 (6 PM) - typically good engagement time
    return "18:00";
  }
  
  // Personalize notification message
  static personalizeNotification(template: string, variables: Record<string, any>): string {
    let message = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{${key}}`, 'g'), String(value));
    });
    
    return message;
  }
}

// ============================================================================
// ANALYTICS HELPERS
// ============================================================================

export class AnalyticsHelper {
  // Calculate user engagement score
  static calculateEngagementScore(user: any, recentLogs: any[]): number {
    const factors = {
      streakDays: user.gamification.currentStreakDays * 2,
      recentActivity: recentLogs.length * 5,
      lessonsCompleted: user.currentLessonDay * 3,
      socialInteractions: user.social.achievementsShared * 1
    };
    
    const totalScore = Object.values(factors).reduce((sum, score) => sum + score, 0);
    return Math.min(100, Math.max(0, totalScore));
  }
  
  // Identify user behavior patterns
  static identifyBehaviorPatterns(userLogs: any[]): any {
    if (userLogs.length === 0) return null;
    
    const timePatterns = userLogs.reduce((acc, log) => {
      const hour = new Date(log.loggedAt.toDate()).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
    
    const mostActiveHour = Object.entries(timePatterns)
      .sort(([, a], [, b]) => (b as number) - (a as number))[0][0];
    
    const wasteTypePreferences = userLogs.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1;
      return acc;
    }, {});
    
    const preferredTypes = Object.entries(wasteTypePreferences)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([type]) => type);
    
    return {
      mostActiveTimeOfDay: `${mostActiveHour.padStart(2, '0')}:00`,
      preferredWasteTypes: preferredTypes,
      averageSessionLength: 300, // Would calculate from actual session data
      streakConsistency: calculateStreakConsistency(userLogs),
      engagementTrend: 'stable' // Would calculate from historical data
    };
  }
}

// Helper function for streak consistency
function calculateStreakConsistency(logs: any[]): number {
  if (logs.length < 7) return 0;
  
  const last7Days = logs
    .sort((a, b) => b.date.toMillis() - a.date.toMillis())
    .slice(0, 7);
  
  const uniqueDays = new Set(
    last7Days.map(log => log.date.toDate().toDateString())
  ).size;
  
  return Math.round((uniqueDays / 7) * 100);
}

// ============================================================================
// DATABASE QUERY HELPERS
// ============================================================================

export class DatabaseQueryHelper {
  // Build efficient queries for user data
  static buildUserLogsQuery(db: any, userId: string, filters?: {
    wasteType?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) {
    let query = db
      .collection('habitLogs')
      .where('userId', '==', userId);
    
    if (filters?.wasteType) {
      query = query.where('type', '==', filters.wasteType);
    }
    
    if (filters?.startDate) {
      query = query.where('date', '>=', Timestamp.fromDate(filters.startDate));
    }
    
    if (filters?.endDate) {
      query = query.where('date', '<=', Timestamp.fromDate(filters.endDate));
    }
    
    query = query.orderBy('date', 'desc');
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    return query;
  }
  
  // Build leaderboard queries
  static buildLeaderboardQuery(db: any, type: string, region?: string) {
    let query = db.collection('users');
    
    if (region) {
      query = query.where('profile.location.city', '==', region);
    }
    
    return query
      .where('gamification.totalPoints', '>', 0)
      .orderBy('gamification.totalPoints', 'desc')
      .limit(100);
  }
  
  // Build challenge participation query
  static buildChallengeParticipationQuery(db: any, challengeId: string) {
    return db
      .collection('userChallengeParticipation')
      .where('challengeId', '==', challengeId)
      .where('status', '==', 'active')
      .orderBy('progress.percentage', 'desc');
  }
}

// ============================================================================
// ERROR HANDLING HELPERS
// ============================================================================

export class DatabaseErrorHandler {
  static handleFirestoreError(error: any): { code: string; message: string } {
    const errorMapping: Record<string, string> = {
      'permission-denied': 'You do not have permission to access this data',
      'not-found': 'The requested data was not found',
      'already-exists': 'This data already exists',
      'resource-exhausted': 'Too many requests. Please try again later',
      'failed-precondition': 'The operation failed due to invalid conditions',
      'aborted': 'The operation was aborted due to conflicts',
      'out-of-range': 'The provided value is out of valid range',
      'unimplemented': 'This feature is not yet implemented',
      'internal': 'An internal error occurred',
      'unavailable': 'The service is currently unavailable',
      'data-loss': 'Unrecoverable data loss occurred'
    };
    
    return {
      code: error.code || 'unknown',
      message: errorMapping[error.code] || 'An unknown error occurred'
    };
  }
  
  static isRetryableError(error: any): boolean {
    const retryableCodes = [
      'unavailable',
      'internal',
      'aborted',
      'resource-exhausted'
    ];
    
    return retryableCodes.includes(error.code);
  }
}

// ============================================================================
// EXPORT ALL UTILITIES
// ============================================================================

export {
  UserSchema,
  HabitLogSchema,
  ChallengeSchema,
  GamificationEngine,
  StreakManager,
  LeaderboardManager,
  NotificationHelper,
  AnalyticsHelper,
  DatabaseQueryHelper,
  DatabaseErrorHandler
};