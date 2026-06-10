import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useTheme } from '@/lib/theme';
import { C, IS_WEB, MAX_W } from './constants';
import { StatCard } from './StatCard';
import { STATS } from '@/data/saferide';
import { useInView } from '@/hooks/useInView';

const OVERLAP_WEB    = -56;  // cards rise 56 px into the hero on web
const OVERLAP_NATIVE = -40;  // 40 px on mobile (shorter hero)

export default function StatStrip() {
  const T = useTheme();
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || (IS_WEB && winW < 768);
  const { ref, inView } = useInView();
  const gap = winW < 640 ? 12 : winW < 1024 ? 20 : 24;

  const cards = [
    { value: `${STATS.branches}+`,    label: 'Branches across Nairobi' },
    { value: `${STATS.instructors}+`, label: 'Certified Instructors' },
    { value: `${STATS.passRate}%`,    label: 'First-Try Pass Rate' },
    { value: `${STATS.yearsActive}+`, label: 'Years on the Road' },
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
        ref={ref}
        style={
          IS_WEB && !isMobile
            ? {
                maxWidth: MAX_W,
                width: '100%',
                alignSelf: 'center',
                flexDirection: 'row',
                gap,
                marginTop: OVERLAP_WEB,
              }
            : {
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap,
                marginTop: OVERLAP_NATIVE,
              }
        }
      >
        {cards.map((c, i) => (
          <View key={c.label} style={isMobile ? { width: '48%' } : { flex: 1 }}>
            <StatCard value={c.value} label={c.label} index={i} inView={inView} />
          </View>
        ))}
      </View>
    </View>
  );
}
