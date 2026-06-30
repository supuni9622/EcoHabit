'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com';
    if (!key) return; // Skip in dev when key is not set

    posthog.init(key, {
      api_host: host,
      capture_pageview: false, // handled manually via usePathname
      capture_pageleave: true,
      persistence: 'localStorage',
      // Respect user privacy settings
      respect_dnt: true,
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
