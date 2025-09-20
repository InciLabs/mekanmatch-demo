import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions, type ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export interface CarouselProps {
  children: React.ReactNode[] | React.ReactNode;
  style?: ViewStyle;
  height?: number;
  showDots?: boolean;
}

export const Carousel: React.FC<CarouselProps> = ({ children, style, height = 200, showDots = true }) => {
  const { colors, spacing } = useTheme();
  const items = React.Children.toArray(children);
  const width = Dimensions.get('window').width - 32; // assuming 16px padding in stories
  const [index, setIndex] = React.useState(0);

  const onScroll = (e: any) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / width);
    setIndex(i);
  };

  const styles = React.useMemo(() => StyleSheet.create({
    wrap: { width, height },
    dots: { flexDirection: 'row', gap: 6, justifyContent: 'center', marginTop: spacing.sm },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gray300 },
    dotActive: { backgroundColor: colors.primary },
  }), [width, height, colors, spacing]);

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={[styles.wrap, style]}
      >
        {items.map((child, i) => (
          <View key={i} style={{ width, height }}>
            {child}
          </View>
        ))}
      </ScrollView>
      {showDots && (
        <View style={styles.dots}>
          {items.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
};

export default Carousel;
