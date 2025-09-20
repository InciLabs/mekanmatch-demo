import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { Popover } from './Popover';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default {
  title: 'Components/UI/Popover',
  component: Popover,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Basic = () => (
  <Popover>
    <Popover.Trigger>
      <Button title="Open Popover" onPress={() => {}} />
    </Popover.Trigger>
    <Popover.Content>
      <Text>This is a popover content area. Tap outside to close.</Text>
      <Popover.Arrow />
    </Popover.Content>
  </Popover>
);

export const Alignments = () => (
  <>
    <Popover>
      <Popover.Trigger>
        <Button title="Start" onPress={() => {}} />
      </Popover.Trigger>
      <Popover.Content align="start">
        <Text>Start aligned content</Text>
        <Popover.Arrow />
      </Popover.Content>
    </Popover>

    <Popover>
      <Popover.Trigger>
        <Button title="Center" onPress={() => {}} />
      </Popover.Trigger>
      <Popover.Content align="center">
        <Text>Center aligned content</Text>
        <Popover.Arrow />
      </Popover.Content>
    </Popover>

    <Popover>
      <Popover.Trigger>
        <Button title="End" onPress={() => {}} />
      </Popover.Trigger>
      <Popover.Content align="end">
        <Text>End aligned content</Text>
        <Popover.Arrow />
      </Popover.Content>
    </Popover>
  </>
);
