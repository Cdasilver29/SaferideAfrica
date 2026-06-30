import React, { useState } from 'react';
import {
  View, Text, Pressable, ScrollView, LayoutAnimation, Platform, UIManager,
} from 'react-native';
import { router } from 'expo-router';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { CLASS_SERIES, REFRESHER_LESSONS, SeriesCode, DriveClass, CLASSES } from '@/data/saferide';
import { useEnrollModal } from '@/context/EnrollModalContext';
import { Button, Card, Icon, cn } from '@/components/ui';
import { C, F, IS_WEB, MAX_W } from './constants';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Class row with expandable actions ──────────────────────────────────────────
function ClassRow({ cls }: { cls: DriveClass }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  const { open } = useEnrollModal();

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  return (
    <Card className="mb-2.5 overflow-hidden p-0">
      <Pressable onPress={toggle} className="flex-row items-center gap-3 px-4 py-3.5 active:bg-foreground/5">
        <Text style={{ fontFamily: F.semibold }} className="flex-1 text-sm leading-5 text-foreground">
          {cls.name}
        </Text>
        <Icon icon={expanded ? ChevronUp : ChevronDown} size="sm" color={C.muted} />
      </Pressable>

      {expanded && (
        <View className="border-t border-border px-5 pb-4 pt-1">
          <View className={cn('gap-2', IS_WEB && 'flex-row')}>
            <Button variant="outline" size="sm" className="flex-1" onPress={() => router.push(`/classes/${cls.code}` as any)}>
              <Text style={{ fontFamily: F.semibold }} className="text-sm text-foreground">{t('courses.readMore') || 'Details'}</Text>
            </Button>
            <Button variant="accent" size="sm" className="flex-1" onPress={() => open(cls.code)}>
              <Text style={{ fontFamily: F.bold }} className="text-sm text-accent-foreground">{t('courses.enrolNow')}</Text>
            </Button>
          </View>
        </View>
      )}
    </Card>
  );
}

// ─── Series tab bar (white-based, reads on the coloured/dark section) ────────────
function SeriesTabs({ active, onChange }: { active: SeriesCode; onChange: (c: SeriesCode) => void }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexDirection: 'row', gap: 8, paddingHorizontal: IS_WEB ? 0 : 4, paddingBottom: 4 }}
      className="mb-5"
    >
      {CLASS_SERIES.map((s) => {
        const isActive = s.code === active;
        return (
          <Pressable
            key={s.code}
            onPress={() => onChange(s.code)}
            className={cn(
              'h-11 items-center justify-center rounded-pill px-4',
              isActive ? 'bg-white' : 'border border-white/20 bg-white/10',
            )}
          >
            <Text
              style={{ fontFamily: isActive ? F.bold : F.medium }}
              className={cn('text-sm', isActive ? 'text-primary' : 'text-white')}
            >
              {s.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// ─── Refresher section ───────────────────────────────────────────────────────────
function RefresherSection() {
  const { t } = useTranslation();
  return (
    <View className="mt-9">
      <Text style={{ fontFamily: F.bold, letterSpacing: 2 }} className="mb-3 text-xs uppercase text-accent">
        {t('courses.refresherTitle')}
      </Text>
      <View className={cn('gap-3', IS_WEB && 'flex-row')}>
        {REFRESHER_LESSONS.map((r) => (
          <Card key={r.code} className={cn('px-4 py-5', IS_WEB && 'flex-1')}>
            <Text style={{ fontFamily: F.semibold }} className="mb-1.5 text-sm text-foreground">{r.name}</Text>
            <Text style={{ fontFamily: F.regular }} className="text-xs text-muted-foreground">
              {t('courses.minLessons', { count: r.minLessons })}
            </Text>
          </Card>
        ))}
      </View>
    </View>
  );
}

export default function Courses() {
  const { t } = useTranslation();
  const [activeSeries, setActiveSeries] = useState<SeriesCode>('B');

  const seriesClasses = CLASSES.filter((c) => c.series === activeSeries);
  const activeMeta = CLASS_SERIES.find((s) => s.code === activeSeries)!;

  return (
    <View className="bg-primary px-6 py-[72px] dark:bg-background">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        {/* Header */}
        <View className="mb-9 items-center">
          <Text style={{ fontFamily: F.bold, letterSpacing: 2.5 }} className="mb-2.5 text-xs uppercase text-accent">
            {t('courses.overline')}
          </Text>
          <Text
            style={{ fontFamily: F.bold }}
            className="mb-3 text-center text-2xl leading-8 text-white web:text-[34px] web:leading-[44px]"
          >
            {t('courses.heading')}
          </Text>
          <View className="flex-row items-center gap-2">
            <View className="h-0.5 w-10 rounded-pill bg-accent/50" />
            <View className="h-2 w-2 rounded-pill bg-accent" />
            <View className="h-0.5 w-10 rounded-pill bg-accent/50" />
          </View>
        </View>

        <SeriesTabs active={activeSeries} onChange={setActiveSeries} />

        {/* Series subtitle */}
        <View className="mb-4">
          <Text style={{ fontFamily: F.bold }} className="text-lg text-white">{activeMeta.label}</Text>
          <Text style={{ fontFamily: F.regular }} className="mt-0.5 text-sm text-white/60">{activeMeta.subtitle}</Text>
        </View>

        {seriesClasses.map((cls) => (
          <ClassRow key={cls.code} cls={cls} />
        ))}

        <RefresherSection />
      </View>
    </View>
  );
}
