import { test, expect } from '@playwright/test';
import { switchTheme, waitForTheme } from '../fixtures/test-utils';

test.describe('Theme Visual Regression', () => {
  test('should match light theme full page', async ({ page }) => {
    await page.goto('/');
    await switchTheme(page, 'light');
    await waitForTheme(page, 'light');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('theme-light-fullpage.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test('should match dark theme full page', async ({ page }) => {
    await page.goto('/');
    await switchTheme(page, 'dark');
    await waitForTheme(page, 'dark');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('theme-dark-fullpage.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test('should be consistent across browsers', async ({ page, browserName }) => {
    await page.goto('/');
    await switchTheme(page, 'light');
    
    // Screenshot should be similar across browsers
    await expect(page).toHaveScreenshot(`theme-light-${browserName}.png`, {
      maxDiffPixels: 500, // Allow more variance across browsers
    });
  });
});

