'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useAuthStore, AppUser } from '../store/auth.store';
import { useHabitsStore } from '../store/habits.store';
import { useGamificationStore } from '../store/gamification.store';
import { requestNotificationPermission, saveFCMToken } from '../services/notifications';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  isLoading: true,
});

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    setUser,
    setFirebaseUser,
    setLoading,
    clearAuth,
    user,
    loading,
  } = useAuthStore();
  const { setCurrentStreak } = useHabitsStore();
  const { setTotalPoints, setLevel, setLevelTitle, setBadges } = useGamificationStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as AppUser;
            setUser(userData);
            setCurrentStreak(userData.currentStreak || 0);
            setTotalPoints(userData.totalPoints || 0);
            setLevel(userData.level || 1);

            // Sync badges from Firestore
            if (userData.badges && Array.isArray(userData.badges)) {
              setBadges(
                userData.badges.map((id: string) => ({
                  id,
                  name: id,
                  description: '',
                  icon: '🏅',
                  rarity: 'common' as const,
                  unlockedAt: new Date(),
                }))
              );
            }

            // Request FCM notification permission
            requestNotificationPermission().then((token) => {
              if (token) {
                saveFCMToken(firebaseUser.uid, token);
              }
            }).catch(() => { /* permission denied or not supported */ });
          } else {
            // New user — set minimal data from Firebase auth
            const newUser: AppUser = {
              id: firebaseUser.uid,
              email: firebaseUser.email ?? '',
              displayName: firebaseUser.displayName ?? firebaseUser.email ?? 'EcoHero',
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
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            setUser(newUser);
          }
        } catch {
          // If Firestore fetch fails, use basic Firebase user info
          const fallbackUser: AppUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email ?? '',
            displayName: firebaseUser.displayName ?? 'EcoHero',
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
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setUser(fallbackUser);
        }
      } else {
        clearAuth();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setFirebaseUser, setLoading, clearAuth, setCurrentStreak, setTotalPoints, setLevel, setLevelTitle, setBadges]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading: loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
