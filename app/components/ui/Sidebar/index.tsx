import React, { createContext, useContext } from 'react';
import { View, Text, Pressable, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

interface SidebarCtxValue {
  collapsed: boolean;
}
const SidebarCtx = createContext<SidebarCtxValue | null>(null);

export interface SidebarProps {
  collapsed?: boolean;
  width?: number;
  collapsedWidth?: number;
  style?: ViewStyle;
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> & {
  Header: React.FC<SidebarHeaderProps>;
  Footer: React.FC<SidebarFooterProps>;
  Group: React.FC<SidebarGroupProps>;
  Item: React.FC<SidebarItemProps>;
} = ({ collapsed = false, width = 260, collapsedWidth = 72, style, children }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() =>
    StyleSheet.create({
      container: {
        width: collapsed ? collapsedWidth : width,
        backgroundColor: '#F9FAFB',
        borderRightWidth: StyleSheet.hairlineWidth,
        borderRightColor: colors.gray200,
        paddingVertical: 12,
      },
      content: {
        flex: 1,
      },
    }), [collapsed, width, collapsedWidth, colors]
  );

  return (
    <SidebarCtx.Provider value={{ collapsed }}>
      <View style={[styles.container, style]}>{children}</View>
    </SidebarCtx.Provider>
  );
};

export interface SidebarHeaderProps { children: React.ReactNode; style?: ViewStyle }
const Header: React.FC<SidebarHeaderProps> = ({ children, style }) => (
  <View style={[{ paddingHorizontal: 12, paddingVertical: 6 }, style]}>{children}</View>
);

export interface SidebarFooterProps { children: React.ReactNode; style?: ViewStyle }
const Footer: React.FC<SidebarFooterProps> = ({ children, style }) => (
  <View style={[{ marginTop: 'auto', paddingHorizontal: 12, paddingVertical: 6 }, style]}>{children}</View>
);

export interface SidebarGroupProps { title?: string; style?: ViewStyle; titleStyle?: TextStyle; children: React.ReactNode }
const Group: React.FC<SidebarGroupProps> = ({ title, style, titleStyle, children }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
    group: { paddingVertical: 6 },
    title: { color: colors.textSecondary, fontSize: 12, fontWeight: '600', paddingHorizontal: 12, paddingVertical: 6 },
  }), [colors]);
  return (
    <View style={[styles.group, style]}>
      {title ? <Text style={[styles.title, titleStyle]}>{title}</Text> : null}
      <View>{children}</View>
    </View>
  );
};

export interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}
const Item: React.FC<SidebarItemProps> = ({ icon, label, selected, onPress, style, textStyle }) => {
  const { colors, spacing } = useTheme();
  const ctx = useContext(SidebarCtx);
  const collapsed = ctx?.collapsed ?? false;
  const styles = React.useMemo(() => StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 8,
      marginHorizontal: 8,
      marginVertical: 2,
      backgroundColor: selected ? '#E5E7EB' : 'transparent',
    },
    label: {
      marginLeft: icon ? spacing.sm : 0,
      color: colors.textPrimary,
      fontWeight: selected ? '600' : '500',
    },
  }), [colors, spacing, icon, selected]);

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.row, style]}>
        {icon}
        {!collapsed ? <Text style={[styles.label, textStyle]}>{label}</Text> : null}
      </View>
    </Pressable>
  );
};

Sidebar.Header = Header;
Sidebar.Footer = Footer;
Sidebar.Group = Group;
Sidebar.Item = Item;

export default Sidebar;
