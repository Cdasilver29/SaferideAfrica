import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CLASSES, CLASS_SERIES } from '../../../src/data/saferide';
import { C, F, IS_WEB, MAX_W } from '../../../src/components/landing/constants';
import { useTheme } from '../../../src/lib/theme';
import { useEnrollModal } from '../../../src/context/EnrollModalContext';
import { PageHead } from '../../../src/components/PageHead';

// Pre-render one static HTML page per class so deep links resolve without a
// client fallback.
export function generateStaticParams(): { code: string }[] {
  return CLASSES.map((c) => ({ code: c.code }));
}

const INCLUDED = [
  'Theoretical road safety lessons',
  'Practical driving sessions with certified instructors',
  'NTSA driving test preparation',
  'Defensive driving techniques',
  'Road sign recognition',
];

export default function ClassDetailPage() {
  const router = useRouter();
  const T = useTheme();
  const { code } = useLocalSearchParams<{ code: string }>();
  const { open: openEnroll } = useEnrollModal();

  const cls = CLASSES.find(c => c.code === code);
  const seriesImage = cls ? CLASS_SERIES.find(s => s.code === cls.series)?.image : undefined;

  if (!cls) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 16 }}>Class not found.</Text>
        <TouchableOpacity onPress={() => router.replace('/classes')} style={{ marginTop: 20 }}>
          <Text style={{ color: C.blue, fontFamily: F.semibold }}>Browse Classes</Text>
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
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 24 }}
          activeOpacity={0.7}
          accessibilityLabel="Back"
        >
          <ArrowLeft size={22} color={C.blue} />
          <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 14 }}>Back</Text>
        </TouchableOpacity>

        {/* Series image */}
        {seriesImage && (
          <Image
            source={seriesImage}
            accessibilityLabel={`${cls.name} vehicle`}
            resizeMode="cover"
            style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: 20, marginBottom: 24 }}
          />
        )}

        {/* Header */}
        <View style={{ backgroundColor: C.dark, borderRadius: 20, padding: 28, marginBottom: 24 }}>
          <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
            Class Details
          </Text>
          <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: IS_WEB ? 26 : 22 }}>
            {cls.name}
          </Text>
        </View>

        {/* What's included */}
        <View style={{ backgroundColor: T.card, borderRadius: 16, padding: 22, borderWidth: 1, borderColor: T.border, marginBottom: 24 }}>
          <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 15, marginBottom: 16 }}>What's Included</Text>
          {INCLUDED.map(item => (
            <View key={item} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                <CheckCircle size={12} color={C.dark} />
              </View>
              <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 14, lineHeight: 22, flex: 1 }}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Enrol CTA */}
        <TouchableOpacity
          onPress={() => openEnroll(cls.code)}
          style={{ backgroundColor: C.yellow, paddingVertical: 16, borderRadius: 14, alignItems: 'center' }}
          activeOpacity={0.85}
        >
          <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 15 }}>Enrol Now</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
