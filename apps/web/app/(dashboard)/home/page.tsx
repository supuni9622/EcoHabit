'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../../lib/store/auth.store';
import { getTodayHabitLogs, getRecentHabitLogs } from '../../../lib/services/habits';
import { WEEKLY_CHALLENGES, WASTE_TYPE_ICONS, WASTE_TYPE_LABELS } from '@ecohabit/shared';
import type { HabitLogRecord } from '../../../lib/services/habits';

function getTodayChallenge() {
  const day = new Date().getDay();
  return WEEKLY_CHALLENGES.find((c) => c.dayOfWeek === day) ?? WEEKLY_CHALLENGES[0];
}

const QUICK_LOG_TYPES = [
  { type: 'plastic', icon: '🥤', label: 'Plastic', pts: 10, color: 'bg-blue-50 border-blue-200' },
  { type: 'paper', icon: '📄', label: 'Paper', pts: 8, color: 'bg-green-50 border-green-200' },
  { type: 'e-waste', icon: '💻', label: 'E-Waste', pts: 20, color: 'bg-purple-50 border-purple-200' },
  { type: 'organic', icon: '🍎', label: 'Organic', pts: 5, color: 'bg-yellow-50 border-yellow-200' },
];

export default function HomePage() {
  const { user } = useAuthStore();
  const [todayLogs, setTodayLogs] = useState<HabitLogRecord[]>([]);
  const [recentLogs, setRecentLogs] = useState<HabitLogRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const todayChallenge = getTodayChallenge();
  const todayPoints = todayLogs.reduce((s, l) => s + l.pointsAwarded, 0);
  const totalCO2 = todayLogs.reduce((s, l) => s + l.co2Saved, 0);
  const totalWater = todayLogs.reduce((s, l) => s + l.waterSaved, 0);

  useEffect(() => {
    if (user) {
      Promise.all([
        getTodayHabitLogs(user.id),
        getRecentHabitLogs(user.id, 5),
      ])
        .then(([today, recent]) => {
          setTodayLogs(today);
          setRecentLogs(recent);
        })
        .finally(() => setDataLoading(false));
    }
  }, [user]);

  if (!user) return null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {greeting}, {user.displayName?.split(' ')[0] ?? 'EcoHero'}! {user.avatar ?? '🌱'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {todayLogs.length === 0
            ? 'Start logging to earn points today!'
            : `You logged ${todayLogs.length} action${todayLogs.length !== 1 ? 's' : ''} today — keep it up!`}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-600 text-white rounded-xl p-3 text-center">
          <div className="text-xl font-bold">{(user.totalPoints ?? 0).toLocaleString()}</div>
          <div className="text-xs text-green-100">Total Points</div>
        </div>
        <div className="bg-orange-500 text-white rounded-xl p-3 text-center">
          <div className="text-xl font-bold">{user.currentStreak ?? 0}</div>
          <div className="text-xs text-orange-100">Day Streak 🔥</div>
        </div>
        <div className="bg-blue-500 text-white rounded-xl p-3 text-center">
          <div className="text-xl font-bold">Lv.{user.level ?? 1}</div>
          <div className="text-xs text-blue-100">Level</div>
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">Today's Challenge</h2>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            +{todayChallenge.points} pts
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-3">{todayChallenge.title}</p>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{
              width:
                todayChallenge.target === 0
                  ? '100%'
                  : `${Math.min(
                      100,
                      (todayLogs.filter((l) => l.wasteType === todayChallenge.wasteType).length /
                        todayChallenge.target) *
                        100
                    )}%`,
            }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {todayChallenge.target === 0
            ? 'Avoid plastic today'
            : `${todayLogs.filter((l) => l.wasteType === todayChallenge.wasteType).length} / ${todayChallenge.target} items`}
        </p>
      </div>

      {/* Quick Log */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">Quick Log</h2>
          <Link href="/habits" className="text-sm text-green-600 font-medium">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_LOG_TYPES.map((item) => (
            <Link
              key={item.type}
              href={`/habits/log?type=${item.type}`}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 ${item.color} transition-transform active:scale-95`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium text-gray-700">{item.label}</span>
              <span className="text-xs text-green-600">+{item.pts}pts</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Impact Summary */}
      {(totalCO2 > 0 || totalWater > 0) && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
          <h2 className="font-semibold text-gray-800 mb-3">Today's Impact</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalCO2.toFixed(2)}</div>
              <div className="text-xs text-gray-500">kg CO₂ saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {(totalWater * 1000).toFixed(0)}
              </div>
              <div className="text-xs text-gray-500">mL water saved</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Actions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">Recent Actions</h2>
          <Link href="/habits" className="text-sm text-green-600 font-medium">
            View all →
          </Link>
        </div>
        {dataLoading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : recentLogs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <div className="text-4xl mb-3">♻️</div>
            <p className="text-gray-500 text-sm">No actions logged yet.</p>
            <Link
              href="/habits/log"
              className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Log your first action
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-50"
              >
                <span className="text-2xl">
                  {(WASTE_TYPE_ICONS as Record<string, string>)[log.wasteType] ?? '♻️'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {(WASTE_TYPE_LABELS as Record<string, string>)[log.wasteType] ?? log.wasteType}{' '}
                    × {log.quantity}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(log.loggedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-green-600 font-semibold text-sm">
                  +{log.pointsAwarded}pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {todayPoints > 0 && (
        <div className="bg-green-600 text-white rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">Today's points earned</p>
            <p className="text-green-100 text-xs">Daily cap: 500 pts</p>
          </div>
          <div className="text-3xl font-bold">+{todayPoints}</div>
        </div>
      )}
    </div>
  );
}
