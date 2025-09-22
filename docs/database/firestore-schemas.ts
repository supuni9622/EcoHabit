// Firestore Database Schemas for EcoHabit
// This file defines the TypeScript interfaces and Firestore document structures

import { Timestamp, FieldValue } from 'firebase/firestore';

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  
  // Profile Information
  profile: {
    firstName: string;
    lastName: string;
    dateOfBirth?: Timestamp;
    location?: {
      city: string;
      country: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    bio?: string;
    preferences: {
      wasteCategories: ('plastic' | 'paper' | 'e-waste' | 'organic' | 'glass' | 'metal')[];
      notificationsEnabled: boolean;
      dailyReminderTime: string; // HH:MM format
      language: 'en' | 'si' | 'ta'; // English, Sinhala, Tamil
      theme: 'light' | 'dark' | 'auto';
    };
  };
  
  // Gamification Data
  gamification: {
    level: number;
    totalPoints: number;
    currentStreakDays: number;
    longestStreakDays: number;
    rank: string; // "Eco Beginner", "Plastic Warrior", "Green Guardian", etc.
    title?: string; // Optional custom title
  };
  
  // Progress Tracking
  progress: {
    totalActionsLogged: number;
    totalWasteRecycled: number; // in kg
    co2Saved: number; // estimated CO2 savings in kg
    waterSaved: number; // estimated water saved in liters
    wildlifeSaved: number; // estimated number of animals helped
    treesEquivalent: number; // environmental impact in tree equivalents
  };
  
  // Social Features
  social: {
    friendsCount: number;
    communityChallengesJoined: number;
    achievementsShared: number;
    publicProfile: boolean;
  };
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActiveAt: Timestamp;
  onboardingCompleted: boolean;
  currentLessonDay: number; // tracks progress through 25-day program
}

// ============================================================================
// HABIT TRACKING & LOGGING
// ============================================================================

export interface HabitLog {
  id: string;
  userId: string;
  
  // Action Details
  type: 'plastic' | 'paper' | 'e-waste' | 'organic' | 'glass' | 'metal';
  quantity: number; // number of items or weight in kg
  unit: 'items' | 'kg';
  
  // Context Information
  location?: {
    type: 'home' | 'work' | 'public' | 'beach_cleanup' | 'community_center';
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Optional Media
  photo?: {
    url: string;
    caption?: string;
  };
  
  // Gamification Results
  pointsAwarded: number;
  badgesUnlocked?: string[]; // badge IDs
  streakUpdated: boolean;
  levelUpTriggered: boolean;
  
  // Psychological Feedback
  impactMessage: string; // "You saved 2 turtles today!"
  encouragementMessage: string;
  
  // Metadata
  loggedAt: Timestamp;
  date: Timestamp; // The actual date of the action (can be backdated)
  source: 'manual' | 'photo_scan' | 'challenge_completion';
}

// ============================================================================
// STREAKS MANAGEMENT
// ============================================================================

export interface UserStreak {
  userId: string;
  
  // Current Streak
  currentStreak: {
    days: number;
    startDate: Timestamp;
    lastLogDate: Timestamp;
    category?: 'plastic' | 'paper' | 'e-waste' | 'any'; // streak type
  };
  
  // Historical Data
  longestStreak: {
    days: number;
    startDate: Timestamp;
    endDate: Timestamp;
    category?: string;
  };
  
  // Streak Milestones
  milestones: {
    day: number;
    achievedAt: Timestamp;
    rewardGiven: string; // badge or points
  }[];
  
  // Streak Recovery (for psychological encouragement)
  streakFreeze: {
    available: number; // number of streak freezes available
    used: {
      date: Timestamp;
      reason: string;
    }[];
  };
  
  updatedAt: Timestamp;
}

// ============================================================================
// GAMIFICATION & ACHIEVEMENTS
// ============================================================================

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'recycling' | 'streaks' | 'community' | 'learning' | 'impact' | 'social';
  
