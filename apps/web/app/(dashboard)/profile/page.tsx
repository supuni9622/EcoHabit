'use client';

import Link from 'next/link';
import { useAuthStore } from '../../../lib/store/auth.store';
import { BADGE_REQUIREMENTS } from '@ecohabit/shared';

const LEVEL_TITLES: Record<number, string> = {
  1: 'Eco Beginner',
  2: 'Eco Explorer',
  3: 'Eco Enthusiast',
  4: 'Eco Warrior',
  5: 'Eco Champion',
  6: 'Eco Master',
  7: 'Eco Legend',
  8: 'Eco Guardian',
  9: 'Eco Hero',
  10: 'Eco Legendary',
};

const LEVEL_THRESHOLDS = [0, 500, 1500, 3000, 5000, 10000, 20000, 35000, 50000, 100000];

export default function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) return null;

  const level = user.level ?? 1;
  const totalPoints = user.totalPoints ?? 0;
  const currentStreak = user.currentStreak ?? 0;
  const unlockedBadges = user.badges ?? [];
  const completedLessons = user.completedLessons ?? [];

  const currentLevelPts = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextLevelPts = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const progress = nextLevelPts > currentLevelPts
    ? Math.min(100, ((totalPoints - currentLevelPts) / (nextLevelPts - currentLevelPts)) * 100)
    : 100;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Profile card */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-4xl border-3 border-white">
            {user.avatar ?? '🌱'}
          </div>
          <div>
            <h1 className="text-xl font-bold">{user.displayName}</h1>
            <p className="text-green-100 text-sm">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs font-medium">
                Level {level} — {LEVEL_TITLES[level] ?? 'Eco Hero'}
              </span>
            </div>
          </div>
        </div>

        {/* Level progress */}
        <div>
          <div className="flex justify-between text-xs text-green-100 mb-1">
            <span>{totalPoints.toLocaleString()} pts</span>
            <span>{nextLevelPts.toLocaleString()} pts to Lv.{level + 1}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Points', value: totalPoints.toLocaleString(), icon: '⭐' },
          { label: 'Current Streak', value: `${currentStreak} days 🔥`, icon: '🔥' },
          { label: 'Badges Earned', value: unlockedBadges.length, icon: '🏅' },
          { label: 'Lessons Done', value: completedLessons.length, icon: '📚' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Badge collection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Badge Collection</h2>
        <div className="grid grid-cols-5 gap-2">
          {BADGE_REQUIREMENTS.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                title={isUnlocked ? `${badge.name}: ${badge.description}` : 'Locked'}
                className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-all ${
                  isUnlocked
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-gray-100 grayscale opacity-40'
                }`}
              >
                {badge.icon}
              </div>
            );
          })}
        </div>
        {unlockedBadges.length === 0 && (
          <p className="text-xs text-gray-400 text-center mt-3">
            Complete eco-actions to unlock badges!
          </p>
        )}
      </div>

      {/* Links */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {[
          { href: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
          { href: '/chat', icon: '🤖', label: 'AI Eco Coach' },
          { href: '/profile/settings', icon: '⚙️', label: 'Settings' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium text-gray-700">{item.label}</span>
            <span className="ml-auto text-gray-300">›</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
