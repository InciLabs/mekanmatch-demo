// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Breadcrumb } from '.';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
});

export default {
  title: 'Components/UI/Breadcrumb',
  component: Breadcrumb,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Basic = () => (
  <Breadcrumb>
    <Breadcrumb.Item onPress={() => {}}>Home</Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item onPress={() => {}}>Library</Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item active>Data</Breadcrumb.Item>
  </Breadcrumb>
);
