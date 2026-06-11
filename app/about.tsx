import React, { useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, Image, Pressable, Linking, Platform, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, withDelay, interpolate, Easing,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { CheckCircle, Asterisk, ArrowRight } from 'lucide-react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { useInView } from '@/hooks/useInView';

import { PageHero } from '@/components/landing/PageHero';
import Navbar      from '@/components/landing/Navbar';
import WhyChooseUs from '@/components/landing/WhyChooseUs';
import WorkProcess from '@/components/landing/WorkProcess';
import FAQ         from '@/components/landing/FAQ';
import FinalCTA    from '@/components/landing/FinalCTA';
import Footer      from '@/components/landing/Footer';

import { VerticalCutReveal } from '@/components/animations/VerticalCutReveal';

import {
  COMPANY, MANAGEMENT, SOCIALS, STATS as SAFERIDE_STATS,
} from '@/data/saferide';
import { C, F, IS_WEB, MAX_W, ABOUT_IMG, ABOUT_OPENER_IMG } from '@/components/landing/constants';
import { useTheme } from '@/lib/theme';

// ─── About opener sub-components ─────────────────────────────────────────────

function RotatingAsterisk() {
  const rotation = useSharedValue(0)
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
    )
  }, [])
  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: rotation.value + 'deg' }],
  }))
  return (
    <Animated.View style={style}>
      <Asterisk size={18} color={C.skyDeep} />
    </Animated.View>
  )
}

