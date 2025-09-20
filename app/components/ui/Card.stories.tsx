import { View, Text, StyleSheet, Image } from 'react-native';
import { Card, type CardVariant } from './Card';

export default {
  title: 'Components/UI/Card',
  component: Card,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16, flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export const Basic = () => (
  <Card style={{ width: '100%' }}>
    <Card.Content>
      <Text style={styles.title}>Card Title</Text>
      <Text style={styles.text}>
        This is a basic card with some sample content. You can put any content inside a card.
      </Text>
    </Card.Content>
  </Card>
);

export const WithHeaderAndFooter = () => (
  <Card style={{ width: '100%' }}>
    <Card.Header>
      <Text style={[styles.title, { marginBottom: 4 }]}>Featured Post</Text>
      <Text style={styles.subtitle}>September 18, 2023</Text>
    </Card.Header>
    <Card.Content>
      <Text style={styles.text}>
        This is a card with a header, content, and footer. The header typically contains the title and subtitle, while the footer contains actions.
      </Text>
    </Card.Content>
    <Card.Footer>
      <Text style={styles.link}>Share</Text>
      <Text style={styles.link}>Read more</Text>
    </Card.Footer>
  </Card>
);

export const WithImage = () => (
  <Card style={{ width: '100%', overflow: 'hidden' }}>
    <Image
      source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop' }}
      style={styles.image}
      resizeMode="cover"
    />
    <Card.Content>
      <Text style={styles.title}>Beautiful Landscape</Text>
      <Text style={styles.text}>
        This card includes an image at the top. You can use any image source supported by React Native.
      </Text>
    </Card.Content>
  </Card>
);

export const PressableCard = () => (
  <Card pressable onPress={() => console.log('Card pressed!')} style={{ width: '100%' }}>
    <Card.Content>
      <Text style={styles.title}>Tap Me</Text>
      <Text style={styles.text}>
        This card is pressable. Try tapping it to trigger the onPress event.
      </Text>
    </Card.Content>
  </Card>
);

export const CustomContent = () => (
  <Card style={{ width: '100%' }}>
    <View style={styles.weatherCard}>
      <Text style={styles.weatherTemp}>24°C</Text>
      <View>
        <Text style={styles.weatherLocation}>Istanbul, Turkey</Text>
        <Text style={styles.weatherCondition}>Mostly Sunny</Text>
      </View>
    </View>
    <Card.Footer style={{ justifyContent: 'space-between' }}>
      <View style={styles.weatherInfo}>
        <Text>💨 12 km/h</Text>
        <Text>💧 45%</Text>
      </View>
      <Text style={styles.weatherDate}>Today, 3:00 PM</Text>
    </Card.Footer>
  </Card>
);

export const AllVariants = () => (
  <View style={{ gap: 16 }}>
    {(['elevated', 'outline', 'filled', 'ghost'] as CardVariant[]).map((variant) => (
      <Card key={variant} variant={variant} style={{ width: '100%' }}>
        <Card.Content>
          <Text style={styles.title}>{variant.charAt(0).toUpperCase() + variant.slice(1)} Card</Text>
          <Text style={styles.text}>
            This is a {variant} card variant. Each variant has a different visual style.
          </Text>
        </Card.Content>
      </Card>
    ))}
  </View>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  link: {
    color: '#3B82F6',
    fontWeight: '500',
    marginLeft: 16,
  },
  image: {
    width: '100%',
    height: 160,
  },
  weatherCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weatherTemp: {
    fontSize: 48,
    fontWeight: '200',
    color: '#111827',
  },
  weatherLocation: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'right',
  },
  weatherCondition: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'right',
  },
  weatherInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  weatherDate: {
    color: '#6B7280',
    fontSize: 12,
  },
});
