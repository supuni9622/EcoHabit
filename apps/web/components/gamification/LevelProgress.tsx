'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface LevelProgressProps {
  totalPoints: number;
  level: number;
  levelTitle: string;
  progress: number; // 0-100
  pointsToNext: number;
  className?: string;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  totalPoints,
  level,
  levelTitle,
  progress,
  pointsToNext,
  className,
}) => {
  return (
    <div className={clsx('bg-white rounded-2xl p-5 shadow-sm border border-gray-100', className)}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-bold text-gray-800">Level {level}</p>
          <p className="text-xs text-gray-500">{levelTitle}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-green-600 text-lg">{totalPoints.toLocaleString()}</p>
          <p className="text-xs text-gray-400">total points</p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {pointsToNext > 0 ? (
          <p className="text-xs text-gray-400">
            {pointsToNext.toLocaleString()} pts to Level {level + 1}
          </p>
        ) : (
          <p className="text-xs text-green-600 font-medium">Max level reached! 🏆</p>
        )}
      </div>
    </div>
  );
};
