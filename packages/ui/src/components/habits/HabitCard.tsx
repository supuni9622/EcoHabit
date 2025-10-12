import React from 'react';
import { cn } from '../../lib/utils';

export interface HabitCardProps {
  wasteType: string;
  quantity: number;
  points: number;
  loggedAt: Date;
  className?: string;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  wasteType,
  quantity,
  points,
  loggedAt,
  className,
}) => {
  const wasteTypeIcons: Record<string, string> = {
    plastic: '🥤',
    paper: '📄',
    'e-waste': '💻',
    organic: '🍎',
    glass: '🍶',
    metal: '🥫',
    textile: '👕',
    other: '🗑️',
  };
  
  return (
    <div className={cn('p-4 rounded-lg border bg-card', className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{wasteTypeIcons[wasteType] || '🗑️'}</span>
          <span className="font-medium capitalize">{wasteType}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {loggedAt.toLocaleDateString()}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {quantity} item{quantity !== 1 ? 's' : ''}
        </span>
        <span className="font-bold text-primary">+{points} pts</span>
      </div>
    </div>
  );
};
