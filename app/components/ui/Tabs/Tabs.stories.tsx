// @ts-nocheck
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Tabs } from '.';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  content: {
    paddingVertical: 12,
  },
});

export default {
  title: 'Components/UI/Tabs',
  component: Tabs,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Basic = () => (
  <Tabs defaultValue="account">
    <Tabs.List>
      <Tabs.Trigger value="account">Account</Tabs.Trigger>
      <Tabs.Trigger value="password">Password</Tabs.Trigger>
      <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
    </Tabs.List>
    <View style={styles.content}>
      <Tabs.Content value="account">
        <Text>Account settings go here.</Text>
      </Tabs.Content>
      <Tabs.Content value="password">
        <Text>Change your password here.</Text>
      </Tabs.Content>
      <Tabs.Content value="billing">
        <Text>Manage billing information.</Text>
      </Tabs.Content>
    </View>
  </Tabs>
);

export const Controlled = () => {
  const [value, setValue] = React.useState('one');
  return (
    <Tabs value={value} onValueChange={setValue}>
      <Tabs.List>
        <Tabs.Trigger value="one">One</Tabs.Trigger>
        <Tabs.Trigger value="two">Two</Tabs.Trigger>
      </Tabs.List>
      <View style={styles.content}>
        <Tabs.Content value="one">
          <Text>Tab One content</Text>
        </Tabs.Content>
        <Tabs.Content value="two">
          <Text>Tab Two content</Text>
        </Tabs.Content>
      </View>
    </Tabs>
  );
};
