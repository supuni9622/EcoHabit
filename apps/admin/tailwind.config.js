/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: '#0a2f1a',
          hover: '#0f3d22',
          active: '#16a34a',
          text: '#6b9f7a',
          'text-active': '#4ade80',
          border: '#1a4a2a',
        },
        admin: {
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          ink: '#0f172a',
          muted: '#64748b',
          accent: '#16a34a',
          warning: '#f59e0b',
          danger: '#ef4444',
          info: '#3b82f6',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
