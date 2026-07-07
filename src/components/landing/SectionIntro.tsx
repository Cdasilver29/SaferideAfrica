import React from 'react';
import { View, Text } from 'react-native';
import { C, F, IS_WEB } from './constants';
import { WavyLine } from './WavyLine';
import { useTheme } from '@/lib/theme';
import { useInView } from '@/hooks/useInView';

type Props = {
  badge: string;
  title: string;
  description?: string;
  invert?: boolean;
  typewriter?: boolean;
};

function TypewriterText({ text, style }: { text: string; style: any }) {
  const [disp, setDisp] = React.useState('');
  const { inView, ref } = useInView(0.5);
  
  React.useEffect(() => {
    if (!inView) return;
    let i = 0;
    const timer = setInterval(() => {
      setDisp(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 35);
    return () => clearInterval(timer);
  }, [text, inView]);

  return (
    <View ref={ref} style={{ alignItems: 'center' }}>
      <Text style={style}>{disp || ' '}</Text>
    </View>
  );
}

export function SectionIntro({ badge, title, description, invert, typewriter }: Props) {
  const T      = useTheme();
  const fg     = invert ? C.white      : T.foreground;
  const muted  = invert ? C.mutedDark  : T.mutedForeground;
  const pillBg = invert ? 'rgba(255,255,255,0.10)' : T.border;

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
        typewriter ? (
          <TypewriterText text={description} style={{ color: muted, fontFamily: F.regular, fontSize: 14, lineHeight: 22, textAlign: 'center', maxWidth: IS_WEB ? 560 : undefined, marginTop: 12 }} />
        ) : (
          <Text style={{ color: muted, fontFamily: F.regular, fontSize: 14, lineHeight: 22, textAlign: 'center', maxWidth: IS_WEB ? 560 : undefined, marginTop: 12 }}>
            {description}
          </Text>
        )
      ) : null}
    </View>
  );
}
