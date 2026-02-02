'use client';

import React, { Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { getOptimalRenderStrategy, shouldUse3D, getCapabilityInfo } from '@ecohabit/shared';
import { Fallback2D } from './Fallback2D';
import { cn } from '../../lib/utils';

export interface ThreeSceneProps {
  children: React.ReactNode;
  className?: string;
  fallback?: React.ReactNode;
  enable3D?: boolean;
  performanceMode?: 'high' | 'medium' | 'low';
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
  onError?: (error: Error) => void;
}

/**
 * ThreeScene wrapper component
 * Automatically falls back to 2D if WebGL is unavailable
 */
export const ThreeScene: React.FC<ThreeSceneProps> = ({
  children,
  className,
  fallback,
  enable3D,
  performanceMode,
  onLoadStart,
  onLoadComplete,
  onError,
}) => {
  const [capabilities, setCapabilities] = useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    return getCapabilityInfo();
  });

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !capabilities) {
      setCapabilities(getCapabilityInfo());
    }
  }, [capabilities]);

  const shouldRender3D = useMemo(() => {
    if (enable3D === false) return false;
    if (enable3D === true) return true;
    return shouldUse3D();
  }, [enable3D]);

  const renderStrategy = useMemo(() => {
    return getOptimalRenderStrategy();
  }, []);

  useEffect(() => {
    if (onLoadStart) {
      onLoadStart();
    }
    setIsLoading(true);
    
    // Simulate loading time for 3D assets
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (onLoadComplete) {
        onLoadComplete();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [onLoadStart, onLoadComplete]);

  // Error boundary
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      setHasError(true);
      if (onError) {
        onError(new Error(error.message));
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [onError]);

  // If 3D is not supported or disabled, show fallback
  if (!shouldRender3D || renderStrategy !== 'threejs' || hasError) {
    return (
      <div className={cn('w-full h-full', className)}>
        {fallback || <Fallback2D>{children}</Fallback2D>}
      </div>
    );
  }

  // Configure performance settings based on mode
  const performanceSettings = useMemo(() => {
    const tier = capabilities?.performanceTier || 'medium';
    const mode = performanceMode || tier;

    switch (mode) {
      case 'high':
        return {
          dpr: [1, 2],
          shadows: true,
          antialias: true,
          powerPreference: 'high-performance' as const,
        };
      case 'medium':
        return {
          dpr: [1, 1.5],
          shadows: false,
          antialias: true,
          powerPreference: 'default' as const,
        };
      case 'low':
        return {
          dpr: 1,
          shadows: false,
          antialias: false,
          powerPreference: 'low-power' as const,
        };
    }
  }, [performanceMode, capabilities]);

  return (
    <div className={cn('w-full h-full relative', className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      )}
      <Canvas
        gl={{
          antialias: performanceSettings.antialias,
          powerPreference: performanceSettings.powerPreference,
          alpha: false,
          stencil: false,
          depth: true,
        }}
        dpr={performanceSettings.dpr}
        shadows={performanceSettings.shadows}
        camera={{ position: [0, 0, 5], fov: 50 }}
        onCreated={(state) => {
          // Optimize renderer
          state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          state.gl.shadowMap.enabled = performanceSettings.shadows;
        }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
};

