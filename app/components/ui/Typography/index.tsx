import * as React from 'react';
import { Text, type TextProps, type TextStyle, StyleSheet } from 'react-native';
import { colors, typography, type Theme } from './utils';

type TextVariant = keyof typeof typography;
type TextColor = keyof typeof colors | string;

export interface TypographyProps extends TextProps {
  /**
   * The variant of the text (e.g., 'displayLarge', 'bodyMedium', etc.)
   * @default 'bodyMedium'
   */
  variant?: TextVariant;
  
  /**
   * The color of the text
   * @default 'textPrimary'
   */
  color?: TextColor;
  
  /**
   * Whether the text should be bold
   * @default false
   */
  bold?: boolean;
  
  /**
   * Whether the text should be italic
   * @default false
   */
  italic?: boolean;
  
  /**
   * Text alignment
   */
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  
  /**
   * Number of lines before truncating with an ellipsis
   */
  numberOfLines?: number;
  
  /**
   * Additional styles to apply to the text
   */
  style?: TextStyle;
  
  /**
   * Theme object for custom theming
   */
  theme?: Partial<Theme>;
  
  /**
   * Children text or components
   */
  children: React.ReactNode;
}

/**
 * A versatile text component that enforces consistent typography throughout the app.
 * It supports all standard Text props along with additional typography-specific props.
 */
const Typography = React.forwardRef<Text, TypographyProps>(({
  variant = 'bodyMedium',
  color = 'textPrimary',
  bold = false,
  italic = false,
  align,
  numberOfLines,
  style,
  theme: themeOverride,
  children,
  ...rest
}, ref) => {
  // Resolve color from theme or use directly if it's a valid color code
  const textColor = (colors as Record<string, string>)[color] || color;
  
  // Combine typography styles with overrides
  const textStyle = StyleSheet.flatten([
    typography[variant],
    {
      color: textColor,
      textAlign: align,
      // Ensure fontStyle is properly typed as 'normal' | 'italic' | undefined
      fontStyle: italic ? ('italic' as const) : ('normal' as const),
      fontWeight: bold ? '700' : typography[variant].fontWeight,
    },
    style,
  ]);

  return (
    <Text
      ref={ref}
      style={textStyle}
      numberOfLines={numberOfLines}
      allowFontScaling={false}
      {...rest}
    >
      {children}
    </Text>
  );
});

Typography.displayName = 'Typography';

// Create pre-styled text components for common use cases
const createTypographyComponent = (
  variant: TextVariant,
  defaultProps: Partial<TypographyProps> = {}
): React.FC<Omit<TypographyProps, 'variant'>> => {
  const Component = (props: Omit<TypographyProps, 'variant'>) => (
    <Typography variant={variant} {...defaultProps} {...props} />
  );
  Component.displayName = `Typography.${variant}`;
  return Component;
};

// Export pre-styled components
export const DisplayLarge = createTypographyComponent('displayLarge');
export const DisplayMedium = createTypographyComponent('displayMedium');
export const DisplaySmall = createTypographyComponent('displaySmall');
export const HeadlineLarge = createTypographyComponent('headlineLarge');
export const HeadlineMedium = createTypographyComponent('headlineMedium');
export const HeadlineSmall = createTypographyComponent('headlineSmall');
export const BodyLarge = createTypographyComponent('bodyLarge');
export const BodyMedium = createTypographyComponent('bodyMedium');
export const BodySmall = createTypographyComponent('bodySmall');
export const LabelLarge = createTypographyComponent('labelLarge');
export const LabelMedium = createTypographyComponent('labelMedium');
export const LabelSmall = createTypographyComponent('labelSmall');

// Export the main component and types
export { Typography as default };
export type { TextVariant, TextColor };
