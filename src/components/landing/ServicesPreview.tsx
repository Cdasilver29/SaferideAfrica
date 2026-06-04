import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Shield, Star, Users, BookOpen, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { C, F, IS_WEB, MAX_W } from './constants';
import { SectionIntro } from './SectionIntro';

const PREVIEW_SERVICES = [
  {
    iconName: 'Shield',
    name:     'Defensive Driving',
    desc:     'Hazard perception, emergency braking, and space management for every Kenyan road condition.',
    code:     'DEFENSIVE',
  },
  {
    iconName: 'Star',
    name:     'Executive Classes',
    desc:     'Premium one-on-one training with a personalised schedule, ideal for busy professionals.',
    code:     'EXECUTIVE',
  },
  {
    iconName: 'Users',
    name:     'Ladies Special',
    desc:     'A tailored programme for female learners with the option of a female instructor.',
    code:     'LADIES',
  },
  {
    iconName: 'BookOpen',
    name:     'Beginner Driver Education',
    desc:     'A complete from-scratch programme: vehicle controls, road signs, theory class, and road practice.',
    code:     'BEGINNER',
  },
];

const ICON_MAP: Record<string, React.ComponentType<any>> = { Shield, Star, Users, BookOpen };

function ServiceCard({ svc }: { svc: typeof PREVIEW_SERVICES[0] }) {
  const T    = useTheme();
  const Icon = ICON_MAP[svc.iconName] ?? Shield;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/services/${svc.code}` as any)}
      activeOpacity={0.85}
      style={{
        flex: 1,
        backgroundColor: T.card,
        borderRadius: 18,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: T.border,
        shadowColor: C.skyDeep,
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 2,
        minWidth: IS_WEB ? undefined : '47%',
      }}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: C.skyDeep,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
          shadowColor: C.skyDeep,
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Icon size={22} color={C.white} />
      </View>
      <View style={{ width: 24, height: 3, borderRadius: 2, backgroundColor: C.yellow, marginBottom: 10 }} />
      <Text
        style={{
          color: T.foreground,
          fontFamily: F.bold,
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 8,
          lineHeight: 20,
        }}
      >
        {svc.name}
      </Text>
      <Text
        style={{
          color: T.mutedForeground,
          fontFamily: F.regular,
          fontSize: 12,
          lineHeight: 18,
          textAlign: 'center',
          flex: 1,
        }}
      >
        {svc.desc}
      </Text>
    </TouchableOpacity>
  );
}

export default function ServicesPreview() {
  const T = useTheme();

  const rows: typeof PREVIEW_SERVICES[] = [];
  for (let i = 0; i < PREVIEW_SERVICES.length; i += 2) {
    rows.push(PREVIEW_SERVICES.slice(i, i + 2));
  }

  return (
    <View style={{ backgroundColor: T.background, paddingVertical: 64, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        <SectionIntro
          badge="What We Offer"
          title="Programmes Tailored to How You Drive"
        />

        {IS_WEB ? (
          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 36 }}>
            {PREVIEW_SERVICES.map(svc => (
              <ServiceCard key={svc.code} svc={svc} />
            ))}
          </View>
        ) : (
          <View style={{ marginBottom: 36 }}>
            {rows.map((pair, rowIdx) => (
              <View key={rowIdx} style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                {pair.map(svc => <ServiceCard key={svc.code} svc={svc} />)}
                {pair.length === 1 && <View style={{ flex: 1 }} />}
              </View>
            ))}
          </View>
        )}

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => router.push('/services')}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: C.red,
              paddingHorizontal: 28,
              paddingVertical: 12,
              borderRadius: 24,
              shadowColor: C.red,
              shadowOpacity: 0.32,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text style={{ color: C.white, fontFamily: F.semibold, fontSize: 14 }}>
              See all services
            </Text>
            <ArrowRight size={16} color={C.white} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}
