import React from 'react';
import { ScrollView, type ViewStyle } from 'react-native';

export interface ScrollAreaProps {
  horizontal?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  children?: React.ReactNode;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({ horizontal, style, contentContainerStyle, children }) => {
  return (
    <ScrollView horizontal={horizontal} style={style} contentContainerStyle={contentContainerStyle}>
      {children}
    </ScrollView>
  );
};

export default ScrollArea;
