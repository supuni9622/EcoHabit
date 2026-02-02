import { test, expect } from '@playwright/test';
import { measureFPS } from '../e2e/fixtures/test-utils';

test.describe('FPS Monitoring', () => {
  test('should maintain 60fps during animations', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Measure FPS
    const fps = await measureFPS(page, 5000);
    
    // Should be close to 60fps (allow some variance)
    expect(fps).toBeGreaterThan(50);
  });

  test('should adjust quality when FPS drops', async ({ page }) => {
    // Test quality adjustment based on FPS
    // This would need actual 3D scene running
  });
});

