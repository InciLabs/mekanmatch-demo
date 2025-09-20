import * as React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  type TouchableOpacityProps, 
  type ViewStyle, 
  type TextStyle,
  type TextProps,
  type View,
  type StyleProp,
} from 'react-native';

// Types
type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textProps?: TextProps;
}

// Button Component
const Button = React.forwardRef<View, ButtonProps>(
  ({ 
    variant = 'default',
    size = 'default',
    children,
    style,
    textStyle,
    textProps,
    ...props 
  }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        style={[
          styles.base,
          styles[variant],
          styles[size],
          style,
        ]}
        {...props}
      >
        {typeof children === 'string' ? (
          <Text 
            style={[styles.text, styles[`${variant}Text`], textStyle]}
            {...textProps}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

// Styles
const styles = StyleSheet.create({
  // Base styles
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Variants
  default: {
    backgroundColor: '#007AFF',
  },
  defaultText: {
    color: '#FFFFFF',
  },
  
  destructive: {
    backgroundColor: '#FF3B30',
  },
  destructiveText: {
    color: '#FFFFFF',
  },
  
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#D1D5DB',
  },
  outlineText: {
    color: '#374151',
  },
  
  secondary: {
    backgroundColor: '#F3F4F6',
  },
  secondaryText: {
    color: '#374151',
  },
  
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: '#374151',
  },
  
  link: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  linkText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  
  // Sizes
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  defaultSize: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 40,
  },
  lg: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  icon: {
    padding: 12,
    minHeight: 40,
    minWidth: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { Button };
export type { ButtonVariant, ButtonSize };
