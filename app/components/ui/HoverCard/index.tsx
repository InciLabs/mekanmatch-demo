import React, { createContext, useContext } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, UIManager, findNodeHandle, type ViewStyle } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

interface CtxValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  anchor: { x: number; y: number; w: number; h: number } | null;
  setAnchor: (a: { x: number; y: number; w: number; h: number } | null) => void;
}

const Ctx = createContext<CtxValue | null>(null);

export interface HoverCardProps {
  children: React.ReactNode;
}

export const HoverCard: React.FC<HoverCardProps> & {
  Trigger: React.FC<HoverCardTriggerProps>;
  Content: React.FC<HoverCardContentProps>;
} = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [anchor, setAnchor] = React.useState<CtxValue['anchor']>(null);
  return (
    <Ctx.Provider value={{ open, setOpen, anchor, setAnchor }}>{children}</Ctx.Provider>
  );
};

export interface HoverCardTriggerProps { children: React.ReactElement; }

const Trigger: React.FC<HoverCardTriggerProps> = ({ children }) => {
  const ctx = useContext(Ctx);
  const ref = React.useRef<View>(null);
  if (!ctx) throw new Error('HoverCard.Trigger must be used within HoverCard');

  // In RN, simulate hover via onPressIn/onPressOut for demo purposes
  const setAnchorFromRef = () => {
    const node = findNodeHandle(ref.current);
    if (node) {
      UIManager.measureInWindow(node, (x, y, w, h) => ctx.setAnchor({ x, y, w, h }));
    }
  };

  const onPressIn = () => {
    setAnchorFromRef();
    ctx.setOpen(true);
  };
  const onPressOut = () => ctx.setOpen(false);

  return (
    <Pressable ref={ref as any} onPressIn={onPressIn} onPressOut={onPressOut}>
      {children}
    </Pressable>
  );
};

export interface HoverCardContentProps { children: React.ReactNode; style?: ViewStyle; align?: 'start' | 'center' | 'end' }

const Content: React.FC<HoverCardContentProps> = ({ children, style, align = 'center' }) => {
  const ctx = useContext(Ctx);
  const { colors, spacing } = useTheme();
  if (!ctx) throw new Error('HoverCard.Content must be used within HoverCard');
  if (!ctx.open || !ctx.anchor) return null;

  const styles = React.useMemo(() => StyleSheet.create({
    overlay: { flex: 1 },
    card: {
      position: 'absolute',
      minWidth: 220,
      backgroundColor: colors.white,
      borderRadius: 10,
      padding: spacing.md,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 12,
      elevation: 6,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.gray200,
    },
  }), [colors, spacing]);

  const top = ctx.anchor.y + ctx.anchor.h + 8;
  let left = ctx.anchor.x;
  if (align === 'center') left = ctx.anchor.x + ctx.anchor.w / 2 - 110;
  if (align === 'end') left = ctx.anchor.x + ctx.anchor.w - 220;

  return (
    <Modal transparent visible animationType="fade" onRequestClose={() => ctx.setOpen(false)}>
      <Pressable style={styles.overlay} onPress={() => ctx.setOpen(false)}>
        <View style={[styles.card, { top, left }, style]}>{children}</View>
      </Pressable>
    </Modal>
  );
};

HoverCard.Trigger = Trigger;
HoverCard.Content = Content;

export default HoverCard;
