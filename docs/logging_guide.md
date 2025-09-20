# 📊 EcoHabit Logging & Analytics

This document outlines the logging and analytics strategy for the EcoHabit app, covering **user action logging**, **system-level logging**, and recommendations for best practices.

---

## 1. User Action Logging (Gamification & Analytics)

### A. Firestore
**Purpose:**  
Store structured logs of user actions for points, streaks, and badges.

**Example Structure:**
```json
users/{userId}/logs/{logId} {
  "type": "plastic" | "paper" | "e-waste",
  "quantity": 3,
  "date": "2025-09-19T15:30:00Z",
  "pointsAwarded": 10,
  "lessonId": "lesson1",
  "streakUpdated": true
}

**Advantages:**  
- Real-time updates  
- Scalable  
- Easy to query for streaks and leaderboards

### B. Firebase Analytics / PostHog

**Purpose:**  
Track high-level user behavior, e.g., daily active users, lesson completion, streak retention.

**Example Events:**  
- `lesson_completed` → lessonId, duration  
- `action_logged` → waste type, quantity  
- `badge_unlocked` → badgeId  
- `ai_chat_interaction` → sessionId  

**Advantages:**  
- Easy visualization  
- Funnels  
- Retention tracking

---

## 2. System-Level Logging (Debugging & Monitoring)

### A. Console & Cloud Logging

**Vercel / Firebase Functions Logging:**  
- Use `console.log`, `console.error` for API routes and Cloud Functions  
- Logs appear in Firebase Cloud Functions console or Vercel logs

**Sentry (Recommended for Frontend & Backend):**  
- Capture runtime errors and exceptions from PWA and API routes  
- Includes user context, stack trace, and environment

### B. Example Logging Flow

1. User logs 2 plastic bottles → API route triggers  
2. Backend Cloud Function:  
   - Updates Firestore logs collection  
   - Updates points & streak  
   - Logs success in Cloud Functions logs  
   - Sends FCM notification if streak milestone reached  
   - Analytics event sent to Firebase/PostHog  
3. Any error → captured by Sentry

---

## 3. Logging Recommendations

- **User-facing logging:** Firestore + Analytics (for gamification, feedback loops)  
- **System debugging & monitoring:** Console logs + Sentry  
- **Security:** Avoid storing sensitive info in logs (e.g., AI chat content can be anonymized)  

💡 **Tip:**  
Since this is an MVP, start with Firestore + Firebase Analytics for everything. Later, integrate structured logging and Sentry once the app scales or if errors need deeper debugging.
