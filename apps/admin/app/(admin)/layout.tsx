'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { isAdminUser } from '../../lib/auth';

const NAV = [
  { href: '/dashboard',  icon: '◉', label: 'Dashboard' },
  { href: '/users',      icon: '◈', label: 'Users' },
  { href: '/lessons',    icon: '◧', label: 'Lessons' },
  { href: '/challenges', icon: '◆', label: 'Challenges' },
  { href: '/analytics',  icon: '▦', label: 'Analytics' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/login');
        return;
      }
      const admin = await isAdminUser(user).catch(() => false);
      if (!admin) {
        await signOut(auth);
        router.replace('/login');
        return;
      }
      setEmail(user.email ?? '');
      setChecking(false);
    });
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-sidebar flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-sidebar-text-active border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-admin-bg">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col w-56 bg-sidebar transition-transform duration-200 lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border flex-shrink-0">
          <span className="text-2xl">🌿</span>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">EcoAdmin</p>
            <p className="text-sidebar-text text-xs">v0.1</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                  active
                    ? 'bg-sidebar-hover text-sidebar-text-active'
                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-sidebar-text-active rounded-r" />
                )}
                <span className="text-base leading-none w-4 text-center">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-sidebar-border flex-shrink-0">
          <div className="px-3 py-2 mb-1">
            <p className="text-xs text-sidebar-text truncate">{email}</p>
          </div>
          <button
            onClick={() => signOut(auth).then(() => router.replace('/login'))}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-text hover:bg-sidebar-hover hover:text-white transition-colors"
          >
            <span className="text-base leading-none w-4 text-center">→</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-admin-border flex-shrink-0">
          <button
            className="lg:hidden p-1 rounded text-admin-muted hover:text-admin-ink"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-admin-accent animate-pulse" />
            <span className="text-xs text-admin-muted">Live</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
