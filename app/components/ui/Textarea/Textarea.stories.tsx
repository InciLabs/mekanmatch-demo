import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Textarea } from './Textarea';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
});

export default {
  title: 'Components/UI/Textarea',
  component: Textarea,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Basic = () => (
  <Textarea placeholder="Enter your message" helperText="You can write multiple lines." />
);

export const Sizes = () => (
  <>
    <Textarea size="sm" placeholder="Small" />
    <Textarea size="md" placeholder="Medium" />
    <Textarea size="lg" placeholder="Large" />
  </>
);

export const Validation = () => (
  <>
    <Textarea variant="success" helperText="Looks good!" defaultValue="All set" />
    <Textarea variant="error" errorText="This field is required" />
  </>
);
