import React from 'react';
import { Text, StyleSheet, type TextStyle, type ViewStyle, Pressable } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

export type LabelVariant = 'default' | 'muted' | 'error' | 'success' | 'warning';
export type LabelSize = 'sm' | 'md' | 'lg';

export interface LabelProps {
  children: React.ReactNode;
  variant?: LabelVariant;
  size?: LabelSize;
  required?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: TextStyle;
  containerStyle?: ViewStyle;
}

export const Label: React.FC<LabelProps> = ({
  children,
  variant = 'default',
  size = 'md',
  required = false,
  disabled = false,
  onPress,
  style,
  containerStyle,
}) => {
  const { colors, spacing } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      opacity: disabled ? 0.6 : 1,
    },
    text: {
      color:
        variant === 'error' ? '#B91C1C' :
        variant === 'success' ? '#065F46' :
        variant === 'warning' ? '#92400E' :
        variant === 'muted' ? colors.textSecondary : colors.textPrimary,
      fontSize: size === 'sm' ? 12 : size === 'lg' ? 16 : 14,
      lineHeight: size === 'sm' ? 16 : size === 'lg' ? 22 : 20,
      fontWeight: '500',
    },
    asterisk: {
      color: '#EF4444',
    },
  }), [colors, disabled, size, variant]);

  const content = (
    <Text style={[styles.text, style]}>
      {children}
      {required ? <Text style={styles.asterisk}>*</Text> : null}
    </Text>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={[styles.container, containerStyle]} accessibilityRole="text">
        {content}
      </Pressable>
    );
  }

  return content;
};

export default Label;
