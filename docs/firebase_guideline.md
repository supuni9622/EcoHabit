# Firebase Cost Overview for EcoHabit

## 1. Firestore

**Free Tier:** 50,000 reads, 50,000 writes, 1 GB storage per month.

**Notes for EcoHabit:**
- Logging every user action will consume reads/writes quickly if you have many daily users.
- Gamification (streak updates, points) will involve frequent writes.

**Tip:** Design data structure efficiently (batch writes, combine streak & points updates).

---

## 2. Firebase Authentication

**Free Tier:** 10K verifications/month (email/password, anonymous, social login)

**Notes:**
- Likely enough for MVP user base (first few thousand users).

---

## 3. Firebase Cloud Functions

**Free Tier:** 2M invocations, 400,000 GB-seconds compute, 200,000 CPU-seconds per month.

**Notes:**
- Each gamification update, AI chat proxy call, or notification trigger counts as an invocation.
- Free tier usually enough for MVP, but heavy AI chat usage could exceed free tier if hosted functions proxy OpenAI API calls.

---

## 4. Firebase Storage

**Free Tier:** 5 GB storage, 1 GB download per day.

**Notes:**
- Use for lesson media and optional user photo uploads.
- Avoid storing large images; optimize and compress assets.

---

## 5. Firebase Cloud Messaging (FCM)

**Free:** Unlimited notifications for Android/iOS/web.

**Notes:**
- Great for daily challenge reminders and streak notifications.

---

## 6. Firebase Analytics

**Free:** Unlimited events and dashboards.

**Notes:**
- Perfect for tracking DAU, lesson completion, engagement.

---

## Summary Table

| Firebase Service | Free Tier Limit                  | Notes for EcoHabit MVP                       |
|-----------------|---------------------------------|---------------------------------------------|
| Firestore        | 50K reads/writes, 1GB storage/month | Enough for small user base; optimize writes |
| Authentication   | 10K verifications/month        | Enough for MVP                              |
| Cloud Functions  | 2M invocations/month           | Could spike with AI chat; monitor usage     |
| Storage          | 5GB storage, 1GB download/day  | Compress media assets                        |
| FCM              | Unlimited notifications        | Free and sufficient                          |
| Analytics        | Unlimited events               | Free for tracking engagement                 |
