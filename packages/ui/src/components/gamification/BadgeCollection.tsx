import React from 'react';
import { cn } from '../../lib/utils';
import { TrophyRoom } from '../3d/TrophyRoom';
import { ProgressiveEnhancement } from '../common/ProgressiveEnhancement';
import { Badge } from '@ecohabit/shared';
import { shouldUse3D } from '@ecohabit/shared';

export interface BadgeCollectionProps {
  badges: Badge[];
  className?: string;
  enable3D?: boolean;
  onBadgeSelect?: (badge: Badge) => void;
}

/**
 * BadgeCollection component
 * Supports 3D trophy room with fallback to 2D grid
 */
export const BadgeCollection: React.FC<BadgeCollectionProps> = ({
  badges,
  className,
  enable3D,
  onBadgeSelect,
}) => {
  const use3D = enable3D !== undefined ? enable3D : shouldUse3D();

  if (use3D) {
    return (
      <div className={cn('w-full h-96', className)}>
        <TrophyRoom badges={badges} onBadgeSelect={onBadgeSelect} />
      </div>
    );
  }

  // 2D Grid fallback with CSS3 hover effects
  return (
    <ProgressiveEnhancement strategy="css3d" className={className}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            onClick={() => onBadgeSelect?.(badge)}
            className={cn(
              'flex flex-col items-center p-4 rounded-lg border-2',
              'transition-all duration-300 cursor-pointer',
              'hover:scale-105 hover:shadow-lg',
              badge.unlockedAt
                ? 'bg-primary/10 border-primary hover:bg-primary/20'
                : 'bg-muted border-border opacity-50'
            )}
          >
            <span className="text-3xl mb-2">{badge.icon}</span>
            <span className="text-sm font-medium text-center text-foreground">
              {badge.name}
            </span>
            <span className="text-xs text-foreground-muted capitalize mt-1">
              {badge.rarity}
            </span>
          </div>
        ))}
      </div>
    </ProgressiveEnhancement>
  );
};
