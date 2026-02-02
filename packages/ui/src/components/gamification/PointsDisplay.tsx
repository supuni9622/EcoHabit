import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { CSS3Animations } from '../animations/CSS3Animations';
import { detectCSS3DSupport } from '@ecohabit/shared';

export interface PointsDisplayProps {
  points: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

/**
 * PointsDisplay component
 * Animated number reveal with CSS3 fallback
 */
export const PointsDisplay: React.FC<PointsDisplayProps> = ({
  points,
  className,
  showLabel = true,
  size = 'md',
  animated = true,
}) => {
  const [displayPoints, setDisplayPoints] = useState(points);
  const [isAnimating, setIsAnimating] = useState(false);
  const supportsCSS3D = detectCSS3DSupport();

  useEffect(() => {
    if (animated && points !== displayPoints) {
      setIsAnimating(true);
      const start = displayPoints;
      const end = points;
      const duration = 500;
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);
        
        setDisplayPoints(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    } else {
      setDisplayPoints(points);
    }
  }, [points, animated, displayPoints]);

  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn(
        'text-2xl transition-transform duration-300',
        isAnimating && 'animate-bounce-gentle'
      )}>
        ⭐
      </span>
      <div className="flex flex-col">
        <span
          className={cn(
            'font-bold text-primary transition-all duration-300',
            isAnimating && 'scale-110',
            sizeStyles[size]
          )}
        >
          {displayPoints.toLocaleString()}
        </span>
        {showLabel && (
          <span className="text-xs text-foreground-muted">Points</span>
        )}
      </div>
    </div>
  );

  if (animated && supportsCSS3D) {
    return (
      <CSS3Animations animation="reveal">
        {content}
      </CSS3Animations>
    );
  }

  return content;
};
