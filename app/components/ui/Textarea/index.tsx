import { useTheme } from '@contexts/ThemeContext';
import React from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps, type TextStyle, type ViewStyle } from 'react-native';

export type TextareaVariant = 'default' | 'error' | 'success';
export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps extends Omit<TextInputProps, 'onChange'> {
  variant?: TextareaVariant;
  size?: TextareaSize;
  label?: string;
  helperText?: string;
  errorText?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  helperTextStyle?: TextStyle;
  errorTextStyle?: TextStyle;
}

export const Textarea: React.FC<TextareaProps> = ({
  variant = 'default',
  size = 'md',
  label,
  helperText,
  errorText,
  containerStyle,
  inputStyle,
  labelStyle,
  helperTextStyle,
  errorTextStyle,
  multiline = true,
  numberOfLines = 4,
  ...props
}) => {
  const { colors, spacing } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      width: '100%',
    },
    label: {
      marginBottom: spacing.xs,
      color: colors.textPrimary,
      fontWeight: '500',
    },
    input: {
      borderWidth: 1,
      borderColor: variant === 'error' ? '#FCA5A5' : variant === 'success' ? '#A7F3D0' : colors.gray300,
      backgroundColor: colors.white,
      paddingHorizontal: spacing.md,
      paddingVertical: size === 'sm' ? spacing.xs : size === 'lg' ? spacing.lg : spacing.sm,
      borderRadius: 8,
      color: colors.textPrimary,
      textAlignVertical: 'top',
      minHeight: size === 'sm' ? 80 : size === 'lg' ? 140 : 110,
    },
    helper: {
      marginTop: spacing.xs,
      color: colors.textSecondary,
    },
    error: {
      marginTop: spacing.xs,
      color: '#B91C1C',
      fontWeight: '500',
    },
  }), [colors, spacing, size, variant]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
      <TextInput
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={[styles.input, inputStyle]}
        {...props}
      />
      {errorText ? (
        <Text style={[styles.error, errorTextStyle]}>{errorText}</Text>
      ) : helperText ? (
        <Text style={[styles.helper, helperTextStyle]}>{helperText}</Text>
      ) : null}
    </View>
  );
};

export default Textarea;
