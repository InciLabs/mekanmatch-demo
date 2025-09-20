import React from 'react';
import { Switch as RNSwitch, SwitchProps as RNSSwitchProps, StyleSheet, ViewStyle } from 'react-native';

export interface SwitchProps extends Omit<RNSSwitchProps, 'onValueChange'> {
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: ViewStyle;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  style,
  ...props
}) => {
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#6B7280', true: '#8B5CF6' }}
      thumbColor="#FFFFFF"
      style={[styles.switch, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  switch: {
    transform: [{ scale: 0.8 }],
  },
});