  // Visual Assets
  iconURL: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  
  // Unlock Requirements
  requirements: {
    type: 'actions_logged' | 'streak_days' | 'points_earned' | 'lessons_completed' | 'friends_invited';
    threshold: number;
    category?: string; // specific waste type if applicable
    timeframe?: 'daily' | 'weekly' | 'monthly' | 'all_time';
  };
  
  // Rewards
  pointsReward: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  
  // Metadata
  createdAt: Timestamp;
  isActive: boolean;
  order: number; // display order
}

export interface UserAchievement {
  userId: string;
  badgeId: string;
  
  // Achievement Details
  unlockedAt: Timestamp;
  progress: number; // percentage toward next level of this achievement
  level: number; // some badges can be earned multiple times
  
  // Social Features
  isShared: boolean;
  sharedAt?: Timestamp;
  congratulationsReceived: number;
}

// ============================================================================
// LESSONS & EDUCATIONAL CONTENT
// ============================================================================

export interface Lesson {
  id: string;
  day: number; // 1-25 for the core program
  
  // Content Structure
  title: string;
  subtitle: string;
  category: 'awareness' | 'empowerment' | 'knowledge' | 'empathy' | 'motivation' | 'reflection';
  
  // Story Content
  story: {
    text: string;
    hook: string; // emotional hook for engagement
    visualPrompt: string; // for AI image generation
    estimatedReadTime: number; // in minutes
  };
  
  // Interactive Elements
  microAction: {
    description: string;
    type: 'log_recycling' | 'quiz' | 'reflection' | 'photo_challenge' | 'social_share';
    pointsReward: number;
    requiredForProgress: boolean;
  };
  
  // AI Chat Integration
  aiPrompts: {
    reflectionPrompt: string;
    followUpQuestions: string[];
    encouragementMessages: string[];
  };
  
  // Psychological Design
  feedbackLoop: {
    immediateReward: string; // instant gratification message
    impactVisualization: string; // "You prevented X microplastics"
    socialValidation?: string; // shareable achievement text
  };
  
  // Media Assets
  media: {
    heroImage: string;
    thumbnailImage: string;
    additionalImages?: string[];
    videoURL?: string;
  };
  
  // Metadata
  createdAt: Timestamp;
  isActive: boolean;
  prerequisites?: number[]; // required lesson days before this one
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
}

export interface UserLessonProgress {
  userId: string;
  lessonId: string;
  
  // Progress Tracking
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  
  // Engagement Metrics
  timeSpent: number; // in seconds
  interactionsCount: number;
  microActionCompleted: boolean;
  
  // AI Chat History
  aiChatHistory: {
    userMessage: string;
    aiResponse: string;
    timestamp: Timestamp;
    sentimentScore?: number; // for analytics
  }[];
  
  // Reflection Data
  reflection: {
    userResponse?: string;
    emotionalState?: 'excited' | 'motivated' | 'concerned' | 'empowered' | 'curious';
    keyTakeaways?: string[];
  };
}

// ============================================================================
// CHALLENGES & COMMUNITY
// ============================================================================

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'community';
  
  // Challenge Parameters
  requirements: {
    actionType: 'plastic' | 'paper' | 'e-waste' | 'any';
    targetQuantity: number;
    timeframe: {
      duration: number; // in days
      startDate: Timestamp;
      endDate: Timestamp;
    };
  };
  
  // Rewards
  rewards: {
    points: number;
    badges?: string[]; // badge IDs
    title?: string; // special title for completion
  };
  
  // Social Features
  participants: {
    currentCount: number;
    maxParticipants?: number;
    leaderboard: {
      userId: string;
      progress: number;
      rank: number;
    }[];
  };
  
  // Metadata
  createdAt: Timestamp;
  isActive: boolean;
  featured: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

export interface UserChallengeParticipation {
  userId: string;
  challengeId: string;
  
  // Participation Details
  joinedAt: Timestamp;
  status: 'active' | 'completed' | 'failed' | 'abandoned';
  
  // Progress Tracking
  progress: {
    currentQuantity: number;
    targetQuantity: number;
    percentage: number;
    lastUpdateAt: Timestamp;
  };
  
