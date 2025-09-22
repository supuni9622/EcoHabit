# Implementation

## Recommended Tech Stack

### Frontend (Web)
- **Next.js (React, TypeScript)** → SEO-friendly, server-side rendering, fast development.
- **Tailwind CSS + HeroUI** → modern UI components, responsive design.
- **Three.js + react-three-fiber** → gamified 3D visualizations (habits, progress).
- **PWA support** → offline-first, push notifications, installable app.

### Frontend (Mobile)
- **Expo (React Native)** → fast iteration, shared TypeScript code with Next.js, easy deployment.
- **OTA updates (Expo Updates)** → quick bug fixes without full store release.
- **Future Migration Path: Flutter** → if we hit performance bottlenecks (e.g., GPU-heavy 3D rendering, animations, AR integrations). Architecture is modular to allow migration.

### Backend & AI
- **Firebase** (Firestore, Auth, Functions, Storage, FCM) → cost-optimized for MVP, scales with usage.
- **Gemini API** → AI-driven eco-friendly chat assistant.
- **Sketchfab MCP Server + Three.js** → simplified 3D model integration.

### Gamification Engine
- Rule-based system stored in **Firestore**.
- Achievement engine triggered by **Cloud Functions**.
- Real-time progress updates via **Firestore listeners**.

### Notifications
- **Firebase Cloud Messaging (FCM)** → push notifications for reminders, streak alerts.
- **In-app notifications** → for gamification milestones.

### Maps & Location Services
- **Google Maps API + Mapbox (optional)** → eco-habit tracking based on locations (e.g., walking routes, cycling miles).

---

## Implementation Stages

### Stage 1: Setup Development Environment
- IDE: **Cursor** (with AI-assisted workflows).
- Monorepo structure with **Turborepo** → separates `apps/` (web, mobile) and `packages/` (shared libs).
- ESLint, Prettier, Husky → enforce clean code.
- GitHub Actions → CI/CD pipeline setup.

### Stage 2: Core Features
- Firebase project setup (Firestore, Auth, FCM).
- Web PWA + Expo mobile app skeleton.
- User onboarding & authentication.
- Habit tracking + streaks + leaderboards.

### Stage 3: Gamification & AI
- Integrate Three.js for progress visualization.
- Add Gemini-powered eco chat assistant.
- Launch notification system (daily challenges, eco-tips).

### Stage 4: Scaling & Optimization
- Optimize Firestore rules for cost efficiency.
- Add image optimization for PWA.
- Prepare for possible **Flutter migration path** if mobile performance issues arise.

---

## Technical Overview 

1. Frontend

| Layer                     | Recommendation               | Notes                                                                        |
| ------------------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| Framework                 | **Next.js**                  | SSR/SSG support → fast load + SEO friendly for landing pages and content.    |
| Styling                   | **TailwindCSS** + **HeroUI** | Rapid UI prototyping + ready-made components + dark mode support.            |
| Animations / Gamification | **Framer Motion** +**Three.js**          | Smooth animations for badges, streaks, confetti, and micro-interactions.     |
| State Management          | **Zustand / React Context**  | Lightweight for user state, streaks, points, and lesson progress.            |
| PWA / Mobile Support      | Next.js PWA plugin           | Enable offline caching, installable app for Android/iOS (hybrid experience). |

2. Backend

| Layer               | Recommendation                                           | Notes                                                                                    |
| ------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| API Framework       | **Next.js API routes**  | For lightweight MVP, Next.js API routes suffice.                                         |
| Database            | **Firebase Firestore**                                   | Real-time updates for streaks, leaderboards, and community feeds. Serverless + scalable. |
| Authentication      | **Firebase Auth**                                        | Supports email/password, Google, and social login (low friction).                        |
| Gamification Engine | Store points, badges, streaks in Firestore               | Simple rules engine in backend → increment points on logging actions.                    |
| Media Storage       | **Firebase Storage**                                     | For optional photo uploads / lesson assets.                                              |
| Notifications       | **Firebase Cloud Messaging (FCM)**                       | Push notifications → daily challenges, streak reminders.                                 |


3. AI Chat / Reflection

