import React from 'react';
import { getOptimalRenderStrategy, RenderStrategy } from '@ecohabit/shared';
import { ThreeScene } from '../3d/ThreeScene';
import { Fallback2D } from '../3d/Fallback2D';
import { CSS3Animations } from '../animations/CSS3Animations';
import { LottieAnimation } from '../animations/LottieAnimation';

export interface ProgressiveEnhancementProps {
  children: React.ReactNode;
  strategy?: RenderStrategy;
  className?: string;
  lottieData?: any;
  css3Animation?: 'flip' | 'hover3d' | 'parallax' | 'reveal' | 'particle';
}

/**
 * ProgressiveEnhancement component
 * Automatically selects the best rendering strategy based on capabilities
 * Falls back gracefully through: Three.js -> CSS3D -> Lottie -> Static
 */
export const ProgressiveEnhancement: React.FC<ProgressiveEnhancementProps> = ({
  children,
  strategy,
  className,
  lottieData,
  css3Animation = 'hover3d',
}) => {
  const renderStrategy = strategy || getOptimalRenderStrategy();

  switch (renderStrategy) {
    case 'threejs':
      return (
        <ThreeScene className={className}>
          {children}
        </ThreeScene>
      );

    case 'css3d':
      return (
        <CSS3Animations animation={css3Animation} className={className}>
          {children}
        </CSS3Animations>
      );

    case 'lottie':
      if (lottieData) {
        return (
          <LottieAnimation
            animationData={lottieData}
            className={className}
            loop={true}
            autoplay={true}
          />
        );
      }
      // Fall through to static if no Lottie data

    case 'fallback':
    default:
      return (
        <Fallback2D className={className}>
          {children}
        </Fallback2D>
      );
  }
};

