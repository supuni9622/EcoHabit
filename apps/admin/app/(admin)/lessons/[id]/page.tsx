'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { LESSONS } from '../../../../lib/lessons-data';

interface LessonOverride {
  title: string;
  description: string;
  keyMessage: string;
  story: string;
  facts: string[];
  reflectionPrompt: string;
  updatedAt?: Date;
}

export default function LessonEditorPage() {
  const params = useParams();
  const router = useRouter();
  const day = parseInt(params.id as string, 10);

  const base = LESSONS.find((l) => l.day === day);
  const [override, setOverride] = useState<LessonOverride | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    keyMessage: '',
    story: '',
    facts: ['', '', ''],
    reflectionPrompt: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!base) { setLoading(false); return; }

    async function load() {
      const snap = await getDoc(doc(db, 'lessonOverrides', String(day)));
      if (snap.exists()) {
        const data = snap.data() as LessonOverride;
        setOverride(data);
        setForm({
          title: data.title || base!.title,
          description: data.description || base!.description,
          keyMessage: data.keyMessage || base!.keyMessage,
          story: data.story || '',
          facts: data.facts?.length ? data.facts : ['', '', ''],
          reflectionPrompt: data.reflectionPrompt || '',
        });
      } else {
        setForm({
          title: base!.title,
          description: base!.description,
          keyMessage: base!.keyMessage,
          story: '',
          facts: ['', '', ''],
          reflectionPrompt: '',
        });
      }
      setLoading(false);
    }
    load();
  }, [day, base]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await setDoc(doc(db, 'lessonOverrides', String(day)), {
        ...form,
        facts: form.facts.filter((f) => f.trim()),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save error', err);
    } finally {
      setSaving(false);
    }
  };

  const updateFact = (i: number, val: string) => {
    const facts = [...form.facts];
    facts[i] = val;
    setForm({ ...form, facts });
  };

  if (!base) {
    return (
      <div className="text-center py-20">
        <p className="text-admin-muted">Lesson {day} not found.</p>
        <Link href="/lessons" className="admin-btn-secondary mt-4 inline-flex">← Back to lessons</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/lessons" className="text-admin-muted hover:text-admin-ink text-sm">Lessons</Link>
            <span className="text-admin-muted text-sm">/</span>
            <span className="text-sm text-admin-ink">Day {day}</span>
          </div>
          <h1 className="text-xl font-semibold text-admin-ink flex items-center gap-2">
            <span>{base.icon}</span>
            {base.title}
          </h1>
          {override?.updatedAt && (
            <p className="text-xs text-admin-muted mt-1">
              Last edited {(override.updatedAt as unknown as Date).toLocaleString?.() ?? 'recently'}
            </p>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className={`admin-btn-primary ${saved ? 'bg-green-700' : ''}`}
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}
        </button>
      </div>

      {loading ? (
        <div className="py-10 text-center text-admin-muted">Loading…</div>
      ) : (
        <div className="space-y-5">
          {/* Basic fields */}
          <div className="bg-admin-card border border-admin-border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-admin-ink">Basic info</h2>

            <div>
              <label className="admin-label">Title</label>
              <input
                className="admin-input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">Description</label>
              <textarea
                className="admin-textarea"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">Key message</label>
              <input
                className="admin-input"
                value={form.keyMessage}
                onChange={(e) => setForm({ ...form, keyMessage: e.target.value })}
              />
              <p className="text-xs text-admin-muted mt-1">Shown as the headline fact on the lesson card</p>
            </div>
          </div>

          {/* Story */}
          <div className="bg-admin-card border border-admin-border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-admin-ink">Story content</h2>
            <div>
              <label className="admin-label">Story / narrative (markdown supported)</label>
              <textarea
                className="admin-textarea font-mono text-xs"
                rows={10}
                value={form.story}
                onChange={(e) => setForm({ ...form, story: e.target.value })}
                placeholder="Write the lesson story here. Supports **bold**, *italic*, and - bullet points."
              />
            </div>
          </div>

          {/* Facts */}
          <div className="bg-admin-card border border-admin-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-admin-ink">Key facts</h2>
              <button
                type="button"
                onClick={() => setForm({ ...form, facts: [...form.facts, ''] })}
                className="admin-btn-secondary text-xs py-1 px-2.5"
              >
                + Add fact
              </button>
            </div>
            {form.facts.map((fact, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="font-mono text-xs text-admin-muted mt-2.5 w-4">{i + 1}</span>
                <input
                  className="admin-input flex-1"
                  value={fact}
                  onChange={(e) => updateFact(i, e.target.value)}
                  placeholder={`Fact ${i + 1}…`}
                />
                {form.facts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, facts: form.facts.filter((_, j) => j !== i) })}
                    className="mt-1.5 text-admin-muted hover:text-admin-danger transition-colors text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Reflection */}
          <div className="bg-admin-card border border-admin-border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-admin-ink">Reflection prompt</h2>
            <div>
              <label className="admin-label">Prompt shown to users after completing the lesson</label>
              <textarea
                className="admin-textarea"
                rows={3}
                value={form.reflectionPrompt}
                onChange={(e) => setForm({ ...form, reflectionPrompt: e.target.value })}
                placeholder="e.g. What one thing will you change about how you dispose of plastic this week?"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pb-6">
            <Link href="/lessons" className="admin-btn-secondary">Cancel</Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`admin-btn-primary ${saved ? 'bg-green-700' : ''}`}
            >
              {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
