import React from 'react';
import { View, Text, StyleSheet, Pressable, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

export interface CalendarProps {
  month?: Date; // first day of month is used
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  onMonthChange?: (month: Date) => void;
  selectRange?: boolean;
  rangeStart?: Date;
  rangeEnd?: Date;
  onRangeChange?: (start: Date | undefined, end: Date | undefined) => void;
  style?: ViewStyle;
  dayStyle?: ViewStyle;
  dayTextStyle?: TextStyle;
  showWeekdays?: boolean;
  showNavigation?: boolean;
}

function getMonthMatrix(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const startIdx = (first.getDay() + 6) % 7; // make Monday=0
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startIdx; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), d));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

export const Calendar: React.FC<CalendarProps> = ({
  month: monthProp,
  selectedDate,
  onSelectDate,
  onMonthChange,
  selectRange = false,
  rangeStart,
  rangeEnd,
  onRangeChange,
  style,
  dayStyle,
  dayTextStyle,
  showWeekdays = true,
  showNavigation = false,
}) => {
  const { colors, spacing } = useTheme();
  const today = new Date();
  const [internalMonth, setInternalMonth] = React.useState(
    monthProp ? new Date(monthProp.getFullYear(), monthProp.getMonth(), 1) : new Date(today.getFullYear(), today.getMonth(), 1)
  );
  // keep in sync if controlled month changes
  React.useEffect(() => {
    if (monthProp) {
      setInternalMonth(new Date(monthProp.getFullYear(), monthProp.getMonth(), 1));
    }
  }, [monthProp?.getFullYear(), monthProp?.getMonth()]);
  const month = internalMonth;
  const matrix = React.useMemo(() => getMonthMatrix(month), [month.getFullYear(), month.getMonth()]);

  const styles = React.useMemo(() => StyleSheet.create({
    wrap: { width: '100%' },
    header: { alignItems: 'center', marginBottom: spacing.sm },
    headerText: { fontWeight: '700', color: colors.textPrimary },
    grid: { flexDirection: 'column', gap: 6 },
    row: { flexDirection: 'row', gap: 6 },
    cell: {
      flex: 1,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.gray200,
    },
    day: { color: colors.textPrimary },
    weekdayRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
    weekdayCell: { flex: 1, alignItems: 'center' },
    weekdayText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
    selected: { backgroundColor: '#EFF6FF', borderColor: '#93C5FD' },
    today: { borderColor: colors.primary },
    inRange: { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' },
    rangeEdge: { backgroundColor: '#DBEAFE', borderColor: '#93C5FD' },
    empty: { flex: 1, aspectRatio: 1 },
  }), [colors, spacing]);

  const monthName = month.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  const prevMonth = () => {
    const next = new Date(month.getFullYear(), month.getMonth() - 1, 1);
    if (!monthProp) setInternalMonth(next);
    onMonthChange?.(next);
  };
  const nextMonth = () => {
    const next = new Date(month.getFullYear(), month.getMonth() + 1, 1);
    if (!monthProp) setInternalMonth(next);
    onMonthChange?.(next);
  };
  const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const isAfter = (a: Date, b: Date) => a.getTime() > b.getTime();
  const isBefore = (a: Date, b: Date) => a.getTime() < b.getTime();

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.header, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
        {showNavigation ? (
          <Text onPress={prevMonth} style={{ color: colors.primary }}>{'<'}</Text>
        ) : <View />}
        <Text style={styles.headerText}>{monthName}</Text>
        {showNavigation ? (
          <Text onPress={nextMonth} style={{ color: colors.primary }}>{'>'}</Text>
        ) : <View />}
      </View>
      {showWeekdays && (
        <View style={styles.weekdayRow}>
          {weekdays.map((w) => (
            <View key={w} style={styles.weekdayCell}><Text style={styles.weekdayText}>{w}</Text></View>
          ))}
        </View>
      )}
      <View style={styles.grid}>
        {matrix.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((d, j) => {
              if (!d) return <View key={j} style={styles.empty} />;
              const isSelected = !selectRange && selectedDate && isSameDay(d, selectedDate);
              let inRange = false;
              let isStart = false;
              let isEnd = false;
              if (selectRange && rangeStart) {
                if (rangeEnd) {
                  const start = isBefore(rangeStart, rangeEnd) ? rangeStart : rangeEnd;
                  const end = isAfter(rangeStart, rangeEnd) ? rangeStart : rangeEnd;
                  inRange = d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
                  isStart = isSameDay(d, start);
                  isEnd = isSameDay(d, end);
                } else {
                  isStart = isSameDay(d, rangeStart);
                }
              }
              const isToday = isSameDay(d, today);
              const onPress = () => {
                if (!selectRange) {
                  onSelectDate?.(d);
                } else {
                  if (!rangeStart || (rangeStart && rangeEnd)) {
                    onRangeChange?.(d, undefined);
                  } else {
                    onRangeChange?.(rangeStart, d);
                  }
                }
              };
              return (
                <Pressable key={j} onPress={onPress} style={[
                  styles.cell,
                  isSelected && styles.selected,
                  selectRange && inRange && styles.inRange,
                  selectRange && (isStart || isEnd) && styles.rangeEdge,
                  isToday && styles.today,
                  dayStyle
                ]}>
                  <Text style={[styles.day, dayTextStyle]}>{d.getDate()}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Calendar;
