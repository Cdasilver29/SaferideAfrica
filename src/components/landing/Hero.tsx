import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Pressable, Animated, Platform, useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { ChevronDown, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, HERO_SRC } from './constants';
import { KenBurnsBackground } from '../animations/KenBurnsBackground';
import { Button, Icon } from '@/components/ui';
import { useReduceMotion } from '@/hooks/useReduceMotion';

// Palette-only colour helper, so the CTA glow carries no raw hex: the value is
// derived from the C source-of-truth constants.
const rgbTriplet = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};
const YELLOW_RGB = rgbTriplet(C.yellow);

// Typewriter that types the subheadline once, then holds static.
// Phase 12: types once (no erase loop, no blinking-cursor loop) and shows the
// full text immediately under reduce-motion.
function TypewriterText({ subheadline }: { subheadline: string }) {
  const reduceMotion = useReduceMotion();
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const activeRef = useRef(true);

  useEffect(() => {
    if (reduceMotion) {
      setDisplayed(subheadline);
      setTyping(false);
      return;
    }
    activeRef.current = true;
    setDisplayed('');
    setTyping(true);

    const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

    (async () => {
      await sleep(600);
      for (let i = 1; i <= subheadline.length; i++) {
        if (!activeRef.current) return;
        setDisplayed(subheadline.slice(0, i));
        await sleep(28);
      }
      if (activeRef.current) setTyping(false);
    })();

    return () => { activeRef.current = false; };
  }, [subheadline, reduceMotion]);

  return (
    <Text
      style={{ fontFamily: F.regular }}
      className="mb-4 max-w-[540px] text-sm leading-6 text-white/80 web:text-base web:leading-7"
    >
      {displayed}
      {typing && <Text style={{ color: C.yellow, fontFamily: F.bold }}>{'|'}</Text>}
    </Text>
  );
}

// Word-by-word stagger headline. Each word carries an optional brand colour
// (red / yellow / white); plain strings are tolerated and render white so any
// locale still on the old flat word list keeps working. Phase 12: entrance
// plays once and settles, shown immediately under reduce-motion.
type HeadlineSeg = { w: string; c?: string };
// "red" stays as a legacy alias mapped to sky: the palette reserves real red
// for destructive actions, and older locale payloads may still send it.
const HEADLINE_COLORS: Record<string, string> = {
  sky: C.skyDeep, red: C.skyDeep, yellow: C.yellow, white: C.white,
};

function AnimatedHeadline({ segments }: { segments: (HeadlineSeg | string)[] }) {
  const reduceMotion = useReduceMotion();
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || winW < 768;
  const words: HeadlineSeg[] = segments
    .map((s) => (typeof s === 'string' ? { w: s } : s))
    .filter((s) => s.w && s.w.length > 0);
  const anims = useRef(words.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (reduceMotion) {
      anims.forEach((a) => a.setValue(1));
      return;
    }
    const stagger = Animated.stagger(
      90,
      anims.map((a) => Animated.timing(a, { toValue: 1, duration: 500, useNativeDriver: Platform.OS !== 'web' })),
    );
    stagger.start();
    return () => stagger.stop();
  }, [reduceMotion]);

  const fontSize = isMobile ? 24 : 42;
  const lineH = isMobile ? 30 : 50;

  return (
    <View className="mb-3 flex-row flex-wrap gap-x-2 web:mb-4">
      {words.map((seg, i) => {
        const anim = anims[i] ?? new Animated.Value(1);
        const color = HEADLINE_COLORS[seg.c ?? 'white'] ?? C.white;
        return (
          <Animated.View
            key={seg.w + i}
            style={{
              opacity: anim,
              transform: [
                { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
              ],
            }}
          >
            <Text style={{ color, fontFamily: F.bold, fontSize, lineHeight: lineH }}>
              {seg.w}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
}

// Enrol CTA: the single reserved accent action. Phase 12 settles its glow to a
// static accent halo (no breathing loop).
function GlowingEnrolButton({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  const glowStyle = {
    shadowColor: C.yellow,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
    borderRadius: 8,
    ...(IS_WEB ? { boxShadow: `0 0 18px rgba(${YELLOW_RGB}, 0.5)` } : null),
  };

  return (
    <View style={glowStyle as any}>
      <Button variant="accent" size="lg" onPress={onPress} accessibilityLabel={t('common.enrolNow')}>
        <Text style={{ fontFamily: F.bold }} className="text-base text-accent-foreground">
          {t('common.enrolNow')}
        </Text>
        <Icon icon={ArrowRight} size="md" color={C.dark} />
      </Button>
    </View>
  );
}

interface HeroProps {
  onScrollToCourses: () => void;
  onEnrol?: () => void;
}

export default function Hero({ onScrollToCourses, onEnrol }: HeroProps) {
  const { t, i18n } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || (IS_WEB && winW < 768);
  // Side-by-side split needs room for the 42px headline in a half-width
  // panel, so it starts at 1024. Below that the two tones stack.
  const isWide = IS_WEB && winW >= 1024;

  const segments = t('hero.headlineWords', { returnObjects: true }) as (HeadlineSeg | string)[];
  const subheadline = t('hero.subheadline');

  return (
    <View className={isWide ? 'flex-row' : undefined} style={isWide ? { height: 580 } : undefined}>
      {/* Tone one: the brand-dark content panel */}
      <View
        className={isWide ? 'justify-center' : 'px-6 pb-8 pt-6'}
        style={[
          { backgroundColor: C.dark },
          isWide ? { width: '46%', paddingHorizontal: 48 } : null,
        ]}
      >
        {/* Headline, the value-proposition focal point */}
        <AnimatedHeadline key={i18n.language} segments={segments} />

        {/* Typewriter sub-headline */}
        <TypewriterText key={i18n.language + '-sub'} subheadline={subheadline} />

        {/* CTAs, desktop only (mobile uses the Navbar Enroll button) */}
        {!isMobile && (
          <View className="flex-row flex-wrap items-center gap-3">
            {/* Explore Courses, a secondary outline on the dark panel */}
            <Pressable
              onPress={onScrollToCourses}
              accessibilityRole="button"
              className="h-14 flex-row items-center gap-2 rounded-button border border-white/60 bg-white/10 px-7 hover:bg-white/20 active:bg-white/20"
            >
              <Text style={{ fontFamily: F.bold }} className="text-base text-white">
                {t('hero.exploreCourses')}
              </Text>
              <Icon icon={ChevronDown} size="md" color={C.white} />
            </Pressable>

            <GlowingEnrolButton onPress={onEnrol ?? (() => router.push('/courses' as any))} />
          </View>
        )}
      </View>

      {/* Yellow accent edge dividing the two tones */}
      <View className="bg-accent" style={isWide ? { width: 4 } : { height: 4 }} />

      {/* Tone two: the photo, clean, no scrims */}
      <View className="overflow-hidden" style={isWide ? { flex: 1 } : { height: isMobile ? 280 : 360 }}>
        <KenBurnsBackground source={HERO_SRC} />

        {/* Scroll-down affordance, web, sits over the photo */}
        {IS_WEB && (
          <Pressable
            onPress={onScrollToCourses}
            accessibilityRole="button"
            accessibilityLabel={t('hero.exploreCourses')}
            className="absolute inset-x-0 bottom-6 items-center"
          >
            <View className="h-11 w-11 items-center justify-center rounded-pill border border-white/30 bg-black/20">
              <Icon icon={ChevronDown} size="md" color={C.white} />
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
}
