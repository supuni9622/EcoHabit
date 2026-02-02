/**
 * Capability detection utilities
 * Detects WebGL support, performance tier, device type, and browser features
 */

export type PerformanceTier = 'high' | 'medium' | 'low';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type RenderStrategy = 'threejs' | 'css3d' | 'lottie' | 'fallback';

interface CapabilityInfo {
  webglSupported: boolean;
  webgl2Supported: boolean;
  performanceTier: PerformanceTier;
  deviceType: DeviceType;
  renderStrategy: RenderStrategy;
  css3DSupported: boolean;
  hardwareAcceleration: boolean;
}

/**
 * Detect WebGL support (1.0 and 2.0)
 */
export const detectWebGLSupport = (): { webgl1: boolean; webgl2: boolean } => {
  if (typeof window === 'undefined') {
    return { webgl1: false, webgl2: false };
  }

  try {
    const canvas = document.createElement('canvas');
    const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const gl2 = canvas.getContext('webgl2');

    return {
      webgl1: !!gl1,
      webgl2: !!gl2,
    };
  } catch (e) {
    return { webgl1: false, webgl2: false };
  }
};

/**
 * Determine device performance tier
 * Based on hardware concurrency, device memory, and other factors
 */
export const getPerformanceTier = (): PerformanceTier => {
  if (typeof window === 'undefined') {
    return 'medium';
  }

  const navigator = window.navigator as any;
  
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;
  
  // Check device memory (if available)
  const deviceMemory = navigator.deviceMemory || 4; // GB
  
  // Check if on mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  // Performance scoring
  let score = 0;
  
  // CPU cores (higher is better)
  if (cores >= 8) score += 3;
  else if (cores >= 4) score += 2;
  else if (cores >= 2) score += 1;
  
  // Device memory (higher is better)
  if (deviceMemory >= 8) score += 3;
  else if (deviceMemory >= 4) score += 2;
  else if (deviceMemory >= 2) score += 1;
  
  // Mobile penalty (mobile devices generally have less powerful GPUs)
  if (isMobile) score -= 1;
  
  // Determine tier
  if (score >= 5) return 'high';
  if (score >= 2) return 'medium';
  return 'low';
};

/**
 * Detect device type
 */
export const getDeviceType = (): DeviceType => {
  if (typeof window === 'undefined') {
    return 'desktop';
  }

  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Check for mobile devices
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent
  );
  
  // Check for tablet
  const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent) || 
                   (width >= 768 && width < 1024);
  
  if (isMobile && !isTablet) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
};

/**
 * Check if CSS3 3D transforms are supported
 */
export const detectCSS3DSupport = (): boolean => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  try {
    const testEl = document.createElement('div');
    const style = testEl.style;
    
    // Test for 3D transform support
    const properties = [
      'transform',
      'perspective',
      'transformStyle',
      'backfaceVisibility',
    ];
    
    return properties.every((prop) => {
      return prop in style || 
             `webkit${prop.charAt(0).toUpperCase() + prop.slice(1)}` in style ||
             `moz${prop.charAt(0).toUpperCase() + prop.slice(1)}` in style ||
             `ms${prop.charAt(0).toUpperCase() + prop.slice(1)}` in style;
    });
  } catch (e) {
    return false;
  }
};

/**
 * Check if hardware acceleration is available
 */
export const detectHardwareAcceleration = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return false;
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      // Check if GPU is not software-rendered
      return !renderer.toLowerCase().includes('software') && 
             !renderer.toLowerCase().includes('llvmpipe');
    }
    
    return true; // Assume hardware acceleration if we can't detect
  } catch (e) {
    return false;
  }
};

/**
 * Determine if 3D should be used
 */
export const shouldUse3D = (): boolean => {
  const { webgl1 } = detectWebGLSupport();
  const performanceTier = getPerformanceTier();
  const hardwareAccel = detectHardwareAcceleration();
  
  // Require WebGL, at least medium performance, and hardware acceleration
  return webgl1 && performanceTier !== 'low' && hardwareAccel;
};

/**
 * Get optimal render strategy based on capabilities
 */
export const getOptimalRenderStrategy = (): RenderStrategy => {
  const { webgl1, webgl2 } = detectWebGLSupport();
  const performanceTier = getPerformanceTier();
  const hardwareAccel = detectHardwareAcceleration();
  const css3DSupported = detectCSS3DSupport();
  
  // Priority: Three.js > CSS3D > Lottie > Fallback
  
  // Use Three.js if WebGL is available and performance is adequate
  if (webgl1 && performanceTier !== 'low' && hardwareAccel) {
    return 'threejs';
  }
  
  // Use CSS3D if supported (better than Lottie for simple 3D effects)
  if (css3DSupported) {
    return 'css3d';
  }
  
  // Use Lottie for animations (lightweight, works everywhere)
  return 'lottie';
  
  // Fallback is returned if none of the above conditions are met
  // (though Lottie should always be available)
};

/**
 * Get comprehensive capability information
 */
export const getCapabilityInfo = (): CapabilityInfo => {
  const { webgl1, webgl2 } = detectWebGLSupport();
  const performanceTier = getPerformanceTier();
  const deviceType = getDeviceType();
  const renderStrategy = getOptimalRenderStrategy();
  const css3DSupported = detectCSS3DSupport();
  const hardwareAccel = detectHardwareAcceleration();
  
  return {
    webglSupported: webgl1,
    webgl2Supported: webgl2,
    performanceTier,
    deviceType,
    renderStrategy,
    css3DSupported,
    hardwareAcceleration: hardwareAccel,
  };
};

