/**
 * Theme-related constants
 */

export const THEME_STORAGE_KEY = 'ecohabit-theme';
export const THEME_ATTRIBUTE = 'data-theme';

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
  themeTransition: 200,
} as const;

export const TRANSITION_TIMINGS = {
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

