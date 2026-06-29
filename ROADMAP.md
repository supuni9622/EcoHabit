# EcoHabit — Product Roadmap

> **Last updated:** 2026-06-28  
> **Stack:** Next.js 14 · Expo · Firebase · Turborepo · pnpm

---

## Project Overview

EcoHabit is a gamified waste-management & recycling PWA designed for Sri Lankan users. It drives real behavioural change through streaks, badges, daily challenges, AI coaching, and community leaderboards.

**Platforms:** Web PWA (primary) · iOS/Android via Expo (secondary)  
**Backend:** Firebase (Auth, Firestore, Storage, FCM) + Next.js API routes + Cloud Functions  
**AI:** Google Gemini API for eco-coaching chat

---

## Current Status — `main` branch · 2026-06-28

| Area | Status | Notes |
|---|---|---|
| Monorepo setup | ✅ Done | Turborepo + pnpm workspaces |
| `packages/shared` | ✅ Done | Types, constants, utils, services |
| `packages/firebase` | ✅ Done | Config, auth, Firestore, Storage, FCM |
| `packages/ui` | ✅ Done | Shared components (Button, Card, Badge, etc.) |
| Web — Auth flow | ✅ Done | Email/password + Google OAuth |
| Web — Onboarding | ✅ Done | 4-step flow (goal, categories, avatar) |
| Web — Dashboard | ✅ Done | Home, header, bottom nav |
| Web — Habit logging | ✅ Done | 7 waste types, quantity, notes, points cap |
| Web — Gamification | ✅ Done | Points, levels, streaks, 8 badges |
| Web — Lessons (25) | ✅ Done | All 25 lessons with full content + sequential unlock |
| Web — AI Chat | ✅ Done | Gemini 1.5 Flash, history persistence, context injection |
| Web — Leaderboard | ✅ Done | All-time / weekly / monthly toggle, anonymous mode |
| Web — Profile | ✅ Done | Stats, badges, settings |
| Web — Map | ✅ Done | 20 Sri Lanka centres, filters, geolocation, Maps embed |
| Web — PWA manifest | ✅ Done | manifest.json + icons directory |
| Web — Badges (23) | ✅ Done | 23 badges across all categories |
| Web — Habit log | ✅ Done | Photo upload, animated points counter, edit within 24h |
| Firebase Functions | ✅ Done | User-create + habit-log + level-up triggers + streak alert |
| Mobile app | 🟡 Skeleton | Tab nav + placeholder screens |
| CI/CD | 🟡 Partial | GitHub Actions CI + CD workflows added; needs Vercel/Firebase secrets |
| Admin panel | 🟡 Partial | `apps/admin` built — auth, dashboard, users, lessons, challenges, analytics; 2FA deferred |
| Tests | 🟡 Partial | 46 unit tests for points calculator + streak manager; no integration tests yet |

**TypeScript:** 0 errors across web app, shared, and firebase packages ✅

---

## Epics & Milestones

### ✅ Epic 1 — Core Authentication & Onboarding
**Target:** Week 1-2 · **Status: Complete**

- [x] Firebase Auth configuration
- [x] Email/password registration + login
- [x] Google OAuth sign-in
- [x] Forgot password flow
- [x] User Firestore profile created on first sign-in (Cloud Function)
- [x] 4-step onboarding: Welcome → Goal → Waste categories → Avatar
- [x] Session persistence across refreshes
- [x] Redirect to onboarding on first login, dashboard on return
- [ ] Facebook OAuth *(deferred — low priority for Sri Lanka market)*

---

### ✅ Epic 2 — Daily Habit Tracking
**Target:** Week 2-4 · **Status: Complete (core)**

