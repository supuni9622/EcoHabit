'use client';

import { NextUIProvider } from '@nextui-org/react';
import { AuthProvider } from '../lib/providers/auth-provider';
import { QueryProvider } from '../lib/providers/query-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <NextUIProvider>
        <AuthProvider>{children}</AuthProvider>
      </NextUIProvider>
    </QueryProvider>
  );
}
