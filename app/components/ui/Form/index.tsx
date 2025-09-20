import React, { createContext, useContext } from 'react';
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export type FormValues = Record<string, any>;
export type FormErrors = Record<string, string | undefined>;

export interface FormProps {
  initialValues?: FormValues;
  validate?: (values: FormValues) => FormErrors | void;
  onSubmit: (values: FormValues) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

interface FormContextValue {
  values: FormValues;
  setValue: (name: string, value: any) => void;
  errors: FormErrors;
  setError: (name: string, error?: string) => void;
  registerField: (name: string) => void;
}

const FormCtx = createContext<FormContextValue | null>(null);

export const useForm = () => {
  const ctx = useContext(FormCtx);
  if (!ctx) throw new Error('useForm must be used within <Form>');
  return ctx;
};

export const Form: React.FC<FormProps> & {
  Field: React.FC<FormFieldProps>;
  Description: React.FC<FormDescriptionProps>;
  Message: React.FC<FormMessageProps>;
} = ({ initialValues = {}, validate, onSubmit, children, style }) => {
  const [values, setValues] = React.useState<FormValues>(initialValues);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const fieldsRef = React.useRef<Set<string>>(new Set());

  const setValue = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // clear error when user edits
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const setError = (name: string, error?: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const registerField = (name: string) => {
    fieldsRef.current.add(name);
    if (!(name in values)) setValues((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = () => {
    const v = { ...values };
    const res = validate?.(v);
    const nextErrors = res ?? {};
    setErrors(nextErrors);
    const hasError = Object.values(nextErrors).some(Boolean);
    if (!hasError) onSubmit(v);
  };

  const ctx: FormContextValue = {
    values,
    setValue,
    errors,
    setError,
    registerField,
  };

  return (
    <FormCtx.Provider value={ctx}>
      <View style={style}>
        {typeof children === 'function' ? (children as any)({ submit: handleSubmit }) : children}
      </View>
    </FormCtx.Provider>
  );
};

export interface FormFieldProps {
  name: string;
  children: (field: {
    value: any;
    onChange: (val: any) => void;
    error?: string;
  }) => React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ name, children }) => {
  const { values, setValue, errors, registerField } = useForm();
  React.useEffect(() => {
    registerField(name);
  }, [name]);
  return <>{children({ value: values[name], onChange: (v) => setValue(name, v), error: errors[name] })}</>;
};

export interface FormDescriptionProps { children: React.ReactNode; style?: TextStyle }
const FormDescription: React.FC<FormDescriptionProps> = ({ children, style }) => {
  const { colors, spacing } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
    text: { color: colors.textSecondary, marginTop: spacing.xs },
  }), [colors, spacing]);
  return <Text style={[styles.text, style]}>{children}</Text>;
};

export interface FormMessageProps { name?: string; children?: React.ReactNode; style?: TextStyle }
const FormMessage: React.FC<FormMessageProps> = ({ name, children, style }) => {
  const { colors, spacing } = useTheme();
  const { errors } = useForm();
  const message = name ? errors[name] : undefined;
  const content = children ?? message;
  if (!content) return null;
  const styles = React.useMemo(() => StyleSheet.create({
    text: { color: '#B91C1C', marginTop: spacing.xs, fontWeight: '500' },
  }), [spacing]);
  return <Text style={[styles.text, style]}>{content}</Text>;
};

Form.Field = FormField;
Form.Description = FormDescription;
Form.Message = FormMessage;

export default Form;
