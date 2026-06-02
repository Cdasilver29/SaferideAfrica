import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated'

type Props = {
  text: string
  className?: string
  style?: any
  accentFrom?: number
  accentStyle?: any
  startDelay?: number
  perWordDelay?: number
  align?: 'left' | 'center'
}

function Word({
  word,
  index,
  startDelay,
  perWordDelay,
  className,
  style,
}: {
  word: string
  index: number
  startDelay: number
  perWordDelay: number
  className?: string
  style?: any
}) {
  const y = useSharedValue(20)
  const opacity = useSharedValue(0)

  useEffect(() => {
    const delay = startDelay + index * perWordDelay
    const cfg = { duration: 600, easing: Easing.bezier(0.16, 1, 0.3, 1) }
    y.value = withDelay(delay, withTiming(0, cfg))
    opacity.value = withDelay(delay, withTiming(1, cfg))
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }))

  return (
    <Animated.View style={[{ marginRight: 8 }, animatedStyle]}>
      <Text className={className} style={style}>
        {word}
      </Text>
    </Animated.View>
  )
}

export function WordsPullUp({
  text,
  className,
  style,
  accentFrom,
  accentStyle,
  startDelay = 0,
  perWordDelay = 80,
  align = 'center',
}: Props) {
  const words = text.split(' ')
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: align === 'left' ? 'flex-start' : 'center' }}>
      {words.map((w, i) => (
        <Word
          key={`${w}-${i}`}
          word={w}
          index={i}
          startDelay={startDelay}
          perWordDelay={perWordDelay}
          className={className}
          style={accentFrom !== undefined && i >= accentFrom ? accentStyle ?? style : style}
        />
      ))}
    </View>
  )
}
