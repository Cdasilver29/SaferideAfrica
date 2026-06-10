import React, { useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, Image, Pressable, Linking, Platform, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, Easing,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Eye, Target, Heart, CheckCircle, Asterisk, ArrowRight } from 'lucide-react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

import { PageHero } from '@/components/landing/PageHero';
import Navbar      from '@/components/landing/Navbar';
import WhyChooseUs from '@/components/landing/WhyChooseUs';
import WorkProcess from '@/components/landing/WorkProcess';
import FAQ         from '@/components/landing/FAQ';
import FinalCTA    from '@/components/landing/FinalCTA';
import Footer      from '@/components/landing/Footer';

import { VerticalCutReveal } from '@/components/animations/VerticalCutReveal';

import {
  COMPANY, VISION, MISSION, CORE_VALUES, MANAGEMENT, WHY_CHOOSE_US,
  COMPANY_STORY, SOCIALS, STATS as SAFERIDE_STATS,
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
              WHO WE ARE
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
            <StatItem value={`${yearsActive}+`} label="years on the road" />
            <VertDivider />
            <StatItem value={`${SAFERIDE_STATS.passRate}%`} label="first-try pass rate" />
          </View>
          <View style={{ flexDirection: IS_WEB ? 'column' : 'row', alignItems: IS_WEB ? 'flex-end' : 'center', gap: 8 }}>
            <StatItem value={`${SAFERIDE_STATS.branches}+`} label="BRANCHES" large />
            <StatItem value={`${SAFERIDE_STATS.instructors}+`} label="instructors" />
          </View>
        </View>

        {/* Main content: headline + paragraphs + CTA */}
        {isMobile ? (
          /* ── Mobile: linear stack — headline → paragraph → enrol button ── */
          <View style={{ gap: 18 }}>
            <VerticalCutReveal
              text="Driving Safety Beyond Limits Since 2015."
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
              {COMPANY_STORY[0]}{' '}{COMPANY_STORY[1]}
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
                ENROL WITH US
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
                  text="Driving Safety Beyond Limits Since 2015."
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
                  {COMPANY_STORY[0]}
                </Text>
                <Text
                  style={{
                    flex: 1, fontFamily: F.regular, fontSize: 14, lineHeight: 24,
                    color: mutedColor, textAlign: 'justify',
                  }}
                >
                  {COMPANY_STORY[1]}
                </Text>
              </View>
            </View>

            {/* Right: brand wordmark + CTA */}
            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
              <Text style={{ fontFamily: F.bold, fontSize: 22, color: C.skyDeep, marginBottom: 4 }}>
                SAFE RIDE AFRICA
              </Text>
              <Text style={{ fontFamily: F.regular, fontSize: 12, color: mutedColor, marginBottom: 24 }}>
                NTSA-Registered Driving School · Since {COMPANY.registration.foundedYear}
              </Text>
              <Text
                style={{
                  fontFamily: F.medium, fontSize: 14, color: T.foreground,
                  marginBottom: 14, textAlign: 'right',
                }}
              >
                Ready to start your driving journey?
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
                  ENROL WITH US
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
          Our History
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
          More Than a Decade of Safer Kenyan Roads
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
          Safe Ride Africa Driving School was founded in {COMPANY.registration.foundedYear} with a single conviction: that every Kenyan driver
          deserves world-class training, not just a piece of paper. Starting from a single Nairobi location,
          the school quickly gained a reputation for rigorous instruction, genuine care for students, and an
          NTSA-aligned curriculum that prepared learners for real roads — not just the test track.
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
          In {COMPANY.registration.incorporatedDate.split(' ').pop()}, the school was formally incorporated
          as {COMPANY.legalName} (PVT {COMPANY.registration.pvt}), formalising five years of growth into a
          registered institution. Today we operate {10} branches across Nairobi — from Donholm (HQ) to Kayole
          PCEA — and have trained over 2,100 licensed drivers.
        </Text>

        <Text
          style={{
            color: T.mutedForeground,
            fontFamily: F.regular,
            fontSize: 14,
            lineHeight: 26,
          }}
        >
          Our NTSA registration number (BN {COMPANY.registration.bn}) is publicly verifiable. Every instructor
          holds valid NTSA certification and participates in ongoing professional development. The result is a
          98% NTSA first-attempt pass rate — a figure we are proud to stand behind.
        </Text>
      </View>
    </View>
  );
}

// ─── Vision · Mission · Values ────────────────────────────────────────────────
function VisionMissionValues() {
  const T = useTheme();
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || (IS_WEB && winW < 768);

  const cols = [
    {
      icon:    <Eye size={22} color={C.blue} />,
      accent:  'rgba(1, 165, 240, 0.12)',
      heading: 'Vision',
      body:    VISION,
    },
    {
      icon:    <Target size={22} color={C.amber} />,
      accent:  'rgba(255, 216, 0, 0.12)',
      heading: 'Mission',
      body:    MISSION,
    },
    {
      icon:    <Heart size={22} color={C.yellow} />,
      accent:  'rgba(255, 216, 0, 0.12)',
      heading: 'Core Values',
      body:    CORE_VALUES.join(' · '),
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
            What Drives Us
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue }} />
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: isMobile ? 12 : 20 }}>
          {cols.map(col => (
            <View
              key={col.heading}
              style={{
                flex: isMobile ? undefined : 1,
                width: isMobile ? '48%' : undefined,
                backgroundColor: T.card,
                borderRadius: 20,
                padding: isMobile ? 18 : 28,
                borderWidth: 1,
                borderColor: T.border,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: col.accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 14,
                }}
              >
                {col.icon}
              </View>
              <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 16, marginBottom: 10 }}>
                {col.heading}
              </Text>
              <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 13, lineHeight: 22 }}>
                {col.body}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Achievements ─────────────────────────────────────────────────────────────
function Achievements() {
  const T = useTheme();
  // Show the last 3 items from WHY_CHOOSE_US — the substantive achievement bullets
  const bullets = WHY_CHOOSE_US.slice(2) as readonly string[];

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
          What We Guarantee
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
          Our Commitments to Every Student
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

function SilhouetteAvatar() {
  return (
    <View
      style={{
        width: '26%',
        aspectRatio: 1,
        borderRadius: 999,
        backgroundColor: 'rgba(34,31,32,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <Svg viewBox="0 0 24 24" width="58%" height="58%">
        <Path fill={C.dark} d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
      </Svg>
    </View>
  );
}

function Management() {
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
            Leadership
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
            Management Team
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
              <SilhouetteAvatar />
              <Text style={{ flex: 1, color: T.foreground, fontFamily: F.bold, fontSize: cols === 1 ? 14 : 15, lineHeight: cols === 1 ? 20 : 22 }}>
                {role.title}
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
  const T = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.background }}>
      <Navbar />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
      >
        <PageHero overline="Our Story" title="About Safe Ride Africa" />
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
