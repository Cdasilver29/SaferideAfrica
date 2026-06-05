import React from 'react';
import { View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withSequence, withTiming, interpolate,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { C, F, IS_WEB, MAX_W, SERVICES_IMG } from './constants';
import { SectionIntro } from './SectionIntro';

const PREVIEW_SERVICES = [
  {
    iconName: 'Shield',
    name:     'Defensive Driving',
    desc:     'Hazard perception, emergency braking, and space management for every Kenyan road condition.',
    code:     'DEFENSIVE',
  },
  {
    iconName: 'Star',
    name:     'Executive Classes',
    desc:     'Premium one-on-one training with a personalised schedule, ideal for busy professionals.',
    code:     'EXECUTIVE',
  },
  {
    iconName: 'Users',
    name:     'Ladies Special',
    desc:     'A tailored programme for female learners with the option of a female instructor.',
    code:     'LADIES',
  },
  {
    iconName: 'BookOpen',
    name:     'Beginner Driver Education',
    desc:     'A complete from-scratch programme: vehicle controls, road signs, theory class, and road practice.',
    code:     'BEGINNER',
  },
];

// ── Animated card ─────────────────────────────────────────────────────────────

function ServiceCard({ svc }: { svc: typeof PREVIEW_SERVICES[0] }) {
  const T = useTheme();

  const lift   = useSharedValue(0);   // 0 idle → 1 active
  const rotate = useSharedValue(0);   // degrees for the sway

  const onEnter = () => {
    // Scale + lift with a springy overshoot
    lift.value = withSpring(1, { damping: 7, stiffness: 220 });
    // Quick tilt opposite then sway to resting hover angle — gives the "surprised" sway feel
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
    const shadowOp = interpolate(lift.value, [0, 1], [0.07, 0.28]);
    const shadowR  = interpolate(lift.value, [0, 1], [10, 26]);
    const transY   = interpolate(lift.value, [0, 1], [0, -8]);
    const scale    = interpolate(lift.value, [0, 1], [1, 1.05]);

    return {
      transform: [
        { scale },
        { translateY: transY },
        { rotate: `${rotate.value}deg` },
      ],
      shadowColor:   C.skyDeep,
      shadowOpacity: shadowOp,
      shadowRadius:  shadowR,
      shadowOffset:  { width: 0, height: 6 },
      elevation:     interpolate(lift.value, [0, 1], [2, 14]),
      ...(IS_WEB && {
        // @ts-ignore web-only
        boxShadow: `0 8px 28px rgba(1,165,240,${shadowOp.toFixed(2)})`,
      }),
    };
  });

  return (
    <Animated.View style={[{ flex: 1, borderRadius: 18 }, animStyle]}>
      <TouchableOpacity
        onPress={() => router.push(`/services/${svc.code}` as any)}
        activeOpacity={0.9}
        onPressIn={onEnter}
        onPressOut={onLeave}
        {...(IS_WEB ? ({
          onMouseEnter: onEnter,
          onMouseLeave: onLeave,
        } as any) : {})}
        style={{
          flex: 1,
          backgroundColor: T.card,
          borderRadius: 18,
          padding: 20,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: T.border,
          minWidth: IS_WEB ? undefined : '47%',
        }}
      >
        <View style={{ width: 24, height: 3, borderRadius: 2, backgroundColor: C.yellow, marginBottom: 10 }} />
        <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 14, textAlign: 'center', marginBottom: 8, lineHeight: 20 }}>
          {svc.name}
        </Text>
        <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 12, lineHeight: 18, textAlign: 'center', flex: 1 }}>
          {svc.desc}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── See all CTA ───────────────────────────────────────────────────────────────

function SeeAllBtn({ align = 'center' }: { align?: 'flex-start' | 'center' }) {
  return (
    <View style={{ alignItems: align }}>
      <TouchableOpacity
        onPress={() => router.push('/services')}
        activeOpacity={0.8}
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 8,
          backgroundColor: C.red,
          paddingHorizontal: 28, paddingVertical: 12,
          borderRadius: 24,
          shadowColor: C.red, shadowOpacity: 0.32, shadowRadius: 8, elevation: 4,
        }}
      >
        <Text style={{ color: C.white, fontFamily: F.semibold, fontSize: 14 }}>See all services</Text>
        <ArrowRight size={16} color={C.white} />
      </TouchableOpacity>
    </View>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function ServicesPreview() {
  const T = useTheme();
  const { width: winW } = useWindowDimensions();
  // Stack vertically on narrow viewports (< 860 px) or native
  const sideLayout = IS_WEB && winW >= 860;
  const photoW = sideLayout ? Math.min(400, winW * 0.35) : undefined;

  return (
    <View style={{ backgroundColor: T.background, paddingVertical: 64, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        {sideLayout ? (
          <View style={{ flexDirection: 'row', gap: 48, alignItems: 'stretch' }}>

            {/* Left — full-height photo + CTA */}
            <View style={{ width: photoW, flexShrink: 0, flexDirection: 'column' }}>
              <View style={{
                flex: 1, borderRadius: 24, overflow: 'hidden',
                backgroundColor: 'rgba(1,165,240,0.08)', minHeight: 420,
              }}>
                <Image
                  source={SERVICES_IMG}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                  resizeMode="cover"
                  progressiveRenderingEnabled
                  fadeDuration={200}
                />
              </View>
              <View style={{ height: 4, borderRadius: 2, backgroundColor: C.yellow, marginTop: 18, marginBottom: 20, width: 64 }} />
              <SeeAllBtn align="flex-start" />
            </View>

            {/* Right — heading + animated cards */}
            <View style={{ flex: 1 }}>
              <SectionIntro badge="What We Offer" title="Programmes Tailored to How You Drive" />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                {PREVIEW_SERVICES.map(svc => (
                  <View key={svc.code} style={{ flex: 1, minWidth: 200 }}>
                    <ServiceCard svc={svc} />
                  </View>
                ))}
              </View>
            </View>
          </View>

        ) : (
          // Stacked: native mobile OR narrow web viewport
          <>
            <Image
              source={SERVICES_IMG}
              style={{
                width: '100%',
                height: IS_WEB ? Math.min(320, winW * 0.45) : 260,
                borderRadius: 18,
                backgroundColor: 'rgba(1,165,240,0.08)', marginBottom: 28,
              }}
              resizeMode="cover"
              progressiveRenderingEnabled
              fadeDuration={200}
            />
            <SectionIntro badge="What We Offer" title="Programmes Tailored to How You Drive" />
            <View style={{ gap: 14, marginBottom: 36 }}>
              {PREVIEW_SERVICES.map(svc => (
                <ServiceCard key={svc.code} svc={svc} />
              ))}
            </View>
            <SeeAllBtn />
          </>
        )}

      </View>
    </View>
  );
}
