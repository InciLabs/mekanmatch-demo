import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

export type SeparatorOrientation = 'horizontal' | 'vertical';

export interface SeparatorProps {
  orientation?: SeparatorOrientation;
  thickness?: number;
  color?: string;
  inset?: number; // padding from the leading edge (left for horizontal, top for vertical)
  style?: ViewStyle;
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  thickness,
  color,
  inset = 0,
  style,
}) => {
  const { colors } = useTheme();
  const isHorizontal = orientation === 'horizontal';

  const defaultThickness = thickness ?? StyleSheet.hairlineWidth;
  const separatorColor = color ?? colors.gray200;

  const styles = React.useMemo(() =>
    StyleSheet.create({
      base: {
        backgroundColor: separatorColor,
      },
      horizontal: {
        height: defaultThickness,
        width: '100%',
        marginLeft: inset,
      },
      vertical: {
        width: defaultThickness,
        height: '100%',
        marginTop: inset,
      },
    }), [separatorColor, defaultThickness, inset]
  );

  return (
    <View
      accessibilityRole="none"
      style={[styles.base, isHorizontal ? styles.horizontal : styles.vertical, style]}
    />
  );
};

export default Separator;
