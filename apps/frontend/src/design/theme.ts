// Theme configuration for StackPay landing page
export const theme = {
  colors: {
    background: '#f9f9f9',
    surface: '#ffffff',
    text: {
      primary: '#1a1a1a',
      secondary: '#6b7280',
    },
    accent: {
      green: '#4ade80',
      lime: '#bef264',
    },
    border: '#e5e7eb',
  },
  typography: {
    fontFamily: {
      sans: ['Outfit', 'Inter', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
    },
    scale: {
      '4xl': '2.25rem', // 36px
      '3xl': '1.875rem', // 30px
      '2xl': '1.5rem', // 24px
      xl: '1.25rem', // 20px
      lg: '1.125rem', // 18px
      base: '1rem', // 16px
      sm: '0.875rem', // 14px
      xs: '0.75rem', // 12px
    },
  },
  spacing: {
    section: {
      desktop: 'py-24',
      mobile: 'py-16',
    },
    container: 'max-w-6xl mx-auto px-6',
    grid: {
      gap: 'gap-8',
      cols: 'grid-cols-12',
    },
  },
  shadows: {
    subtle: '0 2px 8px rgba(0,0,0,0.04)',
    card: '0 4px 12px rgba(0,0,0,0.06)',
    glass: '0 8px 32px rgba(0,0,0,0.1)',
  },
  animations: {
    fadeUp: 'fadeUp 0.6s ease-out',
    fadeIn: 'fadeIn 0.8s ease-out',
    slideUp: 'slideUp 0.5s ease-out',
  },
} as const;

export type Theme = typeof theme;
