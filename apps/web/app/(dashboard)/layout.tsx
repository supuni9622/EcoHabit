'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../lib/store/auth.store';
import { useGamificationStore } from '../../lib/store/gamification.store';

const NAV_ITEMS = [
  { href: '/home', label: 'Home', icon: '🏠' },
  { href: '/habits', label: 'Log', icon: '♻️' },
  { href: '/lessons', label: 'Learn', icon: '📚' },
  { href: '/map', label: 'Map', icon: '🗺️' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuthStore();
  const { totalPoints } = useGamificationStore();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && !user.onboardingCompleted) {
      router.push('/onboarding');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🌿</div>
          <p className="text-green-600 font-medium">Loading EcoHabit...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top header */}
      <header className="bg-green-600 text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <Link href="/home" className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="font-bold text-lg">EcoHabit</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-green-500 rounded-full px-3 py-1">
            <span className="text-yellow-300">⭐</span>
            <span className="font-semibold text-sm">{(user.totalPoints ?? totalPoints).toLocaleString()}</span>
          </div>
          <Link href="/profile">
            <div className="w-9 h-9 rounded-full bg-green-400 flex items-center justify-center text-xl border-2 border-white">
              {user.avatar ?? '🌱'}
            </div>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-24">{children}</main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                  isActive ? 'text-green-600' : 'text-gray-500 hover:text-green-500'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className={`text-xs font-medium ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
