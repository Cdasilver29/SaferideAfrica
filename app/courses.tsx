import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowRight, MessageCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { PageHero } from '@/components/landing/PageHero';
import Navbar        from '@/components/landing/Navbar';
import Courses       from '@/components/landing/Courses';
import Footer        from '@/components/landing/Footer';
import CoursesPreview from '@/components/landing/CoursesPreview';

import { C, F, IS_WEB } from '@/components/landing/constants';
import { useTheme } from '@/lib/theme';
import { PageHead } from '@/components/PageHead';

// ─── Contact CTA ─────────────────────────────────────────────────────────────
function ContactCTA() {
  const T = useTheme();
  const { t } = useTranslation();
  return (
    <View
      style={{
        backgroundColor: T.background,
        paddingHorizontal: 24,
        paddingVertical: 40,
        alignItems: 'center',
      }}
    >
      <TouchableOpacity
        onPress={() => router.push('/contact')}
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: C.blue,
          paddingHorizontal: 28,
          paddingVertical: 14,
          borderRadius: 26,
          shadowColor: C.blue,
          shadowOpacity: 0.35,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <MessageCircle size={17} color="#ffffff" />
        <Text style={{ color: '#ffffff', fontFamily: F.semibold, fontSize: 14 }}>
          {t('coursesPage.contactCta')}
        </Text>
        <ArrowRight size={16} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function CoursesPage() {
  const T = useTheme();
  const { t } = useTranslation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.background }}>
      <PageHead
        title="Driving Classes and Courses in Nairobi | Safe Ride Africa"
        description="Motorcycle, light vehicle, heavy commercial, PSV, and executive driving courses. NTSA-aligned training with a 98% first-try pass rate."
        path="/courses"
      />
      <Navbar />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <PageHero overline={t('courses.overline')} title={t('coursesPage.pageTitle')} />
        {/* Top 3 classes — same card layout as home page */}
        <CoursesPreview />
        {/* Full course catalogue: series tabs, class rows, refresher */}
        <Courses />
        <ContactCTA />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
