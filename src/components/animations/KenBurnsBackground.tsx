import React, { useEffect } from 'react'
import { ImageBackground } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated'

type Props = { source: any; children?: React.ReactNode }

export function KenBurnsBackground({ source, children }: Props) {
  const scale = useSharedValue(1)
  const tx = useSharedValue(0)
  const ty = useSharedValue(0)

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 14000, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.00, { duration: 14000, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    )
    tx.value = withRepeat(
      withSequence(
        withTiming(-24, { duration: 18000, easing: Easing.inOut(Easing.sin) }),
        withTiming( 24, { duration: 18000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    )
    ty.value = withRepeat(
      withSequence(
        withTiming( 12, { duration: 16000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-12, { duration: 16000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: tx.value },
      { translateY: ty.value },
    ],
  }))

  return (
    <Animated.View
      style={[
        { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
        animatedStyle,
      ]}
    >
      <ImageBackground source={source} style={{ flex: 1 }} resizeMode="cover">
        {children}
      </ImageBackground>
    </Animated.View>
  )
}
