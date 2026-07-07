import React from 'react';
import { View } from 'react-native';
import { C } from './constants';

// Modern gradient line divider — replaces the old SVG wavy path with a cleaner,
// more visually polished horizontal rule that works across web and native.
export function WavyLine({ invert = false }: { invert?: boolean }) {
  const lineColor = invert ? 'rgba(255,255,255,0.35)' : C.yellow;
  const dotColor = invert ? 'rgba(255,255,255,0.6)' : C.yellow;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, alignSelf: 'center' }}>
      <View style={{ width: 28, height: 2, borderRadius: 2, backgroundColor: lineColor, opacity: 0.4 }} />
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: dotColor }} />
      <View style={{ width: 28, height: 2, borderRadius: 2, backgroundColor: lineColor, opacity: 0.4 }} />
    </View>
  );
}
