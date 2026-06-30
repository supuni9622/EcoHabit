import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
    environment: 'node',
    testTimeout: 15000, // emulator startup needs headroom
    include: ['**/*.test.ts'],
  },
});
