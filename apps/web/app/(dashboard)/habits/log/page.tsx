'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, animate } from 'framer-motion';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../lib/firebase/config';
import { useAuthStore } from '../../../../lib/store/auth.store';
import { useHabitsStore } from '../../../../lib/store/habits.store';
import { getTodayPoints } from '../../../../lib/services/habits';
import { z } from 'zod';
import { queueHabitLog, flushQueuedLogs } from '../../../../lib/offline/habit-queue';
import { trackHabitLogged } from '../../../../lib/services/analytics';

const WASTE_TYPES = [
  { id: 'plastic', icon: '🥤', label: 'Plastic', pts: 10 },
  { id: 'paper', icon: '📄', label: 'Paper', pts: 8 },
  { id: 'e-waste', icon: '💻', label: 'E-Waste', pts: 20 },
  { id: 'organic', icon: '🍎', label: 'Organic', pts: 5 },
  { id: 'glass', icon: '🍶', label: 'Glass', pts: 12 },
  { id: 'metal', icon: '🥫', label: 'Metal', pts: 14 },
  { id: 'textile', icon: '👗', label: 'Textile', pts: 6 },
  { id: 'general', icon: '🗑️', label: 'General', pts: 5 },
];

const logSchema = z.object({
  wasteType: z.string().min(1),
  quantity: z.number().int().min(1).max(100),
  notes: z.string().max(200).optional(),
});

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/** Animated counter that counts up from 0 to the target value */
function AnimatedCounter({ target }: { target: number }) {
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(0, target, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate(value) {
        node.textContent = `+${Math.round(value)}`;
      },
    });

    return () => controls.stop();
  }, [target]);

  return <div ref={nodeRef} className="text-5xl font-bold text-green-600">+0</div>;
}

function LogForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const { addLog, setTodayPoints, todayPoints } = useHabitsStore();

  const defaultType = searchParams.get('type') ?? 'plastic';
  const [wasteType, setWasteType] = useState(defaultType);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [offlineQueued, setOfflineQueued] = useState(false);
  const [success, setSuccess] = useState<{ points: number; badges: string[] } | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionMood, setReflectionMood] = useState<number | null>(null);
  const [reflectionNote, setReflectionNote] = useState('');
  const [habitLogId, setHabitLogId] = useState('');
  const [pendingSuccess, setPendingSuccess] = useState<{ points: number; badges: string[] } | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Initialize todayPoints from Firestore on mount if store is empty
  useEffect(() => {
    if (user && todayPoints === 0) {
      getTodayPoints(user.id).then((pts) => {
        if (pts > 0) setTodayPoints(pts);
      });
    }
  }, [user, todayPoints, setTodayPoints]);

  // Flush queued offline logs on mount if online
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.onLine) {
      flushQueuedLogs().catch(() => { /* ignore */ });
    }
  }, []);

  const selectedType = WASTE_TYPES.find((wt) => wt.id === wasteType) ?? WASTE_TYPES[0];
  const estimatedPoints = (selectedType?.pts ?? 5) * quantity;
  const remainingCap = 500 - todayPoints;
  const pointsAfterCap = Math.min(estimatedPoints, remainingCap);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select an image file.');
      return;
    }
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      setPhotoError('Image must be smaller than 5 MB.');
      return;
    }

    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsed = logSchema.safeParse({ wasteType, quantity, notes: notes || undefined });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? 'Invalid input');
      return;
    }

    setLoading(true);
    try {
      let photoUrl: string | undefined;

      // Upload photo if present
      if (photoFile && user?.id) {
        setUploadProgress(true);
        const storageRef = ref(storage, `habitPhotos/${user.id}/${Date.now()}.jpg`);
        await uploadBytes(storageRef, photoFile);
        photoUrl = await getDownloadURL(storageRef);
        setUploadProgress(false);
      }

      const requestBody = { wasteType, quantity, notes, userId: user?.id, photoUrl };
      const res = await fetch('/api/habits/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to log');

      // Update local store
      const logId = data.logId ?? crypto.randomUUID();
      addLog({
        id: logId,
        userId: user?.id ?? '',
        wasteType,
        quantity,
        pointsAwarded: data.pointsEarned,
        notes,
        loggedAt: new Date(),
        co2Saved: data.co2Saved ?? 0,
        waterSaved: data.waterSaved ?? 0,
      });

      // Track analytics
      trackHabitLogged(wasteType, data.pointsEarned).catch(() => {});

      const successData = {
        points: data.pointsEarned,
        badges: (data.newBadges ?? []).map((b: { id: string; name: string }) => b.name),
      };

      // Show reflection modal before success screen
      setHabitLogId(logId);
      setPendingSuccess(successData);
      setShowReflection(true);
    } catch (err: unknown) {
      // If network error (offline), queue the log
      if (err instanceof TypeError && err.message.includes('fetch')) {
        try {
          const requestBody = { wasteType, quantity, notes, userId: user?.id };
          await queueHabitLog(requestBody as Record<string, unknown>);
          setOfflineQueued(true);
        } catch {
          setError('Failed to queue action for offline sync');
        }
      } else {
        setError(err instanceof Error ? err.message : 'Failed to log action');
      }
    } finally {
      setLoading(false);
      setUploadProgress(false);
    }
  };

  const saveReflection = async () => {
    if (!user?.id || !habitLogId) return;
    try {
      await fetch('/api/reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          habitLogId,
          mood: reflectionMood ?? 3,
          note: reflectionNote || undefined,
          wasteType,
        }),
      });
    } catch { /* silently fail */ }
    setShowReflection(false);
    setReflectionMood(null);
    setReflectionNote('');
    if (pendingSuccess) setSuccess(pendingSuccess);
  };

  const skipReflection = () => {
    setShowReflection(false);
    setReflectionMood(null);
    setReflectionNote('');
    if (pendingSuccess) setSuccess(pendingSuccess);
  };

  if (offlineQueued) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">📡</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Saved Offline</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Your action has been queued and will sync automatically when you reconnect.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setOfflineQueued(false)}
              className="flex-1 border border-green-600 text-green-600 py-3 rounded-xl font-medium"
            >
              Log Another
            </button>
            <button
              onClick={() => router.push('/home')}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white rounded-2xl shadow-sm p-8 text-center"
        >
          {/* Animated checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-4xl">✅</span>
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">Action Logged!</h2>
          <p className="text-gray-500 mb-4">points earned</p>

          {/* Animated points counter */}
          <AnimatedCounter target={success.points} />

          {success.badges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-6 mb-2"
            >
              <p className="font-semibold text-yellow-700 mb-2">🏆 New Badge Unlocked!</p>
              {success.badges.map((b) => (
                <p key={b} className="text-yellow-600 text-sm">{b}</p>
              ))}
            </motion.div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setSuccess(null)}
              className="flex-1 border border-green-600 text-green-600 py-3 rounded-xl font-medium"
            >
              Log Another
            </button>
            <button
              onClick={() => router.push('/home')}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold"
            >
              Go Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Reflection modal */}
      {showReflection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">How do you feel?</h2>
            <div className="flex justify-center gap-3 mb-4">
              {([1, 2, 3, 4, 5] as const).map((val) => {
                const emojis: Record<number, string> = { 1: '😔', 2: '😐', 3: '🙂', 4: '😊', 5: '🤩' };
                return (
                  <button
                    key={val}
                    onClick={() => setReflectionMood(val)}
                    className={`text-3xl p-2 rounded-xl transition-all ${
                      reflectionMood === val ? 'bg-green-100 scale-110' : 'hover:bg-gray-100'
                    }`}
                  >
                    {emojis[val]}
                  </button>
                );
              })}
            </div>
            <textarea
              value={reflectionNote}
              onChange={(e) => setReflectionNote(e.target.value)}
              placeholder="Any thoughts on your action today? (optional)"
              maxLength={300}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={skipReflection}
                className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl font-medium text-sm"
              >
                Skip
              </button>
              <button
                onClick={saveReflection}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold text-sm"
              >
                Save Reflection
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-800">Log Eco Action</h1>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Waste type selection */}
        <fieldset className="bg-white rounded-2xl p-5 shadow-sm">
          <legend className="block text-sm font-medium text-gray-700 mb-3">Waste Type</legend>
          <div className="grid grid-cols-4 gap-2">
            {WASTE_TYPES.map((wt) => (
              <button
                key={wt.id}
                type="button"
                aria-pressed={wasteType === wt.id}
                onClick={() => setWasteType(wt.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                  wasteType === wt.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <span className="text-2xl" aria-hidden="true">{wt.icon}</span>
                <span className="text-xs font-medium text-gray-700">{wt.label}</span>
                <span className="text-xs text-green-600">+{wt.pts}pts</span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Quantity input */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <label htmlFor="quantity-slider" className="block text-sm font-medium text-gray-700 mb-3">
            Quantity (1-100)
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-xl flex items-center justify-center"
            >
              <span aria-hidden="true">−</span>
            </button>
            <div className="flex-1 text-center" aria-live="polite" aria-atomic="true">
              <div className="text-5xl font-bold text-gray-800">{quantity}</div>
              <div className="text-xs text-gray-500 mt-1">
                {quantity === 1 ? 'item' : 'items'}
              </div>
            </div>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity(Math.min(100, quantity + 1))}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-xl flex items-center justify-center"
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
          <input
            id="quantity-slider"
            type="range"
            min={1}
            max={100}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full accent-green-500 mt-4"
          />
        </div>

        {/* Optional notes */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <label htmlFor="habit-notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes (optional)
          </label>
          <textarea
            id="habit-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Where did you recycle? Any notes..."
            maxLength={200}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-400 mt-1" aria-live="polite">{notes.length}/200</p>
        </div>

        {/* Photo upload */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="block text-sm font-medium text-gray-700 mb-3">
            Add Photo (optional)
          </p>
          {photoPreview ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoPreview}
                alt="Selected photo preview"
                className="w-full h-40 object-cover rounded-xl border border-gray-200"
              />
              <button
                type="button"
                onClick={removePhoto}
                aria-label="Remove selected photo"
                className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold hover:bg-red-600"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-green-400 hover:bg-green-50 transition-colors text-gray-400 hover:text-green-600"
            >
              <span className="text-2xl" aria-hidden="true">📷</span>
              <span className="text-xs font-medium">Tap to add a photo (max 5 MB)</span>
            </button>
          )}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            aria-label="Upload photo"
            onChange={handlePhotoChange}
            className="hidden"
          />
          {photoError && (
            <p role="alert" className="text-xs text-red-500 mt-2">{photoError}</p>
          )}
          {uploadProgress && (
            <p aria-live="polite" className="text-xs text-green-600 mt-2 animate-pulse">Uploading photo...</p>
          )}
        </div>

        {/* Points preview */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Estimated points</p>
            <p className="text-xs text-gray-400">Daily cap: {remainingCap} pts remaining</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">+{pointsAfterCap}</div>
            {estimatedPoints !== pointsAfterCap && (
              <div className="text-xs text-gray-400 line-through">{estimatedPoints}</div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Logging...' : '♻️ Log Action'}
        </button>
      </form>
    </div>
  );
}

export default function LogPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-5xl animate-bounce">🌿</div></div>}>
      <LogForm />
    </Suspense>
  );
}
