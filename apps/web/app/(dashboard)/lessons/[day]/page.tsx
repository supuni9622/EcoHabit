'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';
import { useAuthStore } from '../../../../lib/store/auth.store';
import { useGamificationStore } from '../../../../lib/store/gamification.store';

const LESSONS_DATA: Record<
  string,
  {
    day: number;
    title: string;
    icon: string;
    story: string;
    keyMessage: string;
    reflection: string;
    facts: string[];
    points: number;
  }
> = {
  '1': {
    day: 1,
    title: 'The Plastic Crisis',
    icon: '🥤',
    story: `Every year, over 380 million tonnes of plastic are produced worldwide. The vast majority of it ends up in landfills, oceans, and ecosystems where it persists for hundreds of years.

A plastic bottle you use for 10 minutes will take 450 years to decompose. Microplastics have been found in the deepest ocean trenches, in Arctic ice, and even in human blood.

Sri Lanka, with its beautiful coastlines, faces a particularly acute plastic waste challenge. Colombo's waterways carry plastic waste to the Indian Ocean daily. But communities are fighting back.

In 2020, Sri Lanka became one of the first countries to ban single-use plastic items. Local heroes like the Colombo Recycling Centre collect over 2 tonnes of plastic weekly.

Your plastic recycling actions, no matter how small, are part of this global movement.`,
    keyMessage: 'Every piece of plastic you recycle removes it from the cycle of pollution.',
    reflection:
      'Think about the plastic items you used today. How many could be replaced with reusable alternatives?',
    facts: [
      '8 million tonnes of plastic enter our oceans every year',
      'Only 9% of all plastic ever produced has been recycled',
      'Plastic bags can take up to 1,000 years to decompose',
      'Sri Lanka banned single-use plastics in 2020',
    ],
    points: 50,
  },
  '2': {
    day: 2,
    title: 'Paper and Forests',
    icon: '📄',
    story: `Forests are the lungs of our planet. They absorb CO₂, provide habitat for 80% of terrestrial species, and regulate our climate. Yet every year, 15 billion trees are cut down — many for paper products.

The good news: paper is one of the most recyclable materials on Earth. Recycled paper requires 70% less energy to produce than virgin paper and uses 60% less water.

In Sri Lanka, the traditional practice of "olai" — writing on palm leaves — was eco-friendly before paper replaced it. Modern Sri Lankan recycling initiatives are reviving appreciation for sustainable practices.

One ton of recycled paper saves 17 trees, 7,000 gallons of water, and enough energy to power an average home for six months.

When you sort your newspapers, cardboard boxes, and office paper for recycling, you're protecting forests globally.`,
    keyMessage: 'Recycling one ton of paper saves 17 trees and 7,000 gallons of water.',
    reflection:
      'How much paper does your household use weekly? Could you switch to digital alternatives for some of it?',
    facts: [
      'Paper can be recycled up to 7 times before fibers degrade',
      'Recycling 1 ton of paper saves 17 trees',
      '40% of municipal solid waste is paper products',
      'Recycled paper uses 60% less water to produce',
    ],
    points: 50,
  },
  '3': {
    day: 3,
    title: 'E-Waste: The Hidden Danger',
    icon: '💻',
    story: `Your old smartphone contains gold, silver, copper, and rare earth elements — but also lead, mercury, cadmium, and arsenic. When improperly disposed of, these toxins leach into soil and water.

E-waste is the fastest growing waste stream globally — 53.6 million tonnes in 2019 alone. Only 17.4% was formally recycled. The rest went to landfills or was informally processed in ways harmful to workers and communities.

In Sri Lanka, e-waste collection is growing. Organizations like HiEnergy Lanka collect electronics and ensure they're recycled responsibly. Samsung and other brands offer take-back programs.

But there's more than recycling: the most sustainable device is the one you already have. Extending your phone's life by even one year significantly reduces your carbon footprint.

Before replacing any device, ask: can it be repaired? Can I donate it?`,
    keyMessage: 'E-waste contains toxic materials that can leach into soil and water for decades.',
    reflection:
      'List the electronic devices in your home. When was the last time you properly disposed of an old device?',
    facts: [
      'E-waste is the fastest growing waste stream globally',
      'Only 17.4% of e-waste was formally recycled in 2019',
      'A smartphone contains 60+ elements from the periodic table',
      'Properly recycled electronics recover valuable materials worth billions',
    ],
    points: 50,
  },
  '4': {
    day: 4,
    title: 'Composting Basics',
    icon: '🍎',
    story: `Food waste is a massive environmental problem. When organic matter ends up in landfills, it decomposes without oxygen and releases methane — a greenhouse gas 80 times more potent than CO₂ over a 20-year period.

Composting transforms this problem into a solution. By decomposing organic material with oxygen, we create rich humus that improves soil health, reduces need for chemical fertilizers, and sequesters carbon.

In Sri Lanka's agricultural heartland, many farmers still practice traditional composting. Urban composting initiatives in Colombo and Kandy are spreading this knowledge to city dwellers.

Starting a compost is simpler than you think. Kitchen scraps (vegetables, fruit peels, coffee grounds), yard waste (leaves, grass clippings), and paper products can all be composted.

What cannot be composted: meat, dairy, oils, and diseased plants.

In just 2-3 months, your waste transforms into black gold for gardens.`,
    keyMessage: 'Composting reduces methane emissions and creates nutrient-rich soil for plants.',
    reflection:
      'How much of your household waste is food scraps? Could you start a small compost bin, even on a balcony?',
    facts: [
      'Food waste generates 8% of global greenhouse gas emissions',
      'Composting can divert 30% of household waste from landfills',
      'Compost improves soil water retention by up to 20%',
      'Methane from landfills is 80x more potent than CO₂',
    ],
    points: 50,
  },
  '5': {
    day: 5,
    title: 'The Circular Economy',
    icon: '♻️',
    story: `Our current economy is largely linear: take resources, make products, throw them away. This "cradle to grave" model generates enormous waste and depletes finite resources.

The circular economy reimagines this: materials stay in use for as long as possible, waste is minimized, and products are designed to be repaired, refurbished, and recycled — "cradle to cradle."

A circular economy model could generate $4.5 trillion in economic benefits by 2030. Countries like the Netherlands and Germany are already transitioning. Sri Lanka's "Pilisaru" national solid waste management project is a step in this direction.

Recycling is just one part. The full hierarchy is: Refuse → Reduce → Reuse → Repair → Refurbish → Recycle → Recover → Rot (compost).

Every time you choose a reusable bag, repair instead of replace, or buy second-hand, you're participating in the circular economy.`,
    keyMessage: 'A circular economy keeps materials in use longer, reducing waste and resource extraction.',
    reflection:
      'What is one thing you regularly throw away that could instead be repaired, repurposed, or bought second-hand?',
    facts: [
      'The circular economy could generate $4.5 trillion by 2030',
      'Recycling creates 10x more jobs per tonne than landfilling',
      'Recycled aluminum uses 95% less energy than virgin aluminum',
      'The EU circular economy action plan targets 70% recycling by 2030',
    ],
    points: 50,
  },
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const { addPoints } = useGamificationStore();
  const [slide, setSlide] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const day = params.day as string;
  const lesson = LESSONS_DATA[day];

  if (!lesson) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-xl font-bold text-gray-800">Lesson Not Found</h1>
        <button onClick={() => router.push('/lessons')} className="mt-4 text-green-600">
          Back to Lessons
        </button>
      </div>
    );
  }

  const isCompleted = user?.completedLessons?.includes(day) ?? false;
  const slides = [
    { type: 'story', title: lesson.title },
    { type: 'facts', title: 'Key Facts' },
    { type: 'reflection', title: 'Reflection' },
    { type: 'complete', title: 'Mark Complete' },
  ];

  const handleComplete = async () => {
    if (!user || completing || isCompleted) return;
    setCompleting(true);
    try {
      await updateDoc(doc(db, 'users', user.id), {
        completedLessons: arrayUnion(day),
        totalPoints: (user.totalPoints ?? 0) + lesson.points,
        updatedAt: serverTimestamp(),
      });
      updateUser({
        completedLessons: [...(user.completedLessons ?? []), day],
        totalPoints: (user.totalPoints ?? 0) + lesson.points,
      });
      addPoints(lesson.points);
      setCompleted(true);
    } finally {
      setCompleting(false);
    }
  };

  if (completed) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="text-6xl mb-4 animate-bounce">🎓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Lesson Complete!</h2>
          <p className="text-gray-500 mb-4">You earned</p>
          <div className="text-4xl font-bold text-green-600 mb-6">+{lesson.points} pts</div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/lessons')}
              className="flex-1 border border-green-600 text-green-600 py-3 rounded-xl font-medium"
            >
              More Lessons
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

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/lessons')} className="text-gray-500 hover:text-gray-700">
          ← Back
        </button>
        <div>
          <p className="text-xs text-gray-400">Day {lesson.day}</p>
          <h1 className="font-bold text-gray-800">{lesson.title}</h1>
        </div>
        <span className="ml-auto text-2xl">{lesson.icon}</span>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2 justify-center">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === slide ? 'w-6 bg-green-500' : i < slide ? 'w-2 bg-green-300' : 'w-2 bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm p-6 min-h-64">
        {slide === 0 && (
          <div>
            <h2 className="font-bold text-gray-800 mb-4">{lesson.title}</h2>
            <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {lesson.story}
            </div>
          </div>
        )}

        {slide === 1 && (
          <div>
            <h2 className="font-bold text-gray-800 mb-4">Key Facts</h2>
            <div className="space-y-3">
              {lesson.facts.map((fact, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <p className="text-sm text-gray-700">{fact}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm font-semibold text-yellow-700 mb-1">Key Message</p>
              <p className="text-sm text-yellow-600 italic">&quot;{lesson.keyMessage}&quot;</p>
            </div>
          </div>
        )}

        {slide === 2 && (
          <div>
            <h2 className="font-bold text-gray-800 mb-4">Reflection</h2>
            <div className="text-4xl mb-4 text-center">🤔</div>
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-blue-700 leading-relaxed">{lesson.reflection}</p>
            </div>
            <p className="text-xs text-gray-400 text-center">
              Take a moment to think about this before continuing
            </p>
          </div>
        )}

        {slide === 3 && (
          <div className="text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="font-bold text-gray-800 mb-2">Ready to complete?</h2>
            <p className="text-gray-500 text-sm mb-6">
              Mark this lesson as complete to earn your points reward
            </p>
            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Points reward</p>
              <p className="text-3xl font-bold text-green-600">+{lesson.points} pts</p>
            </div>
            <button
              onClick={handleComplete}
              disabled={completing || isCompleted}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {isCompleted
                ? 'Already Completed ✓'
                : completing
                ? 'Saving...'
                : 'Mark as Complete ✓'}
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => setSlide(Math.max(0, slide - 1))}
          disabled={slide === 0}
          className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium disabled:opacity-40"
        >
          ← Previous
        </button>
        {slide < slides.length - 1 && (
          <button
            onClick={() => setSlide(slide + 1)}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
