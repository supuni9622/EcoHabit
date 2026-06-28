import { create } from 'zustand';

export interface BadgeEntry {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatar: string;
  points: number;
  level: number;
  rank: number;
  streak: number;
  badges: number;
}

interface GamificationState {
  totalPoints: number;
  level: number;
  levelTitle: string;
  levelProgress: number;
  pointsToNextLevel: number;
  badges: BadgeEntry[];
  newlyUnlockedBadges: BadgeEntry[];
  leaderboard: LeaderboardEntry[];
  userRank: number;
  loading: boolean;
  error: string | null;
  setTotalPoints: (points: number) => void;
  setLevel: (level: number) => void;
  setLevelTitle: (title: string) => void;
  setLevelProgress: (progress: number) => void;
  setPointsToNextLevel: (points: number) => void;
  setBadges: (badges: BadgeEntry[]) => void;
  addBadge: (badge: BadgeEntry) => void;
  setNewlyUnlockedBadges: (badges: BadgeEntry[]) => void;
  clearNewlyUnlockedBadges: () => void;
  setLeaderboard: (entries: LeaderboardEntry[]) => void;
  setUserRank: (rank: number) => void;
  addPoints: (points: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  totalPoints: 0,
  level: 1,
  levelTitle: 'Eco Beginner',
  levelProgress: 0,
  pointsToNextLevel: 500,
  badges: [],
  newlyUnlockedBadges: [],
  leaderboard: [],
  userRank: 0,
  loading: false,
  error: null,

  setTotalPoints: (points) => set({ totalPoints: points }),
  setLevel: (level) => set({ level }),
  setLevelTitle: (levelTitle) => set({ levelTitle }),
  setLevelProgress: (levelProgress) => set({ levelProgress }),
  setPointsToNextLevel: (pointsToNextLevel) => set({ pointsToNextLevel }),
  setBadges: (badges) => set({ badges }),

  addBadge: (badge) =>
    set((state) => ({
      badges: [...state.badges, badge],
      newlyUnlockedBadges: [...state.newlyUnlockedBadges, badge],
    })),

  setNewlyUnlockedBadges: (newlyUnlockedBadges) => set({ newlyUnlockedBadges }),
  clearNewlyUnlockedBadges: () => set({ newlyUnlockedBadges: [] }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  setUserRank: (userRank) => set({ userRank }),

  addPoints: (points) =>
    set((state) => ({ totalPoints: state.totalPoints + points })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  reset: () =>
    set({
      totalPoints: 0,
      level: 1,
      levelTitle: 'Eco Beginner',
      levelProgress: 0,
      pointsToNextLevel: 500,
      badges: [],
      newlyUnlockedBadges: [],
      leaderboard: [],
      userRank: 0,
      loading: false,
      error: null,
    }),
}));
