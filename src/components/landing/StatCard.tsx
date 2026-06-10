import React from 'react';
import { Pressable, Text, useWindowDimensions } from 'react-native';
import AnimatedRN, {
  useSharedValue, useAnimatedStyle, withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/lib/theme';
import { C, F, IS_WEB } from './constants';
import { CountUp } from '@/components/CountUp';

type Props = {
  value: string;
  label: string;
  index?: number;
  inView: boolean;
};

export function StatCard({ value, label, index = 0, inView }: Props) {
  const T = useTheme();
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || (IS_WEB && winW < 768);

  const numberFg = T.isDark ? C.yellow : C.skyDeep;
  const labelFg  = T.isDark ? 'rgba(255,255,255,0.70)' : 'rgba(34,31,32,0.60)';

  const numberFontSize = winW < 640 ? 32 : winW < 1024 ? 40 : 48;
  const labelFontSize  = winW < 640 ? 12 : 14;

  // Parse "98%" -> { numericTarget: 98, suffix: "%" }
  const m = value.match(/^(\d+)(.*)$/);
  const numericTarget = m ? parseInt(m[1], 10) : 0;
  const suffix = m ? m[2] : '';

  // Hover (web) / press (native) lift for the glass card
  const lift = useSharedValue(0);

  const liftIn  = () => { lift.value = withTiming(1, { duration: 200 }); };
  const liftOut = () => { lift.value = withTiming(0, { duration: 200 }); };

  const cardAnimStyle = useAnimatedStyle(() => {
    const transY = lift.value === 1 ? -6 : 0;
    const borderOp = withTiming(lift.value === 1 ? 0.85 : 0.40, { duration: 200 });

    return {
      transform: [{ translateY: withTiming(transY, { duration: 200 }) }],
      borderColor: `rgba(1,165,240,${borderOp})`,
      shadowColor: C.skyDeep,
      shadowOpacity: withTiming(lift.value === 1 ? 0.65 : 0.35, { duration: 200 }),
      shadowRadius: withTiming(lift.value === 1 ? 28 : 16, { duration: 200 }),
      shadowOffset: { width: 0, height: 0 },
      elevation: lift.value === 1 ? 14 : 6,
    };
  });

  return (
    <Pressable
      style={{ flex: 1, minHeight: 44 }}
      onHoverIn={liftIn}
      onHoverOut={liftOut}
      onPressIn={liftIn}
      onPressOut={liftOut}
    >
      <AnimatedRN.View
        className={IS_WEB ? 'glass-stat-card' : undefined}
        style={[
          {
            flex: 1,
            backgroundColor: IS_WEB ? undefined : 'rgba(255,255,255,0.08)',
            borderRadius: 20,
            paddingHorizontal: isMobile ? 16 : 24,
            paddingVertical: 24,
            borderWidth: 1,
            alignItems: 'center' as const,
          },
          cardAnimStyle,
        ]}
      >
        <CountUp
          value={numericTarget}
          suffix={suffix}
          durationMs={1600}
          active={inView}
          delayMs={index * 150}
          style={{ color: numberFg, fontFamily: F.bold, fontSize: numberFontSize, lineHeight: numberFontSize * 1.2 }}
        />

        <Text style={{ color: labelFg, fontFamily: F.regular, fontSize: labelFontSize, marginTop: 4, textAlign: 'center', lineHeight: labelFontSize * 1.5 }}>
          {label}
        </Text>
      </AnimatedRN.View>
    </Pressable>
  );
}
