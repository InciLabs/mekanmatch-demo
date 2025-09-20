// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Select } from '.';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
});

export default {
  title: 'Components/UI/Select',
  component: Select,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
];

export const Uncontrolled = () => (
  <Select options={OPTIONS} placeholder="Pick a fruit" />
);

export const Controlled = () => {
  const [value, setValue] = React.useState<string | undefined>('banana');
  return (
    <Select options={OPTIONS} value={value} onValueChange={setValue} />
  );
};

export const Disabled = () => (
  <Select options={OPTIONS} placeholder="Disabled" disabled />
);
