'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../../lib/store/auth.store';
import { useHabitsStore } from '../../../../lib/store/habits.store';
import { getTodayPoints } from '../../../../lib/services/habits';
import { z } from 'zod';

const WASTE_TYPES = [
  { id: 'plastic', icon: '🥤', label: 'Plastic', pts: 10 },
  { id: 'paper', icon: '📄', label: 'Paper', pts: 8 },
  { id: 'e-waste', icon: '💻', label: 'E-Waste', pts: 20 },
  { id: 'organic', icon: '🍎', label: 'Organic', pts: 5 },
  { id: 'glass', icon: '🍶', label: 'Glass', pts: 12 },
  { id: 'metal', icon: '🥫', label: 'Metal', pts: 14 },
  { id: 'general', icon: '🗑️', label: 'General', pts: 5 },
];

const logSchema = z.object({
  wasteType: z.string().min(1),
  quantity: z.number().int().min(1).max(100),
  notes: z.string().max(200).optional(),
});

function LogForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const { addLog, setTodayPoints, todayPoints } = useHabitsStore();

  const defaultType = searchParams.get('type') ?? 'plastic';
  const [wasteType, setWasteType] = useState(defaultType);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ points: number; badges: string[] } | null>(null);

  // Initialize todayPoints from Firestore on mount if store is empty
  useEffect(() => {
    if (user && todayPoints === 0) {
      getTodayPoints(user.id).then((pts) => {
        if (pts > 0) setTodayPoints(pts);
      });
    }
  }, [user, todayPoints, setTodayPoints]);

  const selectedType = WASTE_TYPES.find((wt) => wt.id === wasteType) ?? WASTE_TYPES[0];
  const estimatedPoints = selectedType.pts * quantity;
  const remainingCap = 500 - todayPoints;
  const pointsAfterCap = Math.min(estimatedPoints, remainingCap);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsed = logSchema.safeParse({ wasteType, quantity, notes: notes || undefined });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? 'Invalid input');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/habits/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wasteType, quantity, notes, userId: user?.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to log');

      // Update local store
      addLog({
        id: data.logId ?? crypto.randomUUID(),
        userId: user?.id ?? '',
        wasteType,
        quantity,
        pointsAwarded: data.pointsEarned,
        notes,
        loggedAt: new Date(),
        co2Saved: data.co2Saved ?? 0,
        waterSaved: data.waterSaved ?? 0,
      });
      // Note: addLog already updates todayPoints in the store

      setSuccess({
        points: data.pointsEarned,
        badges: (data.newBadges ?? []).map((b: { id: string; name: string }) => b.name),
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to log action');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Action Logged!</h2>
          <div className="text-4xl font-bold text-green-600 mb-1">+{success.points}</div>
          <p className="text-gray-500 mb-4">points earned</p>

          {success.badges.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="font-semibold text-yellow-700 mb-2">🏆 New Badge Unlocked!</p>
              {success.badges.map((b) => (
                <p key={b} className="text-yellow-600 text-sm">{b}</p>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setSuccess(null)}
              className="flex-1 border border-green-600 text-green-600 py-3 rounded-xl font-medium"
            >
              Log Another
            </button>
            <button
              onClick={() => router.push('/home')}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-800">Log Eco Action</h1>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Waste type selection */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">Waste Type</label>
          <div className="grid grid-cols-4 gap-2">
            {WASTE_TYPES.map((wt) => (
              <button
                key={wt.id}
                type="button"
                onClick={() => setWasteType(wt.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                  wasteType === wt.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <span className="text-2xl">{wt.icon}</span>
                <span className="text-xs font-medium text-gray-700">{wt.label}</span>
                <span className="text-xs text-green-600">+{wt.pts}pts</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity input */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quantity (1-100)
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-xl flex items-center justify-center"
            >
              −
            </button>
            <div className="flex-1 text-center">
              <div className="text-5xl font-bold text-gray-800">{quantity}</div>
              <div className="text-xs text-gray-500 mt-1">
                {quantity === 1 ? 'item' : 'items'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(100, quantity + 1))}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-xl flex items-center justify-center"
            >
              +
            </button>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full accent-green-500 mt-4"
          />
        </div>

        {/* Optional notes */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Where did you recycle? Any notes..."
            maxLength={200}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-400 mt-1">{notes.length}/200</p>
        </div>

        {/* Points preview */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Estimated points</p>
            <p className="text-xs text-gray-400">Daily cap: {remainingCap} pts remaining</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">+{pointsAfterCap}</div>
            {estimatedPoints !== pointsAfterCap && (
              <div className="text-xs text-gray-400 line-through">{estimatedPoints}</div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Logging...' : '♻️ Log Action'}
        </button>
      </form>
    </div>
  );
}

export default function LogPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-5xl animate-bounce">🌿</div></div>}>
      <LogForm />
    </Suspense>
  );
}
