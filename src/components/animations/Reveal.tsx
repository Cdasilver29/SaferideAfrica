import React, { useEffect } from 'react';
import { View, type ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withTiming, withDelay, Easing,
} from 'react-native-reanimated';
import { useInView } from '@/hooks/useInView';
import { useReduceMotion } from '@/hooks/useReduceMotion';

// Phase 12b entrance motion. Fades and lifts content in once when it scrolls
// into view, then settles. Transform and opacity only; shows immediately under
// reduce-motion. Reveal owns its own in-view detection (block sections);
// RevealItem is driven by a parent's inView so a grid can stagger its cards.

const DURATION = 1200;

type RevealProps = ViewProps & {
  delay?: number;
  y?: number;
  className?: string;
  children: React.ReactNode;
};

export function Reveal({ delay = 0, y = 80, className, style, children, ...rest }: RevealProps) {
  const reduceMotion = useReduceMotion();
  const { ref, inView } = useInView(0.12);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) { progress.value = 1; return; }
    if (inView) {
      progress.value = withDelay(delay, withTiming(1, { duration: DURATION, easing: Easing.out(Easing.cubic) }));
    }
  }, [inView, reduceMotion, delay]);

  const aStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: (1 - progress.value) * y },
      { scale: 0.85 + 0.15 * progress.value }
    ],
  }));

  return (
    <View ref={ref} className={className} style={style} {...rest}>
      <Animated.View style={aStyle}>{children}</Animated.View>
    </View>
  );
}

type RevealItemProps = ViewProps & {
  index?: number;
  inView: boolean;
  step?: number;
  y?: number;
  className?: string;
  children: React.ReactNode;
};

export function RevealItem({ index = 0, inView, step = 150, y = 60, className, style, children, ...rest }: RevealItemProps) {
  const reduceMotion = useReduceMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) { progress.value = 1; return; }
    if (inView) {
      progress.value = withDelay(index * step, withTiming(1, { duration: DURATION, easing: Easing.out(Easing.cubic) }));
    }
  }, [inView, reduceMotion, index, step]);

  const aStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: (1 - progress.value) * y },
      { scale: 0.85 + 0.15 * progress.value }
    ],
  }));

  return (
    <Animated.View className={className} style={[style, aStyle]} {...rest}>
      {children}
    </Animated.View>
  );
}
