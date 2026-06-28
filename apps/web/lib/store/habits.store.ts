import { create } from 'zustand';

export interface HabitLogEntry {
  id: string;
  userId: string;
  wasteType: string;
  quantity: number;
  pointsAwarded: number;
  notes: string;
  loggedAt: Date;
  co2Saved: number;
  waterSaved: number;
}

interface HabitsState {
  todayLogs: HabitLogEntry[];
  recentLogs: HabitLogEntry[];
  currentStreak: number;
  longestStreak: number;
  totalActions: number;
  todayPoints: number;
  loading: boolean;
  error: string | null;
  setTodayLogs: (logs: HabitLogEntry[]) => void;
  setRecentLogs: (logs: HabitLogEntry[]) => void;
  addLog: (log: HabitLogEntry) => void;
  setCurrentStreak: (streak: number) => void;
  setLongestStreak: (streak: number) => void;
  setTotalActions: (count: number) => void;
  setTodayPoints: (points: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useHabitsStore = create<HabitsState>((set) => ({
  todayLogs: [],
  recentLogs: [],
  currentStreak: 0,
  longestStreak: 0,
  totalActions: 0,
  todayPoints: 0,
  loading: false,
  error: null,

  setTodayLogs: (logs) => set({ todayLogs: logs }),
  setRecentLogs: (logs) => set({ recentLogs: logs }),

  addLog: (log) =>
    set((state) => ({
      todayLogs: [log, ...state.todayLogs],
      recentLogs: [log, ...state.recentLogs].slice(0, 20),
      totalActions: state.totalActions + 1,
      todayPoints: state.todayPoints + log.pointsAwarded,
    })),

  setCurrentStreak: (streak) => set({ currentStreak: streak }),
  setLongestStreak: (streak) => set({ longestStreak: streak }),
  setTotalActions: (count) => set({ totalActions: count }),
  setTodayPoints: (points) => set({ todayPoints: points }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  reset: () =>
    set({
      todayLogs: [],
      recentLogs: [],
      currentStreak: 0,
      longestStreak: 0,
      totalActions: 0,
      todayPoints: 0,
      loading: false,
      error: null,
    }),
}));
