import React from 'react';
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export interface SimpleBarDatum {
  label: string;
  value: number;
}

export interface SimpleBarChartProps {
  data: SimpleBarDatum[];
  height?: number;
  barColor?: string;
  showValues?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  height = 180,
  barColor,
  showValues = true,
  style,
  labelStyle,
  valueStyle,
}) => {
  const { colors, spacing } = useTheme();
  const max = Math.max(1, ...data.map((d) => d.value));

  const styles = React.useMemo(() => StyleSheet.create({
    wrap: { width: '100%', height },
    row: { flexDirection: 'row', alignItems: 'flex-end', height: height - 28, gap: spacing.sm },
    barWrap: { flex: 1, alignItems: 'center' },
    bar: { width: '70%', borderTopLeftRadius: 6, borderTopRightRadius: 6, backgroundColor: barColor || colors.primary },
    labels: { flexDirection: 'row', gap: spacing.sm, marginTop: 6 },
    label: { flex: 1, textAlign: 'center', color: colors.textSecondary, fontSize: 12 },
    value: { marginBottom: 4, color: colors.textSecondary, fontSize: 12 },
  }), [height, spacing, colors, barColor]);

  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.row}>
        {data.map((d, i) => (
          <View key={i} style={styles.barWrap}>
            {showValues ? <Text style={[styles.value, valueStyle]}>{d.value}</Text> : null}
            <View style={[styles.bar, { height: (d.value / max) * (height - 48) }]} />
          </View>
        ))}
      </View>
      <View style={styles.labels}>
        {data.map((d, i) => (
          <Text key={i} numberOfLines={1} style={[styles.label, labelStyle]}>{d.label}</Text>
        ))}
      </View>
    </View>
  );
};

export default SimpleBarChart;
