import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EcoHabit - Transform Your Eco-Friendly Habits',
  description:
    'Transform your eco-friendly habits into an engaging journey with gamification, lessons, and community features.',
  keywords: ['eco-friendly', 'sustainability', 'gamification', 'habits', 'environment'],
  authors: [{ name: 'EcoHabit Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'EcoHabit',
  },
  openGraph: {
    type: 'website',
    title: 'EcoHabit',
    description: 'Transform your eco-friendly habits',
    siteName: 'EcoHabit',
  },
};

export const viewport: Viewport = {
  themeColor: '#22c55e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
