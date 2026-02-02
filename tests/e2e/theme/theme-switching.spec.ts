import { test, expect } from '@playwright/test';
import { switchTheme, waitForTheme } from '../fixtures/test-utils';

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display theme toggle button', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /switch to (dark|light) mode/i });
    await expect(toggle).toBeVisible();
  });

  test('should switch from light to dark theme', async ({ page }) => {
    // Start with light theme
    await waitForTheme(page, 'light');
    
    // Switch to dark
    await switchTheme(page, 'dark');
    
    // Verify dark theme is applied
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    
    // Verify background color changes
    const body = page.locator('body');
    await expect(body).toHaveCSS('background-color', /rgb\(15, 23, 42\)|rgba\(15, 23, 42/); // slate-900
  });

  test('should switch from dark to light theme', async ({ page }) => {
    // Set to dark first
    await switchTheme(page, 'dark');
    await waitForTheme(page, 'dark');
    
    // Switch to light
    await switchTheme(page, 'light');
    
    // Verify light theme is applied
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('should persist theme in localStorage', async ({ page }) => {
    // Switch to dark
    await switchTheme(page, 'dark');
    
    // Check localStorage
    const theme = await page.evaluate(() => localStorage.getItem('ecohabit-theme'));
    expect(theme).toBe('dark');
    
    // Reload page
    await page.reload();
    
    // Theme should persist
    await waitForTheme(page, 'dark');
  });

  test('should detect system preference on first load', async ({ page, context }) => {
    // Set system preference to dark
    await context.emulateMedia({ colorScheme: 'dark' });
    
    // Navigate to page
    await page.goto('/');
    
    // Should respect system preference if no stored theme
    // (This depends on implementation - may need adjustment)
    const storedTheme = await page.evaluate(() => localStorage.getItem('ecohabit-theme'));
    if (!storedTheme) {
      // If no stored theme, should use system preference
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    }
  });

  test('should have smooth theme transition', async ({ page }) => {
    const startTime = Date.now();
    await switchTheme(page, 'dark');
    const transitionTime = Date.now() - startTime;
    
    // Transition should be quick (< 500ms)
    expect(transitionTime).toBeLessThan(500);
  });
});

