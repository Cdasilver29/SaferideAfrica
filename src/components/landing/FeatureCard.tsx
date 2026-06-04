import React from 'react';
import { View, Text } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { C, F } from './constants';

type Variant = 'primary' | 'accent';

const STYLES: Record<Variant, { bg: string; fg: string; muted: string; iconBg: string }> = {
  primary: {
    bg:     C.skyDeep,
    fg:     C.white,
    muted:  'rgba(255, 255, 255, 0.85)',
    iconBg: 'rgba(255, 255, 255, 0.18)',
  },
  accent: {
    bg:     C.yellow,
    fg:     C.dark,
    muted:  'rgba(34, 31, 32, 0.75)',
    iconBg: 'rgba(34, 31, 32, 0.12)',
  },
};

type Props = { variant: Variant; title: string; description: string };

export function FeatureCard({ variant, title, description }: Props) {
  const s = STYLES[variant];
  return (
    <View style={{ backgroundColor: s.bg, borderRadius: 16, padding: 20 }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: s.iconBg,
        }}
      >
        <CheckCircle2 size={20} color={s.fg} />
      </View>
      <Text style={{ color: s.fg, fontFamily: F.bold, fontSize: 16, marginTop: 16, lineHeight: 22 }}>
        {title}
      </Text>
      <Text style={{ color: s.muted, fontFamily: F.regular, fontSize: 13, marginTop: 8, lineHeight: 20 }}>
        {description}
      </Text>
    </View>
  );
}
