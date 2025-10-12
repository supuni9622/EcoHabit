# Development Environment Setup - EcoHabit

## Overview

This guide provides comprehensive instructions for setting up the local development environment for EcoHabit, including Firebase emulators, development tools, and debugging configurations.

## 1. Prerequisites

### Required Software

- **Node.js**: 18.0.0 or higher
- **pnpm**: 8.0.0 or higher
- **Firebase CLI**: Latest version
- **Expo CLI**: Latest version (for mobile development)
- **Git**: Latest version

### Installation Commands

```bash
# Install Node.js (via nvm recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Install pnpm
npm install -g pnpm@8.15.0

# Install Firebase CLI
npm install -g firebase-tools

# Install Expo CLI
npm install -g @expo/cli

# Verify installations
node --version
pnpm --version
firebase --version
expo --version
```

## 2. Project Setup

### Clone and Install

```bash
# Clone repository
git clone https://github.com/your-username/ecohabit.git
cd ecohabit

# Install dependencies
pnpm install

# Build shared packages
pnpm build --filter=@ecohabit/shared
pnpm build --filter=@ecohabit/ui
pnpm build --filter=@ecohabit/firebase
```

### Environment Configuration

```bash
# Copy environment template
cp env.example .env.local

# Edit environment variables
nano .env.local
```

**Required Environment Variables:**

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ecohabit-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ecohabit-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ecohabit-dev.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Google Services
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# Development
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

## 3. Firebase Emulators Setup

### Initialize Firebase

```bash
# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Select the following services:
# - Firestore
# - Functions
# - Hosting
# - Storage
# - Emulators
```

### Emulator Configuration

The `firebase.json` file is already configured with:

```json
{
  "emulators": {
    "auth": { "port": 9099 },
    "functions": { "port": 5001 },
    "firestore": { "port": 8080 },
    "hosting": { "port": 5000 },
    "storage": { "port": 9199 },
    "ui": { "enabled": true, "port": 4000 }
  }
}
```

### Start Emulators

```bash
# Start all emulators
firebase emulators:start

# Or start specific emulators
firebase emulators:start --only firestore,auth,functions
```

**Emulator URLs:**
- **Firebase UI**: http://localhost:4000
- **Firestore**: http://localhost:8080
- **Auth**: http://localhost:9099
- **Functions**: http://localhost:5001
- **Storage**: http://localhost:9199
- **Hosting**: http://localhost:5000

## 4. Development Scripts

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "dev:web": "turbo run dev --filter=@ecohabit/web",
    "dev:mobile": "turbo run dev --filter=@ecohabit/mobile",
    "dev:functions": "turbo run dev --filter=functions",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean",
    "firebase:emulators": "firebase emulators:start",
    "firebase:deploy": "firebase deploy",
    "setup": "pnpm install && pnpm build"
  }
}
```

### Development Workflow

```bash
# Start all development servers
pnpm dev

# Start specific services
pnpm dev:web          # Web app only
pnpm dev:mobile       # Mobile app only
pnpm dev:functions    # Functions only

# Start Firebase emulators
pnpm firebase:emulators

# Run tests
pnpm test

# Lint code
pnpm lint

# Type check
pnpm type-check
```

## 5. Web Development Setup

### Next.js Development

```bash
# Navigate to web app
cd apps/web

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

**Web App URLs:**
- **Development**: http://localhost:3000
- **Firebase Hosting**: http://localhost:5000

### Web App Features

- **Hot Reload**: Automatic reload on file changes
- **TypeScript**: Full type checking
- **TailwindCSS**: Utility-first CSS framework
- **Three.js**: 3D graphics for gamification
- **PWA**: Progressive Web App capabilities

### Web Development Tools

```bash
# Install additional tools
pnpm add -D @types/node @types/react @types/react-dom

# Install debugging tools
pnpm add -D @next/bundle-analyzer
```

## 6. Mobile Development Setup

### Expo Development

```bash
# Navigate to mobile app
cd apps/mobile

# Install dependencies
pnpm install

# Start Expo development server
pnpm dev
```

**Mobile Development URLs:**
- **Expo Dev Tools**: http://localhost:8081
- **Metro Bundler**: http://localhost:8081
- **Expo Go**: Scan QR code with Expo Go app

### Mobile Development Tools

```bash
# Install Expo CLI globally
npm install -g @expo/cli

# Install EAS CLI for builds
npm install -g eas-cli

# Login to Expo
expo login
```

### Mobile Testing

```bash
# Run on Android
pnpm android

# Run on iOS
pnpm ios

# Run on web
pnpm web

# Run on specific device
expo start --tunnel
```

## 7. Functions Development

### Cloud Functions Setup

```bash
# Navigate to functions
cd functions

# Install dependencies
pnpm install

# Build functions
pnpm build

# Start functions emulator
pnpm dev
```

**Functions Development:**
- **Local Functions**: http://localhost:5001
- **Function Logs**: Check terminal output
- **Function Testing**: Use Firebase UI

### Function Development Tools

```bash
# Install function testing tools
pnpm add -D firebase-functions-test

# Install debugging tools
pnpm add -D @types/node
```

## 8. Database Development

### Firestore Emulator

```bash
# Start Firestore emulator
firebase emulators:start --only firestore

# Import test data
firebase firestore:import ./test-data

# Export data
firebase firestore:export ./backup
```

### Database Tools

