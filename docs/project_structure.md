# EcoHabit - Project Structure

## 1. Repository Layout
```
EcoHabit/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Main CI pipeline
│       ├── deploy-web.yml            # Deploy web app
│       ├── deploy-functions.yml      # Deploy Firebase functions
│       └── test.yml                  # Test runner
│
├── apps/
│   ├── web/                          # Next.js PWA (Primary web app)
│   │   ├── components/
│   │   │   ├── ui/                   # HeroUI/ui components
│   │   │   │   ├── alert.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   └── index.ts
│   │   │   ├── layout/
│   │   │   │   ├── header.tsx
│   │   │   │   ├── navigation.tsx
│   │   │   │   ├── footer.tsx
│   │   │   │   └── sidebar.tsx
│   │   │   ├── gamification/
│   │   │   │   ├── streak-counter.tsx
│   │   │   │   ├── points-display.tsx
│   │   │   │   ├── badge-collection.tsx
│   │   │   │   ├── progress-meter.tsx
│   │   │   │   ├── leaderboard.tsx
│   │   │   │   ├── confetti-celebration.tsx
│   │   │   │   └── level-progress.tsx
│   │   │   ├── habits/
│   │   │   │   ├── habit-card.tsx
│   │   │   │   ├── habit-logger.tsx
│   │   │   │   ├── daily-challenge.tsx
│   │   │   │   ├── waste-type-selector.tsx
│   │   │   │   └── habit-streak-display.tsx
│   │   │   ├── lessons/
│   │   │   │   ├── lesson-card.tsx
│   │   │   │   ├── story-carousel.tsx
│   │   │   │   ├── micro-lesson.tsx
│   │   │   │   ├── interactive-quiz.tsx
│   │   │   │   └── reflection-prompt.tsx
│   │   │   ├── ai-chat/
│   │   │   │   ├── chat-interface.tsx
│   │   │   │   ├── chat-message.tsx
│   │   │   │   ├── typing-indicator.tsx
│   │   │   │   └── reflection-bot.tsx
│   │   │   ├── maps/
│   │   │   │   ├── recycler-map.tsx
│   │   │   │   ├── location-marker.tsx
│   │   │   │   └── directions-panel.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── impact-summary.tsx
│   │   │   │   ├── daily-overview.tsx
│   │   │   │   ├── stats-widget.tsx
│   │   │   │   └── achievement-showcase.tsx
│   │   │   ├── community/
│   │   │   │   ├── community-challenges.tsx
│   │   │   │   ├── friend-list.tsx
│   │   │   │   └── social-feed.tsx
│   │   │   ├── profile/
│   │   │   │   ├── user-profile.tsx
│   │   │   │   ├── avatar-selector.tsx
│   │   │   │   ├── settings-panel.tsx
│   │   │   │   └── preference-manager.tsx
│   │   │   ├── animations/
│   │   │   │   ├── three-avatar.tsx
│   │   │   │   ├── eco-world-scene.tsx
│   │   │   │   ├── trophy-room.tsx
│   │   │   │   └── particle-effects.tsx
│   │   │   └── common/
│   │   │       ├── loading-spinner.tsx
│   │   │       ├── error-boundary.tsx
│   │   │       ├── image-optimizer.tsx
│   │   │       └── pwa-prompt.tsx
│   │   ├── pages/
│   │   │   ├── _app.tsx
│   │   │   ├── _document.tsx
│   │   │   ├── index.tsx             # Home dashboard
│   │   │   ├── onboarding/
│   │   │   │   ├── index.tsx         # Welcome screen
│   │   │   │   ├── goals.tsx         # Goal setting
│   │   │   │   ├── preferences.tsx   # Waste categories
│   │   │   │   └── tutorial.tsx      # App tutorial
│   │   │   ├── dashboard/
│   │   │   │   └── index.tsx         # Main dashboard
│   │   │   ├── habits/
│   │   │   │   ├── index.tsx         # Habit overview
│   │   │   │   ├── log.tsx           # Log actions
│   │   │   │   └── [id].tsx          # Individual habit
│   │   │   ├── lessons/
│   │   │   │   ├── index.tsx         # Lesson library
│   │   │   │   ├── [day].tsx         # Daily lessons
│   │   │   │   └── story/[id].tsx    # Story view
│   │   │   ├── challenges/
│   │   │   │   ├── index.tsx         # Challenge overview
│   │   │   │   ├── daily.tsx         # Daily challenges
│   │   │   │   └── community.tsx     # Community challenges
│   │   │   ├── leaderboard/
│   │   │   │   └── index.tsx
│   │   │   ├── profile/
│   │   │   │   ├── index.tsx         # User profile
│   │   │   │   ├── settings.tsx      # App settings
│   │   │   │   └── achievements.tsx  # Badge collection
│   │   │   ├── map/
│   │   │   │   └── index.tsx         # Recycler locator
│   │   │   ├── chat/
│   │   │   │   └── index.tsx         # AI chat interface
│   │   │   └── api/
│   │   │       ├── auth/
│   │   │       │   └── [...nextauth].ts
│   │   │       ├── habits/
│   │   │       │   ├── log.ts
│   │   │       │   └── streak.ts
│   │   │       ├── gamification/
│   │   │       │   ├── points.ts
│   │   │       │   ├── badges.ts
│   │   │       │   └── leaderboard.ts
│   │   │       ├── ai/
│   │   │       │   └── chat.ts       # Gemini API proxy
│   │   │       ├── lessons/
│   │   │       │   └── [day].ts
│   │   │       └── users/
│   │   │           └── profile.ts
│   │   ├── lib/
│   │   │   ├── firebase/
│   │   │   │   ├── config.ts         # Firebase configuration
│   │   │   │   ├── auth.ts           # Auth helpers
│   │   │   │   ├── firestore.ts      # Firestore helpers
│   │   │   │   └── storage.ts        # Storage helpers
│   │   │   ├── hooks/
│   │   │   │   ├── use-auth.ts
│   │   │   │   ├── use-habits.ts
│   │   │   │   ├── use-gamification.ts
│   │   │   │   ├── use-lessons.ts
│   │   │   │   ├── use-streak.ts
│   │   │   │   └── use-ai-chat.ts
│   │   │   ├── services/
│   │   │   │   ├── gamification.ts   # Points, badges logic
│   │   │   │   ├── habits.ts         # Habit tracking
│   │   │   │   ├── lessons.ts        # Lesson management
│   │   │   │   ├── ai-chat.ts        # Gemini integration
│   │   │   │   ├── notifications.ts  # FCM integration
│   │   │   │   └── analytics.ts      # Event tracking
│   │   │   ├── utils/
│   │   │   │   ├── date.ts
│   │   │   │   ├── points.ts
│   │   │   │   ├── streak.ts
│   │   │   │   ├── format.ts
│   │   │   │   └── validation.ts
│   │   │   ├── constants/
│   │   │   │   ├── badges.ts
│   │   │   │   ├── challenges.ts
│   │   │   │   ├── lessons.ts
│   │   │   │   └── waste-types.ts
│   │   │   └── types/
│   │   │       ├── user.ts
│   │   │       ├── habit.ts
│   │   │       ├── gamification.ts
│   │   │       ├── lesson.ts
│   │   │       └── ai-chat.ts
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── components.css
│   │   ├── public/
│   │   │   ├── manifest.json
│   │   │   ├── sw.js                 # Service worker
│   │   │   ├── icons/                # PWA icons
│   │   │   ├── images/
│   │   │   │   ├── lessons/          # Lesson images
│   │   │   │   ├── badges/           # Badge assets
│   │   │   │   └── wildlife/         # Wildlife photos
│   │   │   └── 3d-models/            # Three.js assets
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   ├── package.json
│   │   └── .env.example
│   │
│   ├── mobile/                       # Expo React Native app
│   │   ├── app/
│   │   │   ├── (tabs)/
│   │   │   │   ├── index.tsx         # Home
│   │   │   │   ├── habits.tsx        # Habits tab
│   │   │   │   ├── lessons.tsx       # Lessons tab
│   │   │   │   ├── map.tsx           # Map tab
│   │   │   │   └── profile.tsx       # Profile tab
│   │   │   ├── onboarding/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── goals.tsx
│   │   │   │   └── tutorial.tsx
│   │   │   ├── chat/
│   │   │   │   └── index.tsx
│   │   │   ├── challenges/
│   │   │   │   └── [id].tsx
│   │   │   └── _layout.tsx
│   │   ├── components/
│   │   │   ├── ui/                   # Shared UI components
│   │   │   ├── gamification/         # Mobile gamification components
│   │   │   ├── habits/               # Habit-related components
│   │   │   ├── lessons/              # Lesson components
│   │   │   └── common/               # Common mobile components
│   │   ├── lib/
│   │   │   ├── firebase/             # Firebase mobile setup
│   │   │   ├── hooks/                # Mobile-specific hooks
│   │   │   ├── services/             # Shared with web via packages
│   │   │   └── utils/                # Mobile utilities
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── fonts/
│   │   ├── app.json
│   │   ├── expo-env.d.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── admin/                        # Optional admin panel (Next.js)
│       ├── pages/
│       │   ├── index.tsx             # Admin dashboard
│       │   ├── users.tsx             # User management
│       │   ├── lessons.tsx           # Content management
│       │   ├── challenges.tsx        # Challenge management
│       │   └── analytics.tsx         # Analytics dashboard
│       ├── components/
│       │   ├── charts/               # Analytics charts
│       │   ├── tables/               # Data tables
│       │   └── forms/                # Admin forms
│       ├── lib/
│       │   ├── firebase-admin/       # Admin SDK
│       │   └── analytics/            # Analytics processing
│       ├── package.json
│       └── tsconfig.json
│
├── packages/                         # Shared packages
│   ├── ui/                          # Shared UI components (shadcn/ui based)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   └── index.ts
│   │   │   └── lib/
│   │   │       └── utils.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared/                      # Shared business logic
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── user.ts
│   │   │   │   ├── habit.ts
│   │   │   │   ├── gamification.ts
│   │   │   │   ├── lesson.ts
│   │   │   │   └── index.ts
│   │   │   ├── utils/
│   │   │   │   ├── date.ts
│   │   │   │   ├── points-calculator.ts
│   │   │   │   ├── streak-manager.ts
│   │   │   │   ├── badge-engine.ts
│   │   │   │   └── validation.ts
│   │   │   ├── constants/
│   │   │   │   ├── badges.ts
│   │   │   │   ├── challenges.ts
│   │   │   │   ├── lessons.ts
│   │   │   │   ├── waste-types.ts
│   │   │   │   └── gamification.ts
│   │   │   └── services/
│   │   │       ├── gamification-engine.ts
│   │   │       ├── habit-tracker.ts
│   │   │       └── lesson-manager.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── firebase/                    # Firebase utilities
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   ├── firebase-config.ts
│   │   │   │   └── collections.ts
│   │   │   ├── auth/
│   │   │   │   ├── auth-service.ts
│   │   │   │   └── auth-guards.ts
│   │   │   ├── firestore/
│   │   │   │   ├── users.ts
│   │   │   │   ├── habits.ts
│   │   │   │   ├── lessons.ts
│   │   │   │   ├── gamification.ts
│   │   │   │   └── analytics.ts
│   │   │   ├── storage/
│   │   │   │   └── storage-service.ts
│   │   │   └── messaging/
│   │   │       └── fcm-service.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── eslint-config/               # Shared ESLint config
│       ├── index.js
│       └── package.json
│
├── functions/                       # Firebase Cloud Functions
│   ├── src/
│   │   ├── triggers/
│   │   │   ├── auth/
│   │   │   │   ├── on-user-create.ts
│   │   │   │   └── on-user-delete.ts
│   │   │   ├── habits/
│   │   │   │   ├── on-habit-log.ts   # Update streaks, points
│   │   │   │   └── daily-streak-reset.ts
│   │   │   ├── gamification/
│   │   │   │   ├── badge-unlock.ts
│   │   │   │   ├── level-up.ts
│   │   │   │   └── leaderboard-update.ts
│   │   │   └── notifications/
│   │   │       ├── daily-reminder.ts
│   │   │       ├── streak-alert.ts
│   │   │       └── challenge-notification.ts
│   │   ├── api/
│   │   │   ├── ai/
│   │   │   │   └── gemini-chat.ts    # Gemini API proxy
│   │   │   ├── gamification/
│   │   │   │   ├── calculate-points.ts
│   │   │   │   └── check-badges.ts
│   │   │   └── analytics/
│   │   │       └── track-events.ts
│   │   ├── scheduled/
│   │   │   ├── daily-challenges.ts   # Generate daily challenges
│   │   │   ├── weekly-summary.ts     # Weekly progress emails
│   │   │   └── cleanup-old-data.ts   # Data maintenance
│   │   ├── utils/
│   │   │   ├── firebase-admin.ts
│   │   │   ├── gemini-client.ts
│   │   │   ├── fcm-client.ts
│   │   │   └── validation.ts
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── firebase/                        # Firebase configuration
│   ├── firestore.rules
│   ├── storage.rules
│   ├── firestore.indexes.json
│   ├── firebase.json
│   └── .firebaserc
│
├── docs/                           # Documentation
│   ├── api/                        # API documentation
│   ├── deployment/                 # Deployment guides
│   ├── development/                # Development setup
│   └── architecture/               # Architecture diagrams
│
├── scripts/                        # Build and deployment scripts
│   ├── build.sh
│   ├── deploy.sh
│   ├── setup-env.sh
│   └── seed-data.js               # Initial data seeding
│
├── tests/                          # Cross-app testing
│   ├── e2e/                       # End-to-end tests
│   │   ├── cypress/
│   │   └── playwright/
│   ├── integration/               # Integration tests
│   └── performance/               # Performance tests
│
├── .github/
├── .gitignore
├── .env.example
├── package.json                   # Root package.json
├── turbo.json                     # Turborepo configuration
├── tsconfig.json                  # Root TypeScript config
├── README.md
└── LICENSE
```

## 2. Data Models
### User
```json
{
  "id": "uid123",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "avatar": "storage-url",
  "level": 3,
  "points": 1200,
  "badges": ["Recycler", "Energy Saver"]
}
```

### Habit
```json
{
  "id": "habit001",
  "title": "Recycle plastic",
  "frequency": "daily",
  "points": 50,
  "category": "Recycling"
}
```

### UserHabit
```json
{
  "userId": "uid123",
  "habitId": "habit001",
  "streak": 5,
  "completedDates": ["2025-09-20"]
}
```

### Challenge
```json
{
  "id": "challenge01",
  "title": "Plastic-Free Week",
  "participants": ["uid123", "uid456"],
  "reward": 500
}
```

## 3. Key Modules
- **Gamification Engine**: Levels, points, badges, streaks.
- **Notifications**: Smart nudges via Firebase Cloud Messaging.
- **AI Chatbot**: Gemini integration.
- **Analytics**: Usage stats, eco-impact reports.
- **Content Engine**: Lesson plans, tips, and articles.


