import { useState, useEffect, useCallback } from 'react';
import { PerformanceTier, getPerformanceTier, getCapabilityInfo } from '@ecohabit/shared';

export interface OptimizationState {
  quality: 'high' | 'medium' | 'low';
  fps: number;
  lodLevel: number;
  enabled: boolean;
}

/**
 * Hook for 3D optimization
 * Dynamically adjusts quality based on FPS and device capabilities
 */
export const use3DOptimization = (targetFPS: number = 60) => {
  const [state, setState] = useState<OptimizationState>(() => {
    const capabilities = getCapabilityInfo();
    const tier = capabilities.performanceTier;
    
    return {
      quality: tier === 'high' ? 'high' : tier === 'medium' ? 'medium' : 'low',
      fps: targetFPS,
      lodLevel: tier === 'high' ? 0 : tier === 'medium' ? 1 : 2,
      enabled: true,
    };
  });

  const [fpsHistory, setFpsHistory] = useState<number[]>([]);
  const [lastFrameTime, setLastFrameTime] = useState<number>(0);

  // Monitor FPS
  const measureFPS = useCallback(() => {
    const now = performance.now();
    if (lastFrameTime > 0) {
      const delta = now - lastFrameTime;
      const fps = 1000 / delta;
      
      setFpsHistory((prev) => {
        const newHistory = [...prev, fps].slice(-60); // Keep last 60 frames
        return newHistory;
      });
    }
    setLastFrameTime(now);
    requestAnimationFrame(measureFPS);
  }, [lastFrameTime]);

  useEffect(() => {
    if (state.enabled) {
      const frameId = requestAnimationFrame(measureFPS);
      return () => cancelAnimationFrame(frameId);
    }
  }, [state.enabled, measureFPS]);

  // Adjust quality based on FPS
  useEffect(() => {
    if (fpsHistory.length < 30) return; // Wait for enough samples

    const avgFPS = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;
    const minFPS = Math.min(...fpsHistory);

    setState((prev) => {
      let newQuality = prev.quality;
      let newLodLevel = prev.lodLevel;

      // If FPS is consistently low, reduce quality
      if (avgFPS < targetFPS * 0.7 || minFPS < targetFPS * 0.5) {
        if (prev.quality === 'high') {
          newQuality = 'medium';
          newLodLevel = 1;
        } else if (prev.quality === 'medium') {
          newQuality = 'low';
          newLodLevel = 2;
        }
      }
      // If FPS is consistently high, increase quality
      else if (avgFPS > targetFPS * 0.9 && minFPS > targetFPS * 0.8) {
        if (prev.quality === 'low') {
          newQuality = 'medium';
          newLodLevel = 1;
        } else if (prev.quality === 'medium') {
          newQuality = 'high';
          newLodLevel = 0;
        }
      }

      return {
        ...prev,
        quality: newQuality,
        fps: avgFPS,
        lodLevel: newLodLevel,
      };
    });
  }, [fpsHistory, targetFPS]);

  const setQuality = useCallback((quality: 'high' | 'medium' | 'low') => {
    setState((prev) => ({
      ...prev,
      quality,
      lodLevel: quality === 'high' ? 0 : quality === 'medium' ? 1 : 2,
    }));
  }, []);

  const reset = useCallback(() => {
    const capabilities = getCapabilityInfo();
    const tier = capabilities.performanceTier;
    
    setState({
      quality: tier === 'high' ? 'high' : tier === 'medium' ? 'medium' : 'low',
      fps: targetFPS,
      lodLevel: tier === 'high' ? 0 : tier === 'medium' ? 1 : 2,
      enabled: true,
    });
    setFpsHistory([]);
  }, [targetFPS]);

  return {
    ...state,
    setQuality,
    reset,
    avgFPS: fpsHistory.length > 0
      ? fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length
      : targetFPS,
  };
};

