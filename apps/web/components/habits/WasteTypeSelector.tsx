'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface WasteType {
  id: string;
  icon: string;
  label: string;
  ptsPerItem: number;
  color: string;
}

const DEFAULT_WASTE_TYPES: WasteType[] = [
  { id: 'plastic', icon: '🥤', label: 'Plastic', ptsPerItem: 10, color: 'border-blue-300 bg-blue-50' },
  { id: 'paper', icon: '📄', label: 'Paper', ptsPerItem: 8, color: 'border-green-300 bg-green-50' },
  { id: 'e-waste', icon: '💻', label: 'E-Waste', ptsPerItem: 20, color: 'border-purple-300 bg-purple-50' },
  { id: 'organic', icon: '🍎', label: 'Organic', ptsPerItem: 5, color: 'border-yellow-300 bg-yellow-50' },
  { id: 'glass', icon: '🍶', label: 'Glass', ptsPerItem: 12, color: 'border-cyan-300 bg-cyan-50' },
  { id: 'metal', icon: '🥫', label: 'Metal', ptsPerItem: 14, color: 'border-gray-300 bg-gray-50' },
];

export interface WasteTypeSelectorProps {
  selected: string;
  onChange: (type: string) => void;
  wasteTypes?: WasteType[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export const WasteTypeSelector: React.FC<WasteTypeSelectorProps> = ({
  selected,
  onChange,
  wasteTypes = DEFAULT_WASTE_TYPES,
  className,
  columns = 3,
}) => {
  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns];

  return (
    <div className={clsx(`grid gap-2 ${gridClass}`, className)}>
      {wasteTypes.map((wt) => (
        <button
          key={wt.id}
          type="button"
          onClick={() => onChange(wt.id)}
          className={clsx(
            'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all',
            selected === wt.id
              ? `${wt.color} border-opacity-100 scale-105`
              : 'border-gray-200 hover:border-gray-300 bg-white'
          )}
        >
          <span className="text-2xl">{wt.icon}</span>
          <span className="text-xs font-medium text-gray-700">{wt.label}</span>
          <span className="text-xs text-green-600 font-medium">+{wt.ptsPerItem}pts</span>
        </button>
      ))}
    </div>
  );
};
