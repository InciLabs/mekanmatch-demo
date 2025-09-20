import * as React from 'react';
import { useColorScheme } from 'react-native';
import { colors, spacing, radius, typography, shadows, animations, createThemedStyles } from '@components/ui/utils';

export type ColorMode = 'light' | 'dark' | 'system';

export type ThemeContextType = {
  /**
   * The current color mode ('light', 'dark', or 'system')
   */
  colorMode: ColorMode;
  
  /**
   * The resolved color scheme based on colorMode and system preferences
   */
  colorScheme: 'light' | 'dark';
  
  /**
   * Toggle between light and dark mode
   */
  toggleColorMode: () => void;
  
  /**
   * Set a specific color mode
   */
  setColorMode: (mode: ColorMode) => void;
  
  /**
   * Theme object with all design tokens
   */
  theme: ReturnType<typeof createThemedStyles>;
};

// Create the theme context
const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

// Default theme colors for light and dark modes
const lightColors = {
  ...colors,
  // Override any colors for light theme
  background: '#FFFFFF',
  backgroundElevated: '#F9FAFB',
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textTertiary: '#6B7280',
  textInverse: '#FFFFFF',
  border: '#E5E7EB',
  card: '#FFFFFF',
  notification: '#EF4444',
};

const darkColors = {
  ...colors,
  // Override colors for dark theme
  primary: '#60A5FA',
  primaryLight: '#93C5FD',
  primaryDark: '#3B82F6',
  background: '#111827',
  backgroundElevated: '#1F2937',
  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  textInverse: '#111827',
  border: '#374151',
  card: '#1F2937',
  notification: '#F87171',
};

export interface ThemeProviderProps {
  /**
   * Initial color mode ('light', 'dark', or 'system')
   * @default 'system'
   */
  initialColorMode?: ColorMode;
  
  /**
   * Custom theme overrides
   */
  theme?: Partial<ReturnType<typeof createThemedStyles>>;
  
  /**
   * Child components
   */
  children: React.ReactNode;
}

/**
 * ThemeProvider component that provides theme context to all child components.
 * Handles color mode (light/dark) and provides theme tokens to the component tree.
 */
export function ThemeProvider({
  initialColorMode = 'system',
  theme: customTheme = {},
  children,
}: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [colorMode, setColorMode] = React.useState<ColorMode>(initialColorMode);
  
  // Resolve the actual color scheme based on the current mode and system preferences
  const colorScheme = React.useMemo(() => {
    if (colorMode === 'system') {
      return systemColorScheme || 'light';
    }
    return colorMode;
  }, [colorMode, systemColorScheme]);
  
  // Toggle between light and dark mode
  const toggleColorMode = React.useCallback(() => {
    setColorMode(prevMode => {
      if (prevMode === 'light') return 'dark';
      if (prevMode === 'dark') return 'system';
      return 'light';
    });
  }, []);
  
  // Create the theme object with the appropriate colors based on the current color scheme
  const theme = React.useMemo(() => {
    const baseTheme = createThemedStyles({
      colors: colorScheme === 'dark' ? darkColors : lightColors,
    });
    
    // Merge with custom theme overrides
    return {
      ...baseTheme,
      ...customTheme,
      colors: {
        ...baseTheme.colors,
        ...(customTheme.colors || {}),
      },
    };
  }, [colorScheme, customTheme]);
  
  // Create the context value
  const contextValue = React.useMemo(() => ({
    colorMode,
    colorScheme,
    toggleColorMode,
    setColorMode,
    theme,
  }), [colorMode, colorScheme, toggleColorMode, theme]);
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access the theme context
 * @returns The theme context value
 * @throws Error if used outside of a ThemeProvider
 */
export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Higher-order component to provide theme context to a component
 * @param Component The component to wrap with theme context
 * @returns A new component with theme context
 */
export function withTheme<P extends { theme?: any }>(
  Component: React.ComponentType<P>
): React.FC<Omit<P, 'theme'>> {
  return function ThemedComponent(props: Omit<P, 'theme'>) {
    const { theme } = useTheme();
    return <Component {...(props as P)} theme={theme} />;
  };
}

// Export the context
export { ThemeContext };
