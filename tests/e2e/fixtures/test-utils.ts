import { Page, expect } from '@playwright/test';

/**
 * Test utilities for common operations
 */

/**
 * Wait for theme to be applied
 */
export const waitForTheme = async (page: Page, theme: 'light' | 'dark') => {
  await page.waitForFunction(
    (expectedTheme) => {
      return document.documentElement.getAttribute('data-theme') === expectedTheme;
    },
    theme
  );
};

/**
 * Switch theme
 */
export const switchTheme = async (page: Page, theme: 'light' | 'dark') => {
  const toggle = page.getByRole('button', { name: new RegExp(`Switch to ${theme}`, 'i') });
  await toggle.click();
  await waitForTheme(page, theme);
};

/**
 * Check if WebGL is supported
 */
export const checkWebGLSupport = async (page: Page): Promise<boolean> => {
  return await page.evaluate(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  });
};

/**
 * Mock WebGL support
 */
export const mockWebGL = async (page: Page, supported: boolean) => {
  await page.addInitScript((supported) => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (contextId: string) {
      if (contextId === 'webgl' || contextId === 'experimental-webgl') {
        return supported ? originalGetContext.call(this, contextId) : null;
      }
      return originalGetContext.call(this, contextId);
    };
  }, supported);
};

/**
 * Get performance metrics
 */
export const getPerformanceMetrics = async (page: Page) => {
  return await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      loadTime: perfData.loadEventEnd - perfData.fetchStart,
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
      firstPaint: performance.getEntriesByType('paint').find((entry) => entry.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: performance.getEntriesByType('paint').find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0,
    };
  });
};

/**
 * Measure FPS
 */
export const measureFPS = async (page: Page, duration: number = 5000): Promise<number> => {
  return await page.evaluate(async (duration) => {
    let frames = 0;
    let lastTime = performance.now();
    
    return new Promise<number>((resolve) => {
      const measure = (currentTime: number) => {
        frames++;
        const delta = currentTime - lastTime;
        
        if (delta >= duration) {
          resolve((frames * 1000) / delta);
        } else {
          lastTime = currentTime;
          requestAnimationFrame(measure);
        }
      };
      
      requestAnimationFrame(measure);
    });
  }, duration);
};

/**
 * Take theme-aware screenshot
 */
export const takeThemeScreenshot = async (
  page: Page,
  name: string,
  theme: 'light' | 'dark'
) => {
  await switchTheme(page, theme);
  await page.waitForTimeout(300); // Wait for theme transition
  await page.screenshot({ path: `test-results/${name}-${theme}.png`, fullPage: true });
};

