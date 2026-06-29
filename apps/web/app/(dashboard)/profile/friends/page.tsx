'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../../../lib/store/auth.store';

interface UserResult {
  id: string;
  displayName: string;
  avatar: string;
  level: number;
  totalPoints: number;
}

interface Friend {
  friendshipId: string;
  friendId: string;
  displayName: string;
  avatar: string;
  level: number;
  totalPoints: number;
  currentStreak: number;
}

type Tab = 'friends' | 'find';

export default function FriendsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [tab, setTab] = useState<Tab>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [addingFriend, setAddingFriend] = useState<string | null>(null);
  const [addedFriends, setAddedFriends] = useState<Set<string>>(new Set());
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    fetchFriends();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchFriends = async () => {
    if (!user?.id) return;
    setLoadingFriends(true);
    try {
      const res = await fetch(`/api/users/friends?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setFriends(data.friends ?? []);
      }
    } catch {
      // silently fail
    } finally {
      setLoadingFriends(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length < 2) {
      setSearchError('Enter at least 2 characters');
      return;
    }
    setSearchError('');
    setSearching(true);
    try {
      const params = new URLSearchParams({ q: searchQuery.trim(), userId: user?.id ?? '' });
      const res = await fetch(`/api/users/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.users ?? []);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAddFriend = async (toUserId: string) => {
    if (!user?.id) return;
    setAddingFriend(toUserId);
    try {
      const res = await fetch('/api/users/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromUserId: user.id, toUserId }),
      });
      if (res.ok) {
        setAddedFriends((prev) => new Set([...prev, toUserId]));
      }
    } catch {
      // silently fail
    } finally {
      setAddingFriend(null);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-800">Friends</h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        {(['friends', 'find'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'friends' ? 'My Friends' : 'Find Friends'}
          </button>
        ))}
      </div>

      {/* My Friends tab */}
      {tab === 'friends' && (
        <div className="space-y-3">
          {loadingFriends ? (
            <div className="text-center py-10">
              <div className="text-3xl animate-spin mb-2">♻️</div>
              <p className="text-gray-400 text-sm">Loading friends...</p>
            </div>
          ) : friends.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">👥</div>
              <p className="text-gray-500 font-medium">No friends yet</p>
              <p className="text-gray-400 text-sm mt-1 mb-4">Find friends to compare your eco-impact!</p>
              <button
                onClick={() => setTab('find')}
                className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                Find Friends
              </button>
            </div>
          ) : (
            friends.map((friend) => (
              <div
                key={friend.friendshipId}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-2xl border-2 border-green-100 flex-shrink-0">
                  {friend.avatar || '🌱'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{friend.displayName}</p>
                  <p className="text-xs text-gray-400">
                    Lv.{friend.level} · {friend.totalPoints.toLocaleString()} pts · 🔥 {friend.currentStreak} days
                  </p>
                </div>
                <Link
                  href="/leaderboard"
                  className="text-xs text-green-600 font-medium hover:underline flex-shrink-0"
                >
                  Leaderboard
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* Find Friends tab */}
      {tab === 'find' && (
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by display name..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={searching}
              className="bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors"
            >
              {searching ? '...' : 'Search'}
            </button>
          </form>

          {searchError && (
            <p className="text-red-500 text-xs px-1">{searchError}</p>
          )}

          <div className="space-y-3">
            {searchResults.length === 0 && !searching && searchQuery.length >= 2 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No users found for &quot;{searchQuery}&quot;</p>
              </div>
            )}
            {searchResults.map((result) => {
              const alreadyAdded = addedFriends.has(result.id);
              return (
                <div
                  key={result.id}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-xl border-2 border-green-100 flex-shrink-0">
                    {result.avatar || '🌱'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{result.displayName}</p>
                    <p className="text-xs text-gray-400">
                      Lv.{result.level} · {result.totalPoints.toLocaleString()} pts
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddFriend(result.id)}
                    disabled={alreadyAdded || addingFriend === result.id}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 ${
                      alreadyAdded
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-60'
                    }`}
                  >
                    {alreadyAdded ? 'Sent ✓' : addingFriend === result.id ? '...' : 'Add Friend'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
