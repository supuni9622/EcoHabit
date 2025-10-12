import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EcoHabit - Transform Your Eco-Friendly Habits',
  description: 'Transform your eco-friendly habits into an engaging journey with gamification, lessons, and community features.',
  keywords: ['eco-friendly', 'sustainability', 'gamification', 'habits', 'environment'],
  authors: [{ name: 'EcoHabit Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#4CAF50',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
