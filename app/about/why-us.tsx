import React from 'react';
import { ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { PageHero } from '@/components/landing/PageHero';
import WhyChooseUs from '@/components/landing/WhyChooseUs';
import { Achievements, TrustBlock } from '@/components/landing/AboutSections';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

import { useTheme } from '@/lib/theme';
import { PageHead } from '@/components/PageHead';
import { Reveal } from '@/components/animations/Reveal';
import { APP_SCROLLBAR } from '@/lib/scrollbar';

export default function AboutWhyUsPage() {
  const { t } = useTranslation();
  const Th = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Th.background }}>
      <PageHead
        title="Why Choose Us | Safe Ride Africa"
        description="What sets our training, instructors, and results apart at Safe Ride Africa."
        path="/about/why-us"
      />
      <ScrollView className={APP_SCROLLBAR} style={{ flex: 1 }}>
        <PageHero overline={t('aboutPage.whyUs.overline')} title={t('aboutPage.whyUs.title')} />
        <Reveal><WhyChooseUs /></Reveal>
        <Reveal><Achievements /></Reveal>
        <Reveal><TrustBlock /></Reveal>
        <Reveal><FinalCTA /></Reveal>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
