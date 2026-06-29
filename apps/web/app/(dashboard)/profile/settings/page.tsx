'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';
import { useAuthStore } from '../../../../lib/store/auth.store';
import { useAuth } from '../../../../lib/hooks/use-auth';

export default function SettingsPage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const { signOut } = useAuth();

  const [notifs, setNotifs] = useState(
    user?.preferences?.notifications ?? {
      dailyReminder: true,
      achievementAlerts: true,
      streakAlerts: true,
      communityUpdates: false,
    }
  );
  const [privacy, setPrivacy] = useState(
    user?.preferences?.privacy ?? {
      shareProgress: true,
      showOnLeaderboard: true,
      allowFriendRequests: true,
    }
  );

  // Notification schedule settings (stored in preferences)
  const [notifSchedule, setNotifSchedule] = useState({
    dailyReminder: notifs.dailyReminder,
    reminderTime: '08:00',
    streakAlerts: notifs.streakAlerts,
    achievements: notifs.achievementAlerts,
  });

  const [language, setLanguage] = useState('en');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingNotifs, setSavingNotifs] = useState(false);
  const [savedNotifs, setSavedNotifs] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.id), {
        preferences: { notifications: notifs, privacy },
        updatedAt: serverTimestamp(),
      });
      updateUser({ preferences: { notifications: notifs, privacy } });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    if (!user) return;
    setSavingNotifs(true);
    try {
      const updatedNotifs = {
        ...notifs,
        dailyReminder: notifSchedule.dailyReminder,
        streakAlerts: notifSchedule.streakAlerts,
        achievementAlerts: notifSchedule.achievements,
      };

      await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          preferences: {
            notifications: {
              ...updatedNotifs,
              reminderTime: notifSchedule.reminderTime,
            },
            privacy,
          },
        }),
      });

      setNotifs(updatedNotifs);
      updateUser({ preferences: { notifications: updatedNotifs, privacy } });
      setSavedNotifs(true);
      setTimeout(() => setSavedNotifs(false), 2000);
    } finally {
      setSavingNotifs(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const Toggle = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full transition-colors ${
        checked ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );

  const REMINDER_HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6 to 22

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-800">Settings</h1>
      </div>

      {saved && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm text-center">
          Settings saved!
        </div>
      )}

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700 text-sm">Notifications</h2>
        </div>
        {[
          { key: 'dailyReminder' as const, label: 'Daily Reminder', desc: 'Remind me to log actions' },
          { key: 'achievementAlerts' as const, label: 'Achievement Alerts', desc: 'Badge and level notifications' },
          { key: 'streakAlerts' as const, label: 'Streak Alerts', desc: "Warn me if my streak is at risk" },
          { key: 'communityUpdates' as const, label: 'Community Updates', desc: 'Leaderboard and challenges' },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-0"
          >
            <div>
              <p className="text-sm font-medium text-gray-700">{item.label}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
            <Toggle
              checked={notifs[item.key]}
              onChange={(v) => setNotifs({ ...notifs, [item.key]: v })}
            />
          </div>
        ))}
      </div>

      {/* Notification Schedule */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700 text-sm">Notification Schedule</h2>
        </div>

        {savedNotifs && (
          <div className="mx-5 mt-3 p-2 bg-green-50 border border-green-200 rounded-lg text-green-600 text-xs text-center">
            Notification settings saved!
          </div>
        )}

        {/* Daily reminder toggle */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div>
            <p className="text-sm font-medium text-gray-700">Daily reminder</p>
            <p className="text-xs text-gray-400">Get a push notification each day</p>
          </div>
          <Toggle
            checked={notifSchedule.dailyReminder}
            onChange={(v) => setNotifSchedule({ ...notifSchedule, dailyReminder: v })}
          />
        </div>

        {/* Reminder time */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div>
            <p className="text-sm font-medium text-gray-700">Reminder time</p>
            <p className="text-xs text-gray-400">When to send the daily reminder</p>
          </div>
          <select
            value={notifSchedule.reminderTime}
            onChange={(e) => setNotifSchedule({ ...notifSchedule, reminderTime: e.target.value })}
            disabled={!notifSchedule.dailyReminder}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-40"
          >
            {REMINDER_HOURS.map((h) => (
              <option key={h} value={`${String(h).padStart(2, '0')}:00`}>
                {h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h - 12}:00 PM`}
              </option>
            ))}
          </select>
        </div>

        {/* Streak alerts toggle */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div>
            <p className="text-sm font-medium text-gray-700">Streak alerts</p>
            <p className="text-xs text-gray-400">Warn when streak is at risk</p>
          </div>
          <Toggle
            checked={notifSchedule.streakAlerts}
            onChange={(v) => setNotifSchedule({ ...notifSchedule, streakAlerts: v })}
          />
        </div>

        {/* Achievement notifications toggle */}
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Achievement notifications</p>
            <p className="text-xs text-gray-400">Badge unlocks and level-ups</p>
          </div>
          <Toggle
            checked={notifSchedule.achievements}
            onChange={(v) => setNotifSchedule({ ...notifSchedule, achievements: v })}
          />
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={handleSaveNotifications}
            disabled={savingNotifs}
            className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {savingNotifs ? 'Saving...' : 'Save Notification Settings'}
          </button>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700 text-sm">Privacy</h2>
        </div>
        {[
          { key: 'shareProgress' as const, label: 'Share Progress', desc: 'Let others see your stats' },
          { key: 'showOnLeaderboard' as const, label: 'Show on Leaderboard', desc: 'Appear in global rankings' },
          { key: 'allowFriendRequests' as const, label: 'Allow Friend Requests', desc: 'Let others connect with you' },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-0"
          >
            <div>
              <p className="text-sm font-medium text-gray-700">{item.label}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
            <Toggle
              checked={privacy[item.key]}
              onChange={(v) => setPrivacy({ ...privacy, [item.key]: v })}
            />
          </div>
        ))}
      </div>

      {/* Language */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-700 text-sm mb-3">Language</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="en">English</option>
          <option value="si">Sinhala (සිංහල)</option>
          <option value="ta">Tamil (தமிழ்)</option>
        </select>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Settings'}
      </button>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full border-2 border-red-300 text-red-500 py-3 rounded-xl font-medium hover:bg-red-50"
      >
        Sign Out
      </button>
    </div>
  );
}