| Layer                | Recommendation          | Notes                                                                       |
| -------------------- | ----------------------- | --------------------------------------------------------------------------- |
| AI Model             | **Google Gemini API**    | Handle empathetic chat prompts, reflective journaling, encouragement.       |
| Backend Middleware   | Node.js API route       | Forward user messages → call Gemini API → format response.                     |
| Optional Fine-tuning | Custom prompt templates | Tailor responses to eco-conscious and psychologically reinforcing messages. |


4. Gamification & Habit Loops

| Feature               | Implementation                                                                                 |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| Points / Streaks      | Firestore counters + cloud functions for auto-increment, streak reset logic.                   |
| Badges / Achievements | Firestore collection → unlock rules stored + served dynamically.                               |
| Leaderboards          | Firestore queries → sort by points, filter by friends/community.                               |
| Micro-Lessons         | Static JSON / CMS (e.g., Sanity or Contentful) → served via Next.js API → PWA offline caching. |
| Confetti & Animations | Framer Motion + HeroUI components.                                                             |

5. Maps / Recycler Locator 

| Layer                    | Recommendation                               | Notes                                         |
| ------------------------ | -------------------------------------------- | --------------------------------------------- |
| Map                      | **Google Maps API / Mapbox**                 | Display recycler locations.                   |
| Geolocation              | HTML5 geolocation API                        | Center map on user, filter nearest recyclers. |
| Optional QR/NFC (Future) | Can integrate for high-fidelity verification | Not needed for initial MVP.                   |


6. Tech Flow Overview

User Frontend (Next.js + HeroUI + Tailwind + PWA)
       ↓
Firestore DB (streaks, points, badges, lesson progress, leaderboards)
       ↓
Backend API Routes / Cloud Functions (points calculation, gamification logic)
       ↓
Google Gemini API (AI reflection & chat)
       ↓
Push Notifications (FCM for daily challenges / streak reminders)

###⚡ Additional Recommendations

- Hybrid Mobile Experience:

Start with PWA → fast iteration, installable on Android/iOS.

Future: wrap with Capacitor or Expo for App Store / Play Store deployment.

- Content Management:

Use Sanity CMS or Contentful for lessons, micro-stories, and challenges → allows easy updates without redeploy.

- Analytics / Metrics:

Track daily active users, streak retention, lesson completion rates.

Firebase + Google Analytics or PostHog for privacy-focused tracking.

- Scalability:

Serverless backend (Next.js + Firebase) → scales automatically as users increase.

Gamification engine + AI prompts are lightweight → can handle thousands of concurrent users on day 1.

---

# Full MVP Tech Architecture

┌───────────────────────────────────────────────┐
│               User Devices (Web/PWA)         │
│-----------------------------------------------│
│  Next.js + TailwindCSS + HeroUI + Framer     │
│  Motion + Three.js (animations, confetti, micro-rewards)│
│  PWA capabilities (installable, offline cache)│
│  Geolocation API for recycler locator         │
│                                               │
└─────────────────────────┬─────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────┐
│          Backend / API Routes (Next.js)       │
│-----------------------------------------------│
│  - Gamification Engine:                        │
│      • Points calculation                      │
│      • Streaks & badges                        │
│      • Level-up rules                           │
│  - Lesson & Challenge API                      │
│  - Leaderboards & community stats             │
│  - Firestore Middleware (CRUD for user data)  │
│                                               │
└───────────────┬───────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────┐
│             Firebase Services                 │
│-----------------------------------------------│
│  - Firestore (User progress, streaks, badges, │
│               lesson completion, leaderboard) │
│  - Storage (Photo uploads, lesson media)      │
│  - Cloud Functions (Gamification logic, push  │
│    notifications triggers)                    │
│  - Firebase Auth (Email / Social login)       │
│  - FCM Notifications (daily challenges, streak│
│    reminders)                                 │
└───────────────┬───────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────┐
│                 AI Chat Layer                 │
│-----------------------------------------------│
│  - Google Gemini API (Empathetic chat,        │
│    reflection, encouragement, eco-coaching) │
│  - Backend Middleware forwards user messages │
│  - Optional fine-tuning for eco-specific      │
│    responses                                  │
└───────────────┬───────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────┐
│             External APIs / Services          │
│-----------------------------------------------│
│  - Google Maps / Mapbox: Recycler Locator     │
│  - Optional future QR/NFC integration         │
│  - Analytics: Firebase + Google Analytics /   │
│    PostHog for user behavior & retention      │
└───────────────────────────────────────────────┘



