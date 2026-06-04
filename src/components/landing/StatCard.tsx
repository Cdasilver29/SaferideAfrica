import React, { useEffect, useState } from 'react';
import { Platform, Pressable, Text, AccessibilityInfo } from 'react-native';
import AnimatedRN, {
  useSharedValue, useAnimatedStyle, useAnimatedReaction,
  withTiming, withRepeat, withDelay, interpolate, runOnJS,
  cancelAnimation, Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/lib/theme';
import { C, F, IS_WEB } from './constants';

type Props = {
  icon: React.ReactNode;
  value: string;
  label: string;
  index?: number;
};

export function StatCard({ icon, value, label, index = 0 }: Props) {
  const T = useTheme();

  const cardBg     = T.isDark ? 'rgba(255,255,255,0.06)' : C.white;
  const cardBorder = T.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(34,31,32,0.06)';
  const valueFg    = T.isDark ? C.white : C.dark;
  const labelFg    = T.isDark ? 'rgba(255,255,255,0.70)' : 'rgba(34,31,32,0.60)';

  // Parse "98%" → { numericTarget: 98, suffix: "%" }
  const m = value.match(/^(\d+)(.*)$/);
  const numericTarget = m ? parseInt(m[1], 10) : 0;
  const suffix = m ? m[2] : '';

  // ── Reduced motion ──────────────────────────────────────────────────────────
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  // ── Count-up (always runs) ──────────────────────────────────────────────────
  const progress = useSharedValue(0);
  const [displayNum, setDisplayNum] = useState(0);

  useEffect(() => {
    progress.value = withDelay(
      index * 150,
      withTiming(numericTarget, { duration: 1500, easing: Easing.out(Easing.cubic) }),
    );
  }, []);

  useAnimatedReaction(
    () => Math.floor(progress.value),
    (val) => runOnJS(setDisplayNum)(val),
  );

  // ── Icon pulse — skipped if reduceMotion ────────────────────────────────────
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(pulse);
      pulse.value = 0;
      return;
    }
    pulse.value = withDelay(
      index * 400,
      withRepeat(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      ),
    );
  }, [reduceMotion]);

  const iconPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.08]) }],
    opacity: interpolate(pulse.value, [0, 1], [1, 0.85]),
  }));

  // ── Yellow glow breath — staggered per card ─────────────────────────────────
  const glow = useSharedValue(0);

  useEffect(() => {
    glow.value = withDelay(
      index * 350,
      withRepeat(
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      ),
    );
  }, []);

  // ── Hover (web) / press (native) lift ───────────────────────────────────────
  const lift = useSharedValue(0);

  const liftIn  = () => { lift.value = withTiming(1, { duration: 250 }); };
  const liftOut = () => { lift.value = withTiming(0, { duration: 250 }); };

  // Combined style: yellow glow (idle) + amplified glow + lift (hover/press)
  const cardAnimStyle = useAnimatedStyle(() => {
    // Base glow breathes between soft and bright
    const baseOpacity = interpolate(glow.value, [0, 1], [0.28, 0.58]);
    const baseRadius  = interpolate(glow.value, [0, 1], [10, 22]);

    // On hover/press, amplify the glow and lift
    const finalOpacity = interpolate(lift.value, [0, 1], [baseOpacity, 0.90]);
    const finalRadius  = interpolate(lift.value, [0, 1], [baseRadius, 30]);
    const finalTransY  = interpolate(lift.value, [0, 1], [0, -6]);
    const finalElev    = interpolate(lift.value, [0, 1], [8, 16]);

    return {
      transform:   [{ translateY: finalTransY }],
      shadowColor:  C.yellow,
      shadowOpacity: finalOpacity,
      shadowRadius:  finalRadius,
      shadowOffset: { width: 0, height: 3 },
      elevation:    finalElev,
      ...(IS_WEB && {
        // @ts-ignore web only
        boxShadow: `0 0 ${finalRadius}px rgba(255,216,0,${finalOpacity}), 0 4px 14px rgba(255,216,0,0.18)`,
      }),
    };
  });

  return (
    <Pressable
      style={{ flex: 1 }}
      onPressIn={Platform.OS !== 'web' ? liftIn  : undefined}
      onPressOut={Platform.OS !== 'web' ? liftOut : undefined}
    >
      <AnimatedRN.View
        style={[
          {
            flex: 1,
            backgroundColor: cardBg,
            borderRadius: 20,
            padding: 24,
            borderWidth: 1,
            borderColor: cardBorder,
            alignItems: 'center' as const,
          },
          cardAnimStyle,
        ]}
        {...(IS_WEB ? ({ onMouseEnter: liftIn, onMouseLeave: liftOut } as any) : {})}
      >
        <AnimatedRN.View style={[{ marginBottom: 12 }, iconPulseStyle]}>
          {icon}
        </AnimatedRN.View>

        <Text style={{ color: valueFg, fontFamily: F.bold, fontSize: 28, lineHeight: 34 }}>
          {displayNum}{suffix}
        </Text>

        <Text style={{ color: labelFg, fontFamily: F.regular, fontSize: 12, marginTop: 4, textAlign: 'center', lineHeight: 18 }}>
          {label}
        </Text>
      </AnimatedRN.View>
    </Pressable>
  );
}
