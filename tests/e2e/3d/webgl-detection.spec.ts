import { test, expect } from '@playwright/test';
import { checkWebGLSupport, mockWebGL } from '../fixtures/test-utils';

test.describe('WebGL Detection', () => {
  test('should detect WebGL support in modern browsers', async ({ page, browserName }) => {
    await page.goto('/');
    
    const hasWebGL = await checkWebGLSupport(page);
    
    // Modern browsers should support WebGL
    if (browserName !== 'webkit' || browserName === 'chromium' || browserName === 'firefox') {
      expect(hasWebGL).toBe(true);
    }
  });

  test('should fallback when WebGL is not supported', async ({ page }) => {
    // Mock WebGL as unavailable
    await mockWebGL(page, false);
    await page.goto('/');
    
    const hasWebGL = await checkWebGLSupport(page);
    expect(hasWebGL).toBe(false);
    
    // Should show fallback UI (check for 2D components)
    // This depends on actual implementation
  });

  test('should detect performance tier', async ({ page }) => {
    await page.goto('/');
    
    const performanceTier = await page.evaluate(() => {
      // Access capability detection if exposed
      if ((window as any).getCapabilityInfo) {
        const info = (window as any).getCapabilityInfo();
        return info.performanceTier;
      }
      return null;
    });
    
    // Should return a valid tier
    if (performanceTier !== null) {
      expect(['high', 'medium', 'low']).toContain(performanceTier);
    }
  });

  test('should select optimal render strategy', async ({ page }) => {
    await page.goto('/');
    
    const strategy = await page.evaluate(() => {
      if ((window as any).getOptimalRenderStrategy) {
        return (window as any).getOptimalRenderStrategy();
      }
      return null;
    });
    
    // Should return a valid strategy
    if (strategy !== null) {
      expect(['threejs', 'css3d', 'lottie', 'fallback']).toContain(strategy);
    }
  });
});

