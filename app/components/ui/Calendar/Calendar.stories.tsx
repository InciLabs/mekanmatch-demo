import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Calendar } from './Calendar';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
});

export default {
  title: 'Components/UI/Calendar',
  component: Calendar,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const CurrentMonth = () => {
  const [selected, setSelected] = React.useState<Date | undefined>();
  return (
    <>
      <Calendar selectedDate={selected} onSelectDate={setSelected} />
      <Text>Selected: {selected ? selected.toDateString() : 'None'}</Text>
    </>
  );
};

export const SpecificMonth = () => (
  <Calendar month={new Date(2025, 0, 1)} />
);

export const WithNavigation = () => {
  const [month, setMonth] = React.useState<Date>(new Date());
  return (
    <Calendar month={month} onMonthChange={setMonth} showNavigation />
  );
};

export const RangeSelection = () => {
  const [start, setStart] = React.useState<Date | undefined>();
  const [end, setEnd] = React.useState<Date | undefined>();
  return (
    <>
      <Calendar selectRange rangeStart={start} rangeEnd={end} onRangeChange={(s, e) => { setStart(s); setEnd(e); }} showNavigation />
      <Text>Start: {start ? start.toDateString() : '—'} | End: {end ? end.toDateString() : '—'}</Text>
    </>
  );
};
