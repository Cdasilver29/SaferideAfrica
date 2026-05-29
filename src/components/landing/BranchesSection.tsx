import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useColorScheme } from 'nativewind';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react-native';
import { BranchMap } from './BranchMap';
import { C, F, IS_WEB, MAX_W } from './constants';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  mapsQuery: string;
}

const BRANCHES: Branch[] = [
  {
    id: 'nairobi',
    name: 'Nairobi HQ',
    address: 'PO Box 25716-00603, Nairobi CBD, Kenya',
    phone: '+254 792 471 511',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa Nairobi',
  },
  {
    id: 'kenol',
    name: 'Kenol Branch',
    address: "Kenol Town, Murang'a County, Kenya",
    phone: '+254 712 045 710',
    hours: 'Mon–Sat 8am–5pm',
    mapsQuery: "Kenol Town Murang'a Kenya",
  },
  {
    id: 'thika',
    name: 'Thika Branch',
    address: 'Thika Town, Kiambu County, Kenya',
    phone: '+254 792 471 511',
    hours: 'Mon–Fri 8am–5pm',
    mapsQuery: 'Thika Town Kenya',
  },
];

function BranchCard({
  branch,
  isSelected,
  onSelect,
  isDark,
}: {
  branch: Branch;
  isSelected: boolean;
  onSelect: () => void;
  isDark: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.85}
      style={{
        backgroundColor: isSelected
          ? isDark ? 'rgba(14,165,233,0.12)' : '#f0f9ff'
          : isDark ? C.darkCard : '#ffffff',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        borderWidth: isSelected ? 1.5 : 1,
        borderColor: isSelected ? C.blue : isDark ? C.darkBorder : '#e5e7eb',
        shadowColor: isSelected ? C.blue : '#000',
        shadowOpacity: isSelected ? 0.12 : 0.05,
        shadowRadius: 8,
        elevation: isSelected ? 4 : 1,
      }}
    >
      {/* Branch name */}
      <Text
        style={{
          color: isSelected ? C.blue : isDark ? '#f8fafc' : C.heading,
          fontFamily: F.bold,
          fontSize: 15,
          marginBottom: 10,
        }}
      >
        {branch.name}
      </Text>

      {/* Info rows */}
      <View style={{ gap: 6, marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
          <MapPin size={13} color={C.blue} style={{ marginTop: 1 }} />
          <Text style={{ flex: 1, color: isDark ? C.mutedDark : C.muted, fontFamily: F.regular, fontSize: 12, lineHeight: 18 }}>
            {branch.address}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Phone size={13} color={C.blue} />
          <Text style={{ color: isDark ? C.mutedDark : C.muted, fontFamily: F.regular, fontSize: 12 }}>
            {branch.phone}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Clock size={13} color={C.blue} />
          <Text style={{ color: isDark ? C.mutedDark : C.muted, fontFamily: F.regular, fontSize: 12 }}>
            {branch.hours}
          </Text>
        </View>
      </View>

      {/* Action buttons */}
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
            paddingVertical: 8,
            borderRadius: 8,
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
            paddingVertical: 8,
            borderRadius: 8,
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

export default function BranchesSection() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedId, setSelectedId] = useState<string>(BRANCHES[0].id);

  const selected = BRANCHES.find(b => b.id === selectedId) ?? BRANCHES[0];

  return (
    <View style={{ backgroundColor: isDark ? C.darkCard : '#ffffff', paddingVertical: 72, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        {/* Section heading — matches all other landing section headers */}
        <View style={{ alignItems: 'center', marginBottom: 44 }}>
          <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>
            Our Locations
          </Text>
          <Text style={{ color: isDark ? '#f8fafc' : C.heading, fontFamily: F.bold, fontSize: IS_WEB ? 34 : 26, textAlign: 'center', lineHeight: IS_WEB ? 44 : 34, marginBottom: 12 }}>
            Our Branches
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue }} />
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
          </View>
        </View>

        {/* Layout: row on web (map ~60% | list ~40%), column on mobile */}
        <View style={IS_WEB ? { flexDirection: 'row', gap: 28, alignItems: 'flex-start' } : {}}>

          {/* Map — updates when a different branch card is tapped */}
          <View style={IS_WEB ? { flex: 3 } : { marginBottom: 24 }}>
            <BranchMap query={selected.mapsQuery} />
          </View>

          {/* Branch card list */}
          <View style={IS_WEB ? { flex: 2 } : {}}>
            {BRANCHES.map(branch => (
              <BranchCard
                key={branch.id}
                branch={branch}
                isSelected={branch.id === selectedId}
                onSelect={() => setSelectedId(branch.id)}
                isDark={isDark}
              />
            ))}
          </View>

        </View>
      </View>
    </View>
  );
}
