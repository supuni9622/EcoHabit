# EcoHabit — Full Setup Guide

> Covers every service connection, environment variable, required asset, and run command for the web app, admin panel, mobile app, and Cloud Functions.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Clone & Install](#2-clone--install)
3. [Firebase Project Setup](#3-firebase-project-setup)
4. [Environment Variables](#4-environment-variables)
5. [Third-Party Services](#5-third-party-services)
6. [Required Assets & Images](#6-required-assets--images)
7. [Running Locally](#7-running-locally)
8. [Firebase Emulators](#8-firebase-emulators)
9. [Running Tests](#9-running-tests)
10. [Deploying to Production](#10-deploying-to-production)
11. [CI/CD Secrets](#11-cicd-secrets)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Prerequisites

Install these tools before anything else.

| Tool | Minimum version | Install |
|---|---|---|
| Node.js | 18.x (LTS) | https://nodejs.org or `nvm install 18` |
| pnpm | 8.x | `npm install -g pnpm@8` |
| Firebase CLI | latest | `npm install -g firebase-tools` |
| Java JDK | 17 (for emulators) | `brew install openjdk@17` / https://adoptium.net |
| Git | any | pre-installed on macOS |
| Expo CLI (mobile only) | latest | `npm install -g expo-cli` |
| EAS CLI (mobile build only) | latest | `npm install -g eas-cli` |

Verify:
```bash
node -v        # v18.x or higher
pnpm -v        # 8.x
firebase --version
java -version  # 17.x
```

---

## 2. Clone & Install

```bash
git clone https://github.com/<your-org>/ecohabit.git
cd ecohabit

# Install all workspace dependencies in one command
pnpm install
```

This installs dependencies for all apps (`web`, `admin`, `mobile`), all packages (`shared`, `firebase`, `ui`), Cloud Functions, and the test suite.

---

## 3. Firebase Project Setup

### 3.1 Create a Firebase project

1. Go to https://console.firebase.google.com
2. Click **Add project** → name it `ecohabit` (or your preferred name)
3. Disable Google Analytics for now (you can enable it later)

### 3.2 Enable Authentication

1. Firebase console → **Authentication** → **Get started**
2. **Sign-in method** tab → enable:
   - **Email/Password** — toggle on
   - **Google** — toggle on, set project support email

### 3.3 Enable Firestore

1. Firebase console → **Firestore Database** → **Create database**
2. Choose **Start in production mode**
3. Select region: `asia-south1` (Mumbai, closest to Sri Lanka)

### 3.4 Enable Storage

1. Firebase console → **Storage** → **Get started**
2. Start in production mode, same region as Firestore

### 3.5 Enable Cloud Messaging (FCM)

1. Firebase console → **Project settings** → **Cloud Messaging** tab
2. Note the **Server key** — not needed directly, the Admin SDK uses it automatically

### 3.6 Get Web App Config

1. Firebase console → **Project settings** → **General** tab
2. Scroll to **Your apps** → click **</>** (web) → register app named `EcoHabit Web`
3. Copy the config object — you'll use these values in `.env.local`

### 3.7 Get VAPID Key (for PWA push notifications)

1. Firebase console → **Project settings** → **Cloud Messaging** tab
2. Scroll to **Web configuration** → click **Generate key pair**
3. Copy the **Key pair** value → this is `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

### 3.8 Deploy Firestore Security Rules

```bash
firebase login
firebase use --add   # link your project, alias it "default"
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### 3.9 Set Admin Custom Claim (for admin panel access)

After creating your first user in the app, run this once from a terminal to grant admin access:

```bash
# Replace UID with the user's Firebase UID from Authentication console
node -e "
const admin = require('firebase-admin');
const sa = require('./serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(sa) });
admin.auth().setCustomUserClaims('YOUR_USER_UID', { role: 'admin' })
  .then(() => { console.log('Done'); process.exit(0); });
"
```

Download `serviceAccountKey.json` from Firebase console → **Project settings** → **Service accounts** → **Generate new private key**.

---

## 4. Environment Variables

### 4.1 Web App (`apps/web/.env.local`)

Copy the example and fill in real values:

```bash
cp env.example apps/web/.env.local
```

Full reference:

```env
# ── Firebase ──────────────────────────────────────────────────
# From Firebase console → Project settings → Your apps → Web app
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789000
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789000:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# From Firebase console → Project settings → Cloud Messaging → Web config → Key pair
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BNt...

# ── Google Services ───────────────────────────────────────────
# Google Maps (see Section 5.1)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...

# Gemini AI (see Section 5.2)
GEMINI_API_KEY=AIzaSy...

# ── App ───────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000   # change to https://yourdomain.com in prod
NEXT_PUBLIC_APP_NAME=EcoHabit

# ── Analytics (see Section 5.3) ───────────────────────────────
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ── Error monitoring (see Section 5.4) ───────────────────────
SENTRY_DSN=https://abc123@o123.ingest.sentry.io/456
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=ecohabit-web

# ── Development ───────────────────────────────────────────────
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

### 4.2 Admin Panel (`apps/admin/.env.local`)

The admin panel uses the same Firebase project:

```env
# Same Firebase values as web app
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789000
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789000:web:abc123

NEXT_PUBLIC_APP_URL=http://localhost:3001
```

Create it:
```bash
cp env.example apps/admin/.env.local
# Edit and fill in values
```

### 4.3 Cloud Functions (no `.env` file needed)

Cloud Functions use the **Firebase Admin SDK** which automatically picks up credentials when running on Firebase infrastructure. For local development with the emulator, no credentials are needed. For running functions against the real project locally, download a service account key:

```bash
firebase functions:config:set gemini.api_key="YOUR_GEMINI_KEY"
```

Functions read `process.env` vars set via Firebase config. For Gen 2 functions this is done in the Firebase console or via `firebase deploy --only functions`.

### 4.4 Mobile App (`apps/mobile/.env`)

Create `apps/mobile/.env`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789000
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789000:web:abc123
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

> Expo reads `EXPO_PUBLIC_*` vars at build time. Never use `NEXT_PUBLIC_*` in mobile code.

---

## 5. Third-Party Services

### 5.1 Google Maps API Key

Used by the Recycling Location Finder map page.

1. Go to https://console.cloud.google.com
2. Enable these APIs for your project:
   - **Maps JavaScript API**
   - **Geocoding API** (optional, for address lookup)
   - **Places API** (optional, for search)
3. **Credentials** → **Create credentials** → **API key**
4. Click **Restrict key**:
   - Application restrictions: **HTTP referrers**
   - Add: `http://localhost:3000/*` and `https://yourdomain.com/*`
   - API restrictions: restrict to Maps JavaScript API
5. Copy the key → `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `apps/web/.env.local`

### 5.2 Google Gemini API Key

Used by the AI EcoCoach chat feature.

1. Go to https://aistudio.google.com/app/apikey
2. Click **Create API key**
3. Select your Google Cloud project (same one as Maps if you like)
4. Copy the key → `GEMINI_API_KEY` in `apps/web/.env.local`

> The chat API route uses `gemini-1.5-flash` model. The key is **server-side only** — it is never exposed to the browser.

Rate limit: the free tier allows 60 requests/minute. The app enforces a 20 messages/day/user cap via Firestore.

### 5.3 PostHog (Analytics)

Used for behavioural analytics (DAU, funnel analysis, feature flags).

1. Go to https://app.posthog.com → sign up (free tier is generous)
2. Create a new project named `EcoHabit`
3. Copy the **Project API key** (starts with `phc_`) → `NEXT_PUBLIC_POSTHOG_KEY`
4. Set `NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com`

> Events automatically tracked: `$pageview`, `$pageleave`. Custom events fired in the app: `habit_logged`, `lesson_completed`, `badge_unlocked`, `challenge_joined`.

If you want to self-host PostHog (GDPR / data residency):
```env
NEXT_PUBLIC_POSTHOG_HOST=https://your-posthog.yourdomain.com
```

### 5.4 Sentry (Error Monitoring)

Used by the habit-log and AI chat API routes.

1. Go to https://sentry.io → create account
2. Create a new **Next.js** project named `ecohabit-web`
3. Copy the **DSN** → `SENTRY_DSN`
4. Copy org slug → `SENTRY_ORG`
5. Copy project slug → `SENTRY_PROJECT`

For source maps in production, install the Sentry Next.js SDK:
```bash
pnpm --filter=@ecohabit/web add @sentry/nextjs
```
Then run the wizard: `npx @sentry/wizard -i nextjs`

### 5.5 Vercel (Web & Admin Deployment)

1. Go to https://vercel.com → import the GitHub repository
2. Set **Root directory** to `apps/web` for the web app
3. Add a second Vercel project for the admin panel with **Root directory** `apps/admin`
4. Add all environment variables from Section 4.1 to each Vercel project's settings
5. The GitHub Actions CD workflow (`.github/workflows/deploy-web.yml`) auto-deploys on push to `main` — add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` as GitHub Secrets (see Section 11)

---

## 6. Required Assets & Images

### 6.1 PWA Icons (web app)

The manifest references icons at `apps/web/public/icons/`. **All are placeholders** — replace them with real PNG files before shipping.

| File | Size | Usage |
|---|---|---|
| `icon-72x72.png` | 72×72 | Legacy Android home screen |
| `icon-96x96.png` | 96×96 | Shortcuts in manifest |
| `icon-128x128.png` | 128×128 | Chrome Web Store |
| `icon-144x144.png` | 144×144 | Windows tiles |
| `icon-152x152.png` | 152×152 | iOS home screen |
| `icon-192x192.png` | 192×192 | **Required** — Android home screen + PWA install |
| `icon-384x384.png` | 384×384 | High-DPI Android |
| `icon-512x512.png` | 512×512 | **Required** — Splash screen + maskable |

**Design spec:** Green leaf / eco icon on a white background. Both 192 and 512 must be `"purpose": "any maskable"` — the safe zone for maskable is the inner 80% of the canvas (leave 10% padding on each side).

**Quick generation (using ImageMagick):**
```bash
# Start from a single 512x512 master SVG or PNG
convert master-icon.png -resize 512x512 apps/web/public/icons/icon-512x512.png
convert master-icon.png -resize 192x192 apps/web/public/icons/icon-192x192.png
convert master-icon.png -resize 384x384 apps/web/public/icons/icon-384x384.png
convert master-icon.png -resize 152x152 apps/web/public/icons/icon-152x152.png
convert master-icon.png -resize 144x144 apps/web/public/icons/icon-144x144.png
convert master-icon.png -resize 128x128 apps/web/public/icons/icon-128x128.png
convert master-icon.png -resize 96x96  apps/web/public/icons/icon-96x96.png
convert master-icon.png -resize 72x72  apps/web/public/icons/icon-72x72.png
```

Or use the free tool at https://maskable.app to test maskable icon safe zones.

### 6.2 Expo / Mobile Assets

All referenced in `apps/mobile/app.json`. Place files in `apps/mobile/assets/`:

| File | Size | Notes |
|---|---|---|
| `icon.png` | 1024×1024 | App icon for App Store / Play Store |
| `splash.png` | 1284×2778 | Splash screen — fits all screen sizes |
| `adaptive-icon.png` | 1024×1024 | Android adaptive icon foreground layer |
| `favicon.png` | 32×32 | Expo web favicon |
| `notification-icon.png` | 96×96 | Android notification icon (monochrome, white on transparent) |

**Design spec:** Same green-leaf brand as PWA icons. `adaptive-icon.png` should be the icon on a transparent background with `"backgroundColor": "#22c55e"` set in `app.json` (already configured).

### 6.3 Lesson Images (Firebase Storage)

Lesson image support is wired up in `next.config.js` (allows `firebasestorage.googleapis.com`). Upload lesson visuals to Firebase Storage at:

```
gs://your-project-id.appspot.com/lessons/{day}/cover.jpg
```

Each lesson uses day numbers 1–25. Recommended: 800×450 px JPEG, under 100 KB. When no image is uploaded, lessons render without an image (gracefully handled in the UI).

### 6.4 User Avatar Emojis

Avatars are stored as emoji strings (e.g. `🌱`, `🌿`, `♻️`) in Firestore — no image files needed. The avatar picker is in the onboarding flow.

---

## 7. Running Locally

### 7.1 Web App (port 3000)

```bash
# From the repo root
pnpm --filter=@ecohabit/web dev

# Or using turbo (runs all apps at once)
pnpm dev
```

Open http://localhost:3000

The web app requires `apps/web/.env.local` to be populated (Section 4.1). Without Firebase credentials, auth and data fetching will fail — use the Firebase emulators (Section 8) to avoid needing real credentials in development.

### 7.2 Admin Panel (port 3001)

```bash
pnpm --filter=@ecohabit/admin dev
```

Open http://localhost:3001

Sign in with a Firebase account that has the `role: "admin"` custom claim set (Section 3.9). Without the admin claim, the app redirects to the login page.

### 7.3 Mobile App (Expo)

```bash
cd apps/mobile

# Start Expo dev server
pnpm dev     # or: expo start

# Then press:
#   i  → open in iOS Simulator (macOS + Xcode required)
#   a  → open in Android Emulator (Android Studio required)
#   w  → open in browser (limited)
#   Scan QR → open in Expo Go app on a physical device
```

The mobile app is currently a skeleton. Firebase auth and data are not yet wired up in mobile — that is Sprint 5 work.

### 7.4 Cloud Functions (local)

```bash
# Build functions first
cd functions && npm run build && cd ..

# Start only functions emulator
firebase emulators:start --only functions

# Or start full emulator suite (see Section 8)
pnpm firebase:emulators
```

### 7.5 All Apps at Once (Turborepo)

```bash
pnpm dev
```

Turborepo runs web (`3000`), admin (`3001`), and mobile (Expo) in parallel. Cloud Functions are not included — start them separately.

---

## 8. Firebase Emulators

The emulator suite lets you develop without touching real Firebase data.

### 8.1 Start all emulators

```bash
pnpm firebase:emulators
# or: firebase emulators:start
```

Services and ports:

| Emulator | Port | URL |
|---|---|---|
| Emulator UI | 4000 | http://localhost:4000 |
| Auth | 9099 | — |
| Firestore | 8080 | — |
| Functions | 5001 | — |
| Storage | 9199 | — |
| Hosting | 5000 | http://localhost:5000 |

### 8.2 Point the web app at the emulators

Add to `apps/web/.env.local`:

```env
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

Then in `apps/web/lib/firebase/config.ts` check `process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS` and call `connectFirestoreEmulator`, `connectAuthEmulator`, `connectStorageEmulator`. This pattern keeps production connections safe.

### 8.3 Seed data

Use the Emulator UI at http://localhost:4000 → **Firestore** → import/export, or run a seed script:

```bash
node scripts/seed-emulator.js  # not yet created — see Troubleshooting
```

---

## 9. Running Tests

### 9.1 Unit tests (gamification engine)

```bash
pnpm test
# or specific package:
pnpm --filter=@ecohabit/shared test
```

Runs 46 unit tests for `PointsCalculator` and `StreakManager` using Vitest. No Firebase connection needed.

### 9.2 Firestore security rules tests

Requires Java 17+ and Firebase CLI. The tests start the Firestore emulator automatically.

```bash
# From repo root — starts emulator, runs tests, stops emulator
pnpm test:rules
```

This runs:
```
firebase emulators:exec --only firestore --project demo-ecohabit \
  'pnpm --filter=@ecohabit/tests test:rules'
```

The `demo-` prefix tells the emulator it's a demo project — no real Firebase credentials needed.

### 9.3 Type checking

```bash
pnpm type-check
```

Runs `tsc --noEmit` across all packages and apps (0 errors expected).

### 9.4 Linting

```bash
pnpm lint
```

---

## 10. Deploying to Production

### 10.1 Web App → Vercel

```bash
# Manual deploy (normally handled by GitHub Actions)
cd apps/web
vercel --prod
```

Or push to `main` — the CD workflow in `.github/workflows/deploy-web.yml` handles it automatically.

Build command: `pnpm --filter=@ecohabit/web build`
Output directory: `apps/web/.next`

### 10.2 Admin Panel → Vercel

Same as web app but separate Vercel project:

```bash
cd apps/admin
vercel --prod
```

Set a custom domain like `admin.yourdomain.com` and add **Basic Auth** or IP allowlist in Vercel settings — the admin panel is not meant to be publicly accessible.

### 10.3 Cloud Functions → Firebase

```bash
# Deploy all functions
firebase deploy --only functions

# Deploy a single function
firebase deploy --only functions:updateLeaderboard
```

Functions are deployed from the `functions/` directory. The `firebase.json` `predeploy` hook runs `npm run build` automatically.

**Function schedules (all Asia/Colombo timezone):**

| Function | Schedule | What it does |
|---|---|---|
| `generateDailyChallenge` | 00:00 daily | Writes today's challenge to Firestore |
| `sendDailyReminder` | 08:00 daily | FCM push to all opted-in users |
| `checkStreakAlerts` | Every hour | FCM push to users with streak at risk |
| `updateLeaderboard` | Every hour | Recomputes all-time/weekly/monthly leaderboard cache |

### 10.4 Firestore + Storage Rules

```bash
firebase deploy --only firestore:rules,storage
```

### 10.5 Mobile App → EAS Build

```bash
cd apps/mobile

# Configure EAS (first time only)
eas build:configure

# Build for production
eas build --platform android --profile production
eas build --platform ios --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

You need an Expo account, Apple Developer account (iOS), and Google Play Developer account (Android).

---

## 11. CI/CD Secrets

Add these to your GitHub repository under **Settings → Secrets and variables → Actions**:

### Required for CI (tests + type-check)

None — CI uses dummy values for Firebase vars.

### Required for CD (deploy-web.yml)

| Secret | Where to get it |
|---|---|
| `VERCEL_TOKEN` | Vercel dashboard → Account settings → Tokens |
| `VERCEL_ORG_ID` | Run `vercel whoami` — shown in project JSON |
| `VERCEL_PROJECT_ID` | Vercel project dashboard → Settings → General |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase console (Section 3.6) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase console |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase console |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase console |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase console |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase console |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase console |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | Firebase console (Section 3.7) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Cloud console (Section 5.1) |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog dashboard (Section 5.3) |
| `SENTRY_DSN` | Sentry dashboard (Section 5.4) |
| `SENTRY_ORG` | Sentry dashboard |
| `SENTRY_PROJECT` | Sentry dashboard |

### Required for Firebase deploy (deploy-functions.yml)

| Secret | Where to get it |
|---|---|
| `FIREBASE_TOKEN` | Run `firebase login:ci` locally, copy the token |
| `GEMINI_API_KEY` | Google AI Studio (Section 5.2) |

---

## 12. Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"

Your `NEXT_PUBLIC_FIREBASE_API_KEY` is wrong or missing. Double-check `apps/web/.env.local` and restart the dev server — Next.js only reads `.env.local` at startup.

### AI chat returns 500

`GEMINI_API_KEY` is not set or is invalid. The key must be in `apps/web/.env.local` (server-side only, no `NEXT_PUBLIC_` prefix). Verify it at https://aistudio.google.com.

### "Firebase: No Firebase App '[DEFAULT]' has been created"

The Firebase config is imported before `initializeApp()` runs. This usually happens with hot reloads in Next.js. The `packages/firebase/src/config.ts` guards against double-initialization — make sure you're importing from `@ecohabit/firebase` (the package) and not duplicating initialization in `apps/web/lib/firebase/config.ts`.

### Maps page shows no map

`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is missing or the Maps JavaScript API is not enabled in Google Cloud console. The page shows the 20 hardcoded Sri Lanka centres even without an API key — only the embedded map iframe needs the key.

### Firestore rules tests fail locally

- Java 17 must be in your `PATH`: `java -version`
- Firebase CLI must be logged in: `firebase login`
- The emulator downloads on first run (~100 MB) — allow it to finish before running tests
- If the emulator port 8080 is in use: `lsof -ti:8080 | xargs kill -9`

### "pnpm: command not found" in CI

The CI uses `pnpm/action-setup@v3` which installs pnpm from the `packageManager` field in `package.json`. If the action fails, pin the version explicitly in the workflow.

### Push notifications not received

1. Check that the user has granted notification permission in the browser
2. Verify `fcmToken` is saved in Firestore for the user (`users/{uid}.fcmToken`)
3. VAPID key must match exactly between `apps/web/.env.local` and Firebase console
4. FCM does not work on `localhost` over HTTP — use `https://` or the Firebase emulator

### Admin panel shows "Access denied"

The signed-in Firebase user needs the custom claim `{ role: "admin" }`. Run the claim-setting script in Section 3.9, then sign out and sign back in (claims are only read on token refresh).

### Expo build fails "missing assets"

The following asset files are required but not committed (they're placeholders):
- `apps/mobile/assets/icon.png`
- `apps/mobile/assets/splash.png`
- `apps/mobile/assets/adaptive-icon.png`
- `apps/mobile/assets/notification-icon.png`

Create or copy placeholder PNGs of the right dimensions before running `expo build` or `eas build`.
