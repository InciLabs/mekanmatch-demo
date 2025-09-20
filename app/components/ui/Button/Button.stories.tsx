import { View, Text } from 'react-native';
import { Button, type ButtonVariant, type ButtonSize } from './Button';

export default {
  title: 'Components/UI/Button',
  component: Button,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export const Default = () => <Button>Button</Button>;

export const Variants = () => (
  <View style={{ gap: 8, width: '100%' }}>
    {(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as ButtonVariant[]).map((variant) => (
      <Button key={variant} variant={variant} style={{ width: '100%' }}>
        {variant.charAt(0).toUpperCase() + variant.slice(1)} Button
      </Button>
    ))}
  </View>
);

export const Sizes = () => (
  <View style={{ gap: 8, alignItems: 'center', width: '100%' }}>
    {(['sm', 'default', 'lg', 'icon'] as ButtonSize[]).map((size) => (
      <Button key={size} size={size} style={{ width: size === 'icon' ? 40 : '100%' }}>
        {size === 'icon' ? 'X' : `${size.toUpperCase()} Button`}
      </Button>
    ))}
  </View>
);

export const Disabled = () => (
  <View style={{ gap: 8, width: '100%' }}>
    <Button disabled variant="default">Disabled Default</Button>
    <Button disabled variant="outline">Disabled Outline</Button>
    <Button disabled variant="ghost">Disabled Ghost</Button>
  </View>
);

export const WithIcons = () => (
  <View style={{ gap: 8, width: '100%' }}>
    <Button variant="default" style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
      <Text style={{ color: 'white' }}>🎉</Text>
      <Text style={{ color: 'white' }}>Default with Icon</Text>
    </Button>
    <Button variant="outline" style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
      <Text>🔔</Text>
      <Text>Outline with Icon</Text>
    </Button>
  </View>
);
