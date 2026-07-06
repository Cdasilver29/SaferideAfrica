import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { CLASS_SERIES, CLASSES } from '@/data/saferide';
import { Card, Icon, cn } from '@/components/ui';
import { C, F, IS_WEB, MAX_W } from './constants';
import { useReduceMotion } from '@/hooks/useReduceMotion';

type Series = (typeof CLASS_SERIES)[number];

// A class row inside an expanded series card, linking to its detail page.
function ClassLink({ cls }: { cls: (typeof CLASSES)[number] }) {
  return (
    <Pressable
      onPress={() => router.push(`/classes/${cls.code}` as any)}
      accessibilityRole="link"
      accessibilityLabel={cls.name}
      className="min-h-[44px] flex-row items-center justify-between gap-2 rounded-card border border-border px-3.5 py-2.5 hover:border-primary/50 active:bg-foreground/5"
    >
      <Text style={{ fontFamily: F.medium }} className="flex-1 text-sm text-foreground">
        {cls.name}
      </Text>
      <Icon icon={ArrowRight} size="xs" color={C.skyDeep} />
    </Pressable>
  );
}

// Image-led series card with an in-place expander that reveals the series'
// classes (each links to its /classes/[code] detail page). The reveal is
// opacity and translate only, on a plain inner View (className is a no-op on
// the Animated wrapper); it appears immediately under reduce-motion.
function SeriesCard({ series }: { series: Series }) {
  const { t } = useTranslation();
  const reduceMotion = useReduceMotion();
  const [expanded, setExpanded] = useState(false);
  const classes = CLASSES.filter((c) => c.series === series.code);

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = reduceMotion
      ? (expanded ? 1 : 0)
      : withTiming(expanded ? 1 : 0, { duration: 220, easing: Easing.out(Easing.cubic) });
  }, [expanded, reduceMotion]);
  const revealStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * -6 }],
  }));

  return (
    <Card className="overflow-hidden p-0">
      {/* 3:2 sized image (Phase 3 pattern): explicit inline dimensions on the
          Image stop react-native-web injecting the source's intrinsic height. */}
      <View style={{ aspectRatio: 3 / 2, width: '100%' }} className="overflow-hidden">
        <Image
          source={series.image}
          resizeMode="cover"
          accessibilityLabel={`${series.label}: ${series.subtitle}`}
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      <View className="p-5">
        <Text style={{ fontFamily: F.bold }} className="text-lg text-foreground">
          {series.label}
        </Text>
        <Text style={{ fontFamily: F.regular }} className="mt-0.5 text-sm text-muted-foreground">
          {series.subtitle}
        </Text>

        <Pressable
          onPress={() => setExpanded((v) => !v)}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityLabel={`${series.label}: ${expanded ? t('courses.showLess') : t('common.readMore')}`}
          className="mt-3 h-11 flex-row items-center gap-1.5"
        >
          <Text style={{ fontFamily: F.semibold }} className="text-sm text-primary">
            {expanded ? t('courses.showLess') : t('common.readMore')}
          </Text>
          <Icon icon={expanded ? ChevronUp : ChevronDown} size="sm" color={C.skyDeep} />
        </Pressable>

        {expanded && (
          <Animated.View style={revealStyle}>
            {/* className is a no-op on the Animated wrapper; layout on inner View */}
            <View className="gap-2 pt-1">
              {classes.map((cls) => (
                <ClassLink key={cls.code} cls={cls} />
              ))}
            </View>
          </Animated.View>
        )}
      </View>
    </Card>
  );
}

// Courses page catalogue: the five series as image-led cards. Web shows a 3-up
// grid, mobile stacks full-width in the CLASS_SERIES order (A, B, C, D/PSV,
// Executive), image on top. Each card expands to its classes.
export default function SeriesGrid() {
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const isNarrow = !IS_WEB || (IS_WEB && winW < 768);

  return (
    <View className="bg-background px-6 py-16">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        <View className="mb-11 items-center">
          <Text style={{ fontFamily: F.bold, letterSpacing: 2.5 }} className="mb-2.5 text-xs uppercase text-primary">
            {t('courses.overline')}
          </Text>
          <Text style={{ fontFamily: F.bold }} className="mb-3 text-center text-2xl leading-8 text-foreground web:text-[34px] web:leading-[44px]">
            {t('courses.heading')}
          </Text>
          <View className="flex-row items-center gap-2">
            <View className="h-0.5 w-10 rounded-pill bg-accent" />
            <View className="h-2 w-2 rounded-pill bg-primary" />
            <View className="h-0.5 w-10 rounded-pill bg-accent" />
          </View>
        </View>

        <View className={cn('gap-4', !isNarrow && 'flex-row flex-wrap')}>
          {CLASS_SERIES.map((series) => (
            <View key={series.code} style={{ width: isNarrow ? '100%' : '31%' }}>
              <SeriesCard series={series} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
