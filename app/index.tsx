import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, SafeAreaView, DeviceEventEmitter, type LayoutChangeEvent } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import Animated, {
  useSharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

import Hero         from '@/components/landing/Hero';
import StatStrip    from '@/components/landing/StatStrip';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';

import ServicesPreview from '@/components/landing/ServicesPreview';
import { PremiumCourseCards } from '@/components/landing/PremiumCourseCards';
import DriverTypeSection from '@/components/landing/DriverTypeSection';
import WhyValuesSnippet from '@/components/landing/WhyValuesSnippet';
import AboutPreview    from '@/components/landing/AboutPreview';
import HomeFaq         from '@/components/landing/HomeFaq';
import EnrolSteps      from '@/components/landing/EnrolSteps';
import GalleryPreview  from '@/components/landing/GalleryPreview';
import BranchesPreview from '@/components/landing/BranchesPreview';
import FinalCTA        from '@/components/landing/FinalCTA';

import { C } from '@/components/landing/constants';
import { Reveal } from '@/components/animations/Reveal';
import { PageHead, DRIVING_SCHOOL_JSONLD } from '@/components/PageHead';
import ScrollRail, { type RailSection } from '@/components/ScrollRail';
import { useReduceMotion } from '@/hooks/useReduceMotion';

/**
 * Every block that renders above the last rail anchor, in render order.
 *
 * The rail needs each anchor's y offset, and the obvious source, the y that
 * onLayout reports, is wrong here. react-native-web backs onLayout with a
 * ResizeObserver, so a block re-reports when its own size changes but not when
 * it merely moves because an image above it finished loading. On a page this
 * image-heavy every offset below the hero went stale within a second of load,
 * which sent the Reviews dot to the services block.
 *
 * Heights do re-report, so the offsets are summed from them instead. That is
 * exact as long as the blocks are a plain unpadded stack with no margins
 * between them, which is what the scroll container is.
 */
const BLOCK_KEYS = [
  'top', 'stats', 'services', 'courses', 'driverTypes', 'whyUs', 'about',
  'faq', 'enrol', 'reviews', 'branches', 'gallery', 'contact',
] as const;

/**
 * The six blocks that get a dot. A visitor would not navigate to most of the
 * thirteen, so the rest are scrolled past rather than listed. Order must match
 * BLOCK_KEYS, since the active-dot search expects ascending y.
 */
const RAIL_SECTIONS: readonly RailSection[] = [
  { key: 'top',      labelKey: 'scrollRail.top' },
  { key: 'services', labelKey: 'scrollRail.services' },
  { key: 'courses',  labelKey: 'scrollRail.courses' },
  { key: 'whyUs',    labelKey: 'scrollRail.whyUs' },
  { key: 'reviews',  labelKey: 'scrollRail.reviews' },
  { key: 'contact',  labelKey: 'scrollRail.contact' },
];

export default function LandingScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const reduceMotion = useReduceMotion();

  const scrollY = useSharedValue(0);
  // Captured from the same scroll event as scrollY, so the rail's progress
  // needs no second listener and no measurement pass of its own.
  const contentHeight = useSharedValue(0);
  const viewportHeight = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      'worklet';
      scrollY.value = event.contentOffset.y;
      contentHeight.value = event.contentSize.height;
      viewportHeight.value = event.layoutMeasurement.height;
    },
  });

  // useAnimatedRef keeps the imperative .scrollTo the scrollToTop listener
  // already relies on, and is what the rail's jumps go through.
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  // Block heights, reported by onLayout on the wrappers below.
  const [heights, setHeights] = useState<Record<string, number>>({});

  const recordHeight = useCallback((key: string) => (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setHeights((prev) => (prev[key] === height ? prev : { ...prev, [key]: height }));
  }, []);

  // Offsets into the scroll content, which is the coordinate space scrollTo
  // expects. A block whose height has not arrived yet stops the running total:
  // everything after it stays absent, so the rail disables those dots rather
  // than pointing them somewhere wrong. It fills in as the heights land.
  const positions = useMemo(() => {
    const offsets: Record<string, number> = {};
    let y = 0;
    for (const key of BLOCK_KEYS) {
      const height = heights[key];
      if (height === undefined) break;
      offsets[key] = y;
      y += height;
    }
    return offsets;
  }, [heights]);

  const jumpTo = useCallback((y: number) => {
    scrollRef.current?.scrollTo({ y, animated: !reduceMotion });
  }, [reduceMotion]);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('scrollToTop', () => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });
    return () => sub.remove();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? C.dark : C.white }}>
      <PageHead
        title="Safe Ride Africa: NTSA-Certified Driving School in Nairobi"
        description="Nairobi's trusted NTSA-certified driving school. Branches across the city. Enrol online today."
        path="/"
      >
        <script type="application/ld+json">{DRIVING_SCHOOL_JSONLD}</script>
      </PageHead>

      <Animated.ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Every block up to the last anchor reports its height, since the
            offsets are summed rather than read. Reveal spreads its rest props
            onto a static outer View, so the ten Reveal-wrapped blocks take
            onLayout directly and stay unmodified; the three bare ones get a
            plain measuring wrapper. Footer is last, so nothing needs its
            height and it stays untouched. */}
        <View onLayout={recordHeight('top')}>
          <Hero onScrollToCourses={() => router.push('/courses')} />
        </View>
        <View onLayout={recordHeight('stats')}>
          <StatStrip />
        </View>
        <Reveal variant="rise" onLayout={recordHeight('services')}><ServicesPreview /></Reveal>
        <View onLayout={recordHeight('courses')}>
          <PremiumCourseCards />
        </View>
        <Reveal variant="slide-right" onLayout={recordHeight('driverTypes')}><DriverTypeSection /></Reveal>
        <Reveal variant="slide-left" onLayout={recordHeight('whyUs')}><WhyValuesSnippet /></Reveal>
        <Reveal variant="slide-right" onLayout={recordHeight('about')}><AboutPreview /></Reveal>
        <Reveal variant="rise" onLayout={recordHeight('faq')}><HomeFaq /></Reveal>
        <Reveal variant="flip" onLayout={recordHeight('enrol')}><EnrolSteps /></Reveal>
        <Reveal variant="slide-left" onLayout={recordHeight('reviews')}><Testimonials /></Reveal>
        <Reveal variant="rise" onLayout={recordHeight('branches')}><BranchesPreview /></Reveal>
        <Reveal variant="slide-right" onLayout={recordHeight('gallery')}><GalleryPreview /></Reveal>
        <Reveal variant="light-speed" onLayout={recordHeight('contact')}><FinalCTA /></Reveal>
        <Footer />
      </Animated.ScrollView>

      <ScrollRail
        sections={RAIL_SECTIONS}
        positions={positions}
        scrollY={scrollY}
        contentHeight={contentHeight}
        viewportHeight={viewportHeight}
        onJump={jumpTo}
      />
    </SafeAreaView>
  );
}
