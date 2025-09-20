// @ts-nocheck
// @ts-nocheck
import { View, StyleSheet } from 'react-native';
import { ThemeProvider as StyledThemeProvider, useTheme } from '.';
import { Button } from '.';
import { Card } from '.';
import { Typography } from '.';

// Component to demonstrate theme switching
const ThemeDemo = () => {
  const { colorMode, colorScheme, toggleColorMode, theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Typography variant="headlineMedium" style={{ marginBottom: 16 }}>
          Theme Demo
        </Typography>
        
        <View style={styles.infoContainer}>
          <Typography variant="bodyMedium" style={styles.infoText}>
            <Typography variant="labelLarge">Current Mode:</Typography> {colorMode}
          </Typography>
          <Typography variant="bodyMedium" style={styles.infoText}>
            <Typography variant="labelLarge">Resolved Scheme:</Typography> {colorScheme}
          </Typography>
        </View>
        
        <Button 
          onPress={toggleColorMode}
          variant={colorScheme === 'dark' ? 'outline' : 'default'}
          style={{ marginTop: 16 }}
        >
          Toggle Theme
        </Button>
        
        <View style={styles.themePreview}>
          <View style={[styles.colorBox, { backgroundColor: theme.colors.primary }]}>
            <Typography variant="labelSmall" color="textInverse">Primary</Typography>
          </View>
          <View style={[styles.colorBox, { backgroundColor: theme.colors.background }]}>
            <Typography variant="labelSmall">Background</Typography>
          </View>
          <View style={[styles.colorBox, { backgroundColor: theme.colors.backgroundElevated }]}>
            <Typography variant="labelSmall">Elevated</Typography>
          </View>
          <View style={[styles.colorBox, { backgroundColor: theme.colors.border, borderWidth: 0 }]}>
            <Typography variant="labelSmall">Border</Typography>
          </View>
        </View>
      </Card>
      
      <Card style={[styles.card, { marginTop: 16 }]}>
        <Typography variant="headlineSmall" style={{ marginBottom: 8 }}>
          Typography
        </Typography>
        <Typography variant="bodyMedium" style={{ marginBottom: 16 }}>
          This is a sample text showing how typography appears in the current theme.
        </Typography>
        <Typography variant="bodySmall" color="textSecondary">
          Secondary text for additional information.
        </Typography>
      </Card>
    </View>
  );
};

export default {
  title: 'Components/UI/ThemeProvider',
  component: ThemeDemo,
  decorators: [
    (Story: any) => (
      <StyledThemeProvider>
        <Story />
      </StyledThemeProvider>
    ),
  ],
};

export const Default = () => <ThemeDemo />;

export const LightTheme = () => (
  <StyledThemeProvider initialColorMode="light">
    <ThemeDemo />
  </StyledThemeProvider>
);

export const DarkTheme = () => (
  <StyledThemeProvider initialColorMode="dark">
    <ThemeDemo />
  </StyledThemeProvider>
);

export const CustomTheme = () => (
  <StyledThemeProvider 
    initialColorMode="light"
    theme={{
      colors: {
        primary: '#8B5CF6',
        primaryLight: '#C4B5FD',
        primaryDark: '#7C3AED',
        background: '#F5F3FF',
        backgroundElevated: '#EDE9FE',
        textPrimary: '#1E1B4B',
        textSecondary: '#4C1D95',
        border: '#C4B5FD',
      },
    }}
  >
    <ThemeDemo />
  </StyledThemeProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    width: '100%',
    padding: 16,
  },
  infoContainer: {
    marginVertical: 12,
    gap: 8,
  },
  infoText: {
    flexDirection: 'row',
    gap: 8,
  },
  themePreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  colorBox: {
    width: 80,
    height: 60,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
});