  // Social Features
  friendsInvited: string[]; // user IDs
  encouragementReceived: {
    fromUserId: string;
    message: string;
    timestamp: Timestamp;
  }[];
  
  // Results
  completedAt?: Timestamp;
  finalRank?: number;
  rewardsEarned?: {
    points: number;
    badges: string[];
    title?: string;
  };
}

// ============================================================================
// SOCIAL FEATURES & COMMUNITY
// ============================================================================

export interface Friendship {
  id: string;
  userIds: [string, string]; // [requesterId, recipientId]
  
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Timestamp;
  acceptedAt?: Timestamp;
  
  // Social Interactions
  mutualChallenges: string[]; // challenge IDs both users participated in
  encouragementsSent: number;
  lastInteraction: Timestamp;
}

export interface CommunityPost {
  id: string;
  userId: string;
  
  // Post Content
  type: 'achievement_share' | 'challenge_completion' | 'milestone' | 'photo_share' | 'tip_share';
  content: {
    text?: string;
    imageURL?: string;
    achievementId?: string;
    challengeId?: string;
    actionData?: {
      wasteType: string;
      quantity: number;
      impact: string;
    };
  };
  
  // Engagement
  likes: {
    userId: string;
    timestamp: Timestamp;
  }[];
  comments: {
    userId: string;
    text: string;
    timestamp: Timestamp;
  }[];
  
  // Metadata
  createdAt: Timestamp;
  isPublic: boolean;
  reportedCount: number;
  moderationStatus: 'approved' | 'pending' | 'rejected';
}

// ============================================================================
// LEADERBOARDS & RANKINGS
// ============================================================================

export interface Leaderboard {
  id: string;
  type: 'global_points' | 'weekly_actions' | 'monthly_impact' | 'streak_leaders' | 'community_local';
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  
  // Rankings
  rankings: {
    rank: number;
    userId: string;
    displayName: string;
    avatar?: string;
    score: number;
    change: number; // position change from previous period
  }[];
  
  // Metadata
  updatedAt: Timestamp;
  totalParticipants: number;
  region?: string; // for local leaderboards
}

// ============================================================================
// RECYCLING LOCATIONS & MAP DATA
// ============================================================================

export interface RecyclingLocation {
  id: string;
  name: string;
  
  // Location Details
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  
  // Facility Information
  acceptedWasteTypes: ('plastic' | 'paper' | 'e-waste' | 'organic' | 'glass' | 'metal')[];
  operatingHours: {
    [key: string]: { // day of week
      open: string; // HH:MM
      close: string; // HH:MM
      closed: boolean;
    };
  };
  
  // Contact Information
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  
  // User Ratings
  rating: {
    average: number;
    count: number;
    reviews: {
      userId: string;
      rating: number;
      comment?: string;
      timestamp: Timestamp;
    }[];
  };
  
  // Verification
  verified: boolean;
  verifiedAt?: Timestamp;
  lastUpdated: Timestamp;
}

// ============================================================================
// ANALYTICS & SYSTEM DATA
// ============================================================================

export interface UserAnalytics {
  userId: string;
  
  // Daily Metrics (updated daily)
  daily: {
    [dateString: string]: { // YYYY-MM-DD format
      actionsLogged: number;
      pointsEarned: number;
      timeSpentInApp: number; // seconds
      lessonsCompleted: number;
      aiChatInteractions: number;
    };
  };
  
  // Behavioral Patterns
  patterns: {
    mostActiveTimeOfDay: string; // HH:MM
    preferredWasteTypes: string[];
    averageSessionLength: number; // seconds
    streakConsistency: number; // percentage
    engagementTrend: 'increasing' | 'stable' | 'decreasing';
  };
  
  // Psychological Profile (for personalization)
  motivations: {
    primary: 'environmental_impact' | 'social_recognition' | 'personal_achievement' | 'community_belonging';
    secondary: string[];
    rewardPreference: 'points' | 'badges' | 'social_recognition' | 'impact_visualization';
  };
  
