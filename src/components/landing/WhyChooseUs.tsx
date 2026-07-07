import React, { useEffect } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withSequence,
  withTiming, withDelay, Easing,
} from 'react-native-reanimated';
import { C, F, IS_WEB, MAX_W, WHY_FEATURES, STATS } from './constants';
import { cn } from '@/components/ui';
import { CountUp } from '@/components/CountUp';
import { useInView } from '@/hooks/useInView';

const WHY_KEY_MAP: Record<string, string> = {
  ShieldCheck: 'realDrivers',
  BookOpen: 'ntsaCurriculum',
  CreditCard: 'smartDl',
  Award: 'bestTrainers',
  Clock: 'perfectTiming',
};

const STAT_KEY_MAP: Record<string, string> = {
  'Total Learners': 'totalLearners',
  'Current Students': 'currentStudents',
  'Expert Instructors': 'expertInstructors',
};

// Modern emoji icons to replace plain text-only cards
const FEATURE_EMOJIS: Record<string, string> = {
  ShieldCheck: '🛡️',
  BookOpen: '📖',
  CreditCard: '💳',
  Award: '🏆',
  Clock: '⏰',
};

function StatCounter({ target, suffix, label, inView }: { target: number; suffix: string; label: string; inView: boolean }) {
  const { width: winW } = useWindowDimensions();
  const numberFontSize = winW < 480 ? 28 : winW < 768 ? 36 : 44;
  const labelFontSize = winW < 640 ? 12 : 14;

  return (
    <View className="flex-1 items-center">
      <CountUp value={target} suffix={suffix} durationMs={1800} active={inView} style={{ color: C.yellow, fontFamily: F.bold, fontSize: numberFontSize }} />
      <Text style={{ fontFamily: F.regular, fontSize: labelFontSize }} className="mt-1 text-center text-white/70">
        {label}
      </Text>
    </View>
  );
}

// Animated feature card with zoom + shake
function FeatureCard({ feat, index }: { feat: typeof WHY_FEATURES[0]; index: number }) {
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const tKey = WHY_KEY_MAP[feat.iconName] ?? feat.iconName;
  const emoji = FEATURE_EMOJIS[feat.iconName] ?? '✅';

  const cardW: any = !IS_WEB ? undefined
    : winW < 480 ? '100%'
    : winW < 768 ? 'calc(50% - 9px)'
    : winW < 1024 ? 'calc(33.33% - 12px)'
    : 'calc(20% - 18px)';

  // Zoom + shake animation
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Staggered start for each card
    const delay = index * 400;

    // Zoom in/out
    scale.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1, true
    ));

    // Shake (small rotation oscillation)
    rotate.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(-2, { duration: 100, easing: Easing.linear }),
        withTiming(2, { duration: 100, easing: Easing.linear }),
        withTiming(-1.5, { duration: 80, easing: Easing.linear }),
        withTiming(1.5, { duration: 80, easing: Easing.linear }),
        withTiming(0, { duration: 80, easing: Easing.linear }),
        // Pause between shakes
        withTiming(0, { duration: 2800, easing: Easing.linear }),
      ),
      -1, false
    ));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        IS_WEB ? { width: cardW } : undefined,
        animStyle,
      ]}
    >
      <View
        style={{
          alignItems: 'center',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.2)',
          backgroundColor: 'rgba(255,255,255,0.08)',
          padding: 20,
          // Glow effect
          shadowColor: C.yellow,
          shadowOpacity: 0.15,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 0 },
          elevation: 4,
        }}
      >
        {/* Emoji icon */}
        <Text style={{ fontSize: 32, marginBottom: 10 }}>{emoji}</Text>
        <Text style={{ fontFamily: F.bold }} className="mb-2 text-center text-sm text-white">
          {t(`whyChooseUs.items.${tKey}.title`)}
        </Text>
        <Text style={{ fontFamily: F.regular }} className="text-center text-xs leading-[18px] text-white/70">
          {t(`whyChooseUs.items.${tKey}.desc`)}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function WhyChooseUs() {
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const { ref: statsRef, inView: statsInView } = useInView();

  return (
    <View className="bg-primary px-6 py-[72px] dark:bg-background">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        {/* Heading */}
        <View className="mb-12 items-center">
          <Text style={{ fontFamily: F.bold, letterSpacing: 2.5 }} className="mb-2.5 text-xs uppercase text-accent">
            {t('whyChooseUs.overline')}
          </Text>
          <Text style={{ fontFamily: F.bold }} className="mb-3 text-center text-2xl leading-8 text-white web:text-[34px] web:leading-[44px]">
            {t('whyChooseUs.heading')}
          </Text>
          <View className="flex-row items-center gap-2">
            <View className="h-0.5 w-10 rounded-pill bg-accent/45" />
            <View className="h-2 w-2 rounded-pill bg-accent" />
            <View className="h-0.5 w-10 rounded-pill bg-accent/45" />
          </View>
        </View>

        {/* Feature cards with zoom + shake */}
        <View className={cn('mb-11', IS_WEB ? 'flex-row flex-wrap gap-[18px]' : 'gap-3.5')}>
          {WHY_FEATURES.map((feat, i) => (
            <FeatureCard key={feat.title} feat={feat} index={i} />
          ))}
        </View>

        {/* Divider */}
        <View className="mb-11 h-px bg-white/20" />

        {/* Stats */}
        <View ref={statsRef} className="flex-row justify-around gap-2">
          {STATS.map((s) => {
            const statKey = STAT_KEY_MAP[s.label] ?? s.label;
            return (
              <StatCounter key={s.label} target={s.value} suffix={s.suffix} label={t(`whyChooseUs.stats.${statKey}`)} inView={statsInView} />
            );
          })}
        </View>
      </View>
    </View>
  );
}
