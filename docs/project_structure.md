# EcoHabit - Project Structure

## 1. Repository Layout
```
EcoHabit/
├── frontend/              # Next.js (with Tailwind + HeroUI)
│   ├── components/        # Reusable UI components
│   ├── pages/             # Next.js pages
│   ├── hooks/             # Custom React hooks
│   ├── styles/            # Global styles, Tailwind config
│   └── public/            # Static assets
│
├── mobile/                # Expo mobile app (React Native)
│   ├── lib/
│   │   ├── screens/       # UI screens
│   │   ├── widgets/       # Reusable widgets
│   │   ├── services/      # Firebase, Gemini API integration
│   │   ├── providers/     # State management
│   │   └── utils/         # Helpers, constants
│   └── assets/            # Images, icons
│
├── backend/               # Serverless functions (Firebase Cloud Functions)
│   ├── auth/              # Authentication triggers
│   ├── notifications/     # Scheduled pushes
│   ├── gamification/      # Points, streaks, leaderboards
│   └── ai/                # Gemini API proxy handlers
│
├── firestore_rules/       # Firestore security rules
├── storage_rules/         # Firebase storage rules
├── tests/                 # Integration and unit tests
├── docs/                  # Documentation (.md files)
│   ├── requirements.md
│   ├── project_structure.md
│   ├── implementation.md
│   ├── ui_ux.md
│   ├── testing_and_bug_tracking.md
│   ├── deployment.md
│   └── lesson_plans.md
│
└── ci_cd/                 # GitHub Actions workflows, Firebase deploy scripts
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

---

**Next Step:** Move to `implementation.md` for setup, stack, and stages.

