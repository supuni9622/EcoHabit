# EcoHabit - System Patterns & Architecture

## Monorepo Structure (Turborepo + pnpm)

### Repository Layout
```
EcoHabit/
├── apps/
│   ├── web/                    # Next.js PWA (Primary)
│   ├── mobile/                 # Expo React Native
│   └── admin/                  # Optional admin panel
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── shared/                 # Business logic & types
│   ├── firebase/               # Firebase utilities
│   └── eslint-config/          # Shared linting config
├── functions/                  # Firebase Cloud Functions
├── firebase/                   # Firebase configuration
├── tests/                      # Cross-app testing
└── docs/                       # Documentation
```

### Package Dependencies
- **Root**: Turborepo, pnpm, TypeScript, ESLint, Prettier
- **Web**: Next.js 14+, React 18, TailwindCSS, HeroUI, Three.js
- **Mobile**: Expo SDK, React Native, shared TypeScript logic
- **Shared**: Zustand, React Query, Zod validation

## Component Architecture

### Domain-Driven Organization
```
components/
├── gamification/               # Points, streaks, badges, leaderboards
├── habits/                     # Habit tracking and logging
├── lessons/                    # Educational content delivery
├── ai-chat/                    # AI chat interface
├── maps/                       # Recycler locator
├── dashboard/                  # Main dashboard widgets
├── community/                  # Social features
├── profile/                    # User profile management
├── animations/                 # Three.js 3D elements
└── common/                     # Shared utilities
```

### Component Patterns
- **Atomic Design**: Atoms → Molecules → Organisms → Templates
- **Compound Components**: Related components grouped together
- **Render Props**: Flexible component composition
- **Custom Hooks**: Business logic separation from UI

## State Management Architecture

### Zustand Stores
```typescript
// User state management
interface UserStore {
  user: User | null;
  profile: UserProfile | null;
  preferences: UserPreferences;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

// Gamification state
interface GamificationStore {
  points: number;
  level: number;
  streak: number;
  badges: Badge[];
  leaderboard: LeaderboardEntry[];
  addPoints: (amount: number) => void;
  updateStreak: (days: number) => void;
  unlockBadge: (badgeId: string) => void;
}
```

### React Query Integration
- **Server State**: User data, habits, leaderboards
- **Caching Strategy**: Stale-while-revalidate for real-time updates
- **Optimistic Updates**: Immediate UI updates with rollback
- **Background Refetching**: Keep data fresh without user interaction

## Database Schema & Firestore Collections

### Core Collections
```typescript
// User management
users/{userId} {
  profile: UserProfile;
  gamification: GamificationData;
  progress: ProgressMetrics;
  social: SocialData;
}

// Habit tracking
habitLogs/{logId} {
  userId: string;
  type: WasteType;
  quantity: number;
  pointsAwarded: number;
  impactMessage: string;
  loggedAt: Timestamp;
}

// Gamification
badges/{badgeId} {
  name: string;
  description: string;
  requirements: BadgeRequirements;
  rarity: BadgeRarity;
}

userAchievements/{userId}/achievements/{achievementId} {
  badgeId: string;
  unlockedAt: Timestamp;
  progress: number;
}
```

### Subcollections Pattern
- **User-specific data**: `users/{userId}/logs`, `users/{userId}/achievements`
- **Real-time updates**: Listeners for streaks, points, leaderboards
- **Batch operations**: Update multiple related documents atomically

## Firebase Services Integration

### Authentication
- **Providers**: Email/password, Google, Facebook
- **Security Rules**: User-based access control
- **Anonymous Auth**: Guest mode for trial users

### Firestore
- **Real-time Listeners**: Live updates for gamification
- **Offline Support**: Local caching with sync
- **Security Rules**: Role-based access patterns
- **Indexes**: Optimized queries for leaderboards

### Cloud Functions
- **Triggers**: User actions → gamification updates
- **Scheduled**: Daily challenges, streak resets
- **AI Proxy**: Gemini API integration
- **Notifications**: FCM for engagement

### Storage
- **User Content**: Profile photos, action photos
- **Media Assets**: Lesson images, badge graphics
- **3D Models**: Three.js assets for gamification

## Gamification Engine Architecture

