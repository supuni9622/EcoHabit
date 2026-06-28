import * as functions from 'firebase-functions';
import { adminDb, COLLECTIONS } from '../../utils/firebase-admin';
import * as admin from 'firebase-admin';

/**
 * Triggered when a new Firebase Auth user is created.
 * Creates a corresponding user profile document in Firestore.
 */
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user;

  const userProfile = {
    id: uid,
    email: email ?? '',
    displayName: displayName ?? (email ? email.split('@')[0] : 'EcoHero'),
    avatar: '🌱',
    photoURL: photoURL ?? null,
    level: 1,
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActionAt: null,
    badges: [],
    completedLessons: [],
    onboardingCompleted: false,
    weeklyGoal: 10,
    preferredWasteTypes: [],
    preferences: {
      notifications: {
        dailyReminder: true,
        achievementAlerts: true,
        streakAlerts: true,
        communityUpdates: false,
      },
      privacy: {
        shareProgress: true,
        showOnLeaderboard: true,
        allowFriendRequests: true,
      },
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    await adminDb.collection(COLLECTIONS.USERS).doc(uid).set(userProfile, { merge: true });
    functions.logger.info(`User profile created for ${uid}`);
  } catch (error) {
    functions.logger.error(`Error creating user profile for ${uid}:`, error);
  }
});
