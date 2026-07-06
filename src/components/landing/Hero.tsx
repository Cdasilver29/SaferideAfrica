import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Pressable, Animated, Easing, Platform, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronDown, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, HERO_SRC } from './constants';
import { KenBurnsBackground } from '../animations/KenBurnsBackground';
import { Button, Icon } from '@/components/ui';
import { useReduceMotion } from '@/hooks/useReduceMotion';

// Palette-only colour helper, so the scrim and CTA glow carry no raw hex: the
// values are derived from the C source-of-truth constants.
const rgbTriplet = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};
const YELLOW_RGB = rgbTriplet(C.yellow);
const DARK_RGB = rgbTriplet(C.dark);

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
      className="mb-6 max-w-[540px] text-sm leading-6 text-white/90 web:text-base web:leading-7"
    >
      {displayed}
      {typing && <Text style={{ color: C.yellow, fontFamily: F.bold }}>{'|'}</Text>}
    </Text>
  );
}

// Per-slide eyebrow + headline that cross-fades in sync with the rotating hero
// photo, one pair per slide, driven by the active index KenBurnsBackground
// reports. Headline is white with a single yellow accent word (seg.c ===
// 'yellow'). Opacity only, on the react-native Animated API this file already
// uses; the animated wrapper carries no className (a no-op on Animated.*), so
// layout sits on the inner View. Under reduce-motion the first slide shows
// static with no fade.
type HeadlineSeg = { w: string; c?: string };
type HeroSlide = { eyebrow: string; words: (HeadlineSeg | string)[] };

function HeroSlideText({ slide, slides }: { slide: number; slides: HeroSlide[] }) {
  const reduceMotion = useReduceMotion();
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || winW < 768;
  const opacity = useRef(new Animated.Value(1)).current;
  const [shown, setShown] = useState(slide);

  useEffect(() => {
    if (reduceMotion) {
      setShown(slide);
      opacity.setValue(1);
      return;
    }
    if (slide === shown) return;
    let cancelled = false;
    // Fade the current pair out, swap the content at the trough, fade the new
    // pair in. Exit is quicker than enter so the change feels responsive.
    Animated.timing(opacity, {
      toValue: 0, duration: 220, easing: Easing.in(Easing.quad),
      useNativeDriver: Platform.OS !== 'web',
    }).start(({ finished }) => {
      if (!finished || cancelled) return;
      setShown(slide);
      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1, duration: 480, easing: Easing.out(Easing.quad),
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    });
    return () => { cancelled = true; };
  }, [slide, reduceMotion]);

  const data = slides[shown] ?? slides[0];
  const words: HeadlineSeg[] = (data?.words ?? [])
    .map((s) => (typeof s === 'string' ? { w: s } : s))
    .filter((s) => s.w && s.w.length > 0);
  const fontSize = isMobile ? 26 : 42;
  const lineH = isMobile ? 33 : 50;

  return (
    <Animated.View style={{ opacity }}>
      {/* Layout on a plain View; className is a no-op on the Animated wrapper */}
      <View className="mb-3 web:mb-4">
        {data?.eyebrow ? (
          <Text
            style={{ fontFamily: F.bold, color: C.yellow, letterSpacing: 2 }}
            className="mb-2.5 text-xs uppercase web:text-sm"
          >
            {data.eyebrow}
          </Text>
        ) : null}
        <View className="flex-row flex-wrap gap-x-2">
          {words.map((seg, i) => (
            <Text
              key={seg.w + i}
              style={{
                color: seg.c === 'yellow' ? C.yellow : C.white,
                fontFamily: F.bold, fontSize, lineHeight: lineH,
              }}
            >
              {seg.w}
            </Text>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

// Enrol CTA: the single reserved accent action, settled to a static halo.
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
  const isWide = IS_WEB && winW >= 1024;

  const slides = (t('hero.slides', { returnObjects: true }) as HeroSlide[]) ?? [];
  const subheadline = t('hero.subheadline');

  // The active photo index, reported by the rotating background so the headline
  // pair stays in sync. Pinned to 0 under reduce-motion (no rotation).
  const [slide, setSlide] = useState(0);

  // One full-bleed hero: the photo fills the section and the copy sits on a
  // horizontal scrim, dark over the text side fading out across the image.
  // Mobile keeps a stronger far edge because the copy spans most of the width.
  const scrimColors = [
    `rgba(${DARK_RGB}, 0.78)`,
    `rgba(${DARK_RGB}, ${isMobile ? 0.45 : 0.12})`,
  ] as const;

  return (
    <View
      className="justify-center overflow-hidden"
      style={{ minHeight: isWide ? 580 : isMobile ? 480 : 520 }}
    >
      <KenBurnsBackground source={HERO_SRC} onIndexChange={setSlide} />

      {/* Readability scrim over the photo, decorative only */}
      <LinearGradient
        colors={scrimColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        pointerEvents="none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Copy block, in flow so the section grows instead of clipping */}
      <View
        className="w-full justify-center py-14"
        style={{
          maxWidth: MAX_W,
          alignSelf: 'center',
          paddingHorizontal: isWide ? 48 : 24,
        }}
      >
        <View style={{ maxWidth: 620 }}>
          {/* Per-slide headline, cross-fading in sync with the photo */}
          <HeroSlideText key={i18n.language} slide={slide} slides={slides} />

          {/* Typewriter sub-headline */}
          <TypewriterText key={i18n.language + '-sub'} subheadline={subheadline} />

          {/* CTAs on the scrim, visible at every width */}
          <View className="flex-row flex-wrap items-center gap-3">
            <GlowingEnrolButton onPress={onEnrol ?? (() => router.push('/courses' as any))} />

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
          </View>
        </View>
      </View>

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
  );
}
