import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Progress } from './Progress';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
});

export default {
  title: 'Components/UI/Progress',
  component: Progress,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Static = () => (
  <>
    <Progress value={25} showLabel />
    <Progress value={50} showLabel />
    <Progress value={85} showLabel />
  </>
);

export const AnimatedDemo = () => {
  const [v, setV] = React.useState(10);
  return (
    <>
      <Progress value={v} showLabel />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button title="-10" onPress={() => setV((p) => Math.max(0, p - 10))} />
        <Button title="+10" onPress={() => setV((p) => Math.min(100, p + 10))} />
      </View>
    </>
  );
};
