import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react-native';
import { CLASSES } from '@/data/saferide';
import { Badge, Button, Icon, cn } from '@/components/ui';
import { C, F, IS_WEB, MAX_W } from './constants';
import { SectionIntro } from './SectionIntro';
import { useEnrollModal } from '@/context/EnrollModalContext';
import { useReduceMotion } from '@/hooks/useReduceMotion';

const PREVIEW_CODES = ['B-LIGHT', 'B-AUTO', 'EXECUTIVE'];

function CourseCard({ cls }: { cls: (typeof CLASSES)[0] }) {
  const { t } = useTranslation();
  const { open } = useEnrollModal();
  const isExec = cls.code === 'EXECUTIVE';

  return (
    <View
      className={cn(
        'flex-1 rounded-card border p-5',
        isExec ? 'border-transparent bg-foreground dark:bg-card' : 'border-border bg-card',
      )}
    >
      {isExec && <Badge variant="accent" className="mb-3.5">{t('common.premium')}</Badge>}

      <Text style={{ fontFamily: F.bold }} className={cn('mb-1.5 text-base leading-6', isExec ? 'text-white' : 'text-foreground')}>
        {cls.name}
      </Text>
      <Text style={{ fontFamily: F.semibold }} className={cn('mb-4 text-sm', isExec ? 'text-white/70' : 'text-muted-foreground')}>
        {t('home.coursesPreview.pricingNote')}
      </Text>

      <Button variant="accent" className="mt-auto w-full" onPress={() => open(cls.code)}>
        <Text style={{ fontFamily: F.bold }} className="text-sm text-accent-foreground">{t('common.enrolNow')}</Text>
      </Button>
    </View>
  );
}

export default function CoursesPreview() {
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || (IS_WEB && winW < 768);
  const preview = CLASSES.filter((c) => PREVIEW_CODES.includes(c.code));

  const reduceMotion = useReduceMotion();
  const scrollRef = useRef<ScrollView>(null);
  const idxRef = useRef(0);
  const [activeDot, setActiveDot] = useState(0);
  const cardW = winW - 48;

  useEffect(() => {
    if (!isMobile || reduceMotion) return; // calm and static under reduce-motion (Phase 12)
    const timer = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % preview.length;
      scrollRef.current?.scrollTo({ x: idxRef.current * cardW, animated: true });
      setActiveDot(idxRef.current);
    }, 3000);
    return () => clearInterval(timer);
  }, [isMobile, cardW, preview.length, reduceMotion]);

  return (
    <View className="bg-background px-6 py-16">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        <SectionIntro
          badge={t('home.coursesPreview.badge')}
          title={t('home.coursesPreview.title')}
          description={t('home.coursesPreview.description')}
        />

        {!isMobile ? (
          <View className="mb-9 flex-row gap-4">
            {preview.map((cls) => (
              <CourseCard key={cls.code} cls={cls} />
            ))}
          </View>
        ) : (
          <>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              className="mb-3"
              onMomentumScrollEnd={(e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / cardW);
                idxRef.current = idx;
                setActiveDot(idx);
              }}
            >
              {preview.map((cls) => (
                <View key={cls.code} style={{ width: cardW }}>
                  <CourseCard cls={cls} />
                </View>
              ))}
            </ScrollView>
            <View className="mb-9 flex-row justify-center gap-1.5">
              {preview.map((_, i) => (
                <View
                  key={i}
                  className={cn('h-1.5 rounded-pill', i === activeDot ? 'w-4 bg-primary' : 'w-1.5 bg-foreground/20')}
                />
              ))}
            </View>
          </>
        )}

        <Pressable
          onPress={() => router.push('/courses')}
          accessibilityRole="link"
          className="flex-row items-center gap-1 self-center"
        >
          <Text style={{ fontFamily: F.semibold }} className="text-base text-primary">{t('common.viewAllClasses')}</Text>
          <Icon icon={ArrowRight} size="sm" color={C.skyDeep} />
        </Pressable>
      </View>
    </View>
  );
}
