import { test, expect } from '@playwright/test';
import { getPerformanceMetrics } from '../e2e/fixtures/test-utils';

test.describe('Performance - Load Time', () => {
  test('should load page within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have fast First Contentful Paint', async ({ page }) => {
    await page.goto('/');
    
    const metrics = await getPerformanceMetrics(page);
    
    // FCP should be under 1.5 seconds
    expect(metrics.firstContentfulPaint).toBeLessThan(1500);
  });

  test('should load 3D assets efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Wait for any 3D assets to load
    await page.waitForTimeout(2000);
    
    const metrics = await getPerformanceMetrics(page);
    
    // Total load time should be reasonable
    expect(metrics.loadTime).toBeLessThan(5000);
  });

  test('should meet performance budget', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const metrics = await getPerformanceMetrics(page);
    
    // Performance budget checks
    expect(metrics.loadTime).toBeLessThan(3000);
    expect(metrics.domContentLoaded).toBeLessThan(2000);
  });
});

