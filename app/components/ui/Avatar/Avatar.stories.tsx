// @ts-nocheck
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar } from '.';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});

export default {
  title: 'Components/UI/Avatar',
  component: Avatar,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Sizes = () => (
  <>
    <Avatar name="Ada Lovelace" size="sm" />
    <Avatar name="Ada Lovelace" size="md" />
    <Avatar name="Ada Lovelace" size="lg" />
    <Avatar name="Turing" size={80} />
  </>
);

export const Shapes = () => (
  <>
    <Avatar name="Alan Turing" shape="circle" />
    <Avatar name="Alan Turing" shape="square" />
  </>
);

export const WithImage = () => (
  <>
    <Avatar name="Grace Hopper" src="https://i.pravatar.cc/100?img=1" />
    <Avatar name="Linus Torvalds" src="https://i.pravatar.cc/100?img=2" />
  </>
);
