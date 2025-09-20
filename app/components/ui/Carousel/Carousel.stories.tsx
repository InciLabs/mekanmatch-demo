import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Carousel } from './Carousel';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  slide: { flex: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});

export default {
  title: 'Components/UI/Carousel',
  component: Carousel,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Basic = () => (
  <Carousel height={180}>
    <View style={[styles.slide, { backgroundColor: '#FCA5A5' }]}>
      <Text>Slide 1</Text>
    </View>
    <View style={[styles.slide, { backgroundColor: '#93C5FD' }]}>
      <Text>Slide 2</Text>
    </View>
    <View style={[styles.slide, { backgroundColor: '#A7F3D0' }]}>
      <Text>Slide 3</Text>
    </View>
  </Carousel>
);
