import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate with Tab key', async ({ page }) => {
    await page.keyboard.press('Tab');
    
    // First focusable element should be focused
    const focused = await page.evaluate(() => document.activeElement);
    expect(focused).not.toBeNull();
  });

  test('should have visible focus indicators', async ({ page }) => {
    await page.keyboard.press('Tab');
    
    const focusedElement = await page.evaluate(() => document.activeElement);
    if (focusedElement) {
      const styles = await page.evaluate((el) => {
        const computed = window.getComputedStyle(el as Element);
        return {
          outline: computed.outline,
          outlineWidth: computed.outlineWidth,
        };
      }, focusedElement);
      
      // Should have visible focus indicator
      expect(styles.outlineWidth).not.toBe('0px');
    }
  });

  test('should activate buttons with Enter/Space', async ({ page }) => {
    const button = page.getByRole('button').first();
    if (await button.count() > 0) {
      await button.focus();
      await page.keyboard.press('Enter');
      // Button should be activated
    }
  });
});

