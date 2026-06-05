import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Platform, ScrollView, useWindowDimensions } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, WORK_STEPS } from './constants';

const STEP_KEY_MAP: Record<string, string> = {
  '01': 'selectPlan',
  '02': 'consultation',
  '03': 'buyCourses',
  '04': 'startTraining',
};

// ── Per-step card with pendulum sway on the icon ──────────────────────────────

function StepCard({
  step, i, anim, isLast, isDark, t,
}: {
  step: typeof WORK_STEPS[0];
  i: number;
  anim: Animated.Value;
  isLast: boolean;
  isDark: boolean;
  t: (key: string) => string;
}) {
  const key = STEP_KEY_MAP[step.num] ?? step.num;

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }],
        position: 'relative',
      }}
    >
      {IS_WEB && !isLast && (
        <View style={{ position: 'absolute', top: 34, right: -10, width: 20, height: 2, backgroundColor: C.yellow, zIndex: 1 }} />
      )}

      <View style={{
        backgroundColor: isDark ? C.dark : C.white,
        borderRadius: 20,
        padding: 28,
        alignItems: IS_WEB ? 'center' : 'flex-start',
        borderWidth: 1,
        borderColor: isDark ? C.darkBorder : 'rgba(34,31,32,0.1)',
      }}>
        {/* Step number badge */}
        <View style={{
          width: 36, height: 36,
          borderRadius: 18,
          backgroundColor: C.yellow,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          alignSelf: IS_WEB ? 'center' : 'flex-start',
        }}>
          <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 13 }}>{step.num}</Text>
        </View>

        <Text style={{ color: isDark ? C.white : C.heading, fontFamily: F.bold, fontSize: 16, marginBottom: 8, textAlign: IS_WEB ? 'center' : 'left' }}>
          {t(`workProcess.steps.${key}.title`)}
        </Text>
        <Text style={{ color: isDark ? C.mutedDark : C.muted, fontFamily: F.regular, fontSize: 13, lineHeight: 21, textAlign: IS_WEB ? 'center' : 'left' }}>
          {t(`workProcess.steps.${key}.desc`)}
        </Text>
      </View>
    </Animated.View>
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

  useEffect(() => {
    Animated.stagger(130, anims.map(a => Animated.timing(a, { toValue: 1, duration: 500, useNativeDriver: Platform.OS !== 'web' }))).start();
  }, []);

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
              <StepCard
                key={step.num}
                step={step}
                i={i}
                anim={anims[i]}
                isLast={i === WORK_STEPS.length - 1}
                isDark={isDark}
                t={t}
              />
            ))}
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 14, paddingRight: 24 }}
            style={{ marginHorizontal: -24 }}
          >
            {WORK_STEPS.map((step, i) => (
              <View key={step.num} style={{ width: 220 }}>
                <StepCard
                  step={step}
                  i={i}
                  anim={anims[i]}
                  isLast={i === WORK_STEPS.length - 1}
                  isDark={isDark}
                  t={t}
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
