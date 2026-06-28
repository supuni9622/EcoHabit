'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../lib/store/auth.store';
import { getTodayHabitLogs } from '../../../lib/services/habits';
import { WEEKLY_CHALLENGES } from '@ecohabit/shared';
import type { HabitLogRecord } from '../../../lib/services/habits';

function getTodayChallenge() {
  const day = new Date().getDay();
  return WEEKLY_CHALLENGES.find((c) => c.dayOfWeek === day) ?? WEEKLY_CHALLENGES[0];
}

function getWeekChallenges() {
  return [...WEEKLY_CHALLENGES].sort((a, b) => {
    const today = new Date().getDay();
    const aOffset = (a.dayOfWeek - today + 7) % 7;
    const bOffset = (b.dayOfWeek - today + 7) % 7;
    return aOffset - bOffset;
  });
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ChallengesPage() {
  const { user } = useAuthStore();
  const [todayLogs, setTodayLogs] = useState<HabitLogRecord[]>([]);
  const todayChallenge = getTodayChallenge();
  const weekChallenges = getWeekChallenges();
  const today = new Date().getDay();

  useEffect(() => {
    if (user) {
      getTodayHabitLogs(user.id).then(setTodayLogs);
    }
  }, [user]);

  const todayChallengeProgress =
    todayChallenge.target === 0
      ? 100
      : Math.min(
          100,
          (todayLogs.filter((l) => l.wasteType === todayChallenge.wasteType).length /
            todayChallenge.target) *
            100
        );

  const todayChallengeCount = todayLogs.filter(
    (l) => l.wasteType === todayChallenge.wasteType
  ).length;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Challenges</h1>

      {/* Today's featured challenge */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-white/20 rounded-full px-2 py-0.5 font-medium">
            TODAY'S CHALLENGE
          </span>
        </div>
        <h2 className="text-xl font-bold mb-1">{todayChallenge.title}</h2>
        <p className="text-green-100 text-sm mb-4">
          {todayChallenge.target === 0
            ? 'Avoid using plastic for the entire day'
            : `Recycle ${todayChallenge.target} ${todayChallenge.wasteType} item${todayChallenge.target !== 1 ? 's' : ''}`}
        </p>

        <div className="bg-white/20 rounded-xl p-3 mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>
              {todayChallenge.target === 0
                ? todayChallengeProgress === 100
                  ? 'Complete!'
                  : 'In progress'
                : `${todayChallengeCount} / ${todayChallenge.target}`}
            </span>
          </div>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${todayChallengeProgress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-green-100 text-sm">Reward</span>
          <span className="font-bold">+{todayChallenge.points} pts</span>
        </div>
      </div>

      {/* Weekly challenge overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">This Week's Challenges</h2>
        <div className="space-y-3">
          {weekChallenges.map((challenge) => {
            const isToday = challenge.dayOfWeek === today;
            const isPast = ((challenge.dayOfWeek - today + 7) % 7) > 0 &&
              ((challenge.dayOfWeek - today + 7) % 7) >= 6;

            return (
              <div
                key={challenge.id}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  isToday
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-100'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    isToday ? 'bg-green-500' : 'bg-gray-100'
                  }`}
                >
                  {isToday ? '✅' : isPast ? '⏭️' : '📅'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isToday ? 'text-green-800' : 'text-gray-700'}`}>
                    {challenge.title}
                  </p>
                  <p className="text-xs text-gray-400">{DAY_NAMES[challenge.dayOfWeek]}</p>
                </div>
                <span className="text-xs font-semibold text-green-600">+{challenge.points}pts</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly challenge */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-2">🏆 Weekly Challenge</h2>
        <h3 className="text-lg font-bold text-blue-700 mb-1">Recycling Marathon</h3>
        <p className="text-sm text-gray-600 mb-4">
          Recycle 25 items total across any categories this week
        </p>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium text-blue-600">
            {todayLogs.length} / 25 items
          </span>
        </div>
        <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${Math.min(100, (todayLogs.length / 25) * 100)}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-400">Ends Sunday</span>
          <span className="text-xs font-bold text-blue-600">+500 pts reward</span>
        </div>
      </div>
    </div>
  );
}
