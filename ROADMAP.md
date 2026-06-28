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
| Web — Lessons (5) | ✅ Done | Sequential unlock, completion tracking |
| Web — AI Chat (stub) | ✅ Done | Gemini proxy, rate limiting |
| Web — Leaderboard | ✅ Done | Global top 20 |
| Web — Profile | ✅ Done | Stats, badges, settings |
| Web — Map | 🟡 Stub | Hardcoded centers, no Maps API |
| Web — PWA manifest | 🟡 Partial | Headers configured, no `manifest.json` |
| Firebase Functions | 🟡 Partial | User-create + habit-log triggers only |
| Mobile app | 🟡 Skeleton | Tab nav + placeholder screens |
| CI/CD | ❌ Not started | No GitHub Actions yet |
| Admin panel | ❌ Not started | — |
| Tests | ❌ Not started | — |

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
- [ ] Photo upload (optional, max 5 MB) *(Sprint 2)*
- [ ] Edit logged action within 24 h *(Sprint 2)*
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
- [ ] Animated +points counter (bounce effect on log) *(Sprint 2)*
- [ ] Streak recovery — one missed-day grace per week *(Sprint 2)*
- [ ] Push notification when streak is at risk *(Epic 8)*
- [ ] 3D trophy room (Three.js / react-three-fiber) *(Epic 3 extension)*
- [ ] Social sharing of badges (Twitter, Instagram, WhatsApp) *(Epic 6)*
- [ ] 20+ badge total (currently 8) *(Sprint 2)*

---

### 🟡 Epic 4 — Educational Content & Lessons
**Target:** Week 4-6 · **Status: Partial**

- [x] Lessons library page with progress indicator
- [x] Sequential unlock (complete day N to unlock day N+1)
- [x] 5 lesson cards with real content (plastic, paper, e-waste, organic, circular economy)
- [x] Individual lesson page: story, key message, reflection prompt
- [x] Lesson completion: 50 pts awarded + Firestore update
- [x] Completed lessons accessible for review
- [ ] Remaining 20 lessons (Days 6–25) *(Sprint 2 — content writing)*
- [ ] Swipeable story carousel (slide-by-slide within a lesson) *(Sprint 2)*
- [ ] Interactive quiz at end of lesson *(Sprint 3)*
  - [ ] Multiple choice questions
  - [ ] True/false questions
  - [ ] Drag-and-drop sorting (waste into correct bins)
  - [ ] Instant feedback animations
  - [ ] Quiz retry without penalty
- [ ] Lesson images/visuals from Firebase Storage *(Sprint 3)*
- [ ] Offline lesson content caching *(Epic 8)*

---

### 🟡 Epic 5 — AI Chat & Reflection
**Target:** Week 5-7 · **Status: Partial**

- [x] Chat UI: message list, input, send button, typing indicator
- [x] API route proxying messages to Gemini (`gemini-pro`)
- [x] System prompt: eco-coaching, encouraging, contextual tone
- [x] Rate limiting: 20 messages per day per user (Firestore counter)
- [ ] Chat history persisted in Firestore *(Sprint 2)*
- [ ] Conversation context: include user's recent actions in system prompt *(Sprint 2)*
- [ ] Daily reflection prompt after completing actions *(Sprint 2)*
- [ ] Reflection response saved + shown in history *(Sprint 2)*
- [ ] Mood tracking (correlate sentiment with eco-actions) *(Sprint 3)*
- [ ] Message rating: thumbs up / down *(Sprint 3)*
- [ ] Streak-aware coaching prompts ("You're at a 7-day streak!") *(Sprint 3)*

---

### 🟡 Epic 6 — Community & Social
**Target:** Week 6-8 · **Status: Partial**

- [x] Global leaderboard page (top 20 by points, shows user rank)
- [x] Leaderboard API route (Firestore query, ordered by totalPoints)
- [ ] Weekly / monthly leaderboard toggle *(Sprint 2)*
- [ ] Friends leaderboard (friend-request system) *(Sprint 3)*
- [ ] Local leaderboard (GPS-based, city/district) *(Sprint 3)*
- [ ] Anonymous mode on leaderboard *(Sprint 2)*
- [ ] Community challenges page (join + track progress) *(Sprint 3)*
- [ ] Social sharing: achievement cards for Instagram/Twitter/WhatsApp *(Sprint 3)*
- [ ] Social sharing deep-links for new user acquisition *(Sprint 4)*

---

### 🟡 Epic 7 — Recycling Location Finder
**Target:** Week 7-8 · **Status: Stub only**

- [x] Map page with 5 hardcoded Sri Lanka recycling centres (addresses only)
- [ ] `manifest.json` + `public/icons/` for PWA install *(Sprint 2)*
- [ ] Google Maps API integration (interactive map) *(Sprint 2)*
- [ ] User GPS location (HTML5 Geolocation) *(Sprint 2)*
- [ ] Custom map markers by accepted waste type *(Sprint 2)*
- [ ] Filter recycling centres by waste category *(Sprint 2)*
- [ ] Centre detail drawer (hours, phone, accepted items) *(Sprint 2)*
- [ ] "Get Directions" → native maps deep-link *(Sprint 2)*
- [ ] Offline: show last cached results *(Epic 8)*
- [ ] Comprehensive Sri Lanka recycling centre dataset *(Sprint 3)*

