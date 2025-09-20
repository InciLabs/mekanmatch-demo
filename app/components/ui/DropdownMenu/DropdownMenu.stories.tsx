// @ts-nocheck
import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { DropdownMenu } from '.';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  anchorRow: {
    flexDirection: 'row',
    gap: 16,
  },
});

export default {
  title: 'Components/UI/DropdownMenu',
  component: DropdownMenu,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Basic = () => (
  <DropdownMenu>
    <DropdownMenu.Trigger>
      <Button title="Open menu" onPress={() => {}} />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Item leading={<Text>📄</Text>} onPress={() => {}}>New File</DropdownMenu.Item>
      <DropdownMenu.Item leading={<Text>📁</Text>} onPress={() => {}}>New Folder</DropdownMenu.Item>
      <DropdownMenu.Item leading={<Text>🗑️</Text>} onPress={() => {}}>Delete</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu>
);

export const MultipleAnchors = () => (
  <View style={styles.anchorRow}>
    <DropdownMenu>
      <DropdownMenu.Trigger>
        <Button title="Left" onPress={() => {}} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onPress={() => {}}>Item A</DropdownMenu.Item>
        <DropdownMenu.Item onPress={() => {}}>Item B</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>

    <DropdownMenu>
      <DropdownMenu.Trigger>
        <Button title="Right" onPress={() => {}} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onPress={() => {}}>Item 1</DropdownMenu.Item>
        <DropdownMenu.Item onPress={() => {}}>Item 2</DropdownMenu.Item>
        <DropdownMenu.Item onPress={() => {}}>Item 3</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  </View>
);
