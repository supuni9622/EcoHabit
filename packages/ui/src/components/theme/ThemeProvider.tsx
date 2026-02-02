'use client';

import React from 'react';
import { ThemeProvider as SharedThemeProvider, ThemeProviderProps as SharedThemeProviderProps } from '@ecohabit/shared';

export type ThemeProviderProps = SharedThemeProviderProps;

/**
 * ThemeProvider wrapper component
 * Handles SSR for Next.js and provides theme context
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  ...props
}) => {
  // Prevent hydration mismatch by only rendering on client
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return children without theme provider on initial render
    // This prevents hydration mismatch
    return <>{children}</>;
  }

  return <SharedThemeProvider {...props}>{children}</SharedThemeProvider>;
};

