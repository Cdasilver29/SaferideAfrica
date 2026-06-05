import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing,
} from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';
import { C } from './constants';

const H      = 28;
const DASH   = 44;
const GAP    = 28;
const PERIOD = DASH + GAP; // 72 px — one full dash+gap cycle

export default function LaneStrip({ reverse = false }: { reverse?: boolean }) {
  const [stripW, setStripW] = useState(0);
  // Left-to-right starts one period to the left so it can slide right
  const offset = useSharedValue(reverse ? -PERIOD : 0);

  useEffect(() => {
    if (stripW === 0) return;
    if (reverse) {
      // Left-to-right: -PERIOD → 0, snap, repeat
      offset.value = withRepeat(
        withTiming(0, { duration: 1200, easing: Easing.linear }),
        -1,
        false,
      );
    } else {
      // Right-to-left: 0 → -PERIOD, snap, repeat
      offset.value = withRepeat(
        withTiming(-PERIOD, { duration: 1200, easing: Easing.linear }),
        -1,
        false,
      );
    }
  }, [stripW]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  // 2 extra periods of width guarantee no gap is visible at any translateX value
  const svgW = stripW > 0 ? stripW + PERIOD * 2 : 0;

  return (
    <View
      style={{
        zIndex:        50,
        shadowColor:   '#000',
        shadowOffset:  { width: 0, height: 3 },
        shadowOpacity: 0.22,
        shadowRadius:  6,
        elevation:     5,
      }}
    >
      <View
        onLayout={e => setStripW(e.nativeEvent.layout.width)}
        style={{ height: H, overflow: 'hidden' }}
      >
        <LinearGradient
          colors={[C.skyLight, C.skyDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {svgW > 0 && (
          <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, animStyle]}>
            <Svg width={svgW} height={H}>
              <Line
                x1={0}
                y1={H / 2}
                x2={svgW}
                y2={H / 2}
                stroke={C.yellow}
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={`${DASH} ${GAP}`}
              />
            </Svg>
          </Animated.View>
        )}

        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.30)' }} />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(34,31,32,0.12)' }} />
      </View>
    </View>
  );
}
