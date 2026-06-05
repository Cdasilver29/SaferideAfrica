import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { BookOpen, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { CLASSES } from '@/data/saferide';
import { C, F, IS_WEB, MAX_W } from './constants';
import { SectionIntro } from './SectionIntro';
import { useEnrollModal } from '@/context/EnrollModalContext';

const PREVIEW_CODES = ['B-LIGHT', 'B-AUTO', 'EXECUTIVE'];

function CourseCard({ cls }: { cls: (typeof CLASSES)[0] }) {
  const T = useTheme();
  const { open } = useEnrollModal();
  const isExec = cls.code === 'EXECUTIVE';

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isExec ? C.dark : T.card,
        borderRadius: 18,
        padding: 22,
        borderWidth: isExec ? 0 : 1,
        borderColor: T.border,
        shadowColor: isExec ? C.skyDeep : '#000',
        shadowOpacity: isExec ? 0.20 : 0.06,
        shadowRadius: isExec ? 16 : 8,
        elevation: isExec ? 6 : 2,
      }}
    >
      {isExec && (
        <View
          style={{
            alignSelf: 'flex-start',
            backgroundColor: C.yellow,
            borderRadius: 6,
            paddingHorizontal: 10,
            paddingVertical: 4,
            marginBottom: 14,
          }}
        >
          <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' }}>
            Premium
          </Text>
        </View>
      )}

      <Text
        style={{
          color: isExec ? C.white : T.foreground,
          fontFamily: F.bold,
          fontSize: 16,
          marginBottom: 6,
          lineHeight: 22,
        }}
      >
        {cls.name}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
        <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: IS_WEB ? 26 : 22 }}>
          Ksh {cls.total.toLocaleString()}
        </Text>
      </View>

      {cls.lessons && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <BookOpen size={13} color={isExec ? C.mutedDark : T.mutedForeground as string} />
          <Text style={{ color: isExec ? C.mutedDark : T.mutedForeground, fontFamily: F.regular, fontSize: 12 }}>
            {cls.lessons} lessons included
          </Text>
        </View>
      )}

      <TouchableOpacity
        onPress={() => open(cls.code)}
        activeOpacity={0.85}
        style={{
          backgroundColor: isExec ? C.yellow : C.skyDeep,
          paddingVertical: 12,
          borderRadius: 12,
          alignItems: 'center',
          marginTop: 'auto' as any,
        }}
      >
        <Text style={{ color: isExec ? C.dark : C.white, fontFamily: F.bold, fontSize: 13 }}>
          Enrol Now
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function CoursesPreview() {
  const T       = useTheme();
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || (IS_WEB && winW < 768);
  const preview = CLASSES.filter(c => PREVIEW_CODES.includes(c.code));

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
          badge="Our Courses"
          title="Master the Road with World-Class Training"
          description="Pick a class, see the price, enrol in under five minutes. All NTSA-aligned."
        />

        {!isMobile ? (
          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 36 }}>
            {preview.map(cls => <CourseCard key={cls.code} cls={cls} />)}
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingRight: 24 }}
            style={{ marginBottom: 36, marginHorizontal: -24 }}
          >
            {preview.map(cls => (
              <View key={cls.code} style={{ width: 260 }}>
                <CourseCard cls={cls} />
              </View>
            ))}
          </ScrollView>
        )}

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => router.push('/courses')}
            activeOpacity={0.7}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
          >
            <Text style={{ color: C.red, fontFamily: F.semibold, fontSize: 15 }}>
              View full pricing list
            </Text>
            <ArrowRight size={15} color={C.red} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}
