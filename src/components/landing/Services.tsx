import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { SERVICES, ServiceItem } from '@/data/saferide';
import { Card, Icon, cn } from '@/components/ui';
import { C, F, IS_WEB, MAX_W } from './constants';

// Maps a service code to its i18n key segment under servicesPage.items
export const SERVICE_KEY_MAP: Record<string, string> = {
  DEFENSIVE: 'defensive',
  SMART_DL: 'smartDl',
  EXECUTIVE: 'executive',
  LADIES: 'ladies',
  EXPRESSWAY: 'expressway',
  BEGINNER: 'beginner',
  ADVANCED: 'advanced',
  ROAD_TEST: 'roadTest',
  CORPORATE: 'corporate',
  ONLINE: 'online',
};

function ServiceCard({ svc, readMore }: { svc: ServiceItem; readMore: string }) {
  const { t } = useTranslation();
  const key = SERVICE_KEY_MAP[svc.code];
  return (
    <Pressable className="flex-1" onPress={() => router.push(`/services/${svc.code}` as any)} accessibilityRole="link">
      <Card className="h-full items-center active:bg-foreground/5">
        <View className="mb-2.5 h-[3px] w-6 rounded-pill bg-accent" />
        <Text style={{ fontFamily: F.bold }} className="mb-1.5 text-center text-sm leading-5 text-foreground">
          {t(`servicesPage.items.${key}.name`)}
        </Text>
        <Text style={{ fontFamily: F.regular }} className="mb-3 flex-1 text-center text-xs leading-[18px] text-muted-foreground">
          {t(`servicesPage.items.${key}.shortDesc`)}
        </Text>
        <View className="flex-row items-center gap-1">
          <Text style={{ fontFamily: F.semibold }} className="text-xs text-primary">{readMore}</Text>
          <Icon icon={ChevronRight} size="xs" color={C.skyDeep} />
        </View>
      </Card>
    </Pressable>
  );
}

export default function Services() {
  const { t } = useTranslation();
  const readMore = t('services.readMore');

  const rows: ServiceItem[][] = [];
  for (let i = 0; i < SERVICES.length; i += 2) {
    rows.push(SERVICES.slice(i, i + 2));
  }

  return (
    <View className="bg-background px-6 py-[72px]">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        <View className="mb-11 items-center">
          <Text style={{ fontFamily: F.bold, letterSpacing: 2.5 }} className="mb-2.5 text-xs uppercase text-primary">
            {t('services.overline')}
          </Text>
          <Text style={{ fontFamily: F.bold }} className="mb-3 text-center text-2xl leading-8 text-foreground web:text-[34px] web:leading-[44px]">
            {t('services.heading')}
          </Text>
          <View className="flex-row items-center gap-2">
            <View className="h-0.5 w-10 rounded-pill bg-accent" />
            <View className="h-2 w-2 rounded-pill bg-primary" />
            <View className="h-0.5 w-10 rounded-pill bg-accent" />
          </View>
        </View>

        {IS_WEB ? (
          rows.map((pair, rowIdx) => (
            <View key={rowIdx} className="mb-3.5 flex-row gap-3.5">
              {pair.map((svc) => (
                <ServiceCard key={svc.code} svc={svc} readMore={readMore} />
              ))}
              {pair.length === 1 && <View className="flex-1" />}
            </View>
          ))
        ) : (
          <View className="gap-3.5">
            {SERVICES.map((svc) => (
              <ServiceCard key={svc.code} svc={svc} readMore={readMore} />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
