// @ts-nocheck
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Slider } from '.';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
});

export default {
  title: 'Components/UI/Slider',
  component: Slider,
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
    <Slider defaultValue={25} showValue />
    <Slider defaultValue={50} min={0} max={200} step={5} showValue formatValue={(v) => `${v} pts`} />
  </>
);

export const Controlled = () => {
  const [v, setV] = React.useState(40);
  return (
    <>
      <Text>Value: {v}</Text>
      <Slider value={v} onValueChange={setV} showValue />
    </>
  );
};
