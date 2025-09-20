import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

export interface NavigationMenuProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface NavigationMenuItemProps {
  value: string;
  label: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const NavigationMenu: React.FC<NavigationMenuProps> & {
  Item: React.FC<NavigationMenuItemProps>;
} = ({ value: valueProp, defaultValue, onValueChange, children, style }) => {
  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue);
  const value = isControlled ? valueProp : internal;

  const setValue = (v: string) => {
    if (!isControlled) setInternal(v);
    onValueChange?.(v);
  };

  return (
    <NavContext.Provider value={{ value, setValue }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 8 }}>
        <View style={[{ flexDirection: 'row', gap: 8 }, style]}>{children}</View>
      </ScrollView>
    </NavContext.Provider>
  );
};

interface NavCtxValue {
  value: string | undefined;
  setValue: (v: string) => void;
}
const NavContext = React.createContext<NavCtxValue | null>(null);

const Item: React.FC<NavigationMenuItemProps> = ({ value, label, style, textStyle }) => {
  const { colors, spacing } = useTheme();
  const ctx = React.useContext(NavContext);
  if (!ctx) throw new Error('NavigationMenu.Item must be used within NavigationMenu');
  const selected = ctx.value === value;

  const styles = React.useMemo(() =>
    StyleSheet.create({
      chip: {
        borderRadius: 9999,
        paddingVertical: 8,
        paddingHorizontal: spacing.md,
        backgroundColor: selected ? colors.primary : colors.gray100,
      },
      label: {
        color: selected ? '#ffffff' : colors.textPrimary,
        fontWeight: selected ? '600' : '500',
      },
    }), [colors, spacing, selected]
  );

  return (
    <Pressable onPress={() => ctx.setValue(value)}>
      <View style={[styles.chip, style]}>
        <Text style={[styles.label, textStyle]}>{label}</Text>
      </View>
    </Pressable>
  );
};

NavigationMenu.Item = Item;

export default NavigationMenu;
