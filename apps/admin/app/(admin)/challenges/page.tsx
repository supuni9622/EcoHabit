'use client';

import { useEffect, useState } from 'react';
import {
  collection, query, orderBy, getDocs, addDoc, updateDoc,
  doc, deleteDoc, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface Challenge {
  id: string;
  title: string;
  description: string;
  wasteType: string;
  target: number;
  points: number;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'ended';
}

const WASTE_TYPES = ['plastic', 'paper', 'e-waste', 'organic', 'glass', 'metal', 'textile', 'general'];
const WASTE_EMOJI: Record<string, string> = {
  plastic: '🥤', paper: '📄', 'e-waste': '💻', organic: '🍎',
  glass: '🍶', metal: '🥫', textile: '👗', general: '♻️',
};

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-600',
  ended: 'bg-red-100 text-red-600',
};

function toInputDate(d: Date) {
  return d.toISOString().split('T')[0];
}

type ChallengeForm = {
  title: string; description: string; wasteType: string;
  target: number; points: number;
  startDate: string; endDate: string;
  status: Challenge['status'];
};

const EMPTY_FORM: ChallengeForm = {
  title: '', description: '', wasteType: 'plastic',
  target: 10, points: 100,
  startDate: toInputDate(new Date()),
  endDate: toInputDate(new Date(Date.now() + 7 * 86400000)),
  status: 'draft',
};

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ChallengeForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'challenges'), orderBy('startDate', 'desc')));
      setChallenges(snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title as string ?? '',
          description: data.description as string ?? '',
          wasteType: data.wasteType as string ?? 'general',
          target: data.target as number ?? 1,
          points: data.points as number ?? 100,
          startDate: (data.startDate as Timestamp)?.toDate() ?? new Date(),
          endDate: (data.endDate as Timestamp)?.toDate() ?? new Date(),
          status: data.status as Challenge['status'] ?? 'draft',
        };
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (c: Challenge) => {
    setEditId(c.id);
    setForm({
      title: c.title,
      description: c.description,
      wasteType: c.wasteType,
      target: c.target,
      points: c.points,
      startDate: toInputDate(c.startDate),
      endDate: toInputDate(c.endDate),
      status: c.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        wasteType: form.wasteType,
        target: form.target,
        points: form.points,
        startDate: Timestamp.fromDate(new Date(form.startDate)),
        endDate: Timestamp.fromDate(new Date(form.endDate)),
        status: form.status,
        updatedAt: serverTimestamp(),
      };

      if (editId) {
        await updateDoc(doc(db, 'challenges', editId), payload);
      } else {
        await addDoc(collection(db, 'challenges'), {
          ...payload,
          createdAt: serverTimestamp(),
          participantCount: 0,
        });
      }
      setShowForm(false);
      await load();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this challenge? This cannot be undone.')) return;
    await deleteDoc(doc(db, 'challenges', id));
    setChallenges((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleStatus = async (c: Challenge) => {
    const next = c.status === 'active' ? 'ended' : 'active';
    await updateDoc(doc(db, 'challenges', c.id), { status: next });
    setChallenges((prev) => prev.map((ch) => ch.id === c.id ? { ...ch, status: next } : ch));
  };

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-admin-ink">Challenges</h1>
          <p className="text-sm text-admin-muted mt-0.5">{challenges.length} challenges</p>
        </div>
        <button onClick={openCreate} className="admin-btn-primary">+ New challenge</button>
      </div>

      {/* Create / Edit form */}
      {showForm && (
        <div className="bg-admin-card border border-admin-border rounded-xl p-6">
          <h2 className="font-semibold text-admin-ink mb-5">{editId ? 'Edit challenge' : 'New challenge'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="admin-label">Title</label>
              <input required className="admin-input" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">Description</label>
              <textarea rows={2} className="admin-textarea" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Waste type</label>
              <select className="admin-input" value={form.wasteType}
                onChange={(e) => setForm({ ...form, wasteType: e.target.value })}>
                {WASTE_TYPES.map((t) => (
                  <option key={t} value={t}>{WASTE_EMOJI[t]} {t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-label">Status</label>
              <select className="admin-input" value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Challenge['status'] })}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="ended">Ended</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Target (items)</label>
              <input type="number" min={1} required className="admin-input" value={form.target}
                onChange={(e) => setForm({ ...form, target: parseInt(e.target.value) })} />
            </div>
            <div>
              <label className="admin-label">Points reward</label>
              <input type="number" min={1} required className="admin-input" value={form.points}
                onChange={(e) => setForm({ ...form, points: parseInt(e.target.value) })} />
            </div>
            <div>
              <label className="admin-label">Start date</label>
              <input type="date" required className="admin-input" value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">End date</label>
              <input type="date" required className="admin-input" value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="admin-btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="admin-btn-primary">
                {submitting ? 'Saving…' : editId ? 'Save changes' : 'Create challenge'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Waste type</th>
              <th>Target</th>
              <th>Points</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-10 text-admin-muted">Loading…</td></tr>
            ) : challenges.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-10 text-admin-muted">No challenges yet. Create one above.</td></tr>
            ) : (
              challenges.map((c) => (
                <tr key={c.id}>
                  <td className="font-medium">{c.title}</td>
                  <td>
                    <span className="flex items-center gap-1.5">
                      {WASTE_EMOJI[c.wasteType] ?? '♻️'}
                      <span className="capitalize text-xs">{c.wasteType}</span>
                    </span>
                  </td>
                  <td className="font-mono">{c.target}</td>
                  <td className="font-mono text-admin-accent">{c.points}</td>
                  <td className="text-admin-muted text-xs">{c.startDate.toLocaleDateString('en-LK')}</td>
                  <td className="text-admin-muted text-xs">{c.endDate.toLocaleDateString('en-LK')}</td>
                  <td>
                    <span className={`admin-badge ${STATUS_STYLE[c.status]}`}>{c.status}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(c)} className="admin-btn-secondary text-xs py-1 px-2.5">Edit</button>
                      <button
                        onClick={() => toggleStatus(c)}
                        className={`admin-btn text-xs py-1 px-2.5 ${c.status === 'active' ? 'admin-btn-danger' : 'admin-btn-primary'}`}
                      >
                        {c.status === 'active' ? 'End' : 'Activate'}
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="text-admin-muted hover:text-admin-danger transition-colors text-sm">✕</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