---

##🔧 Updated Tech Stack

### Frontend (Web):

- Next.js + Tailwind + HeroUI (UI)
- Three.js for interactive 3D gamification visuals (avatars, trophies, eco-world maps)
- Sketchfab MCP server → integration layer for rendering and managing 3D models easily

### Mobile (Expo):

- Standard gamification UI
- Optional Three.js-powered components embedded via WebView or Flutter packages

### Backend:

- Firebase (Firestore, Auth, Storage, Functions, FCM)
- Firebase Functions as the middle layer for Gemini API + Sketchfab MCP server requests

### AI Chat:

- Gemini API → proxied through Firebase Functions

### Gamification Engine:

- Runs in Firebase Functions
- Syncs streaks, points, badges
- Triggers 3D model unlocks (e.g., eco-avatar level up in Three.js scene)

### IDE & Dev Setup:

- Cursor IDE → ideal since it supports AI-assisted workflows
GitHub Actions → CI/CD pipelines
- Firebase Emulator Suite → local testing for Firestore, Functions, Auth
- Sketchfab MCP server running locally or on cloud for 3D model retrieval

---

##🎮 Where Three.js Fits In

1. 3D Avatar Progression:

- As users recycle, their eco-avatar evolves (seed → sapling → tree, or turtle → ocean guardian).
- Three.js renders this progression with real-time animations.

2. Badge/Trophy Room (3D Gallery):

- Instead of flat badges, users get a 3D “eco-room” where they can see all their unlocked trophies.
- Sketchfab MCP helps pull in pre-built 3D models without building everything from scratch.

3. Interactive Storytelling:

- Daily eco-lessons could include lightweight 3D animations (plastic floating in ocean → user action removes it).
- Makes content immersive and emotionally stronger.

###⚡ Deployment Note

- For MVP: use static lightweight 3D assets (GLTF/GLB models) → keep Firebase Hosting costs low.
- For scale: offload heavy 3D rendering to Sketchfab MCP server and fetch models dynamically.
- Use lazy loading in Next.js to ensure 3D assets don’t slow down the main app.


---

## Development Workflow

### Branch Structure
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature development branches
- `hotfix/*`: Production hotfixes

### Code Organization Principles
1. **Domain-Driven**: Organize by business domain, not technical layers
2. **Separation of Concerns**: Clear boundaries between handlers, services, and data access
3. **Shared Types**: Centralized type definitions prevent drift between frontend/backend
4. **Consistent Naming**: Follow established conventions across all packages
5. **Modular Architecture**: Each domain should be independently testable and deployable

---


## Naming Conventions

### File Naming
- **Components**: PascalCase (e.g., `CustomerList.tsx`)
- **Handlers**: kebab-case with domain prefix (e.g., `customer.get.handler.ts`)
- **Services**: PascalCase with Service suffix (e.g., `CustomerService.ts`)
- **Types**: kebab-case (e.g., `customer.types.ts`)
- **Utils**: kebab-case (e.g., `date.utils.ts`)

### Directory Organization
- Group by domain/feature rather than technical layer
- Use plural names for collections (e.g., `handlers/`, `components/`)
- Separate concerns: handlers, services, types, utils

## Import Path Conventions

### Backend Imports
```typescript
// Absolute imports from src root
import { CustomerService } from 'lib/services/customer.service';
import { AuthMiddleware } from 'middlewares/auth.provider';
import { CustomerHandler } from 'handlers/customer/customer.get.handler';
```

### Frontend Imports
```typescript
// Relative imports for local components
import { Button } from '../ui/button';
import { CustomerList } from './CustomerList';

// Absolute imports for services and utilities
import { CustomerService } from '@/services/CustomerService';
import { useAuthStore } from '@/store/useAuthStore';
```

### Shared Types Imports
```typescript
// Import from published package
import { CustomerSchema, CampaignModel } from '@shoutout-labs/market_buzz_crm_types';

---

✅ This ensures **MVP is fast and low-cost (Expo)**, but we’re **future-proofed with Flutter** as a scaling option.



