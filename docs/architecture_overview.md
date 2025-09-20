+-------------------+        +-----------------------+
|   User Devices    |        |      Admin Panel     |
|  (Web + PWA)     |        |   (Optional)        |
|                   |        |                     |
+---------+---------+        +----------+----------+
          |                            |
          v                            v
+---------+----------------------------+---------+
|            Firebase Hosting / Next.js SSR      |
|   - Serves web & PWA frontend assets          |
|   - Handles SSR for SEO and lesson pages      |
+----------------+-----------------------------+
                 |
                 v
+----------------+-----------------------------+
|         Firebase Cloud Functions              |
|   - Gamification logic: points, streaks      |
|   - AI chat proxy calls to Gemini API        |
|   - Notification triggers (FCM)             |
+----------------+-----------------------------+
                 |
                 v
+----------------+-----------------------------+
|               Firestore DB                   |
| - Users collection (profile, auth info)     |
| - Logs collection (user actions, points)   |
| - Badges & Lessons collection               |
| - Streaks collection                         |
+----------------+-----------------------------+
                 |
                 v
+----------------+-----------------------------+
|   Firebase Storage (optional)                |
| - Lesson images/videos                       |
| - Compressed media assets                     |
+----------------+-----------------------------+
                 |
                 v
+----------------+-----------------------------+
|        Firebase Analytics / PostHog         |
| - Track user behavior                        |
| - Lesson completions, AI chat engagement    |
| - Retention, DAU/WAU metrics                |
+----------------+-----------------------------+
