import React from 'react';
import { ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { PageHero } from '@/components/landing/PageHero';
import WorkProcess from '@/components/landing/WorkProcess';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

import { useTheme } from '@/lib/theme';
import { PageHead } from '@/components/PageHead';
import { Reveal } from '@/components/animations/Reveal';

export default function AboutHowWeWorkPage() {
  const { t } = useTranslation();
  const Th = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Th.background }}>
      <PageHead
        title="How We Work | Safe Ride Africa"
        description="The step-by-step journey from your first enquiry to a licence in your hand."
        path="/about/how-we-work"
      />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <PageHero overline={t('aboutPage.howWeWork.overline')} title={t('aboutPage.howWeWork.title')} />
        <Reveal><WorkProcess /></Reveal>
        <Reveal><FinalCTA /></Reveal>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
