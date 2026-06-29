'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { useAuthStore } from '../../../lib/store/auth.store';
import { BADGE_REQUIREMENTS } from '@ecohabit/shared';
import ShareCard from '../../../components/gamification/ShareCard';

interface ReflectionEntry {
  id: string;
  mood: number;
  wasteType: string;
  note: string;
  createdAt: Date;
}

interface BadgeItem {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const MOOD_EMOJIS: Record<number, string> = { 1: '😔', 2: '😐', 3: '🙂', 4: '😊', 5: '🤩' };
const WASTE_EMOJIS: Record<string, string> = {
  plastic: '🥤', paper: '📄', 'e-waste': '💻', organic: '🍎',
  glass: '🍶', metal: '🥫', textile: '👗', general: '🗑️',
};

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
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [shareCardBadge, setShareCardBadge] = useState<BadgeItem | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const q = query(
      collection(db, 'reflections'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc'),
      limit(7)
    );

    getDocs(q).then((snap) => {
      const entries: ReflectionEntry[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          mood: data.mood as number,
          wasteType: data.wasteType as string,
          note: data.note as string ?? '',
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        };
      });
      setReflections(entries);
    }).catch(() => { /* silently fail */ });
  }, [user?.id]);

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

  const inviteCode = user.id.slice(0, 8);
  const inviteUrl = `https://ecohabit.app/invite/${inviteCode}`;

  const handleCopyInvite = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const whatsappInviteUrl = `https://wa.me/?text=${encodeURIComponent(
    `Join me on EcoHabit — track recycling, earn points & save the planet! ${inviteUrl}`
  )}`;
  const instagramCopyText = `Join me on EcoHabit — ${inviteUrl} #EcoHabit #Recycling #SriLanka`;

  const handleInstagramShare = async () => {
    await navigator.clipboard.writeText(instagramCopyText);
    alert('Text copied! Paste it in your Instagram story or bio.');
  };

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
                className={`relative group aspect-square rounded-xl flex flex-col items-center justify-center text-2xl transition-all ${
                  isUnlocked
                    ? 'bg-green-50 border-2 border-green-200 cursor-pointer'
                    : 'bg-gray-100 grayscale opacity-40'
                }`}
                title={isUnlocked ? `${badge.name}: ${badge.description}` : 'Locked'}
              >
                {badge.icon}
                {isUnlocked && (
                  <button
                    onClick={() =>
                      setShareCardBadge({
                        id: badge.id,
                        name: badge.name,
                        icon: badge.icon,
                        description: badge.description,
                      })
                    }
                    className="absolute inset-0 w-full h-full rounded-xl opacity-0 group-hover:opacity-100 bg-green-600/80 flex items-center justify-center transition-opacity"
                    aria-label={`Share ${badge.name}`}
                  >
                    <span className="text-white text-xs font-bold">Share</span>
                  </button>
                )}
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

      {/* Invite Friends */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-1">Invite Friends</h2>
        <p className="text-xs text-gray-400 mb-4">Share EcoHabit and grow the green community</p>

        {/* Invite link display */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 mb-3">
          <span className="flex-1 text-xs text-gray-600 truncate font-mono">{inviteUrl}</span>
          <button
            onClick={handleCopyInvite}
            className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors flex-shrink-0 ${
              copySuccess ? 'bg-green-100 text-green-700' : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {copySuccess ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={whatsappInviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <span>💬</span> WhatsApp
          </a>
          <button
            onClick={handleInstagramShare}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <span>📸</span> Instagram
          </button>
        </div>
      </div>

      {/* Recent Reflections */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Recent Reflections</h2>
        {reflections.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-3">
            Log a habit and share how you feel — reflections appear here!
          </p>
        ) : (
          <div className="space-y-3">
            {reflections.map((r) => (
              <div key={r.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-2xl flex-shrink-0">{MOOD_EMOJIS[r.mood] ?? '🙂'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-base">{WASTE_EMOJIS[r.wasteType] ?? '♻️'}</span>
                    <span className="text-xs text-gray-400">
                      {r.createdAt.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  {r.note && (
                    <p className="text-xs text-gray-600 truncate">{r.note.slice(0, 60)}{r.note.length > 60 ? '…' : ''}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Links */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {[
          { href: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
          { href: '/profile/friends', icon: '👥', label: 'Friends' },
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

      {/* Share Card Modal */}
      {shareCardBadge && (
        <ShareCard
          badge={shareCardBadge}
          user={{ displayName: user.displayName, totalPoints, level, currentStreak }}
          onClose={() => setShareCardBadge(null)}
        />
      )}
    </div>
  );
}
