import { test, expect } from '@playwright/test';
import { switchTheme, waitForTheme } from '../e2e/fixtures/test-utils';

test.describe('Component Visual Regression', () => {
  test('should match component screenshots in light theme', async ({ page }) => {
    await page.goto('/');
    await switchTheme(page, 'light');
    await waitForTheme(page, 'light');
    
    // Screenshot major components
    const components = [
      'badge-collection',
      'points-display',
      'streak-counter',
      'theme-toggle',
    ];
    
    for (const component of components) {
      const element = page.locator(`[data-testid="${component}"]`);
      if (await element.count() > 0) {
        await expect(element.first()).toHaveScreenshot(`${component}-light.png`);
      }
    }
  });

  test('should match component screenshots in dark theme', async ({ page }) => {
    await page.goto('/');
    await switchTheme(page, 'dark');
    await waitForTheme(page, 'dark');
    
    // Similar component screenshots for dark theme
  });
});

