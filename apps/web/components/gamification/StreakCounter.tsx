'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface StreakCounterProps {
  streak: number;
  className?: string;
  showMessage?: boolean;
  compact?: boolean;
}

function getStreakMessage(streak: number): string {
  if (streak >= 365) return 'Legendary! 1 year streak!';
  if (streak >= 100) return 'Incredible! 100 days!';
  if (streak >= 30) return 'Amazing! Monthly master!';
  if (streak >= 7) return 'Great! Week warrior!';
  if (streak >= 3) return 'Nice start!';
  if (streak >= 1) return 'Keep it going!';
  return 'Start your streak today!';
}

function getStreakColor(streak: number): string {
  if (streak >= 30) return 'text-red-500';
  if (streak >= 7) return 'text-orange-500';
  if (streak >= 3) return 'text-yellow-500';
  return 'text-gray-400';
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  streak,
  className,
  showMessage = true,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className={clsx('flex items-center gap-1.5', className)}>
        <span className={clsx('text-xl', getStreakColor(streak))}>🔥</span>
        <span className={clsx('font-bold', getStreakColor(streak))}>{streak}</span>
      </div>
    );
  }

  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <div
        className={clsx(
          'relative w-12 h-12 rounded-full flex items-center justify-center',
          streak >= 7 ? 'animate-pulse' : ''
        )}
      >
        <span className="text-3xl">🔥</span>
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className={clsx('text-2xl font-bold', getStreakColor(streak))}>{streak}</span>
          <span className="text-gray-500 text-sm">day streak</span>
        </div>
        {showMessage && (
          <p className="text-xs text-gray-400">{getStreakMessage(streak)}</p>
        )}
      </div>
    </div>
  );
};
