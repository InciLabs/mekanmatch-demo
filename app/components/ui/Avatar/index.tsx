import React from 'react';
import { View, Image, Text, StyleSheet, type ImageStyle, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '@contexts/ThemeContext';

export type AvatarSize = 'sm' | 'md' | 'lg' | number; // number supports custom px
export type AvatarShape = 'circle' | 'square';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string; // used for initials fallback
  size?: AvatarSize;
  shape?: AvatarShape;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  textStyle?: TextStyle;
  backgroundColor?: string; // override fallback bg
}

function getSizePx(size: AvatarSize): number {
  if (typeof size === 'number') return size;
  switch (size) {
    case 'sm':
      return 32;
    case 'lg':
      return 64;
    case 'md':
    default:
      return 40;
  }
}

function initialsFromName(name?: string) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  style,
  imageStyle,
  textStyle,
  backgroundColor,
}) => {
  const { colors } = useTheme();
  const px = getSizePx(size);
  const radius = shape === 'circle' ? px / 2 : 8;
  const [error, setError] = React.useState(false);

  const styles = React.useMemo(() =>
    StyleSheet.create({
      container: {
        width: px,
        height: px,
        borderRadius: radius,
        overflow: 'hidden',
        backgroundColor: backgroundColor ?? colors.gray200,
        alignItems: 'center',
        justifyContent: 'center',
      },
      img: {
        width: '100%',
        height: '100%',
      },
      fallbackText: {
        color: colors.textPrimary,
        fontWeight: '600',
      },
    }), [px, radius, colors, backgroundColor]
  );

  const renderFallback = () => (
    <View style={[styles.container, style]}>
      <Text style={[styles.fallbackText, textStyle]}>{initialsFromName(name) || '?'}</Text>
    </View>
  );

  if (!src || error) {
    return renderFallback();
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri: src }}
        accessibilityLabel={alt || name}
        style={[styles.img, imageStyle]}
        onError={() => setError(true)}
      />
    </View>
  );
};

export default Avatar;
