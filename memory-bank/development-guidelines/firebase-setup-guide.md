# Firebase Setup Guide - EcoHabit

## Overview

This guide provides step-by-step instructions for setting up Firebase services for the EcoHabit project, including authentication, Firestore database, storage, functions, and analytics.

## 1. Firebase Project Creation

### Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com](https://console.firebase.google.com)
   - Click "Create a project"

2. **Project Configuration**
   - **Project name**: `ecohabit` (or `ecohabit-dev` for development)
   - **Project ID**: `ecohabit-{random-id}` (will be auto-generated)
   - **Region**: Choose closest to your users (e.g., `us-central1`)

3. **Google Analytics**
   - Enable Google Analytics
   - Choose or create Analytics account
   - Select data sharing settings

### Step 2: Project Settings

1. **General Settings**
   - Go to Project Settings (gear icon)
   - Note down the Project ID
   - Copy the Web API Key

2. **Service Accounts**
   - Go to Service Accounts tab
   - Generate new private key
   - Download the JSON file (keep it secure)

## 2. Authentication Setup

### Enable Authentication Methods

1. **Go to Authentication**
   - Navigate to Authentication > Sign-in method
   - Enable the following providers:

2. **Email/Password**
   - Enable Email/Password
   - Enable Email link (passwordless sign-in)

3. **Google Sign-In**
   - Enable Google
   - Add your domain to authorized domains
   - Configure OAuth consent screen

4. **Facebook Sign-In** (Optional)
   - Enable Facebook
   - Add Facebook App ID and App Secret
   - Configure Facebook App settings

### Configure Authorized Domains

Add the following domains to authorized domains:
- `localhost` (for development)
- `ecohabit.vercel.app` (for production)
- `ecohabit-dev.vercel.app` (for staging)

## 3. Firestore Database Setup

### Create Firestore Database

1. **Go to Firestore Database**
   - Navigate to Firestore Database
   - Click "Create database"

2. **Security Rules**
   - Choose "Start in test mode" for development
   - Use the provided `firestore.rules` file for production

3. **Database Location**
   - Choose the same region as your project
   - Recommended: `us-central1` or `asia-southeast1`

### Import Initial Data

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init firestore

# Import seed data
firebase firestore:import ./seed-data
```

## 4. Firebase Storage Setup

### Configure Storage

1. **Go to Storage**
   - Navigate to Storage
   - Click "Get started"

2. **Security Rules**
   - Use the provided `storage.rules` file
   - Test rules in the Firebase Console

3. **Storage Bucket**
   - Note the bucket name
   - Configure CORS if needed

### Storage Structure

```
ecohabit-storage/
├── users/
│   └── {userId}/
│       ├── avatars/
│       ├── photos/
│       └── documents/
├── public/
│   ├── badges/
│   ├── lessons/
│   └── wildlife/
└── lessons/
    ├── images/
    ├── videos/
    └── 3d-models/
```

## 5. Cloud Functions Setup

### Deploy Functions

1. **Install Dependencies**
   ```bash
   cd functions
   pnpm install
   ```

2. **Build Functions**
   ```bash
   pnpm build
   ```

3. **Deploy Functions**
   ```bash
   firebase deploy --only functions
   ```

### Function Configuration

1. **Environment Variables**
   ```bash
   firebase functions:config:set gemini.api_key="your_gemini_api_key"
   firebase functions:config:set maps.api_key="your_maps_api_key"
   ```

2. **Function Permissions**
   - Ensure functions have proper IAM roles
   - Configure function triggers

## 6. Firebase Hosting Setup

### Configure Hosting

1. **Go to Hosting**
   - Navigate to Hosting
   - Click "Get started"

2. **Build Web App**
   ```bash
   cd apps/web
   pnpm build
   ```

3. **Deploy to Hosting**
   ```bash
   firebase deploy --only hosting
   ```

### Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to Hosting > Custom domains
   - Add your domain
   - Configure DNS records

2. **SSL Certificate**
   - Firebase automatically provisions SSL
   - Wait for certificate to be issued

## 7. Firebase Analytics Setup

### Enable Analytics

1. **Go to Analytics**
   - Navigate to Analytics
   - Enable Google Analytics

2. **Configure Events**
   - Set up custom events for gamification
   - Configure conversion tracking

### Custom Events

```typescript
// Track user actions
analytics.logEvent('habit_logged', {
  waste_type: 'plastic',
  quantity: 5,
  points_awarded: 50
});

// Track badge unlocks
analytics.logEvent('badge_unlocked', {
  badge_id: 'plastic_protector',
  badge_name: 'Plastic Protector',
  user_level: 3
});

// Track lesson completion
analytics.logEvent('lesson_completed', {
  lesson_id: 'day_1',
  lesson_title: 'The Plastic Problem',
  completion_time: 300
});
```

## 8. Firebase Cloud Messaging (FCM)

### Configure FCM

1. **Go to Cloud Messaging**
   - Navigate to Cloud Messaging
   - Note the Server Key

2. **Web Configuration**
   - Add FCM to web app
   - Configure service worker

3. **Mobile Configuration**
   - Add FCM to Expo app
   - Configure push notifications

### Notification Templates

```typescript
// Daily reminder
const dailyReminder = {
  title: "🌿 Daily Eco Challenge",
  body: "Complete today's eco-action and earn points!",
  data: { type: 'daily_reminder' }
};

