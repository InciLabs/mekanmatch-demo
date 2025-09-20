import React, { createContext, useContext } from 'react';
import { View, Modal, Pressable, StyleSheet, UIManager, findNodeHandle, GestureResponderEvent, Text, TouchableOpacity, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

interface CtxValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  anchor: { x: number; y: number } | null;
  setAnchor: (a: { x: number; y: number } | null) => void;
}

const Ctx = createContext<CtxValue | null>(null);

export interface ContextMenuProps {
  children: React.ReactNode;
}

export const ContextMenu: React.FC<ContextMenuProps> & {
  Trigger: React.FC<ContextMenuTriggerProps>;
  Content: React.FC<ContextMenuContentProps>;
  Item: React.FC<ContextMenuItemProps>;
} = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [anchor, setAnchor] = React.useState<CtxValue['anchor']>(null);

  return (
    <Ctx.Provider value={{ open, setOpen, anchor, setAnchor }}>{children}</Ctx.Provider>
  );
};

export interface ContextMenuTriggerProps {
  children: React.ReactElement;
}

const Trigger: React.FC<ContextMenuTriggerProps> = ({ children }) => {
  const ctx = useContext(Ctx);
  const ref = React.useRef<View>(null);
  if (!ctx) throw new Error('ContextMenu.Trigger must be used within ContextMenu');

  const onLongPress = (e: GestureResponderEvent) => {
    const pageX = e.nativeEvent.pageX;
    const pageY = e.nativeEvent.pageY;
    ctx.setAnchor({ x: pageX, y: pageY });
    ctx.setOpen(true);
  };

  if (React.isValidElement(children)) {
    return React.cloneElement(children as any, { onLongPress });
  }
  return children;
};

export interface ContextMenuContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Content: React.FC<ContextMenuContentProps> = ({ children, style }) => {
  const ctx = useContext(Ctx);
  const { colors } = useTheme();
  if (!ctx) throw new Error('ContextMenu.Content must be used within ContextMenu');

  const styles = React.useMemo(() => StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'transparent' },
    menu: {
      position: 'absolute',
      minWidth: 180,
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

  if (!ctx.open || !ctx.anchor) return null;

  const top = ctx.anchor.y;
  const left = ctx.anchor.x;

  return (
    <Modal transparent visible animationType="fade" onRequestClose={() => ctx.setOpen(false)}>
      <Pressable style={styles.overlay} onPress={() => ctx.setOpen(false)}>
        <View style={[styles.menu, { top, left }, style]}>{children}</View>
      </Pressable>
    </Modal>
  );
};

export interface ContextMenuItemProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

const Item: React.FC<ContextMenuItemProps> = ({ children, onPress, style, textStyle, leading, trailing }) => {
  const { colors, spacing } = useTheme();
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('ContextMenu.Item must be used within ContextMenu');

  const styles = React.useMemo(() => StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 10 },
    text: { color: colors.textPrimary, flex: 1, marginHorizontal: spacing.sm },
  }), [colors, spacing]);

  const handlePress = () => {
    onPress?.();
    ctx.setOpen(false);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
      <View style={[styles.row, style]}>
        {leading}
        <Text style={[styles.text, textStyle]}>{children}</Text>
        {trailing}
      </View>
    </TouchableOpacity>
  );
};

ContextMenu.Trigger = Trigger;
ContextMenu.Content = Content;
ContextMenu.Item = Item;

export default ContextMenu;
