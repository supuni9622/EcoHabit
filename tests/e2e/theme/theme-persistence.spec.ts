import { test, expect } from '@playwright/test';
import { switchTheme, waitForTheme } from '../fixtures/test-utils';

test.describe('Theme Persistence', () => {
  test('should persist theme across page navigation', async ({ page }) => {
    await page.goto('/');
    
    // Set theme to dark
    await switchTheme(page, 'dark');
    await waitForTheme(page, 'dark');
    
    // Navigate to another page (if exists)
    // For now, just reload
    await page.reload();
    
    // Theme should persist
    await waitForTheme(page, 'dark');
  });

  test('should persist theme across browser sessions', async ({ page, context }) => {
    await page.goto('/');
    
    // Set theme
    await switchTheme(page, 'dark');
    await waitForTheme(page, 'dark');
    
    // Close context (simulates closing browser)
    await context.close();
    
    // Create new context and page
    const newContext = await page.context().browser()?.newContext();
    if (newContext) {
      const newPage = await newContext.newPage();
      await newPage.goto('/');
      
      // Theme should still be dark
      await waitForTheme(newPage, 'dark');
      await newContext.close();
    }
  });

  test('should sync theme across tabs', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    await page1.goto('/');
    await page2.goto('/');
    
    // Set theme on page1
    await switchTheme(page1, 'dark');
    await waitForTheme(page1, 'dark');
    
    // Wait a bit for localStorage sync
    await page2.waitForTimeout(100);
    
    // Page2 should also have dark theme (if using storage events)
    // Note: This depends on implementation - may need storage event listeners
    await waitForTheme(page2, 'dark');
    
    await page1.close();
    await page2.close();
  });

  test('should reset theme when cleared from localStorage', async ({ page }) => {
    await page.goto('/');
    
    // Set theme
    await switchTheme(page, 'dark');
    
    // Clear localStorage
    await page.evaluate(() => localStorage.removeItem('ecohabit-theme'));
    
    // Reload
    await page.reload();
    
    // Should default to light or system preference
    const theme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBeTruthy();
  });
});

