'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { useAuthStore } from '../../lib/store/auth.store';

const AVATARS = ['🌱', '🌿', '🍀', '🌳', '🦋', '🐝', '🌍', '♻️'];

const WASTE_CATEGORIES = [
  { id: 'plastic', label: 'Plastic', icon: '🥤', description: 'Bottles, bags, packaging' },
  { id: 'paper', label: 'Paper', icon: '📄', description: 'Newspapers, cardboard' },
  { id: 'e-waste', label: 'E-Waste', icon: '💻', description: 'Electronics, batteries' },
  { id: 'organic', label: 'Organic', icon: '🍎', description: 'Food scraps, compost' },
  { id: 'glass', label: 'Glass', icon: '🍶', description: 'Bottles, jars' },
  { id: 'metal', label: 'Metal', icon: '🥫', description: 'Cans, steel items' },
];

type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [step, setStep] = useState<Step>(1);
  const [weeklyGoal, setWeeklyGoal] = useState(10);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState('🌱');
  const [saving, setSaving] = useState(false);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.id), {
        avatar: selectedAvatar,
        weeklyGoal,
        preferredWasteTypes: selectedCategories,
        onboardingCompleted: true,
        updatedAt: serverTimestamp(),
      });
      updateUser({
        avatar: selectedAvatar,
        weeklyGoal,
        preferredWasteTypes: selectedCategories,
        onboardingCompleted: true,
      });
      router.push('/home');
    } catch {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-green-700 mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="h-2 bg-green-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && (
            <div className="text-center">
              <div className="text-6xl mb-4">🌍</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to EcoHabit!</h2>
              <p className="text-gray-500 mb-6">
                You&apos;re joining a community of eco-heroes making the planet greener, one habit
                at a time. Let&apos;s set up your profile in just a few steps.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { icon: '🎮', label: 'Earn Points' },
                  { icon: '🏆', label: 'Unlock Badges' },
                  { icon: '📚', label: 'Learn Daily' },
                ].map((item) => (
                  <div key={item.label} className="bg-green-50 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className="text-xs font-semibold text-green-700">{item.label}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Get Started →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Set Your Weekly Goal</h2>
              <p className="text-gray-500 mb-6 text-sm">
                How many recycling actions do you aim to complete each week?
              </p>
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-green-600 mb-2">{weeklyGoal}</div>
                <p className="text-gray-500 text-sm">items per week</p>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                value={weeklyGoal}
                onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                className="w-full accent-green-500 mb-4"
              />
              <div className="flex justify-between text-xs text-gray-400 mb-8">
                <span>1 (Beginner)</span>
                <span>25 (Active)</span>
                <span>50 (Champion)</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Focus Areas</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Select the waste categories you&apos;ll focus on (choose at least one):
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {WASTE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedCategories.includes(cat.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="font-semibold text-sm text-gray-800">{cat.label}</div>
                    <div className="text-xs text-gray-500">{cat.description}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={selectedCategories.length === 0}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Pick Your Avatar</h2>
              <p className="text-gray-500 mb-6 text-sm">Choose an avatar to represent you:</p>
              <div className="grid grid-cols-4 gap-4 mb-8">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`aspect-square rounded-2xl text-4xl flex items-center justify-center border-2 transition-all ${
                      selectedAvatar === avatar
                        ? 'border-green-500 bg-green-50 scale-110'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
              <div className="bg-green-50 rounded-xl p-4 mb-6 flex items-center gap-4">
                <div className="text-4xl">{selectedAvatar}</div>
                <div>
                  <p className="font-semibold text-gray-800">{user?.displayName ?? 'EcoHero'}</p>
                  <p className="text-xs text-gray-500">
                    {weeklyGoal} items/week • {selectedCategories.length} categories
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={saving}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : "Let's Go! 🚀"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