```bash
# Install Firestore tools
npm install -g firebase-tools

# Install database utilities
pnpm add -D firebase-admin
```

### Test Data Setup

```bash
# Create test data
mkdir test-data
cd test-data

# Create seed data
cat > users.json << EOF
{
  "users": {
    "test-user-1": {
      "email": "test@example.com",
      "displayName": "Test User",
      "level": 1,
      "totalPoints": 0,
      "currentStreak": 0,
      "badges": [],
      "preferences": {
        "notifications": {
          "dailyReminder": true,
          "achievementAlerts": true,
          "streakAlerts": true,
          "communityUpdates": true
        }
      }
    }
  }
}
EOF

# Import test data
firebase firestore:import ./test-data
```

## 9. Debugging Setup

### VS Code Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Web App",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/apps/web/node_modules/.bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}/apps/web",
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "name": "Debug Functions",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/functions/lib/index.js",
      "cwd": "${workspaceFolder}/functions",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

### Debugging Tools

```bash
# Install debugging tools
pnpm add -D @types/node
pnpm add -D firebase-functions-test

# Install performance monitoring
pnpm add -D @next/bundle-analyzer
```

### Logging Configuration

```typescript
// apps/web/lib/logger.ts
import { getAnalytics, logEvent } from 'firebase/analytics';

export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
    
    // Log to Firebase Analytics
    if (typeof window !== 'undefined') {
      const analytics = getAnalytics();
      logEvent(analytics, 'error_occurred', {
        error_message: message,
        error_code: error?.name,
      });
    }
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  }
};
```

## 10. Testing Setup

### Test Configuration

```bash
# Install testing dependencies
pnpm add -D jest @testing-library/react @testing-library/jest-dom
pnpm add -D playwright @playwright/test
pnpm add -D cypress
```

### Test Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:cypress": "cypress run"
  }
}
```

### Test Files

```typescript
// packages/shared/src/__tests__/gamification.test.ts
import { GamificationEngine } from '../services/gamification-engine';

describe('GamificationEngine', () => {
  test('should calculate points correctly', () => {
    expect(GamificationEngine.calculatePoints('plastic', 5)).toBe(50);
  });
  
  test('should calculate level correctly', () => {
    expect(GamificationEngine.calculateLevel(1500)).toBe(2);
  });
});
```

## 11. Performance Monitoring

### Bundle Analysis

```bash
# Analyze web bundle
cd apps/web
pnpm build
pnpm analyze

# Analyze mobile bundle
cd apps/mobile
expo export --platform android
```

### Performance Tools

```bash
# Install performance tools
pnpm add -D @next/bundle-analyzer
pnpm add -D webpack-bundle-analyzer
```

### Monitoring Setup

```typescript
// apps/web/lib/performance.ts
import { getPerformance, trace } from 'firebase/performance';

export const performanceMonitor = {
  startTrace: (name: string) => {
    const perf = getPerformance();
    return trace(perf, name);
  },
  
  measureFunction: async (name: string, fn: () => Promise<any>) => {
    const trace = performanceMonitor.startTrace(name);
    trace.start();
    
    try {
      const result = await fn();
      return result;
    } finally {
      trace.stop();
    }
  }
};
```

## 12. Development Workflow

### Daily Development

```bash
# Start development environment
pnpm dev

# In another terminal, start emulators
pnpm firebase:emulators

# Run tests
pnpm test

# Check types
pnpm type-check

# Lint code
pnpm lint
```

### Code Quality

```bash
# Format code
pnpm format

# Lint and fix
pnpm lint --fix

# Type check
pnpm type-check

# Run all checks
pnpm lint && pnpm type-check && pnpm test
```

### Git Workflow

```bash
# Pre-commit hooks
npx husky install
npx husky add .husky/pre-commit "pnpm lint-staged"

# Commit workflow
git add .
git commit -m "feat: add new feature"
git push origin feature-branch
```

## 13. Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check port usage
   lsof -i :3000
   lsof -i :8080
   
   # Kill processes
   kill -9 $(lsof -t -i:3000)
   ```

2. **Firebase Emulator Issues**
   ```bash
   # Reset emulators
   firebase emulators:start --import=./emulator-data --export-on-exit
   
   # Clear emulator data
   rm -rf emulator-data
   ```

3. **Dependency Issues**
   ```bash
   # Clear node_modules
   rm -rf node_modules
   rm -rf apps/*/node_modules
   rm -rf packages/*/node_modules
   
   # Reinstall
   pnpm install
   ```

4. **Build Issues**
   ```bash
   # Clean build artifacts
   pnpm clean
   
   # Rebuild
   pnpm build
   ```

### Debug Commands

```bash
# Check Firebase project
firebase projects:list

# Check emulator status
firebase emulators:start --debug

# Check function logs
firebase functions:log

# Check Firestore data
firebase firestore:get /users/test-user-1
```

## 14. Production Preparation

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] No linting errors
- [ ] Type checking passes
- [ ] Build succeeds
- [ ] Emulators working
- [ ] Environment variables set
- [ ] Firebase project configured
- [ ] Functions deployed
- [ ] Database rules tested

### Deployment Commands

```bash
# Deploy to Firebase
firebase deploy

# Deploy specific services
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only storage:rules

# Deploy web app
cd apps/web
pnpm build
firebase deploy --only hosting
```

This comprehensive development environment setup ensures that all developers can quickly get started with the EcoHabit project and have access to all necessary tools for efficient development.
