// @ts-nocheck
import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { ContextMenu } from '.';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16, justifyContent: 'center', alignItems: 'center' },
});

export default {
  title: 'Components/UI/ContextMenu',
  component: ContextMenu,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Basic = () => (
  <ContextMenu>
    <ContextMenu.Trigger>
      <Button title="Long press me" onPress={() => {}} />
    </ContextMenu.Trigger>
    <ContextMenu.Content>
      <ContextMenu.Item leading={<Text>✏️</Text>} onPress={() => {}}>Rename</ContextMenu.Item>
      <ContextMenu.Item leading={<Text>📄</Text>} onPress={() => {}}>Duplicate</ContextMenu.Item>
      <ContextMenu.Item leading={<Text>🗑️</Text>} onPress={() => {}}>Delete</ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu>
);
