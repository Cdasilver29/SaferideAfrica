import React from 'react';
import { View, Text } from 'react-native';
import { C, F, IS_WEB } from './constants';
import { WavyLine } from './WavyLine';

type Props = {
  badge: string;
  title: string;
  description?: string;
  invert?: boolean;
};

export function SectionIntro({ badge, title, description, invert }: Props) {
  const fg     = invert ? C.white   : C.dark;
  const muted  = invert ? C.mutedDark : C.muted;
  const pillBg = invert ? 'rgba(255,255,255,0.10)' : 'rgba(34,31,32,0.05)';

  return (
    <View style={{ alignItems: 'center', paddingHorizontal: 16, marginBottom: 40 }}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 5, borderRadius: 20, backgroundColor: pillBg, marginBottom: 16 }}>
        <Text style={{ color: fg, fontFamily: F.bold, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
          {badge}
        </Text>
      </View>

      <Text style={{ color: fg, fontFamily: F.bold, fontSize: IS_WEB ? 34 : 26, textAlign: 'center', lineHeight: IS_WEB ? 44 : 34 }}>
        {title}
      </Text>

      <WavyLine invert={invert} />

      {description ? (
        <Text style={{ color: muted, fontFamily: F.regular, fontSize: 14, lineHeight: 22, textAlign: 'center', maxWidth: 560, marginTop: 12 }}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}
