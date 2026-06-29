'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { isAdminUser } from '../../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const admin = await isAdminUser(user).catch(() => false);
        if (admin) router.replace('/dashboard');
      }
      setChecking(false);
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const admin = await isAdminUser(cred.user);
      if (!admin) {
        await auth.signOut();
        setError('This account does not have admin access.');
        return;
      }
      router.replace('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign-in failed';
      setError(
        msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')
          ? 'Invalid email or password.'
          : msg
      );
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-sidebar flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-sidebar-text-active border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl">🌿</span>
          <h1 className="mt-3 text-xl font-semibold text-white tracking-tight">EcoHabit Admin</h1>
          <p className="text-sidebar-text text-sm mt-1">Internal management console</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-2xl space-y-4">
          <div>
            <label className="admin-label">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ecohabit.app"
              className="admin-input"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="admin-label">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="admin-input"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-admin-danger bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full admin-btn-primary justify-center py-2.5 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in…
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-sidebar-text mt-6">
          Admin access requires a Firebase custom claim: <code className="bg-sidebar-hover px-1 rounded text-sidebar-text-active">role: &quot;admin&quot;</code>
        </p>
      </div>
    </div>
  );
}
