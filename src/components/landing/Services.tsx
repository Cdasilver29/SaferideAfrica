import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useColorScheme } from 'nativewind';
import { BookOpen, GraduationCap, Shield, Car, ChevronRight, Monitor, Calendar, Library } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, SERVICES } from './constants';

const SERVICE_ICON_MAP: Record<string, React.ComponentType<any>> = {
  BookOpen, GraduationCap, Shield, Car,
};

// Maps iconName from constants → translation key in services.items
const SERVICE_KEY_MAP: Record<string, string> = {
  BookOpen:      'videoCourses',
  GraduationCap: 'instructorTraining',
  Shield:        'getLicense',
  Car:           'easyLearn',
};

// Only non-translatable data lives here; titles/descs come from t()
const DIGITAL_CAMPUS_META = [
  { key: 'onlineClasses', Icon: Monitor,  color: C.blue },
  { key: 'bookings',      Icon: Calendar, color: C.amberDark },
  { key: 'lms',           Icon: Library,  color: C.blueDark },
];

function RevealCard({ children, delay = 0, flex }: { children: React.ReactNode; delay?: number; flex?: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 500, delay, useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View style={{ flex, opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }] }}>
      {children}
    </Animated.View>
  );
}

function ServiceCard({ Icon, title, desc, isDark, readMore }: { Icon: React.ComponentType<any>; title: string; desc: string; isDark: boolean; readMore: string }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, tension: 200, friction: 10 }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, tension: 200, friction: 10 }).start();

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ scale: scaleAnim }],
        backgroundColor: isDark ? C.darkBg : '#f0f9ff',
        borderRadius: 18, padding: 22, alignItems: 'center',
        borderWidth: 1, borderColor: isDark ? C.darkBorder : '#bae6fd',
        shadowColor: C.blue, shadowOpacity: 0.07, shadowRadius: 10, elevation: 2,
      }}
    >
      <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: C.blue, alignItems: 'center', justifyContent: 'center', marginBottom: 14, shadowColor: C.blue, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4 }}>
        <Icon size={26} color="#ffffff" />
      </View>
      <View style={{ width: 28, height: 3, borderRadius: 2, backgroundColor: C.yellow, marginBottom: 12 }} />
      <Text style={{ color: isDark ? '#f8fafc' : C.heading, fontFamily: F.bold, fontSize: 15, textAlign: 'center', marginBottom: 8 }}>{title}</Text>
      <Text style={{ color: isDark ? C.mutedDark : C.muted, fontFamily: F.regular, fontSize: 12, lineHeight: 19, textAlign: 'center', marginBottom: 14 }}>{desc}</Text>
      <TouchableOpacity onPressIn={onPressIn} onPressOut={onPressOut} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }} activeOpacity={0.75}>
        <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 12 }}>{readMore}</Text>
        <ChevronRight size={13} color={C.blue} />
      </TouchableOpacity>
    </Animated.View>
  );
}

function DigitalCampusCard({ Icon, title, desc, color, delay, isDark }: { Icon: React.ComponentType<any>; title: string; desc: string; color: string; delay: number; isDark: boolean }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 500, delay, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
        flexDirection: 'row', alignItems: 'flex-start', gap: 16,
        backgroundColor: isDark ? C.darkBg : '#ffffff',
        borderRadius: 16, padding: 18, marginBottom: 14,
        borderWidth: 1, borderColor: isDark ? C.darkBorder : '#e5e7eb',
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
      }}
    >
      <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: color, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={22} color="#ffffff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: isDark ? '#f8fafc' : C.heading, fontFamily: F.bold, fontSize: 15, marginBottom: 5 }}>{title}</Text>
        <Text style={{ color: isDark ? C.mutedDark : C.muted, fontFamily: F.regular, fontSize: 12, lineHeight: 19 }}>{desc}</Text>
      </View>
    </Animated.View>
  );
}

export default function Services() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const readMore = t('services.readMore');

  return (
    <View style={{ backgroundColor: isDark ? C.darkCard : '#ffffff', paddingVertical: 72, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        {/* Section heading */}
        <View style={{ alignItems: 'center', marginBottom: 44 }}>
          <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>
            {t('services.overline')}
          </Text>
          <Text style={{ color: isDark ? '#f8fafc' : C.heading, fontFamily: F.bold, fontSize: IS_WEB ? 34 : 26, textAlign: 'center', lineHeight: IS_WEB ? 44 : 34, marginBottom: 12 }}>
            {t('services.heading')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue }} />
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
          </View>
        </View>

        <View style={IS_WEB ? { flexDirection: 'row', gap: 40, alignItems: 'flex-start' } : {}}>

          {/* LEFT: 4 service cards in 2×2 grid */}
          <View style={IS_WEB ? { flex: 1 } : {}}>
            <View style={{ flexDirection: 'row', gap: 14, marginBottom: 14 }}>
              {SERVICES.slice(0, 2).map((svc, i) => {
                const Icon = SERVICE_ICON_MAP[svc.iconName] ?? Car;
                const key  = SERVICE_KEY_MAP[svc.iconName] ?? svc.iconName;
                return (
                  <RevealCard key={svc.title} delay={i * 80} flex={1}>
                    <ServiceCard
                      Icon={Icon}
                      title={t(`services.items.${key}.title`)}
                      desc={t(`services.items.${key}.desc`)}
                      isDark={isDark}
                      readMore={readMore}
                    />
                  </RevealCard>
                );
              })}
            </View>
            <View style={{ flexDirection: 'row', gap: 14 }}>
              {SERVICES.slice(2, 4).map((svc, i) => {
                const Icon = SERVICE_ICON_MAP[svc.iconName] ?? Car;
                const key  = SERVICE_KEY_MAP[svc.iconName] ?? svc.iconName;
                return (
                  <RevealCard key={svc.title} delay={(i + 2) * 80} flex={1}>
                    <ServiceCard
                      Icon={Icon}
                      title={t(`services.items.${key}.title`)}
                      desc={t(`services.items.${key}.desc`)}
                      isDark={isDark}
                      readMore={readMore}
                    />
                  </RevealCard>
                );
              })}
            </View>
          </View>

          {/* RIGHT: Digital Campus */}
          <View style={IS_WEB ? { flex: 1 } : { marginTop: 36 }}>
            <View style={{ marginBottom: 22 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <View style={{ width: 4, height: 28, borderRadius: 2, backgroundColor: C.yellow }} />
                <Text style={{ color: isDark ? '#f8fafc' : C.heading, fontFamily: F.bold, fontSize: IS_WEB ? 24 : 20 }}>
                  {t('services.digitalCampusTitle')}
                </Text>
              </View>
              <Text style={{ color: isDark ? C.mutedDark : C.muted, fontFamily: F.regular, fontSize: 13, lineHeight: 21 }}>
                {t('services.digitalCampusSubtitle')}
              </Text>
            </View>

            {DIGITAL_CAMPUS_META.map((item, i) => (
              <DigitalCampusCard
                key={item.key}
                Icon={item.Icon}
                title={t(`services.items.${item.key}.title`)}
                desc={t(`services.items.${item.key}.desc`)}
                color={item.color}
                delay={i * 120}
                isDark={isDark}
              />
            ))}
          </View>

        </View>
      </View>
    </View>
  );
}