---

### ❌ Epic 8 — PWA & Offline Support
**Target:** Week 8-9 · **Status: Not started**

- [x] PWA meta tags and `manifest` link in `app/layout.tsx`
- [x] Cache-Control headers for `sw.js` in `next.config.js`
- [ ] `public/manifest.json` (name, icons, display: standalone) *(Sprint 2)*
- [ ] `public/icons/` — PWA icon set (192×192, 512×512, maskable) *(Sprint 2)*
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
*Estimated: 2 weeks*

**Web — Habit Tracking**
- [ ] Photo upload on habit log (Firebase Storage, 5 MB cap, compression)
- [ ] Edit logged action within 24 h
- [ ] Animated +points counter on successful log (Framer Motion bounce)

**Web — Lessons**
- [ ] Write and wire up Days 6–25 lesson content
- [ ] Swipeable story carousel (CSS snap-scroll or Framer Motion)

**Web — Gamification**
- [ ] Expand badge library to 20+ badges
- [ ] Streak recovery grace period (one free-miss per week)
- [ ] Weekly / monthly leaderboard toggle

**Web — Map**
- [ ] `manifest.json` + PWA icon set
- [ ] Google Maps API (`@react-google-maps/api`) interactive map
- [ ] GPS user location + nearest recycling centres
- [ ] Filter by waste type, tap-for-details drawer

**Web — AI Chat**
- [ ] Persist chat history in Firestore (`chatMessages` collection)
- [ ] Inject recent user actions into Gemini system prompt context

**Firebase Functions**
- [ ] `on-level-up.ts` — trigger notification when user levels up
- [ ] `streak-alert.ts` — FCM notification after 20 h inactivity

---

### Sprint 3 — Interactivity & PWA
*Estimated: 2 weeks*

**Web — Lessons**
- [ ] Interactive quiz: multiple-choice, true/false, drag-and-drop sort
- [ ] Quiz score tracking + educational feedback on wrong answers
- [ ] Lesson images loaded from Firebase Storage

**Web — AI Chat / Reflection**
- [ ] Post-action daily reflection prompt modal
- [ ] Save reflection responses + show 30-day history
- [ ] Message rating (thumbs up / down)

**Web — Social**
- [ ] Community challenges page (join, track, complete)
- [ ] Anonymous mode toggle on leaderboard

**Web — PWA / Offline**
- [ ] Service worker: app shell caching + static assets
- [ ] Offline indicator banner
- [ ] Queued habit logs (IndexedDB) + background sync
- [ ] FCM push notifications: daily challenge reminder + streak alert + achievement

**Firebase Functions**
- [ ] `daily-reminder.ts` — FCM push at user-preferred time
- [ ] `leaderboard-update.ts` — scheduled recalculation

**Firebase Analytics**
- [ ] Log key events: `habit_logged`, `lesson_completed`, `badge_unlocked`, `challenge_joined`

---

### Sprint 4 — Social, Admin & Launch Prep
*Estimated: 2 weeks*

**Web — Social Sharing**
- [ ] Shareable achievement card (canvas-generated image)
- [ ] Native share API + fallbacks (Twitter, WhatsApp, Instagram)
- [ ] Branded hashtag + deep-link for new user acquisition

**Web — Community**
- [ ] Friend request system (send via username/email)
- [ ] Friends leaderboard view

**Admin Panel (`apps/admin`)**
- [ ] Admin auth (Firebase custom claims, 2FA)
- [ ] Lesson content editor
- [ ] Challenge scheduler
- [ ] User management table
- [ ] Analytics dashboard (DAU, retention, feature usage)

**Quality & Launch**
- [ ] GitHub Actions CI — lint + type-check + test on PR
- [ ] GitHub Actions CD — auto-deploy web to Vercel on merge to `main`
- [ ] Firebase Functions deployment workflow
- [ ] Sentry error monitoring integration
- [ ] Firestore security rules audit
- [ ] WCAG 2.1 AA accessibility audit
- [ ] Performance audit (Lighthouse ≥ 90 score)
- [ ] Firebase emulator suite for integration tests
- [ ] Unit tests for gamification engine + points calculator

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
| Recycling map is a hardcoded list, no live map | High | Sprint 2 |
| Only 5 of 25 lessons have content | High | Sprint 2 |
| No `manifest.json` — PWA install won't trigger | Medium | Sprint 2 |
| No service worker — no offline support | Medium | Sprint 3 |
| FCM push notifications not wired up | Medium | Sprint 3 |
| No photo upload on habit log | Low | Sprint 2 |
| 8 badges (need 20+) | Low | Sprint 2 |
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
