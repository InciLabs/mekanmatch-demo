import * as React from 'react';
import { 
  TextInput as RNTextInput, 
  type TextInputProps as RNTextInputProps, 
  type TextStyle, 
  type ViewStyle,
  View,
  Text,
  StyleSheet
} from 'react-native';

type InputVariant = 'default' | 'outline' | 'filled' | 'ghost';
type InputSize = 'sm' | 'default' | 'lg';

interface InputProps extends Omit<RNTextInputProps, 'style'> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  disabled?: boolean;
}

const Input = React.forwardRef<RNTextInput, InputProps>(
  ({
    variant = 'default',
    size = 'default',
    label,
    error,
    containerStyle,
    inputStyle,
    leftElement,
    rightElement,
    disabled,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <View style={[styles.container, disabled && styles.containerDisabled, containerStyle]}>
        {label && <Text style={[styles.label, error ? styles.errorText : null]}>{label}</Text>}
        <View 
          style={[
            styles.inputContainer,
            styles[variant],
            styles[`size_${size}`],
            isFocused && styles.focused,
            error && styles.error,
            props.multiline && styles.multiline,
            disabled && styles.inputContainerDisabled,
          ]}
        >
          {leftElement && (
            <View style={styles.leftElement}>
              {leftElement}
            </View>
          )}
          <RNTextInput
            ref={ref}
            style={[
              styles.input,
              styles[`${variant}Text`],
              styles[`textSize_${size}`],
              (!!leftElement ? styles.inputWithLeftElement : undefined),
              (!!rightElement ? styles.inputWithRightElement : undefined),
              inputStyle,
            ]}
            placeholderTextColor="#9CA3AF"
            editable={!disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {rightElement && (
            <View style={styles.rightElement}>
              {rightElement}
            </View>
          )}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#374151',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  inputContainerDisabled: {
    backgroundColor: '#F3F4F6',
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 0,
    fontSize: 16,
    color: '#111827',
  },
  inputWithLeftElement: {
    marginLeft: 8,
  },
  inputWithRightElement: {
    marginRight: 8,
  },
  leftElement: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  rightElement: {
    marginRight: 12,
    justifyContent: 'center',
  },
  focused: {
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  error: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  multiline: {
    minHeight: 100,
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  
  // Variants
  default: {
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  defaultText: {
    color: '#111827',
  },
  
  outline: {
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
  },
  outlineText: {
    color: '#111827',
  },
  
  filled: {
    borderColor: 'transparent',
    backgroundColor: '#F3F4F6',
  },
  filledText: {
    color: '#111827',
  },
  
  ghost: {
    borderColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: '#111827',
  },
  
  // Sizes
  size_sm: {
    height: 36,
    paddingHorizontal: 12,
  },
  size_default: {
    height: 40,
    paddingHorizontal: 12,
  },
  size_lg: {
    height: 48,
    paddingHorizontal: 16,
  },
  
  // Text Sizes
  textSize_sm: {
    fontSize: 14,
  },
  textSize_default: {
    fontSize: 16,
  },
  textSize_lg: {
    fontSize: 18,
  },
});

export { Input };
export type { InputVariant, InputSize, InputProps };
