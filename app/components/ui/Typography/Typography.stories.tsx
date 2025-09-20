// @ts-nocheck
import { View } from 'react-native';
import Typography, {
  DisplayLarge,
  DisplayMedium,
  DisplaySmall,
  HeadlineLarge,
  HeadlineMedium,
  HeadlineSmall,
  BodyLarge,
  BodyMedium,
  BodySmall,
  LabelLarge,
  LabelMedium,
  LabelSmall,
} from '.';

const meta = {
  title: 'Components/UI/Typography',
  component: Typography,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'displayLarge',
        'displayMedium',
        'displaySmall',
        'headlineLarge',
        'headlineMedium',
        'headlineSmall',
        'bodyLarge',
        'bodyMedium',
        'bodySmall',
        'labelLarge',
        'labelMedium',
        'labelSmall',
      ],
    },
    color: {
      control: { type: 'color' },
    },
    bold: {
      control: 'boolean',
    },
    italic: {
      control: 'boolean',
    },
    align: {
      control: { type: 'select' },
      options: ['auto', 'left', 'center', 'right', 'justify'],
    },
  },
  args: {
    variant: 'bodyMedium',
    children: 'The quick brown fox jumps over the lazy dog',
    bold: false,
    italic: false,
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, flex: 1 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Typography
export const Default: Story = {};

// All Typography Variants
export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <DisplayLarge>Display Large</DisplayLarge>
      <DisplayMedium>Display Medium</DisplayMedium>
      <DisplaySmall>Display Small</DisplaySmall>
      <HeadlineLarge>Headline Large</HeadlineLarge>
      <HeadlineMedium>Headline Medium</HeadlineMedium>
      <HeadlineSmall>Headline Small</HeadlineSmall>
      <BodyLarge>Body Large - The quick brown fox jumps over the lazy dog</BodyLarge>
      <BodyMedium>Body Medium - The quick brown fox jumps over the lazy dog</BodyMedium>
      <BodySmall>Body Small - The quick brown fox jumps over the lazy dog</BodySmall>
      <LabelLarge>Label Large</LabelLarge>
      <LabelMedium>Label Medium</LabelMedium>
      <LabelSmall>Label Small</LabelSmall>
    </View>
  ),
};

// Text Colors
export const TextColors: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <BodyLarge color="textPrimary">Primary Text</BodyLarge>
      <BodyLarge color="textSecondary">Secondary Text</BodyLarge>
      <BodyLarge color="textTertiary">Tertiary Text</BodyLarge>
      <BodyLarge color="primary">Primary Color</BodyLarge>
      <BodyLarge color="success">Success Color</BodyLarge>
      <BodyLarge color="warning">Warning Color</BodyLarge>
      <BodyLarge color="error">Error Color</BodyLarge>
      <BodyLarge color="info">Info Color</BodyLarge>
      <BodyLarge color="#FF6B6B">Custom Color</BodyLarge>
    </View>
  ),
};

// Text Alignment
export const TextAlignment: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <BodyLarge align="left">Left Aligned Text</BodyLarge>
      <BodyLarge align="center">Center Aligned Text</BodyLarge>
      <BodyLarge align="right">Right Aligned Text</BodyLarge>
      <BodyLarge 
        align="justify"
        style={{ textAlignVertical: 'top' }}
      >
        Justified Text - Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </BodyLarge>
    </View>
  ),
};

// Text Styles
export const TextStyles: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <BodyLarge>Normal Text</BodyLarge>
      <BodyLarge bold>Bold Text</BodyLarge>
      <BodyLarge italic>Italic Text</BodyLarge>
      <BodyLarge bold italic>Bold & Italic Text</BodyLarge>
      <BodyLarge style={{ textDecorationLine: 'underline' }}>Underlined Text</BodyLarge>
      <BodyLarge style={{ textDecorationLine: 'line-through' }}>Strikethrough Text</BodyLarge>
    </View>
  ),
};

// Text Truncation
export const TextTruncation: Story = {
  render: () => (
    <View style={{ gap: 8, width: 200 }}>
      <BodyLarge numberOfLines={1}>
        This is a very long text that will be truncated after one line
      </BodyLarge>
      <BodyMedium numberOfLines={2}>
        This is a very long text that will be truncated after two lines. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </BodyMedium>
    </View>
  ),
};

// Responsive Typography
export const ResponsiveTypography: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <DisplayLarge style={{ fontSize: 24 }}>Responsive Display</DisplayLarge>
      <BodyMedium style={{ fontSize: 16 }}>This text will scale with the device settings</BodyMedium>
      <BodySmall style={{ fontSize: 12 }}>Smaller text that remains readable</BodySmall>
    </View>
  ),
};
