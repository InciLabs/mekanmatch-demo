import React from 'react';
import { View, Text, Button, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { Dialog } from './Dialog';
import { useTheme } from '../../contexts/ThemeContext';

export interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  destructive?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onOpenChange,
  title = 'Are you sure?',
  description,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  destructive = false,
  onCancel,
  onConfirm,
  contentStyle,
  titleStyle,
  descriptionStyle,
}) => {
  const { colors } = useTheme();

  const onCancelPress = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const onConfirmPress = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Header title={title} />
      <Dialog.Content>
        {description ? <Text style={[{ color: colors.textSecondary }, descriptionStyle]}>{description}</Text> : null}
        <View style={[{ height: 8 }]} />
      </Dialog.Content>
      <Dialog.Footer>
        <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'flex-end', width: '100%' }}>
          <Button title={cancelText} onPress={onCancelPress} />
          <Button
            title={confirmText}
            color={destructive ? '#EF4444' : undefined}
            onPress={onConfirmPress}
          />
        </View>
      </Dialog.Footer>
    </Dialog>
  );
};

export default AlertDialog;
