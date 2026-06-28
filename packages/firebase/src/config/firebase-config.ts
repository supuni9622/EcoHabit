import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Firestore collection constants
export const COLLECTIONS = {
  USERS: 'users',
  HABIT_LOGS: 'habitLogs',
  CHALLENGES: 'challenges',
  LESSONS: 'lessons',
  LEADERBOARD: 'leaderboard',
  CHAT_MESSAGES: 'chatMessages',
  ANALYTICS: 'analytics',
} as const;

// Initialize Firebase (avoid duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Messaging is only available in browser (not SSR)
export const getMessagingService = async () => {
  if (typeof window === 'undefined') {
    return null;
  }
  const { getMessaging } = await import('firebase/messaging');
  return getMessaging(app);
};

export default app;
