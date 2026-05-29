import React, { useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Modal,
  ScrollView as RNScrollView, ViewStyle,
} from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Car, Menu, X, ChevronRight, Sun, Moon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, NAV_ITEMS } from './constants';

// Maps the section key used in NAV_ITEMS to the matching nav translation key
const SECTION_TO_NAV_KEY: Record<string, string> = {
  hero:     'home',
  services: 'services',
  courses:  'courses',
  about:    'about',
  gallery:  'gallery',
  footer:   'contact',
};

interface NavbarProps {
  scrollY: Animated.Value;
  onNavPress: (section: string) => void;
  activeSection: string;
}

export default function Navbar({ scrollY, onNavPress, activeSection }: NavbarProps) {
  const { t } = useTranslation();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pillExpanded, setPillExpanded] = useState(false);
  const pillWidth = useRef(new Animated.Value(0)).current;
  const drawerAnim = useRef(new Animated.Value(0)).current;

  const navBg = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: ['rgba(15,23,42,0.6)', 'rgba(15,23,42,0.98)'],
    extrapolate: 'clamp',
  });
  const navBorder = scrollY.interpolate({
    inputRange: [60, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const expandPill = () => {
    setPillExpanded(true);
    Animated.spring(pillWidth, { toValue: 1, useNativeDriver: false, tension: 140, friction: 10 }).start();
  };

  const collapsePill = () => {
    Animated.spring(pillWidth, { toValue: 0, useNativeDriver: false, tension: 160, friction: 11 }).start(() => setPillExpanded(false));
  };

  const togglePill = () => (pillExpanded ? collapsePill() : expandPill());

  const animatedPillW = pillWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [120, NAV_ITEMS.length * 96],
  });

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(drawerAnim, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setDrawerOpen(false));
  };

  const drawerTranslate = drawerAnim.interpolate({ inputRange: [0, 1], outputRange: [-320, 0] });

  const handleNav = (section: string) => {
    onNavPress(section);
    closeDrawer();
    collapsePill();
  };

  const activeNavKey = SECTION_TO_NAV_KEY[activeSection] ?? activeSection;
  const activeLabel = t('nav.' + activeNavKey);

  return (
    <>
      <Animated.View
        style={{
          position: 'relative',
          zIndex: 50,
          backgroundColor: navBg as any,
          borderBottomWidth: 1,
          borderBottomColor: C.darkBorder,
          borderBottomOpacity: navBorder as any,
        } as ViewStyle}
      >
        <View
          style={{
            maxWidth: IS_WEB ? MAX_W : undefined,
            width: '100%',
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 24,
            paddingVertical: 14,
          }}
        >
          {/* Logo */}
          <TouchableOpacity
            onPress={() => handleNav('hero')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            activeOpacity={0.85}
          >
            <View style={{ backgroundColor: C.yellow, borderRadius: 10, padding: 7, shadowColor: C.yellow, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 }}>
              <Car size={20} color={C.dark} />
            </View>
            <View>
              <Text style={{ color: C.white, fontFamily: F.bold, fontSize: 17, letterSpacing: 0.3 }}>
                {t('nav.brand')}
              </Text>
              <Text style={{ color: C.yellow, fontFamily: F.regular, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                {t('nav.tagline')}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Web: animated pill nav */}
          {IS_WEB && (
            <TouchableOpacity onPress={togglePill} activeOpacity={1}>
              <Animated.View
                style={{
                  width: animatedPillW,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.15)',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: pillExpanded ? 'space-around' : 'center',
                  overflow: 'hidden',
                  paddingHorizontal: 12,
                  shadowColor: '#000',
                  shadowOpacity: 0.25,
                  shadowRadius: 10,
                  elevation: 4,
                }}
              >
                {pillExpanded ? (
                  NAV_ITEMS.map(item => {
                    const navKey = SECTION_TO_NAV_KEY[item.section] ?? item.section;
                    return (
                      <TouchableOpacity
                        key={item.section}
                        onPress={() => handleNav(item.section)}
                        style={{ paddingHorizontal: 10, paddingVertical: 6 }}
                      >
                        <Text
                          style={{
                            color: activeSection === item.section ? C.yellow : 'rgba(255,255,255,0.85)',
                            fontFamily: activeSection === item.section ? F.semibold : F.medium,
                            fontSize: 13,
                          }}
                        >
                          {t('nav.' + navKey)}
                        </Text>
                        {activeSection === item.section && (
                          <View style={{ height: 2, backgroundColor: C.yellow, borderRadius: 1, marginTop: 2 }} />
                        )}
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <Text style={{ color: C.yellow, fontFamily: F.semibold, fontSize: 13 }}>
                    {activeLabel}
                  </Text>
                )}
              </Animated.View>
            </TouchableOpacity>
          )}

          {/* Right cluster */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity
              onPress={toggleColorScheme}
              style={{ backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' }}
              activeOpacity={0.8}
            >
              {isDark ? <Sun size={16} color={C.yellow} /> : <Moon size={16} color="#e2e8f0" />}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/login')}
              style={{ backgroundColor: C.yellow, paddingHorizontal: IS_WEB ? 20 : 14, paddingVertical: 9, borderRadius: 20, shadowColor: C.yellow, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 }}
              activeOpacity={0.85}
            >
              <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 13 }}>{t('nav.signIn')}</Text>
            </TouchableOpacity>

            {!IS_WEB && (
              <TouchableOpacity
                onPress={openDrawer}
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' }}
                activeOpacity={0.8}
              >
                <Menu size={20} color={C.white} />
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
                    <View style={{ backgroundColor: C.yellow, borderRadius: 8, padding: 6 }}>
                      <Car size={18} color={C.dark} />
                    </View>
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

                  <View style={{ padding: 20, marginTop: 8 }}>
                    <TouchableOpacity
                      onPress={() => { closeDrawer(); router.push('/login'); }}
                      style={{ backgroundColor: C.yellow, paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
                      activeOpacity={0.85}
                    >
                      <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 14 }}>{t('nav.signInRegister')}</Text>
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
