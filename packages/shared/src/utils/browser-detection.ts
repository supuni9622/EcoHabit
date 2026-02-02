/**
 * Browser detection utilities
 * Detects browser type, version, and feature support
 */

export interface BrowserInfo {
  name: string;
  version: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  supportsWebGL: boolean;
  supportsCSS3D: boolean;
  supportsLocalStorage: boolean;
  supportsSessionStorage: boolean;
  supportsIndexedDB: boolean;
}

/**
 * Detect browser name and version
 */
export const detectBrowser = (): { name: string; version: string } => {
  if (typeof window === 'undefined') {
    return { name: 'unknown', version: '0' };
  }

  const userAgent = navigator.userAgent;
  let name = 'unknown';
  let version = '0';

  // Chrome/Edge (Chromium-based)
  if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) {
    name = 'chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    version = match ? match[1] : '0';
  }
  // Edge (Chromium)
  else if (userAgent.indexOf('Edg') > -1) {
    name = 'edge';
    const match = userAgent.match(/Edg\/(\d+)/);
    version = match ? match[1] : '0';
  }
  // Firefox
  else if (userAgent.indexOf('Firefox') > -1) {
    name = 'firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    version = match ? match[1] : '0';
  }
  // Safari
  else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
    name = 'safari';
    const match = userAgent.match(/Version\/(\d+)/);
    version = match ? match[1] : '0';
  }
  // Internet Explorer (legacy)
  else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
    name = 'ie';
    const match = userAgent.match(/(?:MSIE |rv:)(\d+)/);
    version = match ? match[1] : '0';
  }

  return { name, version };
};

/**
 * Check if browser is mobile
 */
export const isMobileBrowser = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Check if browser is tablet
 */
export const isTabletBrowser = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;
  
  return /ipad|android(?!.*mobile)|tablet/i.test(userAgent) || 
         (width >= 768 && width < 1024);
};

/**
 * Check if browser is desktop
 */
export const isDesktopBrowser = (): boolean => {
  return !isMobileBrowser() && !isTabletBrowser();
};

/**
 * Check feature support
 */
export const checkFeatureSupport = () => {
  if (typeof window === 'undefined') {
    return {
      webGL: false,
      css3D: false,
      localStorage: false,
      sessionStorage: false,
      indexedDB: false,
    };
  }

  // WebGL support
  let webGL = false;
  try {
    const canvas = document.createElement('canvas');
    webGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch (e) {
    webGL = false;
  }

  // CSS3D support
  let css3D = false;
  try {
    const testEl = document.createElement('div');
    css3D = 'transform' in testEl.style || 'webkitTransform' in testEl.style;
  } catch (e) {
    css3D = false;
  }

  // LocalStorage support
  let localStorage = false;
  try {
    localStorage = typeof Storage !== 'undefined' && !!window.localStorage;
    if (localStorage) {
      window.localStorage.setItem('__test__', '1');
      window.localStorage.removeItem('__test__');
    }
  } catch (e) {
    localStorage = false;
  }

  // SessionStorage support
  let sessionStorage = false;
  try {
    sessionStorage = typeof Storage !== 'undefined' && !!window.sessionStorage;
    if (sessionStorage) {
      window.sessionStorage.setItem('__test__', '1');
      window.sessionStorage.removeItem('__test__');
    }
  } catch (e) {
    sessionStorage = false;
  }

  // IndexedDB support
  let indexedDB = false;
  try {
    indexedDB = 'indexedDB' in window && !!window.indexedDB;
  } catch (e) {
    indexedDB = false;
  }

  return {
    webGL,
    css3D,
    localStorage,
    sessionStorage,
    indexedDB,
  };
};

/**
 * Get comprehensive browser information
 */
export const getBrowserInfo = (): BrowserInfo => {
  const { name, version } = detectBrowser();
  const features = checkFeatureSupport();

  return {
    name,
    version,
    isMobile: isMobileBrowser(),
    isTablet: isTabletBrowser(),
    isDesktop: isDesktopBrowser(),
    supportsWebGL: features.webGL,
    supportsCSS3D: features.css3D,
    supportsLocalStorage: features.localStorage,
    supportsSessionStorage: features.sessionStorage,
    supportsIndexedDB: features.indexedDB,
  };
};

/**
 * Check if browser needs fallback (old or unsupported)
 */
export const needsFallback = (): boolean => {
  const browserInfo = getBrowserInfo();
  const features = checkFeatureSupport();

  // IE11 and below need fallback
  if (browserInfo.name === 'ie' && parseInt(browserInfo.version) <= 11) {
    return true;
  }

  // No WebGL and no CSS3D means we need fallback
  if (!features.webGL && !features.css3D) {
    return true;
  }

  return false;
};

