'use client';

import { useEffect, useState } from 'react';
import {
  collection, getCountFromServer, query, where, Timestamp,
  orderBy, limit, getDocs,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import Link from 'next/link';

interface Stats {
  totalUsers: number;
  activeToday: number;
  totalLogs: number;
  logsToday: number;
  lessonsCompleted: number;
  activeChallenges: number;
}

interface RecentLog {
  id: string;
  userId: string;
  displayName: string;
  wasteType: string;
  quantity: number;
  pointsAwarded: number;
  loggedAt: Date;
}

const WASTE_EMOJI: Record<string, string> = {
  plastic: '🥤', paper: '📄', 'e-waste': '💻', organic: '🍎',
  glass: '🍶', metal: '🥫', textile: '👗', general: '🗑️',
};

function StatCard({
  label, value, sub, color,
}: { label: string; value: string | number; sub?: string; color: 'green' | 'amber' | 'blue' | 'red' }) {
  return (
    <div className={`stat-card ${color}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-admin-muted mb-1">{label}</p>
      <p className="text-3xl font-mono font-semibold text-admin-ink">{value}</p>
      {sub && <p className="text-xs text-admin-muted mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLogs, setRecentLogs] = useState<RecentLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const now = new Date();
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        const todayTs = Timestamp.fromDate(todayStart);

        const [
          usersSnap,
          activeSnap,
          totalLogsSnap,
          todayLogsSnap,
          challengesSnap,
          recentSnap,
        ] = await Promise.all([
          getCountFromServer(collection(db, 'users')),
          getCountFromServer(query(
            collection(db, 'users'),
            where('lastActiveAt', '>=', todayTs)
          )),
          getCountFromServer(collection(db, 'habitLogs')),
          getCountFromServer(query(
            collection(db, 'habitLogs'),
            where('loggedAt', '>=', todayTs)
          )),
          getCountFromServer(query(
            collection(db, 'challenges'),
            where('status', '==', 'active')
          )),
          getDocs(query(
            collection(db, 'habitLogs'),
            orderBy('loggedAt', 'desc'),
            limit(8)
          )),
        ]);

        setStats({
          totalUsers: usersSnap.data().count,
          activeToday: activeSnap.data().count,
          totalLogs: totalLogsSnap.data().count,
          logsToday: todayLogsSnap.data().count,
          lessonsCompleted: 0,
          activeChallenges: challengesSnap.data().count,
        });

        const logs: RecentLog[] = recentSnap.docs.map((d) => {
          const data = d.data();
          const ts = data.loggedAt as Timestamp;
          return {
            id: d.id,
            userId: data.userId as string ?? '',
            displayName: data.displayName as string ?? 'User',
            wasteType: data.wasteType as string ?? 'general',
            quantity: data.quantity as number ?? 1,
            pointsAwarded: data.pointsAwarded as number ?? 0,
            loggedAt: ts?.toDate() ?? new Date(),
          };
        });
        setRecentLogs(logs);
      } catch (err) {
        console.error('Dashboard load error', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-admin-ink">Dashboard</h1>
        <p className="text-sm text-admin-muted mt-0.5">
          {new Date().toLocaleDateString('en-LK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total users"     value={(stats?.totalUsers ?? 0).toLocaleString()} color="green" sub="registered accounts" />
          <StatCard label="Active today"    value={(stats?.activeToday ?? 0).toLocaleString()} color="blue" sub="logged in today" />
          <StatCard label="Habit logs"      value={(stats?.totalLogs ?? 0).toLocaleString()} color="green" sub={`${stats?.logsToday ?? 0} today`} />
          <StatCard label="Live challenges" value={(stats?.activeChallenges ?? 0).toLocaleString()} color="amber" sub="currently active" />
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: '/users',      label: 'Manage users',      icon: '◈' },
          { href: '/lessons',    label: 'Edit lessons',      icon: '◧' },
          { href: '/challenges', label: 'New challenge',     icon: '◆' },
          { href: '/analytics',  label: 'View analytics',    icon: '▦' },
        ].map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 px-4 py-3 bg-admin-card border border-admin-border rounded-xl text-sm font-medium text-admin-ink hover:border-admin-accent hover:text-admin-accent transition-colors group"
          >
            <span className="text-admin-muted group-hover:text-admin-accent transition-colors">{icon}</span>
            {label}
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-admin-border flex items-center justify-between">
          <h2 className="font-semibold text-admin-ink text-sm">Recent habit logs</h2>
          <Link href="/users" className="text-xs text-admin-accent hover:underline">View all</Link>
        </div>

        {loading ? (
          <div className="p-6 text-center text-admin-muted text-sm">Loading…</div>
        ) : recentLogs.length === 0 ? (
          <div className="p-10 text-center text-admin-muted text-sm">No logs yet</div>
        ) : (
          <table className="w-full data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Waste type</th>
                <th>Qty</th>
                <th>Points</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map((log) => (
                <tr key={log.id}>
                  <td className="font-medium">{log.displayName || log.userId.slice(0, 8)}</td>
                  <td>
                    <span className="flex items-center gap-1.5">
                      {WASTE_EMOJI[log.wasteType] ?? '♻️'}
                      <span className="capitalize">{log.wasteType}</span>
                    </span>
                  </td>
                  <td className="font-mono">{log.quantity}</td>
                  <td className="font-mono text-admin-accent">+{log.pointsAwarded}</td>
                  <td className="text-admin-muted">
                    {log.loggedAt.toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
