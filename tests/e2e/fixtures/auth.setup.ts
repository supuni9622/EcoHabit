import { test as setup, expect } from '@playwright/test';

/**
 * Authentication setup for tests
 * Creates test user and sets up session
 */

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Navigate to login page
  await page.goto('/');
  
  // For now, skip actual authentication setup
  // This will be implemented when auth is ready
  // TODO: Implement actual authentication flow
  
  // Save signed-in state
  await page.context().storageState({ path: authFile });
});

