import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react-native';
import { CLASSES } from '@/data/saferide';
import { Badge, Button, Icon, cn } from '@/components/ui';
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

// Clean premium card on the Card surface. Decorative effects (rotating gradient
// border, mouse glow, shimmer) were dropped for restraint; Phase 12 reintroduces
// tasteful, uniform entrance and hover motion.
function PremiumCard({ cls, isNarrow }: { cls: (typeof CLASSES)[0]; isNarrow: boolean }) {
  const { t } = useTranslation();
  const cardKey = CARD_KEY_MAP[cls.code];
  const hasBadge = CARD_HAS_BADGE[cls.code];
  const lessonLine = t(`home.premiumCourses.cards.${cardKey}.lessonLine`);
  const features = t(`home.premiumCourses.cards.${cardKey}.features`, { returnObjects: true }) as string[];
  const isExec = cls.code === 'EXECUTIVE';

  return (
    <View
      className={cn(
        isNarrow ? 'w-full' : 'flex-1',
        'rounded-card border p-6',
        isExec ? 'border-transparent bg-foreground dark:bg-card' : 'border-border bg-card',
      )}
    >
      {hasBadge && (
        <Badge variant="accent" className="mb-4">
          {t(`home.premiumCourses.cards.${cardKey}.badge`)}
        </Badge>
      )}

      <Text style={{ fontFamily: F.semibold }} className={cn('mb-4 text-sm leading-5', isExec ? 'text-white/70' : 'text-muted-foreground')}>
        {t('home.premiumCourses.pricingNote')}
      </Text>

      <Text style={{ fontFamily: F.bold }} className={cn('mb-1 text-lg', isExec ? 'text-white' : 'text-foreground')}>
        {cls.name}
      </Text>
      <Text
        style={{ fontFamily: F.medium, letterSpacing: 1 }}
        className={cn('mb-5 text-xs uppercase', isExec ? 'text-white/60' : 'text-muted-foreground')}
      >
        {lessonLine}
      </Text>

      <View className={cn('mb-4 h-px', isExec ? 'bg-white/15' : 'bg-border')} />

      {features.map((feat) => (
        <View key={feat} className="mb-2.5 flex-row items-center gap-2.5">
          <View className={cn('h-1.5 w-1.5 rounded-pill', isExec ? 'bg-accent' : 'bg-primary')} />
          <Text style={{ fontFamily: F.regular }} className={cn('flex-1 text-sm', isExec ? 'text-white/80' : 'text-muted-foreground')}>
            {feat}
          </Text>
        </View>
      ))}

      <Button variant="accent" className="mt-6 w-full" onPress={() => router.push(`/classes/${cls.code}` as any)}>
        <Text style={{ fontFamily: F.bold }} className="text-base text-accent-foreground">{t('common.enrolNow')}</Text>
        <Icon icon={ArrowRight} size="md" color={C.dark} />
      </Button>
    </View>
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
              <PremiumCard cls={cls} isNarrow={isNarrow} />
            </RevealItem>
          ))}
        </View>
      </View>
    </View>
  );
}
