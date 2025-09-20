import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { Toggle } from './Toggle';

export type ToggleGroupType = 'single' | 'multiple';

export interface ToggleGroupProps {
  type?: ToggleGroupType;
  value?: string | string[]; // controlled
  defaultValue?: string | string[]; // uncontrolled
  onValueChange?: (value: string | string[]) => void;
  disabled?: boolean;
  style?: ViewStyle;
  children: React.ReactNode; // ToggleGroup.Item children
}

export interface ToggleGroupItemProps {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
}

interface CtxValue {
  type: ToggleGroupType;
  values: Set<string>;
  toggle: (v: string) => void;
  disabled?: boolean;
}

const Ctx = React.createContext<CtxValue | null>(null);

export const ToggleGroup: React.FC<ToggleGroupProps> & { Item: React.FC<ToggleGroupItemProps> } = ({
  type = 'single',
  value: valueProp,
  defaultValue = type === 'single' ? '' : [],
  onValueChange,
  disabled,
  style,
  children,
}) => {
  const isControlled = valueProp !== undefined;
  const initial = React.useMemo(() => {
    if (type === 'single') {
      const v = (isControlled ? (valueProp as string) : (defaultValue as string)) ?? '';
      return new Set(v ? [v] : []);
    }
    const arr = (isControlled ? (valueProp as string[]) : (defaultValue as string[])) ?? [];
    return new Set(arr);
  }, []);

  const [internal, setInternal] = React.useState<Set<string>>(initial);

  const values = React.useMemo(() => {
    if (isControlled) {
      if (type === 'single') return new Set(((valueProp as string) ? [valueProp as string] : []) as string[]);
      return new Set((valueProp as string[]) ?? []);
    }
    return internal;
  }, [isControlled, valueProp, internal, type]);

  const emit = (next: Set<string>) => {
    if (onValueChange) {
      if (type === 'single') onValueChange(next.values().next().value ?? '');
      else onValueChange(Array.from(next));
    }
  };

  const toggle = (v: string) => {
    const next = new Set(values);
    if (type === 'single') {
      next.clear();
      if (!values.has(v)) next.add(v);
    } else {
      if (next.has(v)) next.delete(v); else next.add(v);
    }
    if (!isControlled) setInternal(next);
    emit(next);
  };

  return (
    <Ctx.Provider value={{ type, values, toggle, disabled }}>
      <View style={[styles.row, style]}>{children}</View>
    </Ctx.Provider>
  );
};

const styles = StyleSheet.create({ row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 } });

const Item: React.FC<ToggleGroupItemProps> = ({ value, disabled, children }) => {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error('ToggleGroup.Item must be used within ToggleGroup');
  const pressed = ctx.values.has(value);
  const onPressedChange = () => ctx.toggle(value);
  return (
    <Toggle pressed={pressed} onPressedChange={onPressedChange} disabled={ctx.disabled || disabled}>
      {children}
    </Toggle>
  );
};

ToggleGroup.Item = Item;

export default ToggleGroup;