- [x] Log action form: 7 waste types (plastic, paper, e-waste, organic, glass, metal, general)
- [x] Quantity input with stepper + slider (1–100)
- [x] Optional notes field
- [x] Zod validation on client + server
- [x] Points awarded immediately, daily cap enforced (500 pts/day)
- [x] Streak updated on each log
- [x] Environmental impact calculation (CO₂ + water saved)
- [x] Today's actions list on home dashboard
- [x] Daily rotating challenge (7 challenges, one per day-of-week)
- [x] Challenge progress bar updates from today's logs
- [x] Photo upload (Firebase Storage, max 5 MB, preview thumbnail)
- [x] Edit logged action within 24 h (inline form, recalculates points)
- [ ] Offline action queue → sync on reconnect *(Epic 8)*

---

### ✅ Epic 3 — Gamification & Rewards
**Target:** Week 3-5 · **Status: Complete (core)**

- [x] Points calculation engine (type × quantity, per-type rates)
- [x] 10-level system (Eco Beginner → Eco Legendary)
- [x] Streak tracking: increment, reset after 48 h, grace logic
- [x] 8 badges across: Actions, Streaks, Points, Lessons, Community
- [x] Badge unlock check on every action log
- [x] Bonus points awarded on badge unlock
- [x] Badge collection grid on profile
- [x] Level + points in header, profile
- [x] Confetti animation component
- [x] Level progress bar component
- [x] Animated +points counter (Framer Motion spring animation on log success)
- [x] Streak recovery — one missed-day grace per week (weeklyMissedDays field)
- [ ] Push notification when streak is at risk *(Epic 8)*
- [ ] 3D trophy room (Three.js / react-three-fiber) *(Epic 3 extension)*
- [ ] Social sharing of badges (Twitter, Instagram, WhatsApp) *(Epic 6)*
- [x] 23 badge total (was 8) — glass, metal, organic, textile, lessons, streaks, actions

---

### ✅ Epic 4 — Educational Content & Lessons
**Target:** Week 4-6 · **Status: Complete**

- [x] Lessons library page with progress indicator
- [x] Sequential unlock (complete day N to unlock day N+1)
- [x] All 25 lesson cards with real content
- [x] Individual lesson page: story, key message, reflection prompt
- [x] Lesson completion: 50 pts awarded (100 for Day 25) + Firestore update
- [x] Completed lessons accessible for review
- [x] Days 6–25 lesson content (full story, facts, reflection per lesson)
- [x] Slide-based carousel navigation (story → facts → reflection → complete)
- [ ] Interactive quiz at end of lesson *(Sprint 3)*
  - [ ] Multiple choice questions
  - [ ] True/false questions
  - [ ] Drag-and-drop sorting (waste into correct bins)
  - [ ] Instant feedback animations
  - [ ] Quiz retry without penalty
- [ ] Lesson images/visuals from Firebase Storage *(Sprint 3)*
- [ ] Offline lesson content caching *(Epic 8)*

---

### ✅ Epic 5 — AI Chat & Reflection
**Target:** Week 5-7 · **Status: Complete (core)**

- [x] Chat UI: message list, input, send button, typing indicator, timestamps
- [x] API route proxying messages to Gemini (`gemini-1.5-flash`)
- [x] System prompt: eco-coaching, encouraging, contextual tone
- [x] Rate limiting: 20 messages per day per user (Firestore counter)
- [x] Chat history persisted in Firestore (`chatMessages` collection)
- [x] Conversation context: include user's recent 7-day actions in system prompt
- [x] Multi-turn conversation with Gemini using `contents` + `systemInstruction`
- [ ] Daily reflection prompt after completing actions *(Sprint 2)*
- [ ] Reflection response saved + shown in history *(Sprint 2)*
- [ ] Mood tracking (correlate sentiment with eco-actions) *(Sprint 3)*
- [ ] Message rating: thumbs up / down *(Sprint 3)*
- [ ] Streak-aware coaching prompts ("You're at a 7-day streak!") *(Sprint 3)*

---

### ✅ Epic 6 — Community & Social
**Target:** Week 6-8 · **Status: Partial (core done)**