### Points Calculation
```typescript
class GamificationEngine {
  static calculatePoints(wasteType: string, quantity: number): number {
    const basePoints = POINT_VALUES[wasteType];
    const multiplier = quantity >= 10 ? 1.5 : quantity >= 5 ? 1.2 : 1;
    return Math.round(basePoints * quantity * multiplier);
  }
  
  static calculateEnvironmentalImpact(wasteType: string, quantity: number) {
    return {
      co2Saved: quantity * IMPACT_FACTORS[wasteType].co2PerKg,
      waterSaved: quantity * IMPACT_FACTORS[wasteType].waterPerItem,
      wildlifeSaved: quantity * IMPACT_FACTORS[wasteType].wildlifePerItem
    };
  }
}
```

### Badge System
- **Rule Engine**: Configurable badge requirements
- **Progress Tracking**: Real-time progress toward badges
- **Notification System**: Badge unlock celebrations
- **Social Sharing**: Achievement sharing capabilities

### Streak Management
- **Daily Tracking**: Maintain streaks across time zones
- **Recovery System**: Streak freeze for missed days
- **Milestone Rewards**: Special rewards for streak achievements
- **Analytics**: Streak consistency metrics

## Three.js Integration Patterns

### 3D Gamification Elements
- **Avatar Progression**: Visual character evolution
- **Trophy Room**: 3D badge collection display
- **Eco World**: Interactive environmental scenes
- **Particle Effects**: Celebration animations

### Performance Optimization
- **Lazy Loading**: Load 3D assets on demand
- **Asset Compression**: Optimized GLTF/GLB models
- **Fallback Rendering**: 2D alternatives for low-end devices
- **Progressive Enhancement**: Basic → Enhanced experience

## API Architecture

### Next.js API Routes
```typescript
// /api/habits/log
export async function POST(request: Request) {
  const { userId, wasteType, quantity } = await request.json();
  
  // Validate input
  const validatedData = HabitLogSchema.parse({ userId, wasteType, quantity });
  
  // Calculate points and impact
  const points = GamificationEngine.calculatePoints(wasteType, quantity);
  const impact = GamificationEngine.calculateEnvironmentalImpact(wasteType, quantity);
  
  // Update Firestore
  await updateUserProgress(userId, points, impact);
  
  // Check for badge unlocks
  const newBadges = await checkBadgeUnlocks(userId);
  
  return Response.json({ points, impact, badges: newBadges });
}
```

### Firebase Functions
- **Gamification Triggers**: Automatic point/streak updates
- **AI Chat Proxy**: Secure Gemini API integration
- **Notification Scheduler**: Daily reminders and celebrations
- **Analytics Processing**: User behavior analysis

## Testing Architecture

### Playwright E2E Testing
- **User Journeys**: Complete user flows from registration to habit formation
- **Cross-Platform**: Web and mobile app testing
- **Visual Regression**: UI consistency across devices
- **Performance**: Load time and interaction responsiveness

### Unit & Integration Testing
- **Jest + React Testing Library**: Component testing
- **Firebase Emulator**: Backend integration testing
- **Mock Services**: AI chat and external API mocking
- **Accessibility**: Screen reader and keyboard navigation

## Deployment Architecture

### Web Application (Vercel)
- **Static Generation**: Pre-rendered lesson content
- **Server-Side Rendering**: Dynamic user dashboards
- **Edge Functions**: Global performance optimization
- **CDN**: Asset delivery optimization

### Mobile Application (EAS)
- **Over-the-Air Updates**: Quick bug fixes and feature updates
- **App Store Distribution**: iOS and Android stores
- **Push Notifications**: FCM integration
- **Deep Linking**: Seamless web-to-app transitions

### Firebase Backend
- **Auto-scaling**: Serverless function scaling
- **Global CDN**: Firebase Hosting optimization
- **Real-time Sync**: Live data synchronization
- **Security**: Built-in authentication and authorization

## Performance Patterns

### Frontend Optimization
- **Code Splitting**: Route-based and component-based splitting
- **Image Optimization**: Next.js Image component with WebP
- **Bundle Analysis**: Webpack bundle analyzer for size optimization
- **Caching Strategy**: Service worker for offline functionality

### Backend Optimization
- **Firestore Indexes**: Optimized query performance
- **Batch Operations**: Reduce read/write operations
- **Caching**: Redis for frequently accessed data
- **Cost Optimization**: Stay within Firebase free tier limits

## Security Patterns

### Data Protection
- **Input Validation**: Zod schemas for all user inputs
- **Rate Limiting**: Prevent abuse of API endpoints
- **Data Encryption**: Sensitive data encryption at rest
- **Privacy Controls**: User data sharing preferences

### Authentication Security
- **JWT Tokens**: Secure session management
- **Role-Based Access**: Admin vs user permissions
- **Social Login**: Secure OAuth integration
- **Anonymous Mode**: Guest access with limited features
