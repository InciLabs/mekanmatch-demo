// @ts-nocheck
import React from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { Drawer } from '.';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16, justifyContent: 'center', alignItems: 'center' },
});

export default {
  title: 'Components/UI/Drawer',
  component: Drawer,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Left = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button title="Open Left Drawer" onPress={() => setOpen(true)} />
      <Drawer open={open} onOpenChange={setOpen} side="left" title="Menu">
        <Text>Left drawer content</Text>
      </Drawer>
    </>
  );
};

export const Right = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button title="Open Right Drawer" onPress={() => setOpen(true)} />
      <Drawer open={open} onOpenChange={setOpen} side="right" title="Panel">
        <Text>Right drawer content</Text>
      </Drawer>
    </>
  );
};
