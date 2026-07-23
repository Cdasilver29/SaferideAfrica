import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useReducedMotion,
} from "react-native-reanimated";

/**
 * Skeleton block. Pulses unless the user prefers reduced motion,
 * in which case it renders as a static placeholder. Hidden from
 * assistive tech; the parent should expose an accessibilityLabel
 * like "Loading courses" on its container while pending.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    if (reduceMotion) return;
    opacity.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
  }, [reduceMotion, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={style}
      className={`rounded-md bg-ink/10 ${className}`}
    />
  );
}

export function CourseCardSkeleton() {
  return (
    <View className="w-full rounded-lg border border-ink/10 bg-chalk p-6 md:max-w-[360px]">
      <Skeleton className="mb-4 h-8 w-16" />
      <Skeleton className="mb-2 h-6 w-3/4" />
      <Skeleton className="mb-1 h-4 w-full" />
      <Skeleton className="mb-6 h-4 w-2/3" />
      <Skeleton className="h-11 w-32" />
    </View>
  );
}