- [x] Global leaderboard page (top 20 by points, shows user rank)
- [x] Leaderboard API route (Firestore query, ordered by totalPoints)
- [x] Weekly / monthly leaderboard toggle with period-based point summation
- [x] Anonymous mode on leaderboard (respects privacy.showOnLeaderboard setting)
- [x] "You" badge on current user's row
- [ ] Friends leaderboard (friend-request system) *(Sprint 3)*
- [ ] Local leaderboard (GPS-based, city/district) *(Sprint 3)*
- [ ] Community challenges page (join + track progress) *(Sprint 3)*
- [ ] Social sharing: achievement cards for Instagram/Twitter/WhatsApp *(Sprint 3)*
- [ ] Social sharing deep-links for new user acquisition *(Sprint 4)*

---

### ✅ Epic 7 — Recycling Location Finder
**Target:** Week 7-8 · **Status: Complete (core)**

- [x] Map page with 20 Sri Lanka recycling centres (full details)
- [x] `manifest.json` + `public/icons/` directory for PWA install
- [x] Google Maps embedded iframe (when API key set)
- [x] User GPS location (HTML5 Geolocation API)
- [x] Filter recycling centres by waste category (client-side)
- [x] Centre cards with hours, phone, accepted items
- [x] "Get Directions" button → Google Maps deep-link
- [ ] Offline: show last cached results *(Epic 8)*
- [ ] Comprehensive Sri Lanka recycling centre dataset *(Sprint 3)*

---

### 🟡 Epic 8 — PWA & Offline Support
**Target:** Week 8-9 · **Status: Partial**

- [x] PWA meta tags and `manifest` link in `app/layout.tsx`
- [x] Cache-Control headers for `sw.js` in `next.config.js`
- [x] `public/manifest.json` (name, icons, display: standalone, shortcuts)
- [x] `public/icons/` — PWA icons directory (replace placeholder PNGs with real icons)
- [ ] Service worker (`public/sw.js`) — app shell + static asset caching *(Sprint 3)*
- [ ] Offline indicator banner *(Sprint 3)*
- [ ] Background sync for queued habit logs *(Sprint 3)*
- [ ] Offline lesson content (cache on first load) *(Sprint 3)*
- [ ] FCM push notifications — daily challenge reminder *(Sprint 3)*
- [ ] FCM push notifications — streak at-risk alert (48 h inactivity) *(Sprint 3)*
- [ ] FCM push notifications — achievement unlock celebration *(Sprint 3)*
- [ ] User-configurable notification schedule *(Sprint 4)*

---

### ❌ Epic 9 — Admin & Analytics
**Target:** Week 9-10 · **Status: Not started**

- [ ] `apps/admin` — Next.js admin panel *(Sprint 4)*
- [ ] Admin authentication (Firebase custom claims, 2FA) *(Sprint 4)*
- [ ] Lesson content editor (rich text + image upload) *(Sprint 4)*
- [ ] Challenge generator and scheduler *(Sprint 4)*
- [ ] User management table (view, ban, export) *(Sprint 4)*
- [ ] Analytics dashboard (DAU, retention, lesson completion) *(Sprint 4)*
- [ ] Firebase Analytics event tracking in web app *(Sprint 3)*
- [ ] PostHog integration (privacy-focused behavioural analytics) *(Sprint 4)*

---

## Sprint Plan

### Sprint 1 — Foundation ✅ DONE
*Completed 2026-06-28*

- Turborepo monorepo + pnpm workspaces
- All shared packages (`shared`, `firebase`, `ui`)
- Firebase Auth (email + Google)
- Onboarding flow
- Full web dashboard (all routes)
- Habit logging + gamification engine
- AI chat (Gemini proxy)
- Leaderboard + profile
- Cloud Functions (auth trigger, habit trigger)
- Mobile app skeleton (Expo)

---

### Sprint 2 — Content, Polish & Map
*Complete — 2026-06-28*

**Web — Habit Tracking**
- [x] Photo upload on habit log (Firebase Storage, 5 MB cap)
- [x] Edit logged action within 24 h
- [x] Animated +points counter on successful log (Framer Motion)

