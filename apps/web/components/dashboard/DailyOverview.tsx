'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface DailyOverviewProps {
  todayPoints: number;
  dailyCap?: number;
  actionsToday: number;
  goalActions?: number;
  streak: number;
  className?: string;
}

export const DailyOverview: React.FC<DailyOverviewProps> = ({
  todayPoints,
  dailyCap = 500,
  actionsToday,
  goalActions = 5,
  streak,
  className,
}) => {
  const pointsProgress = Math.min(100, (todayPoints / dailyCap) * 100);
  const actionsProgress = Math.min(100, (actionsToday / goalActions) * 100);

  return (
    <div className={clsx('bg-white rounded-2xl shadow-sm border border-gray-100 p-5', className)}>
      <h3 className="font-semibold text-gray-800 mb-4">Today&apos;s Overview</h3>

      <div className="space-y-4">
        {/* Points progress */}
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-gray-600 font-medium">Points Earned</span>
            <span className="font-bold text-green-600">
              {todayPoints} / {dailyCap}
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
              style={{ width: `${pointsProgress}%` }}
            />
          </div>
          {todayPoints >= dailyCap && (
            <p className="text-xs text-green-600 font-medium mt-1">Daily cap reached! 🎉</p>
          )}
        </div>

        {/* Actions progress */}
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-gray-600 font-medium">Actions Today</span>
            <span className="font-bold text-blue-600">
              {actionsToday} / {goalActions}
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${actionsProgress}%` }}
            />
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
          <div className="text-3xl">🔥</div>
          <div>
            <p className="font-bold text-gray-800">{streak} Day Streak</p>
            <p className="text-xs text-gray-400">
              {streak === 0
                ? 'Log an action to start your streak!'
                : streak >= 7
                ? 'Amazing consistency!'
                : 'Keep it up!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
