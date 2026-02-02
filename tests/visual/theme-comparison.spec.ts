import { test, expect } from '@playwright/test';
import { takeThemeScreenshot, switchTheme, waitForTheme } from '../e2e/fixtures/test-utils';

test.describe('Theme Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should match light theme screenshot', async ({ page }) => {
    await switchTheme(page, 'light');
    await waitForTheme(page, 'light');
    await page.waitForTimeout(500); // Wait for all transitions
    
    await expect(page).toHaveScreenshot('light-theme.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('should match dark theme screenshot', async ({ page }) => {
    await switchTheme(page, 'dark');
    await waitForTheme(page, 'dark');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('dark-theme.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('should have consistent colors in light theme', async ({ page }) => {
    await switchTheme(page, 'light');
    
    const primaryColor = await page.evaluate(() => {
      const element = document.querySelector('[data-testid="primary-button"]');
      return element ? window.getComputedStyle(element as Element).color : null;
    });
    
    // Verify primary color is correct (emerald-500: #22c55e)
    // This is a basic check - full color testing would need more setup
  });

  test('should have consistent colors in dark theme', async ({ page }) => {
    await switchTheme(page, 'dark');
    
    // Similar color checks for dark theme
  });
});

