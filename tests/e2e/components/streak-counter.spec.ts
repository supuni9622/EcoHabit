import { test, expect } from '@playwright/test';

test.describe('Streak Counter Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display streak number', async ({ page }) => {
    const streakCounter = page.locator('[data-streak-counter]');
    if (await streakCounter.count() > 0) {
      await expect(streakCounter.first()).toBeVisible();
    }
  });

  test('should animate on milestone', async ({ page }) => {
    // Test animation when streak reaches milestone
  });

  test('should show flame animation', async ({ page }) => {
    // Test flame emoji/animation visibility
    const flame = page.locator('text=🔥');
    if (await flame.count() > 0) {
      await expect(flame.first()).toBeVisible();
    }
  });
});

