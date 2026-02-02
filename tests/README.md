# EcoHabit Testing Documentation

## Overview

This directory contains comprehensive Playwright E2E tests for the EcoHabit application, covering theme system, 3D animations, fallbacks, performance, and accessibility.

## Test Structure

```
tests/
├── e2e/              # End-to-end tests
│   ├── fixtures/     # Test utilities and setup
│   ├── theme/        # Theme system tests
│   ├── 3d/           # 3D capability and fallback tests
│   ├── animations/   # Animation tests
│   ├── components/   # Component integration tests
│   └── accessibility/ # Accessibility tests
├── visual/           # Visual regression tests
└── performance/      # Performance benchmarks
```

## Running Tests

### All Tests
```bash
pnpm test:e2e
```

### Specific Test Suites
```bash
# Theme tests
pnpm test:theme

# 3D tests
pnpm test:3d

# Visual regression
pnpm test:visual

# Performance tests
pnpm test:performance

# Accessibility tests
pnpm test:accessibility
```

### Interactive Mode
```bash
pnpm test:e2e:ui
```

### Debug Mode
```bash
pnpm test:e2e:debug
```

## Test Coverage

- **Theme System**: Switching, persistence, visual regression
- **3D Capabilities**: WebGL detection, fallbacks, performance
- **Animations**: Lottie, CSS3, performance monitoring
- **Components**: Badge collection, points display, streak counter
- **Accessibility**: WCAG compliance, keyboard navigation, screen readers
- **Performance**: Load times, FPS monitoring, memory usage
- **Visual Regression**: Theme comparisons, 3D vs fallback

## Browser Support

Tests run on:
- Chromium (Chrome, Edge)
- Firefox
- WebKit (Safari)
- Mobile browsers (Chrome Mobile, Safari Mobile)

## CI/CD Integration

Tests are automatically run in CI/CD pipeline on:
- Every pull request
- Main branch commits
- Scheduled visual regression checks

## Writing New Tests

See `tests/e2e/fixtures/test-utils.ts` for helper functions.

Example:
```typescript
import { test, expect } from '@playwright/test';
import { switchTheme } from '../fixtures/test-utils';

test('my test', async ({ page }) => {
  await page.goto('/');
  await switchTheme(page, 'dark');
  // ... test code
});
```

