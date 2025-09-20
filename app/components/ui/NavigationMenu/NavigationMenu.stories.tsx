import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationMenu } from './NavigationMenu';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
});

export default {
  title: 'Components/UI/NavigationMenu',
  component: NavigationMenu,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Basic = () => (
  <NavigationMenu defaultValue="home">
    <NavigationMenu.Item value="home" label="Home" />
    <NavigationMenu.Item value="explore" label="Explore" />
    <NavigationMenu.Item value="search" label="Search" />
    <NavigationMenu.Item value="notifications" label="Notifications" />
    <NavigationMenu.Item value="messages" label="Messages" />
    <NavigationMenu.Item value="settings" label="Settings" />
  </NavigationMenu>
);

export const Controlled = () => {
  const [value, setValue] = React.useState('a');
  return (
    <NavigationMenu value={value} onValueChange={setValue}>
      <NavigationMenu.Item value="a" label="For you" />
      <NavigationMenu.Item value="b" label="Following" />
      <NavigationMenu.Item value="c" label="Trending" />
      <NavigationMenu.Item value="d" label="Latest" />
    </NavigationMenu>
  );
};
