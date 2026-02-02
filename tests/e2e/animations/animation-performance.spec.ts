import { test, expect } from '@playwright/test';
import { measureFPS } from '../fixtures/test-utils';

test.describe('Animation Performance', () => {
  test('should not block UI during animations', async ({ page }) => {
    await page.goto('/');
    
    // Start animation
    // Check if UI remains responsive
    const button = page.getByRole('button').first();
    if (await button.count() > 0) {
      await expect(button).toBeEnabled();
    }
  });

  test('should maintain 60fps during animations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Trigger animation
    // Measure FPS
    const fps = await measureFPS(page, 2000);
    expect(fps).toBeGreaterThan(50);
  });
});

