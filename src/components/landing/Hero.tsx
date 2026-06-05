import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, Animated, Platform,
} from 'react-native';
import AnimatedRN, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming,
  interpolate, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Award, CheckCircle, Users, ChevronDown, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, SCREEN_H, HERO_SRC } from './constants';
import { KenBurnsBackground } from '../animations/KenBurnsBackground';

const NTSA_LOGO = require('../../../assets/images/ntsa-logo.png');

// Typewriter that types the full sentence, holds briefly, erases, then loops forever.
function TypewriterText({ subheadline }: { subheadline: string }) {
  const [displayed, setDisplayed] = useState('');
  const cursorAnim = useRef(new Animated.Value(1)).current;
  const activeRef  = useRef(true);

  useEffect(() => {
    activeRef.current = true;
    setDisplayed('');

    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorAnim, { toValue: 0, duration: 480, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(cursorAnim, { toValue: 1, duration: 480, useNativeDriver: Platform.OS !== 'web' }),
      ])
    );
    blink.start();

    const sleep = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

    async function runLoop() {
      await sleep(750);
      while (activeRef.current) {
        for (let i = 1; i <= subheadline.length; i++) {
          if (!activeRef.current) return;
          setDisplayed(subheadline.slice(0, i));
          await sleep(28);
        }
        await sleep(1800);
        for (let i = subheadline.length - 1; i >= 0; i--) {
          if (!activeRef.current) return;
          setDisplayed(subheadline.slice(0, i));
          await sleep(14);
        }
        await sleep(500);
      }
    }

    runLoop();
    return () => { activeRef.current = false; blink.stop(); };
  }, [subheadline]);

  return (
    <Text
      style={{
        color: 'rgba(255,255,255,0.82)',
        fontFamily: F.regular,
        fontSize: IS_WEB ? 16 : 14,
        lineHeight: IS_WEB ? 28 : 23,
        marginBottom: 28,
        maxWidth: IS_WEB ? 540 : undefined,
        minHeight: IS_WEB ? 60 : 48,
      }}
    >
      {displayed}
      <Animated.Text style={{ opacity: cursorAnim, color: C.yellow, fontFamily: F.bold }}>{'|'}</Animated.Text>
    </Text>
  );
}

