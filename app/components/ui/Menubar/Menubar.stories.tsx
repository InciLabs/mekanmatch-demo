import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Menubar } from './Menubar';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
});

export default {
  title: 'Components/UI/Menubar',
  component: Menubar,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Basic = () => (
  <Menubar>
    <Menubar.Menu label="File">
      <Menubar.Item leading={<Text>📄</Text>}>New</Menubar.Item>
      <Menubar.Item leading={<Text>🗂️</Text>}>Open...</Menubar.Item>
      <Menubar.Item leading={<Text>💾</Text>}>Save</Menubar.Item>
    </Menubar.Menu>
    <Menubar.Menu label="Edit">
      <Menubar.Item>Undo</Menubar.Item>
      <Menubar.Item>Redo</Menubar.Item>
      <Menubar.Item>Cut</Menubar.Item>
      <Menubar.Item>Copy</Menubar.Item>
      <Menubar.Item>Paste</Menubar.Item>
    </Menubar.Menu>
    <Menubar.Menu label="View">
      <Menubar.Item>Zoom In</Menubar.Item>
      <Menubar.Item>Zoom Out</Menubar.Item>
      <Menubar.Item>Toggle Sidebar</Menubar.Item>
    </Menubar.Menu>
  </Menubar>
);
