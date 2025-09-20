import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Animated, Easing, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  overlayDismiss?: boolean;
}

export interface DialogHeaderProps { children: React.ReactNode; style?: ViewStyle; titleStyle?: TextStyle; subtitleStyle?: TextStyle; title?: string; subtitle?: string; }
export interface DialogContentProps { children: React.ReactNode; style?: ViewStyle; }
export interface DialogFooterProps { children: React.ReactNode; style?: ViewStyle; }

export const Dialog: React.FC<DialogProps> & {
  Header: React.FC<DialogHeaderProps>;
  Content: React.FC<DialogContentProps>;
  Footer: React.FC<DialogFooterProps>;
} = ({ open, onOpenChange, children, overlayDismiss = true }) => {
  const { colors } = useTheme();
  const opacity = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 7 })
      ]).start();
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 120, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start();
      scale.setValue(0.95);
    }
  }, [open]);

  const styles = React.useMemo(() => StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: 12,
      maxWidth: 560,
      width: '100%',
      overflow: 'hidden',
    },
  }), [colors]);

  const dismiss = () => overlayDismiss && onOpenChange(false);

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={() => onOpenChange(false)}>
      <Pressable style={styles.overlay} onPress={dismiss}>
        <Animated.View style={[styles.card, { opacity, transform: [{ scale }] }]}>
          {/* Stop propagation so inner presses don't close */}
          <Pressable onPress={(e) => e.stopPropagation()}>{children}</Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const Header: React.FC<DialogHeaderProps> = ({ children, style, title, subtitle, titleStyle, subtitleStyle }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
    wrap: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.gray200 },
    title: { fontWeight: '600', fontSize: 16, color: colors.textPrimary },
    subtitle: { marginTop: 4, color: colors.textSecondary },
  }), [colors]);
  return (
    <View style={[styles.wrap, style]}>
      {title ? <Text style={[styles.title, titleStyle]}>{title}</Text> : null}
      {subtitle ? <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text> : null}
      {children}
    </View>
  );
};

const Content: React.FC<DialogContentProps> = ({ children, style }) => (
  <View style={[{ paddingHorizontal: 16, paddingVertical: 14 }, style]}>{children}</View>
);

const Footer: React.FC<DialogFooterProps> = ({ children, style }) => (
  <View style={[{ paddingHorizontal: 16, paddingVertical: 12, gap: 8, flexDirection: 'row', justifyContent: 'flex-end' }, style]}>
    {children}
  </View>
);

Dialog.Header = Header;
Dialog.Content = Content;
Dialog.Footer = Footer;

export default Dialog;
