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
  {
    day: 6,
    title: 'Glass Recycling',
    description: 'Learn how glass is one of the few materials that can be recycled endlessly without quality loss.',
    keyMessage: 'Glass is 100% recyclable and can be melted and reformed indefinitely.',
    duration: '5 min',
    points: 50,
    category: 'glass',
    icon: '🍶',
  },
  {
    day: 7,
    title: 'Metal & Aluminum',
    description: 'Discover why recycling aluminum saves 95% of the energy needed to produce it from ore.',
    keyMessage: 'An aluminum can can be recycled and back on the shelf in 60 days.',
    duration: '5 min',
    points: 50,
    category: 'metal',
    icon: '🥫',
  },
  {
    day: 8,
    title: 'Textile Waste',
    description: 'Explore fast fashion\'s environmental cost and how donation and recycling help.',
    keyMessage: '92 million tonnes of textile waste is generated globally each year.',
    duration: '6 min',
    points: 50,
    category: 'textile',
    icon: '👗',
  },
  {
    day: 9,
    title: 'Hazardous Household Waste',
    description: 'Understand batteries, paints, and chemicals — and how to dispose of them safely.',
    keyMessage: 'One car battery can contaminate 25,000 litres of water if improperly disposed.',
    duration: '6 min',
    points: 50,
    category: 'hazardous',
    icon: '⚠️',
  },
  {
    day: 10,
    title: 'Ocean Plastic',
    description: 'Discover Sri Lanka\'s coastline crisis and what marine wildlife is at stake.',
    keyMessage: 'Sri Lanka\'s coastlines are on the front line of the ocean plastic crisis.',
    duration: '6 min',
    points: 50,
    category: 'plastic',
    icon: '🌊',
  },
  {
    day: 11,
    title: 'Climate Change & Waste',
    description: 'Understand how waste contributes to 5% of global greenhouse gas emissions.',
    keyMessage: 'Reducing waste is direct climate action — landfill methane is 80x worse than CO₂.',
    duration: '6 min',
    points: 50,
    category: 'general',
    icon: '🌡️',
  },
  {
    day: 12,
    title: 'Food Waste Economics',
    description: 'Explore the $1 trillion lost globally to food waste each year and Sri Lanka\'s challenge.',
    keyMessage: '1/3 of all food produced globally is wasted — worth $1 trillion per year.',
    duration: '5 min',
    points: 50,
    category: 'organic',
    icon: '🍱',
  },
  {
    day: 13,
    title: 'Upcycling & Creativity',
    description: 'Turn waste into art and useful items — Sri Lanka\'s creative craftspeople show the way.',
    keyMessage: 'Upcycling transforms waste into something of greater value than the original.',
    duration: '5 min',
    points: 50,
    category: 'general',
    icon: '🎨',
  },
  {
    day: 14,
    title: 'Corporate Responsibility',
    description: 'Learn about EPR laws, plastic credits, and how brands are being held accountable.',
    keyMessage: 'Just 20 companies produce 55% of all single-use plastic waste globally.',
    duration: '6 min',
    points: 50,
    category: 'general',
    icon: '🏢',
  },
  {
    day: 15,
    title: 'Zero Waste Lifestyle',
    description: 'Discover the 5Rs — Refuse, Reduce, Reuse, Recycle, Rot — and minimalism.',
    keyMessage: 'Zero waste is a direction, not a destination — the 5Rs are your guide.',
    duration: '6 min',
    points: 50,
    category: 'general',
    icon: '🌿',
  },
  {
    day: 16,
    title: 'Biodegradable vs Compostable',
    description: 'Understand the critical difference between these terms and how greenwashing works.',
    keyMessage: '"Biodegradable" doesn\'t mean eco-safe — always check the infrastructure behind the label.',
    duration: '5 min',
    points: 50,
    category: 'general',
    icon: '🌱',
  },
  {
    day: 17,
    title: 'Water & Waste Connection',
    description: 'Learn how improper waste disposal threatens clean water access in Sri Lanka.',
    keyMessage: 'Proper waste disposal protects clean water — plastic in drains causes flooding.',
    duration: '5 min',
    points: 50,
    category: 'general',
    icon: '💧',
  },
  {
    day: 18,
    title: 'Wildlife & Waste',
    description: 'Discover how waste harms Sri Lanka\'s elephants, sea turtles, and marine life.',
    keyMessage: 'Dozens of Sri Lankan elephants have died from ingesting plastic at open dumps.',
    duration: '6 min',
    points: 50,
    category: 'general',
    icon: '🐘',
  },
  {
    day: 19,
    title: 'Community Clean-up Culture',
    description: 'Explore plogging, Shramadana, and how communities organize environmental action.',
    keyMessage: 'Shramadana — Sri Lanka\'s tradition of voluntary labor — builds a cleaner environment.',
    duration: '5 min',
    points: 50,
    category: 'community',
    icon: '🤝',
  },
  {
    day: 20,
    title: 'Schools & Education',
    description: 'Understand how teaching eco habits to children multiplies environmental impact.',
    keyMessage: 'Children who learn environmental habits in school maintain them for life.',
    duration: '5 min',
    points: 50,
    category: 'education',
    icon: '📚',
  },
  {
    day: 21,
    title: 'Government Policy',
    description: 'Explore Sri Lankan waste laws, municipal programs, and how citizens can engage.',
    keyMessage: 'Sri Lanka\'s 2020 plastic ban shows policy can rapidly change behavior at scale.',
    duration: '6 min',
    points: 50,
    category: 'policy',
    icon: '🏛️',
  },
  {
    day: 22,
    title: 'Innovation & Technology',
    description: 'Discover waste-to-energy, smart bins, and blockchain waste tracking.',
    keyMessage: 'AI-powered waste sorting achieves 99% accuracy, transforming recycling economics.',
    duration: '6 min',
    points: 50,
    category: 'technology',
    icon: '🔬',
  },
  {
    day: 23,
    title: 'The Informal Economy',
    description: 'Learn about kalagedi vendors, waste pickers, and formalizing collection.',
    keyMessage: 'Sri Lanka\'s kalagedi vendors are the unsung heroes of recycling.',
    duration: '6 min',
    points: 50,
    category: 'community',
    icon: '🛒',
  },
  {
    day: 24,
    title: 'Your Personal Impact',
    description: 'Calculate your lifetime waste footprint and the cumulative power of daily choices.',
    keyMessage: 'Your individual choices, multiplied across a lifetime, create measurable change.',
    duration: '5 min',
    points: 50,
    category: 'general',
    icon: '👤',
  },
  {
    day: 25,
    title: 'The Future is Now',
    description: 'Celebrate your journey, reflect on what you\'ve learned, and commit to what comes next.',
    keyMessage: 'Your 25-day journey transforms awareness into habit — keep going, keep leading.',
    duration: '7 min',
    points: 100,
    category: 'general',
    icon: '🌍',
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
          {LESSONS.length - completedCount} lessons remaining • Days 1-24 worth 50 pts • Day 25 worth 100 pts
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
                    {lesson.day === 25 && !isCompleted && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                        Final
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
    </div>
  );
}
