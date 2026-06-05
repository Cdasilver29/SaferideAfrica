import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { Info, ArrowRight, MessageCircle } from 'lucide-react-native';

import { PageHero } from '@/components/landing/PageHero';
import Navbar        from '@/components/landing/Navbar';
import Courses       from '@/components/landing/Courses';
import Footer        from '@/components/landing/Footer';
import CoursesPreview from '@/components/landing/CoursesPreview';

import { EXTRA_FEES } from '@/data/saferide';
import { C, F, IS_WEB, MAX_W } from '@/components/landing/constants';
import { useTheme } from '@/lib/theme';

const KSH = (n: number) => 'Ksh ' + n.toLocaleString('en-KE');

// ─── Extra fees note ─────────────────────────────────────────────────────────
function ExtraFeesNote() {
  const T = useTheme();
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || (IS_WEB && winW < 768);
  return (
    <View style={{ backgroundColor: T.background, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 8 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>
        <View
          style={{
            backgroundColor: T.isDark ? 'rgba(1, 165, 240, 0.08)' : 'rgba(1, 165, 240, 0.06)',
            borderRadius: 14,
            padding: 18,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? 12 : 20,
            borderWidth: 1,
            borderColor: T.isDark ? 'rgba(1, 165, 240, 0.25)' : 'rgba(1, 165, 240, 0.18)',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Info size={16} color={C.blue} />
            <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 13 }}>
              Additional Government Fees
            </Text>
          </View>
          <View style={isMobile ? { gap: 8 } : { flexDirection: 'row', gap: 24 }}>
            <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 13 }}>
              Interim Licence:{' '}
              <Text style={{ color: C.red, fontFamily: F.bold }}>{KSH(EXTRA_FEES.interimLicence)}</Text>
            </Text>
            <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 13 }}>
              Smart DL Application:{' '}
              <Text style={{ color: C.red, fontFamily: F.bold }}>{KSH(EXTRA_FEES.smartDL)}</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Contact CTA ─────────────────────────────────────────────────────────────
function ContactCTA() {
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
          Need help choosing? Talk to us
        </Text>
        <ArrowRight size={16} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function CoursesPage() {
  const T = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.background }}>
      <Navbar />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <PageHero overline="Driving Courses" title="Our Driving Classes" />
        <ExtraFeesNote />
        {/* Top 3 classes — same card layout as home page */}
        <CoursesPreview />
        {/* Full course catalogue: series tabs, class rows, payment notice, refresher */}
        <Courses />
        <ContactCTA />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
