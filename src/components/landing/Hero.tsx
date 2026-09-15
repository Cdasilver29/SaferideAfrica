import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Pressable, Animated, Easing, Platform, useWindowDimensions,
} from 'react-native';
import AnimatedRN, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronDown } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, HERO_SRC } from './constants';
import { KenBurnsBackground } from '../animations/KenBurnsBackground';
import { Icon } from '@/components/ui';
import { useReduceMotion } from '@/hooks/useReduceMotion';

// Palette-only colour helper, so the scrim carries no raw hex: the value is
// derived from the C source-of-truth constants.
const rgbTriplet = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};
const DARK_RGB = rgbTriplet(C.dark);

// Per-slide eyebrow + headline that cross-fades in sync with the rotating hero
// photo, one pair per slide, driven by the active index KenBurnsBackground
// reports. Headline is white with a single yellow accent word (seg.c ===
// 'yellow'). Opacity only, on the react-native Animated API this file already
// uses; the animated wrapper carries no className (a no-op on Animated.*), so
// layout sits on the inner View. Under reduce-motion the first slide shows
// static with no fade.
type HeadlineSeg = { w: string; c?: string };
type HeroSlide = { eyebrow: string; words: (HeadlineSeg | string)[] };

// The copy block is centred in the hero, which leaves the headline floating in
// the middle of the photo and the button stranded above the stat cards. These
// pull the headline up toward the header and push the button down toward the
// cards, on every width.
//
// Both are transforms, never margins. A margin would reflow the centred block,
// so moving either one would drag the other along with it. A transform takes
// no part in layout, so the two move independently.
//
// The numbers are per breakpoint because all three inputs change: the hero's
// height, how far the stat strip rises into it, and how tall the headline
// renders. The headline is the loose one, it varies by slide and by language,
// so each drop leaves margin for the tallest case rather than sitting flush.
//
//   phone   hero 480, cards rise 40 (OVERLAP_NATIVE), headline 120 to 180
//   tablet  hero 520, cards rise 56 (OVERLAP_WEB),    headline 113 to 241
//   wide    hero 580, cards rise 56 (OVERLAP_WEB),    headline 113 to 241
//
// Tablet takes the smallest drop: it pairs the desktop headline with a hero
// 60px shorter, so it has the least room to give.
const HERO_SHIFT = {
  phone:  { lift: 90,  drop: 65 },
  tablet: { lift: 100, drop: 45 },
  wide:   { lift: 100, drop: 70 },
} as const;

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
  const fontSize = isMobile ? 32 : 56;
  const lineH = isMobile ? 40 : 64;

  return (
    <Animated.View style={{ opacity }}>
      {/* Layout on a plain View; className is a no-op on the Animated wrapper */}
      <View className={['mb-3 web:mb-4', isMobile && 'items-center'].join(' ')}>
        {data?.eyebrow ? (
          <Text
            style={{ fontFamily: F.bold, color: C.skyDeep, letterSpacing: 2, textAlign: isMobile ? 'center' : 'left' }}
            className="mb-2.5 text-sm uppercase web:text-lg"
          >
            {data.eyebrow}
          </Text>
        ) : null}
        <View className={['flex-row flex-wrap gap-x-2', isMobile && 'justify-center'].join(' ')}>
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

interface HeroProps {
  onScrollToCourses: () => void;
}

export default function Hero({ onScrollToCourses }: HeroProps) {
  const { t, i18n } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || (IS_WEB && winW < 768);
  const isWide = IS_WEB && winW >= 1024;

  // Same three bands the hero already sizes itself by, see HERO_SHIFT.
  const shift = isMobile ? HERO_SHIFT.phone : isWide ? HERO_SHIFT.wide : HERO_SHIFT.tablet;

  const slides = (t('hero.slides', { returnObjects: true }) as HeroSlide[]) ?? [];

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
        <AnimatedRN.View entering={FadeInUp.duration(800).delay(300)} style={{ maxWidth: 620, alignItems: isMobile ? 'center' : 'flex-start' }}>
          {/* Per-slide headline, cross-fading in sync with the photo.
              Lifted toward the header at every width, see HERO_SHIFT. */}
          <View style={{ transform: [{ translateY: -shift.lift }] }}>
            <HeroSlideText key={i18n.language} slide={slide} slides={slides} />
          </View>

          {/* Explore Courses is the one hero-body control; Enrol lives in the header */}
          <AnimatedRN.View
            entering={FadeInUp.duration(800).delay(600)}
            className={['mt-6 flex-row flex-wrap items-center gap-3', isMobile && 'justify-center'].join(' ')}
            style={{ transform: [{ translateY: shift.drop }] }}
          >
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
          </AnimatedRN.View>
        </AnimatedRN.View>
      </View>

    </View>
  );
}
