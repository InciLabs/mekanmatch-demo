import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Alert } from './Alert';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
});

export default {
  title: 'Components/UI/Alert',
  component: Alert,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Default = () => (
  <Alert title="Heads up!" description="This is a default alert with neutral styling." />
);

export const Info = () => (
  <Alert variant="info" title="Information" description="Here is some helpful information for the user." />
);

export const Success = () => (
  <Alert variant="success" title="Success" description="Your changes have been saved successfully." />
);

export const Warning = () => (
  <Alert variant="warning" title="Warning" description="Be careful when proceeding with this action." />
);

export const Destructive = () => (
  <Alert variant="destructive" title="Error" description="Something went wrong. Please try again." />
);

export const WithCustomContent = () => (
  <Alert variant="info" title="Custom Content">
    <Text>Alerts can also render any children for full flexibility.</Text>
    <Text>Use this space for additional context or actions.</Text>
  </Alert>
);