**Web — Lessons**
- [x] Write and wire up Days 6–25 lesson content (full story, facts, reflection, key message)
- [x] Slide-based carousel navigation (story → facts → reflection → complete)

**Web — Gamification**
- [x] Expand badge library to 23 badges (was 8)
- [x] Streak recovery grace period (one free-miss per week via weeklyMissedDays)
- [x] Weekly / monthly leaderboard toggle
- [x] Anonymous mode on leaderboard (respects privacy.showOnLeaderboard)

**Web — Map**
- [x] `manifest.json` + PWA icons directory
- [x] Google Maps embedded iframe (when NEXT_PUBLIC_GOOGLE_MAPS_API_KEY set)
- [x] GPS user location (HTML5 Geolocation API)
- [x] 20 Sri Lanka recycling centres with full details
- [x] Filter by waste type (client-side)
- [x] Get Directions button (Google Maps deep-link)

**Web — AI Chat**
- [x] Persist chat history in Firestore (`chatMessages` collection)
- [x] Load last 10 messages for multi-turn conversation context
- [x] Inject recent 7-day habit logs into Gemini system prompt
- [x] Upgraded to `gemini-1.5-flash` model

**Firebase Functions**
- [x] `on-level-up.ts` — Firestore trigger logs level-up events
- [x] `streak-alert.ts` — Hourly scheduled function queries at-risk users

---

### Sprint 3 — Interactivity & PWA
*Complete — 2026-06-28*

**Web — Lessons**
- [x] Interactive quiz: multiple-choice and true/false questions for all 25 lessons
- [x] Quiz score tracking + educational feedback on wrong answers
- [ ] Lesson images loaded from Firebase Storage *(Sprint 4)*

**Web — AI Chat / Reflection**
- [x] Post-action daily reflection prompt modal (mood + note)
- [x] Save reflection responses + show 7-day history in profile
- [x] Message rating (thumbs up / down)
- [x] Streak-aware coaching prompts ("You're at a 7-day streak!")

**Web — Social**
- [x] Community challenges page (join, track, complete) with 4 challenges
- [ ] Anonymous mode toggle on leaderboard *(already done Sprint 2)*

**Web — PWA / Offline**
- [x] Service worker: app shell caching + static assets (`public/sw.js`)
- [x] Offline indicator banner (`OfflineBanner` component)
- [x] Queued habit logs (IndexedDB) + background sync stub
- [x] FCM push notifications infrastructure (token save, notifications service)

**Firebase Functions**
- [x] `daily-reminder.ts` — FCM push at 8 AM Asia/Colombo daily
- [ ] `leaderboard-update.ts` — scheduled recalculation *(Sprint 4)*

**Firebase Analytics**
- [x] Log key events: `habit_logged`, `lesson_completed`, `badge_unlocked`, `challenge_joined`

---

### Sprint 4 — Social, Admin & Launch Prep
*In Progress — 2026-06-29*

**Web — Social Sharing**
- [x] Shareable achievement card (canvas-generated image) — `ShareCard.tsx`
- [x] Native share API + fallbacks (Twitter, WhatsApp, Instagram)
- [x] Branded hashtag + deep-link for new user acquisition (invite URL in profile)

**Web — Community**
- [x] Friend request system (send via username/email) — `api/users/friends/request`, `api/users/search`
- [x] Friends leaderboard view — leaderboard page "Friends" tab + API
- [x] User-configurable notification schedule (reminder time, streak alerts, achievements) — settings page

**Admin Panel (`apps/admin`)**
- [x] `apps/admin` — Next.js 14 app, runs on port 3001
- [x] Admin auth — Firebase custom claims (`role: "admin"`) + redirect guard
- [x] Dashboard — total users, active today, habit logs, live challenges + recent activity feed
- [x] User management — paginated table, search by name, ban/unban toggle
- [x] Lesson editor — list all 25 lessons, edit title/description/keyMessage/story/facts/reflection in Firestore overrides (`lessonOverrides` collection)
- [x] Challenge scheduler — create/edit/activate/end/delete challenges with date range, waste type, points
- [x] Analytics — 7-day DAU bar chart, waste type breakdown, KPI cards
- [ ] 2FA for admin accounts *(Sprint 5 — low priority)*

