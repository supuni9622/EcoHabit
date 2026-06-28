'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

const NAV_ITEMS = [
  { href: '/home', label: 'Home', icon: '🏠' },
  { href: '/habits', label: 'Log', icon: '♻️' },
  { href: '/challenges', label: 'Challenges', icon: '🏆' },
  { href: '/lessons', label: 'Learn', icon: '📚' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors',
                isActive ? 'text-green-600' : 'text-gray-500 hover:text-green-500'
              )}
            >
              <span className="text-2xl">{item.icon}</span>
              <span
                className={clsx(
                  'text-xs font-medium',
                  isActive ? 'text-green-600' : 'text-gray-500'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
