/**
 * Mobile theme configuration
 * React Native theme setup with color mappings
 */

import { ColorSchemeName, useColorScheme as useRNColorScheme } from 'react-native';
import { ThemeMode, getThemeColors } from '@ecohabit/shared';

/**
 * Get theme mode from React Native color scheme
 */
export const getThemeFromColorScheme = (
  colorScheme: ColorSchemeName
): ThemeMode => {
  return colorScheme === 'dark' ? 'dark' : 'light';
};

/**
 * React Native theme colors
 * Maps web theme colors to React Native compatible format
 */
export const getMobileThemeColors = (mode: ThemeMode) => {
  const colors = getThemeColors(mode);

  return {
    primary: colors.primary,
    primaryHover: colors.primaryHover,
    primaryActive: colors.primaryActive,
    primaryForeground: colors.primaryForeground,
    secondary: colors.secondary,
    secondaryForeground: colors.secondaryForeground,
    accent: colors.accent,
    accentForeground: colors.accentForeground,
    earth: colors.earth,
    earthForeground: colors.earthForeground,
    success: colors.success,
    successForeground: colors.successForeground,
    background: colors.background,
    backgroundSecondary: colors.backgroundSecondary,
    surface: colors.surface,
    surfaceElevated: colors.surfaceElevated,
    foreground: colors.foreground,
    foregroundSecondary: colors.foregroundSecondary,
    foregroundMuted: colors.foregroundMuted,
    border: colors.border,
    borderSecondary: colors.borderSecondary,
    destructive: colors.destructive,
    destructiveForeground: colors.destructiveForeground,
    muted: colors.muted,
    mutedForeground: colors.mutedForeground,
    input: colors.input,
    inputForeground: colors.inputForeground,
    inputBorder: colors.inputBorder,
  };
};

/**
 * Hook to use React Native color scheme with EcoHabit theme
 */
export const useMobileTheme = () => {
  const colorScheme = useRNColorScheme();
  const themeMode = getThemeFromColorScheme(colorScheme);
  const colors = getMobileThemeColors(themeMode);

  return {
    theme: themeMode,
    colors,
    isDark: themeMode === 'dark',
    isLight: themeMode === 'light',
  };
};

/**
 * Status bar color configuration
 */
export const getStatusBarConfig = (mode: ThemeMode) => {
  const colors = getThemeColors(mode);
  
  return {
    barStyle: mode === 'dark' ? 'light-content' : 'dark-content',
    backgroundColor: colors.background,
  };
};

