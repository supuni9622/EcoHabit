import { z } from 'zod';

/**
 * Validation schemas for EcoHabit
 */

// User validation
export const userSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().min(1).max(100),
  avatar: z.string().url().optional(),
  level: z.number().int().min(1).max(100),
  totalPoints: z.number().int().min(0),
  currentStreak: z.number().int().min(0),
  badges: z.array(z.string()),
  preferences: z.object({
    notifications: z.object({
      dailyReminder: z.boolean(),
      achievementAlerts: z.boolean(),
      streakAlerts: z.boolean(),
      communityUpdates: z.boolean(),
    }),
    privacy: z.object({
      shareProgress: z.boolean(),
      showOnLeaderboard: z.boolean(),
      allowFriendRequests: z.boolean(),
    }),
    gamification: z.object({
      difficulty: z.enum(['easy', 'medium', 'hard']),
      focusAreas: z.array(z.string()),
    }),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Habit log validation
export const habitLogSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  wasteType: z.enum(['plastic', 'paper', 'e-waste', 'organic', 'glass', 'metal', 'textile', 'other']),
  quantity: z.number().int().min(1).max(100),
  pointsAwarded: z.number().int().min(0),
  impact: z.object({
    co2Saved: z.number().min(0),
    waterSaved: z.number().min(0),
    wildlifeSaved: z.number().min(0),
    treesEquivalent: z.number().min(0),
  }),
  loggedAt: z.date(),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().optional(),
  }).optional(),
  notes: z.string().max(500).optional(),
  photoUrl: z.string().url().optional(),
});

// Badge validation
export const badgeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  icon: z.string().min(1),
  rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']),
  requirements: z.object({
    points: z.number().int().min(0).optional(),
    streak: z.number().int().min(0).optional(),
    actions: z.number().int().min(0).optional(),
    wasteTypes: z.array(z.string()).optional(),
    timeFrame: z.enum(['daily', 'weekly', 'monthly', 'all-time']).optional(),
  }),
  rewards: z.object({
    points: z.number().int().min(0),
    features: z.array(z.string()),
    title: z.string().optional(),
  }),
  unlockedAt: z.date().optional(),
});

// Lesson validation
export const lessonSchema = z.object({
  id: z.string().min(1),
  day: z.number().int().min(1).max(25),
  title: z.string().min(1).max(200),
  content: z.object({
    story: z.string().min(1),
    keyMessage: z.string().min(1),
    visuals: z.array(z.string()),
    interactiveElements: z.array(z.string()),
  }),
  microAction: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    points: z.number().int().min(0),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    timeRequired: z.number().int().min(1),
    requirements: z.array(z.string()),
  }),
  aiPrompts: z.object({
    reflection: z.string().min(1),
    coaching: z.string().min(1),
    encouragement: z.string().min(1),
    challenge: z.string().min(1),
  }),
  media: z.object({
    images: z.array(z.string()),
    videos: z.array(z.string()).optional(),
    audio: z.array(z.string()).optional(),
    threeD: z.array(z.string()).optional(),
  }),
  unlockedAt: z.date().optional(),
  completedAt: z.date().optional(),
});

// Challenge validation
export const challengeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  type: z.enum(['daily', 'weekly', 'community', 'special']),
  requirements: z.object({
    actions: z.number().int().min(0),
    wasteTypes: z.array(z.string()),
    points: z.number().int().min(0),
    streak: z.number().int().min(0),
  }),
  rewards: z.object({
    points: z.number().int().min(0),
    badges: z.array(z.string()),
    features: z.array(z.string()),
    title: z.string().optional(),
  }),
  startDate: z.date(),
  endDate: z.date(),
  participants: z.array(z.string()),
  status: z.enum(['upcoming', 'active', 'completed', 'expired']),
});

// Chat message validation
export const chatMessageSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  content: z.string().min(1).max(1000),
  type: z.enum(['user', 'assistant']),
  timestamp: z.date(),
  context: z.object({
    lessonId: z.string().optional(),
    challengeId: z.string().optional(),
    actionType: z.string().optional(),
    userLevel: z.number().int().min(1),
    recentActions: z.array(z.string()),
  }).optional(),
});

// API response validation
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

// Paginated response validation
export const paginatedResponseSchema = z.object({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1).max(100),
    total: z.number().int().min(0),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

// Validation helper functions
export const validationHelpers = {
  /**
   * Validate user data
   */
  validateUser: (data: unknown) => {
    try {
      return { success: true, data: userSchema.parse(data) };
    } catch (error) {
      return { success: false, error: error instanceof z.ZodError ? error.errors : 'Invalid user data' };
    }
  },
  
  /**
   * Validate habit log data
   */
  validateHabitLog: (data: unknown) => {
    try {
      return { success: true, data: habitLogSchema.parse(data) };
    } catch (error) {
      return { success: false, error: error instanceof z.ZodError ? error.errors : 'Invalid habit log data' };
    }
  },
  
  /**
   * Validate badge data
   */
  validateBadge: (data: unknown) => {
    try {
      return { success: true, data: badgeSchema.parse(data) };
    } catch (error) {
      return { success: false, error: error instanceof z.ZodError ? error.errors : 'Invalid badge data' };
    }
  },
  
  /**
   * Validate lesson data
   */
  validateLesson: (data: unknown) => {
    try {
      return { success: true, data: lessonSchema.parse(data) };
    } catch (error) {
      return { success: false, error: error instanceof z.ZodError ? error.errors : 'Invalid lesson data' };
    }
  },
  
  /**
   * Validate challenge data
   */
  validateChallenge: (data: unknown) => {
    try {
      return { success: true, data: challengeSchema.parse(data) };
    } catch (error) {
      return { success: false, error: error instanceof z.ZodError ? error.errors : 'Invalid challenge data' };
    }
  },
  
  /**
   * Validate chat message data
   */
  validateChatMessage: (data: unknown) => {
    try {
      return { success: true, data: chatMessageSchema.parse(data) };
    } catch (error) {
      return { success: false, error: error instanceof z.ZodError ? error.errors : 'Invalid chat message data' };
    }
  },
  
  /**
   * Validate API response data
   */
  validateApiResponse: (data: unknown) => {
    try {
      return { success: true, data: apiResponseSchema.parse(data) };
    } catch (error) {
      return { success: false, error: error instanceof z.ZodError ? error.errors : 'Invalid API response data' };
    }
  },
  
  /**
   * Validate paginated response data
   */
  validatePaginatedResponse: (data: unknown) => {
    try {
      return { success: true, data: paginatedResponseSchema.parse(data) };
    } catch (error) {
      return { success: false, error: error instanceof z.ZodError ? error.errors : 'Invalid paginated response data' };
    }
  },
};
