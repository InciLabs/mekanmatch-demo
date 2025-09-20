// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ToggleGroup } from '.';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
});

export default {
  title: 'Components/UI/ToggleGroup',
  component: ToggleGroup,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Single = () => (
  <ToggleGroup type="single" defaultValue="bold">
    <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
    <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
    <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
  </ToggleGroup>
);

export const Multiple = () => (
  <ToggleGroup type="multiple" defaultValue={["b", "u"]}>
    <ToggleGroup.Item value="b">B</ToggleGroup.Item>
    <ToggleGroup.Item value="i">I</ToggleGroup.Item>
    <ToggleGroup.Item value="u">U</ToggleGroup.Item>
  </ToggleGroup>
);
