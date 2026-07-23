import React, { useEffect, useRef } from 'react';
import { SafeAreaView, DeviceEventEmitter } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

import Hero         from '@/components/landing/Hero';
import Testimonials from '@/components/landing/Testimonials';
import { FooterV2 } from '@/components/landing/FooterV2';

import ServicesPreview from '@/components/landing/ServicesPreview';
import { PremiumCourseCards } from '@/components/landing/PremiumCourseCards';
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

export default function LandingScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      'worklet';
      scrollY.value = event.contentOffset.y;
    },
  });

  const scrollRef = useRef<any>(null);

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
        description="Nairobi's trusted NTSA-certified driving school. Branches across the city, 98% first-try pass rate. Enrol online today."
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
        <Hero onScrollToCourses={() => router.push('/courses')} />
        <Reveal><ServicesPreview /></Reveal>
        <PremiumCourseCards />
        <Reveal><WhyValuesSnippet /></Reveal>
        <Reveal><AboutPreview /></Reveal>
        <Reveal><HomeFaq /></Reveal>
        <Reveal><EnrolSteps /></Reveal>
        <Reveal><Testimonials /></Reveal>
        <Reveal><BranchesPreview /></Reveal>
        <Reveal><GalleryPreview /></Reveal>
        <Reveal><FinalCTA /></Reveal>
        <FooterV2 />
      </Animated.ScrollView>

    </SafeAreaView>
  );
}