function ClippedHeroImage({ source }: { source: any }) {
  return (
    <View
      style={[
        {
          width: '100%',
          height: IS_WEB ? 420 : 260,
          overflow: 'hidden',
          borderRadius: IS_WEB ? 0 : 12,
          marginBottom: 16,
        },
        IS_WEB ? ({ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 92% 100%, 0 100%)' } as any) : {},
      ]}
    >
      <Image source={source} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
    </View>
  )
}

function StatItem({ value, label, large }: { value: string; label: string; large?: boolean }) {
  const T = useTheme()
  const { width: winW } = useWindowDimensions()
  const isMobile = !IS_WEB || (IS_WEB && winW < 768)
  return (
    <View style={{ alignItems: 'flex-start' }}>
      <Text style={{ color: C.skyDeep, fontFamily: F.bold, fontSize: large ? (isMobile ? 26 : 36) : 14 }}>
        {value}
      </Text>
      <Text
        style={{
          color: T.mutedForeground,
          fontFamily: F.regular,
          fontSize: 12,
          textTransform: large ? 'uppercase' : 'none',
          letterSpacing: large ? 1 : 0,
        }}
      >
        {label}
      </Text>
    </View>
  )
}

function VertDivider() {
  const T = useTheme()
  return (
    <View style={{ width: 1, height: 14, backgroundColor: T.border, alignSelf: 'center' }} />
  )
}

function FacebookIcon({ size = 16, color = '#221f20' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path fill={color} d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </Svg>
  )
}

function InstagramIcon({ size = 16, color = '#221f20' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke={color} strokeWidth="2" />
      <Circle cx="12" cy="12" r="4" fill="none" stroke={color} strokeWidth="2" />
      <Circle cx="17.5" cy="6.5" r="1.5" fill={color} />
    </Svg>
  )
}

function TwitterIcon({ size = 16, color = '#221f20' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path fill={color} d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </Svg>
  )
}

function TikTokIcon({ size = 16, color = '#221f20' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path fill={color} d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.16a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-1.59z" />
    </Svg>
  )
}

function SocialBadge({ url, icon }: { url: string; icon: React.ReactElement }) {
  const T = useTheme()
  return (
    <Pressable
      onPress={() => Linking.openURL(url)}
      style={{
        width: 28, height: 28, borderRadius: 6,
        borderWidth: 1,
        borderColor: T.border,
        backgroundColor: T.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(34,31,32,0.05)',
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      {icon}
    </Pressable>
  )
}

// ─── About opener section ─────────────────────────────────────────────────────
function AboutOpener() {
  const { t } = useTranslation()
  const T = useTheme()
  const router = useRouter()
  const { width: winW } = useWindowDimensions()
  const isMobile = !IS_WEB || (IS_WEB && winW < 768)
  const iconColor = T.isDark ? C.white : C.dark
  const mutedColor = T.isDark ? 'rgba(255,255,255,0.6)' : 'rgba(34,31,32,0.6)'
  const yearsActive = new Date().getFullYear() - COMPANY.registration.foundedYear

  return (
    <View
      style={{
        backgroundColor: T.background,
        paddingVertical: IS_WEB ? 64 : 48,
        paddingHorizontal: 24,
      }}
    >
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        {/* Top row: label + social badges */}
        <View
          style={{
            flexDirection: 'row', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 24,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <RotatingAsterisk />
            <Text style={{ fontFamily: F.medium, fontSize: 13, color: mutedColor }}>
              {t('aboutPage.whoWeAre')}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <SocialBadge url={SOCIALS.facebook}  icon={<FacebookIcon  size={15} color={iconColor} />} />
            <SocialBadge url={SOCIALS.instagram} icon={<InstagramIcon size={15} color={iconColor} />} />
            <SocialBadge url={SOCIALS.twitter}   icon={<TwitterIcon   size={15} color={iconColor} />} />
            <SocialBadge url={SOCIALS.tiktok}    icon={<TikTokIcon    size={15} color={iconColor} />} />
          </View>
        </View>

        {/* Clipped hero image */}
        <ClippedHeroImage source={ABOUT_OPENER_IMG} />

        {/* Stats line */}
        <View
          style={{
            flexDirection: 'row', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap',
            paddingVertical: 12, gap: 16, marginBottom: 24,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <StatItem value={`${yearsActive}+`} label={t('aboutPage.statYears')} />
            <VertDivider />
            <StatItem value={`${SAFERIDE_STATS.passRate}%`} label={t('aboutPage.statPassRate')} />
          </View>
          <View style={{ flexDirection: IS_WEB ? 'column' : 'row', alignItems: IS_WEB ? 'flex-end' : 'center', gap: 8 }}>
            <StatItem value={`${SAFERIDE_STATS.branches}+`} label={t('aboutPage.statBranches')} large />
            <StatItem value={`${SAFERIDE_STATS.instructors}+`} label={t('aboutPage.statInstructors')} />
          </View>
        </View>

        {/* Main content: headline + paragraphs + CTA */}
        {isMobile ? (
          /* ── Mobile: linear stack — headline → paragraph → enrol button ── */
          <View style={{ gap: 18 }}>
            <VerticalCutReveal
              text={t('aboutPage.headline')}
              splitBy="words"
              staggerDuration={0.1}
              startDelay={0.3}
              style={{
                fontSize: 22,
                fontFamily: F.semibold,
                color: T.foreground,
                lineHeight: 30,
              }}
            />
            <Text
              style={{
                fontFamily: F.regular, fontSize: 14, lineHeight: 24,
                color: mutedColor, textAlign: 'justify',
              }}
            >
              {t('aboutPage.historyP1', { foundedYear: COMPANY.registration.foundedYear })}{' '}
              {t('aboutPage.historyP2', {
                incorporatedYear: COMPANY.registration.incorporatedDate.split(' ').pop(),
                legalName: COMPANY.legalName,
                pvt: COMPANY.registration.pvt,
                branches: SAFERIDE_STATS.branches,
              })}
            </Text>
            <Pressable
              onPress={() => router.push('/courses' as any)}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 8,
                backgroundColor: C.skyDeep, borderRadius: 10,
                paddingHorizontal: 20, paddingVertical: 12,
                alignSelf: 'flex-start',
              }}
            >
              <Text style={{ fontFamily: F.bold, fontSize: 14, color: C.white }}>
                {t('aboutPage.enrolWithUs')}
              </Text>
              <ArrowRight size={16} color={C.white} />
            </Pressable>
          </View>
        ) : (
          /* ── Desktop: two-column layout ── */
          <View style={{ flexDirection: 'row', gap: 48 }}>

            {/* Left: headline + two-column paragraphs */}
            <View style={{ flex: 2 }}>
              <View style={{ marginBottom: 24 }}>
                <VerticalCutReveal
                  text={t('aboutPage.headline')}
                  splitBy="words"
                  staggerDuration={0.1}
                  startDelay={0.3}
                  style={{
                    fontSize: 40,
                    fontFamily: F.semibold,
                    color: T.foreground,
                    lineHeight: 48,
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row', gap: 24 }}>
                <Text
                  style={{
                    flex: 1, fontFamily: F.regular, fontSize: 14, lineHeight: 24,
                    color: mutedColor, textAlign: 'justify',
                  }}
                >
                  {t('aboutPage.historyP1', { foundedYear: COMPANY.registration.foundedYear })}
                </Text>
                <Text
                  style={{
                    flex: 1, fontFamily: F.regular, fontSize: 14, lineHeight: 24,
                    color: mutedColor, textAlign: 'justify',
                  }}
                >
                  {t('aboutPage.historyP2', {
                    incorporatedYear: COMPANY.registration.incorporatedDate.split(' ').pop(),
                    legalName: COMPANY.legalName,
                    pvt: COMPANY.registration.pvt,
                    branches: SAFERIDE_STATS.branches,
                  })}
                </Text>
              </View>
            </View>

            {/* Right: brand wordmark + CTA */}
            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
              <Text style={{ fontFamily: F.bold, fontSize: 22, color: C.skyDeep, marginBottom: 4 }}>
                {t('aboutPage.brandName')}
              </Text>
              <Text style={{ fontFamily: F.regular, fontSize: 12, color: mutedColor, marginBottom: 24 }}>
                {t('aboutPage.ntsaRegisteredSince', { year: COMPANY.registration.foundedYear })}
              </Text>
              <Text
                style={{
                  fontFamily: F.medium, fontSize: 14, color: T.foreground,
                  marginBottom: 14, textAlign: 'right',
                }}
              >
                {t('aboutPage.readyToStart')}
              </Text>
              <Pressable
                onPress={() => router.push('/courses' as any)}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 8,
                  backgroundColor: C.skyDeep, borderRadius: 10,
                  paddingHorizontal: 20, paddingVertical: 12,
                }}
              >
                <Text style={{ fontFamily: F.bold, fontSize: 14, color: C.white }}>
                  {t('aboutPage.enrolWithUs')}
                </Text>
                <ArrowRight size={16} color={C.white} />
              </Pressable>
            </View>

          </View>
        )}
      </View>
    </View>
  )
}

// ─── Company story ────────────────────────────────────────────────────────────
function CompanyStory() {
  const { t } = useTranslation()
  const T = useTheme();
  return (
    <View style={{ backgroundColor: T.background, paddingVertical: 64, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>
        <Text
          style={{
            color: C.blue,
            fontFamily: F.bold,
            fontSize: 11,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          {t('aboutPage.historyOverline')}
        </Text>
        <Text
          style={{
            color: T.foreground,
            fontFamily: F.bold,
            fontSize: IS_WEB ? 30 : 22,
            lineHeight: IS_WEB ? 40 : 32,
            marginBottom: 24,
          }}
        >
          {t('aboutPage.historyTitle')}
        </Text>

        <Text
          style={{
            color: T.mutedForeground,
            fontFamily: F.regular,
            fontSize: 14,
            lineHeight: 26,
            marginBottom: 16,
          }}
        >
          {t('aboutPage.historyP1', { foundedYear: COMPANY.registration.foundedYear })}
        </Text>

        <Text
          style={{
            color: T.mutedForeground,
            fontFamily: F.regular,
            fontSize: 14,
            lineHeight: 26,
            marginBottom: 16,
          }}
        >
          {t('aboutPage.historyP2', {
            incorporatedYear: COMPANY.registration.incorporatedDate.split(' ').pop(),
            legalName: COMPANY.legalName,
            pvt: COMPANY.registration.pvt,
            branches: SAFERIDE_STATS.branches,
          })}
        </Text>

        <Text
          style={{
            color: T.mutedForeground,
            fontFamily: F.regular,
            fontSize: 14,
            lineHeight: 26,
          }}
        >
          {t('aboutPage.historyP3', { bn: COMPANY.registration.bn })}
        </Text>
      </View>
    </View>
  );
}

// ─── What Drives Us card ────────────────────────────────────────────────────
function WhatDrivesUsCard({
  emoji, accent, heading, body, index, inView, width, padding, emojiSize,
}: {
  emoji: string;
  accent: string;
  heading: string;
  body: string;
  index: number;
  inView: boolean;
  width?: string;
  padding: number;
  emojiSize: number;
}) {
  const T = useTheme();
  const badgeSize = emojiSize + 28;

  // Idle float, runs on every viewport, staggered per card
  const float = useSharedValue(0);
  useEffect(() => {
    float.value = withDelay(
      index * 300,
      withRepeat(withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }), -1, true),
    );
  }, []);

  // Hover (web) / press (native) lift + emoji scale, same shared value drives both
  const lift = useSharedValue(0);
  const liftIn  = () => { lift.value = withTiming(1, { duration: 200 }); };
  const liftOut = () => { lift.value = withTiming(0, { duration: 200 }); };

  // Scroll-in reveal, fires once when the section enters view
  const reveal = useSharedValue(0);
  useEffect(() => {
    if (inView) {
      reveal.value = withDelay(index * 150, withTiming(1, { duration: 500 }));
    }
  }, [inView]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [
      { translateY: interpolate(reveal.value, [0, 1], [20, 0]) },
      { translateY: withTiming(lift.value === 1 ? -6 : 0, { duration: 200 }) },
    ],
  }));

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(float.value, [0, 1], [0, -4]) },
      { scale: withTiming(lift.value === 1 ? 1.15 : 1, { duration: 200 }) },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          flex: width ? undefined : 1,
          width: width as any,
          backgroundColor: T.card,
          borderRadius: 20,
          padding,
          borderWidth: 1,
          borderColor: T.border,
        },
        cardStyle,
      ]}
    >
      <Pressable
        onHoverIn={liftIn}
        onHoverOut={liftOut}
        onPressIn={liftIn}
        onPressOut={liftOut}
        style={{ minHeight: 44 }}
      >
        <View
          style={{
            width: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            backgroundColor: accent,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14,
          }}
        >
          <Animated.Text style={[{ fontSize: emojiSize, lineHeight: emojiSize * 1.2 }, emojiStyle]}>
            {emoji}
          </Animated.Text>
        </View>
        <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 16, marginBottom: 10 }}>
          {heading}
        </Text>
        <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 13, lineHeight: 22 }}>
          {body}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Vision · Mission · Values ────────────────────────────────────────────────
