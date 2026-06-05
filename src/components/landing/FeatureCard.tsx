import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withSequence, withTiming, interpolate,
} from 'react-native-reanimated';
import { CheckCircle2 } from 'lucide-react-native';
import { C, F, IS_WEB } from './constants';

type Variant = 'primary' | 'accent';

const STYLES: Record<Variant, { bg: string; fg: string; muted: string; iconBg: string; shadow: string }> = {
  primary: {
    bg:     C.skyDeep,
    fg:     C.white,
    muted:  'rgba(255, 255, 255, 0.85)',
    iconBg: 'rgba(255, 255, 255, 0.18)',
    shadow: C.skyDeep,
  },
  accent: {
    bg:     C.yellow,
    fg:     C.dark,
    muted:  'rgba(34, 31, 32, 0.75)',
    iconBg: 'rgba(34, 31, 32, 0.12)',
    shadow: C.yellow,
  },
};

type Props = { variant: Variant; title: string; description: string };

export function FeatureCard({ variant, title, description }: Props) {
  const s = STYLES[variant];

  const lift   = useSharedValue(0);
  const rotate = useSharedValue(0);

  const onEnter = () => {
    lift.value = withSpring(1, { damping: 7, stiffness: 220 });
    rotate.value = withSequence(
      withTiming(-2, { duration: 90 }),
      withSpring(2, { damping: 6, stiffness: 180 }),
    );
  };

  const onLeave = () => {
    lift.value   = withSpring(0, { damping: 10, stiffness: 200 });
    rotate.value = withSpring(0, { damping: 8,  stiffness: 200 });
  };

  const animStyle = useAnimatedStyle(() => {
    const shadowOp = interpolate(lift.value, [0, 1], [0.18, 0.42]);
    const shadowR  = interpolate(lift.value, [0, 1], [8, 26]);

    return {
      transform: [
        { scale:      interpolate(lift.value, [0, 1], [1, 1.05]) },
        { translateY: interpolate(lift.value, [0, 1], [0, -8]) },
        { rotate:     `${rotate.value}deg` },
      ],
      shadowColor:   s.shadow,
      shadowOpacity: shadowOp,
      shadowRadius:  shadowR,
      shadowOffset:  { width: 0, height: 6 },
      elevation:     interpolate(lift.value, [0, 1], [3, 14]),
      ...(IS_WEB && {
        // @ts-ignore web-only
        boxShadow: `0 8px 28px rgba(${variant === 'primary' ? '1,165,240' : '255,216,0'},${shadowOp.toFixed(2)})`,
      }),
    };
  });

  return (
    <Animated.View style={[{ borderRadius: 16 }, animStyle]}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPressIn={onEnter}
        onPressOut={onLeave}
        {...(IS_WEB ? ({ onMouseEnter: onEnter, onMouseLeave: onLeave } as any) : {})}
        style={{ backgroundColor: s.bg, borderRadius: 16, padding: 20 }}
      >
        <View style={{
          width: 40, height: 40, borderRadius: 20,
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: s.iconBg,
        }}>
          <CheckCircle2 size={20} color={s.fg} />
        </View>
        <Text style={{ color: s.fg, fontFamily: F.bold, fontSize: 16, marginTop: 16, lineHeight: 22 }}>
          {title}
        </Text>
        <Text style={{ color: s.muted, fontFamily: F.regular, fontSize: 13, marginTop: 8, lineHeight: 20 }}>
          {description}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
