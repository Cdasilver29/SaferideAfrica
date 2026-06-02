import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { useTheme } from '@/lib/theme';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react-native';
import { BranchMap } from './BranchMap';
import { BRANCHES, Branch } from '@/data/saferide';
import { C, F, IS_WEB, MAX_W } from './constants';

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
  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.85}
      style={{
        backgroundColor: isSelected ? (T.isDark ? 'rgba(14,165,233,0.12)' : '#f0f9ff') : T.card,
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        borderWidth: isSelected ? 1.5 : 1,
        borderColor: isSelected ? C.blue : T.border,
        shadowColor: isSelected ? C.blue : '#000',
        shadowOpacity: isSelected ? 0.12 : 0.05,
        shadowRadius: 8,
        elevation: isSelected ? 4 : 1,
      }}
    >
      {/* Branch name + HQ badge */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Text style={{ color: isSelected ? C.blue : T.foreground, fontFamily: F.bold, fontSize: 15, flex: 1 }}>
          {branch.name}
        </Text>
        {branch.isHQ && (
          <View style={{ backgroundColor: C.yellow, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.8 }}>HQ</Text>
          </View>
        )}
      </View>

      {/* Info rows */}
      <View style={{ gap: 6, marginBottom: 14 }}>
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

      {/* Action buttons */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(branch.mapsQuery)}`
            )
          }
          style={{ flex: 1, backgroundColor: C.blue, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 }}
          activeOpacity={0.8}
        >
          <Navigation size={12} color="#ffffff" />
          <Text style={{ color: '#ffffff', fontFamily: F.semibold, fontSize: 12 }}>Get Directions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:${branch.phone.replace(/\s/g, '')}`)}
          style={{ flex: 1, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1, borderColor: C.blue }}
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
  const T = useTheme();
  const [selectedId, setSelectedId] = useState<string>(BRANCHES[0].id);

  return (
    <View style={{ backgroundColor: T.background, paddingVertical: 72, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        <View style={{ alignItems: 'center', marginBottom: 44 }}>
          <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>
            Our Locations
          </Text>
          <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: IS_WEB ? 34 : 26, textAlign: 'center', lineHeight: IS_WEB ? 44 : 34, marginBottom: 12 }}>
            Our 10 Branches
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue }} />
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
          </View>
        </View>

        <View style={IS_WEB ? { flexDirection: 'row', gap: 28, alignItems: 'flex-start' } : {}}>

          <View style={IS_WEB ? { flex: 3 } : { marginBottom: 24 }}>
            <BranchMap
              activeBranchId={selectedId}
              onMarkerPress={(id) => setSelectedId(id)}
            />
          </View>

          {/* Wrapper View with fixed height so RNW's ScrollView has a constrained container to scroll within */}
          <View style={IS_WEB ? { flex: 2, height: 420 } : {}}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 8 }}
              showsVerticalScrollIndicator
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
