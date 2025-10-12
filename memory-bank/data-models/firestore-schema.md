# Firestore Database Schema - EcoHabit

## Core Collections

### Users Collection
```typescript
interface User {
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
```

### Habit Logs Collection
```typescript
interface HabitLog {
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
```

### User Streaks Collection
```typescript
interface UserStreak {
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
```

### Badges Collection
```typescript
interface Badge {
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
```

### User Achievements Collection
```typescript
interface UserAchievement {
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
```

### Lessons Collection
```typescript
interface Lesson {
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
```

### User Lesson Progress Collection
```typescript
interface UserLessonProgress {
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
```

### Challenges Collection
```typescript
interface Challenge {
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
```

### User Challenge Participation Collection
```typescript
interface UserChallengeParticipation {
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
```

### Community Posts Collection
```typescript
interface CommunityPost {
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
```

### Leaderboards Collection
```typescript
interface Leaderboard {
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
```

### Recycling Locations Collection
```typescript
interface RecyclingLocation {
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
```

## Subcollections

### User-Specific Subcollections
```typescript
// users/{userId}/logs
interface UserLog {
  id: string;
  type: string;
  quantity: number;
  pointsAwarded: number;
  loggedAt: Timestamp;
}

// users/{userId}/achievements
interface UserAchievement {
  badgeId: string;
  unlockedAt: Timestamp;
  progress: number;
  level: number;
}

// users/{userId}/streaks
interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastLogDate: Timestamp;
}

// users/{userId}/analytics
interface UserAnalytics {
  daily: {
    [dateString: string]: {
      actionsLogged: number;
      pointsEarned: number;
      timeSpentInApp: number;
    };
  };
  patterns: {
    mostActiveTimeOfDay: string;
    preferredWasteTypes: string[];
    averageSessionLength: number;
    streakConsistency: number;
    engagementTrend: 'increasing' | 'stable' | 'decreasing';
  };
}

// users/{userId}/notifications
interface UserNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  status: 'pending' | 'sent' | 'delivered' | 'opened';
  createdAt: Timestamp;
}
```

## Indexing Strategy

### Composite Indexes
```json
{
  "collectionGroup": "habitLogs",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "userId", "order": "ASCENDING"},
    {"fieldPath": "date", "order": "DESCENDING"}
  ]
}
```

### Array Indexes
```json
{
  "collectionGroup": "users",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "gamification.badges", "arrayConfig": "CONTAINS"}
  ]
}
```

### Geospatial Indexes
```json
{
  "collectionGroup": "recyclingLocations",
  "queryScope": "COLLECTION",
  "fields": [
    {"fieldPath": "coordinates", "order": "ASCENDING"}
  ]
}
```

## Security Rules

### User Data Access
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Habit logs are private to the user
    match /habitLogs/{logId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Public leaderboards are readable by all authenticated users
    match /leaderboards/{leaderboardId} {
      allow read: if request.auth != null;
      allow write: if false; // Only server can write
    }
  }
}
```

## Data Validation

### Zod Schemas
```typescript
import { z } from 'zod';

export const UserSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().min(1).max(100),
  profile: z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
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
    rank: z.string().min(1).max(50)
  })
});
```

## Performance Optimization

### Batch Operations
```typescript
// Update multiple related documents atomically
const batch = db.batch();
const userRef = db.collection('users').doc(userId);
const streakRef = db.collection('userStreaks').doc(userId);
const logRef = db.collection('habitLogs').doc();

batch.update(userRef, {
  'gamification.totalPoints': FieldValue.increment(points),
  'progress.totalActionsLogged': FieldValue.increment(1)
});

batch.set(streakRef, {
  currentStreak: { days: newStreak, lastLogDate: Timestamp.now() }
});

batch.set(logRef, {
  userId,
  type: wasteType,
  quantity,
  pointsAwarded: points,
  loggedAt: Timestamp.now()
});

await batch.commit();
```

### Query Optimization
```typescript
// Use composite indexes for efficient queries
const leaderboardQuery = db.collection('users')
  .where('gamification.totalPoints', '>', 0)
  .orderBy('gamification.totalPoints', 'desc')
  .limit(100);

// Use subcollections for user-specific data
const userLogsQuery = db.collection('users')
  .doc(userId)
  .collection('logs')
  .orderBy('loggedAt', 'desc')
  .limit(50);
```
