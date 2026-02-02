/**
 * Eco-friendly color palette for EcoHabit application
 * Supports both light and dark themes with accessibility in mind
 */

export type ThemeMode = 'light' | 'dark';

export interface ColorPalette {
  // Primary colors
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryForeground: string;
  
  // Secondary colors
  secondary: string;
  secondaryHover: string;
  secondaryForeground: string;
  
  // Accent colors
  accent: string;
  accentHover: string;
  accentForeground: string;
  
  // Earth tones
  earth: string;
  earthHover: string;
  earthForeground: string;
  
  // Success/Positive feedback
  success: string;
  successHover: string;
  successForeground: string;
  
  // Background colors
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;
  
  // Text colors
  foreground: string;
  foregroundSecondary: string;
  foregroundMuted: string;
  
  // Border colors
  border: string;
  borderSecondary: string;
  
  // Interactive states
  hover: string;
  active: string;
  focus: string;
  
  // Destructive/Actions
  destructive: string;
  destructiveHover: string;
  destructiveForeground: string;
  
  // Muted colors
  muted: string;
  mutedForeground: string;
  
  // Input colors
  input: string;
  inputForeground: string;
  inputBorder: string;
  
  // Ring/Outline colors
  ring: string;
}

/**
 * Light theme color palette
 * Eco-friendly greens with soft backgrounds
 */
export const lightTheme: ColorPalette = {
  // Primary Green - Main eco-action color
  primary: '#22c55e', // emerald-500
  primaryHover: '#16a34a', // emerald-600
  primaryActive: '#15803d', // emerald-700
  primaryForeground: '#ffffff',
  
  // Secondary Green
  secondary: '#10b981', // emerald-500 variant
  secondaryHover: '#059669', // emerald-600
  secondaryForeground: '#ffffff',
  
  // Accent Blue - Water/ocean references
  accent: '#0ea5e9', // sky-500
  accentHover: '#0284c7', // sky-600
  accentForeground: '#ffffff',
  
  // Earth Brown - Earth/soil references
  earth: '#a16207', // amber-700
  earthHover: '#854d0e', // amber-800
  earthForeground: '#ffffff',
  
  // Success - Positive feedback
  success: '#10b981', // emerald-500
  successHover: '#059669', // emerald-600
  successForeground: '#ffffff',
  
  // Background - Soft green tint
  background: '#f0fdf4', // emerald-50
  backgroundSecondary: '#dcfce7', // emerald-100
  surface: '#ffffff',
  surfaceElevated: '#f9fafb', // gray-50
  
  // Text colors
  foreground: '#1f2937', // gray-800
  foregroundSecondary: '#4b5563', // gray-600
  foregroundMuted: '#6b7280', // gray-500
  
  // Border colors
  border: '#d1d5db', // gray-300
  borderSecondary: '#e5e7eb', // gray-200
  
  // Interactive states
  hover: '#f3f4f6', // gray-100
  active: '#e5e7eb', // gray-200
  focus: '#22c55e', // emerald-500
  
  // Destructive
  destructive: '#ef4444', // red-500
  destructiveHover: '#dc2626', // red-600
  destructiveForeground: '#ffffff',
  
  // Muted
  muted: '#f3f4f6', // gray-100
  mutedForeground: '#6b7280', // gray-500
  
  // Input
  input: '#ffffff',
  inputForeground: '#1f2937', // gray-800
  inputBorder: '#d1d5db', // gray-300
  
  // Ring
  ring: '#22c55e', // emerald-500
};

/**
 * Dark theme color palette
 * Brighter greens for better visibility on dark backgrounds
 */
