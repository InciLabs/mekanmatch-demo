// @ts-nocheck
import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { Tooltip } from '.';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default {
  title: 'Components/UI/Tooltip',
  component: Tooltip,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Top = () => (
  <Tooltip>
    <Tooltip.Trigger>
      <Button title="Press and hold" onPress={() => {}} />
    </Tooltip.Trigger>
    <Tooltip.Content text="This is a tooltip on top" side="top" />
  </Tooltip>
);

export const Bottom = () => (
  <Tooltip>
    <Tooltip.Trigger>
      <Button title="Press and hold" onPress={() => {}} />
    </Tooltip.Trigger>
    <Tooltip.Content text="This is a tooltip at bottom" side="bottom" />
  </Tooltip>
);
