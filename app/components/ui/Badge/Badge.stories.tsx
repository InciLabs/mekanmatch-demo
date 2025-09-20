import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Badge } from './Badge';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default {
  title: 'Components/UI/Badge',
  component: Badge,
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
    <Badge>Default</Badge>
    <Badge variant="outline">Outline</Badge>
    <Badge variant="secondary">Secondary</Badge>
  </>
);
