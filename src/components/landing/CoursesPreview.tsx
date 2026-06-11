import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { CLASSES } from '@/data/saferide';
import { C, F, IS_WEB, MAX_W } from './constants';
import { SectionIntro } from './SectionIntro';
import { useEnrollModal } from '@/context/EnrollModalContext';

const PREVIEW_CODES = ['B-LIGHT', 'B-AUTO', 'EXECUTIVE'];

function CourseCard({ cls }: { cls: (typeof CLASSES)[0] }) {
  const T = useTheme();
  const { t } = useTranslation();
  const { open } = useEnrollModal();
  const isExec = cls.code === 'EXECUTIVE';

  return (
    <View
      style={{
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
            {t('common.premium')}
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

      <Text style={{ color: isExec ? C.mutedDark : T.mutedForeground, fontFamily: F.semibold, fontSize: 14, marginBottom: 12 }}>
        {t('home.coursesPreview.pricingNote')}
      </Text>

      {cls.lessons && (
        <Text style={{ color: isExec ? C.mutedDark : T.mutedForeground, fontFamily: F.regular, fontSize: 12, marginBottom: 16 }}>
          {t('home.coursesPreview.lessonsIncluded', { count: cls.lessons })}
        </Text>
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
          {t('common.enrolNow')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function CoursesPreview() {
  const T       = useTheme();
  const { t }   = useTranslation();
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || (IS_WEB && winW < 768);
  const preview = CLASSES.filter(c => PREVIEW_CODES.includes(c.code));

  const scrollRef = useRef<ScrollView>(null);
  const idxRef    = useRef(0);
  const [activeDot, setActiveDot] = useState(0);
  const cardW = winW - 48;

  useEffect(() => {
    if (!isMobile) return;
    const timer = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % preview.length;
      scrollRef.current?.scrollTo({ x: idxRef.current * cardW, animated: true });
      setActiveDot(idxRef.current);
    }, 3000);
    return () => clearInterval(timer);
  }, [isMobile, cardW, preview.length]);

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
          badge={t('home.coursesPreview.badge')}
          title={t('home.coursesPreview.title')}
          description={t('home.coursesPreview.description')}
        />

        {!isMobile ? (
          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 36 }}>
            {preview.map(cls => (
              <View key={cls.code} style={{ flex: 1 }}>
                <CourseCard cls={cls} />
              </View>
            ))}
          </View>
        ) : (
          <>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 12 }}
              onMomentumScrollEnd={(e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / cardW);
                idxRef.current = idx;
                setActiveDot(idx);
              }}
            >
              {preview.map(cls => (
                <View key={cls.code} style={{ width: cardW }}>
                  <CourseCard cls={cls} />
                </View>
              ))}
            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 36 }}>
              {preview.map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: i === activeDot ? 18 : 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: i === activeDot ? C.red : 'rgba(0,0,0,0.18)',
                  }}
                />
              ))}
            </View>
          </>
        )}

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => router.push('/courses')}
            activeOpacity={0.7}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
          >
            <Text style={{ color: C.red, fontFamily: F.semibold, fontSize: 15 }}>
              {t('common.viewAllClasses')}
            </Text>
            <ArrowRight size={15} color={C.red} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}
