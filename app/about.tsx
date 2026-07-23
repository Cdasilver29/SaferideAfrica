import React from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable, Linking, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import {
  CheckCircle, Asterisk, ArrowRight, Eye, Target, Heart,
  ShieldCheck, MapPin, BadgeCheck, BookOpen,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { FacebookIcon, InstagramIcon, TwitterXIcon as TwitterIcon, TikTokIcon } from '@/components/SocialIcons';
import { useTranslation } from 'react-i18next';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';

import { PageHero } from '@/components/landing/PageHero';
import WhyChooseUs from '@/components/landing/WhyChooseUs';
import WorkProcess from '@/components/landing/WorkProcess';
import FAQ from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

import { COMPANY, SOCIALS, STATS as SAFERIDE_STATS } from '@/data/saferide';
import { C, F, IS_WEB, MAX_W, ABOUT_OPENER_IMG } from '@/components/landing/constants';
import { Button, Card, Icon, cn } from '@/components/ui';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { PageHead } from '@/components/PageHead';
import { useTheme } from '@/lib/theme';
import { Reveal } from '@/components/animations/Reveal';

function SocialBadge({ url, icon }: { url: string; icon: React.ReactElement }) {
  return (
    <Pressable
      onPress={() => Linking.openURL(url)}
      accessibilityRole="link"
      className="h-11 w-11 items-center justify-center rounded-button border border-border bg-muted active:opacity-70"
    >
      {icon}
    </Pressable>
  );
}

function StatItem({ value, label, large }: { value: string; label: string; large?: boolean }) {
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || (IS_WEB && winW < 768);
  return (
    <View className="items-start">
      <Text style={{ color: C.skyDeep, fontFamily: F.bold, fontSize: large ? (isMobile ? 26 : 36) : 14 }}>{value}</Text>
      <Text
        style={{ fontFamily: F.regular, letterSpacing: large ? 1 : 0 }}
        className={cn('text-xs text-muted-foreground', large && 'uppercase')}
      >
        {label}
      </Text>
    </View>
  );
}

// ─── About opener ────────────────────────────────────────────────────────────────
function AboutOpener() {
  const { t } = useTranslation();
  const Th = useTheme();
  const router = useRouter();
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || (IS_WEB && winW < 768);
  const yearsActive = new Date().getFullYear() - COMPANY.registration.foundedYear;

  const paragraphs = (
    <Text>
      {t('aboutPage.historyP1', { foundedYear: COMPANY.registration.foundedYear })}{' '}
      {t('aboutPage.historyP2', {
        incorporatedYear: COMPANY.registration.incorporatedDate.split(' ').pop(),
        legalName: COMPANY.legalName,
        pvt: COMPANY.registration.pvt,
      })}
    </Text>
  );

  return (
    <View className="bg-background px-6 py-12 web:py-16">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        {/* Label + social badges */}
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Icon icon={Asterisk} size="sm" color={C.skyDeep} />
            <Text style={{ fontFamily: F.medium }} className="text-sm text-muted-foreground">{t('aboutPage.whoWeAre')}</Text>
          </View>
          <View className="flex-row gap-2">
            <SocialBadge url={SOCIALS.facebook} icon={<FacebookIcon color={Th.foreground} />} />
            <SocialBadge url={SOCIALS.instagram} icon={<InstagramIcon color={Th.foreground} />} />
            <SocialBadge url={SOCIALS.twitter} icon={<TwitterIcon color={Th.foreground} />} />
            <SocialBadge url={SOCIALS.tiktok} icon={<TikTokIcon color={Th.foreground} />} />
          </View>
        </View>

        {/* Clipped hero image */}
        <View
          style={[{ width: '100%', height: IS_WEB ? 420 : 260, overflow: 'hidden', marginBottom: 16 }, IS_WEB ? ({ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 92% 100%, 0 100%)' } as any) : { borderRadius: 12 }]}
        >
          <ResponsiveImage source={ABOUT_OPENER_IMG} alt={t('aboutPage.pageTitle')} sizes="(max-width: 768px) 100vw, 720px" fill />
        </View>

        {/* Stats line */}
        <View className="mb-6 flex-row flex-wrap items-center justify-between gap-4 py-3">
          <View className="flex-row items-center gap-3">
            <StatItem value={`${yearsActive}+`} label={t('aboutPage.statYears')} />
            <View className="h-3.5 w-px self-center bg-border" />
            <StatItem value={`${SAFERIDE_STATS.passRate}%`} label={t('aboutPage.statPassRate')} />
          </View>
          <View className={cn('gap-2', IS_WEB ? 'items-end' : 'flex-row items-center')}>
            <StatItem value={`${SAFERIDE_STATS.instructors}+`} label={t('aboutPage.statInstructors')} large />
          </View>
        </View>

        {/* Headline + paragraphs + CTA */}
        {isMobile ? (
          <View className="gap-4">
            <Text style={{ fontFamily: F.semibold }} className="text-2xl leading-8 text-foreground">{t('aboutPage.headline')}</Text>
            <Text style={{ fontFamily: F.regular, textAlign: 'justify' }} className="text-sm leading-6 text-muted-foreground">
              {paragraphs}
            </Text>
            <Button variant="primary" className="self-start" onPress={() => router.push('/courses' as any)}>
              <Text style={{ fontFamily: F.bold }} className="text-base text-primary-foreground">{t('aboutPage.enrolWithUs')}</Text>
              <Icon icon={ArrowRight} size="md" color={C.white} />
            </Button>
          </View>
        ) : (
          <View className="flex-row gap-12">
            <View className="flex-[2]">
              <Text style={{ fontFamily: F.semibold }} className="mb-6 text-[40px] leading-[48px] text-foreground">{t('aboutPage.headline')}</Text>
              <View className="flex-row gap-6">
                <Text style={{ fontFamily: F.regular, textAlign: 'justify' }} className="flex-1 text-sm leading-6 text-muted-foreground">
                  {t('aboutPage.historyP1', { foundedYear: COMPANY.registration.foundedYear })}
                </Text>
                <Text style={{ fontFamily: F.regular, textAlign: 'justify' }} className="flex-1 text-sm leading-6 text-muted-foreground">
                  {t('aboutPage.historyP2', {
                    incorporatedYear: COMPANY.registration.incorporatedDate.split(' ').pop(),
                    legalName: COMPANY.legalName,
                    pvt: COMPANY.registration.pvt,
                  })}
                </Text>
              </View>
            </View>
            <View className="flex-1 items-end justify-center">
              <Text style={{ fontFamily: F.bold }} className="mb-1 text-2xl text-primary">{t('aboutPage.brandName')}</Text>
              <Text style={{ fontFamily: F.regular }} className="mb-6 text-xs text-muted-foreground">
                {t('aboutPage.ntsaRegisteredSince', { year: COMPANY.registration.foundedYear })}
              </Text>
              <Text style={{ fontFamily: F.medium, textAlign: 'right' }} className="mb-3.5 text-sm text-foreground">{t('aboutPage.readyToStart')}</Text>
              <Button variant="primary" onPress={() => router.push('/courses' as any)}>
                <Text style={{ fontFamily: F.bold }} className="text-base text-primary-foreground">{t('aboutPage.enrolWithUs')}</Text>
                <Icon icon={ArrowRight} size="md" color={C.white} />
              </Button>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Section heading with divider ────────────────────────────────────────────────
function SectionHeading({ overline, title, centered }: { overline?: string; title: string; centered?: boolean }) {
  return (
    <View className={cn('mb-6', centered && 'items-center')}>
      {overline ? (
        <Text style={{ fontFamily: F.bold, letterSpacing: 2.5 }} className="mb-3 text-xs uppercase text-primary">{overline}</Text>
      ) : null}
      <Text
        style={{ fontFamily: F.bold }}
        className={cn('text-2xl leading-8 text-foreground web:text-[30px] web:leading-[40px]', centered && 'text-center')}
      >
        {title}
      </Text>
      {centered ? (
        <View className="mt-3 flex-row items-center gap-2">
          <View className="h-0.5 w-10 rounded-pill bg-accent" />
          <View className="h-2 w-2 rounded-pill bg-primary" />
          <View className="h-0.5 w-10 rounded-pill bg-accent" />
        </View>
      ) : null}
    </View>
  );
}

// ─── Company story ────────────────────────────────────────────────────────────────
function CompanyStory() {
  const { t } = useTranslation();
  return (
    <View className="bg-background px-6 py-16">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        <SectionHeading overline={t('aboutPage.historyOverline')} title={t('aboutPage.historyTitle')} />
        <Text style={{ fontFamily: F.regular }} className="mb-4 text-sm leading-[26px] text-muted-foreground">
          {t('aboutPage.historyP1', { foundedYear: COMPANY.registration.foundedYear })}
        </Text>
        <Text style={{ fontFamily: F.regular }} className="mb-4 text-sm leading-[26px] text-muted-foreground">
          {t('aboutPage.historyP2', {
            incorporatedYear: COMPANY.registration.incorporatedDate.split(' ').pop(),
            legalName: COMPANY.legalName,
            pvt: COMPANY.registration.pvt,
          })}
        </Text>
        <Text style={{ fontFamily: F.regular }} className="text-sm leading-[26px] text-muted-foreground">
          {t('aboutPage.historyP3', { bn: COMPANY.registration.bn })}
        </Text>
      </View>
    </View>
  );
}

// ─── Vision · Mission · Values ─────────────────────────────────────────────────────
function VisionMissionValues() {
  const { t } = useTranslation();
  const Th = useTheme();
  const { width: winW } = useWindowDimensions();
  const stacked = winW < 640;
  const coreValues = t('aboutPage.coreValuesItems', { returnObjects: true }) as string[];
  const valueDescs = t('aboutPage.coreValuesDescs', { returnObjects: true }) as string[];

  const items: { id: string; icon: LucideIcon; tint: string; color: string; heading: string; body: string }[] = [
    { id: 'vision', icon: Eye, tint: 'bg-primary/10', color: C.skyDeep, heading: t('aboutPage.visionTitle'), body: t('aboutPage.visionBody') },
    { id: 'mission', icon: Target, tint: 'bg-accent/15', color: Th.foreground, heading: t('aboutPage.missionTitle'), body: t('aboutPage.missionBody') },
  ];

  // Values grid: 1 col on phones, 2 on tablets, 5 across on desktop.
  const valueWidth: any = winW < 640 ? '100%' : winW < 1024 ? (IS_WEB ? 'calc(50% - 8px)' : '48%') : (IS_WEB ? 'calc(20% - 13px)' : '48%');

  return (
    <View className="bg-background px-6 py-16">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        <SectionHeading title={t('aboutPage.whatDrivesUs')} centered />
        <View className="flex-row flex-wrap gap-4">
          {items.map((item, i) => {
            const scale = useSharedValue(1);
            React.useEffect(() => {
              scale.value = withRepeat(
                withSequence(
                  withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                  withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
                ),
                -1, true
              );
            }, []);
            const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
            
            return (
              <Animated.View key={item.id} style={[stacked ? { width: '100%' } : { flex: 1 }, animStyle]}>
                <Card className="p-6 h-full">
                  <View className={cn('mb-3.5 h-12 w-12 items-center justify-center rounded-pill', item.tint)}>
                    <Icon icon={item.icon} size="md" color={item.color} />
                  </View>
                  <Text style={{ fontFamily: F.bold }} className="mb-2.5 text-base text-foreground">{item.heading}</Text>
                  <Text style={{ fontFamily: F.regular }} className="text-sm leading-[22px] text-muted-foreground">{item.body}</Text>
                </Card>
              </Animated.View>
            );
          })}
        </View>

        {/* Phase E: each value carries what it means in practice */}
        <View className="mt-10">
          <View className="mb-4 flex-row items-center justify-center gap-2">
            <Icon icon={Heart} size="sm" color={C.skyDeep} />
            <Text style={{ fontFamily: F.bold }} className="text-base text-foreground">
              {t('aboutPage.coreValuesTitle')}
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-4">
            {coreValues.map((value, i) => {
              const bgColors = ['rgba(225,29,46,0.05)', 'rgba(1,165,240,0.05)', 'rgba(255,204,0,0.1)', 'rgba(34,197,94,0.05)', 'rgba(168,85,247,0.05)'];
              const borderColors = ['rgba(225,29,46,0.3)', 'rgba(1,165,240,0.3)', 'rgba(255,204,0,0.4)', 'rgba(34,197,94,0.3)', 'rgba(168,85,247,0.3)'];
              
              const opacity = useSharedValue(1);
              React.useEffect(() => {
                opacity.value = withRepeat(
                  withSequence(
                    withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
                  ),
                  -1, true
                );
              }, []);
              const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

              return (
                <Animated.View key={value} style={[{ width: valueWidth }, animStyle]}>
                  <Card style={{ backgroundColor: bgColors[i % bgColors.length], borderColor: borderColors[i % borderColors.length] }} className="p-5 h-full">
                    <Text style={{ fontFamily: F.bold }} className="mb-1.5 text-sm text-foreground">{value}</Text>
                    <Text style={{ fontFamily: F.regular }} className="text-xs leading-[18px] text-muted-foreground">
                      {valueDescs[i] ?? ''}
                    </Text>
                  </Card>
                </Animated.View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Achievements ──────────────────────────────────────────────────────────────────
function Achievements() {
  const { t } = useTranslation();
  const bullets = t('aboutPage.guaranteeItems', { returnObjects: true }) as string[];
  return (
    <View className="bg-background px-6 py-14">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        <SectionHeading overline={t('aboutPage.guaranteeOverline')} title={t('aboutPage.guaranteeTitle')} />
        <View className="gap-3.5">
          {bullets.map((item, i) => (
            <View key={i} className="flex-row items-start gap-3">
              <View className="mt-0.5"><Icon icon={CheckCircle} size="md" color={C.skyDeep} /></View>
              <Text style={{ fontFamily: F.regular }} className="flex-1 text-sm leading-[23px] text-muted-foreground">{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Trust and accreditation ─────────────────────────────────────────────────────
// Only owner-confirmed claims. The owner publishes no years-operating figure;
// do not add one.
const TRUST_ITEMS: { icon: LucideIcon; key: string }[] = [
  { icon: ShieldCheck, key: 'ntsaRegistered' },
  { icon: MapPin,      key: 'branches' },
  { icon: BadgeCheck,  key: 'instructors' },
  { icon: BookOpen,    key: 'curriculum' },
];

function TrustBlock() {
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const cols = winW < 640 ? 1 : winW < 1024 ? 2 : 3;
  const cardWidth: any = cols === 1 ? '100%' : cols === 2 ? (IS_WEB ? 'calc(50% - 8px)' : '48%') : (IS_WEB ? 'calc(33.333% - 11px)' : '48%');

  return (
    <View className="bg-background px-6 py-16">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        <SectionHeading overline={t('aboutPage.trust.overline')} title={t('aboutPage.trust.title')} centered />
        <View className="flex-row flex-wrap gap-4">
          {TRUST_ITEMS.map(({ icon, key }) => {
            const opacity = useSharedValue(1);
            React.useEffect(() => {
              opacity.value = withRepeat(
                withSequence(
                  withTiming(0.7, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                  withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
                ),
                -1, true
              );
            }, []);
            const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

            return (
              <Animated.View key={key} style={[{ width: cardWidth }, animStyle]}>
                <Card className="flex-row items-center gap-3.5 p-4 h-full">
                  <View className="h-12 w-12 items-center justify-center rounded-pill bg-primary/10">
                    <Icon icon={icon} size="md" color={C.skyDeep} />
                  </View>
                  <Text style={{ fontFamily: F.bold }} className="flex-1 text-sm leading-5 text-foreground">
                    {t(`aboutPage.trust.items.${key}`)}
                  </Text>
                </Card>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function AboutPage() {
  const { t } = useTranslation();
  const Th = useTheme();
  return (
    // Inline flex/background: NativeWind's flex-1 class is not applied to
    // SafeAreaView on web, which collapsed the layout and stopped the page from
    // scrolling. Every other page sets this inline, matching them here.
    <SafeAreaView style={{ flex: 1, backgroundColor: Th.background }}>
      <PageHead
        title="About Safe Ride Africa: Our Story and Team"
        description="How Safe Ride Africa became one of Nairobi's most trusted NTSA-certified driving schools, our mission, values, and the team behind the wheel."
        path="/about"
      />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <PageHero overline={t('aboutPage.pageOverline')} title={t('aboutPage.pageTitle')} />
        {/* Phase H: one-shot fade-and-rise on each section as it enters view */}
        <Reveal><AboutOpener /></Reveal>
        <Reveal><CompanyStory /></Reveal>
        <Reveal><VisionMissionValues /></Reveal>
        <Reveal><WhyChooseUs /></Reveal>
        <Reveal><Achievements /></Reveal>
        <Reveal><TrustBlock /></Reveal>
        <Reveal><WorkProcess /></Reveal>
        <Reveal><FAQ /></Reveal>
        <Reveal><FinalCTA /></Reveal>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
