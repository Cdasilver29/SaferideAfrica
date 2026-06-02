import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../src/context/AuthContext';
import { CLASSES } from '../../../src/data/saferide';
import { C, F, IS_WEB, MAX_W } from '../../../src/components/landing/constants';
import { useTheme } from '../../../src/lib/theme';

const KSH = (n: number) => (n === 0 ? '—' : 'Ksh ' + n.toLocaleString('en-KE'));

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
  const { user } = useAuth();

  const cls = CLASSES.find(c => c.code === code);

  if (!cls) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Text style={{ color: C.heading, fontFamily: F.bold, fontSize: 16 }}>Class not found.</Text>
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

        {/* Header */}
        <View style={{ backgroundColor: C.dark, borderRadius: 20, padding: 28, marginBottom: 24 }}>
          <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
            Class Details
          </Text>
          <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: IS_WEB ? 26 : 22, marginBottom: 6 }}>
            {cls.name}
          </Text>
          {cls.lessons !== null && (
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontFamily: F.regular, fontSize: 14 }}>
              {cls.lessons} practical lessons included
            </Text>
          )}
        </View>

        {/* Fee breakdown */}
        <View style={{ backgroundColor: T.card, borderRadius: 16, padding: 22, borderWidth: 1, borderColor: T.border, marginBottom: 16 }}>
          <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 15, marginBottom: 16 }}>Fee Breakdown</Text>
          {[
            { label: 'School Fees', value: cls.fees },
            { label: 'PDL',         value: cls.pdl  },
            { label: 'Exams',       value: cls.exams },
            { label: 'Defensive',   value: cls.defensive },
          ].map(row => (
            <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: T.border }}>
              <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 14 }}>{row.label}</Text>
              <Text style={{ color: T.foreground, fontFamily: F.medium, fontSize: 14 }}>{KSH(row.value)}</Text>
            </View>
          ))}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, marginTop: 4 }}>
            <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 15 }}>Total</Text>
            <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 22 }}>{KSH(cls.total)}</Text>
          </View>
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
          onPress={() => router.push(user ? `/classes/${cls.code}/enrol` : '/login')}
          style={{ backgroundColor: C.yellow, paddingVertical: 16, borderRadius: 14, alignItems: 'center' }}
          activeOpacity={0.85}
        >
          <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 15 }}>
            {user ? 'Enrol Now' : 'Sign In to Enrol'}
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
