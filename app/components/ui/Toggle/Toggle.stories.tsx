import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Toggle } from './Toggle';

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
  title: 'Components/UI/Toggle',
  component: Toggle,
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
    <Toggle defaultPressed>Default</Toggle>
    <Toggle defaultPressed variant="secondary">Secondary</Toggle>
    <Toggle variant="outline">Outline</Toggle>
  </>
);

export const Controlled = () => {
  const [pressed, setPressed] = React.useState(false);
  return (
    <View style={styles.row}>
      <Toggle pressed={pressed} onPressedChange={setPressed}>Toggle</Toggle>
      <Text>{pressed ? 'On' : 'Off'}</Text>
    </View>
  );
};

export const Sizes = () => (
  <>
    <Toggle size="sm" defaultPressed>Small</Toggle>
    <Toggle size="md" defaultPressed>Medium</Toggle>
    <Toggle size="lg" defaultPressed>Large</Toggle>
  </>
);
