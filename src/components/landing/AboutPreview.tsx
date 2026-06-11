import React from 'react';
import { View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react-native';
import { C, F, IS_WEB, MAX_W, ABOUT_IMG } from './constants';
import { SectionIntro } from './SectionIntro';
import { FeatureCard } from './FeatureCard';

export default function AboutPreview() {
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || (IS_WEB && winW < 768);

  return (
    <View style={{ backgroundColor: C.skyDeep, paddingVertical: 64, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        <SectionIntro
          invert
          badge={t('home.aboutPreview.badge')}
          title={t('home.aboutPreview.title')}
          description={t('home.aboutPreview.description')}
        />

        {isMobile ? (
          /* Mobile: full-width image on top, cards side-by-side below */
          <View style={{ marginBottom: 40, gap: 16 }}>
            <Image
              source={ABOUT_IMG}
              style={{ width: '100%', height: 240, borderRadius: 20, backgroundColor: 'rgba(1,165,240,0.10)' }}
              resizeMode="cover"
              progressiveRenderingEnabled
              fadeDuration={200}
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <FeatureCard
                  variant="primary"
                  title={t('home.aboutPreview.feature1Title')}
                  description={t('home.aboutPreview.feature1Desc')}
                />
              </View>
              <View style={{ flex: 1 }}>
                <FeatureCard
                  variant="accent"
                  title={t('home.aboutPreview.feature2Title')}
                  description={t('home.aboutPreview.feature2Desc')}
                />
              </View>
            </View>
          </View>
        ) : (
          /* Desktop: feature cards stacked on left, large image on right */
          <View style={{ flexDirection: 'row', gap: 32, alignItems: 'stretch', marginBottom: 40 }}>
            <View style={{ flex: 1, gap: 16 }}>
              <FeatureCard
                variant="primary"
                title={t('home.aboutPreview.feature1Title')}
                description={t('home.aboutPreview.feature1Desc')}
              />
              <FeatureCard
                variant="accent"
                title={t('home.aboutPreview.feature2Title')}
                description={t('home.aboutPreview.feature2Desc')}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Image
                source={ABOUT_IMG}
                style={{ width: '100%', height: 320, borderRadius: 24, backgroundColor: 'rgba(1,165,240,0.10)' }}
                resizeMode="cover"
                progressiveRenderingEnabled
                fadeDuration={200}
              />
            </View>
          </View>
        )}

        {/* CTA */}
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => router.push('/about')}
            activeOpacity={0.85}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: C.red,
              paddingHorizontal: 32,
              paddingVertical: 14,
              borderRadius: 28,
              shadowColor: C.red,
              shadowOpacity: 0.38,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            <Text style={{ color: C.white, fontFamily: F.bold, fontSize: 15 }}>{t('common.aboutUs')}</Text>
            <ArrowRight size={16} color={C.white} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}
