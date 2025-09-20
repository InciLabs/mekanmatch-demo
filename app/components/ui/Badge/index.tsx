import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';

type BadgeVariant = 'default' | 'outline' | 'secondary';

interface BadgeProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({ 
  children, 
  variant = 'default',
  style,
  textStyle,
  ...props 
}: BadgeProps) {
  const variantStyles = {
    default: {
      backgroundColor: '#3B82F6',
      borderColor: 'transparent',
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: '#9CA3AF',
      borderWidth: 1,
    },
    secondary: {
      backgroundColor: '#4B5563',
      borderColor: 'transparent',
    },
  };

  return (
    <TouchableOpacity
      style={[
        styles.badge,
        variantStyles[variant],
        style,
      ]}
      activeOpacity={0.7}
      {...props}
    >
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginBottom: 6,
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default Badge;
