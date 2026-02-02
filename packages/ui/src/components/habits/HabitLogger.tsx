"use client";

import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../Button';

export interface HabitLoggerProps {
  onLogHabit: (wasteType: string, quantity: number) => void;
  className?: string;
}

export const HabitLogger: React.FC<HabitLoggerProps> = ({
  onLogHabit,
  className,
}) => {
  const [wasteType, setWasteType] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const wasteTypes = [
    { value: 'plastic', label: 'Plastic', icon: '🥤' },
    { value: 'paper', label: 'Paper', icon: '📄' },
    { value: 'e-waste', label: 'E-Waste', icon: '💻' },
    { value: 'organic', label: 'Organic', icon: '🍎' },
    { value: 'glass', label: 'Glass', icon: '🍶' },
    { value: 'metal', label: 'Metal', icon: '🥫' },
    { value: 'textile', label: 'Textile', icon: '👕' },
    { value: 'other', label: 'Other', icon: '🗑️' },
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wasteType && quantity > 0) {
      onLogHabit(wasteType, quantity);
      setWasteType('');
      setQuantity(1);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      <div>
        <label className="block text-sm font-medium mb-2">Waste Type</label>
        <div className="grid grid-cols-4 gap-2">
          {wasteTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setWasteType(type.value)}
              className={cn(
                'p-3 rounded-lg border text-center transition-colors',
                wasteType === type.value
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className="text-2xl mb-1">{type.icon}</div>
              <div className="text-xs">{type.label}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Quantity</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-full border flex items-center justify-center"
          >
            -
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded-full border flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={!wasteType || quantity < 1}
        className="w-full"
      >
        Log Habit
      </Button>
    </form>
  );
};
