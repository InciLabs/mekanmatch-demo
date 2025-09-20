// @ts-nocheck
import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { Sheet } from '.';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    justifyContent: 'center',
  },
});

export default {
  title: 'Components/UI/Sheet',
  component: Sheet,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Basic = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button title="Open Sheet" onPress={() => setOpen(true)} />
      <Sheet open={open} onOpenChange={setOpen} title="Title">
        <Text>This is the sheet content area. Add anything you like here.</Text>
        <View style={{ height: 12 }} />
        <Button title="Close" onPress={() => setOpen(false)} />
      </Sheet>
    </>
  );
};
