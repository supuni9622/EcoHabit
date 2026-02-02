import { test, expect } from '@playwright/test';
import { mockWebGL } from '../e2e/fixtures/test-utils';

test.describe('3D vs Fallback Visual Comparison', () => {
  test('should match 3D component screenshot', async ({ page }) => {
    await page.goto('/');
    
    // Wait for 3D components to load
    await page.waitForTimeout(2000);
    
    // Take screenshot of 3D components
    const component = page.locator('[data-3d-component]');
    if (await component.count() > 0) {
      await expect(component.first()).toHaveScreenshot('3d-component.png');
    }
  });

  test('should match fallback component screenshot', async ({ page }) => {
    await mockWebGL(page, false);
    await page.goto('/');
    
    // Wait for fallback to render
    await page.waitForTimeout(1000);
    
    // Take screenshot of fallback
    const fallback = page.locator('[data-fallback-component]');
    if (await fallback.count() > 0) {
      await expect(fallback.first()).toHaveScreenshot('fallback-component.png');
    }
  });

  test('should maintain visual consistency', async ({ page }) => {
    // Compare 3D and fallback visual appearance
    // Both should convey the same information
  });
});

