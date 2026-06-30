import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Pressable, useWindowDimensions } from 'react-native';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W } from './constants';
import { Icon, cn } from '@/components/ui';
import { useTheme } from '@/lib/theme';
import { SectionIntro } from './SectionIntro';
import { useReduceMotion } from '@/hooks/useReduceMotion';

const PHOTO_SOURCES = IS_WEB
  ? [{ uri: '/erickmusyoka.webp' }, { uri: '/mainamburu.webp' }, { uri: '/mitchelakinyi.webp' }]
  : [
      require('../../../public/erickmusyoka.webp'),
      require('../../../public/mainamburu.webp'),
      require('../../../public/mitchelakinyi.webp'),
    ];

const INITIALS = ['EM', 'MM', 'MA'];
const FALLBACK_BG = [C.skyDeep, C.skyLight, C.yellow];
const N = 3;

// Functional carousel (auto-advance, prev/next, dots). The decorative rotated
// photo deck and spring motion were dropped for restraint; Phase 12 adds
// tasteful, uniform transitions.
export default function Testimonials() {
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const Th = useTheme();
  const items = t('testimonials.items', { returnObjects: true }) as Array<{ text: string; name: string; role: string }>;

  const reduceMotion = useReduceMotion();
  const [active, setActive] = useState(0);
  const [imgErrors, setImgErrors] = useState([false, false, false]);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    if (idleRef.current) clearTimeout(idleRef.current);
  };
  const startAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    if (reduceMotion) return; // calm and static under reduce-motion (Phase 12)
    autoRef.current = setInterval(() => setActive((a) => (a + 1) % N), 5000);
  };
  const goTo = (idx: number) => {
    setActive(idx);
    stop();
    idleRef.current = setTimeout(startAuto, 8000);
  };

  useEffect(() => {
    startAuto();
    return stop;
  }, [reduceMotion]);

  const item = items[active] ?? items[0];
  const photoW = IS_WEB ? 220 : 150;
  const photoH = IS_WEB ? 290 : 190;

  return (
    <View className="bg-background px-6 py-[72px]">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        <SectionIntro badge={t('testimonials.overline')} title={t('testimonials.heading')} />

        <View className={cn('items-stretch', IS_WEB ? 'flex-row items-center gap-[72px]' : 'gap-6')}>
          {/* Photo */}
          <View
            className="self-center overflow-hidden rounded-card border-4 border-white bg-white"
            style={{ width: photoW, height: photoH, shadowColor: C.dark, shadowOpacity: 0.2, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8 }}
          >
            {!imgErrors[active] ? (
              <Image
                source={PHOTO_SOURCES[active]}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
                onError={() => setImgErrors((prev) => { const next = [...prev]; next[active] = true; return next; })}
              />
            ) : (
              <View className="flex-1 items-center justify-center" style={{ backgroundColor: FALLBACK_BG[active] }}>
                <Text style={{ fontFamily: F.bold }} className="text-4xl text-white">{INITIALS[active]}</Text>
              </View>
            )}
          </View>

          {/* Text panel */}
          <View className="flex-1 justify-center">
            <Icon icon={Quote} size="xl" color={C.yellow} />
            <Text
              style={{ fontFamily: F.regular, fontStyle: 'italic' }}
              className="mb-7 mt-5 text-sm leading-[22px] text-foreground web:text-lg web:leading-8"
            >
              {`"${item.text}"`}
            </Text>

            <View className="mb-4 flex-row gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={15} color={C.yellow} fill={C.yellow} />
              ))}
            </View>

            <Text style={{ fontFamily: F.bold }} className="text-lg text-foreground web:text-xl">{item.name}</Text>
            <Text style={{ fontFamily: F.regular }} className="mt-1 text-sm text-muted-foreground">{item.role}</Text>

            {/* Prev / Next */}
            <View className="mt-8 flex-row gap-3">
              <Pressable
                onPress={() => goTo((active - 1 + N) % N)}
                accessibilityRole="button"
                accessibilityLabel="Previous"
                className="h-12 w-12 items-center justify-center rounded-pill border border-border active:bg-foreground/5"
              >
                <Icon icon={ChevronLeft} size="md" color={Th.foreground} />
              </Pressable>
              <Pressable
                onPress={() => goTo((active + 1) % N)}
                accessibilityRole="button"
                accessibilityLabel="Next"
                className="h-12 w-12 items-center justify-center rounded-pill bg-primary active:opacity-90"
              >
                <Icon icon={ChevronRight} size="md" color={C.white} />
              </Pressable>
            </View>

            {/* Dots */}
            <View className="mt-5 flex-row gap-2">
              {[0, 1, 2].map((i) => (
                <Pressable key={i} onPress={() => goTo(i)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <View className={cn('h-1.5 rounded-pill', i === active ? 'w-6 bg-primary' : 'w-1.5 bg-border')} />
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
