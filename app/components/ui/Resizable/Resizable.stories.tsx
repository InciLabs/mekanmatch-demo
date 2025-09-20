import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Resizable } from './Resizable';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  pane: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E7EB' },
});

export default {
  title: 'Components/UI/Resizable',
  component: Resizable,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const VerticalSplit = () => (
  <View style={{ height: 280 }}>
    <Resizable initialSize={180} min={120} max={360}>
      <View style={[styles.pane]}>
        <Text>Left</Text>
      </View>
      <View style={[styles.pane, { backgroundColor: '#F3F4F6' }]}>
        <Text>Right</Text>
      </View>
    </Resizable>
  </View>
);

export const HorizontalSplit = () => (
  <View style={{ height: 320 }}>
    <Resizable horizontal initialSize={120} min={80} max={240}>
      <View style={[styles.pane]}>
        <Text>Top</Text>
      </View>
      <View style={[styles.pane, { backgroundColor: '#F3F4F6' }]}>
        <Text>Bottom</Text>
      </View>
    </Resizable>
  </View>
);
