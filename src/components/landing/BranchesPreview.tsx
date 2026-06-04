import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { MapPin, Phone, ArrowRight } from 'lucide-react-native';
import { BranchMap } from './BranchMap';
import { BRANCHES, Branch } from '@/data/saferide';
import { useTheme } from '@/lib/theme';
import { C, F, IS_WEB, MAX_W } from './constants';
import { SectionIntro } from './SectionIntro';

const TOP_3 = (BRANCHES as readonly Branch[]).slice(0, 3);

export default function BranchesPreview() {
  const T = useTheme();
  const [selectedId, setSelectedId] = useState<string>(BRANCHES[0].id);

  return (
    <View
      style={{
        backgroundColor: T.background,
        paddingVertical: 64,
        paddingHorizontal: 24,
      }}
    >
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        <SectionIntro
          badge="Find Us"
          title="10 Branches Across Nairobi"
          description="From Donholm HQ to Karen, Westlands, Thika Road and beyond — there's always a SafeRide branch near you."
        />

        {/* Map + branch list */}
        <View style={IS_WEB ? { flexDirection: 'row', gap: 28, alignItems: 'flex-start', marginBottom: 36 } : { marginBottom: 36 }}>

          {/* Map */}
          <View style={IS_WEB ? { flex: 3 } : { marginBottom: 24 }}>
            <BranchMap
              activeBranchId={selectedId}
              onMarkerPress={(id) => setSelectedId(id)}
            />
          </View>

          {/* Top 3 branch cards */}
          <View style={IS_WEB ? { flex: 2, gap: 12 } : { gap: 12 }}>
            {TOP_3.map(branch => (
              <TouchableOpacity
                key={branch.id}
                onPress={() => setSelectedId(branch.id)}
                activeOpacity={0.85}
                style={{
                  backgroundColor: branch.id === selectedId
                    ? (T.isDark ? 'rgba(1,165,240,0.12)' : 'rgba(88,204,247,0.12)')
                    : T.card,
                  borderRadius: 14,
                  padding: 16,
                  borderWidth: branch.id === selectedId ? 1.5 : 1,
                  borderColor: branch.id === selectedId ? C.skyDeep : T.border,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Text style={{ color: branch.id === selectedId ? C.skyDeep : T.foreground, fontFamily: F.bold, fontSize: 14, flex: 1 }}>
                    {branch.name}
                  </Text>
                  {branch.isHQ && (
                    <View style={{ backgroundColor: C.yellow, borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 }}>
                      <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.8 }}>HQ</Text>
                    </View>
                  )}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <MapPin size={12} color={C.skyDeep} />
                  <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 12 }}>{branch.address}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Phone size={12} color={C.skyDeep} />
                  <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 12 }}>{branch.phone}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CTA */}
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => router.push('/branches')}
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
              Find all 10 branches
            </Text>
            <ArrowRight size={16} color={C.white} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}
