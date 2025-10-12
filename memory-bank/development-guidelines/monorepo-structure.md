# EcoHabit - Monorepo Structure & Turborepo Configuration

## Repository Overview

EcoHabit uses a **Turborepo + pnpm** monorepo structure to efficiently manage multiple applications and shared packages while maximizing code reuse between web and mobile platforms.

## Root Configuration

### package.json (Root)
```json
{
  "name": "ecohabit",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*",
    "functions/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "firebase:emulators": "firebase emulators:start",
    "firebase:deploy": "firebase deploy"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "prettier": "^3.0.0",
    "turbo": "latest",
    "typescript": "^5.0.0"
  },
  "packageManager": "pnpm@8.0.0",
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

### turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

## Apps Structure

### 1. Web App (Next.js PWA)
**Location**: `apps/web/`
**Purpose**: Primary web application with PWA capabilities

**Key Features**:
- Next.js 14+ with App Router
- TailwindCSS + HeroUI components
- Three.js for 3D gamification
- PWA with service worker
- Firebase integration

**Package.json**:
```json
{
  "name": "@ecohabit/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@ecohabit/ui": "workspace:*",
    "@ecohabit/shared": "workspace:*",
    "@ecohabit/firebase": "workspace:*",
    "next": "14.0.0",
    "react": "18.0.0",
    "react-dom": "18.0.0",
    "@next/three": "^9.0.0",
    "three": "^0.158.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.88.0",
    "framer-motion": "^10.16.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "zod": "^3.22.0"
  }
}
```

### 2. Mobile App (Expo React Native)
**Location**: `apps/mobile/`
**Purpose**: Native mobile application with shared business logic

**Key Features**:
- Expo SDK 50+
- React Native with TypeScript
- Shared packages for business logic
- Push notifications via Expo
- OTA updates

**Package.json**:
```json
{
  "name": "@ecohabit/mobile",
  "version": "0.1.0",
  "private": true,
  "main": "expo/AppEntry.js",
  "scripts": {
    "dev": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build": "expo build",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@ecohabit/ui": "workspace:*",
    "@ecohabit/shared": "workspace:*",
    "@ecohabit/firebase": "workspace:*",
    "expo": "~50.0.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "expo-router": "~3.4.0",
    "expo-notifications": "~0.27.0",
    "expo-updates": "~0.24.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0"
  }
}
```

### 3. Admin Panel (Next.js)
**Location**: `apps/admin/`
**Purpose**: Content management and analytics dashboard

**Key Features**:
- Admin dashboard for content management
- User analytics and insights
- Lesson and challenge management
- Firebase Admin SDK integration

## Shared Packages

### 1. UI Components Package
**Location**: `packages/ui/`
**Purpose**: Shared UI components for web and mobile

**Structure**:
```
packages/ui/
├── src/
│   ├── components/
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── progress.tsx
│   │   └── index.ts
│   └── lib/
│       └── utils.ts
├── package.json
└── tsconfig.json
```

### 2. Shared Business Logic
**Location**: `packages/shared/`
**Purpose**: Core business logic shared between platforms

**Key Modules**:
- **Gamification Engine**: Points, badges, streaks, levels
- **Habit Tracker**: Action logging and tracking
- **Lesson Manager**: Educational content delivery
- **Validation**: Zod schemas for data validation

### 3. Firebase Utilities
**Location**: `packages/firebase/`
**Purpose**: Firebase configuration and utilities

**Key Features**:
- Firebase configuration
- Authentication helpers
- Firestore operations
- Cloud Functions utilities
- FCM integration

### 4. ESLint Configuration
**Location**: `packages/eslint-config/`
**Purpose**: Shared linting rules across all packages

## Firebase Cloud Functions

**Location**: `functions/`
**Purpose**: Serverless backend logic

**Key Functions**:
- **Authentication Triggers**: User creation/deletion
- **Gamification Triggers**: Points, badges, streaks
- **Notification Triggers**: Daily reminders, achievements
- **AI Integration**: Gemini API proxy
- **Analytics**: Event tracking and processing

## Development Workflow

### 1. Local Development
```bash
# Install dependencies
pnpm install

# Start all apps in development
pnpm dev

# Start specific app
pnpm dev --filter=@ecohabit/web
pnpm dev --filter=@ecohabit/mobile

# Start Firebase emulators
pnpm firebase:emulators
```

### 2. Building
```bash
# Build all packages and apps
pnpm build

# Build specific app
pnpm build --filter=@ecohabit/web
```

### 3. Testing
```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm test --filter=@ecohabit/shared
```

### 4. Code Quality
```bash
# Lint all packages
pnpm lint

# Type check all packages
pnpm type-check

# Format code
pnpm format
```

## Code Sharing Strategy

### Shared Components
- **UI Components**: Reusable components in `@ecohabit/ui`
- **Business Logic**: Core logic in `@ecohabit/shared`
- **Firebase Utils**: Database operations in `@ecohabit/firebase`

### Platform-Specific Code
- **Web**: Next.js specific routing, PWA features, Three.js 3D
- **Mobile**: Expo specific navigation, push notifications, native features
- **Admin**: Admin-specific components and Firebase Admin SDK

### Type Safety
- **Shared Types**: Common interfaces in `@ecohabit/shared`
- **Platform Types**: Platform-specific types in respective apps
- **Validation**: Zod schemas for runtime type checking

## Deployment Strategy

### Web App
- **Platform**: Vercel (optimized for Next.js)
- **Domain**: Custom domain with SSL
- **CDN**: Global edge caching
- **PWA**: Service worker for offline functionality

### Mobile App
- **Platform**: Expo Application Services (EAS)
- **Distribution**: App Store and Google Play Store
- **Updates**: Over-the-air updates via Expo
- **Push Notifications**: FCM integration

### Backend
- **Functions**: Firebase Cloud Functions
- **Database**: Firestore
- **Storage**: Firebase Storage
- **Hosting**: Firebase Hosting (backup)

## Benefits of This Structure

### 1. Code Reuse
- **Shared Business Logic**: Single source of truth for core features
- **Consistent UI**: Same components across platforms
- **Type Safety**: Shared TypeScript interfaces

### 2. Development Efficiency
- **Parallel Development**: Web and mobile teams can work simultaneously
- **Shared Testing**: Common test suites for business logic
- **Unified Tooling**: Single linting, formatting, and build pipeline

### 3. Maintenance
- **Single Updates**: Update shared logic once, affects all platforms
- **Consistent Behavior**: Same user experience across platforms
- **Easier Debugging**: Centralized business logic

### 4. Scalability
- **Independent Scaling**: Each app can scale independently
- **Shared Resources**: Common packages reduce bundle size
- **Future-Proof**: Easy to add new platforms (desktop, etc.)

## Next Steps

1. **Initialize Monorepo**: Set up Turborepo structure
2. **Create Packages**: Build shared packages first
3. **Setup Apps**: Configure web and mobile apps
4. **Firebase Integration**: Connect all apps to Firebase
5. **Development Environment**: Set up local development with emulators
6. **Testing Pipeline**: Implement comprehensive testing strategy
7. **Deployment Pipeline**: Set up CI/CD for all platforms