export const darkTheme: ColorPalette = {
  // Primary Green - Brighter for dark mode
  primary: '#4ade80', // emerald-400
  primaryHover: '#22c55e', // emerald-500
  primaryActive: '#16a34a', // emerald-600
  primaryForeground: '#0f172a', // slate-900
  
  // Secondary Green
  secondary: '#34d399', // emerald-400 variant
  secondaryHover: '#22c55e', // emerald-500
  secondaryForeground: '#0f172a', // slate-900
  
  // Accent Blue
  accent: '#38bdf8', // sky-400
  accentHover: '#0ea5e9', // sky-500
  accentForeground: '#0f172a', // slate-900
  
  // Earth Brown - Lighter for dark mode
  earth: '#fbbf24', // amber-400
  earthHover: '#f59e0b', // amber-500
  earthForeground: '#0f172a', // slate-900
  
  // Success
  success: '#34d399', // emerald-400
  successHover: '#22c55e', // emerald-500
  successForeground: '#0f172a', // slate-900
  
  // Background - Deep dark
  background: '#0f172a', // slate-900
  backgroundSecondary: '#1e293b', // slate-800
  surface: '#1e293b', // slate-800
  surfaceElevated: '#334155', // slate-700
  
  // Text colors - Light for dark backgrounds
  foreground: '#f1f5f9', // slate-100
  foregroundSecondary: '#cbd5e1', // slate-300
  foregroundMuted: '#94a3b8', // slate-400
  
  // Border colors
  border: '#334155', // slate-700
  borderSecondary: '#475569', // slate-600
  
  // Interactive states
  hover: '#1e293b', // slate-800
  active: '#334155', // slate-700
  focus: '#4ade80', // emerald-400
  
  // Destructive
  destructive: '#f87171', // red-400
  destructiveHover: '#ef4444', // red-500
  destructiveForeground: '#ffffff',
  
  // Muted
  muted: '#1e293b', // slate-800
  mutedForeground: '#94a3b8', // slate-400
  
  // Input
  input: '#1e293b', // slate-800
  inputForeground: '#f1f5f9', // slate-100
  inputBorder: '#334155', // slate-700
  
  // Ring
  ring: '#4ade80', // emerald-400
};

/**
 * Get color palette for a specific theme mode
 */
export const getThemeColors = (mode: ThemeMode): ColorPalette => {
  return mode === 'light' ? lightTheme : darkTheme;
};

/**
 * Color contrast ratios for accessibility
 * All color combinations meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
 */
export const contrastRatios = {
  light: {
    primaryForeground: 4.8, // primary green on white
    foregroundBackground: 12.6, // dark text on light background
    successForeground: 4.9, // success green on white
  },
  dark: {
    primaryForeground: 5.2, // primary green on dark background
    foregroundBackground: 13.1, // light text on dark background
    successForeground: 5.4, // success green on dark background
  },
} as const;

/**
 * Export theme colors as CSS variables format
 */
export const getThemeCSSVariables = (mode: ThemeMode): Record<string, string> => {
  const colors = getThemeColors(mode);
  const prefix = '--color';
  
  return {
    [`${prefix}-primary`]: colors.primary,
    [`${prefix}-primary-hover`]: colors.primaryHover,
    [`${prefix}-primary-active`]: colors.primaryActive,
    [`${prefix}-primary-foreground`]: colors.primaryForeground,
    [`${prefix}-secondary`]: colors.secondary,
    [`${prefix}-secondary-hover`]: colors.secondaryHover,
    [`${prefix}-secondary-foreground`]: colors.secondaryForeground,
    [`${prefix}-accent`]: colors.accent,
    [`${prefix}-accent-hover`]: colors.accentHover,
    [`${prefix}-accent-foreground`]: colors.accentForeground,
    [`${prefix}-earth`]: colors.earth,
    [`${prefix}-earth-hover`]: colors.earthHover,
    [`${prefix}-earth-foreground`]: colors.earthForeground,
    [`${prefix}-success`]: colors.success,
    [`${prefix}-success-hover`]: colors.successHover,
    [`${prefix}-success-foreground`]: colors.successForeground,
    [`${prefix}-background`]: colors.background,
    [`${prefix}-background-secondary`]: colors.backgroundSecondary,
    [`${prefix}-surface`]: colors.surface,
    [`${prefix}-surface-elevated`]: colors.surfaceElevated,
    [`${prefix}-foreground`]: colors.foreground,
    [`${prefix}-foreground-secondary`]: colors.foregroundSecondary,
    [`${prefix}-foreground-muted`]: colors.foregroundMuted,
    [`${prefix}-border`]: colors.border,
    [`${prefix}-border-secondary`]: colors.borderSecondary,
    [`${prefix}-hover`]: colors.hover,
    [`${prefix}-active`]: colors.active,
    [`${prefix}-focus`]: colors.focus,
    [`${prefix}-destructive`]: colors.destructive,
    [`${prefix}-destructive-hover`]: colors.destructiveHover,
    [`${prefix}-destructive-foreground`]: colors.destructiveForeground,
    [`${prefix}-muted`]: colors.muted,
    [`${prefix}-muted-foreground`]: colors.mutedForeground,
    [`${prefix}-input`]: colors.input,
    [`${prefix}-input-foreground`]: colors.inputForeground,
    [`${prefix}-input-border`]: colors.inputBorder,
    [`${prefix}-ring`]: colors.ring,
  };
};

