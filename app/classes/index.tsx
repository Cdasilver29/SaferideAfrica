import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { ChevronRight, BookOpen, ArrowLeft } from 'lucide-react-native';
import { CLASSES, CLASS_SERIES, SeriesCode, DriveClass } from '../../src/data/saferide';
import { C, F, IS_WEB, MAX_W } from '../../src/components/landing/constants';

const KSH = (n: number) => 'Ksh ' + n.toLocaleString('en-KE');

const SERIES_COLORS: Record<SeriesCode, string> = {
  A:    C.skyLight,
  B:    C.skyDeep,
  C:    C.red,
  D:    C.yellow,
  EXEC: C.yellow,
};

function ClassCard({ cls }: { cls: DriveClass }) {
  const color = SERIES_COLORS[cls.series];
  return (
    <TouchableOpacity
      onPress={() => router.push(`/classes/${cls.code}/enrol`)}
      activeOpacity={0.85}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 18,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(34, 31, 32, 0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
      }}
    >
      {/* Colour bar */}
      <View style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, backgroundColor: color }} />

      {/* Info */}
      <View style={{ flex: 1 }}>
        <Text style={{ color: C.heading, fontFamily: F.semibold, fontSize: 14, marginBottom: 4 }}>{cls.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={{ color, fontFamily: F.bold, fontSize: 16 }}>{KSH(cls.total)}</Text>
          {cls.lessons !== null && (
            <Text style={{ color: C.muted, fontFamily: F.regular, fontSize: 12 }}>{cls.lessons} lessons</Text>
          )}
          {cls.lessons === null && cls.series !== 'EXEC' && (
            <Text style={{ color: C.muted, fontFamily: F.regular, fontSize: 12 }}>Test Only</Text>
          )}
        </View>
      </View>

      {/* Enrol CTA */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: color + '18', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
        <Text style={{ color, fontFamily: F.bold, fontSize: 12 }}>Enrol</Text>
        <ChevronRight size={13} color={color} />
      </View>
    </TouchableOpacity>
  );
}

export default function ClassesScreen() {
  const [activeSeries, setActiveSeries] = useState<SeriesCode>('B');
  const seriesClasses = CLASSES.filter(c => c.series === activeSeries);
  const activeMeta    = CLASS_SERIES.find(s => s.code === activeSeries)!;

  return (
    <View style={{ flex: 1, backgroundColor: C.white }}>

      {/* Header */}
      <View style={{ backgroundColor: C.darkBg, paddingTop: Platform.OS === 'ios' ? 56 : 36, paddingBottom: 20, paddingHorizontal: 24 }}>
        <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.7}>
            <ArrowLeft size={14} color={C.mutedDark} />
            <Text style={{ color: C.mutedDark, fontFamily: F.semibold, fontSize: 13 }}>Back</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} color={C.dark} />
            </View>
            <View>
              <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 22 }}>Browse Classes</Text>
              <Text style={{ color: C.mutedDark, fontFamily: F.regular, fontSize: 13 }}>Select a class to enrol</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Series tabs */}
      <View style={{ backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: 'rgba(34, 31, 32, 0.1)' }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row', gap: 0, paddingHorizontal: IS_WEB ? 24 : 16 }}
          style={IS_WEB ? { maxWidth: MAX_W, alignSelf: 'center', width: '100%' } : {}}
        >
          {CLASS_SERIES.map(s => {
            const isActive = s.code === activeSeries;
            const color    = SERIES_COLORS[s.code];
            return (
              <TouchableOpacity
                key={s.code}
                onPress={() => setActiveSeries(s.code)}
                style={{
                  paddingHorizontal: 16, paddingVertical: 14,
                  borderBottomWidth: isActive ? 3 : 0,
                  borderBottomColor: color,
                }}
                activeOpacity={0.7}
              >
                <Text style={{ color: isActive ? color : C.muted, fontFamily: isActive ? F.bold : F.medium, fontSize: 14 }}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Class list */}
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          ...(IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Series subtitle */}
        <Text style={{ color: C.muted, fontFamily: F.regular, fontSize: 13, marginBottom: 16 }}>
          {activeMeta.subtitle}
        </Text>

        {seriesClasses.map(cls => <ClassCard key={cls.code} cls={cls} />)}
      </ScrollView>
    </View>
  );
}
