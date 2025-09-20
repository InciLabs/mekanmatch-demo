import React, { createContext, useContext } from 'react';
import { View, Text, Animated, StyleSheet, Easing, TouchableOpacity, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  id?: string;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number; // ms, default 2500
}

export interface ToastItem extends Required<Omit<ToastOptions, 'duration'>> {
  duration: number;
}

interface ToastContextValue {
  show: (opts: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastCtx = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
  position?: 'top' | 'bottom';
  offset?: number; // distance from edge
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children, maxToasts = 3, position = 'bottom', offset = 24 }) => {
  const { colors, spacing } = useTheme();
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const show: ToastContextValue['show'] = (opts) => {
    const id = opts.id ?? Math.random().toString(36).slice(2);
    const item: ToastItem = {
      id,
      title: opts.title ?? '',
      description: opts.description ?? '',
      type: opts.type ?? 'default',
      duration: opts.duration ?? 2500,
    };
    setToasts((prev) => {
      const next = [item, ...prev].slice(0, maxToasts);
      return next;
    });
    // Auto dismiss
    setTimeout(() => dismiss(id), item.duration);
    return id;
  };

  const dismiss: ToastContextValue['dismiss'] = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      [position]: offset,
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
    } as ViewStyle,
    toast: {
      borderRadius: 10,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.gray800,
    },
    title: {
      color: colors.white,
      fontWeight: '600',
    },
    description: {
      color: colors.gray100,
      marginTop: 2,
    },
  }), [colors, spacing, position, offset]);

  return (
    <ToastCtx.Provider value={{ show, dismiss }}>
      {children}
      <View pointerEvents="box-none" style={styles.container}>
        {toasts.map((t) => (
          <ToastItemView key={t.id} item={t} onClose={() => dismiss(t.id)} />
        ))}
      </View>
    </ToastCtx.Provider>
  );
};

const typeColors: Record<ToastType, { bg: string; fg: string; sub: string }> = {
  default: { bg: '#111827', fg: '#ffffff', sub: '#D1D5DB' },
  success: { bg: '#065F46', fg: '#ECFDF5', sub: '#A7F3D0' },
  error: { bg: '#7F1D1D', fg: '#FEF2F2', sub: '#FECACA' },
  warning: { bg: '#78350F', fg: '#FFFBEB', sub: '#FDE68A' },
  info: { bg: '#1E3A8A', fg: '#EFF6FF', sub: '#BFDBFE' },
};

const ToastItemView: React.FC<{ item: ToastItem; onClose: () => void }> = ({ item, onClose }) => {
  const { spacing } = useTheme();
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(10)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 160, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true })
    ]).start();
    return () => {
      Animated.timing(opacity, { toValue: 0, duration: 120, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start();
    };
  }, []);

  const palette = typeColors[item.type];

  const styles = React.useMemo(() => StyleSheet.create({
    card: {
      backgroundColor: palette.bg,
      borderRadius: 10,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    title: { color: palette.fg, fontWeight: '600' },
    desc: { color: palette.sub, marginTop: 2 },
    close: { color: palette.sub, marginTop: 6, fontWeight: '500' },
  }), [palette, spacing]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }], marginBottom: spacing.sm }}>
      <TouchableOpacity activeOpacity={0.85} onPress={onClose}>
        <View style={styles.card}>
          {item.title ? <Text style={styles.title}>{item.title}</Text> : null}
          {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
