import React from 'react';
import { ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { PageHero } from '@/components/landing/PageHero';
import FAQ from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

import { useTheme } from '@/lib/theme';
import { PageHead } from '@/components/PageHead';
import { Reveal } from '@/components/animations/Reveal';

export default function AboutFaqPage() {
  const { t } = useTranslation();
  const Th = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Th.background }}>
      <PageHead
        title="Frequently Asked Questions | Safe Ride Africa"
        description="Answers to the questions students ask us most about training, licensing, and enrolment."
        path="/about/faq"
      />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <PageHero overline={t('aboutPage.faq.overline')} title={t('aboutPage.faq.title')} />
        <Reveal><FAQ /></Reveal>
        <Reveal><FinalCTA /></Reveal>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
