'use client';

import { useEffect, useState } from 'react';
import {
  collection, query, where, getDocs, Timestamp, orderBy, limit,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface DayBucket {
  label: string; // "Mon", "Tue" etc
  date: string;  // YYYY-MM-DD
  logs: number;
  users: number;
}

interface WasteBreakdown {
  type: string;
  count: number;
  emoji: string;
}

const WASTE_EMOJI: Record<string, string> = {
  plastic: '🥤', paper: '📄', 'e-waste': '💻', organic: '🍎',
  glass: '🍶', metal: '🥫', textile: '👗', general: '♻️',
};

const WASTE_COLORS: Record<string, string> = {
  plastic: '#3b82f6', paper: '#f59e0b', 'e-waste': '#8b5cf6',
  organic: '#22c55e', glass: '#06b6d4', metal: '#6b7280',
  textile: '#f43f5e', general: '#94a3b8',
};

function BarChart({ buckets, maxVal }: { buckets: DayBucket[]; maxVal: number }) {
  if (buckets.length === 0) return <p className="text-admin-muted text-sm text-center py-6">No data</p>;
  return (
    <div className="flex items-end gap-2 h-32">
      {buckets.map((b) => {
        const h = maxVal > 0 ? Math.max(4, (b.logs / maxVal) * 100) : 4;
        return (
          <div key={b.date} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="relative w-full flex flex-col items-center">
              <div
                className="w-full rounded-t bg-admin-accent/80 group-hover:bg-admin-accent transition-colors"
                style={{ height: `${h}%`, minHeight: '4px', maxHeight: '100%' }}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 bg-sidebar text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {b.logs} logs
              </div>
            </div>
            <span className="text-xs text-admin-muted">{b.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function WasteBar({ breakdown, total }: { breakdown: WasteBreakdown[]; total: number }) {
  if (total === 0) return <p className="text-admin-muted text-sm text-center py-4">No data</p>;
  return (
    <div className="space-y-3">
      {breakdown.map((w) => {
        const pct = total > 0 ? Math.round((w.count / total) * 100) : 0;
        return (
          <div key={w.type} className="flex items-center gap-3">
            <span className="w-6 text-center">{w.emoji}</span>
            <span className="w-16 text-xs text-admin-muted capitalize">{w.type}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: WASTE_COLORS[w.type] ?? '#94a3b8' }}
              />
            </div>
            <span className="w-8 text-right font-mono text-xs text-admin-muted">{pct}%</span>
            <span className="w-12 text-right font-mono text-xs text-admin-ink">{w.count}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsPage() {
  const [dau, setDau] = useState<DayBucket[]>([]);
  const [waste, setWaste] = useState<WasteBreakdown[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalLogs, setTotalLogs] = useState(0);
  const [avgStreak, setAvgStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const now = new Date();

        // Build 7 day buckets
        const buckets: DayBucket[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          d.setHours(0, 0, 0, 0);
          buckets.push({
            label: d.toLocaleDateString('en-LK', { weekday: 'short' }),
            date: d.toISOString().split('T')[0]!,
            logs: 0,
            users: 0,
          });
        }

        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 6);
        weekAgo.setHours(0, 0, 0, 0);

        // Fetch last 7 days of habit logs
        const logsSnap = await getDocs(query(
          collection(db, 'habitLogs'),
          where('loggedAt', '>=', Timestamp.fromDate(weekAgo)),
          orderBy('loggedAt', 'desc'),
          limit(2000)
        ));

        const wasteCount: Record<string, number> = {};
        let logCount = 0;

        for (const d of logsSnap.docs) {
          const data = d.data();
          const ts = (data.loggedAt as Timestamp)?.toDate();
          if (!ts) continue;
          const dateStr = ts.toISOString().split('T')[0]!;
          const bucket = buckets.find((b) => b.date === dateStr);
          if (bucket) { bucket.logs++; }
          const wt = data.wasteType as string ?? 'general';
          wasteCount[wt] = (wasteCount[wt] ?? 0) + 1;
          logCount++;
        }

        const breakdown: WasteBreakdown[] = Object.entries(wasteCount)
          .map(([type, count]) => ({ type, count, emoji: WASTE_EMOJI[type] ?? '♻️' }))
          .sort((a, b) => b.count - a.count);

        // Fetch user stats
        const usersSnap = await getDocs(query(
          collection(db, 'users'),
          orderBy('createdAt', 'desc'),
          limit(500)
        ));
        let streakSum = 0;
        for (const d of usersSnap.docs) {
          streakSum += (d.data().currentStreak as number ?? 0);
        }
        const userCount = usersSnap.docs.length;

        setDau(buckets);
        setWaste(breakdown);
        setTotalUsers(userCount);
        setTotalLogs(logCount);
        setAvgStreak(userCount > 0 ? Math.round(streakSum / userCount) : 0);
      } catch (err) {
        console.error('Analytics load error', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const maxLogs = Math.max(...dau.map((b) => b.logs), 1);
  const wasteTotal = waste.reduce((s, w) => s + w.count, 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-semibold text-admin-ink">Analytics</h1>
        <p className="text-sm text-admin-muted mt-0.5">Last 7 days</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="stat-card green animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-20 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat-card green">
              <p className="text-xs font-semibold uppercase tracking-wider text-admin-muted mb-1">Total users</p>
              <p className="text-3xl font-mono font-semibold text-admin-ink">{totalUsers.toLocaleString()}</p>
            </div>
            <div className="stat-card blue">
              <p className="text-xs font-semibold uppercase tracking-wider text-admin-muted mb-1">Logs (7 days)</p>
              <p className="text-3xl font-mono font-semibold text-admin-ink">{totalLogs.toLocaleString()}</p>
            </div>
            <div className="stat-card amber">
              <p className="text-xs font-semibold uppercase tracking-wider text-admin-muted mb-1">Avg streak</p>
              <p className="text-3xl font-mono font-semibold text-admin-ink">{avgStreak}<span className="text-sm text-admin-muted"> days</span></p>
            </div>
            <div className="stat-card green">
              <p className="text-xs font-semibold uppercase tracking-wider text-admin-muted mb-1">Logs / user</p>
              <p className="text-3xl font-mono font-semibold text-admin-ink">
                {totalUsers > 0 ? (totalLogs / totalUsers).toFixed(1) : '0'}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* DAU bar chart */}
            <div className="bg-admin-card border border-admin-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-admin-ink mb-4">Daily habit logs — last 7 days</h2>
              <BarChart buckets={dau} maxVal={maxLogs} />
            </div>

            {/* Waste breakdown */}
            <div className="bg-admin-card border border-admin-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-admin-ink mb-4">Waste type breakdown</h2>
              <WasteBar breakdown={waste} total={wasteTotal} />
            </div>
          </div>

          {/* Daily table */}
          <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-admin-border">
              <h2 className="text-sm font-semibold text-admin-ink">Daily log volume</h2>
            </div>
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Habit logs</th>
                </tr>
              </thead>
              <tbody>
                {dau.map((b) => (
                  <tr key={b.date}>
                    <td className="font-mono text-xs text-admin-muted">{b.date}</td>
                    <td>{b.label}</td>
                    <td><span className="font-mono text-admin-accent">{b.logs}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
