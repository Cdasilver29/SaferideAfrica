import React from 'react'
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming,
  withDelay, Easing,
} from 'react-native-reanimated'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react-native'
import { C, F, IS_WEB, MAX_W } from './constants'
import { SectionIntro } from './SectionIntro'
import { useEnrollModal } from '@/context/EnrollModalContext'

// ── Modern wave layer using View with animated opacity ────────────────────────

type WaveLayerProps = {
  bottom: number
  height: number
  color: string
  delay: number
}

function WaveLayer({ bottom, height, color, delay }: WaveLayerProps) {
  const opacity = useSharedValue(0.3)

  React.useEffect(() => {
    opacity.value = withDelay(delay, withRepeat(
      withTiming(0.8, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1, true
    ))
  }, [])

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      // @ts-ignore pointerEvents
      pointerEvents="none"
      style={[{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom,
        height,
        backgroundColor: color,
        borderTopLeftRadius: 200,
        borderTopRightRadius: 200,
      }, animStyle]}
    />
  )
}

// ── Modern wave background (layered Views with animated opacity) ──────────────

function WaveBackground({ sectionH }: { sectionH: number }) {
  const { width } = useWindowDimensions()
  if (width === 0) return null

  return (
    <View
      style={{ position: 'absolute', left: -60, right: -60, bottom: 0, height: sectionH * 0.55, overflow: 'hidden' }}
      // @ts-ignore
      pointerEvents="none"
    >
      {/* Layer 1 — wide, slow pulse */}
      <WaveLayer bottom={-40} height={120} color="rgba(88,204,247,0.15)" delay={0} />
      {/* Layer 2 — mid */}
      <WaveLayer bottom={-20} height={90} color="rgba(255,255,255,0.10)" delay={600} />
      {/* Layer 3 — front, brighter */}
      <WaveLayer bottom={-10} height={70} color="rgba(255,255,255,0.18)" delay={1200} />
      {/* Layer 4 — shimmer strip */}
      <WaveLayer bottom={50} height={30} color="rgba(255,255,255,0.25)" delay={1800} />
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
        minHeight: sectionH,
        paddingHorizontal: 24,
        paddingVertical: 48,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Animated wave layers — rendered behind content */}
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
            <Text style={{ fontSize: 16 }}>📞</Text>
            <Text style={{ color: C.white, fontFamily: F.semibold, fontSize: 15 }}>{t('common.talkToUs')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
