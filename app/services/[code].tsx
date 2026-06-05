import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SERVICES } from '../../src/data/saferide';
import { C, F, IS_WEB, MAX_W } from '../../src/components/landing/constants';
import { useTheme } from '../../src/lib/theme';

export default function ServiceDetailPage() {
  const router = useRouter();
  const T = useTheme();
  const { code } = useLocalSearchParams<{ code: string }>();

  const svc = SERVICES.find(s => s.code === code);

  if (!svc) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 16 }}>Service not found.</Text>
        <TouchableOpacity onPress={() => router.replace('/')} style={{ marginTop: 20 }}>
          <Text style={{ color: C.blue, fontFamily: F.semibold }}>Go Home</Text>
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
      <View style={IS_WEB ? { maxWidth: 720, width: '100%', alignSelf: 'center', paddingHorizontal: 24 } : { paddingHorizontal: 20 }}>

        {/* Back */}
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 24 }}
          activeOpacity={0.7}
          accessibilityLabel="Back"
        >
          <ArrowLeft size={22} color={C.blue} />
          <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 14 }}>Back</Text>
        </TouchableOpacity>

        {/* Header card */}
        <View style={{ backgroundColor: C.blue, borderRadius: 20, padding: 28, marginBottom: 24 }}>
          <Text style={{ color: 'rgba(255,255,255,0.65)', fontFamily: F.bold, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
            Our Services
          </Text>
          <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: IS_WEB ? 28 : 22, lineHeight: IS_WEB ? 36 : 30, marginBottom: 12 }}>
            {svc.name}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontFamily: F.regular, fontSize: 14, lineHeight: 22 }}>
            {svc.shortDesc}
          </Text>
        </View>

        {/* Full description */}
        <View style={{ backgroundColor: T.card, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: T.border, marginBottom: 20 }}>
          <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
            About This Service
          </Text>
          <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 14, lineHeight: 24 }}>
            {svc.fullDesc}
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={() => router.push('/classes')}
          style={{ backgroundColor: C.yellow, paddingVertical: 16, borderRadius: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
          activeOpacity={0.85}
        >
          <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 15 }}>Browse Classes</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
