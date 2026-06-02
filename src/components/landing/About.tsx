import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';
import { CheckCircle, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, ABOUT_IMG } from './constants';
import { COMPANY } from '@/data/saferide';
import { useTheme } from '@/lib/theme';

const YEARS_ACTIVE = new Date().getFullYear() - COMPANY.registration.foundedYear;

const CHECKLIST_KEYS = ['tips', 'roadTest', 'parking', 'basics', 'ntsa', 'award'] as const;

export default function About() {
  const { t } = useTranslation();
  const T = useTheme();
  const imgAnim  = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(imgAnim,  { toValue: 1, duration: 600, delay: 100, useNativeDriver: true }),
      Animated.timing(textAnim, { toValue: 1, duration: 600, delay: 280, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={{ backgroundColor: T.background, paddingVertical: 72, paddingHorizontal: 24 }}>
      <View
        style={[
          IS_WEB ? { flexDirection: 'row', alignItems: 'center', gap: 56 } : {},
          IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {},
        ]}
      >
        {/* Image with badge (web only) */}
        {IS_WEB && (
          <Animated.View
            style={{
              flex: 1,
              opacity: imgAnim,
              transform: [{ translateX: imgAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }],
            }}
          >
            <View style={{ height: 420, borderRadius: 20, overflow: 'hidden', position: 'relative', shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 24, elevation: 8 }}>
              <Image
                source={ABOUT_IMG}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, backgroundColor: C.yellow }} />

              <View style={{ position: 'absolute', bottom: 28, right: -20, backgroundColor: C.yellow, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, elevation: 6, alignItems: 'center' }}>
                <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 26 }}>{YEARS_ACTIVE}+</Text>
                <Text style={{ color: C.dark, fontFamily: F.semibold, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {t('about.yearsBadge')}
                </Text>
              </View>

              {/* NTSA badge — kept as-is per Phase 2 instructions */}
              <View style={{ position: 'absolute', top: 20, left: 20, backgroundColor: C.blue, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 }}>
                <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 11, letterSpacing: 0.5 }}>{t('about.ntsaCertified')}</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Text content */}
        <Animated.View
          style={[
            IS_WEB ? { flex: 1 } : {},
            {
              opacity: textAnim,
              transform: [
                { translateX: textAnim.interpolate({ inputRange: [0, 1], outputRange: [IS_WEB ? 30 : 0, 0] }) },
                { translateY: textAnim.interpolate({ inputRange: [0, 1], outputRange: [IS_WEB ? 0 : 24, 0] }) },
              ],
            },
          ]}
        >
          <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 12 }}>
            {t('about.overline')}
          </Text>

          <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: IS_WEB ? 34 : 26, lineHeight: IS_WEB ? 44 : 34, marginBottom: 16 }}>
            {t('about.heading').replace(t('about.headingAccent'), '')}{' '}
            <Text style={{ color: C.yellow }}>{t('about.headingAccent')}</Text>
          </Text>

          <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 14, lineHeight: 24, marginBottom: 24 }}>
            {t('about.body')}
          </Text>

          {/* Checklist */}
          <View style={IS_WEB ? { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 } : { gap: 12, marginBottom: 28 }}>
            {CHECKLIST_KEYS.map(key => (
              <View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, width: IS_WEB ? '47%' : undefined }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle size={13} color={C.dark} />
                </View>
                <Text style={{ color: T.foreground, fontFamily: F.medium, fontSize: 14 }}>{t(`about.checklist.${key}`)}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => router.push('/about')}
            style={{ backgroundColor: C.blue, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12, shadowColor: C.blue, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 }}
            activeOpacity={0.85}
          >
            <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 14 }}>{t('about.cta')}</Text>
            <ArrowRight size={16} color="#ffffff" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}
