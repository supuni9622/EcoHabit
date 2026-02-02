import { test, expect } from '@playwright/test';
import { measureFPS, getPerformanceMetrics } from '../fixtures/test-utils';

test.describe('3D Performance', () => {
  test('should load 3D scene within timeout', async ({ page }) => {
    await page.goto('/');
    
    // Wait for 3D scene to load
    const loadTime = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const start = performance.now();
        const checkLoad = () => {
          const canvas = document.querySelector('canvas');
          if (canvas) {
            resolve(performance.now() - start);
          } else {
            setTimeout(checkLoad, 100);
          }
        };
        checkLoad();
      });
    });
    
    expect(loadTime).toBeLessThan(10000); // 10 seconds max
  });

  test('should maintain good FPS', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const fps = await measureFPS(page, 3000);
    expect(fps).toBeGreaterThan(30); // At least 30fps
  });

  test('should adjust quality based on performance', async ({ page }) => {
    // Test quality adjustment
    // This would need actual performance monitoring
  });
});

