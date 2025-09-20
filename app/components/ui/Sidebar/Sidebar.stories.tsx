// @ts-nocheck
import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { Sidebar } from '.';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  row: { flexDirection: 'row', gap: 16 },
  main: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});

export default {
  title: 'Components/UI/Sidebar',
  component: Sidebar,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Expanded = () => (
  <View style={styles.row}>
    <Sidebar>
      <Sidebar.Header>
        <Text style={{ fontWeight: '700' }}>My App</Text>
      </Sidebar.Header>
      <Sidebar.Group title="Main">
        <Sidebar.Item label="Home" selected />
        <Sidebar.Item label="Projects" />
        <Sidebar.Item label="Teams" />
      </Sidebar.Group>
      <Sidebar.Group title="Settings">
        <Sidebar.Item label="General" />
        <Sidebar.Item label="Billing" />
      </Sidebar.Group>
      <Sidebar.Footer>
        <Text style={{ color: '#6B7280' }}>v1.0.0</Text>
      </Sidebar.Footer>
    </Sidebar>
    <View style={styles.main}>
      <Text>Main content</Text>
    </View>
  </View>
);

export const Collapsed = () => (
  <View style={styles.row}>
    <Sidebar collapsed>
      <Sidebar.Header>
        <Text style={{ fontWeight: '700' }}>M</Text>
      </Sidebar.Header>
      <Sidebar.Group>
        <Sidebar.Item label="Home" />
        <Sidebar.Item label="Projects" />
        <Sidebar.Item label="Teams" />
      </Sidebar.Group>
    </Sidebar>
    <View style={styles.main}>
      <Text>Main content</Text>
    </View>
  </View>
);
