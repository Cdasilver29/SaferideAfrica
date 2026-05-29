import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, Animated, ViewStyle,
} from 'react-native';
import { router } from 'expo-router';
import { Award, CheckCircle, Users, Play, ChevronDown } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, SCREEN_H, HERO_SRC } from './constants';

// Typewriter that types the full sentence, holds briefly, erases, then loops forever.
// Re-mounts via key={i18n.language} in Hero, so subheadline is always the current locale.
function TypewriterText({ subheadline }: { subheadline: string }) {
  const [displayed, setDisplayed] = useState('');
  const cursorAnim = useRef(new Animated.Value(1)).current;
  const activeRef  = useRef(true);

  useEffect(() => {
    activeRef.current = true;
    setDisplayed('');

    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorAnim, { toValue: 0, duration: 480, useNativeDriver: true }),
        Animated.timing(cursorAnim, { toValue: 1, duration: 480, useNativeDriver: true }),
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

// Animated word-by-word headline. Re-mounts via key={i18n.language} so words refresh on locale change.
function AnimatedHeadline({ words, accentFrom }: { words: string[]; accentFrom: number }) {
  const anims = useRef(words.map(() => new Animated.Value(0))).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const stagger = Animated.stagger(
      90,
      anims.map(a => Animated.timing(a, { toValue: 1, duration: 500, useNativeDriver: true }))
    );
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 1800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 1800, useNativeDriver: true }),
      ])
    );
    stagger.start(() => pulse.start());
    return () => { stagger.stop(); pulse.stop(); };
  }, []);

  const fontSize = IS_WEB ? 58 : 38;
  const lineH    = IS_WEB ? 70 : 48;

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
      {words.filter(w => w.length > 0).map((word, i) => {
        const isAccent = i >= accentFrom;
        const anim = anims[i] ?? new Animated.Value(1);
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
            <Text style={{ color: isAccent ? C.yellow : C.white, fontFamily: F.bold, fontSize, lineHeight: lineH }}>
              {word}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
}

interface HeroProps {
  onScrollToCourses: () => void;
}

export default function Hero({ onScrollToCourses }: HeroProps) {
  const { t, i18n } = useTranslation();

  const words = t('hero.headlineWords', { returnObjects: true }) as string[];
  const visibleWords = words.filter(w => w.length > 0);
  const accentFrom = Math.max(0, visibleWords.length - 2);

  const subheadline = t('hero.subheadline');

  const TRUST_BADGES = [
    { Icon: CheckCircle, label: t('hero.trustNtsa') },
    { Icon: Award,       label: t('hero.trustAward') },
    { Icon: Users,       label: t('hero.trustPassRate') },
  ];

  const heroH = IS_WEB ? 700 : SCREEN_H * 0.9;
  const center: ViewStyle = IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {};

  return (
    <View style={{ height: heroH, overflow: 'hidden' }}>
      <Image
        source={HERO_SRC}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
        resizeMode="cover"
      />
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,18,36,0.72)' }} />
      <View pointerEvents="none" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, backgroundColor: 'rgba(10,18,36,0.55)' }} />

      <View style={[{ flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 }, center]}>

        {/* Badge */}
        <View style={{ flexDirection: 'row', marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: 'rgba(251,191,36,0.15)', borderWidth: 1, borderColor: 'rgba(251,191,36,0.4)' }}>
            <Award size={13} color={C.yellow} />
            <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' }}>
              {t('hero.badge')}
            </Text>
          </View>
        </View>

        {/* Animated headline — key forces remount on language change so animation restarts */}
        <AnimatedHeadline key={i18n.language + '-headline'} words={visibleWords} accentFrom={accentFrom} />

        {/* Typewriter sub-headline — key forces remount so effect restarts with new text */}
        <TypewriterText key={i18n.language + '-sub'} subheadline={subheadline} />

        {/* Trust badges */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
          {TRUST_BADGES.map(({ Icon, label }) => (
            <View
              key={label}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.10)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.20)' }}
            >
              <Icon size={12} color={C.yellow} />
              <Text style={{ color: C.white, fontFamily: F.medium, fontSize: 12 }}>{label}</Text>
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

          <TouchableOpacity
            onPress={() => router.push('/login')}
            style={{ paddingVertical: 15, paddingHorizontal: 28, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 2, borderColor: 'rgba(255,255,255,0.45)' }}
            activeOpacity={0.75}
          >
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}>
              <Play size={12} color={C.white} fill={C.white} />
            </View>
            <Text style={{ color: C.white, fontFamily: F.semibold, fontSize: 15 }}>{t('hero.watchStory')}</Text>
          </TouchableOpacity>
        </View>

        {IS_WEB && (
          <TouchableOpacity
            onPress={onScrollToCourses}
            style={{ position: 'absolute', bottom: 32, left: 0, right: 0, alignItems: 'center' }}
            activeOpacity={0.7}
          >
            <Animated.View style={{ padding: 10, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <ChevronDown size={20} color="rgba(255,255,255,0.6)" />
            </Animated.View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
