import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W } from './constants';
import { SectionIntro } from './SectionIntro';

// Phase E: concise homepage snippet of Why Choose Us and Our Values. The full
// NTSA-relevant treatment lives on the About page; the AboutPreview section
// after this one carries the About Us link, so no CTA is repeated here.
export default function WhyValuesSnippet() {
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const twoCol = IS_WEB && winW >= 768;

  const points = t('home.whySnippet.points', { returnObjects: true }) as string[];
  // Values reuse the About page translations so the two never drift.
  const values = t('aboutPage.coreValuesItems', { returnObjects: true }) as string[];

  return (
    <View className="bg-background px-6 py-14">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        <SectionIntro
          badge={t('home.whySnippet.badge')}
          title={t('home.whySnippet.title')}
          description={t('home.whySnippet.description')}
        />

        <View className={twoCol ? 'flex-row items-start gap-10' : 'gap-8'}>
          {/* Why points */}
          <View className={twoCol ? 'flex-1 gap-4' : 'gap-4'}>
            {points.map((point) => (
              <View key={point} className="flex-row items-start gap-3">
                <Text style={{ fontSize: 20, marginTop: 1 }}>✅</Text>
                <Text
                  style={{ fontFamily: F.medium }}
                  className="flex-1 text-sm leading-[23px] text-foreground"
                >
                  {point}
                </Text>
              </View>
            ))}
          </View>

          {/* Values chips */}
          <View className={twoCol ? 'flex-1' : undefined}>
            <Text
              style={{ fontFamily: F.bold, letterSpacing: 1.5 }}
              className="mb-3 text-xs uppercase text-muted-foreground"
            >
              {t('aboutPage.coreValuesTitle')}
            </Text>
            <View className="flex-row flex-wrap gap-2.5">
              {values.map((value, i) => {
                const bgColors = ['rgba(225,29,46,0.05)', 'rgba(1,165,240,0.05)', 'rgba(255,204,0,0.1)', 'rgba(34,197,94,0.05)', 'rgba(168,85,247,0.05)'];
                const borderColors = ['rgba(225,29,46,0.3)', 'rgba(1,165,240,0.3)', 'rgba(255,204,0,0.4)', 'rgba(34,197,94,0.3)', 'rgba(168,85,247,0.3)'];
                return (
                  <View
                    key={value}
                    style={{ backgroundColor: bgColors[i % bgColors.length], borderColor: borderColors[i % borderColors.length] }}
                    className="h-11 items-center justify-center rounded-pill border px-5"
                  >
                    <Text style={{ fontFamily: F.semibold }} className="text-sm text-foreground">
                      {value}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
