import React from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react-native';
import { C, F, IS_WEB, MAX_W, SERVICES_IMG } from './constants';
import { Button, Card, Icon } from '@/components/ui';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { SectionIntro } from './SectionIntro';

// Services photo: capped ~400px column on wide desktop, full width otherwise.
const SERVICES_SIZES = '(max-width: 860px) 100vw, 400px';

const PREVIEW_SERVICES = [
  { code: 'DEFENSIVE', i18nKey: 'defensive' },
  { code: 'EXECUTIVE', i18nKey: 'executive' },
  { code: 'LADIES', i18nKey: 'ladies' },
  { code: 'BEGINNER', i18nKey: 'beginner' },
];

function ServiceCard({ svc }: { svc: (typeof PREVIEW_SERVICES)[0] }) {
  const { t } = useTranslation();
  return (
    <Pressable className="flex-1" onPress={() => router.push(`/services/${svc.code}` as any)} accessibilityRole="link">
      <Card className="h-full items-center active:bg-foreground/5">
        <View className="mb-2.5 h-[3px] w-6 rounded-pill bg-accent" />
        <Text style={{ fontFamily: F.bold }} className="mb-2 text-center text-sm leading-5 text-foreground">
          {t(`home.servicesPreview.items.${svc.i18nKey}.name`)}
        </Text>
        <Text style={{ fontFamily: F.regular }} className="flex-1 text-center text-xs leading-[18px] text-muted-foreground">
          {t(`home.servicesPreview.items.${svc.i18nKey}.desc`)}
        </Text>
      </Card>
    </Pressable>
  );
}

function SeeAllButton({ align = 'center' }: { align?: 'start' | 'center' }) {
  const { t } = useTranslation();
  return (
    <View className={align === 'start' ? 'items-start' : 'items-center'}>
      <Button variant="primary" onPress={() => router.push('/services')}>
        <Text style={{ fontFamily: F.semibold }} className="text-base text-primary-foreground">{t('common.seeAllServices')}</Text>
        <Icon icon={ArrowRight} size="sm" color={C.white} />
      </Button>
    </View>
  );
}

export default function ServicesPreview() {
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const sideLayout = IS_WEB && winW >= 860;
  const photoW = sideLayout ? Math.min(400, winW * 0.35) : undefined;

  return (
    <View className="bg-background px-6 py-16">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        {sideLayout ? (
          <View className="flex-row items-stretch gap-12">
            {/* Photo + CTA */}
            <View style={{ width: photoW }} className="shrink-0">
              <View className="min-h-[420px] flex-1 overflow-hidden rounded-card-lg bg-primary/5">
                <ResponsiveImage source={SERVICES_IMG} alt={t('home.servicesPreview.title')} sizes={SERVICES_SIZES} fill />
              </View>
              <View className="mb-5 mt-4 h-1 w-16 rounded-pill bg-accent" />
              <SeeAllButton align="start" />
            </View>

            {/* Heading + cards */}
            <View className="flex-1">
              <SectionIntro badge={t('home.servicesPreview.badge')} title={t('home.servicesPreview.title')} />
              <View className="flex-row flex-wrap gap-4">
                {PREVIEW_SERVICES.map((svc) => (
                  <View key={svc.code} className="min-w-[200px] flex-1">
                    <ServiceCard svc={svc} />
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <>
            <View
              className="overflow-hidden rounded-card"
              style={{ width: '100%', height: IS_WEB ? Math.min(320, winW * 0.45) : 260, marginBottom: 28 }}
            >
              <ResponsiveImage source={SERVICES_IMG} alt={t('home.servicesPreview.title')} sizes="100vw" fill />
            </View>
            <SectionIntro badge={t('home.servicesPreview.badge')} title={t('home.servicesPreview.title')} />
            <View className="mb-9 gap-3.5">
              {PREVIEW_SERVICES.map((svc) => (
                <ServiceCard key={svc.code} svc={svc} />
              ))}
            </View>
            <SeeAllButton />
          </>
        )}
      </View>
    </View>
  );
}
