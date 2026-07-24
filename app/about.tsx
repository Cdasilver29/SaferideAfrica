import React from 'react';
import { ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { PageHero } from '@/components/landing/PageHero';
import { AboutOpener } from '@/components/landing/AboutSections';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

import { PageHead } from '@/components/PageHead';
import { useTheme } from '@/lib/theme';
import { Reveal } from '@/components/animations/Reveal';

export default function AboutPage() {
  const { t } = useTranslation();
  const Th = useTheme();
  return (
    // Inline flex/background: NativeWind's flex-1 class is not applied to
    // SafeAreaView on web, which collapsed the layout and stopped the page from
    // scrolling. Every other page sets this inline, matching them here.
    <SafeAreaView style={{ flex: 1, backgroundColor: Th.background }}>
      <PageHead
        title="About Safe Ride Africa: Our Story and Team"
        description="How Safe Ride Africa became one of Nairobi's most trusted NTSA-certified driving schools, our mission, values, and the team behind the wheel."
        path="/about"
      />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <PageHero overline={t('aboutPage.pageOverline')} title={t('aboutPage.pageTitle')} />
        <Reveal><AboutOpener /></Reveal>
        <Reveal><FinalCTA /></Reveal>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
