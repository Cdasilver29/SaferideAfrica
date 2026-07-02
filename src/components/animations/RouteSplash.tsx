import React, { useEffect, useRef, useState } from 'react';
import { Image, Platform } from 'react-native';
import { usePathname } from 'expo-router';
import Animated, {
  Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming,
} from 'react-native-reanimated';
import { useReduceMotion } from '@/hooks/useReduceMotion';

// Phase A route-change splash. On every client-side navigation the SafeRide
// logo sits centered on the brand sky overlay for about a second, then the
// overlay fades to reveal the new page. Opacity and transform only. Skipped
// entirely under reduce-motion, and never rendered on the initial page load,
// so static HTML and first paint stay untouched. pointerEvents none keeps
// the overlay from ever trapping input, and it is hidden from assistive tech.

const HOLD_MS = 700;
const FADE_MS = 300;
const LOGO_IN_MS = 250;

const LOGO = require('../../../assets/images/saferide-logo.jpg');

export default function RouteSplash() {
  const pathname = usePathname();
  const reduceMotion = useReduceMotion();
  const [visible, setVisible] = useState(false);
  const lastPath = useRef(pathname);
  const overlay = useSharedValue(1);
  const logo = useSharedValue(0);

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    if (reduceMotion) return;

    setVisible(true);
    overlay.value = 1;
    overlay.value = withDelay(HOLD_MS, withTiming(0, { duration: FADE_MS, easing: Easing.in(Easing.cubic) }));
    logo.value = 0;
    logo.value = withTiming(1, { duration: LOGO_IN_MS, easing: Easing.out(Easing.cubic) });
    const t = setTimeout(() => setVisible(false), HOLD_MS + FADE_MS);
    return () => clearTimeout(t);
  }, [pathname, reduceMotion]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlay.value }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logo.value,
    transform: [{ scale: 0.9 + 0.1 * logo.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      aria-hidden
      className="items-center justify-center bg-primary"
      style={[
        Platform.OS === 'web'
          ? ({ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 } as any)
          : { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
        { zIndex: 1000, pointerEvents: 'none' },
        overlayStyle,
      ]}
    >
      <Animated.View style={logoStyle}>
        <Image
          source={LOGO}
          style={{ width: 96, height: 96, borderRadius: 20 }}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      </Animated.View>
    </Animated.View>
  );
}
