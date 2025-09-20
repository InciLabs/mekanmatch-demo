// @ts-nocheck
import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { AlertDialog } from '.';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16, justifyContent: 'center', alignItems: 'center' },
});

export default {
  title: 'Components/UI/AlertDialog',
  component: AlertDialog,
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
      <Button title="Open AlertDialog" onPress={() => setOpen(true)} />
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete item"
        description="This action cannot be undone. This will permanently delete the item."
        cancelText="Cancel"
        confirmText="Delete"
        destructive
      />
    </>
  );
};
