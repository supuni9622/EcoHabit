import React from 'react';
import { cn } from '../../lib/utils';

export interface StreakCounterProps {
  streak: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  streak,
  className,
  showLabel = true,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-2xl">🔥</span>
      <div className="flex flex-col">
        <span className={cn('font-bold text-orange-500', sizeStyles[size])}>
          {streak}
        </span>
        {showLabel && (
          <span className="text-xs text-muted-foreground">Day Streak</span>
        )}
      </div>
    </div>
  );
};
