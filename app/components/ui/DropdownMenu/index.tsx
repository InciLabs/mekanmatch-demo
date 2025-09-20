import React, { createContext, useContext } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, TouchableOpacity, type ViewStyle, type TextStyle, type LayoutChangeEvent, findNodeHandle, UIManager } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

interface CtxValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  anchor: { x: number; y: number; w: number; h: number } | null;
  setAnchor: (a: { x: number; y: number; w: number; h: number } | null) => void;
}

const Ctx = createContext<CtxValue | null>(null);

export interface DropdownMenuProps {
  children: React.ReactNode;
}

export const DropdownMenu: React.FC<DropdownMenuProps> & {
  Trigger: React.FC<DropdownMenuTriggerProps>;
  Content: React.FC<DropdownMenuContentProps>;
  Item: React.FC<DropdownMenuItemProps>;
} = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [anchor, setAnchor] = React.useState<CtxValue['anchor']>(null);

  return (
    <Ctx.Provider value={{ open, setOpen, anchor, setAnchor }}>
      {children}
    </Ctx.Provider>
  );
};

export interface DropdownMenuTriggerProps {
  children: React.ReactElement;
}

const Trigger: React.FC<DropdownMenuTriggerProps> = ({ children }) => {
  const ctx = useContext(Ctx);
  const ref = React.useRef<View>(null);
  if (!ctx) throw new Error('DropdownMenu.Trigger must be used within DropdownMenu');

  const onPress = () => {
    const node = findNodeHandle(ref.current);
    if (node) {
      // measureInWindow to get absolute position
      UIManager.measureInWindow(node, (x, y, w, h) => {
        ctx.setAnchor({ x, y, w, h });
        ctx.setOpen(true);
      });
    } else {
      ctx.setOpen(true);
    }
  };

  if (React.isValidElement(children)) {
    return React.cloneElement(children as any, { onPress });
  }
  return children;
};

export interface DropdownMenuContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Content: React.FC<DropdownMenuContentProps> = ({ children, style }) => {
  const ctx = useContext(Ctx);
  const { colors, spacing } = useTheme();
  if (!ctx) throw new Error('DropdownMenu.Content must be used within DropdownMenu');

  const styles = React.useMemo(() => StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    menu: {
      position: 'absolute',
      minWidth: 160,
      backgroundColor: colors.white,
      borderRadius: 8,
      paddingVertical: 6,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 12,
      elevation: 6,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.gray200,
    },
  }), [colors]);

  const top = ctx.anchor ? ctx.anchor.y + ctx.anchor.h + 6 : 100;
  const left = ctx.anchor ? ctx.anchor.x : 24;

  return (
    <Modal transparent visible={ctx.open} animationType="fade" onRequestClose={() => ctx.setOpen(false)}>
      <Pressable style={styles.overlay} onPress={() => ctx.setOpen(false)}>
        <View style={[styles.menu, { top, left }, style]}>{children}</View>
      </Pressable>
    </Modal>
  );
};

export interface DropdownMenuItemProps {
  children: React.ReactNode;
  onPress?: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Item: React.FC<DropdownMenuItemProps> = ({ children, onPress, leading, trailing, style, textStyle }) => {
  const ctx = useContext(Ctx);
  const { colors, spacing } = useTheme();
  if (!ctx) throw new Error('DropdownMenu.Item must be used within DropdownMenu');

  const styles = React.useMemo(() => StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: 10,
    },
    text: {
      color: colors.textPrimary,
      flex: 1,
      marginHorizontal: spacing.sm,
    },
  }), [colors, spacing]);

  const handlePress = () => {
    onPress?.();
    ctx.setOpen(false);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View style={[styles.row, style]}>
        {leading}
        <Text style={[styles.text, textStyle]}>{children}</Text>
        {trailing}
      </View>
    </TouchableOpacity>
  );
};

DropdownMenu.Trigger = Trigger;
DropdownMenu.Content = Content;
DropdownMenu.Item = Item;

export default DropdownMenu;
