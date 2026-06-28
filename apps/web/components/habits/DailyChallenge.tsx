'use client';

import React from 'react';
import { clsx } from 'clsx';
import Link from 'next/link';

export interface DailyChallengeProps {
  title: string;
  description?: string;
  wasteType: string;
  target: number;
  current: number;
  points: number;
  className?: string;
}

const WASTE_ICONS: Record<string, string> = {
  plastic: '🥤',
  paper: '📄',
  'e-waste': '💻',
  organic: '🍎',
  glass: '🍶',
  metal: '🥫',
  general: '🗑️',
};

export const DailyChallenge: React.FC<DailyChallengeProps> = ({
  title,
  description,
  wasteType,
  target,
  current,
  points,
  className,
}) => {
  const progress = target === 0 ? 100 : Math.min(100, (current / target) * 100);
  const isComplete = progress >= 100;

  return (
    <div
      className={clsx(
        'bg-gradient-to-br rounded-2xl p-5',
        isComplete
          ? 'from-green-500 to-emerald-600'
          : 'from-blue-500 to-blue-600',
        'text-white shadow-lg',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-medium opacity-80 uppercase tracking-wide">
            Today's Challenge
          </span>
          <h3 className="font-bold text-lg mt-0.5">{title}</h3>
          {description && <p className="text-sm opacity-80 mt-0.5">{description}</p>}
        </div>
        <span className="text-3xl ml-3">{WASTE_ICONS[wasteType] ?? '♻️'}</span>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>{isComplete ? 'Completed! 🎉' : `${current} / ${target} items`}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm opacity-80">Reward: +{points} pts</span>
        <Link
          href="/habits/log"
          className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          Log Now →
        </Link>
      </div>
    </div>
  );
};
