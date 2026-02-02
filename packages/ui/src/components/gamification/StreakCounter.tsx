import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { CSS3Animations } from '../animations/CSS3Animations';
import { detectCSS3DSupport } from '@ecohabit/shared';

export interface StreakCounterProps {
  streak: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

/**
 * StreakCounter component
 * 3D flame animation with CSS3 pulse fallback
 */
export const StreakCounter: React.FC<StreakCounterProps> = ({
  streak,
  className,
  showLabel = true,
  size = 'md',
  animated = true,
}) => {
  const [displayStreak, setDisplayStreak] = useState(streak);
  const [isMilestone, setIsMilestone] = useState(false);
  const supportsCSS3D = detectCSS3DSupport();

  useEffect(() => {
    if (streak > displayStreak) {
      setIsMilestone(true);
      setTimeout(() => setIsMilestone(false), 1000);
    }
    setDisplayStreak(streak);
  }, [streak, displayStreak]);

  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const flameIntensity = Math.min(streak / 10, 1); // Scale animation based on streak

  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        className={cn(
          'text-2xl transition-all duration-300',
          animated && 'animate-pulse-green',
          isMilestone && 'scale-150'
        )}
        style={{
          filter: `brightness(${1 + flameIntensity * 0.5})`,
        }}
      >
        🔥
      </span>
      <div className="flex flex-col">
        <span
          className={cn(
            'font-bold text-orange-500 transition-all duration-300',
            isMilestone && 'scale-110 text-orange-600',
            sizeStyles[size]
          )}
        >
          {displayStreak}
        </span>
        {showLabel && (
          <span className="text-xs text-foreground-muted">Day Streak</span>
        )}
      </div>
    </div>
  );

  if (animated && supportsCSS3D) {
    return (
      <CSS3Animations animation="particle">
        {content}
      </CSS3Animations>
    );
  }

  return content;
};
