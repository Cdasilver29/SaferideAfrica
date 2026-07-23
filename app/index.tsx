import React, { useEffect, useRef } from 'react';
import { SafeAreaView, DeviceEventEmitter, Linking, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Sun, Moon } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

import { HeaderV3 } from '@/components/landing/HeaderV3';
import LanguageSwitcher from '@/components/landing/LanguageSwitcher';
import {
  WhatsAppIcon, FacebookIcon, TwitterXIcon, TikTokIcon, InstagramIcon, YouTubeIcon,
} from '@/components/SocialIcons';
import { COMPANY, SOCIALS } from '@/data/saferide';
import { useEnrollModal } from '@/context/EnrollModalContext';
import { brand } from '@/ui/tokens';
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
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { open: openEnrollModal } = useEnrollModal();

  // Social set mapped into HeaderV3's { label, url, Icon } shape. Icon glyphs
  // share the { size, color } prop contract HeaderV3 expects. Order mirrors
  // the old TopContactBar.
  const socials = [
    { label: 'WhatsApp',  url: SOCIALS.whatsapp,  Icon: WhatsAppIcon },
    { label: 'Facebook',  url: SOCIALS.facebook,  Icon: FacebookIcon },
    { label: 'X',         url: SOCIALS.twitter,   Icon: TwitterXIcon },
    { label: 'TikTok',    url: SOCIALS.tiktok,    Icon: TikTokIcon },
    { label: 'Instagram', url: SOCIALS.instagram, Icon: InstagramIcon },
    { label: 'YouTube',   url: SOCIALS.youtube,   Icon: YouTubeIcon },
  ];

  // Theme toggle rebuilt from the inline control the old Navbar carried.
  const themeToggle = (
    <Pressable
      onPress={toggleColorScheme}
      accessibilityRole="button"
      accessibilityLabel="Toggle theme"
      className="h-11 w-11 items-center justify-center rounded-pill"
    >
      {isDark
        ? <Sun size={18} color={brand.accent} />
        : <Moon size={18} color={brand.onPrimary} />}
    </Pressable>
  );

  const onCallNow = () => Linking.openURL(`tel:${COMPANY.primaryPhone.replace(/\s/g, '')}`);
  const onEnrol = () => openEnrollModal();

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

      <HeaderV3
        logoSource={require('../assets/images/saferide-logo.jpg')}
        socials={socials}
        languageSwitcher={<LanguageSwitcher />}
        themeToggle={themeToggle}
        onCallNow={onCallNow}
        onEnrol={onEnrol}
      />

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
