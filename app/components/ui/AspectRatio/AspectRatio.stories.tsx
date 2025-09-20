import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { AspectRatio } from './AspectRatio';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
});

export default {
  title: 'Components/UI/AspectRatio',
  component: AspectRatio,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const SixteenNine = () => (
  <AspectRatio ratio={16 / 9}>
    <Image
      source={{ uri: 'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?w=1200&auto=format&fit=crop' }}
      style={{ width: '100%', height: '100%' }}
      resizeMode="cover"
    />
  </AspectRatio>
);

export const OneOne = () => (
  <AspectRatio ratio={1}>
    <Image
      source={{ uri: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=1200&auto=format&fit=crop' }}
      style={{ width: '100%', height: '100%' }}
      resizeMode="cover"
    />
  </AspectRatio>
);
