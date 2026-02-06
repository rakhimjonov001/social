/**
 * Design Tokens Configuration
 * 
 * Centralized design system tokens for modern minimalistic social media UI
 */

export const designTokens = {
  // Color System - Neutral palette for minimalistic design
  colors: {
    // Neutral colors
    neutral: {
      50: '#fafafa',   // Background light
      100: '#f5f5f5',  // Surface light
      200: '#e5e5e5',  // Border light
      300: '#d4d4d4',  // Border
      400: '#a3a3a3',  // Text secondary
      500: '#737373',  // Text tertiary
      600: '#525252',  // Text secondary dark
      700: '#404040',  // Text primary dark
      800: '#262626',  // Surface dark
      900: '#171717',  // Background dark
      950: '#0a0a0a'   // Background darkest
    },
    
    // Primary colors for interactions
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',   // Primary blue
      600: '#2563eb',   // Primary blue hover
      700: '#1d4ed8',   // Primary blue active
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    },
    
    // Semantic colors
    success: {
      50: '#ecfdf5',
      500: '#10b981',
      600: '#059669',
      700: '#047857'
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309'
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c'
    }
  },

  // Typography Scale
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
    },
    
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem'      // 48px
    },
    
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    },
    
    letterSpacing: {
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em'
    }
  },

  // Spacing System
  spacing: {
    0: '0px',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem'      // 128px
  },

  // Shadow System
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
  },

  // Border Radius
  borderRadius: {
    none: '0px',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },

  // Responsive Breakpoints
  breakpoints: {
    sm: '640px',    // Mobile landscape
    md: '768px',    // Tablet
    lg: '1024px',   // Desktop
    xl: '1280px',   // Large desktop
    '2xl': '1536px' // Extra large desktop
  },

  // Animation Durations
  animation: {
    duration: {
      fast: 150,     // 150ms
      normal: 300,   // 300ms
      slow: 500      // 500ms
    },
    
    easing: {
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },

  // Z-Index Scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  }
} as const;

// Type definitions for design tokens
export type ColorTokens = typeof designTokens.colors;
export type TypographyTokens = typeof designTokens.typography;
export type SpacingTokens = typeof designTokens.spacing;
export type ShadowTokens = typeof designTokens.shadows;
export type BorderRadiusTokens = typeof designTokens.borderRadius;
export type BreakpointTokens = typeof designTokens.breakpoints;
export type AnimationTokens = typeof designTokens.animation;
export type ZIndexTokens = typeof designTokens.zIndex;

// Helper functions for accessing tokens
export const getColor = (path: string) => {
  const keys = path.split('.');
  let value: any = designTokens.colors;
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return value;
};

export const getSpacing = (key: keyof SpacingTokens) => {
  return designTokens.spacing[key];
};

export const getShadow = (key: keyof ShadowTokens) => {
  return designTokens.shadows[key];
};

export const getBorderRadius = (key: keyof BorderRadiusTokens) => {
  return designTokens.borderRadius[key];
};