import React from 'react';
import { View, StyleSheet, Animated, Easing, type ViewStyle } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

export type SkeletonVariant = 'text' | 'rect' | 'circle';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: ViewStyle;
  shimmer?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rect',
  width,
  height,
  radius,
  style,
  shimmer = true,
}) => {
  const { colors } = useTheme();
  const shimmerX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!shimmer) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerX, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(shimmerX, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const baseWidth = width ?? (variant === 'text' ? '60%' : '100%');
  const baseHeight = height ?? (variant === 'text' ? 12 : 16);
  const borderRadius = radius ?? (variant === 'circle' ? 9999 : 8);

  const styles = StyleSheet.create({
    container: {
      overflow: 'hidden',
      backgroundColor: colors.gray200,
      borderRadius,
      width: baseWidth as any,
      height: baseHeight as any,
    },
    shimmer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '30%',
      backgroundColor: colors.gray100,
      opacity: 0.6,
      transform: [{ translateX: 0 }],
    },
  });

  const translateX = shimmerX.interpolate({ inputRange: [0, 1], outputRange: [-200, 200] });

  return (
    <View style={[styles.container, style]}>
      {shimmer ? (
        <Animated.View style={[styles.shimmer, { transform: [{ translateX }] }]} />
      ) : null}
    </View>
  );
};

export default Skeleton;
