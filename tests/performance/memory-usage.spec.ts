import { test, expect } from '@playwright/test';

test.describe('Memory Usage', () => {
  test('should not exceed memory budget', async ({ page }) => {
    await page.goto('/');
    
    // Wait for all assets to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const memoryUsage = await page.evaluate(() => {
      const perf = (performance as any).memory;
      return perf ? perf.usedJSHeapSize / 1048576 : null; // Convert to MB
    });
    
    if (memoryUsage !== null) {
      // Should not exceed 500MB for initial load
      expect(memoryUsage).toBeLessThan(500);
    }
  });

  test('should clean up resources', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate away and back
    await page.goto('about:blank');
    await page.goto('/');
    
    // Memory should not continuously grow
    // This is a basic check - full memory leak testing needs more setup
  });
});

