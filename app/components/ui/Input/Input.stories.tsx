// @ts-nocheck
import { View, Text } from 'react-native';
import { Input, type InputVariant, type InputSize } from '.';

export default {
  title: 'Components/UI/Input',
  component: Input,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16, flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export const Default = () => <Input placeholder="Enter text..." />;

export const Variants = () => (
  <View style={{ gap: 16 }}>
    {(['default', 'outline', 'filled', 'ghost'] as InputVariant[]).map((variant) => (
      <Input
        key={variant}
        variant={variant}
        placeholder={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Input`}
      />
    ))}
  </View>
);

export const Sizes = () => (
  <View style={{ gap: 16 }}>
    {(['sm', 'default', 'lg'] as InputSize[]).map((size) => (
      <Input
        key={size}
        size={size}
        placeholder={`${size.toUpperCase()} Input`}
      />
    ))}
  </View>
);

export const WithLabel = () => (
  <View style={{ gap: 16 }}>
    <Input label="Username" placeholder="Enter your username" />
    <Input label="Password" placeholder="Enter your password" secureTextEntry />
  </View>
);

export const WithIcons = () => (
  <View style={{ gap: 16 }}>
    <Input label="Search" placeholder="Search..." leftElement={<Text style={{ fontSize: 20 }}>🔍</Text>} />
    <Input
      label="Email"
      placeholder="your@email.com"
      leftElement={<Text style={{ fontSize: 20 }}>✉️</Text>}
      rightElement={<Text style={{ fontSize: 14, color: '#3B82F6' }}>Send</Text>}
    />
  </View>
);

export const ErrorState = () => (
  <View style={{ gap: 16 }}>
    <Input label="Username" placeholder="Enter your username" error="Username is required" value="" />
    <Input label="Email" placeholder="Enter your email" error="Invalid email format" value="not-an-email" />
  </View>
);

export const Disabled = () => (
  <View style={{ gap: 16 }}>
    <Input label="Disabled Input" placeholder="This input is disabled" disabled />
    <Input label="Disabled Filled" variant="filled" placeholder="This input is disabled" disabled />
  </View>
);

export const Multiline = () => (
  <Input label="Description" placeholder="Enter a description..." multiline numberOfLines={4} textAlignVertical="top" />
);
