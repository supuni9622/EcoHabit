import React from 'react';
import { cn } from '../../lib/utils';

export interface Fallback2DProps {
  children?: React.ReactNode;
  className?: string;
  message?: string;
}

/**
 * Fallback2D component
 * 2D fallback that maintains functionality without 3D
 * Uses CSS3 animations for visual appeal
 */
export const Fallback2D: React.FC<Fallback2DProps> = ({
  children,
  className,
  message,
}) => {
  return (
    <div
      className={cn(
        'w-full h-full',
        'flex flex-col items-center justify-center',
        'bg-surface border border-border rounded-lg',
        'transition-all duration-300',
        className
      )}
    >
      {children ? (
        <div className="w-full h-full">{children}</div>
      ) : (
        <div className="text-center p-8">
          <div className="text-4xl mb-4">🌱</div>
          {message && (
            <p className="text-foreground-secondary text-sm">{message}</p>
          )}
        </div>
      )}
    </div>
  );
};

