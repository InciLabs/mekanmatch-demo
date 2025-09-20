import React from 'react';
import { View, StyleSheet, PanResponder, LayoutChangeEvent, type ViewStyle, type TextStyle, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export interface SliderProps {
  value?: number; // controlled
  defaultValue?: number; // uncontrolled
  onValueChange?: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  style?: ViewStyle;
  trackStyle?: ViewStyle;
  filledTrackStyle?: ViewStyle;
  thumbStyle?: ViewStyle;
  showValue?: boolean;
  formatValue?: (v: number) => string;
}

export const Slider: React.FC<SliderProps> = ({
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  style,
  trackStyle,
  filledTrackStyle,
  thumbStyle,
  showValue = false,
  formatValue,
}) => {
  const { colors, spacing } = useTheme();
  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const value = isControlled ? (valueProp as number) : internal;
  const [trackWidth, setTrackWidth] = React.useState(0);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const snap = (v: number) => Math.round(v / step) * step;
  const pct = max === min ? 0 : (clamp(value) - min) / (max - min);

  const handleChange = (next: number) => {
    const clamped = clamp(snap(next));
    if (!isControlled) setInternal(clamped);
    onValueChange?.(clamped);
  };

  const pan = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (evt, gesture) => {
        if (trackWidth <= 0) return;
        const x = gesture.x0 - trackLeft.current;
        const ratio = Math.min(1, Math.max(0, x / trackWidth));
        handleChange(min + ratio * (max - min));
      },
      onPanResponderMove: (evt, gesture) => {
        if (trackWidth <= 0) return;
        const x = gesture.moveX - trackLeft.current;
        const ratio = Math.min(1, Math.max(0, x / trackWidth));
        handleChange(min + ratio * (max - min));
      },
    })
  ).current;

  const trackLeft = React.useRef(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, x } = e.nativeEvent.layout as any;
    setTrackWidth(width);
    trackLeft.current = e.nativeEvent.layout.x;
  };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        wrap: { width: '100%' },
        track: {
          height: 6,
          borderRadius: 9999,
          backgroundColor: colors.gray200,
          overflow: 'hidden',
        },
        filled: {
          height: '100%',
          width: `${pct * 100}%`,
          backgroundColor: colors.primary,
        },
        thumb: {
          position: 'absolute',
          top: -8,
          left: Math.max(0, pct * (trackWidth || 0) - 10),
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: colors.white,
          borderWidth: 2,
          borderColor: colors.primary,
          elevation: 2,
        },
        value: { marginTop: spacing.xs, color: colors.textSecondary, fontSize: 12 },
      }),
    [colors, pct, trackWidth, spacing]
  );

  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.track, trackStyle]} onLayout={onLayout} {...pan.panHandlers}>
        <View style={[styles.filled, filledTrackStyle]} />
        <View style={[styles.thumb, thumbStyle]} />
      </View>
      {showValue ? <Text style={styles.value}>{formatValue ? formatValue(value) : value.toString()}</Text> : null}
    </View>
  );
};

export default Slider;
