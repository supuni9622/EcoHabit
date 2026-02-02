/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Eco-friendly primary green scale
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
          active: 'hsl(var(--primary-active))',
        },
        // Secondary green
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          hover: 'hsl(var(--secondary-hover))',
        },
        // Accent blue (water/ocean)
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          hover: 'hsl(var(--accent-hover))',
        },
        // Earth brown
        earth: {
          DEFAULT: 'hsl(var(--earth))',
          foreground: 'hsl(var(--earth-foreground))',
          hover: 'hsl(var(--earth-hover))',
        },
        // Success green
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
          hover: 'hsl(var(--success-hover))',
        },
        // Background colors
        background: 'hsl(var(--background))',
        'background-secondary': 'hsl(var(--background-secondary))',
        surface: 'hsl(var(--surface))',
        'surface-elevated': 'hsl(var(--surface-elevated))',
        // Text colors
        foreground: 'hsl(var(--foreground))',
        'foreground-secondary': 'hsl(var(--foreground-secondary))',
        'foreground-muted': 'hsl(var(--foreground-muted))',
        // Border colors
        border: 'hsl(var(--border))',
        'border-secondary': 'hsl(var(--border-secondary))',
        // Interactive states
        hover: 'hsl(var(--hover))',
        active: 'hsl(var(--active))',
        focus: 'hsl(var(--focus))',
        // Surface colors
        surface: 'hsl(var(--component-surface, var(--surface)))',
        'surface-elevated': 'hsl(var(--surface-elevated))',
        hover: 'hsl(var(--component-hover, var(--hover)))',
        active: 'hsl(var(--component-active, var(--active)))',
        // Destructive
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
          hover: 'hsl(var(--destructive-hover))',
        },
        // Muted
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        // Input
        input: 'hsl(var(--input))',
        'input-foreground': 'hsl(var(--input-foreground))',
        'input-border': 'hsl(var(--input-border))',
        // Ring
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
        'theme-transition': 'themeTransition 200ms ease-in-out',
        'eco-glow': 'ecoGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseGreen: {
          '0%, 100%': { backgroundColor: 'rgb(34, 197, 94)' },
          '50%': { backgroundColor: 'rgb(16, 185, 129)' },
        },
        themeTransition: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        },
        ecoGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(34, 197, 94, 0.5), 0 0 10px rgba(34, 197, 94, 0.3)',
          },
          '50%': { 
            boxShadow: '0 0 10px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.5)',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};
