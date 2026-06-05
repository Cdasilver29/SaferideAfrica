import React, { useEffect } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions,
} from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, Easing,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { CheckCircle, ArrowRight, Star } from 'lucide-react-native'
import { CLASSES } from '@/data/saferide'
import { C, F, IS_WEB, MAX_W } from './constants'
import { SectionIntro } from './SectionIntro'
import { useTheme } from '@/lib/theme'

const PREVIEW_CODES = ['B-LIGHT', 'B-AUTO', 'EXECUTIVE']

// Curated feature bullets per card (DriveClass has no "included" array)
const CARD_META: Record<string, { badge?: string; lessonLine: string; features: string[] }> = {
  'B-LIGHT': {
    badge:      'MOST POPULAR',
    lessonLine: 'FULL COURSE · 20 LESSONS',
    features: [
      '20 practical driving lessons',
      'NTSA theory + road test',
      'Defensive driving module',
      'Smart DL application guide',
      'Dual-control manual vehicle',
    ],
  },
  'B-AUTO': {
    lessonLine: 'FULL COURSE · 20 LESSONS',
    features: [
      '20 practical driving lessons',
      'NTSA theory + road test',
      'Defensive driving module',
      'Smart DL application guide',
      'Automatic transmission',
    ],
  },
  'EXECUTIVE': {
    badge:      'PREMIUM',
    lessonLine: 'PRIVATE · FLEXIBLE',
    features: [
      'Dedicated certified instructor',
      'Flexible lesson scheduling',
      'Any vehicle class covered',
      'Full Smart DL support',
      'Home pickup on request',
    ],
  },
}

const KSH = (n: number) => 'Ksh ' + n.toLocaleString('en-KE')

