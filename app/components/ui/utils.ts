import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle };

/**
 * Creates a StyleSheet style reference from the given object
 */
export const createStyles = <T extends Record<string, ViewStyle | TextStyle>>(
  styles: T
): T => {
  return StyleSheet.create(styles);
};

export const colors = {
  // Primary
  primary: '#007AFF',
  primaryLight: '#66B3FF',
  primaryDark: '#0056B3',
  
  // Grayscale
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  black: '#000000',
  
  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Backgrounds
  background: '#FFFFFF',
  backgroundElevated: '#F9FAFB',
  
  // Text
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textTertiary: '#6B7280',
  textInverse: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const radius = {
  none: 0,
  sm: 2,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  full: 9999,
} as const;

export const typography = {
  displayLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: 0,
  },
  displayMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '600',
    letterSpacing: 0,
  },
  displaySmall: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    letterSpacing: 0,
  },
  headlineLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
    letterSpacing: 0,
  },
  headlineMedium: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  headlineSmall: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0.4,
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

// Animation constants
export const animations = {
  defaultTiming: 300,
  defaultEasing: 'ease-in-out',
  quickTiming: 150,
  slowTiming: 500,
} as const;

// Helper function to create responsive styles
export function responsiveStyle<T>(
  base: T,
  small: Partial<T> = {},
  large: Partial<T> = {}
) {
  return {
    ...base,
    '@media (min-width: 768px)': {
      ...small,
    },
    '@media (min-width: 1024px)': {
      ...large,
    },
  } as const;
}

// Helper function to create variant styles
export function createVariantStyles<T extends string>(
  variants: Record<T, ViewStyle | TextStyle>
) {
  return variants;
}

// Helper function to combine styles
export function combineStyles<T extends ViewStyle | TextStyle>(
  ...styles: (T | false | null | undefined)[]
): T {
  return styles.filter(Boolean).reduce(
    (combined, style) => ({
      ...combined,
      ...style,
    }),
    {}
  ) as T;
}

// Helper function to create themed styles
export function createThemedStyles(theme: Record<string, any>) {
  return {
    colors: {
      ...colors,
      ...theme.colors,
    },
    spacing,
    radius,
    typography,
    shadows,
    animations,
  } as const;
}

// Default theme
export const defaultTheme = createThemedStyles({});

export type Theme = typeof defaultTheme;
