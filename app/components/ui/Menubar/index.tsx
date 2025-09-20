import React from 'react';
import { View, Text, StyleSheet, Pressable, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';
import { DropdownMenu } from '@components/ui/DropdownMenu';

export interface MenubarProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface MenubarMenuProps {
  label: string;
  children: React.ReactNode; // should contain Menubar.Item entries inside Content
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export interface MenubarItemProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

export const Menubar: React.FC<MenubarProps> & { Menu: React.FC<MenubarMenuProps>; Item: React.FC<MenubarItemProps> } = ({ children, style }) => {
  const styles = React.useMemo(() =>
    StyleSheet.create({
      bar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
    }), []
  );
  return <View style={[styles.bar, style]}>{children}</View>;
};

const Menu: React.FC<MenubarMenuProps> = ({ label, children, style, labelStyle }) => {
  const { colors, spacing } = useTheme();
  const styles = React.useMemo(() =>
    StyleSheet.create({
      trigger: {
        paddingVertical: 8,
        paddingHorizontal: spacing.md,
        borderRadius: 6,
        backgroundColor: colors.gray100,
      },
      label: {
        color: colors.textPrimary,
        fontWeight: '600',
      },
    }), [colors, spacing]
  );

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger>
        <Pressable>
          <View style={[styles.trigger, style]}>
            <Text style={[styles.label, labelStyle]}>{label}</Text>
          </View>
        </Pressable>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {children}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

const Item: React.FC<MenubarItemProps> = ({ children, onPress, leading, trailing, style, textStyle }) => (
  <DropdownMenu.Item onPress={onPress} leading={leading} trailing={trailing} style={style} textStyle={textStyle}>
    {children}
  </DropdownMenu.Item>
);

Menubar.Menu = Menu;
Menubar.Item = Item;

export default Menubar;
