import React, { useRef, useState, useCallback } from 'react';
import { Animated, SafeAreaView, View, useWindowDimensions } from 'react-native';
import { useColorScheme } from 'nativewind';

import Navbar       from '@/components/landing/Navbar';
import Hero         from '@/components/landing/Hero';
import Services     from '@/components/landing/Services';
import About        from '@/components/landing/About';
import Courses      from '@/components/landing/Courses';
import FAQ          from '@/components/landing/FAQ';
import Instructors  from '@/components/landing/Instructors';
import WhyChooseUs  from '@/components/landing/WhyChooseUs';
import Gallery      from '@/components/landing/Gallery';
import WorkProcess  from '@/components/landing/WorkProcess';
import Testimonials from '@/components/landing/Testimonials';
import BookingCTA   from '@/components/landing/BookingCTA';
import NTSABanner   from '@/components/landing/NTSABanner';
import Blog            from '@/components/landing/Blog';
import BranchesSection from '@/components/landing/BranchesSection';
import Footer          from '@/components/landing/Footer';

import { C } from '@/components/landing/constants';
import ScrollSideNav from '@/components/landing/ScrollSideNav';

type SectionKey = 'hero' | 'services' | 'courses' | 'about' | 'gallery' | 'footer';

export default function LandingScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width: SCREEN_W } = useWindowDimensions();

  const scrollRef     = useRef<any>(null);
  const scrollY       = useRef(new Animated.Value(0)).current;
  const currentY      = useRef(0);                // live y tracked outside Animated
  const [activeSection, setActiveSection] = useState<SectionKey>('hero');
  const [contentH, setContentH] = useState(1);
  const [layoutH,  setLayoutH]  = useState(1);

  const offsets = useRef<Record<SectionKey, number>>({
    hero: 0, services: 0, courses: 0, about: 0, gallery: 0, footer: 0,
  }).current;

  const captureOffset = (key: SectionKey) => (e: any) => {
    offsets[key] = e.nativeEvent.layout.y;
  };

  const handleNavPress = useCallback((section: string) => {
    const y = offsets[section as SectionKey] ?? 0;
    scrollRef.current?.scrollTo({ y, animated: true });
    setActiveSection(section as SectionKey);
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (e: any) => {
        const y = e.nativeEvent.contentOffset.y;
        currentY.current = y;
        const keys = Object.keys(offsets) as SectionKey[];
        let current: SectionKey = 'hero';
        for (const key of keys) {
          if (y >= offsets[key] - 80) current = key;
        }
        setActiveSection(current);
      },
    }
  );

  // ── Step scroll: jumps to the next/prev section boundary ────────────────
  const handleStep = useCallback((direction: 'up' | 'down') => {
    const sectionYs = Object.values(offsets).sort((a, b) => a - b);
    const y = currentY.current;
    if (direction === 'up') {
      const prev = [...sectionYs].reverse().find(sy => sy < y - 40) ?? 0;
      scrollRef.current?.scrollTo({ y: prev, animated: true });
    } else {
      const next = sectionYs.find(sy => sy > y + 40);
      if (next !== undefined) scrollRef.current?.scrollTo({ y: next, animated: true });
    }
  }, []);

  // ── Scroll progress bar (width interpolates 0 → SCREEN_W) ────────────────
  const progressW = scrollY.interpolate({
    inputRange: [0, Math.max(contentH - layoutH, 1)],
    outputRange: [0, SCREEN_W],
    extrapolate: 'clamp',
  });


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>

      {/* ── Scroll progress bar — sits flush under the navbar ── */}
      <View style={{ height: 3, backgroundColor: isDark ? C.darkBorder : '#e5e7eb', zIndex: 49 }}>
        <Animated.View
          style={{
            height: 3,
            width: progressW,
            backgroundColor: C.yellow,
            borderRadius: 2,
          }}
        />
      </View>

      <Navbar scrollY={scrollY} onNavPress={handleNavPress} activeSection={activeSection} />

      <Animated.ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={(_w, h) => setContentH(h)}
        onLayout={e => setLayoutH(e.nativeEvent.layout.height)}
      >
        <View onLayout={captureOffset('hero')}>
          <Hero onScrollToCourses={() => handleNavPress('courses')} />
        </View>

        <View onLayout={captureOffset('services')}>
          <Services />
        </View>

        <View onLayout={captureOffset('about')}>
          <About />
        </View>

        <View onLayout={captureOffset('courses')}>
          <Courses />
        </View>

        <FAQ />
        <Instructors />
        <WhyChooseUs />

        <View onLayout={captureOffset('gallery')}>
          <Gallery />
        </View>

        <WorkProcess />
        <Testimonials />
        <BookingCTA />
        <NTSABanner />
        <Blog />

        <BranchesSection />

        <View onLayout={captureOffset('footer')}>
          <Footer />
        </View>
      </Animated.ScrollView>

      {/* ── Side scroll navigator ── */}
      <ScrollSideNav
        scrollY={scrollY}
        activeSection={activeSection}
        onNavPress={handleNavPress}
        onStep={handleStep}
      />

    </SafeAreaView>
  );
}
