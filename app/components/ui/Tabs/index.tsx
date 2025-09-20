import React, { createContext, useContext } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface TabsContextValue {
  value: string | undefined;
  setValue: (v: string) => void;
}

const TabsCtx = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Tabs: React.FC<TabsProps> & {
  List: React.FC<TabListProps>;
  Trigger: React.FC<TabTriggerProps>;
  Content: React.FC<TabContentProps>;
} = ({ value: valueProp, defaultValue, onValueChange, children, style }) => {
  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue);
  const value = isControlled ? valueProp : internal;

  const setValue = (v: string) => {
    if (!isControlled) setInternal(v);
    onValueChange?.(v);
  };

  return (
    <TabsCtx.Provider value={{ value, setValue }}>
      <View style={style}>{children}</View>
    </TabsCtx.Provider>
  );
};

export interface TabListProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const TabList: React.FC<TabListProps> = ({ children, style }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() =>
    StyleSheet.create({
      list: {
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.gray200,
      },
    }), [colors]
  );
  return <View style={[styles.list, style]}>{children}</View>;
};

export interface TabTriggerProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const TabTrigger: React.FC<TabTriggerProps> = ({ value, children, style, textStyle }) => {
  const { colors, spacing } = useTheme();
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error('Tabs.Trigger must be used within Tabs');
  const selected = ctx.value === value;

  const styles = React.useMemo(() =>
    StyleSheet.create({
      trigger: {
        paddingVertical: 10,
        paddingHorizontal: spacing.md,
        borderBottomWidth: 2,
        borderBottomColor: selected ? colors.primary : 'transparent',
      },
      label: {
        color: selected ? colors.textPrimary : colors.textSecondary,
        fontWeight: selected ? '600' : '500',
      },
    }), [colors, spacing, selected]
  );

  return (
    <Pressable onPress={() => ctx.setValue(value)}>
      <View style={[styles.trigger, style]}>
        <Text style={[styles.label, textStyle]}>{children}</Text>
      </View>
    </Pressable>
  );
};

export interface TabContentProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

const TabContent: React.FC<TabContentProps> = ({ value, children, style }) => {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error('Tabs.Content must be used within Tabs');
  if (ctx.value !== value) return null;
  return <View style={style}>{children}</View>;
};

Tabs.List = TabList;
Tabs.Trigger = TabTrigger;
Tabs.Content = TabContent;

export default Tabs;
