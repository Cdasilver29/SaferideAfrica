import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/lib/theme';
import {
  Shield, Award, Star, Users, Navigation, BookOpen,
  GraduationCap, CheckCircle, Monitor, ChevronRight, Briefcase,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { SERVICES, ServiceItem } from '@/data/saferide';
import { C, F, IS_WEB, MAX_W } from './constants';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Shield, Award, Star, Users, Navigation, BookOpen,
  GraduationCap, CheckCircle, Monitor, Briefcase,
};

function RevealCard({
  children,
  delay = 0,
  flex,
}: {
  children: React.ReactNode;
  delay?: number;
  flex?: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 500, delay, useNativeDriver: Platform.OS !== 'web' }).start();
  }, []);
  return (
    <Animated.View
      style={{
        flex,
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
      }}
    >
      {children}
    </Animated.View>
  );
}

function ServiceCard({
  svc,
  readMore,
}: {
  svc: ServiceItem;
  readMore: string;
}) {
  const T = useTheme();
  const Icon      = ICON_MAP[svc.iconName] ?? Shield;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const onIn  = () => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: Platform.OS !== 'web', tension: 200, friction: 10 }).start();
  const onOut = () => Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: Platform.OS !== 'web', tension: 200, friction: 10 }).start();

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ scale: scaleAnim }],
        backgroundColor: T.card,
        borderRadius: 18,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: T.border,
        shadowColor: C.blue,
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View
        style={{
          width: 54,
          height: 54,
          borderRadius: 27,
          backgroundColor: C.blue,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
          shadowColor: C.blue,
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Icon size={24} color="#ffffff" />
      </View>
      <View style={{ width: 24, height: 3, borderRadius: 2, backgroundColor: C.yellow, marginBottom: 10 }} />
      <Text
        style={{
          color: T.foreground,
          fontFamily: F.bold,
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 7,
          lineHeight: 20,
        }}
      >
        {svc.name}
      </Text>
      <Text
        style={{
          color: T.mutedForeground,
          fontFamily: F.regular,
          fontSize: 12,
          lineHeight: 18,
          textAlign: 'center',
          marginBottom: 12,
          flex: 1,
        }}
      >
        {svc.shortDesc}
      </Text>
      <TouchableOpacity
        onPress={() => router.push(`/services/${svc.code}`)}
        onPressIn={onIn}
        onPressOut={onOut}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
        activeOpacity={0.75}
      >
        <Text style={{ color: C.red, fontFamily: F.semibold, fontSize: 12 }}>{readMore}</Text>
        <ChevronRight size={13} color={C.red} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function Services() {
  const { t } = useTranslation();
  const T     = useTheme();
  const readMore = t('services.readMore');

  const rows: ServiceItem[][] = [];
  for (let i = 0; i < SERVICES.length; i += 2) {
    rows.push(SERVICES.slice(i, i + 2));
  }

  return (
    <View style={{ backgroundColor: T.background, paddingVertical: 72, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        <View style={{ alignItems: 'center', marginBottom: 44 }}>
          <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>
            {t('services.overline')}
          </Text>
          <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: IS_WEB ? 34 : 26, textAlign: 'center', lineHeight: IS_WEB ? 44 : 34, marginBottom: 12 }}>
            {t('services.heading')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue }} />
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
          </View>
        </View>

        {rows.map((pair, rowIdx) => (
          <View key={rowIdx} style={{ flexDirection: 'row', gap: 14, marginBottom: 14 }}>
            {pair.map((svc, colIdx) => (
              <RevealCard key={svc.code} delay={(rowIdx * 2 + colIdx) * 60} flex={1}>
                <ServiceCard svc={svc} readMore={readMore} />
              </RevealCard>
            ))}
            {pair.length === 1 && <View style={{ flex: 1 }} />}
          </View>
        ))}

      </View>
    </View>
  );
}
