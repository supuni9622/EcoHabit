import React from 'react';
import { cn } from '../../lib/utils';

export interface CSS3AnimationsProps {
  children: React.ReactNode;
  animation?: 'flip' | 'hover3d' | 'parallax' | 'reveal' | 'particle';
  className?: string;
}

/**
 * CSS3Animations component
 * Hardware-accelerated 3D transforms for simple animations
 * Fallback for browsers without WebGL
 */
export const CSS3Animations: React.FC<CSS3AnimationsProps> = ({
  children,
  animation = 'hover3d',
  className,
}) => {
  const animationClasses = {
    flip: 'transform-gpu transition-transform duration-300 hover:rotate-y-180',
    hover3d: 'transform-gpu transition-transform duration-300 hover:scale-105 hover:rotate-y-2',
    parallax: 'transform-gpu transition-transform duration-500',
    reveal: 'transform-gpu transition-all duration-500 opacity-0 translate-y-4 animate-fade-in',
    particle: 'transform-gpu animate-pulse',
  };

  return (
    <div
      className={cn(
        'transform-gpu will-change-transform',
        animationClasses[animation],
        className
      )}
      style={{
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        perspective: '1000px',
      }}
    >
      {children}
    </div>
  );
};

/**
 * Card flip effect using CSS3
 */
export const CardFlip: React.FC<{
  front: React.ReactNode;
  back: React.ReactNode;
  flipped?: boolean;
  className?: string;
}> = ({ front, back, flipped = false, className }) => {
  return (
    <div
      className={cn(
        'relative w-full h-full',
        'transform-gpu transition-transform duration-500',
        'transform-style-preserve-3d',
        flipped && 'rotate-y-180',
        className
      )}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="absolute inset-0 backface-hidden"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(0deg)',
        }}
      >
        {front}
      </div>
      <div
        className="absolute inset-0 backface-hidden"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}
      >
        {back}
      </div>
    </div>
  );
};

/**
 * Parallax effect using CSS3 transforms
 */
export const ParallaxContainer: React.FC<{
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}> = ({ children, intensity = 0.5, className }) => {
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * intensity;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * intensity;
    setOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="transform-gpu transition-transform duration-300"
        style={{
          transform: `translate3d(${offset.x * 20}px, ${offset.y * 20}px, 0)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

