---
name: ecohabit-project
description: EcoHabit project structure, tech stack, and build status
metadata:
  type: project
---

EcoHabit is a gamified eco-habits/recycling PWA built as a Turborepo monorepo with pnpm workspaces.

**Why:** Help Sri Lankan users build sustainable waste-disposal habits through gamification, AI coaching, and daily challenges.

**How to apply:** Reference this for all code changes in this project.

## Monorepo Layout
- `apps/web` — Next.js 14 App Router PWA (@ecohabit/web)
- `apps/mobile` — Expo React Native skeleton (@ecohabit/mobile)
- `packages/shared` — Shared types, constants, utils, services (@ecohabit/shared)
- `packages/firebase` — Firebase config, auth, Firestore services (@ecohabit/firebase)
- `packages/ui` — Shared UI components (Button, Card, Badge, etc.) (@ecohabit/ui)
- `functions/` — Firebase Cloud Functions (auth triggers, habit triggers, scheduled)

## Key Tech
- Next.js 14 + React 18 + TypeScript (App Router, no Pages Router)
- TailwindCSS + @nextui-org/react (HeroUI v2)
- Zustand (auth.store, habits.store, gamification.store)
- TanStack React Query
- Firebase (Auth, Firestore, Storage, FCM)
- Framer Motion for animations
- Zod for validation

## Web App Structure (apps/web)
- `app/page.tsx` — Auth-aware redirect (→ /login or /home)
- `app/(auth)/` — login, register, forgot-password + layout
- `app/(dashboard)/` — home, habits, habits/log, lessons, lessons/[day], challenges, chat, leaderboard, map, profile, profile/settings + layout (has auth guard + bottom nav)
- `app/onboarding/` — Multi-step onboarding (Welcome → Goals → Categories → Avatar)
- `app/api/` — habits/log, habits/streak, gamification/points+badges+leaderboard, ai/chat, users/profile
- `lib/` — firebase/config, providers (auth, query), hooks (use-auth, use-habits, use-gamification), stores, services

## Webpack Aliases (next.config.js)
Packages are resolved directly to `src/` (bypassing dist build):
- `@ecohabit/shared` → `../../packages/shared/src`
- `@ecohabit/firebase` → `../../packages/firebase/src`
- `@ecohabit/ui` → `../../packages/ui/src`

## Points System
- plastic: 10pts/item, paper: 8pts/item, e-waste: 20pts/item, organic: 5pts/item, glass: 12pts/item, metal: 14pts/item, general: 5pts/item
- Daily cap: 500 pts
- Levels: 1=0pts, 2=500pts, 3=1500pts, 4=3000pts, 5=5000pts, 6=10000pts

## Build Status (as of 2026-06-28)
- Web app TypeScript check: PASSING (0 errors)
- Shared package TypeScript check: PASSING
- Firebase package TypeScript check: PASSING
- Dependencies installed via pnpm

## To Run
```bash
# Set PATH first (pnpm not in shell PATH by default)
export PATH="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH"

# Install (already done)
pnpm install

# Copy env and fill in Firebase credentials
cp apps/web/.env.example apps/web/.env.local

# Start web app
pnpm dev --filter=@ecohabit/web
# App at http://localhost:3000
```

## Firebase Collections
- `users` — user profiles
- `habitLogs` — logged eco-actions
- `challenges` — challenge records
- `lessons` — lesson completion
- `leaderboard` — ranking data
- `chatMessages` — AI chat history
- `analytics` — event tracking
