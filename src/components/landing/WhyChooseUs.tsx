import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Platform } from 'react-native';
import { BookOpen, Map, Tag, Award, Clock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, WHY_FEATURES, STATS } from './constants';

const ICON_MAP: Record<string, React.ComponentType<any>> = { BookOpen, Map, Tag, Award, Clock };

// Maps iconName → translation key in whyChooseUs.items
const WHY_KEY_MAP: Record<string, string> = {
  BookOpen: 'onlineClasses',
  Map:      'onlineTracking',
  Tag:      'affordableFee',
  Award:    'bestTrainers',
  Clock:    'perfectTiming',
};

// Maps stat label from constants → translation key in whyChooseUs.stats
const STAT_KEY_MAP: Record<string, string> = {
  'Total Learners':     'totalLearners',
  'Current Students':   'currentStudents',
  'Expert Instructors': 'expertInstructors',
};

function AnimatedCounter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const listener = anim.addListener(({ value }) => setDisplay(Math.floor(value)));
    Animated.timing(anim, { toValue: target, duration: 1800, delay: 300, useNativeDriver: false }).start();
    return () => anim.removeListener(listener);
  }, []);

  return (
    <View style={{ alignItems: 'center', flex: IS_WEB ? 1 : undefined }}>
      <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: IS_WEB ? 44 : 36 }}>
        {display}{suffix}
      </Text>
      <Text style={{ color: 'rgba(255,255,255,0.7)', fontFamily: F.regular, fontSize: 13, marginTop: 4, textAlign: 'center' }}>
        {label}
      </Text>
    </View>
  );
}

export default function WhyChooseUs() {
  const { t } = useTranslation();
  const featureAnims = useRef(WHY_FEATURES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(100, featureAnims.map(a => Animated.timing(a, { toValue: 1, duration: 480, useNativeDriver: Platform.OS !== 'web' }))).start();
  }, []);

  return (
    <View style={{ backgroundColor: C.skyDeep, paddingVertical: 72, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>
            {t('whyChooseUs.overline')}
          </Text>
          <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: IS_WEB ? 34 : 26, textAlign: 'center', lineHeight: IS_WEB ? 44 : 34, marginBottom: 12 }}>
            {t('whyChooseUs.heading')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 2, width: 40, backgroundColor: 'rgba(255,216,0,0.45)', borderRadius: 2 }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.yellow }} />
            <View style={{ height: 2, width: 40, backgroundColor: 'rgba(255,216,0,0.45)', borderRadius: 2 }} />
          </View>
        </View>

        <View style={IS_WEB ? { flexDirection: 'row', flexWrap: 'wrap', gap: 18, marginBottom: 56 } : { gap: 14, marginBottom: 44 }}>
          {WHY_FEATURES.map((feat, i) => {
            const Icon = ICON_MAP[feat.iconName] ?? BookOpen;
            const key  = WHY_KEY_MAP[feat.iconName] ?? feat.iconName;
            return (
              <Animated.View
                key={feat.title}
                style={{
                  width: IS_WEB ? 'calc(20% - 18px)' as any : undefined,
                  opacity: featureAnims[i],
                  transform: [{ translateY: featureAnims[i].interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 16, padding: 22, alignItems: 'center',
                  borderWidth: 1, borderColor: 'rgba(255,216,0,0.15)',
                }}
              >
                <View style={{ width: 54, height: 54, borderRadius: 27, backgroundColor: 'rgba(255,216,0,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,216,0,0.3)' }}>
                  <Icon size={24} color={C.yellow} />
                </View>
                <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 14, textAlign: 'center', marginBottom: 8 }}>
                  {t(`whyChooseUs.items.${key}.title`)}
                </Text>
                <Text style={{ color: C.mutedDark, fontFamily: F.regular, fontSize: 12, lineHeight: 18, textAlign: 'center' }}>
                  {t(`whyChooseUs.items.${key}.desc`)}
                </Text>
              </Animated.View>
            );
          })}
        </View>

        <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.20)', marginBottom: 44 }} />

        <View style={IS_WEB ? { flexDirection: 'row', justifyContent: 'space-around' } : { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24 }}>
          {STATS.map(s => {
            const statKey = STAT_KEY_MAP[s.label] ?? s.label;
            return (
              <AnimatedCounter
                key={s.label}
                target={s.value}
                suffix={s.suffix}
                label={t(`whyChooseUs.stats.${statKey}`)}
              />
            );
          })}
        </View>

      </View>
    </View>
  );
}
