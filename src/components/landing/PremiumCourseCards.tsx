import React from 'react';
import { View, Text, Image, Pressable, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react-native';
import { CLASSES, CLASS_SERIES } from '@/data/saferide';
import { Badge, Icon, cn } from '@/components/ui';
import { C, F, IS_WEB, MAX_W } from './constants';
import { SectionIntro } from './SectionIntro';
import { useInView } from '@/hooks/useInView';
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

// Both B classes share the b-series photo (Phase 14 images are per series and
// stay untouched); mirroring the Auto card keeps the pair visually distinct.
const CARD_MIRRORED: Record<string, boolean> = {
  'B-AUTO': true,
};

// Phase C image-led card: vehicle photo on top, title, one line, Read More.
// The whole card is the link; Read More is the visible affordance.
function ClassCard({ cls }: { cls: (typeof CLASSES)[0] }) {
  const { t } = useTranslation();
  const cardKey = CARD_KEY_MAP[cls.code];
  const image = CLASS_SERIES.find((s) => s.code === cls.series)?.image;
  const mirrored = CARD_MIRRORED[cls.code];

  return (
    <Pressable
      onPress={() => router.push(`/classes/${cls.code}` as any)}
      accessibilityRole="link"
      accessibilityLabel={cls.name}
      className="overflow-hidden rounded-card border border-border bg-card hover:border-primary/50 active:opacity-90"
    >
      {/* Sized image container: explicit inline dimensions stop react-native-web
          injecting the source's intrinsic height (same fix as the courses page). */}
      <View style={{ height: 180 }} className="overflow-hidden">
        {image && (
          <Image
            source={image}
            resizeMode="cover"
            accessibilityLabel={`${cls.name} vehicle`}
            style={{
              width: '100%',
              height: '100%',
              ...(mirrored ? { transform: [{ scaleX: -1 }] } : null),
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

export function PremiumCourseCards() {
  const { t } = useTranslation();
  const premiumClasses = CLASSES.filter((c) => PREVIEW_CODES.includes(c.code));
  const { width: winW } = useWindowDimensions();
  const isNarrow = !IS_WEB || (IS_WEB && winW < 768);
  const { ref, inView } = useInView(0.15);

  return (
    <View className="bg-background px-5 py-14">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        <SectionIntro
          badge={t('home.premiumCourses.badge')}
          title={t('home.premiumCourses.title')}
          description={t('home.premiumCourses.description')}
        />

        <View ref={ref} className={cn('gap-5', !isNarrow && 'flex-row')}>
          {premiumClasses.map((cls, i) => (
            <RevealItem
              key={cls.code}
              index={i}
              inView={inView}
              className={isNarrow ? 'w-full' : 'flex-1'}
            >
              <ClassCard cls={cls} />
            </RevealItem>
          ))}
        </View>
      </View>
    </View>
  );
}
