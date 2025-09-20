// @ts-nocheck
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ScrollArea } from '.';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  box: { width: 240, height: 120, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
});

export default {
  title: 'Components/UI/ScrollArea',
  component: ScrollArea,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Vertical = () => (
  <ScrollArea style={{ height: 200 }}>
    {Array.from({ length: 12 }).map((_, i) => (
      <View key={i} style={[styles.box, { marginBottom: 8 }]}>
        <Text>Item {i + 1}</Text>
      </View>
    ))}
  </ScrollArea>
);

export const Horizontal = () => (
  <ScrollArea horizontal style={{ height: 140 }} contentContainerStyle={{ alignItems: 'center' }}>
    {Array.from({ length: 10 }).map((_, i) => (
      <View key={i} style={[styles.box, { marginRight: 8 }]}>
        <Text>Card {i + 1}</Text>
      </View>
    ))}
  </ScrollArea>
);
