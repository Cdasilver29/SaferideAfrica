import React from 'react';
import { View } from 'react-native';
import { Building2, Users, Trophy, Award } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { C, IS_WEB, MAX_W } from './constants';
import { StatCard } from './StatCard';
import { STATS } from '@/data/saferide';

const OVERLAP_WEB    = -56;  // cards rise 56 px into the hero on web
const OVERLAP_NATIVE = -40;  // 40 px on mobile (shorter hero)

export default function StatStrip() {
  const T = useTheme();

  const cards = [
    {
      icon:  <Building2 size={28} color={C.skyDeep} />,
      value: `${STATS.branches}+`,
      label: 'Branches across Nairobi',
    },
    {
      icon:  <Users size={28} color={C.skyDeep} />,
      value: `${STATS.instructors}+`,
      label: 'Certified Instructors',
    },
    {
      icon:  <Trophy size={28} color={C.skyDeep} />,
      value: `${STATS.passRate}%`,
      label: 'First-Try Pass Rate',
    },
    {
      icon:  <Award size={28} color={C.skyDeep} />,
      value: `${STATS.yearsActive}+`,
      label: 'Years on the Road',
    },
  ];

  return (
    <View
      style={{
        backgroundColor: T.isDark ? C.dark : C.white,
        // Padding below the cards so the section has breathing room
        paddingBottom: 40,
        paddingHorizontal: IS_WEB ? 24 : 16,
        // z-index so overlapping cards sit above the hero image
        zIndex: 10,
      }}
    >
      <View
        style={
          IS_WEB
            ? {
                maxWidth: MAX_W,
                width: '100%',
                alignSelf: 'center',
                flexDirection: 'row',
                gap: 16,
                marginTop: OVERLAP_WEB,
              }
            : {
                gap: 12,
                marginTop: OVERLAP_NATIVE,
              }
        }
      >
        {cards.map((c, i) => (
          <StatCard key={c.label} icon={c.icon} value={c.value} label={c.label} index={i} />
        ))}
      </View>
    </View>
  );
}
