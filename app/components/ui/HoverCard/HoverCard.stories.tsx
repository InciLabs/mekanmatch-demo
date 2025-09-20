import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { HoverCard } from './HoverCard';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16, justifyContent: 'center', alignItems: 'center' },
});

export default {
  title: 'Components/UI/HoverCard',
  component: HoverCard,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Basic = () => (
  <HoverCard>
    <HoverCard.Trigger>
      <Button title="Press and hold" onPress={() => {}} />
    </HoverCard.Trigger>
    <HoverCard.Content>
      <Text>This is a hovercard-like popover. Press and hold to show, release to hide.</Text>
    </HoverCard.Content>
  </HoverCard>
);
