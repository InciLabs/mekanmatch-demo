import React, { createContext, useContext } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, UIManager, findNodeHandle, type ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface PopoverContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  anchor: { x: number; y: number; w: number; h: number } | null;
  setAnchor: (a: { x: number; y: number; w: number; h: number } | null) => void;
}

const Ctx = createContext<PopoverContextValue | null>(null);

export interface PopoverProps {
  children: React.ReactNode;
}

export const Popover: React.FC<PopoverProps> & {
  Trigger: React.FC<PopoverTriggerProps>;
  Content: React.FC<PopoverContentProps>;
  Arrow: React.FC<PopoverArrowProps>;
} = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [anchor, setAnchor] = React.useState<PopoverContextValue['anchor']>(null);

  return (
    <Ctx.Provider value={{ open, setOpen, anchor, setAnchor }}>{children}</Ctx.Provider>
  );
};

export interface PopoverTriggerProps {
  children: React.ReactElement;
}

const Trigger: React.FC<PopoverTriggerProps> = ({ children }) => {
  const ctx = useContext(Ctx);
  const ref = React.useRef<View>(null);
  if (!ctx) throw new Error('Popover.Trigger must be used within Popover');

  const onPress = () => {
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

  return React.cloneElement(children, { ref, onPress });
};

export interface PopoverContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  align?: 'center' | 'start' | 'end';
}

const Content: React.FC<PopoverContentProps> = ({ children, style, align = 'center' }) => {
  const ctx = useContext(Ctx);
  const { colors, spacing } = useTheme();
  if (!ctx) throw new Error('Popover.Content must be used within Popover');

  const styles = React.useMemo(() => StyleSheet.create({
    overlay: { flex: 1 },
    card: {
      position: 'absolute',
      minWidth: 200,
      backgroundColor: colors.white,
      borderRadius: 12,
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

  if (!ctx.open) return null;

  const top = (ctx.anchor?.y ?? 120) + (ctx.anchor?.h ?? 0) + 8;
  let left = ctx.anchor?.x ?? 24;
  if (align === 'center' && ctx.anchor) {
    left = ctx.anchor.x + ctx.anchor.w / 2 - 100; // center for minWidth 200
  } else if (align === 'end' && ctx.anchor) {
    left = ctx.anchor.x + ctx.anchor.w - 200;
  }

  return (
    <Modal transparent visible animationType="fade" onRequestClose={() => ctx.setOpen(false)}>
      <Pressable style={styles.overlay} onPress={() => ctx.setOpen(false)}>
        <View style={[styles.card, { top, left }, style]}>{children}</View>
      </Pressable>
    </Modal>
  );
};

export interface PopoverArrowProps { size?: number; style?: ViewStyle }

const Arrow: React.FC<PopoverArrowProps> = ({ size = 10, style }) => {
  // Simple square rotated 45deg to mimic arrow
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: 'white',
        transform: [{ rotate: '45deg' }],
        position: 'absolute',
        top: -size / 2,
        left: 94, // centered for 200 width card
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#E5E7EB',
        ...style,
      }}
    />
  );
};

Popover.Trigger = Trigger;
Popover.Content = Content;
Popover.Arrow = Arrow;

export default Popover;