// ─── Single premium card ──────────────────────────────────────────────────────
function PremiumCard({ cls, isNarrow }: { cls: (typeof CLASSES)[0]; isNarrow: boolean }) {
  const meta = CARD_META[cls.code]

  // ── Gradient border rotation (loops 0→360° every 8 s) ──────────────────────
  const rotateAnim = useSharedValue(0)
  useEffect(() => {
    rotateAnim.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false,
    )
  }, [])

  const gradientWrapStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    // Large square centered — covers all corners during rotation
    width: 700,
    height: 700,
    left: '50%',
    top: '50%',
    transform: [
      { translateX: -350 },
      { translateY: -350 },
      { rotate: `${rotateAnim.value}deg` },
    ],
  }))

  // ── Web: mouse-tracking glow ────────────────────────────────────────────────
  const mouseX  = useSharedValue(-999)
  const mouseY  = useSharedValue(-999)
  const glowOp  = useSharedValue(0)

  const glowStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: mouseX.value - 90,
    top:  mouseY.value - 90,
    width:  180,
    height: 180,
    borderRadius: 90,
    opacity: glowOp.value,
    backgroundColor: C.skyDeep,
  }))

  const webPointerProps = Platform.OS === 'web' ? {
    onPointerMove: (e: any) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      mouseX.value = e.clientX - rect.left
      mouseY.value = e.clientY - rect.top
      glowOp.value = withTiming(0.12, { duration: 80 })
    },
    onPointerLeave: () => {
      glowOp.value = withTiming(0, { duration: 250 })
      mouseX.value = -999
      mouseY.value = -999
    },
  } : {}

  // ── Native: slow auto-rotating shimmer ─────────────────────────────────────
  const shimmerAnim = useSharedValue(0)
  useEffect(() => {
    if (Platform.OS !== 'web') {
      shimmerAnim.value = withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      )
    }
  }, [])
  const shimmerStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    opacity: shimmerAnim.value * 0.07,
  }))

  const isExec = cls.code === 'EXECUTIVE'
  const T = useTheme()

  return (
    // Outer border container — 2 px padding reveals rotating gradient as a border
    <View style={[styles.borderOuter, isNarrow ? { width: '100%' } : { flex: 1 }]}>
      {/* Rotating gradient — positioned absolutely, larger than card */}
      <Animated.View style={[gradientWrapStyle, { pointerEvents: 'none' } as any]}>
        <LinearGradient
          colors={[C.skyDeep, C.skyLight, C.yellow, C.skyLight, C.skyDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
      </Animated.View>

      {/* Inner card — covers center, leaving 2 px gradient border visible */}
      <View
        style={[styles.cardInner, { backgroundColor: isExec ? C.dark : T.card }]}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(webPointerProps as any)}
      >
        {/* Mouse glow (web) */}
        {IS_WEB && (
          <Animated.View style={[glowStyle, { pointerEvents: 'none' } as any]} />
        )}

        {/* Native shimmer overlay */}
        {Platform.OS !== 'web' && (
          <Animated.View style={[shimmerStyle, { pointerEvents: 'none' } as any]}>
            <LinearGradient
              colors={[C.skyLight, C.skyDeep]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
        )}

        {/* Badge pill */}
        {meta?.badge && (
          <View style={styles.badge}>
            <Star size={10} color={C.dark} fill={C.dark} style={{ marginRight: 4 }} />
            <Text style={[styles.badgeText, { color: C.dark }]}>{meta.badge}</Text>
          </View>
        )}

        {/* Price */}
        <Text style={[styles.price, { color: isExec ? C.yellow : C.skyDeep }]}>
          {KSH(cls.total)}
        </Text>

        {/* Name + lesson line */}
        <Text style={[styles.className, { color: isExec ? C.white : T.foreground }]}>
          {cls.name}
        </Text>
        <Text style={[styles.lessonLine, { color: isExec ? 'rgba(255,255,255,0.55)' : T.mutedForeground }]}>
          {meta?.lessonLine}
        </Text>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: isExec ? 'rgba(255,255,255,0.12)' : T.border }]} />

        {/* Feature list */}
        {meta?.features.map((feat) => (
          <View key={feat} style={styles.featureRow}>
            <CheckCircle size={14} color={isExec ? C.yellow : C.skyDeep} />
            <Text style={[styles.featureText, { color: isExec ? 'rgba(255,255,255,0.80)' : T.mutedForeground }]}>
              {feat}
            </Text>
          </View>
        ))}

        {/* CTA button */}
        <TouchableOpacity
          onPress={() => router.push(`/classes/${cls.code}` as any)}
          activeOpacity={0.85}
          style={[
            styles.cta,
            { backgroundColor: isExec ? C.yellow : C.dark },
          ]}
        >
          <Text style={[styles.ctaText, { color: isExec ? C.dark : C.white }]}>
            Enrol Now
          </Text>
          <ArrowRight size={16} color={isExec ? C.dark : C.white} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function PremiumCourseCards() {
  const premiumClasses = CLASSES.filter((c) => PREVIEW_CODES.includes(c.code))
  const T = useTheme()
  const { width: winW } = useWindowDimensions()
  const isNarrow = !IS_WEB || (IS_WEB && winW < 768)

  return (
    <View style={[styles.section, { backgroundColor: T.background }]}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>
        <SectionIntro
          badge="Most Popular"
          title="Our Top Three Classes"
          description="The classes most Kenyan drivers choose. All include theory, road test, and Smart DL guidance."
        />

        <View style={[styles.row, isNarrow ? { gap: 20 } : { flexDirection: 'row', gap: 20 }]}>
          {premiumClasses.map((cls) => (
            <PremiumCard key={cls.code} cls={cls} isNarrow={isNarrow} />
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 56,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'column',
  },
  // 2 px padding = border thickness
  borderOuter: {
    padding: 2,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: IS_WEB ? 0 : 20,
  },
  cardInner: {
    borderRadius: 18,
    padding: IS_WEB ? 32 : 24,
    overflow: 'hidden',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: C.yellow,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 18,
  },
  badgeText: {
    fontFamily: F.bold,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  price: {
    fontFamily: F.bold,
    fontSize: IS_WEB ? 52 : 40,
    lineHeight: IS_WEB ? 60 : 48,
    marginBottom: 6,
  },
  className: {
    fontFamily: F.bold,
    fontSize: IS_WEB ? 18 : 16,
    marginBottom: 4,
  },
  lessonLine: {
    fontFamily: F.medium,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    marginBottom: 18,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  featureText: {
    fontFamily: F.regular,
    fontSize: 14,
    flex: 1,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },
  ctaText: {
    fontFamily: F.bold,
    fontSize: 15,
  },
})
