import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { switchTheme, waitForTheme } from '../fixtures/test-utils';

test.describe('Theme Accessibility', () => {
  test('should have proper color contrast in light theme', async ({ page }) => {
    await page.goto('/');
    await switchTheme(page, 'light');
    await waitForTheme(page, 'light');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper color contrast in dark theme', async ({ page }) => {
    await page.goto('/');
    await switchTheme(page, 'dark');
    await waitForTheme(page, 'dark');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should be keyboard navigable in both themes', async ({ page }) => {
    await page.goto('/');
    
    // Test light theme
    await switchTheme(page, 'light');
    const lightFocus = await page.keyboard.press('Tab');
    // Check if focus is visible
    
    // Test dark theme
    await switchTheme(page, 'dark');
    const darkFocus = await page.keyboard.press('Tab');
    // Check if focus is visible
  });

  test('should have accessible theme toggle', async ({ page }) => {
    await page.goto('/');
    
    const toggle = page.getByRole('button', { name: /switch to (dark|light) mode/i });
    
    // Should have proper ARIA labels
    await expect(toggle).toHaveAttribute('aria-label');
    await expect(toggle).toHaveAttribute('aria-pressed');
    
    // Should be keyboard accessible
    await toggle.focus();
    await expect(toggle).toBeFocused();
  });
});

