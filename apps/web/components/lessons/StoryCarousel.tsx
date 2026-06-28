'use client';

import React, { useState } from 'react';

export interface Slide {
  title: string;
  content: string;
  image?: string;
  icon?: string;
}

export interface StoryCarouselProps {
  slides: Slide[];
  onComplete?: () => void;
  className?: string;
}

export const StoryCarousel: React.FC<StoryCarouselProps> = ({
  slides,
  onComplete,
  className,
}) => {
  const [current, setCurrent] = useState(0);

  const goNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      onComplete?.();
    }
  };

  const goPrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const slide = slides[current];

  return (
    <div className={`relative ${className ?? ''}`}>
      {/* Progress indicators */}
      <div className="flex gap-1.5 mb-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`flex-1 h-1 rounded-full transition-all ${
              i === current
                ? 'bg-green-500'
                : i < current
                ? 'bg-green-300'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Slide content */}
      <div className="min-h-48">
        {slide.icon && (
          <div className="text-4xl text-center mb-4">{slide.icon}</div>
        )}
        <h3 className="font-bold text-gray-800 mb-3">{slide.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{slide.content}</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={goPrev}
          disabled={current === 0}
          className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40"
        >
          ← Previous
        </button>
        <button
          onClick={goNext}
          className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold"
        >
          {current === slides.length - 1 ? 'Complete ✓' : 'Next →'}
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-2">
        {current + 1} of {slides.length}
      </p>
    </div>
  );
};
