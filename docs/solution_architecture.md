# EcoHabit - Solution Architecture & Development Plan

## 1. Solution Architecture Overview


┌─────────────────────────────────────────────────────────────────┐
│                        USER DEVICES                             │
├─────────────────────────────────────────────────────────────────┤
│  Web PWA (Next.js)    │    Mobile App (Expo)    │  Admin Panel  │
│  - HeroUI Components  │    - Native UI           │  - Analytics  │
│  - Three.js 3D        │    - Shared Logic        │  - Content    │
│  - PWA Features       │    - Cross-platform      │  - Management │
│  - Offline Support    │    - Push Notifications  │  - Monitoring │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API LAYER (Next.js API Routes)              │
├─────────────────────────────────────────────────────────────────┤
│  Authentication  │  Gamification  │  AI Chat  │  Content API    │
│  - Firebase Auth │  - Points      │  - Gemini │  - Lessons      │
│  - Social Login  │  - Streaks     │  - Proxy  │  - Challenges   │
│  - User Mgmt     │  - Badges      │  - Safety │  - Static Data  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   FIREBASE CLOUD FUNCTIONS                     │
├─────────────────────────────────────────────────────────────────┤
│  Triggers        │  Scheduled     │  AI Proxy    │  Analytics   │
│  - User Actions  │  - Daily Reset │  - Gemini    │  - Events    │
│  - Gamification  │  - Reminders   │  - Content   │  - Metrics   │
│  - Notifications │  - Cleanup     │  - Moderation│  - Reports   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FIREBASE SERVICES                         │
├─────────────────────────────────────────────────────────────────┤
│  Firestore DB    │  Authentication│  Storage     │  Messaging   │
│  - Users         │  - Email/Pass  │  - Images    │  - Push      │
│  - Habits        │  - Social      │  - Avatars   │  - Topics    │
│  - Gamification  │  - Anonymous   │  - Assets    │  - Targeting │
│  - Analytics     │  - JWT Tokens  │  - Backups   │  - Scheduling│
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS                       │
├─────────────────────────────────────────────────────────────────┤
│  Google Gemini   │  Maps API      │  Analytics   │  Monitoring  │
│  - AI Chat       │  - Locations   │  - PostHog   │  - Sentry    │
│  - Reflections   │  - Directions  │  - Firebase  │  - Logging   │
│  - Content Gen   │  - Geocoding   │  - Custom    │  - Alerts    │
└─────────────────────────────────────────────────────────────────┘


## 2. Technology Stack

### Frontend Stack
- **Web**: Next.js 14+ (App Router), React 18, TypeScript
- **Mobile**: Expo (React Native), TypeScript
- **UI Library**: HeroUI (NextUI v2) with Tailwind CSS
- **3D Graphics**: Three.js with react-three-fiber
- **State Management**: Zustand + React Context
- **Animations**: Framer Motion, CSS Transitions
- **PWA**: Next.js PWA plugin, Service Workers

### Backend Stack
- **API**: Next.js API Routes (Serverless)
- **Functions**: Firebase Cloud Functions (Node.js)
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Messaging**: Firebase Cloud Messaging (FCM)

### Infrastructure & DevOps
- **Hosting**: Vercel (Web), Firebase Hosting (Backup)
- **Mobile Distribution**: Expo Application Services (EAS)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry, Firebase Crashlytics
- **Analytics**: Firebase Analytics, PostHog

### AI & External Services
- **AI Chat**: Google Gemini API
- **Maps**: Google Maps API / Mapbox
- **Image Optimization**: Next.js Image, Vercel
- **Email**: Firebase Extensions / SendGrid

## 3. Core Features Architecture

