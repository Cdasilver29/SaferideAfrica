import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { CheckCircle, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { PageHero } from '@/components/landing/PageHero';
import Navbar   from '@/components/landing/Navbar';
import Services from '@/components/landing/Services';
import Footer   from '@/components/landing/Footer';

import { C, F, IS_WEB, MAX_W } from '@/components/landing/constants';
import { useTheme } from '@/lib/theme';

// ─── Why our services stand out ───────────────────────────────────────────────
function StandOut() {
  const { t } = useTranslation();
  const T = useTheme();
  const standoutItems = t('servicesPage.standoutItems', { returnObjects: true }) as string[];
  return (
    <View
      style={{
        backgroundColor: T.isDark ? C.darkCard : C.white,
        paddingVertical: 48,
        paddingHorizontal: 24,
      }}
    >
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>
        <Text
          style={{
            color: T.foreground,
            fontFamily: F.bold,
            fontSize: IS_WEB ? 22 : 18,
            marginBottom: 20,
          }}
        >
          {t('servicesPage.standoutTitle')}
        </Text>
        <View style={{ gap: 14 }}>
          {standoutItems.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
              <CheckCircle size={18} color={C.blue} style={{ marginTop: 1 }} />
              <Text
                style={{
                  flex: 1,
                  color: T.mutedForeground,
                  fontFamily: F.regular,
                  fontSize: 14,
                  lineHeight: 22,
                }}
              >
                {item}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Courses CTA ──────────────────────────────────────────────────────────────
function CoursesCTA() {
  const { t } = useTranslation();
  const T = useTheme();
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
        onPress={() => router.push('/courses')}
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          borderWidth: 1.5,
          borderColor: C.blue,
          paddingHorizontal: 28,
          paddingVertical: 13,
          borderRadius: 26,
        }}
      >
        <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 14 }}>
          {t('servicesPage.coursesCta')}
        </Text>
        <ArrowRight size={16} color={C.blue} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const { t } = useTranslation();
  const T = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.background }}>
      <Navbar />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <PageHero overline={t('servicesPage.pageOverline')} title={t('servicesPage.pageTitle')} />
        {/* Full 10-service grid with "Read More" links to /services/[code] */}
        <Services />
        <StandOut />
        <CoursesCTA />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
