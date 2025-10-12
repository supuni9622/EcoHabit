import React from 'react';
import { cn } from '../../lib/utils';

export interface PointsDisplayProps {
  points: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PointsDisplay: React.FC<PointsDisplayProps> = ({
  points,
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
      <span className="text-2xl">⭐</span>
      <div className="flex flex-col">
        <span className={cn('font-bold text-primary', sizeStyles[size])}>
          {points.toLocaleString()}
        </span>
        {showLabel && (
          <span className="text-xs text-muted-foreground">Points</span>
        )}
      </div>
    </div>
  );
};
