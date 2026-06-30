import React, { useEffect } from 'react'
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

type Props = { source: any; children?: React.ReactNode }

// The one ambient motion the site keeps (Phase 12). Held static under
// reduce-motion; otherwise the slow Ken Burns drift continues.
export function KenBurnsBackground({ source, children }: Props) {
  const reduceMotion = useReduceMotion()
  const scale = useSharedValue(1)
  const tx    = useSharedValue(0)
  const ty    = useSharedValue(0)
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
        <ImageBackground
          source={source}
          style={{ flex: 1 }}
          resizeMode="cover"
          // Smooth fade-in on native; web uses CSS opacity transition
          fadeDuration={Platform.OS === 'web' ? 0 : 250}
        >
          {children}
        </ImageBackground>
      </Animated.View>
    </>
  )
}
