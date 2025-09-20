import React from 'react';
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react-native';
import { createStyles } from './utils';
import { useTheme } from '../../contexts/ThemeContext';

export type AlertVariant = 'default' | 'info' | 'success' | 'warning' | 'destructive';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  children?: React.ReactNode;
}

const variantIcon = (variant: AlertVariant, color: string) => {
  switch (variant) {
    case 'success':
      return <CheckCircle2 size={20} color={color} />;
    case 'warning':
      return <AlertTriangle size={20} color={color} />;
    case 'destructive':
      return <XCircle size={20} color={color} />;
    case 'info':
    case 'default':
    default:
      return <Info size={20} color={color} />;
  }
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  title,
  description,
  icon,
  style,
  contentStyle,
  titleStyle,
  descriptionStyle,
  children,
}) => {
  const { colors, spacing } = useTheme();

  const styles = React.useMemo(() =>
    StyleSheet.create({
      container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: spacing.md,
        borderRadius: 8,
        backgroundColor:
          variant === 'success' ? '#ECFDF5' :
          variant === 'warning' ? '#FFFBEB' :
          variant === 'destructive' ? '#FEF2F2' :
          variant === 'info' ? '#EFF6FF' : '#F9FAFB',
        borderWidth: 1,
        borderColor:
          variant === 'success' ? '#A7F3D0' :
          variant === 'warning' ? '#FDE68A' :
          variant === 'destructive' ? '#FECACA' :
          variant === 'info' ? '#BFDBFE' : '#E5E7EB',
      },
      iconWrap: {
        marginRight: spacing.sm,
        paddingTop: 2,
      },
      content: {
        flex: 1,
      },
      title: {
        color:
          variant === 'destructive' ? '#991B1B' :
          variant === 'warning' ? '#92400E' :
          variant === 'success' ? '#065F46' :
          variant === 'info' ? '#1E40AF' : colors.textPrimary,
        fontWeight: '600',
        marginBottom: description || children ? 4 : 0,
      },
      description: {
        color: colors.textSecondary,
      },
    }), [colors, spacing, variant]
  );

  const iconColor =
    variant === 'destructive' ? '#EF4444' :
    variant === 'warning' ? '#F59E0B' :
    variant === 'success' ? '#10B981' :
    variant === 'info' ? '#3B82F6' : colors.textSecondary;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconWrap}>
        {icon ?? variantIcon(variant, iconColor)}
      </View>
      <View style={[styles.content, contentStyle]}>
        {title ? <Text style={[styles.title, titleStyle]}>{title}</Text> : null}
        {description ? (
          <Text style={[styles.description, descriptionStyle]}>{description}</Text>
        ) : null}
        {children}
      </View>
    </View>
  );
};

export default Alert;
