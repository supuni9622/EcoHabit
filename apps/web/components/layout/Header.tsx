'use client';

import Link from 'next/link';
import { useAuthStore } from '../../lib/store/auth.store';

export function Header() {
  const { user } = useAuthStore();

  return (
    <header className="bg-green-600 text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
      <Link href="/home" className="flex items-center gap-2">
        <span className="text-2xl">🌿</span>
        <span className="font-bold text-lg">EcoHabit</span>
      </Link>

      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-1.5 bg-green-500 rounded-full px-3 py-1">
            <span className="text-yellow-300">⭐</span>
            <span className="font-semibold text-sm">
              {(user.totalPoints ?? 0).toLocaleString()}
            </span>
          </div>
        )}

        {user && (
          <Link href="/profile">
            <div className="w-9 h-9 rounded-full bg-green-400 flex items-center justify-center text-xl border-2 border-white">
              {user.avatar ?? '🌱'}
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}
