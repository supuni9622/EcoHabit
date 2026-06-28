'use client';

import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';

export interface LessonCardProps {
  day: number;
  title: string;
  description: string;
  icon: string;
  duration: string;
  points: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  className?: string;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  day,
  title,
  description,
  icon,
  duration,
  points,
  isCompleted,
  isUnlocked,
  className,
}) => {
  const content = (
    <div
      className={clsx(
        'bg-white rounded-2xl p-5 border transition-all',
        isUnlocked
          ? 'border-gray-100 shadow-sm hover:shadow-md'
          : 'border-gray-100 opacity-60',
        isCompleted && 'border-green-200 bg-green-50',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0',
            isCompleted ? 'bg-green-100' : isUnlocked ? 'bg-blue-50' : 'bg-gray-100'
          )}
        >
          {isCompleted ? '✅' : isUnlocked ? icon : '🔒'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs text-gray-400">Day {day}</span>
            {isCompleted && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                Done
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-gray-400">⏱ {duration}</span>
            <span className="text-xs text-green-600 font-medium">+{points} pts</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isUnlocked) return content;

  return (
    <Link href={`/lessons/${day}`} className="block">
      {content}
    </Link>
  );
};
