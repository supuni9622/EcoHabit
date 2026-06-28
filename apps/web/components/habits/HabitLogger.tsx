'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';

const WASTE_TYPES = [
  { id: 'plastic', icon: '🥤', label: 'Plastic', pts: 10 },
  { id: 'paper', icon: '📄', label: 'Paper', pts: 8 },
  { id: 'e-waste', icon: '💻', label: 'E-Waste', pts: 20 },
  { id: 'organic', icon: '🍎', label: 'Organic', pts: 5 },
  { id: 'glass', icon: '🍶', label: 'Glass', pts: 12 },
  { id: 'metal', icon: '🥫', label: 'Metal', pts: 14 },
];

export interface HabitLoggerProps {
  userId: string;
  onSuccess?: (result: { points: number; wasteType: string }) => void;
  defaultWasteType?: string;
  className?: string;
}

export const HabitLogger: React.FC<HabitLoggerProps> = ({
  userId,
  onSuccess,
  defaultWasteType = 'plastic',
  className,
}) => {
  const [wasteType, setWasteType] = useState(defaultWasteType);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedType = WASTE_TYPES.find((wt) => wt.id === wasteType) ?? WASTE_TYPES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/habits/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, wasteType, quantity, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to log');
      onSuccess?.({ points: data.pointsEarned, wasteType });
      setQuantity(1);
      setNotes('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={clsx('space-y-4', className)}>
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Waste type */}
      <div className="grid grid-cols-3 gap-2">
        {WASTE_TYPES.map((wt) => (
          <button
            key={wt.id}
            type="button"
            onClick={() => setWasteType(wt.id)}
            className={clsx(
              'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-sm',
              wasteType === wt.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            )}
          >
            <span className="text-2xl">{wt.icon}</span>
            <span className="font-medium text-gray-700 text-xs">{wt.label}</span>
            <span className="text-green-600 text-xs">+{wt.pts}pts</span>
          </button>
        ))}
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-xl flex items-center justify-center"
        >
          −
        </button>
        <div className="flex-1 text-center">
          <div className="text-4xl font-bold text-gray-800">{quantity}</div>
          <div className="text-xs text-gray-500">items</div>
        </div>
        <button
          type="button"
          onClick={() => setQuantity(Math.min(100, quantity + 1))}
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-xl flex items-center justify-center"
        >
          +
        </button>
      </div>

      {/* Notes */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Optional notes..."
        maxLength={200}
        rows={2}
        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50"
      >
        {loading
          ? 'Logging...'
          : `Log ${quantity} ${selectedType.label} Item${quantity !== 1 ? 's' : ''} (+${selectedType.pts * quantity}pts)`}
      </button>
    </form>
  );
};
