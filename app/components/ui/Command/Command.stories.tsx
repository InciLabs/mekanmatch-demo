import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Command } from './Command';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16, justifyContent: 'center', alignItems: 'center' },
});

export default {
  title: 'Components/UI/Command',
  component: Command,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

const ITEMS = [
  { id: '1', label: 'Open File' },
  { id: '2', label: 'Save File' },
  { id: '3', label: 'Close Editor' },
  { id: '4', label: 'Toggle Sidebar' },
  { id: '5', label: 'Find in Files' },
];

export const Basic = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button title="Open Command" onPress={() => setOpen(true)} />
      <Command open={open} onOpenChange={setOpen} items={ITEMS} />
    </>
  );
};
