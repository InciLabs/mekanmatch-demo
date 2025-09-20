import React from 'react';
import { View, Text, Pressable, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  style?: ViewStyle;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  showEdges?: boolean; // show first/last buttons
  maxButtons?: number; // max numeric buttons
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  style,
  buttonStyle,
  textStyle,
  showEdges = true,
  maxButtons = 5,
}) => {
  const { colors, spacing } = useTheme();
  const page = Math.max(1, Math.min(totalPages, currentPage));
  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, page - half);
  let end = Math.min(totalPages, start + maxButtons - 1);
  start = Math.max(1, Math.min(start, end - maxButtons + 1));

  const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const styles = React.useMemo(() => StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    chip: {
      minWidth: 36,
      height: 36,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.gray300,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.sm,
    },
    chipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    label: { color: colors.textPrimary, fontWeight: '500' },
    labelActive: { color: '#ffffff' },
    disabled: { opacity: 0.5 },
  }), [colors, spacing]);

  const goto = (p: number) => onPageChange(Math.max(1, Math.min(totalPages, p)));

  return (
    <View style={[styles.row, style]}>
      {showEdges && (
        <Pressable onPress={() => goto(1)} disabled={page === 1}>
          <View style={[styles.chip, page === 1 && styles.disabled, buttonStyle]}>
            <Text style={styles.label}>{'<<'}</Text>
          </View>
        </Pressable>
      )}
      <Pressable onPress={() => goto(page - 1)} disabled={page === 1}>
        <View style={[styles.chip, page === 1 && styles.disabled, buttonStyle]}>
          <Text style={styles.label}>{'<'}</Text>
        </View>
      </Pressable>

      {range.map((p) => {
        const active = p === page;
        return (
          <Pressable key={p} onPress={() => goto(p)}>
            <View style={[styles.chip, active && styles.chipActive, buttonStyle]}>
              <Text style={[styles.label, active && styles.labelActive, textStyle]}>{p}</Text>
            </View>
          </Pressable>
        );
      })}

      <Pressable onPress={() => goto(page + 1)} disabled={page === totalPages}>
        <View style={[styles.chip, page === totalPages && styles.disabled, buttonStyle]}>
          <Text style={styles.label}>{'>'}</Text>
        </View>
      </Pressable>
      {showEdges && (
        <Pressable onPress={() => goto(totalPages)} disabled={page === totalPages}>
          <View style={[styles.chip, page === totalPages && styles.disabled, buttonStyle]}>
            <Text style={styles.label}>{'>>'}</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
};

export default Pagination;
