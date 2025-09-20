import React from 'react';
import { View, type ViewStyle } from 'react-native';

export interface AspectRatioProps {
  ratio?: number; // width / height
  style?: ViewStyle;
  children?: React.ReactNode;
}

// Simple wrapper around RN's aspectRatio style for consistency with web API
export const AspectRatio: React.FC<AspectRatioProps> = ({ ratio = 16 / 9, style, children }) => {
  return (
    <View style={[{ width: '100%', aspectRatio: ratio, overflow: 'hidden' }, style]}>
      {children}
    </View>
  );
};

export default AspectRatio;
