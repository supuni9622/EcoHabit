import React from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../Button';

export interface ChallengeCardProps {
  title: string;
  description: string;
  points: number;
  deadline?: Date;
  isCompleted?: boolean;
  onJoin?: () => void;
  className?: string;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  title,
  description,
  points,
  deadline,
  isCompleted = false,
  onJoin,
  className,
}) => {
  return (
    <div className={cn('p-4 rounded-lg border bg-card', className)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="text-right">
          <div className="font-bold text-primary">+{points} pts</div>
          {deadline && (
            <div className="text-xs text-muted-foreground">
              Due: {deadline.toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
      
      {!isCompleted && onJoin && (
        <Button onClick={onJoin} className="w-full">
          Join Challenge
        </Button>
      )}
      
      {isCompleted && (
        <div className="flex items-center gap-2 text-green-600">
          <span className="text-lg">✅</span>
          <span className="text-sm font-medium">Completed!</span>
        </div>
      )}
    </div>
  );
};
