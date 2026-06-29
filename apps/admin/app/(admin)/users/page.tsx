'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  collection, query, orderBy, limit, getDocs, startAfter,
  updateDoc, doc, where, QueryDocumentSnapshot, DocumentData,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface AdminUser {
  id: string;
  displayName: string;
  email: string;
  avatar: string;
  level: number;
  totalPoints: number;
  currentStreak: number;
  badges: string[];
  completedLessons: string[];
  banned: boolean;
  createdAt: Date;
  lastActiveAt: Date | null;
}

const PAGE_SIZE = 20;

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<AdminUser[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadUsers = useCallback(async (after?: QueryDocumentSnapshot<DocumentData>) => {
    setLoading(true);
    try {
      const q = after
        ? query(collection(db, 'users'), orderBy('createdAt', 'desc'), startAfter(after), limit(PAGE_SIZE))
        : query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
      const snap = await getDocs(q);
      const mapped: AdminUser[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          displayName: data.displayName as string ?? 'EcoHero',
          email: data.email as string ?? '',
          avatar: data.avatar as string ?? '🌱',
          level: data.level as number ?? 1,
          totalPoints: data.totalPoints as number ?? 0,
          currentStreak: data.currentStreak as number ?? 0,
          badges: data.badges as string[] ?? [],
          completedLessons: data.completedLessons as string[] ?? [],
          banned: data.banned as boolean ?? false,
          createdAt: (data.createdAt?.toDate?.() ?? new Date()),
          lastActiveAt: data.lastActiveAt?.toDate?.() ?? null,
        };
      });
      if (after) {
        setUsers((prev) => [...prev, ...mapped]);
      } else {
        setUsers(mapped);
      }
      setLastDoc(snap.docs[snap.docs.length - 1] ?? null);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (err) {
      console.error('Users load error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) { setSearchResults(null); return; }
    setSearching(true);
    try {
      const snap = await getDocs(query(
        collection(db, 'users'),
        where('displayName', '>=', q),
        where('displayName', '<=', q + ''),
        limit(20)
      ));
      setSearchResults(snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          displayName: data.displayName as string ?? 'EcoHero',
          email: data.email as string ?? '',
          avatar: data.avatar as string ?? '🌱',
          level: data.level as number ?? 1,
          totalPoints: data.totalPoints as number ?? 0,
          currentStreak: data.currentStreak as number ?? 0,
          badges: data.badges as string[] ?? [],
          completedLessons: data.completedLessons as string[] ?? [],
          banned: data.banned as boolean ?? false,
          createdAt: (data.createdAt?.toDate?.() ?? new Date()),
          lastActiveAt: data.lastActiveAt?.toDate?.() ?? null,
        };
      }));
    } finally {
      setSearching(false);
    }
  };

  const toggleBan = async (user: AdminUser) => {
    setTogglingId(user.id);
    try {
      await updateDoc(doc(db, 'users', user.id), { banned: !user.banned });
      const updater = (u: AdminUser) => u.id === user.id ? { ...u, banned: !u.banned } : u;
      setUsers((prev) => prev.map(updater));
      if (searchResults) setSearchResults((prev) => prev!.map(updater));
    } catch (err) {
      console.error('Toggle ban error', err);
    } finally {
      setTogglingId(null);
    }
  };

  const displayList = searchResults ?? users;

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-admin-ink">Users</h1>
          <p className="text-sm text-admin-muted mt-0.5">{users.length} loaded</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); if (!e.target.value) setSearchResults(null); }}
            placeholder="Search by display name…"
            className="admin-input w-64"
          />
          <button type="submit" disabled={searching} className="admin-btn-primary">
            {searching ? '…' : 'Search'}
          </button>
        </form>
      </div>

      <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Level</th>
              <th>Points</th>
              <th>Streak</th>
              <th>Badges</th>
              <th>Lessons</th>
              <th>Joined</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && users.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-10 text-admin-muted">Loading…</td>
              </tr>
            ) : displayList.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-10 text-admin-muted">No users found</td>
              </tr>
            ) : (
              displayList.map((user) => (
                <tr key={user.id} className={user.banned ? 'opacity-50' : ''}>
                  <td>
                    <span className="flex items-center gap-2">
                      <span className="text-lg leading-none">{user.avatar}</span>
                      <span className="font-medium">{user.displayName}</span>
                    </span>
                  </td>
                  <td className="text-admin-muted text-xs">{user.email || '—'}</td>
                  <td><span className="font-mono">{user.level}</span></td>
                  <td><span className="font-mono text-admin-accent">{user.totalPoints.toLocaleString()}</span></td>
                  <td><span className="font-mono">🔥 {user.currentStreak}</span></td>
                  <td><span className="font-mono">{user.badges.length}</span></td>
                  <td><span className="font-mono">{user.completedLessons.length}/25</span></td>
                  <td className="text-admin-muted text-xs">
                    {user.createdAt.toLocaleDateString('en-LK')}
                  </td>
                  <td>
                    <span className={`admin-badge ${user.banned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {user.banned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleBan(user)}
                      disabled={togglingId === user.id}
                      className={`admin-btn text-xs py-1 px-2.5 ${user.banned ? 'admin-btn-primary' : 'admin-btn-danger'}`}
                    >
                      {togglingId === user.id ? '…' : user.banned ? 'Unban' : 'Ban'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!searchResults && hasMore && (
        <div className="text-center">
          <button
            onClick={() => loadUsers(lastDoc ?? undefined)}
            disabled={loading}
            className="admin-btn-secondary"
          >
            {loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
}
