'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface BadgeCollectionProps {
  badges: BadgeItem[];
  showLocked?: boolean;
  className?: string;
}

const RARITY_COLORS = {
  common: 'border-gray-300 bg-gray-50',
  uncommon: 'border-green-400 bg-green-50',
  rare: 'border-blue-400 bg-blue-50',
  epic: 'border-purple-400 bg-purple-50',
  legendary: 'border-yellow-400 bg-yellow-50',
};

const RARITY_LABELS = {
  common: 'text-gray-600',
  uncommon: 'text-green-700',
  rare: 'text-blue-700',
  epic: 'text-purple-700',
  legendary: 'text-yellow-700',
};

export const BadgeCollection: React.FC<BadgeCollectionProps> = ({
  badges,
  showLocked = true,
  className,
}) => {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const displayBadges = showLocked ? badges : badges.filter((b) => b.unlocked);

  return (
    <div className={clsx('', className)}>
      <div className="grid grid-cols-5 gap-2">
        {displayBadges.map((badge) => (
          <div
            key={badge.id}
            className="relative"
            onMouseEnter={() => setTooltip(badge.id)}
            onMouseLeave={() => setTooltip(null)}
          >
            <div
              className={clsx(
                'aspect-square rounded-xl border-2 flex items-center justify-center text-2xl cursor-pointer transition-transform hover:scale-110',
                badge.unlocked
                  ? RARITY_COLORS[badge.rarity]
                  : 'border-gray-200 bg-gray-100 grayscale opacity-40'
              )}
              title={badge.unlocked ? `${badge.name}: ${badge.description}` : 'Locked'}
            >
              {badge.icon}
            </div>

            {/* Tooltip */}
            {tooltip === badge.id && badge.unlocked && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 w-36 bg-gray-800 text-white rounded-lg p-2 text-xs text-center shadow-lg pointer-events-none">
                <p className={clsx('font-medium', RARITY_LABELS[badge.rarity])}>
                  {badge.name}
                </p>
                <p className="text-gray-300 mt-0.5">{badge.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {displayBadges.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No badges yet. Keep eco-logging!</p>
        </div>
      )}
    </div>
  );
};
