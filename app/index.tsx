import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

import Navbar       from '@/components/landing/Navbar';
import Hero         from '@/components/landing/Hero';
import Testimonials from '@/components/landing/Testimonials';
import Footer       from '@/components/landing/Footer';

import StatStrip       from '@/components/landing/StatStrip';
import ServicesPreview from '@/components/landing/ServicesPreview';
import { PremiumCourseCards } from '@/components/landing/PremiumCourseCards';
import AboutPreview    from '@/components/landing/AboutPreview';
import BranchesPreview from '@/components/landing/BranchesPreview';
import FinalCTA        from '@/components/landing/FinalCTA';

import { C } from '@/components/landing/constants';
import { useEnrollModal } from '@/context/EnrollModalContext';
import { Reveal } from '@/components/animations/Reveal';

export default function LandingScreen() {
  const { colorScheme } = useColorScheme();
  const { open: openEnrollModal } = useEnrollModal();
  const isDark = colorScheme === 'dark';

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      'worklet';
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? C.dark : C.white }}>

      <Navbar scrollY={scrollY} />

      <Animated.ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Hero onScrollToCourses={() => router.push('/courses')} onEnrol={openEnrollModal} />
        <StatStrip />
        <Reveal><ServicesPreview /></Reveal>
        <PremiumCourseCards />
        <Reveal><AboutPreview /></Reveal>
        <Reveal><Testimonials /></Reveal>
        <Reveal><BranchesPreview /></Reveal>
        <Reveal><FinalCTA /></Reveal>
        <Footer />
      </Animated.ScrollView>

    </SafeAreaView>
  );
}
