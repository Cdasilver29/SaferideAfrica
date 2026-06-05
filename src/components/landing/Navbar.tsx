import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity, Animated, Modal,
  ScrollView as RNScrollView, StyleSheet, Platform, Linking,
  AccessibilityInfo, useWindowDimensions,
} from 'react-native';
import AnimatedRN, {
  useSharedValue, useAnimatedStyle, useAnimatedReaction,
  withSpring, withTiming, withSequence, withDelay, withRepeat,
  interpolate, runOnJS, cancelAnimation, Easing,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router, usePathname } from 'expo-router';
import { useColorScheme } from 'nativewind';
import {
  Menu, X, ChevronRight, Sun, Moon, Phone, GraduationCap,
  Home, Info, BookOpen, Wrench, MapPin, Mail, Image as ImageIcon, FileText,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, NAV_ITEMS } from './constants';
import { COMPANY } from '@/data/saferide';
import { useEnrollModal } from '@/context/EnrollModalContext';
import LanguageSwitcher from './LanguageSwitcher';
import LaneStrip from './LaneStrip';

const LOGO = require('../../../assets/images/saferide-logo.jpg');

// ─── Per-pill gradient config (palette-only colours) ─────────────────────────
const NAV_PILLS = [
  { key: 'home',     label: 'Home',     path: '/',         Icon: Home,      gradFrom: C.skyDeep,  gradTo: C.skyLight },
  { key: 'about',    label: 'About',    path: '/about',    Icon: Info,      gradFrom: C.skyLight, gradTo: C.skyDeep  },
  { key: 'courses',  label: 'Courses',  path: '/courses',  Icon: BookOpen,  gradFrom: C.yellow,   gradTo: C.skyDeep  },
  { key: 'services', label: 'Services', path: '/services', Icon: Wrench,    gradFrom: C.skyDeep,  gradTo: C.yellow   },
  { key: 'gallery',  label: 'Gallery',  path: '/gallery',  Icon: ImageIcon, gradFrom: C.skyLight, gradTo: C.skyDeep  },
  { key: 'blog',     label: 'Blog',     path: '/blog',     Icon: FileText,  gradFrom: C.yellow,   gradTo: C.skyLight },
  { key: 'branches', label: 'Branches', path: '/branches', Icon: MapPin,    gradFrom: C.skyDeep,  gradTo: C.skyLight },
  { key: 'contact',  label: 'Contact',  path: '/contact',  Icon: Mail,      gradFrom: C.yellow,   gradTo: C.red      },
] as const;

const PILL_SPRING  = { damping: 14, stiffness: 200 };
const PILL_H       = 40;   // collapsed height
const PILL_W_OPEN  = 140;  // expanded width
const PILL_W_CLOSE = 40;   // collapsed width (circle)

