import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Platform } from 'react-native';
import { useColorScheme } from 'nativewind';
import { CheckSquare, Users, CreditCard, Car } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, WORK_STEPS } from './constants';

const ICON_MAP: Record<string, React.ComponentType<any>> = { CheckSquare, Users, CreditCard, Car };

// Maps step.num → translation key in workProcess.steps (order matches constants.ts)
const STEP_KEY_MAP: Record<string, string> = {
  '01': 'selectPlan',
  '02': 'consultation',
  '03': 'buyCourses',
  '04': 'startTraining',
};

export default function WorkProcess() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const anims = useRef(WORK_STEPS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(130, anims.map(a => Animated.timing(a, { toValue: 1, duration: 500, useNativeDriver: Platform.OS !== 'web' }))).start();
  }, []);

  return (
    <View style={{ backgroundColor: isDark ? C.darkBg : '#ffffff', paddingVertical: 72, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        <View style={{ alignItems: 'center', marginBottom: 52 }}>
          <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>
            {t('workProcess.overline')}
          </Text>
          <Text style={{ color: C.heading, fontFamily: F.bold, fontSize: IS_WEB ? 34 : 26, textAlign: 'center', lineHeight: IS_WEB ? 44 : 34, marginBottom: 12 }}>
            {t('workProcess.heading')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue }} />
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
          </View>
        </View>

        <View style={IS_WEB ? { flexDirection: 'row', gap: 20 } : { gap: 20 }}>
          {WORK_STEPS.map((step, i) => {
            const Icon = ICON_MAP[step.iconName] ?? Car;
            const key  = STEP_KEY_MAP[step.num] ?? step.num;
            const isLast = i === WORK_STEPS.length - 1;
            return (
              <Animated.View
                key={step.num}
                style={{
                  flex: IS_WEB ? 1 : undefined,
                  opacity: anims[i],
                  transform: [{ translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }],
                  position: 'relative',
                }}
              >
                {IS_WEB && !isLast && (
                  <View style={{ position: 'absolute', top: 34, right: -10, width: 20, height: 2, backgroundColor: C.yellow, zIndex: 1 }} />
                )}

                <View style={{ backgroundColor: isDark ? C.dark : C.white, borderRadius: 20, padding: 28, alignItems: IS_WEB ? 'center' : 'flex-start', borderWidth: 1, borderColor: isDark ? C.darkBorder : 'rgba(34,31,32,0.1)' }}>
                  <View style={{ position: 'relative', marginBottom: 20, alignSelf: IS_WEB ? 'center' : 'flex-start' }}>
                    <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: C.blue, alignItems: 'center', justifyContent: 'center', shadowColor: C.blue, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4 }}>
                      <Icon size={26} color="#ffffff" />
                    </View>
                    <View style={{ position: 'absolute', top: -6, right: -6, width: 24, height: 24, borderRadius: 12, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#ffffff' }}>
                      <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 9 }}>{step.num}</Text>
                    </View>
                  </View>

                  <Text style={{ color: C.heading, fontFamily: F.bold, fontSize: 16, marginBottom: 8, textAlign: IS_WEB ? 'center' : 'left' }}>
                    {t(`workProcess.steps.${key}.title`)}
                  </Text>
                  <Text style={{ color: C.muted, fontFamily: F.regular, fontSize: 13, lineHeight: 21, textAlign: IS_WEB ? 'center' : 'left' }}>
                    {t(`workProcess.steps.${key}.desc`)}
                  </Text>
                </View>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
