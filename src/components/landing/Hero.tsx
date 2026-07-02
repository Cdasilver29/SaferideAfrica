import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Pressable, Animated, Platform, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronDown, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, HERO_SRC } from './constants';
import { KenBurnsBackground } from '../animations/KenBurnsBackground';
import { Button, Icon } from '@/components/ui';
import { useReduceMotion } from '@/hooks/useReduceMotion';

// Palette-only colour helpers, so the photographic scrims and the glow carry no
// raw hex: every value is derived from the C source-of-truth constants.
const rgbTriplet = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};
const rgba = (hex: string, a: number) => `rgba(${rgbTriplet(hex)}, ${a})`;
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

// Word-by-word stagger headline; body words white, accent words yellow.
// Phase 12: removes the infinite accent pulse; the entrance plays once and
// settles, and is shown immediately under reduce-motion.
function AnimatedHeadline({ words, accentFrom }: { words: string[]; accentFrom: number }) {
  const reduceMotion = useReduceMotion();
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
  const { width: winW, height: winH } = useWindowDimensions();
  const isMobile = !IS_WEB || (IS_WEB && winW < 768);

  const words = t('hero.headlineWords', { returnObjects: true }) as string[];
  const visibleWords = words.filter((w) => w.length > 0);
  const accentFrom = Math.max(0, visibleWords.length - 2);
  const subheadline = t('hero.subheadline');

  const heroH = IS_WEB ? 580 : winH * 0.8;

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
