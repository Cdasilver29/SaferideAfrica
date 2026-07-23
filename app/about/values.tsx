import React from 'react';
import { ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { PageHero } from '@/components/landing/PageHero';
import { VisionMissionValues } from '@/components/landing/AboutSections';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

import { useTheme } from '@/lib/theme';
import { PageHead } from '@/components/PageHead';
import { Reveal } from '@/components/animations/Reveal';

export default function AboutValuesPage() {
  const { t } = useTranslation();
  const Th = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Th.background }}>
      <PageHead
        title="Mission and Values | Safe Ride Africa"
        description="The vision, mission, and core values that guide every lesson at Safe Ride Africa."
        path="/about/values"
      />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <PageHero overline={t('aboutPage.values.overline')} title={t('aboutPage.values.title')} />
        <Reveal><VisionMissionValues /></Reveal>
        <Reveal><FinalCTA /></Reveal>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
