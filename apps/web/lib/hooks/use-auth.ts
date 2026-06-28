'use client';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useAuthStore } from '../store/auth.store';

export function useAuth() {
  const { user, firebaseUser, loading, error, setError } = useAuthStore();

  const signInWithEmail = async (email: string, password: string) => {
    setError(null);
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    setError(null);
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });
    // Create user document in Firestore
    await setDoc(doc(db, 'users', credential.user.uid), {
      id: credential.user.uid,
      email,
      displayName,
      avatar: '🌱',
      level: 1,
      totalPoints: 0,
      currentStreak: 0,
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
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return credential.user;
  };

  const signInWithGoogle = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    const userRef = doc(db, 'users', credential.user.uid);
    await setDoc(
      userRef,
      {
        id: credential.user.uid,
        email: credential.user.email,
        displayName: credential.user.displayName ?? 'EcoHero',
        avatar: '🌱',
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return credential.user;
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return {
    user,
    firebaseUser,
    loading,
    error,
    isAuthenticated: !!user,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
  };
}
