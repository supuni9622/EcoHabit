import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMobileTheme, getStatusBarConfig } from '../lib/theme';

export default function RootLayout() {
  const { theme, colors } = useMobileTheme();
  const statusBarConfig = getStatusBarConfig(theme);

  return (
    <>
      <StatusBar
        style={statusBarConfig.barStyle}
        backgroundColor={statusBarConfig.backgroundColor}
      />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.foreground,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

