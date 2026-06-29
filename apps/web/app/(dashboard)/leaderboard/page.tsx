'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../../lib/store/auth.store';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatar: string;
  points: number;
  level: number;
  streak: number;
  badges: number;
  isAnonymous: boolean;
}

type Period = 'all-time' | 'weekly' | 'monthly' | 'friends';

const MEDAL = ['🥇', '🥈', '🥉'];

const PERIOD_LABELS: Record<Period, string> = {
  'all-time': 'All Time',
  weekly: 'This Week',
  monthly: 'This Month',
  friends: 'Friends',
};

export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [period, setPeriod] = useState<Period>('all-time');

  const fetchLeaderboard = useCallback(async (selectedPeriod: Period) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (selectedPeriod === 'friends') {
        params.set('period', 'all-time');
        params.set('friendsOnly', 'true');
      } else {
        params.set('period', selectedPeriod);
      }

      if (user?.id) params.set('userId', user.id);

      const res = await fetch(`/api/gamification/leaderboard?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch leaderboard');

      const data = await res.json();
      setEntries(data.entries ?? []);
      setUserRank(data.userRank ?? null);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchLeaderboard(period);
  }, [period, fetchLeaderboard]);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
        <p className="text-gray-500 text-sm mt-1">Top eco-heroes competing for the planet</p>
      </div>

      {/* Period toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-0.5">
        {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
              period === p
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* User rank card */}
      {user && (
        <div className="bg-green-600 text-white rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="text-3xl">{user.avatar ?? '🌱'}</div>
            <div className="flex-1">
              <p className="font-semibold">{user.displayName}</p>
              <p className="text-green-100 text-sm">
                {(user.totalPoints ?? 0).toLocaleString()} points • Lv.{user.level ?? 1}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {userRank ? `#${userRank}` : '—'}
              </div>
              <div className="text-green-100 text-xs">Your rank</div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="text-4xl animate-spin mb-3">♻️</div>
          <p className="text-gray-400">Loading leaderboard...</p>
        </div>
      ) : period === 'friends' && entries.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">👥</div>
          <p className="text-gray-500 font-medium">No friends yet</p>
          <p className="text-gray-400 text-sm mt-1 mb-4">
            Add friends to see your friends leaderboard!
          </p>
          <Link
            href="/profile/friends"
            className="inline-block bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
          >
            Find Friends
          </Link>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🌱</div>
          <p className="text-gray-500">No entries yet for {PERIOD_LABELS[period].toLowerCase()}.</p>
          <p className="text-gray-400 text-sm mt-1">Log an action to get on the board!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => {
            const isCurrentUser = entry.userId === user?.id;
            const displayName = entry.isAnonymous
              ? 'Anonymous EcoHero 🌿'
              : entry.displayName;

            return (
              <div
                key={entry.userId}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                  isCurrentUser
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-100'
                }`}
              >
                {/* Rank */}
                <div className="w-8 text-center flex-shrink-0">
                  {entry.rank <= 3 ? (
                    <span className="text-xl">{MEDAL[entry.rank - 1]}</span>
                  ) : (
                    <span className="text-sm font-bold text-gray-400">#{entry.rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-xl border-2 border-green-100 flex-shrink-0">
                  {entry.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className={`font-medium truncate text-sm ${isCurrentUser ? 'text-green-800' : 'text-gray-800'}`}>
                      {displayName}
                    </p>
                    {isCurrentUser && (
                      <span className="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    Lv.{entry.level} • 🔥{entry.streak} streak • 🏅{entry.badges} badges
                  </p>
                </div>

                {/* Points */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-green-600">{entry.points.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">points</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
