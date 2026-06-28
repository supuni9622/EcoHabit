'use client';

import { useAuthStore } from '../../../lib/store/auth.store';
import Link from 'next/link';

const LESSONS = [
  {
    day: 1,
    title: 'The Plastic Crisis',
    description: 'Discover how plastic pollution is devastating our oceans and wildlife.',
    keyMessage: 'Every piece of plastic ever made still exists somewhere on Earth.',
    duration: '5 min',
    points: 50,
    category: 'plastic',
    icon: '🥤',
  },
  {
    day: 2,
    title: 'Paper and Forests',
    description: 'Learn the connection between paper consumption and deforestation.',
    keyMessage: 'Recycling one ton of paper saves 17 trees and 7,000 gallons of water.',
    duration: '5 min',
    points: 50,
    category: 'paper',
    icon: '📄',
  },
  {
    day: 3,
    title: 'E-Waste: The Hidden Danger',
    description: 'Understand why electronic waste is the fastest growing waste stream.',
    keyMessage: 'E-waste contains toxic materials that can leach into soil and water.',
    duration: '6 min',
    points: 50,
    category: 'e-waste',
    icon: '💻',
  },
  {
    day: 4,
    title: 'Composting Basics',
    description: 'Turn your food scraps into black gold for gardens.',
    keyMessage: 'Composting reduces methane emissions from landfills by up to 50%.',
    duration: '5 min',
    points: 50,
    category: 'organic',
    icon: '🍎',
  },
  {
    day: 5,
    title: 'The Circular Economy',
    description: 'Discover how recycling creates jobs and saves energy.',
    keyMessage: 'A circular economy could generate $4.5 trillion in economic benefits by 2030.',
    duration: '7 min',
    points: 50,
    category: 'general',
    icon: '♻️',
  },
];

export default function LessonsPage() {
  const { user } = useAuthStore();
  const completedLessons = user?.completedLessons ?? [];
  const completedCount = completedLessons.length;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Eco Lessons</h1>
        <p className="text-gray-500 text-sm mt-1">Learn to earn — complete lessons for points</p>
      </div>

      {/* Progress indicator */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-gray-700">Your Progress</span>
          <span className="text-green-600 font-bold">{completedCount} / {LESSONS.length}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all"
            style={{ width: `${(completedCount / LESSONS.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {LESSONS.length - completedCount} lessons remaining • Each worth 50 pts
        </p>
      </div>

      {/* Lesson cards */}
      <div className="space-y-3">
        {LESSONS.map((lesson) => {
          const isCompleted = completedLessons.includes(String(lesson.day));
          const isUnlocked = lesson.day <= completedCount + 1;

          return (
            <Link
              key={lesson.day}
              href={isUnlocked ? `/lessons/${lesson.day}` : '#'}
              className={`block bg-white rounded-2xl shadow-sm border p-5 transition-all ${
                isUnlocked
                  ? 'border-gray-100 hover:shadow-md active:scale-98'
                  : 'border-gray-100 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    isCompleted
                      ? 'bg-green-100'
                      : isUnlocked
                      ? 'bg-blue-50'
                      : 'bg-gray-100'
                  }`}
                >
                  {isCompleted ? '✅' : isUnlocked ? lesson.icon : '🔒'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs text-gray-400 font-medium">Day {lesson.day}</span>
                    {isCompleted && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        Completed
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">{lesson.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{lesson.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400">⏱ {lesson.duration}</span>
                    <span className="text-xs text-green-600 font-medium">+{lesson.points} pts</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Coming soon */}
      <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-6 text-center">
        <div className="text-3xl mb-2">🔜</div>
        <p className="text-gray-500 text-sm font-medium">More lessons coming soon!</p>
        <p className="text-gray-400 text-xs mt-1">20 more lessons are being prepared</p>
      </div>
    </div>
  );
}
