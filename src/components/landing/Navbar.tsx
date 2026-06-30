import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, Image, Pressable, Animated, Modal,
  ScrollView as RNScrollView, StyleSheet, Platform, Linking,
  AccessibilityInfo, useWindowDimensions,
} from 'react-native';
import AnimatedRN, {
  useSharedValue, useAnimatedStyle, useAnimatedReaction,
  withTiming, withSequence, withDelay, withRepeat,
  interpolate, runOnJS, cancelAnimation, Easing,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { router, usePathname } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Menu, X, ChevronRight, Sun, Moon, Phone, GraduationCap } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, NAV_ITEMS } from './constants';
import { COMPANY } from '@/data/saferide';
import { useEnrollModal } from '@/context/EnrollModalContext';
import { Button, Icon } from '@/components/ui';
import LanguageSwitcher from './LanguageSwitcher';
import LaneStrip from './LaneStrip';

const LOGO = require('../../../assets/images/saferide-logo.jpg');

const telHref = () => `tel:${COMPANY.primaryPhone.replace(/\s/g, '')}`;

// ─── Desktop nav link: quiet rounded-pill button, active filled with white tint ──
function NavLink({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      className={[
        'h-11 items-center justify-center rounded-pill px-3',
        active ? 'bg-white/20' : 'hover:bg-white/10 active:bg-white/15',
      ].join(' ')}
    >
      <Text
        style={{ fontFamily: active ? F.semibold : F.medium }}
        className="text-sm text-white"
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ─── On-colour icon button (dark toggle, hamburger) ─────────────────────────────
function IconButton({
  onPress, label, children,
}: { onPress: () => void; label: string; children: React.ReactNode }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="h-11 w-11 items-center justify-center rounded-pill bg-white/15 hover:bg-white/25 active:bg-white/25"
    >
      {children}
    </Pressable>
  );
}

interface NavbarProps {
  scrollY?: SharedValue<number>;
}

export default function Navbar({ scrollY }: NavbarProps) {
  const { t } = useTranslation();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const pathname = usePathname();
  const { width: winW } = useWindowDimensions();
  const { open: openEnrollModal } = useEnrollModal();

  // Desktop web shows the inline links; tablet, narrow web, and native use the
  // drawer (8 text links need desktop width to sit on one row).
  const showLinks = IS_WEB && winW >= 1024;
  const showHamburger = !IS_WEB || (IS_WEB && winW < 1024);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const drawerAnim = useRef(new Animated.Value(0)).current;

  const isItemActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  // Glass effect when scrolled, driven by the shared scroll value.
  useAnimatedReaction(
    () => scrollY?.value ?? 0,
    (value, prev) => {
      if (value !== prev) runOnJS(setIsScrolled)(value > 80);
    },
  );

  // ── Reduced motion ────────────────────────────────────────────────────────────
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  // ── Phone ring-shake every 5 s, silenced under reduce-motion ───────────────────
  const shake = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) { cancelAnimation(shake); shake.value = 0; return; }
    shake.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 80 }), withTiming(8, { duration: 80 }),
        withTiming(-6, { duration: 80 }), withTiming(6, { duration: 80 }),
        withTiming(-3, { duration: 80 }), withTiming(3, { duration: 80 }),
        withTiming(0, { duration: 80 }),
        withDelay(4440, withTiming(0, { duration: 1 })),
      ),
      -1, false,
    );
  }, [reduceMotion]);
  const phoneShakeStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${shake.value}deg` }] }));

  // ── Enrol glow breath every 2 s, silenced under reduce-motion ──────────────────
  const glow = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) { cancelAnimation(glow); glow.value = 0; return; }
    glow.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1, true,
    );
  }, [reduceMotion]);
  const enrolGlowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(glow.value, [0, 1], [0.3, 0.7]);
    const size = interpolate(glow.value, [0, 1], [8, 20]);
    return {
      shadowColor: C.yellow,
      shadowOpacity: opacity,
      shadowRadius: interpolate(glow.value, [0, 1], [6, 16]),
      shadowOffset: { width: 0, height: 0 },
      elevation: interpolate(glow.value, [0, 1], [4, 10]),
      ...(IS_WEB && { boxShadow: `0 0 ${size}px rgba(255,216,0,${opacity})` }),
    };
  });

  // ── Mobile drawer ──────────────────────────────────────────────────────────────
  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(drawerAnim, { toValue: 1, duration: 260, useNativeDriver: Platform.OS !== 'web' }).start();
  };
  const closeDrawer = () => {
    Animated.timing(drawerAnim, { toValue: 0, duration: 200, useNativeDriver: Platform.OS !== 'web' })
      .start(() => setDrawerOpen(false));
  };
  const drawerTranslate = drawerAnim.interpolate({ inputRange: [0, 1], outputRange: [-300, 0] });
  const handleNav = (path: string) => { router.push(path as any); closeDrawer(); };

  return (
    <>
      {/* ── Main row ──────────────────────────────────────────────────────────── */}
      <View
        className={[
          'z-50 border-b border-white/10',
          IS_WEB && isScrolled ? 'nav-glass' : 'bg-primary dark:bg-background',
        ].join(' ')}
      >
        {/* Native frosted glass when scrolled */}
        {Platform.OS !== 'web' && isScrolled && (
          <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFillObject} />
        )}

        <View
          className="w-full flex-row items-center gap-2 px-4 py-2"
          style={IS_WEB ? { maxWidth: MAX_W, alignSelf: 'center' } : undefined}
        >
          {/* Logo + wordmark */}
          <Pressable
            onPress={() => handleNav('/')}
            accessibilityRole="link"
            className="flex-row items-center gap-2"
            style={!showLinks ? { flexShrink: 1 } : undefined}
          >
            <Image
              source={LOGO}
              style={{ width: showLinks ? 56 : 38, height: showLinks ? 56 : 38, borderRadius: 10 }}
              resizeMode="contain"
            />
            <View style={!showLinks ? { flexShrink: 1 } : undefined}>
              <Text
                numberOfLines={1}
                style={{ fontFamily: F.bold }}
                className={showLinks ? 'text-xl text-accent' : 'text-base text-accent'}
              >
                {t('nav.brand')}
              </Text>
              <Text
                numberOfLines={1}
                style={{ fontFamily: F.semibold, letterSpacing: 1.5 }}
                className="text-[9px] uppercase text-white/70"
              >
                {t('nav.tagline')}
              </Text>
            </View>
          </Pressable>

          {/* Inline links, wide web only */}
          {showLinks && (
            <View className="flex-1 flex-row flex-wrap items-center justify-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.key}
                  label={t(`nav.${item.key}`)}
                  active={isItemActive(item.path)}
                  onPress={() => router.push(item.path as any)}
                />
              ))}
            </View>
          )}

          {/* Spacer pushes controls right on narrow screens */}
          {!showLinks && <View className="flex-1" />}

          {/* Controls */}
          <View className="flex-row items-center gap-2" style={{ flexShrink: 0 }}>
            {showLinks && <LanguageSwitcher />}

            {showLinks && (
              <IconButton onPress={toggleColorScheme} label="Toggle theme">
                {isDark
                  ? <Icon icon={Sun} size="sm" color={C.yellow} />
                  : <Icon icon={Moon} size="sm" color={C.white} />}
              </IconButton>
            )}

            {/* Call Now, demoted to an on-colour outline control */}
            {showLinks && (
              <Pressable
                onPress={() => Linking.openURL(telHref())}
                accessibilityRole="button"
                accessibilityLabel={t('common.callNow')}
                className="h-11 flex-row items-center gap-1.5 rounded-pill border border-white/40 bg-white/10 px-4 hover:bg-white/20 active:bg-white/20"
              >
                <AnimatedRN.View style={phoneShakeStyle}>
                  <Icon icon={Phone} size="xs" color={C.white} />
                </AnimatedRN.View>
                <Text style={{ fontFamily: F.semibold }} className="text-sm text-white">
                  {t('common.callNow')}
                </Text>
              </Pressable>
            )}

            {/* Enroll, the single reserved accent action */}
            <AnimatedRN.View style={[{ borderRadius: 8 }, enrolGlowStyle]}>
              <Button
                variant="accent"
                size="sm"
                onPress={() => openEnrollModal()}
                accessibilityLabel={t('common.enrolNow')}
              >
                <Icon icon={GraduationCap} size="sm" color={C.dark} />
                <Text style={{ fontFamily: F.bold }} className="text-sm text-accent-foreground">
                  {showLinks ? t('common.enrolNow') : t('common.enrol')}
                </Text>
              </Button>
            </AnimatedRN.View>

            {showHamburger && <LanguageSwitcher compact />}

            {showHamburger && (
              <IconButton onPress={openDrawer} label="Open menu">
                <Icon icon={Menu} size="md" color={C.white} />
              </IconButton>
            )}
          </View>
        </View>
      </View>

      <LaneStrip />

      {/* ── Mobile drawer ─────────────────────────────────────────────────────── */}
      {showHamburger && (
        <Modal visible={drawerOpen} transparent animationType="none" onRequestClose={closeDrawer}>
          <Pressable className="flex-1 bg-black/55" onPress={closeDrawer}>
            <Animated.View
              style={[styles.drawer, { transform: [{ translateX: drawerTranslate }] }]}
              className="bg-background"
            >
              <Pressable className="flex-1" onPress={() => {}}>
                {/* Drawer header */}
                <View className="flex-row items-center justify-between border-b border-white/10 bg-primary px-5 py-4">
                  <View className="flex-row items-center gap-2">
                    <Image source={LOGO} style={{ width: 48, height: 48, borderRadius: 10 }} resizeMode="contain" />
                    <Text numberOfLines={1} style={{ fontFamily: F.bold }} className="text-base text-accent">
                      {t('nav.brand')}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <IconButton onPress={toggleColorScheme} label="Toggle theme">
                      {isDark
                        ? <Icon icon={Sun} size="sm" color={C.yellow} />
                        : <Icon icon={Moon} size="sm" color={C.white} />}
                    </IconButton>
                    <IconButton onPress={closeDrawer} label="Close menu">
                      <Icon icon={X} size="md" color={C.white} />
                    </IconButton>
                  </View>
                </View>

                {/* Nav items */}
                <RNScrollView className="flex-1 pt-2">
                  {NAV_ITEMS.map((item) => {
                    const active = isItemActive(item.path);
                    return (
                      <Pressable
                        key={item.path}
                        onPress={() => handleNav(item.path)}
                        className={[
                          'flex-row items-center justify-between px-5 py-3.5 active:bg-foreground/5',
                          active ? 'border-l-[3px] border-primary bg-primary/10' : '',
                        ].join(' ')}
                      >
                        <Text
                          style={{ fontFamily: active ? F.semibold : F.regular }}
                          className={active ? 'text-base text-primary' : 'text-base text-foreground'}
                        >
                          {t(`nav.${item.key}`)}
                        </Text>
                        <Icon icon={ChevronRight} size="sm" color={C.muted} />
                      </Pressable>
                    );
                  })}

                  {/* Drawer CTAs */}
                  <View className="gap-3 p-5 pt-4">
                    <Button
                      variant="accent"
                      onPress={() => { closeDrawer(); openEnrollModal(); }}
                      className="w-full"
                    >
                      <Icon icon={GraduationCap} size="sm" color={C.dark} />
                      <Text style={{ fontFamily: F.bold }} className="text-base text-accent-foreground">
                        {t('common.enrolNow')}
                      </Text>
                    </Button>
                    <Button
                      variant="outline"
                      onPress={() => { closeDrawer(); Linking.openURL(telHref()); }}
                      className="w-full"
                    >
                      <Icon icon={Phone} size="sm" color={C.skyDeep} />
                      <Text style={{ fontFamily: F.semibold }} className="text-base text-foreground">
                        {t('common.callNow')}
                      </Text>
                    </Button>
                  </View>
                </RNScrollView>
              </Pressable>
            </Animated.View>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    shadowColor: C.dark,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 16,
  },
});
