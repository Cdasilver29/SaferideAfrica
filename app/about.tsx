import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft, Target, Eye, Heart, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COMPANY, VISION, MISSION, CORE_VALUES, MANAGEMENT } from '../src/data/saferide';
import { C, F, IS_WEB, MAX_W } from '../src/components/landing/constants';
import { useTheme } from '../src/lib/theme';

export default function AboutPage() {
  const router = useRouter();
  const T = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: T.background }}
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center', paddingHorizontal: 24 } : { paddingHorizontal: 20 }}>

        {/* Back */}
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 24 }}
          activeOpacity={0.7}
          accessibilityLabel="Back to home"
        >
          <ArrowLeft size={22} color={C.blue} />
          <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 14 }}>Back</Text>
        </TouchableOpacity>

        {/* Hero banner */}
        <View style={{ backgroundColor: C.darkBg, borderRadius: 20, padding: 28, marginBottom: 24 }}>
          <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
            Our Story
          </Text>
          <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: IS_WEB ? 30 : 24, lineHeight: IS_WEB ? 40 : 32, marginBottom: 14 }}>
            {COMPANY.legalName}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.65)', fontFamily: F.regular, fontSize: 14, lineHeight: 23 }}>
            Founded in {COMPANY.registration.foundedYear} and incorporated on {COMPANY.registration.incorporatedDate},
            SafeRide Africa operates {10} branches across Nairobi. Our NTSA-registered curriculum
            and experienced instructors ensure every student is road-ready and exam-confident.
          </Text>
        </View>

        {/* Vision */}
        <View style={{ backgroundColor: T.card, borderRadius: 16, padding: 22, marginBottom: 16, borderWidth: 1, borderColor: T.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(14,165,233,0.1)', alignItems: 'center', justifyContent: 'center' }}>
              <Eye size={18} color={C.blue} />
            </View>
            <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 16 }}>Vision</Text>
          </View>
          <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 14, lineHeight: 23 }}>{VISION}</Text>
        </View>

        {/* Mission */}
        <View style={{ backgroundColor: T.card, borderRadius: 16, padding: 22, marginBottom: 16, borderWidth: 1, borderColor: T.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(251,191,36,0.12)', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={18} color={C.amber} />
            </View>
            <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 16 }}>Mission</Text>
          </View>
          <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 14, lineHeight: 23 }}>{MISSION}</Text>
        </View>

        {/* Core values */}
        <View style={{ backgroundColor: T.card, borderRadius: 16, padding: 22, marginBottom: 16, borderWidth: 1, borderColor: T.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(34,197,94,0.1)', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={18} color="#16a34a" />
            </View>
            <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 16 }}>Core Values</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {CORE_VALUES.map(v => (
              <View key={v} style={{ backgroundColor: T.muted, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: T.border }}>
                <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 13 }}>{v}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Management */}
        <View style={{ backgroundColor: T.card, borderRadius: 16, padding: 22, marginBottom: 16, borderWidth: 1, borderColor: T.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(139,92,246,0.1)', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} color="#7c3aed" />
            </View>
            <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 16 }}>Management</Text>
          </View>
          {MANAGEMENT.map(m => (
            <View key={m.name} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: T.border }}>
              <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 13 }}>{m.title}</Text>
              <Text style={{ color: T.foreground, fontFamily: F.semibold, fontSize: 14 }}>{m.name}</Text>
            </View>
          ))}
        </View>

        {/* Registration info */}
        <View style={{ backgroundColor: C.darkBg, borderRadius: 16, padding: 22, marginBottom: 8 }}>
          <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
            Registration
          </Text>
          {[
            { label: 'Business Name',    value: COMPANY.registration.bn },
            { label: 'PVT Number',       value: COMPANY.registration.pvt },
            { label: 'Founded',          value: String(COMPANY.registration.foundedYear) },
            { label: 'Incorporated',     value: COMPANY.registration.incorporatedDate },
          ].map(row => (
            <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' }}>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontFamily: F.regular, fontSize: 12 }}>{row.label}</Text>
              <Text style={{ color: '#ffffff', fontFamily: F.medium, fontSize: 12 }}>{row.value}</Text>
            </View>
          ))}
        </View>

      </View>
    </ScrollView>
  );
}
