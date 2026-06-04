import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Linking } from 'react-native';
import { router } from 'expo-router';
import { MapPin, Phone, Clock, Navigation, ArrowRight, MessageCircle } from 'lucide-react-native';

import { PageHero } from '@/components/landing/PageHero';
import Navbar     from '@/components/landing/Navbar';
import { BranchMap } from '@/components/landing/BranchMap';
import Footer     from '@/components/landing/Footer';

import { BRANCHES, Branch } from '@/data/saferide';
import { C, F, IS_WEB, MAX_W } from '@/components/landing/constants';
import { useTheme } from '@/lib/theme';

// ─── Branch card ──────────────────────────────────────────────────────────────
function BranchCard({
  branch,
  isSelected,
  onSelect,
}: {
  branch: Branch;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const T = useTheme();
  const isHQ = branch.isHQ;

  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.85}
      style={{
        backgroundColor: isSelected
          ? (T.isDark ? 'rgba(1, 165, 240, 0.12)' : 'rgba(1, 165, 240, 0.06)')
          : T.card,
        borderRadius: 16,
        padding: 18,
        marginBottom: 12,
        borderWidth: isSelected ? 1.5 : isHQ ? 2 : 1,
        borderColor: isSelected ? C.blue : isHQ ? C.yellow : T.border,
        shadowColor: isSelected ? C.blue : '#000',
        shadowOpacity: isSelected ? 0.12 : 0.04,
        shadowRadius: 8,
        elevation: isSelected ? 4 : 1,
      }}
    >
      {/* Name + HQ badge */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Text
          style={{
            flex: 1,
            color: isSelected ? C.blue : T.foreground,
            fontFamily: F.bold,
            fontSize: 15,
          }}
        >
          {branch.name}
        </Text>
        {isHQ && (
          <View
            style={{
              backgroundColor: C.yellow,
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Text
              style={{
                color: C.dark,
                fontFamily: F.bold,
                fontSize: 9,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
              }}
            >
              HQ
            </Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={{ gap: 5, marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
          <MapPin size={13} color={C.blue} style={{ marginTop: 1 }} />
          <Text style={{ flex: 1, color: T.mutedForeground, fontFamily: F.regular, fontSize: 12, lineHeight: 18 }}>
            {branch.address}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Phone size={13} color={C.blue} />
          <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 12 }}>{branch.phone}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Clock size={13} color={C.blue} />
          <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 12 }}>{branch.hours}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(branch.mapsQuery)}`
            )
          }
          style={{
            flex: 1,
            backgroundColor: C.blue,
            paddingVertical: 9,
            borderRadius: 9,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
          }}
          activeOpacity={0.8}
        >
          <Navigation size={12} color="#ffffff" />
          <Text style={{ color: '#ffffff', fontFamily: F.semibold, fontSize: 12 }}>Get Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:${branch.phone.replace(/\s/g, '')}`)}
          style={{
            flex: 1,
            paddingVertical: 9,
            borderRadius: 9,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            borderWidth: 1,
            borderColor: C.blue,
          }}
          activeOpacity={0.8}
        >
          <Phone size={12} color={C.blue} />
          <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 12 }}>Call</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ─── Map + branch list section ────────────────────────────────────────────────
function BranchDirectory() {
  const T = useTheme();
  const [selectedId, setSelectedId] = useState<string>(BRANCHES[0].id);

  return (
    <View style={{ backgroundColor: T.background, paddingVertical: 56, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        <View style={IS_WEB ? { flexDirection: 'row', gap: 28, alignItems: 'flex-start' } : {}}>

          {/* Map */}
          <View style={IS_WEB ? { flex: 3, position: 'sticky' as any, top: 80 } : { marginBottom: 24 }}>
            <BranchMap
              activeBranchId={selectedId}
              onMarkerPress={(id) => setSelectedId(id)}
            />
          </View>

          {/* Branch cards — all 10 */}
          <View style={IS_WEB ? { flex: 2, maxHeight: 560 } : {}}>
            <ScrollView
              style={IS_WEB ? { flex: 1 } : undefined}
              contentContainerStyle={{ paddingBottom: 8 }}
              showsVerticalScrollIndicator={IS_WEB}
              nestedScrollEnabled
            >
              {(BRANCHES as readonly Branch[]).map(branch => (
                <BranchCard
                  key={branch.id}
                  branch={branch}
                  isSelected={branch.id === selectedId}
                  onSelect={() => setSelectedId(branch.id)}
                />
              ))}
            </ScrollView>
          </View>

        </View>
      </View>
    </View>
  );
}

// ─── HQ callout banner ────────────────────────────────────────────────────────
function HQCallout() {
  const T = useTheme();
  const hq = BRANCHES.find(b => b.isHQ)!;
  return (
    <View style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>
        <View
          style={{
            backgroundColor: T.isDark ? 'rgba(255,216,0,0.08)' : 'rgba(255,216,0,0.06)',
            borderRadius: 16,
            padding: 20,
            borderWidth: 2,
            borderColor: C.yellow,
            flexDirection: IS_WEB ? 'row' : 'column',
            alignItems: IS_WEB ? 'center' : 'flex-start',
            gap: IS_WEB ? 20 : 10,
          }}
        >
          <View
            style={{
              backgroundColor: C.yellow,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 4,
              alignSelf: 'flex-start',
            }}
          >
            <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
              Headquarters
            </Text>
          </View>
          <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 15, flex: IS_WEB ? 1 : undefined }}>
            {hq.name} — {hq.address}
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hq.mapsQuery)}`
              )
            }
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: C.yellow,
              paddingHorizontal: 16,
              paddingVertical: 9,
              borderRadius: 20,
            }}
            activeOpacity={0.85}
          >
            <Navigation size={13} color={C.dark} />
            <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 12 }}>Directions to HQ</Text>
          </TouchableOpacity>
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
        backgroundColor: T.isDark ? C.darkCard : C.white,
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
          gap: 8,
          borderWidth: 1.5,
          borderColor: C.blue,
          paddingHorizontal: 28,
          paddingVertical: 13,
          borderRadius: 26,
        }}
      >
        <MessageCircle size={16} color={C.blue} />
        <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 14 }}>
          Have a question? Contact us
        </Text>
        <ArrowRight size={15} color={C.blue} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function BranchesPage() {
  const T = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.background }}>
      <Navbar />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <PageHero overline="Our Locations" title="Our 10 Branches" />
        <BranchDirectory />
        <HQCallout />
        <ContactCTA />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