**Quality & Launch**
- [x] GitHub Actions CI — lint + type-check + build + test on PR (`.github/workflows/ci.yml`)
- [x] GitHub Actions CD — auto-deploy web to Vercel on merge to `main` (`.github/workflows/deploy-web.yml`)
- [x] Firebase Functions deployment workflow (`.github/workflows/deploy-functions.yml`)
- [x] Sentry error monitoring integration — placeholder wired into habit-log + chat APIs
- [x] Unit tests for gamification engine + points calculator — 46 tests, vitest in `packages/shared`
- [x] Bug fix: `StreakManager.calculateCurrentStreak` — fixed off-by-one that miscounted consecutive days
- [ ] Firestore security rules audit
- [ ] WCAG 2.1 AA accessibility audit
- [ ] Performance audit (Lighthouse ≥ 90 score)
- [ ] Firebase emulator suite for integration tests

---

### Sprint 5 — Mobile App (Expo)
*Estimated: 3 weeks · Follows Sprint 4*

**Mobile (`apps/mobile`)**
- [ ] Firebase Auth (email + Google via `expo-auth-session`)
- [ ] Habit log screen (full form, waste type selector)
- [ ] Home dashboard (streak, points, daily challenge)
- [ ] Lessons library + individual lesson view
- [ ] AI chat screen
- [ ] Profile + badge collection
- [ ] Push notifications (`expo-notifications` + FCM)
- [ ] EAS Build config (Android APK + iOS IPA)
- [ ] OTA updates (`expo-updates`)

---

## Next Steps (Immediate — this week)

1. **Add Firebase credentials** — copy `apps/web/.env.example` → `apps/web/.env.local` and fill in values from the Firebase console. Without this the app cannot connect to any Firebase service.

2. **Add Gemini API key** — add `GEMINI_API_KEY=...` to `apps/web/.env.local`. Without this the AI chat returns 500 errors.

3. **Run the app locally**
   ```bash
   export PATH="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH"
   pnpm dev --filter=@ecohabit/web
   # → http://localhost:3000
   ```

4. **Deploy Firebase Cloud Functions** — the `onUserCreate` trigger must be deployed before users can sign up, otherwise Firestore profiles won't be created.
   ```bash
   firebase deploy --only functions
   ```

5. **Create `public/manifest.json`** — required for PWA install prompt on mobile browsers (Sprint 2, high priority).

6. **Add lessons 6–25** — the lesson library currently shows only 5 lessons. Writing content for the remaining 20 is the biggest content gap.

7. **Wire up Google Maps** — the recycling map page is a placeholder. Get a Google Maps API key and integrate `@react-google-maps/api`.

8. **Expand badge library** — currently 8 badges. The acceptance criteria requires 20+.

---

## Known Limitations

| Issue | Severity | Fix in |
|---|---|---|
| No service worker — no offline support | Medium | Sprint 3 |
| FCM push notifications not wired up | Medium | Sprint 3 |
| PWA icons are placeholders (need real PNGs) | Low | Before launch |
| No Facebook OAuth | Low | Deferred |
| No admin panel | Medium | Sprint 4 |
| No automated tests | High | Sprint 4 |
| No CI/CD pipeline | High | Sprint 4 |

---

## Success Metrics (Launch Targets)

| Metric | Target |
|---|---|
| Initial load time | < 3 s on 3G |
| Lighthouse PWA score | ≥ 90 |
| Daily habit log completion rate | > 40% of DAU |
| 7-day user retention | > 30% |
| Lesson completion rate | > 50% |
| Streak ≥ 7 days | > 20% of active users |
| Push notification delivery rate | > 90% |
| API response time | < 500 ms (p95) |
| Error rate | < 1% |
