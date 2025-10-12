import React from 'react';
import { cn } from '../../lib/utils';

export interface LeaderboardProps {
  entries: Array<{
    rank: number;
    displayName: string;
    avatar?: string;
    points: number;
    level: number;
  }>;
  className?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {entries.map((entry) => (
        <div
          key={entry.rank}
          className="flex items-center justify-between p-3 rounded-lg border bg-card"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-primary">
              #{entry.rank}
            </span>
            <div className="flex items-center gap-2">
              {entry.avatar ? (
                <img
                  src={entry.avatar}
                  alt={entry.displayName}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {entry.displayName.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <div className="font-medium">{entry.displayName}</div>
                <div className="text-sm text-muted-foreground">
                  Level {entry.level}
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold">{entry.points.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">points</div>
          </div>
        </div>
      ))}
    </div>
  );
};
