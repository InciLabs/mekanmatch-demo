// @ts-nocheck
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { InputOTP } from '.';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
});

export default {
  title: 'Components/UI/InputOTP',
  component: InputOTP,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Uncontrolled = () => <InputOTP length={6} autoFocus />;

export const Controlled = () => {
  const [code, setCode] = React.useState('12');
  return (
    <>
      <InputOTP length={6} value={code} onChange={setCode} />
      <Text>Code: {code}</Text>
    </>
  );
};
