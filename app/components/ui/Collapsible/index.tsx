import React from 'react';
import { View, Animated, StyleSheet, Pressable, Text, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export interface CollapsibleProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: ViewStyle;
  children: React.ReactNode;
}

export interface CollapsibleTriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export interface CollapsibleContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Ctx = React.createContext<{ open: boolean; toggle: () => void } | null>(null);

export const Collapsible: React.FC<CollapsibleProps> & {
  Trigger: React.FC<CollapsibleTriggerProps>;
  Content: React.FC<CollapsibleContentProps>;
} = ({ open: openProp, defaultOpen = false, onOpenChange, style, children }) => {
  const isControlled = openProp !== undefined;
  const [internal, setInternal] = React.useState(defaultOpen);
  const open = isControlled ? (openProp as boolean) : internal;

  const toggle = () => {
    const next = !open;
    if (!isControlled) setInternal(next);
    onOpenChange?.(next);
  };

  return (
    <Ctx.Provider value={{ open, toggle }}>
      <View style={style}>{children}</View>
    </Ctx.Provider>
  );
};

const Trigger: React.FC<CollapsibleTriggerProps> = ({ children, style }) => {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error('Collapsible.Trigger must be used within Collapsible');
  return (
    <Pressable onPress={ctx.toggle}>
      <View style={style}>{children}</View>
    </Pressable>
  );
};

const Content: React.FC<CollapsibleContentProps> = ({ children, style }) => {
  const ctx = React.useContext(Ctx);
  const { spacing } = useTheme();
  if (!ctx) throw new Error('Collapsible.Content must be used within Collapsible');

  const [measured, setMeasured] = React.useState(0);
  const ref = React.useRef<View>(null);
  const height = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (ctx.open) {
      Animated.timing(height, { toValue: measured, duration: 200, useNativeDriver: false }).start();
    } else {
      Animated.timing(height, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    }
  }, [ctx.open, measured]);

  return (
    <Animated.View style={[{ height, overflow: 'hidden' }, style]}> 
      <View
        ref={ref}
        onLayout={(e) => setMeasured(e.nativeEvent.layout.height)}
        style={{ paddingTop: spacing.xs }}
      >
        {children}
      </View>
    </Animated.View>
  );
};

Collapsible.Trigger = Trigger;
Collapsible.Content = Content;

export default Collapsible;
