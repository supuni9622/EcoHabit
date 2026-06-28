'use client';

import React from 'react';
import { clsx } from 'clsx';

const LEVEL_THRESHOLDS = [0, 500, 1500, 3000, 5000, 10000, 20000, 35000, 50000, 100000];
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

function getLevel(points: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (points >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  return Math.min(level, 10);
}

function getLevelProgress(points: number, level: number): number {
  const current = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const next = LEVEL_THRESHOLDS[level] ?? current;
  if (next <= current) return 100;
  return Math.min(100, ((points - current) / (next - current)) * 100);
}

export interface PointsDisplayProps {
  points: number;
  showLevel?: boolean;
  showProgress?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PointsDisplay: React.FC<PointsDisplayProps> = ({
  points,
  showLevel = false,
  showProgress = false,
  className,
  size = 'md',
}) => {
  const level = getLevel(points);
  const progress = getLevelProgress(points, level);
  const nextLevelPts = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

  const textSizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' };
  const iconSizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' };

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2">
        <span className={iconSizes[size]}>⭐</span>
        <span className={clsx('font-bold text-green-600', textSizes[size])}>
          {points.toLocaleString()}
        </span>
        <span className="text-gray-400 text-sm">pts</span>
      </div>

      {showLevel && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">
            Lv.{level} — {LEVEL_TITLES[level]}
          </span>
        </div>
      )}

      {showProgress && level < 10 && (
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{points.toLocaleString()} pts</span>
            <span>{nextLevelPts.toLocaleString()} pts</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