### 3.1 Gamification Engine
```typescript
interface GamificationEngine {
  pointsCalculator: {
    calculatePoints(action: UserAction): number;
    updateUserPoints(userId: string, points: number): Promise<void>;
  };
  
  streakManager: {
    updateStreak(userId: string, action: UserAction): Promise<StreakResult>;
    resetStreaks(): Promise<void>;
    getStreakStatus(userId: string): Promise<StreakData>;
  };
  
  badgeEngine: {
    checkBadgeUnlocks(userId: string, newData: UserData): Promise<Badge[]>;
    awardBadge(userId: string, badgeId: string): Promise<void>;
    getUserBadges(userId: string): Promise<Badge[]>;
  };
  
  leaderboard: {
    updateUserRanking(userId: string): Promise<void>;
    getLeaderboard(type: 'global' | 'friends' | 'local'): Promise<LeaderboardEntry[]>;
  };
}
```

### 3.2 Habit Tracking System
```typescript
interface HabitTrackingSystem {
  logger: {
    logAction(userId: string, action: EcoAction): Promise<ActionResult>;
    getActionHistory(userId: string, timeframe: TimeFrame): Promise<EcoAction[]>;
    validateAction(action: EcoAction): ValidationResult;
  };
  
  streakTracker: {
    getCurrentStreak(userId: string): Promise<number>;
    updateDailyStreak(userId: string): Promise<StreakUpdate>;
    getStreakHistory(userId: string): Promise<StreakHistory>;
  };
  
  impactCalculator: {
    calculateEnvironmentalImpact(actions: EcoAction[]): ImpactMetrics;
    getPersonalImpactSummary(userId: string): Promise<ImpactSummary>;
  };
}
```

### 3.3 AI Chat Integration
```typescript
interface AIChatSystem {
  chatHandler: {
    processUserMessage(message: string, context: ChatContext): Promise<AIResponse>;
    generateReflectionPrompt(userActivity: UserActivity): Promise<string>;
    moderateContent(message: string): Promise<ModerationResult>;
  };
  
  contentGenerator: {
    generateDailyTip(userPreferences: UserPreferences): Promise<string>;
    createPersonalizedChallenge(userData: UserData): Promise<Challenge>;
  };
}
```

## 4. Data Models & Schema

### 4.1 User Data Model
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Timestamp;
  
  // Gamification
  level: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  badges: BadgeId[];
  
  // Preferences
  preferences: {
    wasteCategories: WasteType[];
    notifications: NotificationSettings;
    privacy: PrivacySettings;
    language: 'en' | 'si' | 'ta';
  };
  
  // Progress
  stats: {
    totalActionsLogged: number;
    lessonsCompleted: number;
    challengesCompleted: number;
    impactMetrics: ImpactMetrics;
  };
}
```

### 4.2 Habit & Action Model
```typescript
interface EcoAction {
  id: string;
  userId: string;
  type: 'plastic' | 'paper' | 'e-waste' | 'organic' | 'general';
  quantity: number;
  unit: 'items' | 'kg' | 'liters';
  timestamp: Timestamp;
  location?: GeoPoint;
  photo?: string;
  verified: boolean;
  
  // Gamification
  pointsAwarded: number;
  badgesUnlocked?: BadgeId[];
  streakUpdated: boolean;
}

interface DailyChallenge {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: EcoActionType;
  target: number;
  points: number;
  participants: number;
  completed: boolean;
}
```

### 4.3 Lesson Content Model
```typescript
interface Lesson {
  id: string;
  day: number;
  title: string;
  category: 'awareness' | 'knowledge' | 'empowerment' | 'empathy';
  
  content: {
    story: string;
    visualPrompt: string;
    keyMessage: string;
    impactFacts: string[];
  };
  
  challenge: {
    title: string;
    description: string;
    type: EcoActionType;
    target: number;
    points: number;
  };
  
  reflection: {
    prompt: string;
    followUpQuestions: string[];
  };
  
  gamification: {
    completionPoints: number;
    badgeUnlocks?: BadgeId[];
    unlockRequirements?: UnlockRequirement[];
  };
}
```