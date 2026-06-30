import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Image, Pressable, Animated, Platform, useWindowDimensions,
} from 'react-native';
import AnimatedRN, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming,
  interpolate, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronDown, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, SCREEN_H, HERO_SRC } from './constants';
import { KenBurnsBackground } from '../animations/KenBurnsBackground';
import { Button, Icon } from '@/components/ui';

const NTSA_LOGO = require('../../../assets/images/ntsa-logo.png');

// Palette-only colour helpers, so the photographic scrims and the glow carry no
// raw hex: every value is derived from the C source-of-truth constants.
const rgbTriplet = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};
const rgba = (hex: string, a: number) => `rgba(${rgbTriplet(hex)}, ${a})`;
const YELLOW_RGB = rgbTriplet(C.yellow);

// Typewriter that types the full sentence, holds, erases, then loops forever.
// Phase 12 fixes this to type once and respect reduce-motion.
function TypewriterText({ subheadline }: { subheadline: string }) {
  const [displayed, setDisplayed] = useState('');
  const cursorAnim = useRef(new Animated.Value(1)).current;
  const activeRef = useRef(true);

  useEffect(() => {
    activeRef.current = true;
    setDisplayed('');

    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorAnim, { toValue: 0, duration: 480, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(cursorAnim, { toValue: 1, duration: 480, useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    blink.start();

    const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

    async function runLoop() {
      await sleep(750);
      while (activeRef.current) {
        for (let i = 1; i <= subheadline.length; i++) {
          if (!activeRef.current) return;
          setDisplayed(subheadline.slice(0, i));
          await sleep(28);
        }
        await sleep(1800);
        for (let i = subheadline.length - 1; i >= 0; i--) {
          if (!activeRef.current) return;
          setDisplayed(subheadline.slice(0, i));
          await sleep(14);
        }
        await sleep(500);
      }
    }

    runLoop();
    return () => { activeRef.current = false; blink.stop(); };
  }, [subheadline]);

  return (
    <Text
      style={{ fontFamily: F.regular }}
      className="mb-4 max-w-[540px] text-sm leading-6 text-white/80 web:text-base web:leading-7"
    >
      {displayed}
      <Animated.Text style={{ opacity: cursorAnim, color: C.yellow, fontFamily: F.bold }}>{'|'}</Animated.Text>
    </Text>
  );
}

// Word-by-word stagger headline; body words white, accent words yellow.
// Phase 12 removes the infinite accent pulse.
function AnimatedHeadline({ words, accentFrom }: { words: string[]; accentFrom: number }) {
  const anims = useRef(words.map(() => new Animated.Value(0))).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const stagger = Animated.stagger(
      90,
      anims.map((a) => Animated.timing(a, { toValue: 1, duration: 500, useNativeDriver: Platform.OS !== 'web' })),
    );
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 1800, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1800, useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    stagger.start(() => pulse.start());
    return () => { stagger.stop(); pulse.stop(); };
  }, []);

  const fontSize = IS_WEB ? 56 : 28;
  const lineH = IS_WEB ? 64 : 34;

  return (
    <View className="mb-3 flex-row flex-wrap gap-x-2 web:mb-4">
      {words.filter((w) => w.length > 0).map((word, i) => {
        const isAccent = i >= accentFrom;
        const anim = anims[i] ?? new Animated.Value(1);
        return (
          <Animated.View
            key={word + i}
            style={{
              opacity: anim,
              transform: [
                { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
                ...(isAccent ? [{ scale: pulseAnim }] : []),
              ],
            }}
          >
            <Text style={{ color: isAccent ? C.yellow : C.white, fontFamily: F.bold, fontSize, lineHeight: lineH }}>
              {word}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
}

// Enrol CTA: the single reserved accent action, with a yellow glow breath.
function GlowingEnrolButton({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  const glow = useSharedValue(0);

  useEffect(() => {
    glow.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      -1, true,
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => {
    const radius = interpolate(glow.value, [0, 1], [8, 22]);
    const opacity = interpolate(glow.value, [0, 1], [0.45, 0.85]);
    return {
      shadowColor: C.yellow,
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: { width: 0, height: 0 },
      elevation: interpolate(glow.value, [0, 1], [6, 14]),
      borderRadius: 8,
      ...(IS_WEB && { boxShadow: `0 0 ${radius}px rgba(${YELLOW_RGB}, ${opacity})` }),
    };
  });

  return (
    <AnimatedRN.View style={glowStyle}>
      <Button variant="accent" size="lg" onPress={onPress} accessibilityLabel={t('common.enrolNow')}>
        <Text style={{ fontFamily: F.bold }} className="text-base text-accent-foreground">
          {t('common.enrolNow')}
        </Text>
        <Icon icon={ArrowRight} size="md" color={C.dark} />
      </Button>
    </AnimatedRN.View>
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

  const words = t('hero.headlineWords', { returnObjects: true }) as string[];
  const visibleWords = words.filter((w) => w.length > 0);
  const accentFrom = Math.max(0, visibleWords.length - 2);
  const subheadline = t('hero.subheadline');

  const heroH = IS_WEB ? 580 : SCREEN_H * 0.8;

  return (
    <View style={{ height: heroH }} className="overflow-hidden">
      <KenBurnsBackground source={HERO_SRC} />

      {/* Photographic depth: dark gradient base, a sky-light haze, a bottom vignette */}
      <LinearGradient
        colors={[rgba(C.dark, 0.3), rgba(C.dark, 0.62)]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' } as any}
      />
      <LinearGradient
        colors={['transparent', rgba(C.skyLight, 0.18), 'transparent']}
        start={{ x: 0.5, y: 0.05 }}
        end={{ x: 0.5, y: 0.6 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' } as any}
      />
      <LinearGradient
        colors={['transparent', rgba(C.dark, 0.62)]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, pointerEvents: 'none' } as any}
      />

      <View
        className="flex-1 items-start justify-start px-6 pb-8 pt-4"
        style={IS_WEB && !isMobile ? { maxWidth: 720, paddingHorizontal: 48, paddingTop: 24 } : undefined}
      >
        {/* NTSA badge */}
        <View
          className="mb-4 flex-row items-center gap-2 rounded-pill border border-accent/40 bg-accent/15 px-3.5 py-1.5 web:mb-6"
          style={isMobile ? { alignSelf: 'center' } : undefined}
        >
          <Image
            source={NTSA_LOGO}
            style={{ width: isMobile ? 14 : 20, height: isMobile ? 14 : 20 }}
            resizeMode="contain"
          />
          <Text
            style={{ fontFamily: F.bold, letterSpacing: 1.2 }}
            className="text-[9px] uppercase text-accent web:text-[11px]"
          >
            {t('hero.badge')}
          </Text>
        </View>

        {/* Headline, the value-proposition focal point */}
        <AnimatedHeadline key={i18n.language} words={visibleWords} accentFrom={accentFrom} />

        {/* Typewriter sub-headline */}
        <TypewriterText key={i18n.language + '-sub'} subheadline={subheadline} />

        {/* CTAs, desktop only (mobile uses the Navbar Enroll button) */}
        {!isMobile && (
          <View className="flex-row flex-wrap items-center gap-3">
            {/* Explore Courses, demoted to a secondary outline on the photo */}
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

      {/* Scroll-down affordance, web */}
      {IS_WEB && (
        <Pressable
          onPress={onScrollToCourses}
          accessibilityRole="button"
          accessibilityLabel={t('hero.exploreCourses')}
          className="absolute inset-x-0 bottom-20 items-center"
        >
          <View className="h-11 w-11 items-center justify-center rounded-pill border border-white/30 bg-white/10">
            <Icon icon={ChevronDown} size="md" color={C.white} />
          </View>
        </Pressable>
      )}
    </View>
  );
}
