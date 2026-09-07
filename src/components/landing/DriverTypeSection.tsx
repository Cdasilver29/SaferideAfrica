import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SERVICES } from '@/data/saferide';
import { cn } from '@/components/ui';
import { IS_WEB, MAX_W } from './constants';
import { SectionIntro } from './SectionIntro';
import { ImageCard } from './ImageCard';

// Homepage router for the three ways people arrive: learning from scratch,
// adding a category to a licence they already hold, or coming back after time
// away. Each card lands on the page that already covers that path, so the copy
// here only paraphrases published service and catalogue text. Entrance motion
// comes from the Reveal wrapper in app/index.tsx.

// The refresher photo is read back off its SERVICES entry so the card and the
// service page it links to can never drift apart.
const REFRESHER_IMG = SERVICES.find((s) => s.code === 'REFRESHER')?.image;

const CARDS = [
  {
    key: 'new',
    href: '/services/BEGINNER',
    image: require('../../../assets/images/services/beginner-driver-education.webp'),
  },
  {
    key: 'category',
    href: '/courses',
    image: require('../../../assets/images/courses/c-series.webp'),
  },
  {
    key: 'refresher',
    href: '/services/REFRESHER',
    image: REFRESHER_IMG,
  },
];

export default function DriverTypeSection() {
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const isNarrow = !IS_WEB || (IS_WEB && winW < 768);

  return (
    <View className="bg-secondary/10 px-6 py-14 dark:bg-background">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        <SectionIntro
          badge={t('home.driverTypes.badge')}
          title={t('home.driverTypes.title')}
          description={t('home.driverTypes.description')}
        />

        <View className={cn('gap-5', !isNarrow && 'flex-row flex-wrap justify-center')}>
          {CARDS.map((card) => (
            <View
              key={card.key}
              className={isNarrow ? 'w-full' : 'flex-1'}
              style={!isNarrow ? { minWidth: 280, maxWidth: 360 } : undefined}
            >
              <ImageCard
                href={card.href}
                title={t(`home.driverTypes.cards.${card.key}.title`)}
                description={t(`home.driverTypes.cards.${card.key}.desc`)}
                image={card.image}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
