import React from 'react';
import { View, Text, ScrollView, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

export interface TableProps {
  children: React.ReactNode;
  style?: ViewStyle;
  headerSticky?: boolean;
  height?: number;
}

export interface TableHeaderProps { children: React.ReactNode; style?: ViewStyle }
export interface TableRowProps { children: React.ReactNode; style?: ViewStyle }
export interface TableCellProps { children: React.ReactNode; style?: ViewStyle; textStyle?: TextStyle; width?: number }

export const Table: React.FC<TableProps> & {
  Header: React.FC<TableHeaderProps>;
  Row: React.FC<TableRowProps>;
  Cell: React.FC<TableCellProps>;
} = ({ children, style, headerSticky = false, height = 280 }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
    wrap: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.gray200,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: colors.white,
    },
    header: {
      backgroundColor: '#F9FAFB',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.gray200,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  }), [colors]);

  const headerEl = React.Children.toArray(children).find((child: any) => child?.type?.displayName === 'TableHeader');
  const bodyEls = React.Children.toArray(children).filter((child: any) => child?.type?.displayName !== 'TableHeader');

  return (
    <View style={[styles.wrap, style]}>
      {headerSticky ? (
        <View style={[styles.header]}>{headerEl}</View>
      ) : null}
      <ScrollView horizontal>
        <ScrollView style={{ height }}>
          {!headerSticky ? headerEl : null}
          {bodyEls}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const Header: React.FC<TableHeaderProps> = ({ children, style }) => {
  const { colors, spacing } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
    row: { flexDirection: 'row', backgroundColor: '#F9FAFB', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.gray200 },
    cell: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, fontWeight: '600', color: '#111827' },
  }), [colors, spacing]);
  return (
    <View style={[styles.row, style]}>
      {React.Children.map(children, (child: any) => (
        <View style={{ width: child?.props?.width ?? 160 }}>
          <Text style={styles.cell}>{child?.props?.children}</Text>
        </View>
      ))}
    </View>
  );
};
Header.displayName = 'TableHeader';

const Row: React.FC<TableRowProps> = ({ children, style }) => {
  const styles = React.useMemo(() => StyleSheet.create({ row: { flexDirection: 'row' } }), []);
  return <View style={[styles.row, style]}>{children}</View>;
};
Row.displayName = 'TableRow';

const Cell: React.FC<TableCellProps> = ({ children, style, textStyle, width = 160 }) => {
  const { colors, spacing } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
    wrap: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.gray200 },
    text: { color: colors.textPrimary },
  }), [colors, spacing]);
  return (
    <View style={[styles.wrap, style, { width }]}> 
      <Text style={[styles.text, textStyle]} numberOfLines={1}>{children as any}</Text>
    </View>
  );
};
Cell.displayName = 'TableCell';

Table.Header = Header;
Table.Row = Row;
Table.Cell = Cell;

export default Table;
