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
//
// Reveal supports entrance variants. "rise" is the original fade, lift and
// scale, and stays the default so existing callers are untouched. Every
// variant resolves to the identity transform at progress 1, which is what
// makes the reduce-motion snap correct for all of them.

const DURATION = 1200;

// Horizontal travel needs more distance than the vertical lift to read as a
// slide, so the offset prop is scaled per variant rather than adding a second
// distance prop.
const SLIDE_SCALE = 2;
const LIGHT_SPEED_SCALE = 3;
const FLIP_DEG = 90;
const LIGHT_SPEED_SKEW_DEG = 18;
const PERSPECTIVE = 800;

export type RevealVariant = 'rise' | 'slide-left' | 'slide-right' | 'flip' | 'light-speed';

type RevealProps = ViewProps & {
  delay?: number;
  /** Entrance offset in px: the lift distance for "rise", the travel distance
   *  for the slide and light-speed variants. Ignored by "flip". */
  y?: number;
  variant?: RevealVariant;
  className?: string;
  children: React.ReactNode;
};

export function Reveal({ delay = 0, y = 80, variant = 'rise', className, style, children, ...rest }: RevealProps) {
  const reduceMotion = useReduceMotion();
  const { ref, inView } = useInView(0.12);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) { progress.value = 1; return; }
    if (inView) {
      progress.value = withDelay(delay, withTiming(1, { duration: DURATION, easing: Easing.out(Easing.cubic) }));
    }
  }, [inView, reduceMotion, delay]);

  const aStyle = useAnimatedStyle(() => {
    const p = progress.value;
    // How far from settled the entrance still is: 1 at the start, 0 at rest.
    const remaining = 1 - p;

    switch (variant) {
      // Enters from the left, so the offset starts negative and settles at 0.
      case 'slide-left':
        return { opacity: p, transform: [{ translateX: -remaining * y * SLIDE_SCALE }] };

      case 'slide-right':
        return { opacity: p, transform: [{ translateX: remaining * y * SLIDE_SCALE }] };

      // Perspective sits first in the array so the tilt reads as depth rather
      // than a flat vertical squash.
      case 'flip':
        return {
          opacity: p,
          transform: [{ perspective: PERSPECTIVE }, { rotateX: `${-remaining * FLIP_DEG}deg` }],
        };

      // Comes in from the right with a lean that straightens as it lands.
      case 'light-speed':
        return {
          opacity: p,
          transform: [
            { translateX: remaining * y * LIGHT_SPEED_SCALE },
            { skewX: `${-remaining * LIGHT_SPEED_SKEW_DEG}deg` },
          ],
        };

      case 'rise':
      default:
        return {
          opacity: p,
          transform: [{ translateY: remaining * y }, { scale: 0.85 + 0.15 * p }],
        };
    }
  });

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
