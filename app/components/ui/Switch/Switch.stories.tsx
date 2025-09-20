// @ts-nocheck
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Switch } from '.';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

export default {
  title: 'Components/UI/Switch',
  component: Switch,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Controlled = () => {
  const [value, setValue] = React.useState(false);
  return (
    <View style={styles.row}>
      <Switch value={value} onValueChange={setValue} />
      <Text>{value ? 'On' : 'Off'}</Text>
    </View>
  );
};

export const Colors = () => {
  const [a, setA] = React.useState(true);
  const [b, setB] = React.useState(false);
  return (
    <>
      <View style={styles.row}>
        <Text>Primary</Text>
        <Switch value={a} onValueChange={setA} />
      </View>
      <View style={styles.row}>
        <Text>Secondary (trackColor override)</Text>
        <Switch
          value={b}
          onValueChange={setB}
          trackColor={{ false: '#9CA3AF', true: '#10B981' }}
        />
      </View>
    </>
  );
};
