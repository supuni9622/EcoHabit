'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../../lib/store/auth.store';
import { getTodayHabitLogs } from '../../../lib/services/habits';
import { WASTE_TYPE_ICONS, WASTE_TYPE_LABELS } from '@ecohabit/shared';
import type { HabitLogRecord } from '../../../lib/services/habits';

const WASTE_TYPES = [
  { id: 'plastic', icon: '🥤', label: 'Plastic', pts: 10, color: 'from-blue-400 to-blue-600' },
  { id: 'paper', icon: '📄', label: 'Paper', pts: 8, color: 'from-green-400 to-green-600' },
  { id: 'e-waste', icon: '💻', label: 'E-Waste', pts: 20, color: 'from-purple-400 to-purple-600' },
  { id: 'organic', icon: '🍎', label: 'Organic', pts: 5, color: 'from-yellow-400 to-yellow-600' },
  { id: 'glass', icon: '🍶', label: 'Glass', pts: 12, color: 'from-cyan-400 to-cyan-600' },
  { id: 'metal', icon: '🥫', label: 'Metal', pts: 14, color: 'from-gray-400 to-gray-600' },
];

interface EditState {
  logId: string;
  quantity: number;
  notes: string;
  saving: boolean;
}

export default function HabitsPage() {
  const { user } = useAuthStore();
  const [todayLogs, setTodayLogs] = useState<HabitLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    if (user) {
      getTodayHabitLogs(user.id)
        .then(setTodayLogs)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const todayPoints = todayLogs.reduce((s, l) => s + l.pointsAwarded, 0);
  const dailyCap = 500;
  const progressPct = Math.min(100, (todayPoints / dailyCap) * 100);

  const isWithin24h = (loggedAt: Date): boolean => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(loggedAt).getTime();
    return diffMs < 24 * 60 * 60 * 1000;
  };

  const startEdit = (log: HabitLogRecord) => {
    setEditError('');
    setEditState({
      logId: log.id,
      quantity: log.quantity,
      notes: log.notes ?? '',
      saving: false,
    });
  };

  const cancelEdit = () => {
    setEditState(null);
    setEditError('');
  };

  const saveEdit = async () => {
    if (!editState || !user) return;

    const quantity = editState.quantity;
    if (quantity < 1 || quantity > 100) {
      setEditError('Quantity must be between 1 and 100');
      return;
    }

    setEditState((prev) => prev ? { ...prev, saving: true } : null);
    setEditError('');

    try {
      const res = await fetch(`/api/habits/${editState.logId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          quantity: editState.quantity,
          notes: editState.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to update');

      // Update local state
      setTodayLogs((prev) =>
        prev.map((log) =>
          log.id === editState.logId
            ? { ...log, quantity: editState.quantity, notes: editState.notes, pointsAwarded: data.newPoints ?? log.pointsAwarded }
            : log
        )
      );
      setEditState(null);
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : 'Failed to update');
      setEditState((prev) => prev ? { ...prev, saving: false } : null);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Log Habits</h1>
        <Link
          href="/habits/log"
          className="bg-green-600 text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-green-700 transition-colors"
        >
          + Log Action
        </Link>
      </div>

      {/* Daily Progress */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Today&apos;s Points</span>
          <span className="text-sm font-bold text-green-600">{todayPoints} / {dailyCap}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          {dailyCap - todayPoints > 0
            ? `${dailyCap - todayPoints} points remaining today`
            : 'Daily cap reached! Great work! 🎉'}
        </p>
      </div>

      {/* Waste type selector grid */}
      <div>
        <h2 className="font-semibold text-gray-800 mb-3">Select Type to Log</h2>
        <div className="grid grid-cols-3 gap-3">
          {WASTE_TYPES.map((wt) => (
            <Link
              key={wt.id}
              href={`/habits/log?type=${wt.id}`}
              className={`bg-gradient-to-br ${wt.color} text-white rounded-2xl p-4 text-center shadow-sm active:scale-95 transition-transform`}
            >
              <div className="text-3xl mb-1">{wt.icon}</div>
              <div className="text-xs font-bold">{wt.label}</div>
              <div className="text-xs opacity-80 mt-0.5">+{wt.pts}pts/item</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Today's Logs */}
      <div>
        <h2 className="font-semibold text-gray-800 mb-3">
          Today&apos;s Logs ({todayLogs.length})
        </h2>
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : todayLogs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <div className="text-5xl mb-3">🌱</div>
            <p className="text-gray-500 text-sm">Nothing logged today yet.</p>
            <p className="text-gray-400 text-xs mt-1">Tap a type above to get started!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayLogs.map((log) => {
              const editable = isWithin24h(log.loggedAt);
              const isEditing = editState?.logId === log.id;

              return (
                <div
                  key={log.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-50 overflow-hidden"
                >
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-xl flex-shrink-0">
                      {(WASTE_TYPE_ICONS as Record<string, string>)[log.wasteType] ?? '♻️'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {(WASTE_TYPE_LABELS as Record<string, string>)[log.wasteType] ?? log.wasteType}
                      </p>
                      <p className="text-xs text-gray-400">
                        {log.quantity} item{log.quantity !== 1 ? 's' : ''} •{' '}
                        {new Date(log.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 mr-2">
                      <p className="text-green-600 font-bold text-sm">+{log.pointsAwarded}pts</p>
                      <p className="text-xs text-gray-400">{log.co2Saved.toFixed(2)}kg CO₂</p>
                    </div>
                    {editable && !isEditing && (
                      <button
                        onClick={() => startEdit(log)}
                        className="text-xs text-blue-600 border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors flex-shrink-0"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {/* Inline edit form */}
                  {isEditing && editState && (
                    <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3">
                      <p className="text-xs font-medium text-gray-600">Edit this log (within 24h)</p>
                      <div className="flex items-center gap-3">
                        <label className="text-xs text-gray-500 w-20 flex-shrink-0">Quantity</label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditState((prev) => prev ? { ...prev, quantity: Math.max(1, prev.quantity - 1) } : null)}
                            className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 font-bold flex items-center justify-center text-sm"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-bold text-gray-800">{editState.quantity}</span>
                          <button
                            type="button"
                            onClick={() => setEditState((prev) => prev ? { ...prev, quantity: Math.min(100, prev.quantity + 1) } : null)}
                            className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 font-bold flex items-center justify-center text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <label className="text-xs text-gray-500 w-20 flex-shrink-0 mt-1">Notes</label>
                        <textarea
                          value={editState.notes}
                          onChange={(e) => setEditState((prev) => prev ? { ...prev, notes: e.target.value } : null)}
                          maxLength={200}
                          rows={2}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                      </div>
                      {editError && (
                        <p className="text-xs text-red-500">{editError}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={cancelEdit}
                          className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-xs font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEdit}
                          disabled={editState.saving}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-medium disabled:opacity-50"
                        >
                          {editState.saving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
