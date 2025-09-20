// @ts-nocheck
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Checkbox } from '.';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default {
  title: 'Components/UI/Checkbox',
  component: Checkbox,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Uncontrolled = () => (
  <>
    <Checkbox label="Uncontrolled default (unchecked)" />
    <Checkbox defaultChecked label="Uncontrolled default (checked)" />
    <Checkbox defaultChecked disabled label="Disabled checked" />
  </>
);

export const Controlled = () => {
  const [checked, setChecked] = React.useState(false);
  return (
    <View style={styles.row}>
      <Checkbox checked={checked} onChange={setChecked} label={`Controlled: ${checked ? 'On' : 'Off'}`} />
    </View>
  );
};

export const Sizes = () => (
  <>
    <Checkbox defaultChecked label="Size 16" />
    <Checkbox defaultChecked label="Size 20 (default)" size={20} />
    <Checkbox defaultChecked label="Size 28" size={28} />
  </>
);
