import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';

export interface AppUser {
  id: string;
  email: string;
  displayName: string;
  avatar: string;
  level: number;
  totalPoints: number;
  currentStreak: number;
  badges: string[];
  completedLessons: string[];
  onboardingCompleted: boolean;
  weeklyGoal: number;
  preferredWasteTypes: string[];
  preferences: {
    notifications: {
      dailyReminder: boolean;
      achievementAlerts: boolean;
      streakAlerts: boolean;
      communityUpdates: boolean;
    };
    privacy: {
      shareProgress: boolean;
      showOnLeaderboard: boolean;
      allowFriendRequests: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

interface AuthState {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  setUser: (user: AppUser | null) => void;
  setFirebaseUser: (firebaseUser: FirebaseUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUser: (updates: Partial<AppUser>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  firebaseUser: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),
  setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  clearAuth: () =>
    set({
      user: null,
      firebaseUser: null,
      loading: false,
      error: null,
    }),
}));
