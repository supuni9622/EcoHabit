'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface ImpactSummaryProps {
  co2Saved: number; // kg
  waterSaved: number; // liters
  actionsCount?: number;
  period?: 'today' | 'week' | 'month' | 'all-time';
  className?: string;
}

export const ImpactSummary: React.FC<ImpactSummaryProps> = ({
  co2Saved,
  waterSaved,
  actionsCount,
  period = 'today',
  className,
}) => {
  const periodLabel = {
    today: "Today's Impact",
    week: "This Week's Impact",
    month: "This Month's Impact",
    'all-time': 'Total Impact',
  }[period];

  const stats = [
    {
      label: 'CO₂ Saved',
      value: co2Saved >= 1 ? `${co2Saved.toFixed(1)}kg` : `${(co2Saved * 1000).toFixed(0)}g`,
      icon: '🌫️',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Water Saved',
      value: waterSaved >= 1 ? `${waterSaved.toFixed(1)}L` : `${(waterSaved * 1000).toFixed(0)}mL`,
      icon: '💧',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    ...(actionsCount !== undefined
      ? [
          {
            label: 'Actions Logged',
            value: String(actionsCount),
            icon: '♻️',
            color: 'text-orange-600',
            bg: 'bg-orange-50',
          },
        ]
      : []),
  ];

  return (
    <div className={clsx('bg-white rounded-2xl shadow-sm border border-gray-100 p-5', className)}>
      <h3 className="font-semibold text-gray-800 mb-4">{periodLabel}</h3>
      <div className={`grid gap-3 ${actionsCount !== undefined ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={clsx('rounded-xl p-3 text-center', stat.bg)}
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={clsx('text-lg font-bold', stat.color)}>{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
