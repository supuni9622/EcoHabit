'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { useAuthStore } from '../../../lib/store/auth.store';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatar: string;
  totalPoints: number;
  level: number;
  currentStreak: number;
  badgeCount: number;
}

const MEDAL = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          orderBy('totalPoints', 'desc'),
          limit(20)
        );
        const snap = await getDocs(q);
        const list: LeaderboardEntry[] = snap.docs.map((d, i) => {
          const data = d.data();
          return {
            rank: i + 1,
            userId: d.id,
            displayName: data.displayName ?? 'EcoHero',
            avatar: data.avatar ?? '🌱',
            totalPoints: data.totalPoints ?? 0,
            level: data.level ?? 1,
            currentStreak: data.currentStreak ?? 0,
            badgeCount: (data.badges ?? []).length,
          };
        });
        setEntries(list);

        if (user) {
          const myRank = list.findIndex((e) => e.userId === user.id);
          setUserRank(myRank >= 0 ? myRank + 1 : null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user]);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
        <p className="text-gray-500 text-sm mt-1">Top eco-heroes this week</p>
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
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🌱</div>
          <p className="text-gray-500">No entries yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => {
            const isCurrentUser = entry.userId === user?.id;
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
                <div className="w-8 text-center">
                  {entry.rank <= 3 ? (
                    <span className="text-xl">{MEDAL[entry.rank - 1]}</span>
                  ) : (
                    <span className="text-sm font-bold text-gray-400">#{entry.rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-xl border-2 border-green-100">
                  {entry.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${isCurrentUser ? 'text-green-800' : 'text-gray-800'}`}>
                    {entry.displayName}
                    {isCurrentUser && <span className="text-green-600 text-xs ml-1">(you)</span>}
                  </p>
                  <p className="text-xs text-gray-400">
                    Lv.{entry.level} • 🔥{entry.currentStreak} streak • 🏅{entry.badgeCount} badges
                  </p>
                </div>

                {/* Points */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-green-600">{entry.totalPoints.toLocaleString()}</p>
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
