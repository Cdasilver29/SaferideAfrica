import React from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { router, type Href } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { PageHero } from '@/components/landing/PageHero';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

import { C, F, IS_WEB, MAX_W } from '@/components/landing/constants';
import { Card, Icon } from '@/components/ui';
import { PageHead } from '@/components/PageHead';
import { useTheme } from '@/lib/theme';
import { Reveal } from '@/components/animations/Reveal';

// The five child pages of the About section. Each links to its own route.
// Hrefs are cast at the push site: expo-router's typed-route generation emits
// backslash paths on Windows, so a forward-slash literal fails the Href check.
const HUB_CARDS: { key: string; href: string }[] = [
  { key: 'story',      href: '/about/story' },
  { key: 'values',     href: '/about/values' },
  { key: 'whyUs',      href: '/about/why-us' },
  { key: 'howWeWork',  href: '/about/how-we-work' },
  { key: 'faq',        href: '/about/faq' },
];

function HubCard({ hkey, href, learnMore }: { hkey: string; href: string; learnMore: string }) {
  const { t } = useTranslation();
  return (
    <Pressable className="flex-1" onPress={() => router.push(href as Href)} accessibilityRole="link">
      <Card className="h-full overflow-hidden p-0 active:bg-foreground/5">
        <View className="flex-1 items-center p-5">
          <View className="mb-2.5 h-[3px] w-6 rounded-pill bg-accent" />
          <Text style={{ fontFamily: F.bold }} className="mb-1.5 text-center text-sm leading-5 text-foreground">
            {t(`aboutPage.cards.${hkey}.title`)}
          </Text>
          <Text style={{ fontFamily: F.regular }} className="mb-3 flex-1 text-center text-xs leading-[18px] text-muted-foreground">
            {t(`aboutPage.cards.${hkey}.desc`)}
          </Text>
          <View className="flex-row items-center gap-1">
            <Text style={{ fontFamily: F.semibold }} className="text-xs text-primary">{learnMore}</Text>
            <Icon icon={ChevronRight} size="xs" color={C.skyDeep} />
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

// Card grid linking to the five About children, mirroring the Services grid.
function HubGrid() {
  const { t } = useTranslation();
  const learnMore = t('aboutPage.cards.learnMore');

  const rows: typeof HUB_CARDS[] = [];
  for (let i = 0; i < HUB_CARDS.length; i += 2) {
    rows.push(HUB_CARDS.slice(i, i + 2));
  }

  return (
    <View className="bg-background px-6 pb-16">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        {IS_WEB ? (
          rows.map((pair, rowIdx) => (
            <View key={rowIdx} className="mb-3.5 flex-row gap-3.5">
              {pair.map((c) => (
                <HubCard key={c.key} hkey={c.key} href={c.href} learnMore={learnMore} />
              ))}
              {pair.length === 1 && <View className="flex-1" />}
            </View>
          ))
        ) : (
          <View className="gap-3.5">
            {HUB_CARDS.map((c) => (
              <HubCard key={c.key} hkey={c.key} href={c.href} learnMore={learnMore} />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

// Short intro paragraph above the card grid.
function HubIntro() {
  const { t } = useTranslation();
  return (
    <View className="bg-background px-6 pt-12 pb-6 web:pt-16">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        <Text style={{ fontFamily: F.regular }} className="text-sm leading-[26px] text-muted-foreground web:text-base web:leading-[28px]">
          {t('aboutPage.hubIntro')}
        </Text>
      </View>
    </View>
  );
}

export default function AboutPage() {
  const { t } = useTranslation();
  const Th = useTheme();
  return (
    // Inline flex/background: NativeWind's flex-1 class is not applied to
    // SafeAreaView on web, which collapsed the layout and stopped the page from
    // scrolling. Every other page sets this inline, matching them here.
    <SafeAreaView style={{ flex: 1, backgroundColor: Th.background }}>
      <PageHead
        title="About Safe Ride Africa: Our Story and Team"
        description="How Safe Ride Africa became one of Nairobi's most trusted NTSA-certified driving schools, our mission, values, and the team behind the wheel."
        path="/about"
      />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <PageHero overline={t('aboutPage.pageOverline')} title={t('aboutPage.pageTitle')} />
        <Reveal><HubIntro /></Reveal>
        <Reveal><HubGrid /></Reveal>
        <Reveal><FinalCTA /></Reveal>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
