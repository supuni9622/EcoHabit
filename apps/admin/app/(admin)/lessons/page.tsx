'use client';

import Link from 'next/link';
import { LESSONS } from '../../../lib/lessons-data';

const categoryColor: Record<string, string> = {
  plastic: 'bg-blue-100 text-blue-700',
  paper: 'bg-amber-100 text-amber-700',
  'e-waste': 'bg-purple-100 text-purple-700',
  organic: 'bg-green-100 text-green-700',
  glass: 'bg-cyan-100 text-cyan-700',
  metal: 'bg-gray-100 text-gray-700',
  textile: 'bg-rose-100 text-rose-700',
  hazardous: 'bg-orange-100 text-orange-700',
  community: 'bg-indigo-100 text-indigo-700',
  education: 'bg-yellow-100 text-yellow-700',
  general: 'bg-slate-100 text-slate-600',
};

export default function LessonsPage() {
  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold text-admin-ink">Lessons</h1>
        <p className="text-sm text-admin-muted mt-0.5">
          {LESSONS.length} lessons — click <span className="font-medium">Edit</span> to override content in Firestore
        </p>
      </div>

      <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Title</th>
              <th>Category</th>
              <th>Points</th>
              <th>Duration</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {LESSONS.map((lesson) => (
              <tr key={lesson.day}>
                <td>
                  <span className="font-mono text-admin-muted">{String(lesson.day).padStart(2, '0')}</span>
                </td>
                <td>
                  <span className="flex items-center gap-2">
                    <span className="text-base">{lesson.icon}</span>
                    <span className="font-medium">{lesson.title}</span>
                  </span>
                </td>
                <td>
                  <span className={`admin-badge ${categoryColor[lesson.category] ?? categoryColor.general}`}>
                    {lesson.category}
                  </span>
                </td>
                <td><span className="font-mono text-admin-accent">{lesson.points}</span></td>
                <td className="text-admin-muted text-xs">{lesson.duration}</td>
                <td>
                  <Link
                    href={`/lessons/${lesson.day}`}
                    className="admin-btn-secondary text-xs py-1 px-3"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
