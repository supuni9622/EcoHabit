# Cost-Optimization Strategies

## A. Firestore

**Free tier:** 50K reads/writes, 1GB storage/month.

**Optimization Tips:**
- **Batch writes:** Combine multiple streak & points updates in one write.
- **Denormalize data:** Store computed streaks/points per user to reduce reads.
- **Cache lesson content:** Load static lesson content from the frontend instead of querying Firestore repeatedly.

## B. Cloud Functions

**Free tier:** 2M invocations, 400K GB-seconds.

**Optimization Tips:**
- Only invoke functions on important actions (e.g., daily streak, challenge completion).
- Proxy AI chat calls with usage limits to control costs.
- Use background triggers for batch notifications instead of per-user triggers.

## C. Storage

**Free tier:** 5GB storage, 1GB/day download.

**Optimization Tips:**
- Compress images (WebP/AVIF) and videos.
- Preload lessons and assets in the PWA cache to reduce repeated downloads.

## D. Authentication

**Free tier:** 10K verifications/month.

**Optimization Tips:**
- Use email/password + social login; avoid unnecessary verification calls.

## E. FCM (Push Notifications)

**Free tier:** Unlimited.

**Optimization Tips:**
- Batch notifications (e.g., daily challenge reminders sent once per topic).

## F. AI Chat (Gemini)

**Optimization Tips:**
- Limit chat interactions per user per day.
- Cache common prompts and pre-fill answers for frequent queries.
- Use Cloud Functions to proxy requests to Gemini API (keeps API key secure).

---

# MVP vs Scaling Plan

| Layer             | MVP Approach (Free Tier)                  | Scaling Plan                                   |
|------------------|-----------------------------------------|-----------------------------------------------|
| Firestore         | Denormalized, batch writes, small logs  | Partition collections, use Firestore shards  |
| Cloud Functions   | Limited invocations per action          | Optimize with queues (Pub/Sub), serverless scaling |
| Storage           | Compressed static assets                | CDN + lazy load for large media               |
| Analytics         | Firebase / PostHog for small user base | Advanced funnel + segmentation               |
| AI Chat           | Daily limited prompts per user          | Rate limiting, premium tiers, or caching GPT responses |

---

# Key Recommendations

- Use PWA offline caching for lesson content → reduces reads & storage downloads.
- Combine streaks, badges, and points updates in a single write to Firestore.
- Limit AI chat usage to 1–3 prompts per user per day for MVP.
- Batch notifications to prevent multiple Cloud Function triggers.
- Monitor usage with Firebase Console → adjust before hitting free tier limits.
