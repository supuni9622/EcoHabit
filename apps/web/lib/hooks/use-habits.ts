'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import { useHabitsStore } from '../store/habits.store';

interface LogHabitInput {
  wasteType: string;
  quantity: number;
  notes?: string;
}

interface LogHabitResult {
  success: boolean;
  pointsEarned: number;
  newBadges: string[];
  newStreak: number;
  totalPoints: number;
}

async function fetchHabitLogs(userId: string) {
  const res = await fetch(`/api/habits/streak?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch habit data');
  return res.json();
}

async function logHabit(input: LogHabitInput): Promise<LogHabitResult> {
  const res = await fetch('/api/habits/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Failed to log habit');
  }
  return res.json();
}

export function useHabits() {
  const { user } = useAuthStore();
  const {
    addLog,
    setCurrentStreak,
    setTodayPoints,
    todayLogs,
    recentLogs,
    currentStreak,
    todayPoints,
    loading,
  } = useHabitsStore();
  const queryClient = useQueryClient();

  const habitsQuery = useQuery({
    queryKey: ['habits', user?.id],
    queryFn: () => fetchHabitLogs(user!.id),
    enabled: !!user?.id,
  });

  const logHabitMutation = useMutation({
    mutationFn: logHabit,
    onSuccess: (result) => {
      if (result.success) {
        const newEntry = {
          id: crypto.randomUUID(),
          userId: user?.id ?? '',
          wasteType: '',
          quantity: 0,
          pointsAwarded: result.pointsEarned,
          notes: '',
          loggedAt: new Date(),
          co2Saved: 0,
          waterSaved: 0,
        };
        addLog(newEntry);
        setCurrentStreak(result.newStreak);
        queryClient.invalidateQueries({ queryKey: ['habits'] });
        queryClient.invalidateQueries({ queryKey: ['gamification'] });
      }
    },
  });

  return {
    todayLogs,
    recentLogs,
    currentStreak,
    todayPoints,
    loading: loading || habitsQuery.isLoading,
    error: habitsQuery.error,
    logHabit: logHabitMutation.mutate,
    logHabitAsync: logHabitMutation.mutateAsync,
    isLogging: logHabitMutation.isPending,
    lastLogResult: logHabitMutation.data,
  };
}
