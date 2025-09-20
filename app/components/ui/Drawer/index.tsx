import React from 'react';
import { View, Text, Modal, Animated, Easing, Pressable, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

export type DrawerSide = 'left' | 'right';

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: DrawerSide;
  width?: number; // px width of drawer
  title?: string;
  closeOnBackdropPress?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
  children?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onOpenChange,
  side = 'left',
  width = 300,
  title,
  closeOnBackdropPress = true,
  style,
  contentStyle,
  titleStyle,
  children,
}) => {
  const { colors, spacing } = useTheme();
  const translateX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (open) {
      translateX.setValue(side === 'left' ? -width : width);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [open, side, width]);

  const styles = React.useMemo(() => StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', flexDirection: side === 'left' ? 'row' : 'row-reverse' },
    panel: {
      width,
      backgroundColor: colors.white,
      paddingBottom: spacing.lg,
      borderTopLeftRadius: side === 'right' ? 16 : 0,
      borderBottomLeftRadius: side === 'right' ? 16 : 0,
      borderTopRightRadius: side === 'left' ? 16 : 0,
      borderBottomRightRadius: side === 'left' ? 16 : 0,
    },
    header: { paddingHorizontal: spacing.md, paddingVertical: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.gray200 },
    title: { fontWeight: '600', color: colors.textPrimary, fontSize: 16 },
    content: { padding: spacing.md },
  }), [colors, spacing, side, width]);

  const onBackdropPress = () => {
    if (closeOnBackdropPress) onOpenChange(false);
  };

  return (
    <Modal transparent visible={open} animationType="fade" onRequestClose={() => onOpenChange(false)}>
      <Pressable style={styles.overlay} onPress={onBackdropPress}>
        <Animated.View style={[styles.panel, style, { transform: [{ translateX: translateX.interpolate({ inputRange: [-width, 0, width], outputRange: [0, 0, 0] }) }] }]}>
          {title ? (
            <View style={styles.header}>
              <Text style={[styles.title, titleStyle]}>{title}</Text>
            </View>
          ) : null}
          <View style={[styles.content, contentStyle]}>{children}</View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export default Drawer;
