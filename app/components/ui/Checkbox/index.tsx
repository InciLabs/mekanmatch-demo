import React from 'react';
import { Pressable, View, StyleSheet, Text, type ViewStyle, type TextStyle } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  style?: ViewStyle;
  boxStyle?: ViewStyle;
  labelStyle?: TextStyle;
  size?: number; // box size in px
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked: checkedProp,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  style,
  boxStyle,
  labelStyle,
  size = 20,
}) => {
  const { colors, spacing } = useTheme();
  const isControlled = checkedProp !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const checked = isControlled ? checkedProp! : internalChecked;

  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  };

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    box: {
      width: size,
      height: size,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: checked ? colors.primary : colors.gray300,
      backgroundColor: checked ? colors.primary : colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.6 : 1,
    },
    label: {
      marginLeft: spacing.sm,
      color: colors.textPrimary,
    },
  }), [colors, spacing, size, checked, disabled]);

  return (
    <Pressable onPress={toggle} style={[styles.container, style]} accessibilityRole="checkbox" accessibilityState={{ checked, disabled }}>
      <View style={[styles.box, boxStyle]}>
        {checked ? <Check size={size - 6} color={colors.textInverse} /> : null}
      </View>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
    </Pressable>
  );
};

export default Checkbox;