// Achievement notification
const achievementNotification = {
  title: "🏅 Badge Unlocked!",
  body: "You earned the Plastic Protector badge!",
  data: { type: 'achievement', badge_id: 'plastic_protector' }
};

// Streak alert
const streakAlert = {
  title: "🔥 Streak Alert!",
  body: "Your streak will break in 2 hours. Log an action now!",
  data: { type: 'streak_alert' }
};
```

## 9. Environment Configuration

### Web App (.env.local)

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
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key
NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=EcoHabit
```

### Mobile App (app.json)

```json
{
  "expo": {
    "name": "EcoHabit",
    "slug": "ecohabit",
    "extra": {
      "firebase": {
        "apiKey": "your_api_key_here",
        "authDomain": "ecohabit-dev.firebaseapp.com",
        "projectId": "ecohabit-dev",
        "storageBucket": "ecohabit-dev.appspot.com",
        "messagingSenderId": "your_sender_id",
        "appId": "your_app_id"
      }
    }
  }
}
```

### Functions (.env)

```bash
# Firebase Admin
FIREBASE_PROJECT_ID=ecohabit-dev
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@ecohabit-dev.iam.gserviceaccount.com

# External APIs
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_maps_api_key

# Analytics
POSTHOG_KEY=your_posthog_key
SENTRY_DSN=your_sentry_dsn
```

## 10. Security Configuration

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Habit logs are user-specific
    match /habitLogs/{logId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Lessons are public read-only
    match /lessons/{lessonId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}
```

### Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload and manage their own files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public assets are read-only
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}
```

## 11. Monitoring and Logging

### Firebase Performance Monitoring

1. **Enable Performance Monitoring**
   - Go to Performance
   - Enable automatic collection
   - Configure custom traces

2. **Custom Metrics**
   ```typescript
   import { getPerformance } from 'firebase/performance';
   
   const perf = getPerformance();
   const trace = trace(perf, 'habit_logging');
   trace.start();
   // ... log habit
   trace.stop();
   ```

### Error Monitoring

1. **Firebase Crashlytics**
   - Enable Crashlytics
   - Add to web and mobile apps
   - Configure error reporting

2. **Custom Error Tracking**
   ```typescript
   import { logEvent } from 'firebase/analytics';
   
   // Track errors
   logEvent('error_occurred', {
     error_message: error.message,
     error_code: error.code,
     user_id: user.uid
   });
   ```

## 12. Testing and Development

### Firebase Emulators

1. **Start Emulators**
   ```bash
   firebase emulators:start
   ```

2. **Emulator Configuration**
   - Firestore: `localhost:8080`
   - Auth: `localhost:9099`
   - Functions: `localhost:5001`
   - Storage: `localhost:9199`
   - UI: `localhost:4000`

3. **Test Data**
   ```bash
   # Import test data
   firebase firestore:import ./test-data --project=ecohabit-dev
   
   # Export production data
   firebase firestore:export ./backup --project=ecohabit-prod
   ```

### Local Development

1. **Web App**
   ```bash
   cd apps/web
   pnpm dev
   # App runs on http://localhost:3000
   ```

2. **Mobile App**
   ```bash
   cd apps/mobile
   pnpm dev
   # Scan QR code with Expo Go
   ```

3. **Functions**
   ```bash
   cd functions
   pnpm dev
   # Functions run on localhost:5001
   ```

## 13. Production Deployment

### Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] Security rules tested
- [ ] Functions deployed and tested
- [ ] Database indexes created
- [ ] Storage rules configured
- [ ] Analytics events configured
- [ ] FCM notifications working
- [ ] Custom domain configured (if applicable)

### Deployment Commands

```bash
# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only firestore:rules
firebase deploy --only functions
firebase deploy --only hosting
firebase deploy --only storage:rules
```

### Post-deployment

1. **Verify Services**
   - Test authentication
   - Test database operations
   - Test file uploads
   - Test push notifications

2. **Monitor Performance**
   - Check Firebase Console
   - Monitor function execution
   - Check error rates
   - Monitor usage quotas

## 14. Cost Optimization

### Firebase Free Tier Limits

- **Firestore**: 50K reads, 20K writes, 20K deletes per day
- **Storage**: 5GB storage, 1GB download per day
- **Functions**: 2M invocations per month
- **Hosting**: 10GB storage, 10GB transfer per month

### Optimization Strategies

1. **Firestore Optimization**
   - Use composite indexes
   - Implement pagination
   - Cache frequently accessed data
   - Use batch operations

2. **Storage Optimization**
   - Compress images
   - Use appropriate formats
   - Implement CDN caching

3. **Functions Optimization**
   - Minimize cold starts
   - Use appropriate memory allocation
   - Implement caching

## 15. Troubleshooting

### Common Issues

1. **Authentication Issues**
   - Check authorized domains
   - Verify API keys
   - Check OAuth configuration

2. **Firestore Issues**
   - Check security rules
   - Verify indexes
   - Check quota limits

3. **Functions Issues**
   - Check environment variables
   - Verify IAM permissions
   - Check function logs

4. **Storage Issues**
   - Check security rules
   - Verify CORS configuration
   - Check file permissions

### Debug Commands

```bash
# Check Firebase project
firebase projects:list

# Check functions logs
firebase functions:log

# Check Firestore data
firebase firestore:get /users/userId

# Test security rules
firebase firestore:rules:test
```

This comprehensive Firebase setup guide ensures that all services are properly configured for the EcoHabit project, providing a solid foundation for development and production deployment.
