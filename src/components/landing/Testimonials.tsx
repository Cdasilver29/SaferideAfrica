import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Star, Quote } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, TESTIMONIALS } from './constants';
import { useTheme } from '@/lib/theme';

const AVATAR_COLORS = [C.blue, C.amberDark, C.blueDark];

export default function Testimonials() {
  const { t } = useTranslation();
  const T = useTheme();
  const [activeIdx, setActiveIdx] = useState(0);
  const fadeAnim  = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const activeRef = useRef(0);

  const changeTo = (idx: number) => {
    activeRef.current = idx;
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 160, useNativeDriver: true }),
    ]).start(() => {
      setActiveIdx(idx);
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 200, friction: 9 }),
      ]).start();
    });
  };

  useEffect(() => {
    const id = setInterval(() => {
      changeTo((activeRef.current + 1) % TESTIMONIALS.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const tItems = t('testimonials.items', { returnObjects: true }) as Array<{ text: string; name: string; role: string }>;
  const active = tItems[activeIdx] ?? { text: '', name: '', role: '' };
  const activeInitials = TESTIMONIALS[activeIdx]?.initials ?? '';

  return (
    <View style={{ backgroundColor: T.background, paddingVertical: 72, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        <View style={{ alignItems: 'center', marginBottom: 44 }}>
          <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>
            {t('testimonials.overline')}
          </Text>
          <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: IS_WEB ? 34 : 26, textAlign: 'center', marginBottom: 12 }}>
            {t('testimonials.heading')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue }} />
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
          </View>
        </View>

        {/* Active card */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            backgroundColor: T.card,
            borderRadius: 24, padding: IS_WEB ? 40 : 24, marginBottom: 24,
            borderWidth: 1, borderColor: T.border,
            shadowColor: C.blue, shadowOpacity: 0.08, shadowRadius: 20, elevation: 3,
          }}
        >
          <View style={{ marginBottom: 16 }}>
            <Quote size={32} color={C.yellow} />
          </View>
          <Text style={{ color: T.foreground, fontFamily: F.regular, fontSize: IS_WEB ? 17 : 15, lineHeight: IS_WEB ? 30 : 26, fontStyle: 'italic', marginBottom: 28 }}>
            "{active.text}"
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 54, height: 54, borderRadius: 27, backgroundColor: AVATAR_COLORS[activeIdx % AVATAR_COLORS.length], alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: T.card, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, elevation: 3 }}>
              <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 16 }}>{activeInitials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 16 }}>{active.name}</Text>
              <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 13, marginTop: 2 }}>{active.role}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 3 }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={14} color={C.yellow} fill={C.yellow} />)}
            </View>
          </View>
        </Animated.View>

        {/* Indicator dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: IS_WEB ? 32 : 0 }}>
          {TESTIMONIALS.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => changeTo(i)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Animated.View style={{ height: 8, width: i === activeIdx ? 28 : 8, borderRadius: 4, backgroundColor: i === activeIdx ? C.yellow : T.border }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Mini cards row (web only) */}
        {IS_WEB && (
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
            {tItems.map((item, i) => (
              <TouchableOpacity key={item.name} onPress={() => changeTo(i)} style={{ flex: 1 }} activeOpacity={0.82}>
                <View style={{ borderRadius: 16, padding: 18, borderWidth: 2, borderColor: i === activeIdx ? C.yellow : T.border, backgroundColor: T.card }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: i === activeIdx ? AVATAR_COLORS[i % AVATAR_COLORS.length] : 'rgba(14,165,233,0.12)', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: i === activeIdx ? '#ffffff' : C.blue, fontFamily: F.bold, fontSize: 12 }}>
                        {TESTIMONIALS[i]?.initials ?? ''}
                      </Text>
                    </View>
                    <View>
                      <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 13 }}>{item.name}</Text>
                      <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 11 }}>{item.role}</Text>
                    </View>
                  </View>
                  <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 12, lineHeight: 18, fontStyle: 'italic' }} numberOfLines={3}>
                    "{item.text}"
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
