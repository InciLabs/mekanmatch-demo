// @ts-nocheck
import React from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { Form, useForm } from '.';
import { Input, Checkbox, RadioGroup, Select, Textarea } from '..';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
  },
});

export default {
  title: 'Components/UI/Form',
  component: Form,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Basic = () => {
  const [submitted, setSubmitted] = React.useState<any | null>(null);
  return (
    <Form
      initialValues={{ name: '', email: '', fruit: 'banana', agree: false, plan: 'a', about: '' }}
      validate={(values) => {
        const errors: Record<string, string | undefined> = {};
        if (!values.name) errors.name = 'Name is required';
        if (!values.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) errors.email = 'Valid email is required';
        if (!values.agree) errors.agree = 'You must agree to continue';
        return errors;
      }}
      onSubmit={(values) => setSubmitted(values)}
    >
      {(form: any) => (
        <>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Form.Field name="name">
              {({ value, onChange, error }) => (
                <>
                  <Input value={value} onChangeText={onChange} placeholder="Your name" />
                  <Form.Message>{error}</Form.Message>
                </>
              )}
            </Form.Field>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Form.Field name="email">
              {({ value, onChange, error }) => (
                <>
                  <Input value={value} onChangeText={onChange} placeholder="you@example.com" keyboardType="email-address" />
                  <Form.Message>{error}</Form.Message>
                </>
              )}
            </Form.Field>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Favorite fruit</Text>
            <Form.Field name="fruit">
              {({ value, onChange }) => (
                <Select
                  options={[
                    { label: 'Apple', value: 'apple' },
                    { label: 'Banana', value: 'banana' },
                    { label: 'Cherry', value: 'cherry' },
                  ]}
                  value={value}
                  onValueChange={onChange}
                />
              )}
            </Form.Field>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Plan</Text>
            <Form.Field name="plan">
              {({ value, onChange }) => (
                <RadioGroup value={value} onValueChange={onChange}>
                  <RadioGroup.Item value="a" label="Basic" />
                  <RadioGroup.Item value="b" label="Pro" />
                  <RadioGroup.Item value="c" label="Enterprise" />
                </RadioGroup>
              )}
            </Form.Field>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>About you</Text>
            <Form.Field name="about">
              {({ value, onChange }) => (
                <Textarea value={value} onChangeText={onChange} placeholder="Tell us something..." />
              )}
            </Form.Field>
          </View>

          <View style={styles.row}>
            <Form.Field name="agree">
              {({ value, onChange, error }) => (
                <>
                  <Checkbox checked={value} onChange={onChange} label="I agree to the terms" />
                  <Form.Message>{error}</Form.Message>
                </>
              )}
            </Form.Field>
          </View>

          <Button title="Submit" onPress={() => (form as any).submit()} />

          {submitted ? (
            <View style={{ marginTop: 16 }}>
              <Text>Submitted:</Text>
              <Text>{JSON.stringify(submitted, null, 2)}</Text>
            </View>
          ) : null}
        </>
      )}
    </Form>
  );
};
