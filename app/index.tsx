import React, { useEffect, useRef } from 'react';
import { SafeAreaView, ScrollView, DeviceEventEmitter } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';

import Hero         from '@/components/landing/Hero';
import StatStrip    from '@/components/landing/StatStrip';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';

import { PremiumCourseCards } from '@/components/landing/PremiumCourseCards';
import DriverTypeSection from '@/components/landing/DriverTypeSection';
import WhyValuesSnippet from '@/components/landing/WhyValuesSnippet';
import EnrolSteps      from '@/components/landing/EnrolSteps';
import BranchesPreview from '@/components/landing/BranchesPreview';
import FinalCTA        from '@/components/landing/FinalCTA';

import { C } from '@/components/landing/constants';
import { Reveal } from '@/components/animations/Reveal';
import { PageHead, DRIVING_SCHOOL_JSONLD } from '@/components/PageHead';
import { APP_SCROLLBAR } from '@/lib/scrollbar';

export default function LandingScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // SocialFloat's up-chevron emits this rather than reaching for the scroller,
  // since the scroll container lives here.
  const scrollRef = useRef<ScrollView>(null);

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

      <ScrollView ref={scrollRef} className={APP_SCROLLBAR} style={{ flex: 1 }}>
        <Hero onScrollToCourses={() => router.push('/courses')} />
        <StatStrip />
        <Reveal variant="rise"><DriverTypeSection /></Reveal>
        <PremiumCourseCards />
        <Reveal variant="slide-left"><WhyValuesSnippet /></Reveal>
        <Reveal variant="slide-right"><BranchesPreview /></Reveal>
        <Reveal variant="flip"><EnrolSteps /></Reveal>
        <Reveal variant="slide-left"><Testimonials /></Reveal>
        <Reveal variant="light-speed"><FinalCTA /></Reveal>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
