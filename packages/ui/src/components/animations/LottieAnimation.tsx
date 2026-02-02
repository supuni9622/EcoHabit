'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(
  () => import('lottie-react').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center">Loading...</div>,
  }
);

export interface LottieAnimationProps {
  animationData: any; // Lottie JSON data
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  onLoopComplete?: () => void;
}

/**
 * LottieAnimation component
 * Wrapper for Lottie animations with performance optimization
 */
export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  loop = true,
  autoplay = true,
  speed = 1,
  className,
  onComplete,
  onLoopComplete,
}) => {
  const lottieRef = React.useRef<any>(null);

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const handleLoopComplete = () => {
    if (onLoopComplete) {
      onLoopComplete();
    }
  };

  if (!animationData) {
    return (
      <div className={className}>
        <div className="w-full h-full flex items-center justify-center text-foreground-muted">
          Animation not available
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className={className}>Loading animation...</div>}>
      <div className={className}>
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={loop}
          autoplay={autoplay}
          speed={speed}
          onComplete={handleComplete}
          onLoopComplete={handleLoopComplete}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    </Suspense>
  );
};

/**
 * Pre-defined eco-themed Lottie animations
 */
export const EcoAnimations = {
  AchievementUnlock: (props: Omit<LottieAnimationProps, 'animationData'>) => {
    // In production, load from /animations/achievement-unlock.json
    return <LottieAnimation {...props} animationData={null} />;
  },
  PointsEarned: (props: Omit<LottieAnimationProps, 'animationData'>) => {
    // In production, load from /animations/points-earned.json
    return <LottieAnimation {...props} animationData={null} />;
  },
  StreakMilestone: (props: Omit<LottieAnimationProps, 'animationData'>) => {
    // In production, load from /animations/streak-milestone.json
    return <LottieAnimation {...props} animationData={null} />;
  },
  LessonComplete: (props: Omit<LottieAnimationProps, 'animationData'>) => {
    // In production, load from /animations/lesson-complete.json
    return <LottieAnimation {...props} animationData={null} />;
  },
};

