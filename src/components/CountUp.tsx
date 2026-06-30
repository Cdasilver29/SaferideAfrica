import React, { useEffect, useState } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import {
  useSharedValue,
  useDerivedValue,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { useReduceMotion } from '@/hooks/useReduceMotion';

type Props = {
  value: number;
  suffix?: string;
  durationMs?: number;
  /** Set true to start the animation. Before this, displays 0. */
  active: boolean;
  /** Optional stagger delay before the animation starts. */
  delayMs?: number;
  style?: StyleProp<TextStyle>;
};

export function CountUp({ value, suffix = '', durationMs = 1600, active, delayMs = 0, style }: Props) {
  const reduceMotion = useReduceMotion();
  const progress = useSharedValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduceMotion) {
      progress.value = value;
      setDisplay(value);
      return;
    }
    progress.value = withDelay(
      delayMs,
      withTiming(value, { duration: durationMs, easing: Easing.out(Easing.cubic) }),
    );
  }, [active, reduceMotion]);

  useDerivedValue(() => {
    runOnJS(setDisplay)(Math.floor(progress.value));
  });

  return (
    <Text style={style}>
      {display}{suffix}
    </Text>
  );
}
