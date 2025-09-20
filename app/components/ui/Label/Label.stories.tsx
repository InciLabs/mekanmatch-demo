// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Label } from '.';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
});

export default {
  title: 'Components/UI/Label',
  component: Label,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Variants = () => (
  <>
    <Label>Default label</Label>
    <Label variant="muted">Muted label</Label>
    <Label variant="success">Success label</Label>
    <Label variant="warning">Warning label</Label>
    <Label variant="error">Error label</Label>
  </>
);

export const Sizes = () => (
  <>
    <Label size="sm">Small label</Label>
    <Label size="md">Medium label</Label>
    <Label size="lg">Large label</Label>
  </>
);

export const States = () => (
  <>
    <Label required>Required label</Label>
    <Label disabled>Disabled label</Label>
    <Label onPress={() => {}}>Pressable label</Label>
  </>
);
