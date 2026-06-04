import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from 'react-native-reanimated'

type Props = {
  text: string
  splitBy?: 'words' | 'characters'
  staggerDuration?: number  // seconds between each piece
  startDelay?: number       // seconds before first piece animates
  reverse?: boolean         // true = slide in from top, false = from bottom
  style?: any
  containerStyle?: any
}

const ATxt = Animated.createAnimatedComponent(Text)

function Piece({
  char,
  index,
  staggerDuration,
  startDelay,
  reverse,
  style,
}: {
  char: string
  index: number
  staggerDuration: number
  startDelay: number
  reverse: boolean
  style?: any
}) {
  const y = useSharedValue(reverse ? -36 : 36)

  useEffect(() => {
    const delayMs = (startDelay + index * staggerDuration) * 1000
    y.value = withDelay(delayMs, withSpring(0, { damping: 22, stiffness: 250 }))
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }))

  return (
    <View style={{ overflow: 'hidden' }}>
      <ATxt style={[style, animatedStyle]}>{char}</ATxt>
    </View>
  )
}

export function VerticalCutReveal({
  text,
  splitBy = 'words',
  staggerDuration = 0.1,
  startDelay = 0,
  reverse = false,
  style,
  containerStyle,
}: Props) {
  const pieces = splitBy === 'words' ? text.split(' ') : text.split('')
  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap' }, containerStyle]}>
      {pieces.map((p, i) => (
        <Piece
          key={`${p}-${i}`}
          char={splitBy === 'words' ? p + ' ' : p}
          index={i}
          staggerDuration={staggerDuration}
          startDelay={startDelay}
          reverse={reverse}
          style={style}
        />
      ))}
    </View>
  )
}
