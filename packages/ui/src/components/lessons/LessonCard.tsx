import React from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../Button';

export interface LessonCardProps {
  day: number;
  title: string;
  description: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  onStart?: () => void;
  className?: string;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  day,
  title,
  description,
  isCompleted = false,
  isLocked = false,
  onStart,
  className,
}) => {
  return (
    <div className={cn('p-4 rounded-lg border bg-card', className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Day {day}
            </span>
            {isCompleted && <span className="text-green-600">✅</span>}
            {isLocked && <span className="text-gray-400">🔒</span>}
          </div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      
      {!isLocked && !isCompleted && onStart && (
        <Button onClick={onStart} className="w-full">
          Start Lesson
        </Button>
      )}
      
      {isCompleted && (
        <div className="flex items-center gap-2 text-green-600">
          <span className="text-lg">🎉</span>
          <span className="text-sm font-medium">Lesson Completed!</span>
        </div>
      )}
      
      {isLocked && (
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-lg">🔒</span>
          <span className="text-sm font-medium">Locked</span>
        </div>
      )}
    </div>
  );
};
