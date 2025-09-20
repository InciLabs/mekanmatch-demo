import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Table } from './Table';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
});

export default {
  title: 'Components/UI/Table',
  component: Table,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

const DATA = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 2 === 0 ? 'Admin' : 'Member',
  lastLogin: `2025-09-${(i % 30) + 1}`,
}));

export const Basic = () => (
  <Table height={320}>
    <Table.Header>
      <Table.Cell width={80}>ID</Table.Cell>
      <Table.Cell width={180}>Name</Table.Cell>
      <Table.Cell width={240}>Email</Table.Cell>
      <Table.Cell width={140}>Role</Table.Cell>
      <Table.Cell width={160}>Last Login</Table.Cell>
    </Table.Header>
    {DATA.map((row) => (
      <Table.Row key={row.id}>
        <Table.Cell width={80}>{row.id}</Table.Cell>
        <Table.Cell width={180}>{row.name}</Table.Cell>
        <Table.Cell width={240}>{row.email}</Table.Cell>
        <Table.Cell width={140}>{row.role}</Table.Cell>
        <Table.Cell width={160}>{row.lastLogin}</Table.Cell>
      </Table.Row>
    ))}
  </Table>
);

export const StickyHeader = () => (
  <Table height={280} headerSticky>
    <Table.Header>
      <Table.Cell width={120}>Product</Table.Cell>
      <Table.Cell width={100}>Price</Table.Cell>
      <Table.Cell width={100}>Stock</Table.Cell>
      <Table.Cell width={200}>Category</Table.Cell>
      <Table.Cell width={200}>SKU</Table.Cell>
    </Table.Header>
    {Array.from({ length: 30 }).map((_, i) => (
      <Table.Row key={i}>
        <Table.Cell width={120}>{`Item ${i + 1}`}</Table.Cell>
        <Table.Cell width={100}>{`$${(i * 3.5).toFixed(2)}`}</Table.Cell>
        <Table.Cell width={100}>{i * 2}</Table.Cell>
        <Table.Cell width={200}>Category {i % 5}</Table.Cell>
        <Table.Cell width={200}>SKU-{1000 + i}</Table.Cell>
      </Table.Row>
    ))}
  </Table>
);
