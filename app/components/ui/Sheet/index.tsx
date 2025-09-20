import React from 'react';
import { View, Text, Modal, Animated, StyleSheet, Pressable, Easing, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  closeOnBackdropPress?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
}

export const Sheet: React.FC<SheetProps> & {
  Header: React.FC<SheetHeaderProps>;
  Content: React.FC<SheetContentProps>;
  Footer: React.FC<SheetFooterProps>;
} = ({ open, onOpenChange, children, title, closeOnBackdropPress = true, style, contentStyle, titleStyle }) => {
  const { colors, spacing } = useTheme();
  const translateY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (open) {
      translateY.setValue(300);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [open]);

  const styles = React.useMemo(() => StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: colors.white,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingBottom: spacing.lg,
    },
    dragHandle: {
      alignSelf: 'center',
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.gray300,
      marginVertical: spacing.sm,
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.sm,
    },
    headerTitle: {
      fontWeight: '600',
      color: colors.textPrimary,
      fontSize: 16,
    },
    content: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
    },
    footer: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
    },
  }), [colors, spacing]);

  const handleBackdrop = () => {
    if (!closeOnBackdropPress) return;
    onOpenChange(false);
  };

  return (
    <Modal visible={open} animationType="fade" transparent onRequestClose={() => onOpenChange(false)}>
      <Pressable style={styles.overlay} onPress={handleBackdrop}>
        <Animated.View
          style={[styles.sheet, style, { transform: [{ translateY }] }]}
        >
          <View style={styles.dragHandle} />
          {title ? (
            <View style={styles.header}>
              <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
            </View>
          ) : null}
          <View style={[styles.content, contentStyle]}>{children}</View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export interface SheetHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const SheetHeader: React.FC<SheetHeaderProps> = ({ children, style }) => {
  return <View style={style}>{children}</View>;
};

export interface SheetContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const SheetContent: React.FC<SheetContentProps> = ({ children, style }) => {
  return <View style={style}>{children}</View>;
};

export interface SheetFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const SheetFooter: React.FC<SheetFooterProps> = ({ children, style }) => {
  return <View style={style}>{children}</View>;
};

Sheet.Header = SheetHeader;
Sheet.Content = SheetContent;
Sheet.Footer = SheetFooter;

export default Sheet;
