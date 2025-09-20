import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export type ColorMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Background colors
  background: string;
  surface: string;
  surfaceVariant: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Border colors
  border: string;
  borderLight: string;
  
  // Other
  overlay: string;
  shadow: string;

  // Neutral palette
  white: string;
  black: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray400: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeRadii {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  pill: number;
  round: number;
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radii: ThemeRadii;
  colorMode: ColorMode;
  isDark: boolean;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
}

const lightColors: Omit<ThemeColors, keyof Theme> = {
  // Primary
  primary: '#007AFF',
  primaryLight: '#66B3FF',
  primaryDark: '#0056B3',
  
  // Background
  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceVariant: '#E9ECEF',
  
  // Text
  textPrimary: '#212529',
  textSecondary: '#495057',
  textTertiary: '#6C757D',
  textInverse: '#FFFFFF',
  
  // Status
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',
  
  // Border
  border: '#DEE2E6',
  borderLight: '#E9ECEF',
  
  // Other
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',

  // Neutral
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
};

const darkColors: Omit<ThemeColors, keyof Theme> = {
  // Primary
  primary: '#0A84FF',
  primaryLight: '#409CFF',
  primaryDark: '#0040DD',
  
  // Background
  background: '#121212',
  surface: '#1E1E1E',
  surfaceVariant: '#2D2D2D',
  
  // Text
  textPrimary: '#F8F9FA',
  textSecondary: '#DEE2E6',
  textTertiary: '#ADB5BD',
  textInverse: '#212529',
  
  // Status
  success: '#20C997',
  warning: '#FFD43B',
  error: '#FF6B6B',
  info: '#15AABF',
  
  // Border
  border: '#495057',
  borderLight: '#343A40',
  
  // Other
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.3)',

  // Neutral
  // Map "white" usages to a dark surface to preserve contrast in components
  white: '#1E1E1E',
  black: '#000000',
  gray100: '#1F2937',
  gray200: '#374151',
  gray300: '#4B5563',
  gray400: '#6B7280',
};

const spacing: ThemeSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const radii: ThemeRadii = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 1000,
  round: 9999,
};

const ThemeContext = createContext<Theme | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  initialColorMode?: ColorMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialColorMode = 'system',
}) => {
  const systemColorScheme = useColorScheme();
  const [colorMode, setColorMode] = useState<ColorMode>(initialColorMode);
  
  const isDark = colorMode === 'system' 
    ? systemColorScheme === 'dark' 
    : colorMode === 'dark';
  
  const toggleColorMode = () => {
    setColorMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };
  
  const theme: Theme = {
    colors: isDark ? darkColors : lightColors,
    spacing,
    radii,
    colorMode,
    isDark,
    toggleColorMode,
    setColorMode,
  };
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const withTheme = <P extends object>(
  WrappedComponent: React.ComponentType<P & { theme: Theme }>
) => {
  const WithTheme: React.FC<P> = (props) => {
    const theme = useTheme();
    return <WrappedComponent {...props} theme={theme} />;
  };
  
  WithTheme.displayName = `WithTheme(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return WithTheme;
};

export default ThemeContext;
