import * as React from 'react';
import { 
  View, 
  type ViewStyle, 
  type ViewProps, 
  StyleSheet, 
  Pressable,
  type PressableProps
} from 'react-native';

type CardVariant = 'elevated' | 'outline' | 'filled' | 'ghost';

interface CardProps extends Omit<ViewProps, 'style'> {
  variant?: CardVariant;
  style?: ViewStyle;
  pressable?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}

const Card = React.forwardRef<View, CardProps>(({
  variant = 'elevated',
  style,
  pressable = false,
  onPress,
  children,
  ...props
}, ref) => {
  const Container = pressable ? Pressable : View;
  const containerProps = pressable 
    ? { onPress, ...(props as PressableProps) } 
    : props;

  return (
    <Container
      ref={ref as any}
      style={[
        styles.base,
        styles[variant],
        style,
      ]}
      {...containerProps}
    >
      {children}
    </Container>
  );
});

Card.displayName = 'Card';

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  
  // Variants
  elevated: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  outline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  
  filled: {
    backgroundColor: '#F9FAFB',
  },
  
  ghost: {
    backgroundColor: 'transparent',
  },
});

// Card Components
interface CardHeaderProps extends ViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const CardHeader = React.forwardRef<View, CardHeaderProps>(({ children, style, ...props }, ref) => (
  <View 
    ref={ref} 
    style={[cardComponentStyles.header, style]} 
    {...props}
  >
    {children}
  </View>
));

CardHeader.displayName = 'Card.Header';

interface CardContentProps extends ViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const CardContent = React.forwardRef<View, CardContentProps>(({ children, style, ...props }, ref) => (
  <View 
    ref={ref} 
    style={[cardComponentStyles.content, style]} 
    {...props}
  >
    {children}
  </View>
));

CardContent.displayName = 'Card.Content';

interface CardFooterProps extends ViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const CardFooter = React.forwardRef<View, CardFooterProps>(({ children, style, ...props }, ref) => (
  <View 
    ref={ref} 
    style={[cardComponentStyles.footer, style]} 
    {...props}
  >
    {children}
  </View>
));

CardFooter.displayName = 'Card.Footer';

const cardComponentStyles = StyleSheet.create({
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  content: {
    padding: 16,
  },
  footer: {
    padding: 16,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});

// Compose Card with subcomponents
const CardComponent = Card as typeof Card & {
  Header: typeof CardHeader;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
};

CardComponent.Header = CardHeader;
CardComponent.Content = CardContent;
CardComponent.Footer = CardFooter;

export { CardComponent as Card };
export type { CardVariant, CardProps, CardHeaderProps, CardContentProps, CardFooterProps };
