'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/store/auth.store';

/**
 * Root redirect page.
 * - Authenticated users with onboarding complete → /home
 * - Authenticated users without onboarding → /onboarding
 * - Unauthenticated users → /login
 */
export default function RootPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
    } else if (!user.onboardingCompleted) {
      router.replace('/onboarding');
    } else {
      router.replace('/home');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🌿</div>
        <p className="text-green-600 font-medium">Loading EcoHabit...</p>
      </div>
    </div>
  );
}