  updatedAt: Timestamp;
}

export interface SystemMetrics {
  id: string; // date string YYYY-MM-DD
  
  // Global App Metrics
  metrics: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    totalActionsLogged: number;
    totalPointsAwarded: number;
    avgSessionLength: number;
    retentionRate: {
      day1: number;
      day7: number;
      day30: number;
    };
  };
  
  // Environmental Impact
  impact: {
    totalWasteRecycled: number;
    co2SavedEstimate: number;
    waterSavedEstimate: number;
    wildlifeHelpedEstimate: number;
  };
  
  // Feature Usage
  featureUsage: {
    aiChatSessions: number;
    lessonsCompleted: number;
    challengesJoined: number;
    socialInteractions: number;
    mapSearches: number;
  };
  
  timestamp: Timestamp;
}

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================

export interface NotificationTemplate {
  id: string;
  type: 'daily_reminder' | 'streak_alert' | 'badge_unlock' | 'challenge_invite' | 'friend_request' | 'milestone_reached';
  
  // Content Templates
  templates: {
    title: string;
    body: string;
    actionButton?: string;
    deepLink?: string;
  };
  
  // Personalization Variables
  variables: string[]; // [userName, streakDays, badgeName, etc.]
  
  // Scheduling
  triggers: {
    condition: string; // condition that triggers this notification
    timing: 'immediate' | 'scheduled' | 'optimal_time';
    frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  };
  
  // Metadata
  isActive: boolean;
  createdAt: Timestamp;
}

export interface UserNotification {
  id: string;
  userId: string;
  
  // Notification Details
  type: string;
  title: string;
  body: string;
  imageURL?: string;
  actionButton?: string;
  deepLink?: string;
  
  // Delivery Status
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'failed';
  sentAt?: Timestamp;
  deliveredAt?: Timestamp;
  openedAt?: Timestamp;
  
  // Metadata
  createdAt: Timestamp;
  expiresAt?: Timestamp;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

// ============================================================================
// FIREBASE COLLECTION STRUCTURE
// ============================================================================

export interface FirestoreSchema {
  // Main Collections
  users: User;
  habitLogs: HabitLog;
  userStreaks: UserStreak;
  badges: Badge;
  userAchievements: UserAchievement;
  lessons: Lesson;
  userLessonProgress: UserLessonProgress;
  challenges: Challenge;
  userChallengeParticipation: UserChallengeParticipation;
  friendships: Friendship;
  communityPosts: CommunityPost;
  leaderboards: Leaderboard;
  recyclingLocations: RecyclingLocation;
  userAnalytics: UserAnalytics;
  systemMetrics: SystemMetrics;
  notificationTemplates: NotificationTemplate;
  userNotifications: UserNotification;
}

// Collection paths for easy reference
export const COLLECTIONS = {
  USERS: 'users',
  HABIT_LOGS: 'habitLogs',
  USER_STREAKS: 'userStreaks',
  BADGES: 'badges',
  USER_ACHIEVEMENTS: 'userAchievements',
  LESSONS: 'lessons',
  USER_LESSON_PROGRESS: 'userLessonProgress',
  CHALLENGES: 'challenges',
  USER_CHALLENGE_PARTICIPATION: 'userChallengeParticipation',
  FRIENDSHIPS: 'friendships',
  COMMUNITY_POSTS: 'communityPosts',
  LEADERBOARDS: 'leaderboards',
  RECYCLING_LOCATIONS: 'recyclingLocations',
  USER_ANALYTICS: 'userAnalytics',
  SYSTEM_METRICS: 'systemMetrics',
  NOTIFICATION_TEMPLATES: 'notificationTemplates',
  USER_NOTIFICATIONS: 'userNotifications',
} as const;

// Subcollections (nested under user documents)
export const SUBCOLLECTIONS = {
  USER_LOGS: 'logs',
  USER_ACHIEVEMENTS: 'achievements',
  USER_STREAKS: 'streaks',
  USER_ANALYTICS: 'analytics',
  USER_NOTIFICATIONS: 'notifications',
} as const;