import React from 'react';
import { ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { PageHero } from '@/components/landing/PageHero';
import { CompanyStory } from '@/components/landing/AboutSections';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

import { useTheme } from '@/lib/theme';
import { PageHead } from '@/components/PageHead';
import { Reveal } from '@/components/animations/Reveal';

export default function AboutStoryPage() {
  const { t } = useTranslation();
  const Th = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Th.background }}>
      <PageHead
        title="Our Story | Safe Ride Africa"
        description="How Safe Ride Africa grew from a single Nairobi location into a trusted NTSA-certified driving school."
        path="/about/story"
      />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <PageHero overline={t('aboutPage.story.overline')} title={t('aboutPage.story.title')} />
        <Reveal><CompanyStory /></Reveal>
        <Reveal><FinalCTA /></Reveal>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
