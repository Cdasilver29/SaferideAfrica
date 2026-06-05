import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Platform, TouchableOpacity, useWindowDimensions } from 'react-native';
import AnimatedRN, {
  useSharedValue, useAnimatedStyle,
  withSpring, withSequence, withTiming, withDelay,
  interpolate,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, WHY_FEATURES, STATS } from './constants';

const WHY_KEY_MAP: Record<string, string> = {
  BookOpen: 'onlineClasses',
  Map:      'onlineTracking',
  Tag:      'affordableFee',
  Award:    'bestTrainers',
  Clock:    'perfectTiming',
};

const STAT_KEY_MAP: Record<string, string> = {
  'Total Learners':     'totalLearners',
  'Current Students':   'currentStudents',
  'Expert Instructors': 'expertInstructors',
};

// ── Animated counter ──────────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const listener = anim.addListener(({ value }) => setDisplay(Math.floor(value)));
    Animated.timing(anim, { toValue: target, duration: 1800, delay: 300, useNativeDriver: false }).start();
    return () => anim.removeListener(listener);
  }, []);

  return (
    <View style={{ alignItems: 'center', flex: IS_WEB ? 1 : undefined }}>
      <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: IS_WEB ? 44 : 36 }}>
        {display}{suffix}
      </Text>
      <Text style={{ color: 'rgba(255,255,255,0.7)', fontFamily: F.regular, fontSize: 13, marginTop: 4, textAlign: 'center' }}>
        {label}
      </Text>
    </View>
  );
}

// ── Feature card with entrance stagger + sway + yellow coat ──────────────────

function FeatureItem({
  feat, index, t, cardW,
}: {
  feat: typeof WHY_FEATURES[0];
  index: number;
  t: (key: string) => string;
  cardW: any;
}) {
  const tKey = WHY_KEY_MAP[feat.iconName] ?? feat.iconName;

  // Entrance (stagger by index)
  const enterOp = useSharedValue(0);
  const enterY  = useSharedValue(24);

  // Hover / press sway
  const lift   = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    enterOp.value = withDelay(index * 100, withTiming(1,  { duration: 480 }));
    enterY.value  = withDelay(index * 100, withTiming(0,  { duration: 480 }));
  }, []);

  const onEnter = () => {
    lift.value   = withSpring(1, { damping: 7, stiffness: 220 });
    // Quick tilt left → spring sway right — the signature sway
    rotate.value = withSequence(
      withTiming(-2.5, { duration: 90 }),
      withSpring(2.5, { damping: 5, stiffness: 180 }),
    );
  };

  const onLeave = () => {
    lift.value   = withSpring(0, { damping: 10, stiffness: 200 });
    rotate.value = withSpring(0, { damping: 8,  stiffness: 200 });
  };

  const animStyle = useAnimatedStyle(() => {
    const glowOp   = interpolate(lift.value, [0, 1], [0.12, 0.90]);
    const shadowR  = interpolate(lift.value, [0, 1], [0, 28]);
    const borderOp = interpolate(lift.value, [0, 1], [0.15, 1]);

    return {
      opacity:   enterOp.value,
      transform: [
        { translateY: enterY.value },
        { scale:      interpolate(lift.value, [0, 1], [1, 1.06]) },
        { translateY: interpolate(lift.value, [0, 1], [0, -8]) },
        { rotate:     `${rotate.value}deg` },
      ],
      // Yellow coat — border brightens from dim to full yellow on hover
      borderColor:   `rgba(255,216,0,${borderOp})`,
      // Yellow glow shadow
      shadowColor:   C.yellow,
      shadowOpacity: interpolate(lift.value, [0, 1], [0.10, 0.75]),
      shadowRadius:  shadowR,
      shadowOffset:  { width: 0, height: 4 },
      elevation:     interpolate(lift.value, [0, 1], [2, 18]),
      ...(IS_WEB && {
        // @ts-ignore web-only
        boxShadow: `0 0 ${shadowR}px rgba(255,216,0,${glowOp}), 0 4px 16px rgba(255,216,0,${(glowOp * 0.5).toFixed(2)})`,
      }),
    };
  });

  return (
    <AnimatedRN.View
      style={[
        {
          width: cardW,
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: 16,
          borderWidth: 1.5,
        },
        animStyle,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.92}
        onPressIn={onEnter}
        onPressOut={onLeave}
        {...(IS_WEB ? ({ onMouseEnter: onEnter, onMouseLeave: onLeave } as any) : {})}
        style={{ padding: 22, alignItems: 'center', borderRadius: 16 }}
      >
        <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 14, textAlign: 'center', marginBottom: 8 }}>
          {t(`whyChooseUs.items.${tKey}.title`)}
        </Text>
        <Text style={{ color: C.mutedDark, fontFamily: F.regular, fontSize: 12, lineHeight: 18, textAlign: 'center' }}>
          {t(`whyChooseUs.items.${tKey}.desc`)}
        </Text>
      </TouchableOpacity>
    </AnimatedRN.View>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function WhyChooseUs() {
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  // Responsive columns: 1 col <480, 2 col <768, 3 col <1024, 5 col 1024+
  const cardW: any = !IS_WEB ? undefined
    : winW < 480  ? '100%'
    : winW < 768  ? 'calc(50% - 9px)'
    : winW < 1024 ? 'calc(33.33% - 12px)'
    : 'calc(20% - 18px)';

  return (
    <View style={{ backgroundColor: C.skyDeep, paddingVertical: 72, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        {/* Heading */}
        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>
            {t('whyChooseUs.overline')}
          </Text>
          <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: IS_WEB ? 34 : 26, textAlign: 'center', lineHeight: IS_WEB ? 44 : 34, marginBottom: 12 }}>
            {t('whyChooseUs.heading')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 2, width: 40, backgroundColor: 'rgba(255,216,0,0.45)', borderRadius: 2 }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.yellow }} />
            <View style={{ height: 2, width: 40, backgroundColor: 'rgba(255,216,0,0.45)', borderRadius: 2 }} />
          </View>
        </View>

        {/* Feature cards */}
        <View style={IS_WEB
          ? { flexDirection: 'row', flexWrap: 'wrap', gap: 18, marginBottom: 56 }
          : { gap: 14, marginBottom: 44 }
        }>
          {WHY_FEATURES.map((feat, i) => (
            <FeatureItem key={feat.title} feat={feat} index={i} t={t} cardW={cardW} />
          ))}
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.20)', marginBottom: 44 }} />

        {/* Stats */}
        <View style={IS_WEB
          ? { flexDirection: 'row', justifyContent: 'space-around' }
          : { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24 }
        }>
          {STATS.map(s => {
            const statKey = STAT_KEY_MAP[s.label] ?? s.label;
            return (
              <AnimatedCounter
                key={s.label}
                target={s.value}
                suffix={s.suffix}
                label={t(`whyChooseUs.stats.${statKey}`)}
              />
            );
          })}
        </View>

      </View>
    </View>
  );
}
