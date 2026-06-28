'use client';

import { NextUIProvider } from '@nextui-org/react';
import { AuthProvider } from '../lib/providers/auth-provider';
import { QueryProvider } from '../lib/providers/query-provider';
import { OfflineBanner } from '../components/common/OfflineBanner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <NextUIProvider>
        <AuthProvider>
          <OfflineBanner />
          {children}
        </AuthProvider>
      </NextUIProvider>
    </QueryProvider>
  );
}
