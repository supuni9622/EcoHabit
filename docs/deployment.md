# Deployment Guide – EcoHabit

## 1. Deployment

### Frontend Deployment

1. Vercel (native Next.js deployment)
- Handles SSR/SSG, CI/CD, PWA support
- Integrates with GitHub for automated deployments

2. PWA Optimization
- Ensure service worker works
- Cache lessons, badges, and assets for offline use

### Backend Deployment

1. Next.js API Routes → deployed with frontend on Vercel

2. Cloud Functions

- Gamification logic: Firestore triggers for streaks, badges
- Notification triggers

### Firebase Setup

1. Firestore

- Structured collections: users, lessons, streaks, points, badges, logs
- Security rules for authenticated access

2. Storage
- Lesson assets, optional user photo uploads

3. Authentication
- Email, Google, social logins

4. FCM
- Configure topics for daily reminders, streak alerts

5. Gemini API backend

For deploying applications that utilize the Gemini API:

- Firebase Hosting: Deploy your frontend using Firebase Hosting, which integrates seamlessly with Firebase services and provides SSL out of the box.

- Cloud Functions: Use Firebase Cloud Functions to handle API requests securely and efficiently.

- Monitoring: Implement monitoring tools like Firebase Crashlytics and Google Cloud Monitoring to track application performance and errors.

### CI/CD Pipeline

1. GitHub Actions

- On push → run lint, tests, build
- Deploy to staging or production

2. Monitoring

- Firebase Crashlytics for errors
- Sentry for frontend exception tracking
- Analytics: Firebase + PostHog for retention and engagement metrics

### Suggested Timeline for Testing & Deployment

| Week | Activity                                                     |
| ---- | ------------------------------------------------------------ |
| 1    | Setup dev environment, Firebase emulators, mock AI responses |
| 2    | Unit & integration testing of frontend + backend             |
| 3    | E2E testing with Cypress / Playwright                        |
| 4    | Staging deployment → internal QA                             |
| 5    | Production deployment → monitor & analytics setup            |
| 6    | Post-launch bug fixes & PWA optimizations                    |

---

## Other Factors

### 1. Backend
- Firebase Cloud Functions for gamification engine, AI chat proxy, notifications
- Firestore as primary database
- Firebase Storage for images and media assets

### 2. CI/CD
- GitHub Actions workflow:
  - Push to `dev` → deploy to Firebase staging
  - PR merged to `main` → deploy to production
  - Automated tests before deployment

### 3. Monitoring & Logging
- Firebase Analytics for user engagement
- Crashlytics for runtime errors
- Cloud Logging for function triggers and errors
- Alerts for failed deployments

### 4. Scaling & Cost Optimization
- Start on Firebase free tier for MVP
- Limit media storage and API calls
- Use Cloud Functions sparingly; migrate heavy processing to Cloud Run if necessary
- Optimize Firestore structure to minimize reads/writes

---

## Environment Setup

### Environments

1. development: local dev + Firebase emulator
2. staging: preview release for internal testing
3. production: live PWA

### Environment Variables

- Store API keys (Gemini, Google Maps) and Firebase configs securely
- Use .env.local, .env.staging, .env.production

