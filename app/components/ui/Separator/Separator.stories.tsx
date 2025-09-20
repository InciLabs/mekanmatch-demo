import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Separator } from './Separator';

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
  box: {
    width: 60,
    height: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default {
  title: 'Components/UI/Separator',
  component: Separator,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Horizontal = () => (
  <>
    <Text>Above</Text>
    <Separator />
    <Text>Below</Text>
    <Separator thickness={2} inset={12} />
  </>
);

export const Vertical = () => (
  <View style={styles.row}>
    <View style={styles.box}><Text>A</Text></View>
    <Separator orientation="vertical" />
    <View style={styles.box}><Text>B</Text></View>
    <Separator orientation="vertical" thickness={2} inset={8} />
    <View style={styles.box}><Text>C</Text></View>
  </View>
);
