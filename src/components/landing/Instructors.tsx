import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { Star, Award } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, INSTRUCTORS, INSTRUCTOR_IMGS } from './constants';

// Maps the English role string from constants → translation key in instructors.roles
const ROLE_KEY_MAP: Record<string, string> = {
  'Senior Instructor':  'seniorInstructor',
  'Highway Expert':     'highwayExpert',
  'Defensive Driving':  'defensiveDriving',
  'Theory Specialist':  'theorySpecialist',
};

export default function Instructors() {
  const { t } = useTranslation();
  const anims = useRef(INSTRUCTORS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(110, anims.map(a => Animated.timing(a, { toValue: 1, duration: 500, useNativeDriver: true }))).start();
  }, []);

  return (
    <View style={{ backgroundColor: '#f9fafb', paddingVertical: 72, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        <View style={{ alignItems: 'center', marginBottom: 44 }}>
          <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>
            {t('instructors.overline')}
          </Text>
          <Text style={{ color: C.heading, fontFamily: F.bold, fontSize: IS_WEB ? 34 : 26, textAlign: 'center', marginBottom: 12 }}>
            {t('instructors.heading')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue }} />
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
          </View>
        </View>

        <View style={IS_WEB ? { flexDirection: 'row', gap: 20 } : { gap: 18 }}>
          {INSTRUCTORS.map((inst, i) => {
            const imgSrc = INSTRUCTOR_IMGS?.[i] ?? null;
            const roleKey = ROLE_KEY_MAP[inst.role] ?? inst.role;
            return (
              <Animated.View
                key={inst.name}
                style={{
                  flex: IS_WEB ? 1 : undefined,
                  opacity: anims[i],
                  transform: [{ translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }],
                  backgroundColor: '#ffffff', borderRadius: 20, overflow: 'hidden',
                  shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 14, elevation: 3,
                  borderWidth: 1, borderColor: '#e5e7eb',
                }}
              >
                <View style={{ height: IS_WEB ? 200 : 160, position: 'relative' }}>
                  {imgSrc ? (
                    <Image source={imgSrc} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} resizeMode="cover" />
                  ) : (
                    <View style={{ flex: 1, backgroundColor: `rgba(14,165,233,${0.12 + i * 0.06})`, alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: C.blue, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 26 }}>{inst.initials}</Text>
                      </View>
                    </View>
                  )}
                  <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: 'rgba(0,0,0,0.35)' }} />
                  <View style={{ position: 'absolute', top: 12, right: 12, backgroundColor: C.yellow, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                    <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 10 }}>{inst.exp} {t('instructors.expSuffix')}</Text>
                  </View>
                </View>

                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: C.heading, fontFamily: F.bold, fontSize: 17, marginBottom: 4 }}>{inst.name}</Text>
                  <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 13, marginBottom: 10 }}>
                    {t(`instructors.roles.${roleKey}`)}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 3, marginBottom: 12 }}>
                    {[...Array(5)].map((_, s) => <Star key={s} size={13} color={C.yellow} fill={C.yellow} />)}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#f0f9ff', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: '#bae6fd' }}>
                    <Award size={11} color={C.blue} />
                    <Text style={{ color: C.blue, fontFamily: F.medium, fontSize: 11 }}>{t('instructors.ntsaCertified')}</Text>
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
