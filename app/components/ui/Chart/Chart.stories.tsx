import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SimpleBarChart } from './Chart';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
});

export default {
  title: 'Components/UI/Chart',
  component: SimpleBarChart,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

const DATA = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 18 },
  { label: 'Wed', value: 7 },
  { label: 'Thu', value: 22 },
  { label: 'Fri', value: 9 },
];

export const Basic = () => (
  <SimpleBarChart data={DATA} />
);
