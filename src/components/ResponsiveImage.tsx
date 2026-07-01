import React from 'react';
import { Image, StyleSheet } from 'react-native';
import type { ImageSourcePropType, StyleProp, ImageStyle } from 'react-native';

// Shared prop contract for both platform implementations. The web build resolves
// ResponsiveImage.web.tsx (a raw <img> with srcset/sizes); native uses this file,
// which is a plain react-native Image so native rendering is unchanged.
export interface ResponsiveImageProps {
  source: ImageSourcePropType;
  // Accessible description. Web maps to alt; native to accessibilityLabel.
  alt?: string;
  // Web-only srcset hints. Ignored on native.
  sizes?: string;
  widths?: number[];
  resizeMode?: 'cover' | 'contain';
  style?: StyleProp<ImageStyle>;
  // Fill the parent (absolute inset 0). Parent supplies size + clipping.
  fill?: boolean;
  // Web-only lazy loading hint. Ignored on native.
  lazy?: boolean;
  fadeDuration?: number;
}

export function ResponsiveImage({
  source,
  alt,
  resizeMode = 'cover',
  style,
  fill,
  fadeDuration = 200,
}: ResponsiveImageProps) {
  const fillStyle = fill
    ? ({ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } as ImageStyle)
    : undefined;

  return (
    <Image
      source={source}
      accessibilityLabel={alt}
      resizeMode={resizeMode}
      fadeDuration={fadeDuration}
      style={StyleSheet.flatten([fillStyle, style])}
    />
  );
}

export default ResponsiveImage;
