import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { ArrowRight, Plus, Minus } from 'lucide-react-native';
import { CLASSES, CLASS_SERIES } from '@/data/saferide';
import { Badge, Button, Icon, cn } from '@/components/ui';
import { C, F, IS_WEB, MAX_W } from './constants';
import { SectionIntro } from './SectionIntro';
import { useInView } from '@/hooks/useInView';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { RevealItem } from '@/components/animations/Reveal';

const PREVIEW_CODES = ['B-LIGHT', 'B-AUTO', 'EXECUTIVE'];

const CARD_KEY_MAP: Record<string, string> = {
  'B-LIGHT': 'bLight',
  'B-AUTO': 'bAuto',
  EXECUTIVE: 'executive',
};

const CARD_HAS_BADGE: Record<string, boolean> = {
  'B-LIGHT': true,
  'B-AUTO': false,
  EXECUTIVE: true,
};

// Phase C image-led card: vehicle photo on top, title, one line, Read More.
// The whole card is the link; Read More is the visible affordance.
function ClassCard({ cls }: { cls: (typeof CLASSES)[0] }) {
  const { t } = useTranslation();
  const cardKey = CARD_KEY_MAP[cls.code];
  let image = CLASS_SERIES.find((s) => s.code === cls.series)?.image;

  if (IS_WEB) {
    if (cls.code === 'B-AUTO') image = { uri: '/gallery/DSC_2225.webp' };
    if (cls.code === 'B-LIGHT') image = { uri: '/gallery/DSC_7014.webp' };
    if (cls.code === 'A3-TUKTUK') image = { uri: '/gallery/Tuktuk.webp' };
    if (cls.code === 'C-LIGHT') image = { uri: '/gallery/truck-highway.webp' };
  }

  return (
    <Pressable
      onPress={() => router.push(`/classes/${cls.code}` as any)}
      accessibilityRole="link"
      accessibilityLabel={cls.name}
      className="overflow-hidden rounded-card border border-border bg-card hover:border-primary/50 active:opacity-90"
    >
      {/* Sized image container: a 3:2 aspect-ratio box frames the landscape
          series photos with little crop and gives the portrait B-series photo a
          taller band. Explicit inline dimensions on the Image stop react-native-
          web injecting the source's intrinsic height (same fix as courses). */}
      <View style={{ aspectRatio: 3 / 2, width: '100%' }} className="overflow-hidden">
        {image && (
          <Image
            source={image}
            resizeMode="cover"
            accessibilityLabel={`${cls.name} vehicle`}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        )}
        {CARD_HAS_BADGE[cls.code] && (
          <Badge variant="accent" className="absolute left-3 top-3">
            {t(`home.premiumCourses.cards.${cardKey}.badge`)}
          </Badge>
        )}
      </View>

      <View className="p-5">
        <Text style={{ fontFamily: F.bold }} className="mb-1 text-lg text-foreground">
          {cls.name}
        </Text>
        <Text style={{ fontFamily: F.regular }} className="mb-2 text-sm leading-5 text-muted-foreground">
          {t(`home.premiumCourses.cards.${cardKey}.snippet`)}
        </Text>
        <View className="h-11 flex-row items-center gap-1.5">
          <Text style={{ fontFamily: F.semibold }} className="text-sm text-primary">
            {t('common.readMore')}
          </Text>
          <Icon icon={ArrowRight} size="sm" color={C.skyDeep} />
        </View>
      </View>
    </Pressable>
  );
}

// Compact card for the expanded list (home restructure Phase 6): class name
// and series subtitle only, no snippet copy, so no new factual claims. Routes
// to the class detail page like the full cards.
function CompactClassCard({ cls }: { cls: (typeof CLASSES)[0] }) {
  const series = CLASS_SERIES.find((s) => s.code === cls.series);

  return (
    <Pressable
      onPress={() => router.push(`/classes/${cls.code}` as any)}
      accessibilityRole="link"
      accessibilityLabel={cls.name}
      className="min-h-[56px] flex-row items-center justify-between gap-2 rounded-card border border-border bg-card px-4 py-3 hover:border-primary/50 active:opacity-90"
    >
      <View className="flex-1">
        <Text style={{ fontFamily: F.semibold }} className="text-sm text-foreground">
          {cls.name}
        </Text>
        {series ? (
          <Text style={{ fontFamily: F.regular }} className="text-xs text-muted-foreground">
            {series.subtitle}
          </Text>
        ) : null}
      </View>
      <Icon icon={ArrowRight} size="sm" color={C.skyDeep} />
    </Pressable>
  );
}

export function PremiumCourseCards() {
  const { t } = useTranslation();
  const premiumClasses = CLASSES.filter((c) => PREVIEW_CODES.includes(c.code));
  const moreClasses = CLASSES.filter((c) => !PREVIEW_CODES.includes(c.code));
  const { width: winW } = useWindowDimensions();
  const isNarrow = !IS_WEB || (IS_WEB && winW < 768);
  const { ref, inView } = useInView(0.15);
  const reduceMotion = useReduceMotion();

  // In-place expander. Opacity and translate only; the layout change itself is
  // instant, and under reduce-motion the list simply appears.
  const [expanded, setExpanded] = useState(false);
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = reduceMotion
      ? (expanded ? 1 : 0)
      : withTiming(expanded ? 1 : 0, { duration: 250, easing: Easing.out(Easing.cubic) });
  }, [expanded, reduceMotion]);
  const revealStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * -8 }],
  }));

  return (
    <View className="bg-background px-6 py-14">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        <SectionIntro
          badge={t('home.premiumCourses.badge')}
          title={t('home.premiumCourses.title')}
          description={t('home.premiumCourses.description')}
        />

        <View ref={ref} className={cn('gap-5', !isNarrow && 'flex-row flex-wrap justify-center')}>
          {premiumClasses.map((cls, i) => (
            <RevealItem
              key={cls.code}
              index={i}
              inView={inView}
              className={isNarrow ? 'w-full' : 'flex-1'}
              style={!isNarrow ? { minWidth: 280, maxWidth: 360 } : undefined}
            >
              <ClassCard cls={cls} />
            </RevealItem>
          ))}
        </View>

        {expanded && (
          <Animated.View style={revealStyle}>
            {/* className is a no-op on Animated.View, so layout sits on a plain View */}
            <View className="mt-5 flex-row flex-wrap gap-3">
              {moreClasses.map((cls) => (
                <View key={cls.code} style={{ width: isNarrow ? '48%' : '31%', flexGrow: 1 }}>
                  <CompactClassCard cls={cls} />
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        <View className="mt-8 items-center">
          <Button
            variant="outline"
            onPress={() => setExpanded((e) => !e)}
            accessibilityLabel={expanded ? t('home.premiumCourses.showFewer') : t('home.premiumCourses.viewMore')}
            accessibilityState={{ expanded }}
            className="px-7"
          >
            <Icon icon={expanded ? Minus : Plus} size="sm" color={C.skyDeep} />
            <Text style={{ fontFamily: F.bold }} className="text-base text-foreground">
              {expanded ? t('home.premiumCourses.showFewer') : t('home.premiumCourses.viewMore')}
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
