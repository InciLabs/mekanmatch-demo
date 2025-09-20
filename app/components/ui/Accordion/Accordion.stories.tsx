// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accordion } from '.';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    paddingTop: 8,
  },
  customHeader: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  customTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  customContent: {
    backgroundColor: '#F2F2F7',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 16,
  },
});

export default {
  title: 'Components/UI/Accordion',
  component: Accordion,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

// Single Item Story
export const SingleItem = () => (
  <Accordion>
    <Accordion.Item title="Click to expand">
      <Text style={styles.content}>This is the content inside the accordion.</Text>
    </Accordion.Item>
  </Accordion>
);

// Multiple Items Story
export const MultipleItems = () => (
  <View>
    <Accordion style={{ marginBottom: 8 }}>
      <Accordion.Item title="First Item" style={{ marginBottom: 8 }}>
        <Text style={styles.content}>Content for first item</Text>
      </Accordion.Item>
      <Accordion.Item title="Second Item" style={{ marginBottom: 8 }}>
        <Text style={styles.content}>Content for second item</Text>
      </Accordion.Item>
      <Accordion.Item title="Third Item">
        <Text style={styles.content}>Content for third item</Text>
      </Accordion.Item>
    </Accordion>
  </View>
);

// Custom Styling Story
export const CustomStyling = () => (
  <Accordion>
    <Accordion.Item
      title="Custom Styled Accordion"
      headerStyle={styles.customHeader}
      titleStyle={styles.customTitle}
      contentStyle={styles.customContent}
    >
      <Text style={{ color: '#000000' }}>
        This accordion has custom styling applied to both the header and content areas.
      </Text>
    </Accordion.Item>
  </Accordion>
);
