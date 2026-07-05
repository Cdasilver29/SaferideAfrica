import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ChevronDown, ArrowRight } from 'lucide-react-native';
import { C, F, IS_WEB } from './constants';
import { Button, Icon } from '@/components/ui';
import { SectionIntro } from './SectionIntro';
import { useReduceMotion } from '@/hooks/useReduceMotion';

// Homepage FAQ snippet: four questions reused verbatim from the full FAQ
// (faq.items), skipping the course-duration item since durations stay off
// public pages. The full FAQ, with the contact form, lives on the About page.
// Answers render at most this wide so line length stays readable on desktop.
const CONTENT_MAX_W = 760;

// faq.items indexes shown here; item 0 (course duration) is excluded.
const HOME_FAQ_INDEXES = [1, 2, 3, 4];

function AccordionItem({
  q, a, open, onToggle, reduceMotion, chevronColor,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
  reduceMotion: boolean;
  chevronColor: string;
}) {
  const progress = useSharedValue(open ? 1 : 0);

  useEffect(() => {
    progress.value = reduceMotion
      ? (open ? 1 : 0)
      : withTiming(open ? 1 : 0, { duration: 200 });
  }, [open, reduceMotion]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }));
  // Transform and opacity only; the layout change itself is instant.
  const answerStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * -4 }],
  }));

  return (
    <View className="mb-3 overflow-hidden rounded-card border border-border bg-card">
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        className="min-h-[44px] flex-row items-center gap-3 px-5 py-3.5 hover:bg-foreground/5 active:bg-foreground/5"
      >
        <Text style={{ fontFamily: F.semibold }} className="flex-1 text-sm leading-5 text-foreground">
          {q}
        </Text>
        <Animated.View style={chevronStyle}>
          <Icon icon={ChevronDown} size="sm" color={chevronColor} />
        </Animated.View>
      </Pressable>

      {open && (
        <Animated.View style={answerStyle}>
          {/* className does not reach Animated.View, so padding sits on a plain View */}
          <View className="px-5 pb-4">
            <Text style={{ fontFamily: F.regular }} className="text-sm leading-[22px] text-muted-foreground">
              {a}
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

export default function HomeFaq() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const reduceMotion = useReduceMotion();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const allItems = t('faq.items', { returnObjects: true }) as Array<{ q: string; a: string }>;
  const items = HOME_FAQ_INDEXES.map((i) => allItems[i]).filter(Boolean);

  return (
    <View className="bg-secondary/10 px-6 py-14 dark:bg-background">
      <View style={IS_WEB ? { maxWidth: CONTENT_MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        <SectionIntro badge={t('home.faqSnippet.badge')} title={t('faq.heading')} />

        {items.map((item, i) => (
          <AccordionItem
            key={item.q}
            q={item.q}
            a={item.a}
            open={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            reduceMotion={reduceMotion}
            chevronColor={isDark ? C.mutedDark : C.muted}
          />
        ))}

        <View className="mt-6 items-center">
          <Button
            variant="outline"
            onPress={() => router.push('/about')}
            accessibilityLabel={t('home.faqSnippet.viewAll')}
            className="px-7"
          >
            <Text style={{ fontFamily: F.bold }} className="text-base text-foreground">
              {t('home.faqSnippet.viewAll')}
            </Text>
            <Icon icon={ArrowRight} size="md" color={isDark ? C.white : C.dark} />
          </Button>
        </View>
      </View>
    </View>
  );
}
