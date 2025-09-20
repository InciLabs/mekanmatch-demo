import React from 'react';
import { View, TextInput, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

export interface InputOTPProps {
  length?: number;
  value?: string; // controlled
  defaultValue?: string; // uncontrolled
  onChange?: (code: string) => void;
  autoFocus?: boolean;
  style?: ViewStyle;
  cellStyle?: ViewStyle;
  textStyle?: TextStyle;
  secure?: boolean;
}

export const InputOTP: React.FC<InputOTPProps> = ({
  length = 6,
  value: valueProp,
  defaultValue = '',
  onChange,
  autoFocus,
  style,
  cellStyle,
  textStyle,
  secure = false,
}) => {
  const { colors, spacing } = useTheme();
  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = React.useState(defaultValue.slice(0, length));
  const value = (isControlled ? valueProp! : internal).slice(0, length);
  const inputs = React.useRef<Array<TextInput | null>>([]);

  const styles = React.useMemo(() => StyleSheet.create({
    row: { flexDirection: 'row', gap: spacing.sm },
    cell: {
      width: 44,
      height: 52,
      borderWidth: 1,
      borderColor: colors.gray300,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      width: '100%',
      height: '100%',
      textAlign: 'center',
      color: colors.textPrimary,
      fontSize: 18,
    },
  }), [colors, spacing]);

  const emit = (next: string) => onChange?.(next);

  const setChar = (index: number, char: string) => {
    const next = value.split('');
    next[index] = char;
    const joined = next.join('').replace(/\s/g, '');
    if (!isControlled) setInternal(joined);
    emit(joined);
  };

  const onChangeText = (idx: number, text: string) => {
    const clean = text.replace(/\D/g, '').slice(-1);
    if (!clean) return;
    setChar(idx, clean);
    // focus next
    if (idx < length - 1) inputs.current[idx + 1]?.focus();
  };

  const onKeyPress = (idx: number, e: any) => {
    if (e.nativeEvent.key === 'Backspace') {
      const next = value.split('');
      next[idx] = '';
      const joined = next.join('');
      if (!isControlled) setInternal(joined);
      emit(joined);
      if (idx > 0) inputs.current[idx - 1]?.focus();
    }
  };

  return (
    <View style={[styles.row, style]}>
      {Array.from({ length }).map((_, i) => (
        <View key={i} style={[styles.cell, cellStyle]}>
          <TextInput
            ref={(r) => { inputs.current[i] = r; }}
            style={[styles.input, textStyle]}
            keyboardType="number-pad"
            returnKeyType="done"
            maxLength={1}
            value={value[i] ?? ''}
            onChangeText={(t) => onChangeText(i, t)}
            onKeyPress={(e) => onKeyPress(i, e)}
            secureTextEntry={secure}
            autoFocus={autoFocus && i === 0}
            placeholderTextColor={colors.gray400}
          />
        </View>
      ))}
    </View>
  );
};

export default InputOTP;