function VisionMissionValues() {
  const { t } = useTranslation()
  const T = useTheme();
  const { width: winW } = useWindowDimensions();
  const { ref, inView } = useInView();

  const cols = winW < 640 ? 1 : winW < 1024 ? 2 : 4;
  const gap = cols === 1 ? 12 : cols === 2 ? 16 : 20;
  const padding = cols === 1 ? 16 : 24;
  const emojiSize = cols === 1 ? 40 : cols === 2 ? 48 : 56;
  const cardWidth = cols === 1 ? '100%' : cols === 2 ? (IS_WEB ? 'calc(50% - 8px)' : '48%') : undefined;

  const coreValues = t('aboutPage.coreValuesItems', { returnObjects: true }) as string[];

  const items = [
    {
      id:      'vision',
      emoji:   '👁️',
      accent:  'rgba(1, 165, 240, 0.12)',
      heading: t('aboutPage.visionTitle'),
      body:    t('aboutPage.visionBody'),
    },
    {
      id:      'mission',
      emoji:   '🎯',
      accent:  'rgba(255, 216, 0, 0.12)',
      heading: t('aboutPage.missionTitle'),
      body:    t('aboutPage.missionBody'),
    },
    {
      id:      'values',
      emoji:   '❤️',
      accent:  'rgba(255, 216, 0, 0.12)',
      heading: t('aboutPage.coreValuesTitle'),
      body:    coreValues.join(' · '),
    },
  ];

  return (
    <View
      style={{
        backgroundColor: T.isDark ? C.darkCard : C.white,
        paddingVertical: 64,
        paddingHorizontal: 24,
      }}
    >
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Text
            style={{
              color: T.foreground,
              fontFamily: F.bold,
              fontSize: IS_WEB ? 30 : 22,
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            {t('aboutPage.whatDrivesUs')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue }} />
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
          </View>
        </View>

        <View ref={ref} style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
          {items.map((item, i) => (
            <WhatDrivesUsCard
              key={item.id}
              emoji={item.emoji}
              accent={item.accent}
              heading={item.heading}
              body={item.body}
              index={i}
              inView={inView}
              width={cardWidth}
              padding={padding}
              emojiSize={emojiSize}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Achievements ─────────────────────────────────────────────────────────────
function Achievements() {
  const { t } = useTranslation()
  const T = useTheme();
  const bullets = t('aboutPage.guaranteeItems', { returnObjects: true }) as string[];

  return (
    <View style={{ backgroundColor: T.background, paddingVertical: 56, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>
        <Text
          style={{
            color: C.blue,
            fontFamily: F.bold,
            fontSize: 11,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          {t('aboutPage.guaranteeOverline')}
        </Text>
        <Text
          style={{
            color: T.foreground,
            fontFamily: F.bold,
            fontSize: IS_WEB ? 26 : 20,
            marginBottom: 24,
            lineHeight: IS_WEB ? 36 : 30,
          }}
        >
          {t('aboutPage.guaranteeTitle')}
        </Text>

        <View style={{ gap: 14 }}>
          {bullets.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
              <CheckCircle size={20} color={C.blue} style={{ marginTop: 1 }} />
              <Text style={{ flex: 1, color: T.mutedForeground, fontFamily: F.regular, fontSize: 14, lineHeight: 23 }}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Management ───────────────────────────────────────────────────────────────

const ROLE_EMOJI: Record<string, string> = {
  'Chief Executive Officer': '\u{1F9D1}‍\u{1F4BC}', // office worker
  'General Manager':         '\u{1F454}', // necktie
  'Operations Manager':      '⚙️', // gear
  'Branch Managers':         '\u{1F3E2}', // office building
};

// Maps a role title (data constant, English) to its i18n key segment under aboutPage.roles
const ROLE_KEY_MAP: Record<string, string> = {
  'Chief Executive Officer': 'ceo',
  'General Manager':         'gm',
  'Operations Manager':      'ops',
  'Branch Managers':         'branchManagers',
};

function RoleAvatar({ title, cols }: { title: string; cols: number }) {
  const emoji = ROLE_EMOJI[title] ?? '\u{1F9D1}‍\u{1F4BC}';
  const size = cols === 1 ? 36 : cols === 2 ? 32 : 28;

  return (
    <View
      style={{
        width: '26%',
        aspectRatio: 1,
        borderRadius: 999,
        backgroundColor: 'rgba(1,165,240,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Text style={{ fontSize: size, lineHeight: size * 1.2 }}>{emoji}</Text>
    </View>
  );
}

function Management() {
  const { t } = useTranslation()
  const T = useTheme();
  const { width: winW } = useWindowDimensions();
  const cols = winW < 640 ? 1 : winW < 1024 ? 2 : 4;
  const cardWidth = cols === 1 ? '100%' : cols === 2 ? (IS_WEB ? 'calc(50% - 8px)' : '48%') : (IS_WEB ? 'calc(25% - 12px)' : '48%');

  return (
    <View
      style={{
        backgroundColor: T.isDark ? C.darkCard : C.white,
        paddingVertical: 64,
        paddingHorizontal: 24,
      }}
    >
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Text
            style={{
              color: C.blue,
              fontFamily: F.bold,
              fontSize: 11,
              letterSpacing: 2.5,
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            {t('aboutPage.leadershipOverline')}
          </Text>
          <Text
            style={{
              color: T.foreground,
              fontFamily: F.bold,
              fontSize: IS_WEB ? 30 : 22,
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            {t('aboutPage.managementTitle')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue }} />
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: cols === 1 ? 12 : 16 }}>
          {MANAGEMENT.map((role) => (
            <View
              key={role.title}
              style={{
                width: cardWidth as any,
                backgroundColor: T.card,
                borderRadius: 16,
                padding: cols === 1 ? 16 : 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                borderWidth: 1,
                borderColor: T.border,
              }}
            >
              <RoleAvatar title={role.title} cols={cols} />
              <Text style={{ flex: 1, color: T.foreground, fontFamily: F.bold, fontSize: cols === 1 ? 14 : 15, lineHeight: cols === 1 ? 20 : 22 }}>
                {t(`aboutPage.roles.${ROLE_KEY_MAP[role.title]}`)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const { t } = useTranslation()
  const T = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.background }}>
      <Navbar />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
      >
        <PageHero overline={t('aboutPage.pageOverline')} title={t('aboutPage.pageTitle')} />
        <AboutOpener />
        <CompanyStory />
        <VisionMissionValues />
        <WhyChooseUs />
        <Achievements />
        <Management />
        <WorkProcess />
        <FAQ />
        <FinalCTA />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
