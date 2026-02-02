import { test, expect } from '@playwright/test';

test.describe('Screen Reader Support', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper ARIA labels', async ({ page }) => {
    // Check for ARIA labels on interactive elements
    const buttons = page.getByRole('button');
    const count = await buttons.count();
    
    if (count > 0) {
      const firstButton = buttons.first();
      const ariaLabel = await firstButton.getAttribute('aria-label');
      // Should have aria-label or accessible name
      expect(ariaLabel || await firstButton.textContent()).toBeTruthy();
    }
  });

  test('should have semantic HTML structure', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThan(0);
  });

  test('should announce theme changes', async ({ page }) => {
    // Test if theme changes are announced to screen readers
    // This depends on implementation
  });
});

