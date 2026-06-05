import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming, runOnJS,
} from 'react-native-reanimated'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { C, F, IS_WEB, MAX_W } from './constants'
import { SectionIntro } from './SectionIntro'
import { useTheme } from '@/lib/theme'

const PHOTO_SOURCES = IS_WEB
  ? [
      { uri: '/erickmusyoka.webp' },
      { uri: '/mainamburu.webp' },
      { uri: '/mitchelakinyi.webp' },
    ]
  : [
      require('../../../public/erickmusyoka.webp'),
      require('../../../public/mainamburu.webp'),
      require('../../../public/mitchelakinyi.webp'),
    ]

const INITIALS  = ['EM', 'MM', 'MA']
// Fixed inactive rotations (stable, avoids jitter on re-render)
const ROTATIONS = [-7.2, 5.8, -4.5]

const SPRING = { damping: 22, stiffness: 95 }
const N      = 3

export default function Testimonials() {
  const { t } = useTranslation()
  const T = useTheme()
  const items = t('testimonials.items', { returnObjects: true }) as Array<{
    text: string; name: string; role: string
  }>

  const [active, setActive]       = useState(0)
  const [displayed, setDisplayed] = useState(0)
  const [imgErrors, setImgErrors] = useState([false, false, false])

  // Active index as shared value so animated styles react to it
  const activeIdx = useSharedValue(0)

  // ─── Per-card shared values (declared at top level, never in a loop) ─────────
  const op0 = useSharedValue(1),   op1 = useSharedValue(0.5), op2 = useSharedValue(0.5)
  const sc0 = useSharedValue(1),   sc1 = useSharedValue(0.9), sc2 = useSharedValue(0.9)
  const ty0 = useSharedValue(0),   ty1 = useSharedValue(20),  ty2 = useSharedValue(20)
  const ro0 = useSharedValue(0),   ro1 = useSharedValue(ROTATIONS[0]), ro2 = useSharedValue(ROTATIONS[1])

  // Text panel fade
  const textOp = useSharedValue(1)
  const textTy = useSharedValue(0)

  // ─── Auto-advance refs ────────────────────────────────────────────────────────
  const autoRef   = useRef<ReturnType<typeof setInterval> | null>(null)
  const idleRef   = useRef<ReturnType<typeof setTimeout>  | null>(null)
  const activeRef = useRef(0)

  const allOp = [op0, op1, op2]
  const allSc = [sc0, sc1, sc2]
  const allTy = [ty0, ty1, ty2]
  const allRo = [ro0, ro1, ro2]

  // Animate all cards when active index changes
  useEffect(() => {
    activeIdx.value = active
    for (let i = 0; i < N; i++) {
      const isAct = i === active
      allOp[i].value = withSpring(isAct ? 1   : 0.5, SPRING)
      allSc[i].value = withSpring(isAct ? 1   : 0.9, SPRING)
      allTy[i].value = withSpring(isAct ? 0   : 20,  SPRING)
      allRo[i].value = withSpring(isAct ? 0   : ROTATIONS[i] ?? 0, SPRING)
    }
  }, [active])

  const startAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      goTo((activeRef.current + 1) % N, false)
    }, 5000)
  }

  const goTo = (idx: number, manual: boolean) => {
    activeRef.current = idx
    setActive(idx)

    // Fade out → update text → fade in
    textOp.value = withTiming(0, { duration: 150 }, (done) => {
      'worklet'
      if (done) {
        runOnJS(setDisplayed)(idx)
        textOp.value = withTiming(1, { duration: 150 })
        textTy.value = withTiming(0, { duration: 150 })
      }
    })
    textTy.value = withTiming(-20, { duration: 150 })

    if (manual) {
      if (autoRef.current) clearInterval(autoRef.current)
      if (idleRef.current) clearTimeout(idleRef.current)
      idleRef.current = setTimeout(startAuto, 8000)
    }
  }

  useEffect(() => {
    startAuto()
    return () => {
      if (autoRef.current) clearInterval(autoRef.current)
      if (idleRef.current) clearTimeout(idleRef.current)
    }
  }, [])

  // ─── Animated styles — declared at top level, not inside map ─────────────────
  const style0 = useAnimatedStyle(() => ({
    opacity: op0.value,
    zIndex:  activeIdx.value === 0 ? 10 : 0,
    transform: [{ scale: sc0.value }, { translateY: ty0.value }, { rotate: `${ro0.value}deg` }],
  }))
  const style1 = useAnimatedStyle(() => ({
    opacity: op1.value,
    zIndex:  activeIdx.value === 1 ? 10 : 1,
    transform: [{ scale: sc1.value }, { translateY: ty1.value }, { rotate: `${ro1.value}deg` }],
  }))
  const style2 = useAnimatedStyle(() => ({
    opacity: op2.value,
    zIndex:  activeIdx.value === 2 ? 10 : 2,
    transform: [{ scale: sc2.value }, { translateY: ty2.value }, { rotate: `${ro2.value}deg` }],
  }))

  const cardAnimStyles = [style0, style1, style2]

  const textStyle = useAnimatedStyle(() => ({
    opacity:   textOp.value,
    transform: [{ translateY: textTy.value }],
  }))

  const item = items[displayed] ?? items[0]

  const { width: winW } = useWindowDimensions()
  const isMobile = !IS_WEB || (IS_WEB && winW < 768)

  const CARD_W = IS_WEB ? 210 : 160
  const CARD_H = IS_WEB ? 275 : 210

  const CARD_BASE = {
    position: 'absolute' as const,
    top: 0, left: 0,
    width: CARD_W, height: CARD_H,
    borderRadius: 16,
    backgroundColor: C.white,
    borderWidth: 5,
    borderColor: C.white,
    overflow: 'hidden' as const,
    shadowColor: C.dark,
    shadowOpacity: 0.20,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  }

  const MOBILE_PHOTO_W = 140
  const MOBILE_PHOTO_H = 180

  return (
    <View style={{ paddingVertical: 72, paddingHorizontal: 24, backgroundColor: T.background }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        <SectionIntro
          badge={t('testimonials.overline')}
          title={t('testimonials.heading')}
        />

        <View style={{
          flexDirection: IS_WEB ? 'row' : 'column',
          gap: IS_WEB ? 72 : 24,
          alignItems: IS_WEB ? 'center' : 'stretch',
        }}>

          {/* ── Photo section ───────────────────────────────────────────────── */}
          {isMobile ? (
            /* Mobile: single active photo, no overlapping stack */
            <Animated.View style={[{
              alignSelf: 'center',
              width: MOBILE_PHOTO_W,
              height: MOBILE_PHOTO_H,
              borderRadius: 16,
              backgroundColor: C.white,
              borderWidth: 4,
              borderColor: C.white,
              overflow: 'hidden',
              shadowColor: C.dark,
              shadowOpacity: 0.20,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 6 },
              elevation: 8,
            }, cardAnimStyles[active]]}>
              {!imgErrors[active] ? (
                <Image
                  source={PHOTO_SOURCES[active]}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                  onError={() =>
                    setImgErrors((prev) => {
                      const next = [...prev]; next[active] = true; return next;
                    })
                  }
                />
              ) : (
                <View style={{
                  flex: 1,
                  backgroundColor: active === 0 ? C.skyDeep : active === 1 ? C.skyLight : C.yellow,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ color: C.white, fontFamily: F.bold, fontSize: 36 }}>
                    {INITIALS[active]}
                  </Text>
                </View>
              )}
            </Animated.View>
          ) : (
            /* Desktop: stacked deck */
            <View style={{
              width: CARD_W + 60,
              height: CARD_H + 60,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <View style={{ width: CARD_W, height: CARD_H }}>
                {[0, 1, 2].map((i) => (
                  <Animated.View key={i} style={[CARD_BASE, cardAnimStyles[i]]}>
                    {!imgErrors[i] ? (
                      <Image
                        source={PHOTO_SOURCES[i]}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                        onError={() =>
                          setImgErrors((prev) => {
                            const next = [...prev]
                            next[i] = true
                            return next
                          })
                        }
                      />
                    ) : (
                      <View style={{
                        flex: 1,
                        backgroundColor: i === 0 ? C.skyDeep : i === 1 ? C.skyLight : C.yellow,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Text style={{ color: C.white, fontFamily: F.bold, fontSize: 42 }}>
                          {INITIALS[i]}
                        </Text>
                      </View>
                    )}
                  </Animated.View>
                ))}
              </View>
            </View>
          )}

          {/* ── Text panel ──────────────────────────────────────────────────── */}
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Animated.View style={textStyle}>
              <Quote size={38} color={C.yellow} style={{ marginBottom: 20 }} />

              <Text style={{
                color: T.foreground,
                fontFamily: F.regular,
                fontSize: IS_WEB ? 18 : 14,
                lineHeight: IS_WEB ? 32 : 22,
                fontStyle: 'italic',
                marginBottom: 28,
              }}>
                "{item.text}"
              </Text>

              <View style={{ flexDirection: 'row', gap: 3, marginBottom: 16 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} color={C.yellow} fill={C.yellow} />
                ))}
              </View>

              <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: IS_WEB ? 20 : 17 }}>
                {item.name}
              </Text>
              <Text style={{
                color: T.mutedForeground,
                fontFamily: F.regular,
                fontSize: 13,
                marginTop: 4,
              }}>
                {item.role}
              </Text>
            </Animated.View>

            {/* Prev / Next */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 32 }}>
              <TouchableOpacity
                onPress={() => goTo((active - 1 + N) % N, true)}
                activeOpacity={0.75}
                style={{
                  width: 48, height: 48, borderRadius: 24,
                  borderWidth: 1.5,
                  borderColor: T.border,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <ChevronLeft size={20} color={T.foreground} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => goTo((active + 1) % N, true)}
                activeOpacity={0.82}
                style={{
                  width: 48, height: 48, borderRadius: 24,
                  backgroundColor: C.red,
                  alignItems: 'center', justifyContent: 'center',
                  shadowColor: C.red,
                  shadowOpacity: 0.32,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <ChevronRight size={20} color={C.white} />
              </TouchableOpacity>
            </View>

            {/* Progress dots */}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 20 }}>
              {[0, 1, 2].map((i) => (
                <TouchableOpacity key={i} onPress={() => goTo(i, true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <View style={{
                    height: 6,
                    width: i === active ? 24 : 6,
                    borderRadius: 3,
                    backgroundColor: i === active ? C.skyDeep : T.border,
                  }} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </View>
      </View>
    </View>
  )
}
