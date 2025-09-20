import React from 'react';
import { View, StyleSheet, PanResponder, type ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export interface ResizableProps {
  initialSize?: number; // pixels for primary pane
  min?: number;
  max?: number; // max primary size
  horizontal?: boolean; // false => vertical split (left/right). true => top/bottom
  style?: ViewStyle;
  primaryStyle?: ViewStyle;
  secondaryStyle?: ViewStyle;
  handleStyle?: ViewStyle;
  children: [React.ReactNode, React.ReactNode];
}

export const Resizable: React.FC<ResizableProps> = ({
  initialSize = 200,
  min = 100,
  max = 500,
  horizontal = false,
  style,
  primaryStyle,
  secondaryStyle,
  handleStyle,
  children,
}) => {
  const { colors } = useTheme();
  const [size, setSize] = React.useState(initialSize);

  const pan = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gesture) => {
        const delta = horizontal ? gesture.dy : gesture.dx;
        setSize((s) => Math.max(min, Math.min(max, s + delta)));
      },
    })
  ).current;

  const styles = React.useMemo(() => StyleSheet.create({
    wrap: { flex: 1, flexDirection: horizontal ? 'column' : 'row' },
    primary: horizontal ? { height: size } : { width: size },
    secondary: { flex: 1 },
    handle: {
      backgroundColor: colors.gray200,
      width: horizontal ? '100%' : 8,
      height: horizontal ? 8 : '100%',
      cursor: horizontal ? 'ns-resize' as any : 'ew-resize' as any,
    },
  }), [horizontal, size, colors]);

  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.primary, primaryStyle]}>{children[0]}</View>
      <View style={[styles.handle, handleStyle]} {...pan.panHandlers} />
      <View style={[styles.secondary, secondaryStyle]}>{children[1]}</View>
    </View>
  );
};

export default Resizable;
