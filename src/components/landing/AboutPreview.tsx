import React from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react-native';
import { C, F, IS_WEB, MAX_W, ABOUT_IMG } from './constants';
import { Icon } from '@/components/ui';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { SectionIntro } from './SectionIntro';
import { FeatureCard } from './FeatureCard';

// About preview image sits half-width on desktop (~half of the 1100 container),
// full width on mobile.
const ABOUT_SIZES = '(max-width: 768px) 100vw, 550px';

export default function AboutPreview() {
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || (IS_WEB && winW < 768);

  const feature1 = <FeatureCard variant="primary" title={t('home.aboutPreview.feature1Title')} description={t('home.aboutPreview.feature1Desc')} />;
  const feature2 = <FeatureCard variant="accent" title={t('home.aboutPreview.feature2Title')} description={t('home.aboutPreview.feature2Desc')} />;

  return (
    <View className="bg-primary px-6 py-14 dark:bg-background">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        <SectionIntro
          invert
          badge={t('home.aboutPreview.badge')}
          title={t('home.aboutPreview.title')}
          description={t('home.aboutPreview.description')}
        />

        {isMobile ? (
          <View className="mb-10 gap-4">
            <View className="overflow-hidden rounded-card-lg bg-primary/10" style={{ width: '100%', height: 240 }}>
              <ResponsiveImage source={ABOUT_IMG} alt={t('home.aboutPreview.title')} sizes={ABOUT_SIZES} fill />
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1">{feature1}</View>
              <View className="flex-1">{feature2}</View>
            </View>
          </View>
        ) : (
          <View className="mb-10 flex-row items-stretch gap-8">
            <View className="flex-1 gap-4">
              {feature1}
              {feature2}
            </View>
            <View className="flex-1">
              <View className="overflow-hidden rounded-card-lg bg-primary/10" style={{ width: '100%', height: 320 }}>
                <ResponsiveImage source={ABOUT_IMG} alt={t('home.aboutPreview.title')} sizes={ABOUT_SIZES} fill />
              </View>
            </View>
          </View>
        )}

        {/* Secondary nav CTA: white on-colour (yellow stays reserved for Enroll) */}
        <View className="items-center">
          <Pressable
            onPress={() => router.push('/about')}
            accessibilityRole="button"
            className="h-12 flex-row items-center gap-2 rounded-button border border-white/60 bg-white/10 px-7 hover:bg-white/20 active:bg-white/20"
          >
            <Text style={{ fontFamily: F.bold }} className="text-base text-white">{t('common.aboutUs')}</Text>
            <Icon icon={ArrowRight} size="md" color={C.white} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
