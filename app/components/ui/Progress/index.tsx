import React from 'react';
import { View, Animated, StyleSheet, type ViewStyle, type TextStyle, Text } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

export interface ProgressProps {
  value?: number; // 0-100
  label?: string;
  showLabel?: boolean;
  style?: ViewStyle;
  trackStyle?: ViewStyle;
  indicatorStyle?: ViewStyle;
  animated?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value = 0,
  label,
  showLabel = false,
  style,
  trackStyle,
  indicatorStyle,
  animated = true,
}) => {
  const { colors } = useTheme();
  const clamped = Math.max(0, Math.min(100, value));
  const anim = React.useRef(new Animated.Value(clamped)).current;

  React.useEffect(() => {
    if (animated) {
      Animated.timing(anim, {
        toValue: clamped,
        duration: 250,
        useNativeDriver: false,
      }).start();
    } else {
      anim.setValue(clamped);
    }
  }, [clamped, animated]);

  const widthInterpolate = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  const styles = StyleSheet.create({
    wrap: {
      width: '100%',
    },
    track: {
      height: 10,
      borderRadius: 9999,
      backgroundColor: colors.gray200,
      overflow: 'hidden',
    },
    indicator: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 9999,
      width: '0%',
    },
    text: {
      marginTop: 6,
      color: colors.textSecondary,
      fontSize: 12,
    },
  });

  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.indicator, { width: widthInterpolate }, indicatorStyle]} />
      </View>
      {showLabel ? (
        <Text style={styles.text}>{label ?? `${clamped}%`}</Text>
      ) : null}
    </View>
  );
};

export default Progress;
