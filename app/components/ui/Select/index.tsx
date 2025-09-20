import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, FlatList, TouchableOpacity, type ViewStyle, type TextStyle } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useTheme } from '@contexts/ThemeContext';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  optionStyle?: ViewStyle;
  optionLabelStyle?: TextStyle;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder = 'Select...',
  disabled,
  style,
  labelStyle,
  optionStyle,
  optionLabelStyle,
}) => {
  const { colors, spacing } = useTheme();
  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue);
  const [open, setOpen] = React.useState(false);
  const value = isControlled ? valueProp : internal;

  const styles = React.useMemo(() => StyleSheet.create({
    trigger: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.gray300,
      paddingVertical: 10,
      paddingHorizontal: spacing.md,
      borderRadius: 8,
      backgroundColor: disabled ? colors.gray100 : colors.white,
      opacity: disabled ? 0.6 : 1,
    },
    triggerLabel: {
      color: value ? colors.textPrimary : colors.textSecondary,
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      padding: spacing.md,
    },
    modalContent: {
      backgroundColor: colors.white,
      borderRadius: 12,
      maxHeight: '70%',
      overflow: 'hidden',
    },
    option: {
      paddingVertical: 14,
      paddingHorizontal: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.gray200,
      backgroundColor: colors.white,
    },
    optionLabel: {
      color: colors.textPrimary,
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray200,
      backgroundColor: colors.gray100,
    },
    headerText: {
      fontWeight: '600',
      color: colors.textPrimary,
    },
    cancel: {
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
      alignItems: 'center',
    },
    cancelText: {
      color: colors.primary,
      fontWeight: '600',
    },
  }), [colors, spacing, disabled, value]);

  const selected = options.find(o => o.value === value);

  const setValue = (val: string) => {
    if (!isControlled) setInternal(val);
    onValueChange?.(val);
  };

  const onSelect = (val: string) => {
    setValue(val);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => !disabled && setOpen(true)}
        style={[styles.trigger, style]}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        <Text style={[styles.triggerLabel, labelStyle]}>
          {selected ? selected.label : placeholder}
        </Text>
        <ChevronDown size={18} color={colors.textSecondary} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Select an option</Text>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => onSelect(item.value)}>
                  <View style={[styles.option, optionStyle]}>
                    <Text style={[styles.optionLabel, optionLabelStyle]}>{item.label}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setOpen(false)}>
              <View style={styles.cancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Select;
