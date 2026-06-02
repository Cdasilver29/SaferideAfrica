import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity, Animated, Modal,
  ScrollView as RNScrollView, ViewStyle, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Menu, X, ChevronRight, Sun, Moon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import Reanimated, {
  useSharedValue, useAnimatedStyle, withSpring, interpolate,
  Extrapolation, runOnJS, type SharedValue,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { C, F, IS_WEB, MAX_W, NAV_ITEMS } from './constants';
import { useAuth } from '@/context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

// Facebook blue palette — keeps in sync with --nav-bg-* CSS tokens in global.css
const FB_SOLID_LIGHT = 'rgb(24,119,242)'
const FB_GLASS_LIGHT = 'rgba(24,119,242,0.55)'
const FB_SOLID_DARK  = 'rgb(16,96,204)'
const FB_GLASS_DARK  = 'rgba(16,96,204,0.55)'

const LOGO = require('../../../assets/images/saferide-logo.png');

const SECTION_TO_NAV_KEY: Record<string, string> = {
  hero:     'home',
  services: 'services',
  courses:  'courses',
  about:    'about',
  gallery:  'gallery',
  footer:   'contact',
};

const PILL_COLLAPSED_W = 180;
const PILL_EXPANDED_W  = 460;   // capped so pill never touches logo or right cluster
const SPRING_CFG       = { damping: 18, stiffness: 180 } as const;
const BTN_SPRING       = { friction: 7, tension: 280 } as const;

// ─── Per-item animated nav item ───────────────────────────────────────────────
interface PillNavItemProps {
  item:         typeof NAV_ITEMS[0];
  index:        number;
  totalItems:   number;
  pillProgress: SharedValue<number>;
  activeSection:string;
  onPress:      () => void;
  t:            (key: string) => string;
}

function PillNavItem({
  item, index, totalItems, pillProgress, activeSection, onPress, t,
}: PillNavItemProps) {
  const { colorScheme } = useColorScheme();
  const navKey  = SECTION_TO_NAV_KEY[item.section] ?? item.section;
  const isActive = activeSection === item.section;
  // In light mode, yellow on Facebook blue is high-contrast and on-brand.
  // In dark mode, white reads well on the darker blue.
  const inactiveColor = colorScheme === 'dark' ? 'rgba(255,255,255,0.85)' : C.yellow;

  const style = useAnimatedStyle(() => {
    const start = 0.05 + index * (0.65 / totalItems);
    const end   = start + 0.25;
    const p = interpolate(pillProgress.value, [start, end], [0, 1], Extrapolation.CLAMP);
    return {
      opacity: p,
      transform: [{ translateX: interpolate(p, [0, 1], [14, 0]) }],
    };
  });

  return (
    <Reanimated.View style={style}>
      <TouchableOpacity
        onPress={onPress}
        style={{ paddingHorizontal: 10, paddingVertical: 6 }}
        activeOpacity={0.75}
      >
        <Text
          style={{
            color:      isActive ? C.yellow : inactiveColor,
            fontFamily: isActive ? F.semibold : F.medium,
            fontSize:   13,
          }}
        >
          {t('nav.' + navKey)}
        </Text>
        {isActive && (
          <View style={{ height: 2, backgroundColor: C.yellow, borderRadius: 1, marginTop: 2 }} />
        )}
      </TouchableOpacity>
    </Reanimated.View>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
interface NavbarProps {
  scrollY:       Animated.Value;
  onNavPress:    (section: string) => void;
  activeSection: string;
}

export default function Navbar({ scrollY, onNavPress, activeSection }: NavbarProps) {
  const { t }    = useTranslation();
  const { user } = useAuth();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Sky blue means white text in all states
  const NAV_FG      = '#ffffff';
  const NAV_FG_MUTED = isDark ? '#bae6fd' : '#e0f2fe';

  // Pill and button surfaces: white-tinted on Facebook blue
  const pillBg     = 'rgba(255,255,255,0.15)';
  const pillBorder = 'rgba(255,255,255,0.28)';
  const btnBg      = 'rgba(255,255,255,0.18)';
  const btnBorder  = 'rgba(255,255,255,0.30)';

  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [pillExpanded, setPillExpanded] = useState(false);
  const [isScrolled,   setIsScrolled]   = useState(false);

  // Scroll listener drives the resting→glass transition at 80px
  useEffect(() => {
    const id = scrollY.addListener(({ value }) => setIsScrolled(value > 80));
    return () => scrollY.removeListener(id);
  }, [scrollY]);

  // Reanimated — pill progress (0 = collapsed, 1 = expanded)
  const pillProgress = useSharedValue(0);

  // RN Animated — drawer slide + button press animations (native driver)
  const drawerAnim = useRef(new Animated.Value(0)).current;
  const regAnim    = useRef(new Animated.Value(1)).current;
  const signAnim   = useRef(new Animated.Value(1)).current;

  const springPress = (anim: Animated.Value, cb: () => void) => {
    Animated.sequence([
      Animated.spring(anim, { toValue: 0.92, useNativeDriver: true, ...BTN_SPRING }),
      Animated.spring(anim, { toValue: 1,    useNativeDriver: true, ...BTN_SPRING }),
    ]).start(() => cb());
  };

  // ── Background: Facebook blue at rest → translucent FB blue when scrolled past 80px ──
  const solidBg  = isDark ? FB_SOLID_DARK : FB_SOLID_LIGHT;
  const glassyBg = isDark ? FB_GLASS_DARK : FB_GLASS_LIGHT;

  // Web uses CSS variables; native uses hardcoded rgba
  const navBgWeb    = isScrolled ? 'rgba(var(--nav-bg-glass))' : 'rgb(var(--nav-bg-solid))';
  const navBgNative = isScrolled ? glassyBg : solidBg;

  // ── Pill animations ────────────────────────────────────────────────────────
  const expandPill = () => {
    setPillExpanded(true);
    pillProgress.value = withSpring(1, SPRING_CFG);
  };

  const collapsePill = () => {
    pillProgress.value = withSpring(0, SPRING_CFG, (finished) => {
      if (finished) runOnJS(setPillExpanded)(false);
    });
  };

  const togglePill = () => (pillExpanded ? collapsePill() : expandPill());

  const pillWidthStyle = useAnimatedStyle(() => ({
    width: interpolate(
      pillProgress.value,
      [0, 1],
      [PILL_COLLAPSED_W, PILL_EXPANDED_W],
      Extrapolation.CLAMP,
    ),
  }));

  const labelFadeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pillProgress.value, [0, 0.2], [1, 0], Extrapolation.CLAMP),
  }));

  // ── Drawer ─────────────────────────────────────────────────────────────────
  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(drawerAnim, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(
      () => setDrawerOpen(false),
    );
  };

  const drawerTranslate = drawerAnim.interpolate({ inputRange: [0, 1], outputRange: [-320, 0] });

  const handleNav = (section: string) => {
    onNavPress(section);
    closeDrawer();
    collapsePill();
  };

  const activeNavKey = SECTION_TO_NAV_KEY[activeSection] ?? activeSection;
  const activeLabel  = t('nav.' + activeNavKey);

  const hoverProps = IS_WEB
    ? ({ onMouseEnter: expandPill, onMouseLeave: collapsePill } as any)
    : {};

  return (
    <>
      <Animated.View
        style={[
          {
            position:          'relative',
            zIndex:            50,
            backgroundColor:   IS_WEB ? navBgWeb : navBgNative,
            borderBottomWidth: isScrolled ? 1 : 0,
            borderBottomColor: 'rgba(255,255,255,0.18)',
          } as ViewStyle,
          IS_WEB && ({
            backdropFilter:       isScrolled ? 'blur(18px) saturate(160%)' : 'none',
            WebkitBackdropFilter: isScrolled ? 'blur(18px) saturate(160%)' : 'none',
            transition:           'background-color 0.35s ease, backdrop-filter 0.35s ease',
          } as any),
        ]}
      >
        {/* Native frosted-glass: only when scrolled past 80px */}
        {Platform.OS !== 'web' && isScrolled && (
          <BlurView
            intensity={70}
            tint="light"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        )}

        <View
          style={{
            maxWidth:          IS_WEB ? MAX_W : undefined,
            width:             '100%',
            alignSelf:         'center',
            flexDirection:     'row',
            alignItems:        'center',
            justifyContent:    'space-between',
            paddingHorizontal: 24,
            paddingVertical:   14,
          }}
        >
          {/* Logo */}
          <TouchableOpacity
            onPress={() => handleNav('hero')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            activeOpacity={0.85}
          >
            <Image source={LOGO} style={{ width: 44, height: 44, borderRadius: 8 }} resizeMode="contain" />
            <View>
              <Text style={{ color: isDark ? NAV_FG : C.yellow, fontFamily: F.bold, fontSize: 17, letterSpacing: 0.3 }}>
                {t('nav.brand')}
              </Text>
              <Text style={{ color: C.yellow, fontFamily: F.regular, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                {t('nav.tagline')}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Web: animated pill nav — flex:1 + margin keeps it from touching logo or right cluster */}
          {IS_WEB && (
            <View style={{ flex: 1, alignItems: 'center', marginHorizontal: 16 }}>
            <TouchableOpacity onPress={togglePill} activeOpacity={1} {...hoverProps}>
              <Reanimated.View
                style={[
                  {
                    height:            42,
                    borderRadius:      21,
                    backgroundColor:   pillBg,
                    borderWidth:       1,
                    borderColor:       pillBorder,
                    flexDirection:     'row',
                    alignItems:        'center',
                    justifyContent:    pillExpanded ? 'space-around' : 'center',
                    overflow:          'hidden',
                    paddingHorizontal: 12,
                    shadowColor:       '#000',
                    shadowOpacity:     0.20,
                    shadowRadius:      8,
                    elevation:         4,
                  },
                  pillWidthStyle,
                ]}
              >
                <Reanimated.View
                  pointerEvents="none"
                  style={[
                    { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
                    labelFadeStyle,
                  ]}
                >
                  <Text style={{ color: C.yellow, fontFamily: F.semibold, fontSize: 13 }}>
                    {activeLabel}
                  </Text>
                </Reanimated.View>

                {pillExpanded && NAV_ITEMS.map((item, i) => (
                  <PillNavItem
                    key={item.section}
                    item={item}
                    index={i}
                    totalItems={NAV_ITEMS.length}
                    pillProgress={pillProgress}
                    activeSection={activeSection}
                    onPress={() => handleNav(item.section)}
                    t={t}
                  />
                ))}
              </Reanimated.View>
            </TouchableOpacity>
            </View>
          )}

          {/* Right cluster */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {/* Language switcher — web only; mobile accesses it via drawer */}
            {IS_WEB && <LanguageSwitcher />}

            {/* Dark-mode toggle — white circle on Facebook blue */}
            <TouchableOpacity
              onPress={toggleColorScheme}
              style={{ backgroundColor: btnBg, borderRadius: 8, padding: 8, borderWidth: 1, borderColor: btnBorder }}
              activeOpacity={0.8}
            >
              {isDark ? <Sun size={16} color={C.yellow} /> : <Moon size={16} color={C.dark} />}
            </TouchableOpacity>

            {/* Register — outlined button, web only, guests only */}
            {IS_WEB && !user && (
              <Animated.View style={{ transform: [{ scale: regAnim }] }}>
                <TouchableOpacity
                  onPress={() => springPress(regAnim, () => router.push('/register'))}
                  activeOpacity={1}
                  style={{
                    borderWidth: 1.5,
                    borderColor: isDark ? 'rgba(255,255,255,0.75)' : C.yellow,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ color: isDark ? NAV_FG : C.yellow, fontFamily: F.semibold, fontSize: 13 }}>
                    Register
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Sign In / My Account — yellow filled button */}
            <Animated.View style={{ transform: [{ scale: signAnim }] }}>
              <TouchableOpacity
                onPress={() => springPress(signAnim, () => router.push(user ? '/account' : '/login'))}
                activeOpacity={1}
                style={{ backgroundColor: C.yellow, paddingHorizontal: IS_WEB ? 18 : 14, paddingVertical: 9, borderRadius: 20, shadowColor: C.yellow, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 }}
              >
                <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 13 }}>
                  {user ? 'My Account' : t('nav.signIn')}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Mobile hamburger */}
            {!IS_WEB && (
              <TouchableOpacity
                onPress={openDrawer}
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' }}
                activeOpacity={0.8}
              >
                <Menu size={20} color={NAV_FG} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>

      {/* Mobile slide-in drawer */}
      {!IS_WEB && (
        <Modal visible={drawerOpen} transparent animationType="none" onRequestClose={closeDrawer}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' }} activeOpacity={1} onPress={closeDrawer}>
            <Animated.View
              style={{
                position: 'absolute', top: 0, left: 0, bottom: 0, width: 280,
                backgroundColor: C.darkCard,
                transform: [{ translateX: drawerTranslate }],
                shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20, elevation: 16,
              }}
            >
              <TouchableOpacity activeOpacity={1}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: C.darkBorder }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Image source={LOGO} style={{ width: 36, height: 36, borderRadius: 6 }} resizeMode="contain" />
                    <Text style={{ color: C.white, fontFamily: F.bold, fontSize: 15 }}>{t('nav.brand')}</Text>
                  </View>
                  <TouchableOpacity onPress={closeDrawer} style={{ padding: 4 }}>
                    <X size={20} color={C.mutedDark} />
                  </TouchableOpacity>
                </View>

                <RNScrollView style={{ paddingTop: 12 }}>
                  {NAV_ITEMS.map(item => {
                    const navKey = SECTION_TO_NAV_KEY[item.section] ?? item.section;
                    return (
                      <TouchableOpacity
                        key={item.section}
                        onPress={() => handleNav(item.section)}
                        style={{
                          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                          paddingHorizontal: 20, paddingVertical: 16,
                          backgroundColor: activeSection === item.section ? 'rgba(251,191,36,0.08)' : 'transparent',
                          borderLeftWidth: activeSection === item.section ? 3 : 0,
                          borderLeftColor: C.yellow,
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={{ color: activeSection === item.section ? C.yellow : C.white, fontFamily: activeSection === item.section ? F.semibold : F.regular, fontSize: 15 }}>
                          {t('nav.' + navKey)}
                        </Text>
                        <ChevronRight size={16} color={C.mutedDark} />
                      </TouchableOpacity>
                    );
                  })}

                  <View style={{ padding: 20, marginTop: 8, gap: 10 }}>
                    {user ? (
                      <TouchableOpacity
                        onPress={() => { closeDrawer(); router.push('/account'); }}
                        style={{ backgroundColor: C.yellow, paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
                        activeOpacity={0.85}
                      >
                        <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 14 }}>My Account</Text>
                      </TouchableOpacity>
                    ) : (
                      <>
                        <TouchableOpacity
                          onPress={() => { closeDrawer(); router.push('/login'); }}
                          style={{ backgroundColor: C.yellow, paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
                          activeOpacity={0.85}
                        >
                          <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 14 }}>{t('nav.signIn')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => { closeDrawer(); router.push('/register'); }}
                          style={{ paddingVertical: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: C.darkBorder }}
                          activeOpacity={0.85}
                        >
                          <Text style={{ color: C.mutedDark, fontFamily: F.bold, fontSize: 14 }}>Register</Text>
                        </TouchableOpacity>
                      </>
                    )}
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
