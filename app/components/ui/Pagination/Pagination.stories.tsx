import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Pagination } from './Pagination';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
});

export default {
  title: 'Components/UI/Pagination',
  component: Pagination,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Basic = () => {
  const [page, setPage] = React.useState(3);
  return (
    <>
      <Pagination currentPage={page} totalPages={12} onPageChange={setPage} />
      <Text>Current page: {page}</Text>
    </>
  );
};

export const FewPages = () => {
  const [page, setPage] = React.useState(1);
  return (
    <Pagination currentPage={page} totalPages={3} onPageChange={setPage} />
  );
};
