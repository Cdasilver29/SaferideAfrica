import React from 'react'
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle,
} from 'react-native-reanimated'
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Phone } from 'lucide-react-native'
import { C, F, IS_WEB, MAX_W } from './constants'
import { SectionIntro } from './SectionIntro'
import { useEnrollModal } from '@/context/EnrollModalContext'

// ── Water-wave SVG builder ────────────────────────────────────────────────────

const PERIOD = 320  // px — one complete wave cycle

/**
 * Builds an SVG path for a sine-like wave using cubic bezier curves.
 * The path fills from the wave crest down to H (container height).
 * Total width = svgW so the wave tiles seamlessly at every PERIOD offset.
 */
function buildWavePath(svgW: number, H: number, yBase: number, amp: number): string {
  let d = `M0,${yBase}`
  const steps = Math.ceil(svgW / (PERIOD / 2)) + 2
  for (let i = 0; i < steps; i++) {
    const x0  = i * (PERIOD / 2)
    const xMid = x0 + PERIOD / 4
    const x1  = x0 + PERIOD / 2
    const yPeak = i % 2 === 0 ? yBase - amp : yBase + amp
    d += ` C${xMid - PERIOD / 8},${yPeak} ${xMid + PERIOD / 8},${yPeak} ${x1},${yBase}`
  }
  d += ` L${svgW},${H} L0,${H} Z`
  return d
}

// ── Animated wave layer ───────────────────────────────────────────────────────

type WaveProps = {
  svgW:      number
  H:         number
  yBase:     number
  amp:       number
  fill:      string
  duration:  number
  initOffset: number   // phase offset so waves don't start at the same position
}

function WaveLayer({ svgW, H, yBase, amp, fill, initOffset }: WaveProps) {
  // Phase 12: waves are held static; Ken Burns is the only ambient motion.
  const offset = useSharedValue(initOffset)

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }))

  const path = buildWavePath(svgW, H, yBase, amp)

  return (
    <Animated.View style={[{ position: 'absolute', bottom: 0, left: 0 }, style]}
      // @ts-ignore pointerEvents on View
      pointerEvents="none"
    >
      <Svg width={svgW} height={H}>
        <Path d={path} fill={fill} />
      </Svg>
    </Animated.View>
  )
}

// ── Wave background (3 layers) ────────────────────────────────────────────────

function WaveBackground({ sectionH }: { sectionH: number }) {
  const { width } = useWindowDimensions()
  if (width === 0) return null

  // SVG is 2 full periods wider than the container so translateX never reveals a gap
  const svgW = width + PERIOD * 2
  const H    = Math.round(sectionH * 0.55)   // waves fill the bottom 55 %

  return (
    <View
      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: H, overflow: 'hidden' }}
      // @ts-ignore
      pointerEvents="none"
    >
      {/* Layer 1 — back, slow, low amp */}
      <WaveLayer
        svgW={svgW} H={H}
        yBase={H * 0.30} amp={22}
        fill="rgba(88,204,247,0.18)"
        duration={7000}
        initOffset={0}
      />
      {/* Layer 2 — mid, medium speed */}
      <WaveLayer
        svgW={svgW} H={H}
        yBase={H * 0.48} amp={30}
        fill="rgba(255,255,255,0.12)"
        duration={4800}
        initOffset={-(PERIOD / 3)}
      />
      {/* Layer 3 — front, fast, higher amp, bright crest */}
      <WaveLayer
        svgW={svgW} H={H}
        yBase={H * 0.62} amp={38}
        fill="rgba(255,255,255,0.20)"
        duration={3200}
        initOffset={-(PERIOD * 2 / 3)}
      />
      {/* Layer 4 — surface shimmer strip (very thin, fast) */}
      <WaveLayer
        svgW={svgW} H={H}
        yBase={H * 0.62 - 6} amp={12}
        fill="rgba(255,255,255,0.30)"
        duration={2400}
        initOffset={-(PERIOD / 5)}
      />
    </View>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function FinalCTA() {
  const { t } = useTranslation()
  const { open } = useEnrollModal()
  const sectionH = IS_WEB ? 460 : 380

  return (
    <View
      style={{
        backgroundColor: C.skyDeep,
        // minHeight instead of a fixed height: long-copy locales at 360px can
        // grow the section instead of clipping. Waves stay anchored to the
        // bottom regardless.
        minHeight: sectionH,
        paddingHorizontal: 24,
        paddingVertical: 48,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Animated water waves — rendered behind content */}
      <WaveBackground sectionH={sectionH} />

      {/* Content floats above the waves */}
      <View
        style={[
          IS_WEB ? { maxWidth: MAX_W, width: '100%', alignItems: 'center' } : { alignItems: 'center' },
          { zIndex: 10 },
        ]}
      >
        <SectionIntro
          badge={t('home.finalCta.badge')}
          title={t('home.finalCta.title')}
          description={t('home.finalCta.description')}
          invert
          typewriter
        />

        <View style={{ flexDirection: IS_WEB ? 'row' : 'column', gap: 14, width: IS_WEB ? undefined : '100%' }}>
          {/* Enrol Now */}
          <TouchableOpacity
            onPress={() => open()}
            activeOpacity={0.85}
            style={{
              backgroundColor: C.yellow,
              paddingHorizontal: 32, paddingVertical: 16,
              borderRadius: 28,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
              shadowColor: C.yellow, shadowOpacity: 0.45, shadowRadius: 14, elevation: 6,
            }}
          >
            <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 15 }}>{t('common.enrolNow')}</Text>
            <ArrowRight size={17} color={C.dark} />
          </TouchableOpacity>

          {/* Talk to Us */}
          <TouchableOpacity
            onPress={() => router.push('/contact')}
            activeOpacity={0.8}
            style={{
              paddingHorizontal: 32, paddingVertical: 16,
              borderRadius: 28,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
              backgroundColor: C.red,
              shadowColor: C.red, shadowOpacity: 0.40, shadowRadius: 12, elevation: 5,
            }}
          >
            <Phone size={16} color={C.white} />
            <Text style={{ color: C.white, fontFamily: F.semibold, fontSize: 15 }}>{t('common.talkToUs')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
