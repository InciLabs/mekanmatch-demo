import React, { createContext, useContext } from 'react';
import { View, Text, StyleSheet, Pressable, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface RadioGroupContextValue {
  value: string | undefined;
  setValue: (val: string) => void;
  disabled?: boolean;
}

const RadioCtx = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const RadioGroup: React.FC<RadioGroupProps> & { Item: React.FC<RadioItemProps> } = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled,
  children,
  style,
}) => {
  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue);
  const value = isControlled ? valueProp : internal;

  const setValue = (val: string) => {
    if (!isControlled) setInternal(val);
    onValueChange?.(val);
  };

  return (
    <RadioCtx.Provider value={{ value, setValue, disabled }}>
      <View style={style}>{children}</View>
    </RadioCtx.Provider>
  );
};

export interface RadioItemProps {
  value: string;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  size?: number;
}

const RadioItem: React.FC<RadioItemProps> = ({
  value,
  label,
  disabled: disabledProp,
  style,
  labelStyle,
  size = 20,
}) => {
  const { colors, spacing } = useTheme();
  const ctx = useContext(RadioCtx);
  if (!ctx) {
    throw new Error('RadioGroup.Item must be used within a RadioGroup');
  }
  const selected = ctx.value === value;
  const disabled = ctx.disabled || disabledProp;

  const styles = React.useMemo(() => StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      opacity: disabled ? 0.6 : 1,
      paddingVertical: 4,
    },
    outer: {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 2,
      borderColor: selected ? colors.primary : colors.gray300,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inner: {
      width: size - 10,
      height: size - 10,
      borderRadius: (size - 10) / 2,
      backgroundColor: selected ? colors.primary : 'transparent',
    },
    label: {
      marginLeft: spacing.sm,
      color: colors.textPrimary,
    },
  }), [colors, spacing, size, selected, disabled]);

  const onPress = () => {
    if (disabled) return;
    ctx.setValue(value);
  };

  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ disabled, selected }}>
      <View style={[styles.row, style]}>
        <View style={styles.outer}>
          <View style={styles.inner} />
        </View>
        {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
      </View>
    </Pressable>
  );
};

RadioGroup.Item = RadioItem;

export default RadioGroup;
