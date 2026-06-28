import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  admin.initializeApp();
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();

export { admin };

export const COLLECTIONS = {
  USERS: 'users',
  HABIT_LOGS: 'habitLogs',
  CHALLENGES: 'challenges',
  LESSONS: 'lessons',
  LEADERBOARD: 'leaderboard',
  CHAT_MESSAGES: 'chatMessages',
  ANALYTICS: 'analytics',
} as const;
