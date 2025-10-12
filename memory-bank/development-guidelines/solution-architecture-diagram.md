# EcoHabit - Solution Architecture Diagram

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                    USER LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│  📱 Mobile App (Expo)           🌐 Web App (Next.js PWA)        👨‍💼 Admin Panel    │
│  • React Native                 • Next.js 14+                  • Next.js        │
│  • Expo Router                  • TailwindCSS + HeroUI          • Admin SDK      │
│  • Push Notifications           • Three.js 3D                    • Analytics      │
│  • OTA Updates                  • PWA Features                   • Content Mgmt   │
│  • Camera Integration           • Service Worker                 • User Mgmt      │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ HTTP/HTTPS
                                        │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                API LAYER                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│  🔥 Firebase Cloud Functions        🌐 Next.js API Routes        🤖 AI Services   │
│  • Authentication Triggers         • /api/habits/*              • Gemini API     │
│  • Gamification Triggers           • /api/gamification/*         • AI Chat       │
│  • Notification Triggers           • /api/lessons/*             • Reflection    │
│  • Analytics Processing            • /api/ai/*                  • Coaching      │
│  • Scheduled Functions             • /api/users/*               • Content Gen   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FIREBASE SERVICES                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  🔐 Firebase Auth        📊 Firestore DB        📁 Firebase Storage    📱 FCM     │
│  • Email/Password        • Users Collection     • User Photos          • Push     │
│  • Google OAuth          • Habits Collection    • Lesson Media         • Notify   │
│  • Facebook OAuth        • Lessons Collection   • 3D Assets            • Alerts   │
│  • Anonymous Auth        • Badges Collection    • Badge Images         • Updates  │
│  • Custom Claims         • Analytics Collection • Wildlife Photos      • Remind  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            EXTERNAL INTEGRATIONS                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│  🗺️ Google Maps API        🤖 Google Gemini API      📊 Analytics Services     │
│  • Recycler Locations      • AI Chat Assistant        • Firebase Analytics      │
│  • Directions Service      • Reflection Prompts       • PostHog Analytics       │
│  • Geocoding Service       • Educational Content      • Sentry Error Tracking   │
│  • Places API              • Personalized Coaching    • Performance Monitoring  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Detailed Component Architecture

### 1. Frontend Applications

#### Web Application (Next.js PWA)
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              WEB APP ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│  🎨 UI Layer (TailwindCSS + HeroUI)                                            │
│  ├── Components/                                                               │
│  │   ├── Gamification/ (Points, Badges, Streaks, Leaderboards)                │
│  │   ├── Habits/ (Logging, Tracking, Challenges)                              │
│  │   ├── Lessons/ (Educational Content, Quizzes)                              │
│  │   ├── AI-Chat/ (Conversation Interface, Reflection)                         │
│  │   ├── Maps/ (Recycler Locator, Directions)                                  │
│  │   ├── Dashboard/ (Overview, Stats, Progress)                               │
│  │   └── Animations/ (Three.js 3D, Particle Effects)                          │
│  │                                                                             │
│  🔧 State Management (Zustand + React Query)                                   │
│  ├── User Store (Authentication, Profile, Preferences)                          │
│  ├── Gamification Store (Points, Badges, Streaks, Levels)                     │
│  ├── Habits Store (Actions, Challenges, Progress)                             │
│  └── AI Chat Store (Conversations, Context, History)                           │
│  │                                                                             │
│  🌐 API Integration (Next.js API Routes)                                       │
│  ├── /api/auth/* (Authentication Endpoints)                                   │
│  ├── /api/habits/* (Habit Logging, Tracking)                                   │
│  ├── /api/gamification/* (Points, Badges, Leaderboards)                       │
│  ├── /api/lessons/* (Educational Content)                                     │
│  ├── /api/ai/* (AI Chat, Reflection)                                          │
│  └── /api/maps/* (Recycler Locations, Directions)                             │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### Mobile Application (Expo React Native)
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            MOBILE APP ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│  📱 Native Features (Expo SDK)                                                 │
│  ├── Push Notifications (Expo Notifications)                                   │
│  ├── Camera Integration (Expo Camera)                                          │
│  ├── Location Services (Expo Location)                                         │
│  ├── OTA Updates (Expo Updates)                                                │
│  └── Social Sharing (Expo Sharing)                                            │
│  │                                                                             │
│  🎨 UI Layer (React Native + Shared Components)                                │
│  ├── Navigation (Expo Router)                                                 │
│  ├── Components (Shared with Web)                                             │
│  ├── 3D Integration (Expo GL + Three.js)                                      │
│  └── Platform-Specific UI (iOS/Android)                                        │
│  │                                                                             │
│  🔧 State Management (Shared with Web)                                        │
│  ├── Zustand Stores (Same as Web)                                              │
│  ├── React Query (Same as Web)                                                 │
│  └── Local Storage (AsyncStorage)                                              │
│  │                                                                             │
│  🌐 API Integration (Shared Firebase Services)                                │
│  ├── Firebase SDK (Mobile)                                                     │
│  ├── Offline Support (Firestore Offline)                                       │
│  └── Background Sync (Expo TaskManager)                                         │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2. Backend Services

#### Firebase Cloud Functions
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          FIREBASE CLOUD FUNCTIONS                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│  🔐 Authentication Triggers                                                     │
│  ├── onUserCreate (Initialize user profile, preferences)                       │
│  ├── onUserDelete (Cleanup user data, analytics)                               │
│  └── onUserUpdate (Update related collections)                                 │
│  │                                                                             │
│  🎮 Gamification Triggers                                                      │
│  ├── onHabitLog (Calculate points, check badges, update streaks)               │
│  ├── onBadgeUnlock (Send notification, update leaderboard)                    │
│  ├── onLevelUp (Unlock new features, send celebration)                         │
│  └── onLeaderboardUpdate (Recalculate rankings, send updates)                  │
│  │                                                                             │
│  📱 Notification Triggers                                                      │
│  ├── dailyReminder (Send daily challenge reminders)                           │
│  ├── streakAlert (Send streak maintenance alerts)                              │
│  ├── achievementNotification (Send badge unlock notifications)                 │
│  └── communityUpdate (Send community challenge updates)                        │
│  │                                                                             │
│  📊 Analytics Processing                                                        │
│  ├── trackUserAction (Log user interactions, behavior)                        │
│  ├── calculateEngagement (Measure user engagement metrics)                     │
│  ├── generateInsights (Create user behavior insights)                          │
│  └── updateRecommendations (Personalize content recommendations)                │
│  │                                                                             │
│  🤖 AI Integration                                                             │
│  ├── geminiChat (Process AI chat requests)                                     │
│  ├── reflectionAnalysis (Analyze user reflections)                             │
│  ├── contentPersonalization (Personalize lesson content)                       │
│  └── coachingRecommendations (Generate coaching suggestions)                    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### Next.js API Routes
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            NEXT.JS API ROUTES                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│  🔐 Authentication API                                                         │
│  ├── POST /api/auth/login (Email/Password, Social OAuth)                       │
│  ├── POST /api/auth/register (User registration, profile setup)                 │
│  ├── POST /api/auth/logout (Session cleanup, token invalidation)               │
│  └── GET /api/auth/me (Current user profile, preferences)                      │
│  │                                                                             │
│  🎮 Gamification API                                                           │
│  ├── POST /api/gamification/points (Calculate and award points)               │
│  ├── GET /api/gamification/badges (User badges, available badges)              │
│  ├── GET /api/gamification/leaderboard (Global, friends, local rankings)       │
│  └── POST /api/gamification/streak (Update streak, check milestones)          │
│  │                                                                             │
│  📚 Lessons API                                                                │
│  ├── GET /api/lessons/[day] (Daily lesson content, media)                     │
│  ├── POST /api/lessons/progress (Update lesson progress, completion)         │
│  ├── GET /api/lessons/quiz/[id] (Quiz questions, validation)                   │
│  └── POST /api/lessons/reflection (Save user reflections, AI analysis)         │
│  │                                                                             │
│  🤖 AI Chat API                                                                │
│  ├── POST /api/ai/chat (Process chat messages, context)                       │
│  ├── POST /api/ai/reflection (Generate reflection prompts)                     │
│  ├── POST /api/ai/coaching (Personalized coaching recommendations)             │
│  └── GET /api/ai/history (Chat history, context)                             │
│  │                                                                             │
│  🗺️ Maps API                                                                   │
│  ├── GET /api/maps/recyclers (Nearby recycling centers)                       │
│  ├── GET /api/maps/directions (Directions to recycling center)                │
│  └── POST /api/maps/feedback (User feedback on locations)                    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 3. Database Architecture

#### Firestore Collections
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            FIRESTORE DATABASE                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│  👤 Users Collection                                                           │
│  ├── {userId}                                                                  │
│  │   ├── profile (name, email, avatar, preferences)                             │
│  │   ├── gamification (level, points, streak, badges)                         │
│  │   ├── progress (totalActions, impact, achievements)                        │
│  │   └── social (friends, community, sharing)                                 │
│  │                                                                             │
│  📊 Habit Logs Collection                                                      │
│  ├── {logId}                                                                   │
│  │   ├── userId (reference to user)                                           │
│  │   ├── wasteType (plastic, paper, e-waste, organic)                          │
│  │   ├── quantity (number of items)                                           │
│  │   ├── pointsAwarded (calculated points)                                     │
│  │   ├── impact (environmental impact calculation)                            │
│  │   └── loggedAt (timestamp, date)                                           │
│  │                                                                             │
│  🏆 Badges Collection                                                          │
│  ├── {badgeId}                                                                 │
│  │   ├── name (badge title)                                                   │
│  │   ├── description (badge description)                                        │
│  │   ├── requirements (unlock criteria)                                       │
│  │   ├── rarity (common, uncommon, rare, epic, legendary)                      │
│  │   └── rewards (points, features unlocked)                                  │
│  │                                                                             │
│  📚 Lessons Collection                                                         │
│  ├── {lessonId}                                                                 │
│  │   ├── day (lesson number 1-25)                                              │
│  │   ├── title (lesson title)                                                  │
│  │   ├── content (story, visuals, key message)                                 │
│  │   ├── microAction (challenge, points, gamification)                        │
│  │   ├── aiPrompts (reflection prompts, coaching)                             │
│  │   └── media (images, videos, 3D assets)                                    │
│  │                                                                             │
│  🗺️ Recycling Locations Collection                                            │
│  ├── {locationId}                                                              │
│  │   ├── name (location name)                                                  │
│  │   ├── address (full address)                                                │
│  │   ├── coordinates (latitude, longitude)                                     │
│  │   ├── acceptedWaste (waste types accepted)                                  │
│  │   ├── operatingHours (business hours)                                      │
│  │   └── contact (phone, email, website)                                       │
│  │                                                                             │
│  📈 Analytics Collection                                                       │
│  ├── {analyticsId}                                                             │
│  │   ├── userId (user reference)                                              │
│  │   ├── eventType (action, lesson, challenge)                                 │
│  │   ├── eventData (event details, metadata)                                  │
│  │   ├── timestamp (when event occurred)                                       │
│  │   └── context (user context, session data)                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 4. External Integrations

#### Google Services Integration
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            EXTERNAL INTEGRATIONS                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│  🗺️ Google Maps API                                                           │
│  ├── Places API (Find recycling centers)                                      │
│  ├── Directions API (Navigation to locations)                                 │
│  ├── Geocoding API (Address to coordinates)                                  │
│  └── Distance Matrix API (Calculate distances)                                │
│  │                                                                             │
│  🤖 Google Gemini API                                                          │
│  ├── Chat Completion (AI chat responses)                                       │
│  ├── Content Generation (Personalized content)                                │
│  ├── Reflection Analysis (Analyze user responses)                              │
│  └── Coaching Recommendations (Personalized coaching)                          │
│  │                                                                             │
│  📊 Analytics Services                                                         │
│  ├── Firebase Analytics (User behavior, engagement)                           │
│  ├── PostHog Analytics (Product analytics, feature usage)                     │
│  ├── Sentry Error Tracking (Error monitoring, performance)                    │
│  └── Performance Monitoring (App performance, load times)                      │
│  │                                                                             │
│  🔔 Notification Services                                                      │
│  ├── Firebase Cloud Messaging (Push notifications)                            │
│  ├── Expo Notifications (Mobile notifications)                                │
│  ├── Email Service (Transactional emails)                                     │
│  └── SMS Service (Emergency notifications)                                     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 5. Data Flow Architecture

#### User Action Flow
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              USER ACTION FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  1. User logs eco-action                                                       │
│     ↓                                                                          │
│  2. Frontend validates input                                                   │
│     ↓                                                                          │
│  3. API route processes request                                                │
│     ↓                                                                          │
│  4. Cloud Function triggers                                                    │
│     ├── Calculate points                                                       │
│     ├── Check badge unlocks                                                    │
│     ├── Update streak                                                          │
│     └── Update leaderboard                                                     │
│     ↓                                                                          │
│  5. Firestore updates                                                          │
│     ├── User document                                                          │
│     ├── Habit log document                                                     │
│     └── Analytics document                                                     │
│     ↓                                                                          │
│  6. Real-time updates                                                          │
│     ├── Frontend state update                                                  │
│     ├── Push notification (if badge unlocked)                                  │
│     └── Leaderboard refresh                                                    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### AI Chat Flow
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                AI CHAT FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│  1. User sends message                                                          │
│     ↓                                                                          │
│  2. Frontend captures context                                                  │
│     ├── User profile                                                           │
│     ├── Recent actions                                                         │
│     ├── Current lesson                                                         │
│     └── Chat history                                                           │
│     ↓                                                                          │
│  3. API route processes request                                                │
│     ├── Validate message                                                       │
│     ├── Build context prompt                                                   │
│     └── Call Gemini API                                                        │
│     ↓                                                                          │
│  4. Gemini API responds                                                        │
│     ├── Generate response                                                      │
│     ├── Apply safety filters                                                   │
│     └── Return formatted response                                              │
│     ↓                                                                          │
│  5. Response processing                                                        │
│     ├── Save to chat history                                                   │
│     ├── Update user context                                                    │
│     └── Send to frontend                                                       │
│     ↓                                                                          │
│  6. Frontend updates                                                           │
│     ├── Display response                                                       │
│     ├── Update chat history                                                    │
│     └── Trigger follow-up actions                                              │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 6. Security Architecture

#### Authentication & Authorization
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            SECURITY ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│  🔐 Authentication Layer                                                       │
│  ├── Firebase Auth (Email/Password, Social OAuth)                             │
│  ├── JWT Tokens (Session management)                                          │
│  ├── Custom Claims (Role-based access)                                        │
│  └── Anonymous Auth (Guest mode)                                              │
│  │                                                                             │
│  🛡️ Authorization Layer                                                       │
│  ├── Firestore Security Rules (Database access control)                        │
│  ├── API Route Protection (Endpoint access control)                            │
│  ├── Cloud Function Security (Function access control)                        │
│  └── Admin Panel Security (Admin access control)                             │
│  │                                                                             │
│  🔒 Data Protection                                                            │
│  ├── Input Validation (Zod schemas)                                            │
│  ├── Rate Limiting (API abuse prevention)                                     │
│  ├── Data Encryption (Sensitive data protection)                              │
│  └── Privacy Controls (User data sharing preferences)                          │
│  │                                                                             │
│  📊 Monitoring & Logging                                                       │
│  ├── Security Events (Authentication failures, suspicious activity)           │
│  ├── Error Tracking (Application errors, performance issues)                   │
│  ├── Audit Logs (User actions, system changes)                                │
│  └── Compliance (GDPR, data protection regulations)                           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 7. Deployment Architecture

#### Production Deployment
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            DEPLOYMENT ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│  🌐 Web Application (Vercel)                                                  │
│  ├── Next.js App (Static generation, SSR)                                     │
│  ├── CDN (Global edge caching)                                               │
│  ├── SSL (Automatic HTTPS)                                                    │
│  └── Custom Domain (Production domain)                                        │
│  │                                                                             │
│  📱 Mobile Application (EAS)                                                   │
│  ├── App Store (iOS distribution)                                             │
│  ├── Google Play (Android distribution)                                       │
│  ├── OTA Updates (Expo Updates)                                               │
│  └── Push Notifications (FCM)                                                 │
│  │                                                                             │
│  🔥 Backend Services (Firebase)                                               │
│  ├── Cloud Functions (Serverless backend)                                     │
│  ├── Firestore (NoSQL database)                                               │
│  ├── Firebase Auth (Authentication service)                                    │
│  ├── Firebase Storage (File storage)                                         │
│  └── Firebase Hosting (Backup hosting)                                       │
│  │                                                                             │
│  🚀 CI/CD Pipeline (GitHub Actions)                                           │
│  ├── Code Quality (ESLint, Prettier, TypeScript)                              │
│  ├── Testing (Unit, Integration, E2E)                                         │
│  ├── Building (Multi-platform builds)                                         │
│  └── Deployment (Automated deployment)                                       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

This comprehensive solution architecture provides a complete overview of the EcoHabit system, showing how all components interact to create a scalable, maintainable, and efficient gamified waste management application.
