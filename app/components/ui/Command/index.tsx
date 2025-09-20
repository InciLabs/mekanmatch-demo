import React from 'react';
import { View, Text, TextInput, FlatList, Modal, Pressable, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export interface CommandItem {
  id: string;
  label: string;
  onSelect?: () => void;
}

export interface CommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  placeholder?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  itemStyle?: ViewStyle;
  itemTextStyle?: TextStyle;
}

export const Command: React.FC<CommandProps> = ({
  open,
  onOpenChange,
  items,
  placeholder = 'Type to search...'
}) => {
  const { colors, spacing } = useTheme();
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i => i.label.toLowerCase().includes(q));
  }, [items, query]);

  const styles = React.useMemo(() => StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: spacing.md },
    card: { backgroundColor: colors.white, borderRadius: 12, overflow: 'hidden' },
    input: { paddingHorizontal: spacing.md, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.gray200, color: colors.textPrimary },
    item: { paddingHorizontal: spacing.md, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.gray100 },
    label: { color: colors.textPrimary },
    empty: { padding: spacing.md, alignItems: 'center' },
    emptyText: { color: colors.textSecondary },
  }), [colors, spacing]);

  const select = (it: CommandItem) => {
    onOpenChange(false);
    it.onSelect?.();
  };

  return (
    <Modal transparent visible={open} animationType="fade" onRequestClose={() => onOpenChange(false)}>
      <Pressable style={styles.overlay} onPress={() => onOpenChange(false)}>
        <View style={styles.card}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={placeholder}
            placeholderTextColor={colors.gray400}
            style={styles.input}
            autoFocus
          />
          {filtered.length === 0 ? (
            <View style={styles.empty}><Text style={styles.emptyText}>No results</Text></View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <Pressable onPress={() => select(item)}>
                  <View style={styles.item}><Text style={styles.label}>{item.label}</Text></View>
                </Pressable>
              )}
            />
          )}
        </View>
      </Pressable>
    </Modal>
  );
};

export default Command;
