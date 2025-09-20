// @ts-nocheck
import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { ToastProvider, useToast } from '.';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default {
  title: 'Components/UI/Toast',
  component: ToastProvider,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <ToastProvider>
          <Story />
        </ToastProvider>
      </View>
    ),
  ],
};

const DemoButtons = () => {
  const toast = useToast();
  return (
    <>
      <Button title="Default" onPress={() => toast.show({ title: 'Saved', description: 'Your changes have been saved.' })} />
      <Button title="Success" onPress={() => toast.show({ type: 'success', title: 'Success', description: 'Operation successful.' })} />
      <Button title="Error" onPress={() => toast.show({ type: 'error', title: 'Error', description: 'Something went wrong.' })} />
      <Button title="Warning" onPress={() => toast.show({ type: 'warning', title: 'Warning', description: 'Be careful.' })} />
      <Button title="Info" onPress={() => toast.show({ type: 'info', title: 'Info', description: 'FYI: Check details.' })} />
    </>
  );
};

export const Basic = () => <DemoButtons />;
