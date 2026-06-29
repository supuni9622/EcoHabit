export function initSentry() {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  // Sentry is initialized via next.config.js when @sentry/nextjs is installed
  // This file is a placeholder for manual capture utilities
}

export function captureError(error: unknown, context?: Record<string, unknown>) {
  console.error('[EcoHabit Error]', error, context);
  // When @sentry/nextjs is installed: Sentry.captureException(error, { extra: context });
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  console.log(`[EcoHabit ${level}]`, message);
  // When @sentry/nextjs is installed: Sentry.captureMessage(message, level);
}
