'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import { useGamificationStore } from '../store/gamification.store';

async function fetchGamificationData(userId: string) {
  const [pointsRes, badgesRes] = await Promise.all([
    fetch(`/api/gamification/points?userId=${userId}`),
    fetch(`/api/gamification/badges?userId=${userId}`),
  ]);

  const [points, badges] = await Promise.all([pointsRes.json(), badgesRes.json()]);

  return { ...points, badges: badges.badges };
}

async function fetchLeaderboard() {
  const res = await fetch('/api/gamification/leaderboard');
  if (!res.ok) throw new Error('Failed to fetch leaderboard');
  return res.json();
}

export function useGamification() {
  const { user } = useAuthStore();
  const {
    totalPoints,
    level,
    levelTitle,
    levelProgress,
    pointsToNextLevel,
    badges,
    newlyUnlockedBadges,
    clearNewlyUnlockedBadges,
    loading,
    error,
  } = useGamificationStore();

  const gamificationQuery = useQuery({
    queryKey: ['gamification', user?.id],
    queryFn: () => fetchGamificationData(user!.id),
    enabled: !!user?.id,
  });

  const leaderboardQuery = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    totalPoints,
    level,
    levelTitle,
    levelProgress,
    pointsToNextLevel,
    badges,
    newlyUnlockedBadges,
    clearNewlyUnlockedBadges,
    leaderboard: leaderboardQuery.data?.entries ?? [],
    userRank: leaderboardQuery.data?.userRank ?? 0,
    loading: loading || gamificationQuery.isLoading,
    error: error ?? (gamificationQuery.error ? String(gamificationQuery.error) : null),
  };
}
