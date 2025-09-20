import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default {
  title: 'Components/UI/Skeleton',
  component: Skeleton,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Lines = () => (
  <>
    <Skeleton variant="text" width="70%" />
    <Skeleton variant="text" width="50%" />
    <Skeleton variant="text" width="60%" />
  </>
);

export const AvatarAndText = () => (
  <View style={styles.row}>
    <Skeleton variant="circle" width={48} height={48} />
    <View style={{ flex: 1, gap: 8 }}>
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="40%" />
    </View>
  </View>
);

export const Card = () => (
  <View style={styles.card}>
    <Skeleton width="100%" height="100%" />
  </View>
);
