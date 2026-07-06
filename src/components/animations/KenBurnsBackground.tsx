import React, { useEffect, useRef, useState } from 'react'
import { ImageBackground, View, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated'
import { useReduceMotion } from '@/hooks/useReduceMotion'

type Props = {
  source: any | any[]
  children?: React.ReactNode
  // Reports the active rotation index so callers can sync overlay content (the
  // hero headlines) to the current photo. Fires on mount and every rotation;
  // under reduce-motion it fires once with 0 and never changes.
  onIndexChange?: (index: number) => void
}

const ROTATE_MS = 5000
const FADE_MS = 1100

// One stacked image layer of the rotation. Roles: 'active' fades in on top,
// 'prev' holds fully opaque underneath so the cross-fade never dips to the
// placeholder, 'hidden' snaps transparent (it is covered by an opaque layer
// when that happens). Opacity only, and styles stay inline: NativeWind
// className is a no-op on Animated.* components.
function CrossFadeLayer({ source, role }: { source: any; role: 'active' | 'prev' | 'hidden' }) {
  const opacity = useSharedValue(role === 'hidden' ? 0 : 1)
  const firstRole = useRef(true)

  useEffect(() => {
    if (role === 'active') {
      // The initial image must paint immediately, so only later activations fade.
      if (!firstRole.current) {
        opacity.value = 0
        opacity.value = withTiming(1, { duration: FADE_MS, easing: Easing.inOut(Easing.quad) })
      } else {
        opacity.value = 1
      }
    } else {
      opacity.value = role === 'prev' ? 1 : 0
    }
    firstRole.current = false
  }, [role])

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: role === 'active' ? 2 : role === 'prev' ? 1 : 0,
        },
        fadeStyle,
      ]}
    >
      <ImageBackground
        source={source}
        style={{ flex: 1 }}
        resizeMode="cover"
        // Smooth fade-in on native; web uses CSS opacity transition
        fadeDuration={Platform.OS === 'web' ? 0 : 250}
      />
    </Animated.View>
  )
}

// The one ambient motion the site keeps (Phase 12). Held static under
// reduce-motion; otherwise the slow Ken Burns drift continues. Accepts a
// single source or an array: arrays rotate on a timer with an opacity
// cross-fade. Under reduce-motion only the first image renders, no rotation.
export function KenBurnsBackground({ source, children, onIndexChange }: Props) {
  const sources = Array.isArray(source) ? source : [source]
  const reduceMotion = useReduceMotion()
  const scale = useSharedValue(1)
  const tx    = useSharedValue(0)
  const ty    = useSharedValue(0)

  // Rotation state: which layer is on top, which opaque layer sits under it,
  // and which sources have mounted so far. The upcoming image mounts one full
  // cycle early, giving it the rotation interval to load before its fade.
  const [rot, setRot] = useState(() => ({
    active: 0,
    prev: -1,
    mounted: sources.length > 1 ? [0, 1] : [0],
  }))

  useEffect(() => {
    if (reduceMotion || sources.length < 2) return
    const id = setInterval(() => {
      setRot(({ active, mounted }) => {
        const next = (active + 1) % sources.length
        const upcoming = (next + 1) % sources.length
        return {
          active: next,
          prev: active,
          mounted: mounted.includes(upcoming) ? mounted : [...mounted, upcoming],
        }
      })
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [reduceMotion, sources.length])

  // Keep the caller's overlay content in step with the visible photo. Under
  // reduce-motion the index is pinned to 0 (no rotation).
  useEffect(() => {
    onIndexChange?.(reduceMotion ? 0 : rot.active)
  }, [rot.active, reduceMotion])

  useEffect(() => {
    if (reduceMotion) {
      scale.value = 1
      tx.value = 0
      ty.value = 0
      return
    }
    scale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 14000, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.00, { duration: 14000, easing: Easing.inOut(Easing.quad) }),
      ),
      -1, false,
    )
    tx.value = withRepeat(
      withSequence(
        withTiming(-24, { duration: 18000, easing: Easing.inOut(Easing.sin) }),
        withTiming( 24, { duration: 18000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, false,
    )
    ty.value = withRepeat(
      withSequence(
        withTiming( 12, { duration: 16000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-12, { duration: 16000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, false,
    )
  }, [reduceMotion])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: tx.value },
      { translateY: ty.value },
    ],
  }))

  // Reduce-motion keeps the existing static path: first image, no rotation.
  const layerIndices = reduceMotion ? [0] : rot.mounted

  return (
    <>
      {/* Navy placeholder — visible immediately while the photo decodes */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#011c48' }} />

      <Animated.View
        style={[
          { position: 'absolute', top: -32, left: -32, right: -32, bottom: -32 },
          animatedStyle,
        ]}
      >
        {layerIndices.map((i) => (
          <CrossFadeLayer
            key={i}
            source={sources[i]}
            role={i === rot.active ? 'active' : i === rot.prev ? 'prev' : 'hidden'}
          />
        ))}

        {children ? <View style={{ flex: 1, zIndex: 3 }}>{children}</View> : null}
      </Animated.View>
    </>
  )
}
