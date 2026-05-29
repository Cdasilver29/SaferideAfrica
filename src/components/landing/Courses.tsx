import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';
import { CheckCircle, Star } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, COURSES, COURSE_IMGS } from './constants';

// Maps array index → translation key for COURSES (order matches constants.ts)
const COURSE_KEYS = ['automatic', 'manual', 'executive'] as const;
const LEVEL_KEYS  = ['beginner', 'standard', 'advanced'] as const;
const FEATURE_KEYS = ['curriculum', 'instructor', 'vehicle', 'testPrep'] as const;

export default function Courses() {
  const { t } = useTranslation();
  const [isYearly, setIsYearly] = useState(false);
  const pillAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(COURSES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(120, cardAnims.map(a => Animated.timing(a, { toValue: 1, duration: 480, useNativeDriver: true }))).start();
  }, []);

  const toggleYearly = (val: boolean) => {
    setIsYearly(val);
    Animated.spring(pillAnim, { toValue: val ? 1 : 0, useNativeDriver: false, tension: 180, friction: 11 }).start();
  };

  const pillTranslate = pillAnim.interpolate({ inputRange: [0, 1], outputRange: [2, 110] });

  return (
    <View style={{ backgroundColor: C.dark, paddingVertical: 72, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 36 }}>
          <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>
            {t('courses.overline')}
          </Text>
          <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: IS_WEB ? 34 : 26, textAlign: 'center', lineHeight: IS_WEB ? 44 : 34, marginBottom: 12 }}>
            {t('courses.heading')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 2, width: 40, backgroundColor: 'rgba(251,191,36,0.5)', borderRadius: 2 }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.yellow }} />
            <View style={{ height: 2, width: 40, backgroundColor: 'rgba(251,191,36,0.5)', borderRadius: 2 }} />
          </View>
        </View>

        {/* Monthly / Yearly toggle */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{ flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 50, padding: 2, width: 224, position: 'relative' }}>
            <Animated.View
              style={{
                position: 'absolute', top: 2, bottom: 2, width: 110,
                backgroundColor: C.yellow, borderRadius: 50,
                transform: [{ translateX: pillTranslate }],
              }}
            />
            {([t('courses.monthly'), t('courses.yearly')] as const).map((label, i) => (
              <TouchableOpacity
                key={label}
                onPress={() => toggleYearly(i === 1)}
                style={{ flex: 1, paddingVertical: 10, alignItems: 'center', zIndex: 1 }}
                activeOpacity={0.8}
              >
                <Text style={{ color: (i === 1) === isYearly ? C.dark : 'rgba(255,255,255,0.75)', fontFamily: F.bold, fontSize: 13 }}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {isYearly && (
            <Text style={{ color: C.green, fontFamily: F.semibold, fontSize: 12, marginTop: 8 }}>
              {t('courses.savingMessage')}
            </Text>
          )}
        </View>

        {/* Course cards */}
        <View style={IS_WEB ? { flexDirection: 'row', gap: 20 } : { gap: 22 }}>
          {COURSES.map((course, idx) => (
            <Animated.View
              key={course.title}
              style={{
                flex: IS_WEB ? 1 : undefined,
                opacity: cardAnims[idx],
                transform: [{ translateY: cardAnims[idx].interpolate({ inputRange: [0, 1], outputRange: [32, 0] }) }],
                borderRadius: 20, overflow: 'hidden',
                borderWidth: course.popular ? 2 : 0,
                borderColor: course.popular ? C.yellow : 'transparent',
                shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 14, elevation: 7,
              }}
            >
              {/* Image strip */}
              <View style={{ height: 170, position: 'relative' }}>
                <Image
                  source={COURSE_IMGS[idx]}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.38)' }} />

                {course.popular && (
                  <View style={{ position: 'absolute', top: 14, right: 14, backgroundColor: C.yellow, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                    <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 10 }}>{t('courses.mostPopular')}</Text>
                  </View>
                )}

                <View style={{ position: 'absolute', top: 14, left: 14, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                  <Text style={{ color: '#ffffff', fontFamily: F.medium, fontSize: 10 }}>
                    {t(`courses.levels.${LEVEL_KEYS[idx]}`)}
                  </Text>
                </View>

                <View style={{ position: 'absolute', bottom: 14, left: 14 }}>
                  <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 16 }}>
                    {t(`courses.items.${COURSE_KEYS[idx]}.title`)}
                  </Text>
                </View>
              </View>

              {/* Card body */}
              <View style={{ backgroundColor: '#92400e', padding: 22 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} color={C.yellow} fill={C.yellow} />)}
                  <Text style={{ color: 'rgba(255,255,255,0.6)', fontFamily: F.regular, fontSize: 11, marginLeft: 4 }}>(4.9)</Text>
                </View>
                <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 26, marginBottom: 4 }}>
                  {isYearly ? course.yearlyPrice : course.price}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.75)', fontFamily: F.regular, fontSize: 13, marginBottom: 18, lineHeight: 20 }}>
                  {t(`courses.items.${COURSE_KEYS[idx]}.desc`)}
                </Text>

                {FEATURE_KEYS.map(fk => (
                  <View key={fk} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <CheckCircle size={13} color={C.greenLight} />
                    <Text style={{ color: 'rgba(255,255,255,0.88)', fontFamily: F.regular, fontSize: 13 }}>
                      {t(`courses.features.${fk}`)}
                    </Text>
                  </View>
                ))}

                <TouchableOpacity
                  onPress={() => router.push('/login')}
                  style={{ marginTop: 18, paddingVertical: 13, borderRadius: 12, alignItems: 'center', backgroundColor: course.popular ? C.yellow : 'rgba(255,255,255,0.14)', borderWidth: course.popular ? 0 : 1, borderColor: 'rgba(255,255,255,0.3)' }}
                  activeOpacity={0.85}
                >
                  <Text style={{ color: course.popular ? C.dark : '#ffffff', fontFamily: F.bold, fontSize: 14 }}>
                    {t('courses.readMore')}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>
    </View>
  );
}