// ─── Single gradient pill ─────────────────────────────────────────────────────
function NavPill({
  item, isActive,
}: {
  item: (typeof NAV_PILLS)[number]
  isActive: boolean
}) {
  const expanded      = useSharedValue(isActive ? 1 : 0);
  const isHoveredRef  = useRef(false);

  // Keep active pill expanded even without hover
  useEffect(() => {
    if (!isHoveredRef.current) {
      expanded.value = withSpring(isActive ? 1 : 0, PILL_SPRING);
    }
  }, [isActive]);

  const pillStyle = useAnimatedStyle(() => ({
    width: interpolate(expanded.value, [0, 1], [PILL_W_CLOSE, PILL_W_OPEN]),
  }));

  const gradStyle = useAnimatedStyle(() => ({
    opacity: expanded.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: 1 - expanded.value,
    transform: [{ scale: interpolate(expanded.value, [0, 1], [1, 0.5]) }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: expanded.value,
    transform: [{ scale: interpolate(expanded.value, [0, 1], [0.8, 1]) }],
  }));

  // Web hover props — RNW passes these through to the DOM
  const webHover = Platform.OS === 'web'
    ? {
        onMouseEnter: () => {
          isHoveredRef.current = true;
          expanded.value = withSpring(1, PILL_SPRING);
        },
        onMouseLeave: () => {
          isHoveredRef.current = false;
          expanded.value = withSpring(isActive ? 1 : 0, PILL_SPRING);
        },
      }
    : {};

  return (
    <TouchableOpacity
      onPress={() => router.push(item.path as any)}
      // Native: press briefly expands the pill before navigating
      onPressIn={() => { if (Platform.OS !== 'web') expanded.value = withSpring(1, PILL_SPRING); }}
      onPressOut={() => { if (Platform.OS !== 'web') expanded.value = withSpring(isActive ? 1 : 0, PILL_SPRING); }}
      activeOpacity={0.9}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(webHover as any)}
    >
      {/* Outer animated width wrapper */}
      <AnimatedRN.View style={[pillStyle, styles.pillOuter]}>
        {/* Gradient fill — fades in on expand */}
        <AnimatedRN.View style={[StyleSheet.absoluteFillObject, gradStyle]}>
          <LinearGradient
            colors={[item.gradFrom, item.gradTo]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        </AnimatedRN.View>

        {/* Icon — fades out on expand */}
        <AnimatedRN.View style={[StyleSheet.absoluteFillObject, styles.pillCenter, iconStyle]}>
          <item.Icon size={16} color="rgba(34,31,32,0.50)" />
        </AnimatedRN.View>

        {/* Label — fades in on expand */}
        <AnimatedRN.View style={[StyleSheet.absoluteFillObject, styles.pillCenter, labelStyle]}>
          <Text style={styles.pillLabel}>{item.label}</Text>
        </AnimatedRN.View>
      </AnimatedRN.View>
    </TouchableOpacity>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
interface NavbarProps {
  scrollY?: SharedValue<number>;
}

export default function Navbar({ scrollY }: NavbarProps) {
  const { t }    = useTranslation();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark   = colorScheme === 'dark';
  const pathname = usePathname();
  const { width: winW } = useWindowDimensions();

  const { open: openEnrollModal } = useEnrollModal();

  // On web: show gradient pills when viewport ≥ 768 px, hamburger drawer below that
  const showPills    = IS_WEB && winW >= 768;
  const showHamburger = !IS_WEB || (IS_WEB && winW < 768);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const drawerAnim = useRef(new Animated.Value(0)).current;

  const isItemActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  // Glass effect when scrolled — driven by Reanimated shared value
  useAnimatedReaction(
    () => scrollY?.value ?? 0,
    (value, prev) => {
      if (value !== prev) runOnJS(setIsScrolled)(value > 80);
    },
  );

  // ── Reduced motion ───────────────────────────────────────────────────────────
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  // ── Phone ring-shake every 5 s — silenced if reduceMotion ───────────────────
  const shake = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(shake);
      shake.value = 0;
      return;
    }
    shake.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 80 }),
        withTiming( 8, { duration: 80 }),
        withTiming(-6, { duration: 80 }),
        withTiming( 6, { duration: 80 }),
        withTiming(-3, { duration: 80 }),
        withTiming( 3, { duration: 80 }),
        withTiming( 0, { duration: 80 }),
        withDelay(4440, withTiming(0, { duration: 1 })),
      ),
      -1,
      false,
    );
  }, [reduceMotion]);

  const phoneShakeStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${shake.value}deg` }],
  }));

  // ── Enrol glow breath every 2 s — silenced if reduceMotion ──────────────────
  const glow = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(glow);
      glow.value = 0;
      return;
    }
    glow.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [reduceMotion]);

  const enrolGlowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(glow.value, [0, 1], [0.3, 0.7]);
    const radius  = interpolate(glow.value, [0, 1], [6, 16]);
    const size    = interpolate(glow.value, [0, 1], [8, 20]);
    const elev    = interpolate(glow.value, [0, 1], [4, 10]);
    return {
      shadowColor: C.skyDeep,
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: { width: 0, height: 0 },
      elevation: elev,
      ...(IS_WEB && {
        boxShadow: `0 0 ${size}px rgba(1,165,240,${opacity})`,
      }),
    };
  });

  // ── Enrol icon nudge on hover / press ────────────────────────────────────────
  const iconNudge = useSharedValue(0);

  const iconNudgeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: iconNudge.value }],
  }));

  // ── Colour tokens — header is always skyDeep in light mode ─────────────────
  const bg       = isDark ? C.dark    : C.skyDeep;
  const bgGlass  = isDark ? 'rgba(34,31,32,0.88)' : 'rgba(1,165,240,0.92)';
  const navBg    = isScrolled ? bgGlass : bg;
  const borderC  = 'rgba(255,255,255,0.12)';  // white divider works on both dark and skyDeep
  const iconC    = C.white;                    // always white — readable on both skyDeep and dark
  const btnBg    = 'rgba(255,255,255,0.15)';   // subtle white tint on coloured bg

  // ── Mobile drawer ───────────────────────────────────────────────────────────
  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(drawerAnim, { toValue: 1, duration: 260, useNativeDriver: Platform.OS !== 'web' }).start();
  };
  const closeDrawer = () => {
    Animated.timing(drawerAnim, { toValue: 0, duration: 200, useNativeDriver: Platform.OS !== 'web' }).start(
      () => setDrawerOpen(false),
    );
  };
  const drawerTranslate = drawerAnim.interpolate({ inputRange: [0, 1], outputRange: [-300, 0] });

  const handleNav = (path: string) => { router.push(path as any); closeDrawer(); };

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          MAIN ROW — logo  |  gradient pills (web)  |  controls
      ══════════════════════════════════════════════════════════════════════ */}
      <View
        style={[
          styles.row,
          {
            backgroundColor: navBg,
            borderBottomColor: borderC,
          },
          IS_WEB && isScrolled && ({
            backdropFilter:       'blur(18px) saturate(160%)',
            WebkitBackdropFilter: 'blur(18px) saturate(160%)',
          } as any),
        ]}
      >
        {/* Native frosted glass */}
        {Platform.OS !== 'web' && isScrolled && (
          <BlurView
            intensity={70}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />
        )}

        <View style={[styles.rowInner, IS_WEB ? { maxWidth: MAX_W } : {}]}>

          {/* Logo */}
          <TouchableOpacity
            onPress={() => handleNav('/')}
            style={styles.logoRow}
            activeOpacity={0.85}
          >
            <Image
              source={LOGO}
              style={[styles.logoImg, !showPills && { width: 36, height: 36, borderRadius: 8 }]}
              resizeMode="contain"
            />
            {showPills && (
              <View>
                <Text style={styles.brandName}>{t('nav.brand')}</Text>
                <Text style={styles.brandTag}>{t('nav.tagline')}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Gradient pills — wide screens only */}
          {showPills && (
            <View style={styles.pillRow}>
              {NAV_PILLS.map(pill => (
                <NavPill key={pill.key} item={pill} isActive={isItemActive(pill.path)} />
              ))}
            </View>
          )}

          {/* Spacer — pushes controls to the right on mobile (pills fill this on web) */}
          {!showPills && <View style={{ flex: 1 }} />}

          {/* Controls */}
          <View style={styles.controls}>
            {showPills && <LanguageSwitcher />}

            {/* Dark-mode toggle — web only; tap the drawer header button on mobile */}
            {showPills && (
              <TouchableOpacity
                onPress={toggleColorScheme}
                style={[styles.iconBtn, { backgroundColor: btnBg }]}
                activeOpacity={0.8}
              >
                {isDark
                  ? <Sun  size={15} color={C.yellow} />
                  : <Moon size={15} color={iconC}    />}
              </TouchableOpacity>
            )}

            {/* Call Now — web only; accessible via drawer CTA on mobile */}
            {showPills && (
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${COMPANY.primaryPhone.replace(/\s/g, '')}`)}
                activeOpacity={0.85}
                style={styles.callBtn}
              >
                <AnimatedRN.View style={phoneShakeStyle}>
                  <Phone size={13} color={C.white} />
                </AnimatedRN.View>
                <Text style={styles.callText}>Call Now</Text>
              </TouchableOpacity>
            )}

            {/* Enrol Now */}
            <AnimatedRN.View style={[{ borderRadius: 18 }, enrolGlowStyle]}>
              <TouchableOpacity
                onPress={() => openEnrollModal()}
                activeOpacity={0.85}
                style={[styles.enrolBtn, { shadowOpacity: 0, elevation: 0 }]}
                onPressIn={Platform.OS !== 'web' ? () => { iconNudge.value = withTiming(4, { duration: 150 }); } : undefined}
                onPressOut={Platform.OS !== 'web' ? () => { iconNudge.value = withTiming(0, { duration: 150 }); } : undefined}
                {...(IS_WEB ? ({
                  onMouseEnter: () => { iconNudge.value = withTiming(4, { duration: 150 }); },
                  onMouseLeave: () => { iconNudge.value = withTiming(0, { duration: 150 }); },
                } as any) : {})}
              >
                <AnimatedRN.View style={iconNudgeStyle}>
                  <GraduationCap size={13} color={C.dark} />
                </AnimatedRN.View>
                <Text style={styles.enrolText}>{showPills ? 'Enrol Now' : 'Enrol'}</Text>
              </TouchableOpacity>
            </AnimatedRN.View>

            {/* Call Now — icon only on mobile */}
            {showHamburger && (
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${COMPANY.primaryPhone.replace(/\s/g, '')}`)}
                activeOpacity={0.85}
                style={[styles.iconBtn, { backgroundColor: C.red }]}
              >
                <AnimatedRN.View style={phoneShakeStyle}>
                  <Phone size={15} color={C.white} />
                </AnimatedRN.View>
              </TouchableOpacity>
            )}

            {/* Hamburger — native always, and narrow web viewports */}
            {showHamburger && (
              <TouchableOpacity
                onPress={openDrawer}
                style={[styles.iconBtn, { backgroundColor: btnBg }]}
                activeOpacity={0.8}
              >
                <Menu size={18} color={iconC} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Lane strip */}
      <LaneStrip />

      {/* ══════════════════════════════════════════════════════════════════════
          Mobile drawer
      ══════════════════════════════════════════════════════════════════════ */}
      {showHamburger && (
        <Modal visible={drawerOpen} transparent animationType="none" onRequestClose={closeDrawer}>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(34,31,32,0.55)' }}
            activeOpacity={1}
            onPress={closeDrawer}
          >
            <Animated.View
              style={[
                styles.drawer,
                { backgroundColor: isDark ? C.dark : C.white },
                { transform: [{ translateX: drawerTranslate }] },
              ]}
            >
              <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
                {/* Drawer header */}
                <View style={[styles.drawerHeader, { backgroundColor: C.skyDeep }]}>
                  <View style={styles.logoRow}>
                    <Image source={LOGO} style={[styles.logoImg, { width: 52, height: 52 }]} resizeMode="contain" />
                    <Text style={styles.brandName}>{t('nav.brand')}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <TouchableOpacity
                      onPress={toggleColorScheme}
                      style={{ padding: 7, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.15)' }}
                      activeOpacity={0.8}
                    >
                      {isDark
                        ? <Sun  size={15} color={C.yellow} />
                        : <Moon size={15} color="rgba(255,255,255,0.85)" />}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={closeDrawer} style={{ padding: 4 }}>
                      <X size={20} color="rgba(255,255,255,0.70)" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Nav items */}
                <RNScrollView style={{ paddingTop: 8, flex: 1 }}>
                  {NAV_ITEMS.map(item => {
                    const active = isItemActive(item.path);
                    return (
                      <TouchableOpacity
                        key={item.path}
                        onPress={() => handleNav(item.path)}
                        style={[
                          styles.drawerItem,
                          active && { backgroundColor: 'rgba(1,165,240,0.08)', borderLeftWidth: 3, borderLeftColor: C.skyDeep },
                        ]}
                        activeOpacity={0.7}
                      >
                        <Text style={{
                          color:      active ? C.skyDeep : (isDark ? C.white : C.dark),
                          fontFamily: active ? F.semibold : F.regular,
                          fontSize:   14,
                        }}>
                          {t('nav.' + item.key)}
                        </Text>
                        <ChevronRight size={15} color="rgba(34,31,32,0.40)" />
                      </TouchableOpacity>
                    );
                  })}

                  {/* Drawer CTAs */}
                  <View style={styles.drawerCTAs}>
                    <TouchableOpacity
                      onPress={() => { closeDrawer(); openEnrollModal(); }}
                      style={[styles.enrolBtn, { paddingVertical: 13, borderRadius: 11, justifyContent: 'center' }]}
                      activeOpacity={0.85}
                    >
                      <GraduationCap size={15} color={C.dark} />
                      <Text style={styles.enrolText}>Enrol Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => { closeDrawer(); Linking.openURL(`tel:${COMPANY.primaryPhone.replace(/\s/g, '')}`); }}
                      style={[styles.callBtn, { paddingVertical: 13, borderRadius: 11, justifyContent: 'center' }]}
                      activeOpacity={0.85}
                    >
                      <Phone size={14} color={C.white} />
                      <Text style={styles.callText}>Call Now</Text>
                    </TouchableOpacity>
                  </View>
                </RNScrollView>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    borderBottomWidth: 1,
    zIndex: 50,
  },
  rowInner: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  logoImg: {
    width: 62,
    height: 62,
    borderRadius: 12,
  },
  brandName: {
    fontFamily: F.bold,
    fontSize: 19,
    letterSpacing: 0.3,
    color: C.white,
  },
  brandTag: {
    color: C.yellow,
    fontFamily: F.semibold,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  pillRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    justifyContent: 'center',
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
  pillOuter: {
    height: PILL_H,
    borderRadius: PILL_H / 2,
    backgroundColor: C.white,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34,31,32,0.10)',
  },
  pillCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillLabel: {
    color: C.white,
    fontFamily: F.bold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  iconBtn: {
    borderRadius: 8,
    padding: 7,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.red,
    paddingHorizontal: IS_WEB ? 14 : 10,
    paddingVertical: 7,
    borderRadius: 18,
    shadowColor: C.red,
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  callText: {
    fontFamily: F.semibold,
    fontSize: 12,
    color: C.white,
  },
  enrolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.yellow,
    paddingHorizontal: IS_WEB ? 16 : 12,
    paddingVertical: 8,
    borderRadius: 18,
    shadowColor: C.yellow,
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  enrolText: {
    color: C.dark,
    fontFamily: F.bold,
    fontSize: 12,
  },
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
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  drawerCTAs: {
    padding: 20,
    marginTop: 8,
    gap: 10,
  },
});
