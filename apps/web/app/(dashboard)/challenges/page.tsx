'use client';

import { useState, useEffect } from 'react';
import { trackChallengeJoined } from '../../../lib/services/analytics';

interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetDays?: number;
  targetItems?: number;
  participants: number;
  pointsReward: number;
  badge: string;
  endsAt: Date;
  wasteType: string;
}

const COMMUNITY_CHALLENGES: CommunityChallenge[] = [
  {
    id: 'c1',
    title: '7-Day Plastic-Free Challenge',
    description: 'Log zero plastic waste for 7 consecutive days. Bring your own bag, bottle, and container!',
    icon: '🚫🥤',
    targetDays: 7,
    participants: 247,
    pointsReward: 500,
    badge: 'Plastic-Free Hero',
    endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    wasteType: 'plastic',
  },
  {
    id: 'c2',
    title: 'Paper Champion Sprint',
    description: 'Recycle 20 paper items this week. Save the forests!',
    icon: '📄🌳',
    targetItems: 20,
    participants: 183,
    pointsReward: 300,
    badge: 'Paper Champion',
    endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    wasteType: 'paper',
  },
  {
    id: 'c3',
    title: 'E-Waste Warriors',
    description: 'Responsibly dispose of 3 electronic items this month.',
    icon: '💻♻️',
    targetItems: 3,
    participants: 94,
    pointsReward: 600,
    badge: 'E-Waste Warrior',
    endsAt: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    wasteType: 'e-waste',
  },
  {
    id: 'c4',
    title: 'Compost 30',
    description: 'Log 30 organic waste items this month. Turn waste into garden gold!',
    icon: '🍎🌱',
    targetItems: 30,
    participants: 312,
    pointsReward: 400,
    badge: 'Compost Champion',
    endsAt: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    wasteType: 'organic',
  },
];

function daysRemaining(endsAt: Date): number {
  return Math.max(0, Math.ceil((endsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

type Tab = 'active' | 'mine' | 'completed';

export default function ChallengesPage() {
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('active');

  // Load joined challenges from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ecohabit-joined-challenges');
      if (stored) setJoinedIds(JSON.parse(stored) as string[]);
    } catch { /* ignore */ }
  }, []);

  const toggleJoin = (challengeId: string) => {
    setJoinedIds((prev) => {
      const next = prev.includes(challengeId)
        ? prev.filter((id) => id !== challengeId)
        : [...prev, challengeId];
      try {
        localStorage.setItem('ecohabit-joined-challenges', JSON.stringify(next));
      } catch { /* ignore */ }
      if (!prev.includes(challengeId)) {
        trackChallengeJoined(challengeId).catch(() => {});
      }
      return next;
    });
  };

  const myChallenges = COMMUNITY_CHALLENGES.filter((c) => joinedIds.includes(c.id));

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      {/* Motivational header */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl p-5 shadow-lg">
        <div className="text-3xl mb-2">🇱🇰</div>
        <h1 className="text-xl font-bold mb-1">Join 836 Sri Lankans</h1>
        <p className="text-green-100 text-sm">Making a difference together — one challenge at a time.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-2xl p-1">
        {([
          { key: 'active', label: 'Active' },
          { key: 'mine', label: joinedIds.length > 0 ? `My Challenges (${joinedIds.length})` : 'My Challenges' },
          { key: 'completed', label: 'Completed' },
        ] as { key: Tab; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 text-xs font-medium rounded-xl transition-all ${
              activeTab === tab.key
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active challenges */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {COMMUNITY_CHALLENGES.map((challenge) => {
            const joined = joinedIds.includes(challenge.id);
            const days = daysRemaining(challenge.endsAt);
            return (
              <div
                key={challenge.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-3xl">{challenge.icon}</div>
                  <div className="flex-1">
                    <h2 className="font-bold text-gray-800 text-base">{challenge.title}</h2>
                    <p className="text-gray-500 text-sm mt-0.5">{challenge.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-gray-50 rounded-xl p-2 text-center">
                    <p className="text-xs text-gray-400">Participants</p>
                    <p className="font-bold text-gray-700 text-sm">{challenge.participants}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2 text-center">
                    <p className="text-xs text-gray-400">Days Left</p>
                    <p className={`font-bold text-sm ${days <= 2 ? 'text-red-500' : 'text-gray-700'}`}>
                      {days}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-2 text-center">
                    <p className="text-xs text-gray-400">Reward</p>
                    <p className="font-bold text-green-600 text-sm">+{challenge.pointsReward}pts</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full px-2 py-0.5">
                    🏅 {challenge.badge}
                  </span>
                </div>

                <button
                  onClick={() => toggleJoin(challenge.id)}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    joined
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {joined ? 'Joined ✓' : 'Join Challenge'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* My Challenges */}
      {activeTab === 'mine' && (
        <div className="space-y-4">
          {myChallenges.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <div className="text-4xl mb-3">🎯</div>
              <p className="font-semibold text-gray-700 mb-1">No challenges joined yet</p>
              <p className="text-sm text-gray-400">Join a challenge to track your progress here!</p>
              <button
                onClick={() => setActiveTab('active')}
                className="mt-4 bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm"
              >
                Browse Challenges
              </button>
            </div>
          ) : (
            myChallenges.map((challenge) => {
              const target = challenge.targetItems ?? challenge.targetDays ?? 1;
              const mockProgress = Math.min(target, Math.max(1, Math.floor(target * 0.15)));
              const progressPct = Math.round((mockProgress / target) * 100);
              return (
                <div
                  key={challenge.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{challenge.icon}</span>
                    <div>
                      <h2 className="font-bold text-gray-800 text-sm">{challenge.title}</h2>
                      <p className="text-xs text-gray-400">
                        {daysRemaining(challenge.endsAt)} days remaining
                      </p>
                    </div>
                  </div>
                  <div className="mb-2 flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span className="font-medium text-green-600">
                      {mockProgress}/{target} {challenge.targetItems ? 'items' : 'days'}
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{progressPct}% complete</p>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Completed */}
      {activeTab === 'completed' && (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <div className="text-4xl mb-3">🏆</div>
          <p className="font-semibold text-gray-700 mb-1">No completed challenges yet</p>
          <p className="text-sm text-gray-400">Complete a challenge to see it here!</p>
        </div>
      )}
    </div>
  );
}
