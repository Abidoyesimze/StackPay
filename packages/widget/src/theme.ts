// Theme configuration for StackPay widget package
export interface ThemeConfig {
  // Colors
  background?: string;
  surface?: string;
  textPrimary?: string;
  textSecondary?: string;
  accentGreen?: string;
  accentLime?: string;
  border?: string;
  
  // Typography
  fontFamily?: string;
  
  // Shadows
  shadowSubtle?: string;
  shadowCard?: string;
  shadowGlass?: string;
  
  // Spacing
  borderRadius?: string;
  padding?: string;
  
  // Animation
  enableAnimations?: boolean;
}

export const defaultTheme: ThemeConfig = {
  background: '#f9f9f9',
  surface: '#ffffff',
  textPrimary: '#1a1a1a',
  textSecondary: '#6b7280',
  accentGreen: '#4ade80',
  accentLime: '#bef264',
  border: '#e5e7eb',
  fontFamily: 'Outfit, Inter, sans-serif',
  shadowSubtle: '0 2px 8px rgba(0,0,0,0.04)',
  shadowCard: '0 4px 12px rgba(0,0,0,0.06)',
  shadowGlass: '0 8px 32px rgba(0,0,0,0.1)',
  borderRadius: '1rem',
  padding: '1.5rem',
  enableAnimations: true,
};

export const createTheme = (customTheme: Partial<ThemeConfig> = {}): ThemeConfig => {
  return { ...defaultTheme, ...customTheme };
};

export const getThemeCSSVariables = (theme: ThemeConfig): Record<string, string> => {
  return {
    '--widget-background': theme.background || defaultTheme.background!,
    '--widget-surface': theme.surface || defaultTheme.surface!,
    '--widget-text-primary': theme.textPrimary || defaultTheme.textPrimary!,
    '--widget-text-secondary': theme.textSecondary || defaultTheme.textSecondary!,
    '--widget-accent-green': theme.accentGreen || defaultTheme.accentGreen!,
    '--widget-accent-lime': theme.accentLime || defaultTheme.accentLime!,
    '--widget-border': theme.border || defaultTheme.border!,
    '--widget-font-family': theme.fontFamily || defaultTheme.fontFamily!,
    '--widget-shadow-subtle': theme.shadowSubtle || defaultTheme.shadowSubtle!,
    '--widget-shadow-card': theme.shadowCard || defaultTheme.shadowCard!,
    '--widget-shadow-glass': theme.shadowGlass || defaultTheme.shadowGlass!,
    '--widget-border-radius': theme.borderRadius || defaultTheme.borderRadius!,
    '--widget-padding': theme.padding || defaultTheme.padding!,
  };
};

// Predefined theme variants
export const themes = {
  light: defaultTheme,
  dark: {
    ...defaultTheme,
    background: '#0a0a0a',
    surface: '#1a1a1a',
    textPrimary: '#ffffff',
    textSecondary: '#a1a1aa',
    border: '#27272a',
  },
  minimal: {
    ...defaultTheme,
    accentGreen: '#22c55e',
    accentLime: '#84cc16',
    borderRadius: '0.5rem',
    shadowCard: '0 1px 3px rgba(0,0,0,0.1)',
  },
  vibrant: {
    ...defaultTheme,
    accentGreen: '#10b981',
    accentLime: '#f59e0b',
    borderRadius: '1.5rem',
    shadowCard: '0 8px 25px rgba(0,0,0,0.15)',
  },
} as const;

export type ThemeVariant = keyof typeof themes;
