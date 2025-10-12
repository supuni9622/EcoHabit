// User types
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  level: number;
  totalPoints: number;
  currentStreak: number;
  badges: string[];
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  notifications: {
    dailyReminder: boolean;
    achievementAlerts: boolean;
    streakAlerts: boolean;
    communityUpdates: boolean;
  };
  privacy: {
    shareProgress: boolean;
    showOnLeaderboard: boolean;
    allowFriendRequests: boolean;
  };
  gamification: {
    difficulty: 'easy' | 'medium' | 'hard';
    focusAreas: string[];
  };
}

// Habit types
export interface HabitLog {
  id: string;
  userId: string;
  wasteType: string;
  quantity: number;
  pointsAwarded: number;
  impact: EnvironmentalImpact;
  loggedAt: Date;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  notes?: string;
  photoUrl?: string;
}

export interface EnvironmentalImpact {
  co2Saved: number; // kg CO2
  waterSaved: number; // liters
  wildlifeSaved: number; // animals
  treesEquivalent: number; // trees
}

// Gamification types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirements: BadgeRequirements;
  rewards: BadgeRewards;
  unlockedAt?: Date;
}

export interface BadgeRequirements {
  points?: number;
  streak?: number;
  actions?: number;
  wasteTypes?: string[];
  timeFrame?: 'daily' | 'weekly' | 'monthly' | 'all-time';
}

export interface BadgeRewards {
  points: number;
  features: string[];
  title?: string;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatar?: string;
  points: number;
  level: number;
  rank: number;
  streak: number;
  badges: number;
}

// Lesson types
export interface Lesson {
  id: string;
  day: number;
  title: string;
  content: LessonContent;
  microAction: MicroAction;
  aiPrompts: AIPrompts;
  media: LessonMedia;
  unlockedAt?: Date;
  completedAt?: Date;
}

export interface LessonContent {
  story: string;
  keyMessage: string;
  visuals: string[];
  interactiveElements: string[];
}

export interface MicroAction {
  title: string;
  description: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeRequired: number; // minutes
  requirements: string[];
}

export interface AIPrompts {
  reflection: string;
  coaching: string;
  encouragement: string;
  challenge: string;
}

export interface LessonMedia {
  images: string[];
  videos?: string[];
  audio?: string[];
  threeD?: string[];
}

// Challenge types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'community' | 'special';
  requirements: ChallengeRequirements;
  rewards: ChallengeRewards;
  startDate: Date;
  endDate: Date;
  participants: string[];
  status: 'upcoming' | 'active' | 'completed' | 'expired';
}

export interface ChallengeRequirements {
  actions: number;
  wasteTypes: string[];
  points: number;
  streak: number;
}

export interface ChallengeRewards {
  points: number;
  badges: string[];
  features: string[];
  title?: string;
}

// AI Chat types
export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  context?: ChatContext;
}

export interface ChatContext {
  lessonId?: string;
  challengeId?: string;
  actionType?: string;
  userLevel: number;
  recentActions: string[];
}

// Analytics types
export interface UserAnalytics {
  userId: string;
  totalActions: number;
  totalPoints: number;
  averageDailyActions: number;
  mostActiveHours: string[];
  favoriteWasteTypes: string[];
  engagementScore: number;
  lastActiveAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
