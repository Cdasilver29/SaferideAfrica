import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, WHY_FEATURES, STATS } from './constants';
import { cn } from '@/components/ui';
import { CountUp } from '@/components/CountUp';
import { useInView } from '@/hooks/useInView';

const WHY_KEY_MAP: Record<string, string> = {
  ShieldCheck: 'realDrivers',
  BookOpen: 'ntsaCurriculum',
  CreditCard: 'smartDl',
  Award: 'bestTrainers',
  Clock: 'perfectTiming',
};

const STAT_KEY_MAP: Record<string, string> = {
  'Total Learners': 'totalLearners',
  'Current Students': 'currentStudents',
  'Expert Instructors': 'expertInstructors',
};

function StatCounter({ target, suffix, label, inView }: { target: number; suffix: string; label: string; inView: boolean }) {
  const { width: winW } = useWindowDimensions();
  const numberFontSize = winW < 480 ? 28 : winW < 768 ? 36 : 44;
  const labelFontSize = winW < 640 ? 12 : 14;

  return (
    <View className="flex-1 items-center">
      <CountUp value={target} suffix={suffix} durationMs={1800} active={inView} style={{ color: C.yellow, fontFamily: F.bold, fontSize: numberFontSize }} />
      <Text style={{ fontFamily: F.regular, fontSize: labelFontSize }} className="mt-1 text-center text-white/70">
        {label}
      </Text>
    </View>
  );
}

export default function WhyChooseUs() {
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const { ref: statsRef, inView: statsInView } = useInView();
  // Responsive columns: 1 <480, 2 <768, 3 <1024, 5 at 1024+
  const cardW: any = !IS_WEB ? undefined
    : winW < 480 ? '100%'
    : winW < 768 ? 'calc(50% - 9px)'
    : winW < 1024 ? 'calc(33.33% - 12px)'
    : 'calc(20% - 18px)';

  return (
    <View className="bg-primary px-6 py-[72px] dark:bg-background">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        {/* Heading */}
        <View className="mb-12 items-center">
          <Text style={{ fontFamily: F.bold, letterSpacing: 2.5 }} className="mb-2.5 text-xs uppercase text-accent">
            {t('whyChooseUs.overline')}
          </Text>
          <Text style={{ fontFamily: F.bold }} className="mb-3 text-center text-2xl leading-8 text-white web:text-[34px] web:leading-[44px]">
            {t('whyChooseUs.heading')}
          </Text>
          <View className="flex-row items-center gap-2">
            <View className="h-0.5 w-10 rounded-pill bg-accent/45" />
            <View className="h-2 w-2 rounded-pill bg-accent" />
            <View className="h-0.5 w-10 rounded-pill bg-accent/45" />
          </View>
        </View>

        {/* Feature cards */}
        <View className={cn('mb-11', IS_WEB ? 'flex-row flex-wrap gap-[18px]' : 'gap-3.5')}>
          {WHY_FEATURES.map((feat) => {
            const tKey = WHY_KEY_MAP[feat.iconName] ?? feat.iconName;
            return (
              <View
                key={feat.title}
                style={IS_WEB ? { width: cardW } : undefined}
                className="items-center rounded-card border border-white/15 bg-white/10 p-5"
              >
                <Text style={{ fontFamily: F.bold }} className="mb-2 text-center text-sm text-white">
                  {t(`whyChooseUs.items.${tKey}.title`)}
                </Text>
                <Text style={{ fontFamily: F.regular }} className="text-center text-xs leading-[18px] text-white/70">
                  {t(`whyChooseUs.items.${tKey}.desc`)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Divider */}
        <View className="mb-11 h-px bg-white/20" />

        {/* Stats */}
        <View ref={statsRef} className="flex-row justify-around gap-2">
          {STATS.map((s) => {
            const statKey = STAT_KEY_MAP[s.label] ?? s.label;
            return (
              <StatCounter key={s.label} target={s.value} suffix={s.suffix} label={t(`whyChooseUs.stats.${statKey}`)} inView={statsInView} />
            );
          })}
        </View>
      </View>
    </View>
  );
}
