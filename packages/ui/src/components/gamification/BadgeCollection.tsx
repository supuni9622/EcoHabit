import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeCollectionProps {
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    rarity: string;
    unlockedAt?: Date;
  }>;
  className?: string;
}

export const BadgeCollection: React.FC<BadgeCollectionProps> = ({
  badges,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-2 gap-4', className)}>
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={cn(
            'flex flex-col items-center p-4 rounded-lg border',
            badge.unlockedAt
              ? 'bg-green-50 border-green-200'
              : 'bg-gray-50 border-gray-200 opacity-50'
          )}
        >
          <span className="text-3xl mb-2">{badge.icon}</span>
          <span className="text-sm font-medium text-center">{badge.name}</span>
          <span className="text-xs text-muted-foreground capitalize">
            {badge.rarity}
          </span>
        </div>
      ))}
    </div>
  );
};
