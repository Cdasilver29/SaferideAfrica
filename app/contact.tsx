import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Linking, Platform, useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { PageHero } from '@/components/landing/PageHero';
import Navbar          from '@/components/landing/Navbar';
import { BranchMap }   from '@/components/landing/BranchMap';
import Footer          from '@/components/landing/Footer';

import { COMPANY, BRANCHES } from '@/data/saferide';
import { C, F, IS_WEB, MAX_W } from '@/components/landing/constants';
import { useTheme } from '@/lib/theme';
import { PageHead, DRIVING_SCHOOL_JSONLD } from '@/components/PageHead';
import { Reveal } from '@/components/animations/Reveal';

const CONTACT_LABEL_KEY_MAP: Record<string, string> = {
  Address: 'address',
  Primary: 'primary',
  Secondary: 'secondary',
  Email: 'email',
  Website: 'website',
};

// ─── Contact info card ────────────────────────────────────────────────────────
function ContactInfo() {
  const T = useTheme();
  const { t } = useTranslation();
  return (
    <View
      style={{
        backgroundColor: T.card,
        borderRadius: 20,
        padding: IS_WEB ? 32 : 24,
        borderWidth: 1,
        borderColor: T.border,
        gap: 20,
      }}
    >
      <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 18, marginBottom: 4 }}>
        Safe Ride Africa
      </Text>

      {[
        {
          emoji: '📍',
          label: 'Address',
          value: COMPANY.address,
          onPress: undefined,
        },
        {
          emoji: '📞',
          label: 'Primary',
          value: COMPANY.primaryPhone,
          onPress: () => Linking.openURL(`tel:${COMPANY.primaryPhone.replace(/\s/g, '')}`),
        },
        {
          emoji: '📞',
          label: 'Secondary',
          value: COMPANY.secondaryPhone,
          onPress: () => Linking.openURL(`tel:${COMPANY.secondaryPhone.replace(/\s/g, '')}`),
        },
        {
          emoji: '✉️',
          label: 'Email',
          value: COMPANY.email,
          onPress: () => Linking.openURL(`mailto:${COMPANY.email}`),
        },
        {
          emoji: '🌐',
          label: 'Website',
          value: COMPANY.website,
          onPress: undefined,
        },
      ].map(({ emoji, label, value, onPress }) => (
        <TouchableOpacity
          key={label}
          onPress={onPress ?? undefined}
          activeOpacity={onPress ? 0.7 : 1}
          style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: T.isDark ? 'rgba(1, 165, 240, 0.12)' : 'rgba(1, 165, 240, 0.06)',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Text style={{ fontSize: 16 }}>{emoji}</Text>
          </View>
          <View style={{ flex: 1, paddingTop: 2 }}>
            <Text style={{ color: T.mutedForeground, fontFamily: F.medium, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 }}>
              {t(`contactPage.labels.${CONTACT_LABEL_KEY_MAP[label]}`)}
            </Text>
            <Text
              style={{
                color: onPress ? C.blue : T.foreground,
                fontFamily: F.regular,
                fontSize: 13,
                lineHeight: 19,
                textDecorationLine: onPress ? 'underline' : 'none',
              }}
            >
              {value}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Socials */}
      <View>
        <Text style={{ color: T.mutedForeground, fontFamily: F.medium, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>
          {t('contactPage.labels.social')}
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[
            { label: 'Facebook', url: COMPANY.socials.facebook, color: C.skyDeep, abbr: 'fb' },
            { label: 'Twitter',  url: COMPANY.socials.twitter,  color: C.skyDeep, abbr: 'tw' },
          ].map(s => (
            <TouchableOpacity
              key={s.label}
              onPress={() => Linking.openURL(s.url)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: s.color,
              }}
              activeOpacity={0.8}
            >
              <Text style={{ color: '#ffffff', fontFamily: F.semibold, fontSize: 12 }}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Contact form ─────────────────────────────────────────────────────────────
const BRANCHES_FOR_DROPDOWN = (BRANCHES as readonly typeof BRANCHES[0][]).map(b => b.name);

function ContactForm() {
  const T = useTheme();
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', branch: '', subject: '', message: '',
  });
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof form) => (val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    // TODO(backend): replace with real form submit
    setSent(true);
    setForm({ name: '', email: '', phone: '', branch: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  const fieldBg    = T.isDark ? 'rgba(255,255,255,0.05)' : C.white;
  const fieldBorder = T.border;
  const textColor  = T.foreground;

  const inputStyle = {
    backgroundColor: fieldBg,
    borderWidth: 1,
    borderColor: fieldBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    color: textColor,
    fontFamily: F.regular,
    fontSize: 13,
  };

  const labelStyle = {
    color: T.mutedForeground,
    fontFamily: F.medium,
    fontSize: 11,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    marginBottom: 6,
  };

  return (
    <View
      style={{
        backgroundColor: T.card,
        borderRadius: 20,
        padding: IS_WEB ? 32 : 24,
        borderWidth: 1,
        borderColor: T.border,
        gap: 14,
      }}
    >
      <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 18, marginBottom: 4 }}>
        {t('contactPage.form.title')}
      </Text>

      <View style={{ gap: 4 }}>
        <Text style={labelStyle}>{t('contactPage.form.name')}</Text>
        <TextInput
          value={form.name}
          onChangeText={set('name')}
          placeholder={t('contactPage.form.namePlaceholder')}
          placeholderTextColor={T.mutedForeground}
          style={inputStyle}
        />
      </View>

      <View style={IS_WEB ? { flexDirection: 'row', gap: 12 } : { gap: 4 }}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={labelStyle}>{t('contactPage.form.email')}</Text>
          <TextInput
            value={form.email}
            onChangeText={set('email')}
            placeholder={t('contactPage.form.emailPlaceholder')}
            placeholderTextColor={T.mutedForeground}
            keyboardType="email-address"
            autoCapitalize="none"
            style={inputStyle}
          />
        </View>
        <View style={IS_WEB ? { flex: 1, gap: 4 } : { gap: 4, marginTop: 14 }}>
          <Text style={labelStyle}>{t('contactPage.form.phone')}</Text>
          <TextInput
            value={form.phone}
            onChangeText={set('phone')}
            placeholder={t('contactPage.form.phonePlaceholder')}
            placeholderTextColor={T.mutedForeground}
            keyboardType="phone-pad"
            style={inputStyle}
          />
        </View>
      </View>

      <View style={{ gap: 4 }}>
        <Text style={labelStyle}>{t('contactPage.form.branch')}</Text>
        <TextInput
          value={form.branch}
          onChangeText={set('branch')}
          placeholder={t('contactPage.form.branchPlaceholder')}
          placeholderTextColor={T.mutedForeground}
          style={inputStyle}
        />
      </View>

      <View style={{ gap: 4 }}>
        <Text style={labelStyle}>{t('contactPage.form.subject')}</Text>
        <TextInput
          value={form.subject}
          onChangeText={set('subject')}
          placeholder={t('contactPage.form.subjectPlaceholder')}
          placeholderTextColor={T.mutedForeground}
          style={inputStyle}
        />
      </View>

      <View style={{ gap: 4 }}>
        <Text style={labelStyle}>{t('contactPage.form.message')}</Text>
        <TextInput
          value={form.message}
          onChangeText={set('message')}
          placeholder={t('contactPage.form.messagePlaceholder')}
          placeholderTextColor={T.mutedForeground}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={[inputStyle, { height: 100 }]}
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        activeOpacity={0.85}
        style={{
          backgroundColor: sent ? C.green : C.blue,
          paddingVertical: 14,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginTop: 4,
          shadowColor: C.blue,
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 14 }}>
          {sent ? t('contactPage.form.sent') : t('contactPage.form.send')}
        </Text>
        {!sent && <Text style={{ fontSize: 16 }}>📨</Text>}
      </TouchableOpacity>
    </View>
  );
}


// ─── Map mini preview ─────────────────────────────────────────────────────────
function MapPreview() {
  const T = useTheme();
  const { t } = useTranslation();
  const hq = BRANCHES[0];
  return (
    <View style={{ gap: 14 }}>
      <View style={{ height: IS_WEB ? 280 : 220, borderRadius: 16, overflow: 'hidden' }}>
        <BranchMap activeBranchId={hq.id} onMarkerPress={() => {}} />
      </View>
      <TouchableOpacity
        onPress={() => router.push('/branches')}
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          borderWidth: 1,
          borderColor: C.blue,
          paddingVertical: 11,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 13 }}>{t('contactPage.seeAllBranches', { count: BRANCHES.length })}</Text>
        <ArrowRight size={14} color={C.blue} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const T = useTheme();
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || (IS_WEB && winW < 768);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.background }}>
      <PageHead
        title="Contact Safe Ride Africa | Nairobi Driving School"
        description="Get in touch with Safe Ride Africa. Call, email, or WhatsApp us, or visit a branch across Nairobi to enrol in NTSA-certified driving classes."
        path="/contact"
      >
        <script type="application/ld+json">{DRIVING_SCHOOL_JSONLD}</script>
      </PageHead>
      <Navbar />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <PageHero overline={t('contactPage.pageOverline')} title={t('contactPage.pageTitle')} />

        {/* Two-column layout */}
        <View style={{ paddingVertical: isMobile ? 32 : 56, paddingHorizontal: isMobile ? 16 : 24 }}>
          <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>
            <View style={!isMobile ? { flexDirection: 'row', gap: 36, alignItems: 'flex-start' } : { gap: 24 }}>

              {/* Left — contact info */}
              <View style={!isMobile ? { flex: 1 } : {}}>
                <Reveal><ContactInfo /></Reveal>
              </View>

              {/* Right — form */}
              <View style={!isMobile ? { flex: 1.3 } : {}}>
                <Reveal delay={100}><ContactForm /></Reveal>
              </View>

            </View>

            {/* Map below the two-column block */}
            <View style={{ marginTop: 40 }}>
              <Reveal><MapPreview /></Reveal>
            </View>
          </View>
        </View>

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