// Word-by-word stagger headline — white for body words, yellow for accent words.
function AnimatedHeadline({ words, accentFrom }: { words: string[]; accentFrom: number }) {
  const anims    = useRef(words.map(() => new Animated.Value(0))).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const stagger = Animated.stagger(
      90,
      anims.map(a => Animated.timing(a, { toValue: 1, duration: 500, useNativeDriver: Platform.OS !== 'web' }))
    );
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 1800, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 1800, useNativeDriver: Platform.OS !== 'web' }),
      ])
    );
    stagger.start(() => pulse.start());
    return () => { stagger.stop(); pulse.stop(); };
  }, []);

  const fontSize = IS_WEB ? 56 : 26;
  const lineH    = IS_WEB ? 68 : 34;

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
      {words.filter(w => w.length > 0).map((word, i) => {
        const isAccent = i >= accentFrom;
        const anim     = anims[i] ?? new Animated.Value(1);
        return (
          <Animated.View
            key={word + i}
            style={{
              opacity: anim,
              transform: [
                { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
                ...(isAccent ? [{ scale: pulseAnim }] : []),
              ],
            }}
          >
            <Text style={{
              color:      isAccent ? C.yellow : C.white,
              fontFamily: F.bold,
              fontSize,
              lineHeight: lineH,
            }}>
              {word}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
}

// Yellow pulsing glow wrapper for the Enrol CTA
function GlowingEnrolButton({ onPress }: { onPress: () => void }) {
  const glow = useSharedValue(0);

  useEffect(() => {
    glow.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => {
    const radius  = interpolate(glow.value, [0, 1], [8, 22]);
    const opacity = interpolate(glow.value, [0, 1], [0.45, 0.85]);
    return {
      shadowColor: C.yellow,
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: { width: 0, height: 0 },
      elevation: interpolate(glow.value, [0, 1], [6, 14]),
      borderRadius: 12,
      ...(IS_WEB && {
        // @ts-ignore web only
        boxShadow: `0 0 ${radius}px rgba(255,216,0,${opacity})`,
      }),
    };
  });

  return (
    <AnimatedRN.View style={glowStyle}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          paddingVertical: 15,
          paddingHorizontal: 28,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          backgroundColor: 'rgba(255,255,255,0.12)',
          borderWidth: 2,
          borderColor: C.yellow,
        }}
        activeOpacity={0.8}
      >
        <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 15 }}>Enrol Now</Text>
        <ArrowRight size={16} color={C.yellow} />
      </TouchableOpacity>
    </AnimatedRN.View>
  );
}

interface HeroProps {
  onScrollToCourses: () => void;
  onEnrol?: () => void;
}

export default function Hero({ onScrollToCourses, onEnrol }: HeroProps) {
  const { t, i18n } = useTranslation();

  const words        = t('hero.headlineWords', { returnObjects: true }) as string[];
  const visibleWords = words.filter(w => w.length > 0);
  const accentFrom   = Math.max(0, visibleWords.length - 2);
  const subheadline  = t('hero.subheadline');

  const TRUST_BADGES = [
    { Icon: CheckCircle, label: t('hero.trustNtsa') },
    { Icon: Award,       label: t('hero.trustAward') },
    { Icon: Users,       label: t('hero.trustPassRate') },
  ];

  const heroH = IS_WEB ? 580 : SCREEN_H * 0.80;

  return (
    <View style={{ height: heroH, overflow: 'hidden' }}>
      <KenBurnsBackground source={HERO_SRC} />

      {/* Base overlay — navy-blue tinted dark, not flat black */}
      <LinearGradient
        colors={['rgba(1,28,72,0.38)', 'rgba(34,31,32,0.60)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' } as any}
      />

      {/* Atmospheric blue-light haze — light from far in the distance */}
      <LinearGradient
        colors={['transparent', 'rgba(88,204,247,0.18)', 'transparent']}
        start={{ x: 0.5, y: 0.05 }}
        end={{ x: 0.5, y: 0.60 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' } as any}
      />

      {/* Bottom vignette — keeps text readable */}
      <LinearGradient
        colors={['transparent', 'rgba(34,31,32,0.62)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, pointerEvents: 'none' } as any}
      />

      <View style={[
        { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 32 },
        IS_WEB ? { maxWidth: 720, paddingHorizontal: 48, paddingTop: 24 } : {},
      ]}>

        {/* NTSA badge */}
        <View style={{ flexDirection: 'row', marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: 'rgba(255,216,0,0.15)', borderWidth: 1, borderColor: 'rgba(255,216,0,0.4)' }}>
            <Image source={NTSA_LOGO} style={{ width: 20, height: 20 }} resizeMode="contain" />
            <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' }}>
              {t('hero.badge')}
            </Text>
          </View>
        </View>

        {/* Animated headline — re-mounts on language change */}
        <AnimatedHeadline
          key={i18n.language}
          words={visibleWords}
          accentFrom={accentFrom}
        />

        {/* Typewriter sub-headline */}
        <TypewriterText key={i18n.language + '-sub'} subheadline={subheadline} />

        {/* Trust badges */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: IS_WEB ? 8 : 6, marginBottom: IS_WEB ? 32 : 16 }}>
          {TRUST_BADGES.map(({ Icon, label }) => (
            <View
              key={label}
              style={{ flexDirection: 'row', alignItems: 'center', gap: IS_WEB ? 6 : 4, paddingHorizontal: IS_WEB ? 12 : 8, paddingVertical: IS_WEB ? 7 : 4, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.10)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.20)' }}
            >
              <Icon size={IS_WEB ? 12 : 10} color={C.yellow} />
              <Text style={{ color: C.white, fontFamily: F.medium, fontSize: IS_WEB ? 12 : 10 }}>{label}</Text>
            </View>
          ))}
        </View>

        {/* CTA buttons */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <TouchableOpacity
            onPress={onScrollToCourses}
            style={{ backgroundColor: C.yellow, paddingVertical: 15, paddingHorizontal: 32, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8, shadowColor: C.yellow, shadowOpacity: 0.45, shadowRadius: 14, elevation: 6 }}
            activeOpacity={0.85}
          >
            <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 15 }}>{t('hero.exploreCourses')}</Text>
            <ChevronDown size={17} color={C.dark} />
          </TouchableOpacity>

          <GlowingEnrolButton onPress={onEnrol ?? (() => router.push('/courses' as any))} />
        </View>
      </View>

      {IS_WEB && (
        <TouchableOpacity
          onPress={onScrollToCourses}
          style={{ position: 'absolute', bottom: 80, left: 0, right: 0, alignItems: 'center' }}
          activeOpacity={0.7}
        >
          <Animated.View style={{ padding: 10, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <ChevronDown size={20} color="rgba(255,255,255,0.6)" />
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
}
