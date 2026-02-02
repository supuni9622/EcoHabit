import { useState, useEffect } from 'react';
import { BatteryLevel, BatteryState } from 'expo-battery';
import * as Device from 'expo-device';
import { getCapabilityInfo, PerformanceTier } from '@ecohabit/shared';
import { mobile3DConfig } from '../lib/3d-config';

export interface Mobile3DState {
  quality: 'high' | 'medium' | 'low';
  enabled: boolean;
  batteryLevel?: number;
  batteryState?: BatteryState;
  thermalState?: Device.ThermalState;
  shouldReduceQuality: boolean;
}

/**
 * Hook for mobile 3D optimization
 * Monitors battery level and thermal state to adjust quality
 */
export const useMobile3D = () => {
  const capabilities = getCapabilityInfo();
  const [state, setState] = useState<Mobile3DState>(() => {
    const initialTier = capabilities.performanceTier;
    return {
      quality:
        initialTier === 'high' ? 'high' : initialTier === 'medium' ? 'medium' : 'low',
      enabled: capabilities.webglSupported && initialTier !== 'low',
      shouldReduceQuality: false,
    };
  });

  // Monitor battery level
  useEffect(() => {
    if (!Device.isDevice) return;

    const checkBattery = async () => {
      try {
        const batteryLevel = await BatteryLevel.getBatteryLevelAsync();
        const batteryState = await BatteryState.getBatteryStateAsync();
        
        setState((prev) => ({
          ...prev,
          batteryLevel,
          batteryState,
          shouldReduceQuality:
            batteryLevel < mobile3DConfig.battery.lowBatteryThreshold / 100 ||
            batteryState === BatteryState.UNPLUGGED,
        }));
      } catch (error) {
        console.warn('Failed to get battery info:', error);
      }
    };

    checkBattery();
    const interval = setInterval(checkBattery, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Monitor thermal state
  useEffect(() => {
    if (!Device.isDevice) return;

    const checkThermal = async () => {
      try {
        const thermalState = await Device.getThermalStateAsync();
        
        setState((prev) => ({
          ...prev,
          thermalState,
          shouldReduceQuality:
            prev.shouldReduceQuality ||
            thermalState >= Device.ThermalState.CRITICAL,
        }));
      } catch (error) {
        console.warn('Failed to get thermal state:', error);
      }
    };

    checkThermal();
    const interval = setInterval(checkThermal, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Auto-reduce quality if needed
  useEffect(() => {
    if (
      mobile3DConfig.battery.autoReduceQuality &&
      state.shouldReduceQuality &&
      state.quality !== 'low'
    ) {
      setState((prev) => ({
        ...prev,
        quality: prev.quality === 'high' ? 'medium' : 'low',
      }));
    }
  }, [state.shouldReduceQuality, state.quality]);

  const setQuality = (quality: 'high' | 'medium' | 'low') => {
    setState((prev) => ({ ...prev, quality }));
  };

  const disable = () => {
    setState((prev) => ({ ...prev, enabled: false }));
  };

  const enable = () => {
    setState((prev) => ({ ...prev, enabled: true }));
  };

  return {
    ...state,
    setQuality,
    disable,
    enable,
    config: mobile3DConfig.performance[state.quality],
  };
};

