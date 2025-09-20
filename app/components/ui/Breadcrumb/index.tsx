import React from 'react';
import { View, Text, Pressable, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export interface BreadcrumbProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface BreadcrumbItemProps {
  children: React.ReactNode;
  onPress?: () => void;
  active?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export interface BreadcrumbSeparatorProps {
  children?: React.ReactNode;
  style?: TextStyle;
}

export const Breadcrumb: React.FC<BreadcrumbProps> & {
  Item: React.FC<BreadcrumbItemProps>;
  Separator: React.FC<BreadcrumbSeparatorProps>;
} = ({ children, style }) => {
  const styles = React.useMemo(() =>
    StyleSheet.create({
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
      },
    }), []
  );

  return <View style={[styles.row, style]}>{children}</View>;
};

const Item: React.FC<BreadcrumbItemProps> = ({ children, onPress, active = false, style, textStyle }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() =>
    StyleSheet.create({
      wrap: {
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 6,
      },
      text: {
        color: active ? colors.textPrimary : colors.textSecondary,
        fontWeight: active ? '600' : '500',
      },
    }), [colors, active]
  );

  const content = <Text style={[styles.text, textStyle]}>{children}</Text>;

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={[styles.wrap, style]} accessibilityRole="link">
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.wrap, style]}>{content}</View>;
};

const Separator: React.FC<BreadcrumbSeparatorProps> = ({ children = '/', style }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() =>
    StyleSheet.create({
      text: { color: colors.gray400, marginHorizontal: 6 },
    }), [colors]
  );
  return <Text style={[styles.text, style]}>{children}</Text>;
};

Breadcrumb.Item = Item;
Breadcrumb.Separator = Separator;

export default Breadcrumb;
