import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Platform, Pressable, useWindowDimensions } from 'react-native';
import AnimatedRN, {
  useSharedValue, useAnimatedStyle,
  withTiming, interpolate, interpolateColor,
} from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, WORK_STEPS } from './constants';
import { useReduceMotion } from '@/hooks/useReduceMotion';

const STEP_KEY_MAP: Record<string, string> = {
  '01': 'selectPlan',
  '02': 'consultation',
  '03': 'buyCourses',
  '04': 'startTraining',
};

const CARD_W = 220;
const GAP = 14;
const SET_W = WORK_STEPS.length * (CARD_W + GAP);

// ── Per-step card: looping blue spotlight + web hover pop/zoom ────────────────

function StepCard({
  step, t, isDark, active, width,
}: {
  step: typeof WORK_STEPS[0];
  t: (key: string) => string;
  isDark: boolean;
  active: boolean;
  width?: number;
}) {
  const key = STEP_KEY_MAP[step.num] ?? step.num;

  // Hover (web) / press (native) pop-zoom
  const lift = useSharedValue(0);
  const liftIn  = () => { lift.value = withTiming(1, { duration: 200 }); };
  const liftOut = () => { lift.value = withTiming(0, { duration: 200 }); };

  // 3-second looping spotlight, driven by the `active` prop from the parent
  const glow = useSharedValue(0);
  useEffect(() => {
    glow.value = withTiming(active ? 1 : 0, { duration: 450 });
  }, [active]);

  const cardStyle = useAnimatedStyle(() => {
    const scale = interpolate(lift.value, [0, 1], [1, 1.06]);
    const borderOp = interpolate(glow.value, [0, 1], [0, 0.9]);

    return {
      transform: [{ scale }],
      borderColor: `rgba(1,165,240,${borderOp})`,
      shadowColor: C.skyDeep,
      shadowOpacity: interpolate(glow.value, [0, 1], [0, 0.5]),
      shadowRadius: interpolate(glow.value, [0, 1], [0, 24]),
      shadowOffset: { width: 0, height: 0 },
      elevation: interpolate(glow.value, [0, 1], [0, 10]),
    };
  });

  const badgeStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(glow.value, [0, 1], [C.yellow, C.skyDeep]),
  }));

  return (
    <Pressable
      onHoverIn={liftIn}
      onHoverOut={liftOut}
      onPressIn={liftIn}
      onPressOut={liftOut}
      style={width ? { width } : { flex: 1 }}
    >
      <AnimatedRN.View
        style={[
          {
            backgroundColor: isDark ? C.dark : C.white,
            borderRadius: 20,
            padding: 28,
            alignItems: IS_WEB ? 'center' : 'flex-start',
            borderWidth: 1.5,
            borderColor: isDark ? C.darkBorder : 'rgba(34,31,32,0.1)',
          },
          cardStyle,
        ]}
      >
        <AnimatedRN.View
          style={[
            {
              width: 36, height: 36,
              borderRadius: 18,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              alignSelf: IS_WEB ? 'center' : 'flex-start',
            },
            badgeStyle,
          ]}
        >
          <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 13 }}>{step.num}</Text>
        </AnimatedRN.View>

        <Text style={{ color: isDark ? C.white : C.heading, fontFamily: F.bold, fontSize: 16, marginBottom: 8, textAlign: IS_WEB ? 'center' : 'left' }}>
          {t(`workProcess.steps.${key}.title`)}
        </Text>
        <Text style={{ color: isDark ? C.mutedDark : C.muted, fontFamily: F.regular, fontSize: 13, lineHeight: 21, textAlign: IS_WEB ? 'center' : 'left' }}>
          {t(`workProcess.steps.${key}.desc`)}
        </Text>
      </AnimatedRN.View>
    </Pressable>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function WorkProcess() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || (IS_WEB && winW < 768);
  const anims = useRef(WORK_STEPS.map(() => new Animated.Value(0))).current;
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (reduceMotion) {
      anims.forEach(a => a.setValue(1));
      return;
    }
    Animated.stagger(130, anims.map(a => Animated.timing(a, { toValue: 1, duration: 500, useNativeDriver: Platform.OS !== 'web' }))).start();
  }, [reduceMotion]);

  // Phase 12: the spotlight and the mobile marquee are held static; Ken Burns is
  // the only ambient motion. The first step rests highlighted.
  const [activeIndex] = useState(0);

  const marqueeX = useSharedValue(0);
  const marqueeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: marqueeX.value }],
  }));

  return (
    <View style={{ backgroundColor: isDark ? C.darkBg : '#ffffff', paddingVertical: 72, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        <View style={{ alignItems: 'center', marginBottom: 52 }}>
          <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>
            {t('workProcess.overline')}
          </Text>
          <Text style={{ color: isDark ? C.white : C.heading, fontFamily: F.bold, fontSize: IS_WEB ? 34 : 26, textAlign: 'center', lineHeight: IS_WEB ? 44 : 34, marginBottom: 12 }}>
            {t('workProcess.heading')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue }} />
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
          </View>
        </View>

        {!isMobile ? (
          <View style={{ flexDirection: 'row', gap: 20 }}>
            {WORK_STEPS.map((step, i) => (
              <Animated.View
                key={step.num}
                style={{
                  flex: 1,
                  opacity: anims[i],
                  transform: [{ translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }],
                  position: 'relative',
                }}
              >
                {IS_WEB && i !== WORK_STEPS.length - 1 && (
                  <View style={{ position: 'absolute', top: 34, right: -10, width: 20, height: 2, backgroundColor: C.yellow, zIndex: 1 }} />
                )}
                <StepCard step={step} t={t} isDark={isDark} active={i === activeIndex} />
              </Animated.View>
            ))}
          </View>
        ) : (
          <View style={{ marginHorizontal: -24, overflow: 'hidden' }}>
            <AnimatedRN.View style={[{ flexDirection: 'row', gap: GAP, paddingLeft: 24 }, marqueeStyle]}>
              {[...WORK_STEPS, ...WORK_STEPS].map((step, i) => (
                <StepCard
                  key={`${step.num}-${i}`}
                  step={step}
                  t={t}
                  isDark={isDark}
                  active={(i % WORK_STEPS.length) === activeIndex}
                  width={CARD_W}
                />
              ))}
            </AnimatedRN.View>
          </View>
        )}
      </View>
    </View>
  );
}
