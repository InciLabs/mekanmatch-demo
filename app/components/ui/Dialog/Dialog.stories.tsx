// @ts-nocheck
import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { Dialog } from '.';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
});

export default {
  title: 'Components/UI/Dialog',
  component: Dialog,
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
      <Button title="Open Dialog" onPress={() => setOpen(true)} />
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Header title="Delete item" subtitle="This action cannot be undone." />
        <Dialog.Content>
          <Text>Are you sure you want to permanently delete this item?</Text>
        </Dialog.Content>
        <Dialog.Footer>
          <View style={styles.actions}>
            <Button title="Cancel" onPress={() => setOpen(false)} />
            <Button title="Delete" color="#EF4444" onPress={() => setOpen(false)} />
          </View>
        </Dialog.Footer>
      </Dialog>
    </>
  );
};
