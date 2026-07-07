import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CLASSES, CLASS_SERIES } from '../../../src/data/saferide';
import { CLASS_DETAILS } from '../../../src/data/classDetails';
import { C, F, IS_WEB } from '../../../src/components/landing/constants';
import { useTheme } from '../../../src/lib/theme';
import { useEnrollModal } from '../../../src/context/EnrollModalContext';
import { PageHead } from '../../../src/components/PageHead';
import { Reveal } from '../../../src/components/animations/Reveal';

// Pre-render one static HTML page per class so deep links resolve without a
// client fallback.
export function generateStaticParams(): { code: string }[] {
  return CLASSES.map((c) => ({ code: c.code }));
}

// Palette-derived alpha tints so the page carries no raw colour values
// (same approach as Hero).
const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};
const SKY_TINT = rgba(C.skyDeep, 0.12);
const WHITE_80 = rgba(C.white, 0.8);

// Card-styled page section with a bold title.
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const T = useTheme();
  return (
    <View style={{ backgroundColor: T.card, borderRadius: 16, padding: 22, borderWidth: 1, borderColor: T.border, marginBottom: 20 }}>
      <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 15, marginBottom: 14 }}>{title}</Text>
      {children}
    </View>
  );
}

// Bullet row with a small sky dot.
function BulletRow({ text }: { text: string }) {
  const T = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.skyDeep, marginTop: 8, flexShrink: 0 }} />
      <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 14, lineHeight: 22, flex: 1 }}>{text}</Text>
    </View>
  );
}

// Checklist row with the yellow check chip (matches the old included list).
function CheckRow({ text }: { text: string }) {
  const T = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
        <CheckCircle size={12} color={C.dark} />
      </View>
      <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 14, lineHeight: 22, flex: 1 }}>{text}</Text>
    </View>
  );
}

export default function ClassDetailPage() {
  const router = useRouter();
  const T = useTheme();
  const { t } = useTranslation();
  const { code } = useLocalSearchParams<{ code: string }>();
  const { open: openEnroll } = useEnrollModal();

  const cls = CLASSES.find(c => c.code === code);
  let seriesImage = cls ? CLASS_SERIES.find(s => s.code === cls.series)?.image : undefined;
  const detail = cls ? CLASS_DETAILS[cls.code] : undefined;

  if (IS_WEB && cls) {
    if (cls.code === 'B-AUTO') seriesImage = { uri: '/gallery/DSC_2225.webp' };
    if (cls.code === 'B-LIGHT') seriesImage = { uri: '/gallery/DSC_7014.webp' };
    if (cls.code === 'A3-TUKTUK') seriesImage = { uri: '/gallery/Tuktuk.webp' };
    if (cls.code === 'C-LIGHT') seriesImage = { uri: '/gallery/commercial-truck.webp' };
  }

  if (!cls) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 16 }}>{t('classPage.notFound')}</Text>
        <TouchableOpacity onPress={() => router.replace('/classes')} style={{ marginTop: 20, minHeight: 44, justifyContent: 'center' }}>
          <Text style={{ color: C.blue, fontFamily: F.semibold }}>{t('classPage.browseClasses')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: T.background }}
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      <PageHead
        title={`${cls.name} | Safe Ride Africa`}
        description={`Enrol in ${cls.name} at Safe Ride Africa. NTSA-aligned theory, practical driving sessions, and full test preparation.`}
        path={`/classes/${cls.code}`}
      />
      <View style={IS_WEB ? { maxWidth: 720, width: '100%', alignSelf: 'center', paddingHorizontal: 24 } : { paddingHorizontal: 20 }}>

        {/* Back */}
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/classes')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 24, minHeight: 44 }}
          activeOpacity={0.7}
          accessibilityLabel={t('classPage.back')}
        >
          <ArrowLeft size={22} color={C.blue} />
          <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 14 }}>{t('classPage.back')}</Text>
        </TouchableOpacity>

        {/* Series image. A fixed 16:9 container with the Image filling it via
            explicit inline width/height: react-native-web injects the source's
            intrinsic pixel height onto the Image wrapper, and an explicit height
            overrides aspect-ratio, so the image stretched full natural height.
            Pinning it inside a sized container keeps it at 16:9, never taller. */}
        {seriesImage && (
          <View style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: 20, overflow: 'hidden', marginBottom: 24 }}>
            <Image
              source={seriesImage}
              accessibilityLabel={`${cls.name} vehicle`}
              resizeMode="cover"
              style={{ width: '100%', height: '100%' }}
            />
          </View>
        )}

        {/* Header with the overview */}
        <View style={{ backgroundColor: C.dark, borderRadius: 20, padding: 28, marginBottom: 24 }}>
          <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
            {t('classPage.overline')}
          </Text>
          <Text style={{ color: C.white, fontFamily: F.bold, fontSize: IS_WEB ? 26 : 22 }}>
            {cls.name}
          </Text>
          {detail && (
            <Text style={{ color: WHITE_80, fontFamily: F.regular, fontSize: 14, lineHeight: 23, marginTop: 12 }}>
              {detail.overview}
            </Text>
          )}
        </View>

        {detail && (
          <>
            {/* Who it's for */}
            <Reveal>
            <Section title={t('classPage.whoFor')}>
              {detail.whoFor.map(item => <BulletRow key={item} text={item} />)}
            </Section>
            </Reveal>

            {/* What you will learn */}
            <Reveal>
            <Section title={t('classPage.learn')}>
              {detail.learn.map(item => <CheckRow key={item} text={item} />)}
            </Section>
            </Reveal>

            {/* Lesson structure */}
            <Reveal>
            <Section title={t('classPage.structure')}>
              {detail.structure.map((stage, i) => (
                <View key={stage.title} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: i === detail.structure.length - 1 ? 0 : 16 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: SKY_TINT, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Text style={{ color: C.skyDeep, fontFamily: F.bold, fontSize: 13 }}>{i + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: T.foreground, fontFamily: F.semibold, fontSize: 14, marginBottom: 3 }}>{stage.title}</Text>
                    <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 13, lineHeight: 20 }}>{stage.desc}</Text>
                  </View>
                </View>
              ))}
            </Section>
            </Reveal>

            {/* NTSA requirements */}
            <Reveal>
            <Section title={t('classPage.requirements')}>
              {detail.requirements.map(item => <BulletRow key={item} text={item} />)}
              <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 12, lineHeight: 18, marginTop: 8, fontStyle: 'italic' }}>
                {t('classPage.requirementsNote')}
              </Text>
            </Section>
            </Reveal>

            {/* FAQ */}
            <Reveal>
            <Section title={t('classPage.faq')}>
              {detail.faq.map((item, i) => (
                <View key={item.q} style={{ marginBottom: i === detail.faq.length - 1 ? 0 : 16 }}>
                  <Text style={{ color: T.foreground, fontFamily: F.semibold, fontSize: 14, marginBottom: 4 }}>{item.q}</Text>
                  <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 13, lineHeight: 21 }}>{item.a}</Text>
                </View>
              ))}
            </Section>
            </Reveal>
          </>
        )}

        {/* Enrol CTA */}
        <TouchableOpacity
          onPress={() => openEnroll(cls.code)}
          style={{ backgroundColor: C.yellow, paddingVertical: 16, borderRadius: 14, alignItems: 'center', minHeight: 44 }}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={t('common.enrolNow')}
        >
          <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 15 }}>{t('common.enrolNow')}</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
