import React from 'react';
import { Pressable, View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export type ToggleVariant = 'default' | 'outline' | 'secondary';
export type ToggleSize = 'sm' | 'md' | 'lg';

export interface ToggleProps {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  variant?: ToggleVariant;
  size?: ToggleSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Toggle: React.FC<ToggleProps> = ({
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  disabled = false,
  children,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}) => {
  const { colors, spacing } = useTheme();
  const isControlled = pressedProp !== undefined;
  const [internal, setInternal] = React.useState(defaultPressed);
  const pressed = isControlled ? (pressedProp as boolean) : internal;

  const paddingVertical = size === 'sm' ? 6 : size === 'lg' ? 10 : 8;
  const paddingHorizontal = size === 'sm' ? spacing.sm : size === 'lg' ? spacing.lg : spacing.md;

  const styles = React.useMemo(() => StyleSheet.create({
    base: {
      borderRadius: 8,
      paddingVertical,
      paddingHorizontal,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: variant === 'outline' ? 1 : 0,
      borderColor: variant === 'outline' ? colors.gray300 : 'transparent',
      backgroundColor: pressed
        ? (variant === 'secondary' ? colors.gray700 : colors.primary)
        : (variant === 'secondary' ? colors.gray200 : colors.gray100),
      opacity: disabled ? 0.6 : 1,
    },
    text: {
      color: pressed
        ? (variant === 'secondary' ? colors.white : colors.white)
        : (variant === 'secondary' ? colors.textPrimary : colors.textPrimary),
      fontWeight: '600',
    },
  }), [colors, paddingHorizontal, paddingVertical, pressed, disabled, variant]);

  const toggle = () => {
    if (disabled) return;
    const next = !pressed;
    if (!isControlled) setInternal(next);
    onPressedChange?.(next);
  };

  return (
    <Pressable onPress={toggle} accessibilityRole="button" accessibilityState={{ pressed, disabled }}>
      <View style={[styles.base, style]}>
        {typeof children === 'string' ? <Text style={[styles.text, textStyle]}>{children}</Text> : children}
      </View>
    </Pressable>
  );
};

export default Toggle;
