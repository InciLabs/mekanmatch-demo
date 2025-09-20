import React, { createContext, useContext } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, UIManager, findNodeHandle, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

interface TooltipCtxValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  anchor: { x: number; y: number; w: number; h: number } | null;
  setAnchor: (a: { x: number; y: number; w: number; h: number } | null) => void;
}

const Ctx = createContext<TooltipCtxValue | null>(null);

export interface TooltipProps {
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> & {
  Trigger: React.FC<TooltipTriggerProps>;
  Content: React.FC<TooltipContentProps>;
} = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [anchor, setAnchor] = React.useState<TooltipCtxValue['anchor']>(null);
  return (
    <Ctx.Provider value={{ open, setOpen, anchor, setAnchor }}>{children}</Ctx.Provider>
  );
};

export interface TooltipTriggerProps {
  children: React.ReactElement;
}

const Trigger: React.FC<TooltipTriggerProps> = ({ children }) => {
  const ctx = useContext(Ctx);
  const ref = React.useRef<View>(null);
  if (!ctx) throw new Error('Tooltip.Trigger must be used within Tooltip');

  const onPressIn = () => {
    const node = findNodeHandle(ref.current);
    if (node) {
      UIManager.measureInWindow(node, (x, y, w, h) => {
        ctx.setAnchor({ x, y, w, h });
        ctx.setOpen(true);
      });
    } else {
      ctx.setOpen(true);
    }
  };

  const onPressOut = () => ctx.setOpen(false);

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
      {children}
    </Pressable>
  );
};

export interface TooltipContentProps {
  text: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  side?: 'top' | 'bottom';
}

const Content: React.FC<TooltipContentProps> = ({ text, style, textStyle, side = 'top' }) => {
  const ctx = useContext(Ctx);
  const { colors, spacing } = useTheme();
  if (!ctx) throw new Error('Tooltip.Content must be used within Tooltip');

  if (!ctx.open || !ctx.anchor) return null;

  const cardStyles = StyleSheet.create({
    card: {
      position: 'absolute',
      maxWidth: 240,
      backgroundColor: colors.gray900,
      paddingHorizontal: spacing.sm,
      paddingVertical: 6,
      borderRadius: 6,
    },
    label: {
      color: colors.white,
      fontSize: 12,
    },
  });

  const top = side === 'top' ? ctx.anchor.y - 8 : ctx.anchor.y + ctx.anchor.h + 8;
  const translateY = side === 'top' ? -8 : 0;
  const left = ctx.anchor.x + ctx.anchor.w / 2 - 120;

  return (
    <Modal transparent visible animationType="fade" onRequestClose={() => ctx.setOpen(false)}>
      <Pressable style={{ flex: 1 }} onPress={() => ctx.setOpen(false)}>
        <View style={[cardStyles.card, { top, left, transform: [{ translateY }] }, style]}>
          <Text style={[cardStyles.label, textStyle]}>{text}</Text>
        </View>
      </Pressable>
    </Modal>
  );
};

Tooltip.Trigger = Trigger;
Tooltip.Content = Content;

export default Tooltip;
