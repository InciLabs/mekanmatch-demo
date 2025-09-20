import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioGroup } from './RadioGroup';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
});

export default {
  title: 'Components/UI/RadioGroup',
  component: RadioGroup,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Uncontrolled = () => (
  <RadioGroup defaultValue="apple">
    <RadioGroup.Item value="apple" label="Apple" />
    <RadioGroup.Item value="banana" label="Banana" />
    <RadioGroup.Item value="cherry" label="Cherry" />
  </RadioGroup>
);

export const Controlled = () => {
  const [value, setValue] = React.useState('b');
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <RadioGroup.Item value="a" label="Option A" />
      <RadioGroup.Item value="b" label="Option B" />
      <RadioGroup.Item value="c" label="Option C" />
    </RadioGroup>
  );
};

export const Disabled = () => (
  <RadioGroup defaultValue="x" disabled>
    <RadioGroup.Item value="x" label="Disabled X" />
    <RadioGroup.Item value="y" label="Disabled Y" />
  </RadioGroup>
);
