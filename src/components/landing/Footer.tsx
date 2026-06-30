import React, { useState } from 'react';
import { View, Text, Image, TextInput, Pressable, Linking, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { Phone, Mail, MapPin, Send } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W } from './constants';
import { COMPANY } from '@/data/saferide';
import { Button, Icon } from '@/components/ui';
import LaneStrip from './LaneStrip';

const FOOTER_NAV = [
  { key: 'home', path: '/' },
  { key: 'about', path: '/about' },
  { key: 'courses', path: '/courses' },
  { key: 'services', path: '/services' },
  { key: 'branches', path: '/branches' },
  { key: 'gallery', path: '/gallery' },
  { key: 'blog', path: '/blog' },
  { key: 'contact', path: '/contact' },
];

const LOGO = require('../../../assets/images/saferide-logo.jpg');
const NTSA_LOGO = require('../../../assets/images/ntsa-logo.png');

export default function Footer() {
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const multiCol = IS_WEB && winW >= 768;

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const courseLinks = t('footer.courseLinks', { returnObjects: true }) as string[];

  const handleSubscribe = () => {
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  // The footer is a restrained dark chrome in both light and dark mode
  // (bg-foreground is #221f20 in light, dark:bg-background keeps #221f20 in
  // dark). Text is white, icons and links use the sky brand colour, and yellow
  // stays reserved for the Enroll action elsewhere.
  return (
    <>
      <LaneStrip reverse />

      <View className="border-t border-white/10 bg-foreground dark:bg-background">
        {/* ── Body ─────────────────────────────────────────────────────────────── */}
        <View className="px-6 pb-10 pt-12">
          <View
            className={multiCol ? 'flex-row gap-12' : 'gap-8'}
            style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}
          >
            {/* Brand column */}
            <View style={multiCol ? { flex: 2 } : undefined}>
              <Pressable
                onPress={() => router.push('/')}
                accessibilityRole="link"
                className="mb-3.5 flex-row items-center gap-2.5"
              >
                <Image source={LOGO} style={{ width: 44, height: 44, borderRadius: 8 }} resizeMode="contain" />
                <View>
                  <Text style={{ fontFamily: F.bold }} className="text-base text-accent">{t('footer.brand')}</Text>
                  <Text style={{ fontFamily: F.regular, letterSpacing: 1.5 }} className="text-[9px] uppercase text-white/60">
                    {t('footer.tagline')}
                  </Text>
                </View>
              </Pressable>

              <Text
                style={{ fontFamily: F.regular }}
                className="mb-5 max-w-[300px] text-sm leading-[22px] text-white/70"
              >
                {t('footer.description')}
              </Text>

              <View className="gap-2.5">
                <View className="flex-row items-start gap-2">
                  <View className="mt-0.5"><Icon icon={MapPin} size="xs" color={C.skyLight} /></View>
                  <Text style={{ fontFamily: F.regular }} className="flex-1 text-sm leading-5 text-white/70">
                    {COMPANY.address}
                  </Text>
                </View>
                <Pressable
                  onPress={() => Linking.openURL(`tel:${COMPANY.primaryPhone.replace(/\s/g, '')}`)}
                  accessibilityRole="link"
                  className="flex-row items-center gap-2"
                >
                  <Icon icon={Phone} size="xs" color={C.skyLight} />
                  <Text style={{ fontFamily: F.regular }} className="text-sm text-white/70">{COMPANY.primaryPhone}</Text>
                </Pressable>
                <Pressable
                  onPress={() => Linking.openURL(`tel:${COMPANY.secondaryPhone.replace(/\s/g, '')}`)}
                  accessibilityRole="link"
                  className="flex-row items-center gap-2"
                >
                  <Icon icon={Phone} size="xs" color={C.skyLight} />
                  <Text style={{ fontFamily: F.regular }} className="text-sm text-white/70">{COMPANY.secondaryPhone}</Text>
                </Pressable>
                <Pressable
                  onPress={() => Linking.openURL(`mailto:${COMPANY.email}`)}
                  accessibilityRole="link"
                  className="flex-row items-center gap-2"
                >
                  <Icon icon={Mail} size="xs" color={C.skyLight} />
                  <Text style={{ fontFamily: F.regular }} className="text-sm text-white/70">{COMPANY.email}</Text>
                </Pressable>
              </View>
            </View>

            {/* Our Courses, wide only */}
            {multiCol && (
              <View className="flex-1">
                <Text style={{ fontFamily: F.bold }} className="mb-4 text-sm text-white">
                  {t('footer.coursesColumnTitle')}
                </Text>
                {courseLinks.map((item) => (
                  <Pressable key={item} className="mb-2.5">
                    <Text style={{ fontFamily: F.regular }} className="text-sm text-white/70">{item}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Navigate, wide only */}
            {multiCol && (
              <View className="flex-1">
                <Text style={{ fontFamily: F.bold }} className="mb-4 text-sm text-white">{t('footer.navigateTitle')}</Text>
                {FOOTER_NAV.map((item) => (
                  <Pressable
                    key={item.path}
                    onPress={() => router.push(item.path as any)}
                    accessibilityRole="link"
                    className="mb-2.5"
                  >
                    <Text style={{ fontFamily: F.regular }} className="text-sm text-white/70">{t(`nav.${item.key}`)}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Newsletter */}
            <View style={multiCol ? { flex: 1.5 } : undefined}>
              <Text style={{ fontFamily: F.bold }} className="mb-2 text-sm text-white">
                {t('footer.newsletterTitle')}
              </Text>
              <Text style={{ fontFamily: F.regular }} className="mb-4 text-sm leading-5 text-white/70">
                {t('footer.newsletterSubtitle')}
              </Text>

              <View className="flex-row gap-2">
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder={t('footer.newsletterPlaceholder')}
                  placeholderTextColor={C.mutedDark}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ fontFamily: F.regular }}
                  className="h-12 flex-1 rounded-button border border-white/20 bg-white/10 px-4 text-base text-white"
                />
                <Button
                  variant="primary"
                  onPress={handleSubscribe}
                  accessibilityLabel={t('footer.newsletterTitle')}
                  className="w-12 px-0"
                >
                  <Icon icon={Send} size="sm" color={C.white} />
                </Button>
              </View>

              {subscribed && (
                <Text style={{ fontFamily: F.medium }} className="mt-2 text-xs text-secondary">
                  {t('footer.newsletterSubscribed')}
                </Text>
              )}

              {/* Social monograms (Lucide has no brand glyphs); restrained dark chips */}
              <View className="mt-5 flex-row gap-2.5">
                {['f', 't', 'in'].map((label) => (
                  <Pressable
                    key={label}
                    accessibilityRole="link"
                    accessibilityLabel={`Social ${label}`}
                    className="h-11 w-11 items-center justify-center rounded-pill border border-white/20 bg-white/10 active:bg-white/20"
                  >
                    <Text style={{ fontFamily: F.bold }} className="text-xs text-white">{label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* ── Copyright strip ──────────────────────────────────────────────────── */}
        <View className="border-t border-white/10 px-6 py-4">
          {multiCol ? (
            <View
              className="w-full flex-row items-center justify-between"
              style={{ maxWidth: MAX_W, alignSelf: 'center' }}
            >
              <View>
                <Text style={{ fontFamily: F.regular }} className="text-xs text-white/80">{t('footer.copyright')}</Text>
                <Text style={{ fontFamily: F.regular }} className="mt-0.5 text-[11px] text-white/60">
                  {t('footer.developer')}: calvinedasilver96@gmail.com
                </Text>
              </View>
              <View className="flex-row items-center gap-2.5">
                <Image source={NTSA_LOGO} style={{ width: 36, height: 36 }} resizeMode="contain" />
                <Text style={{ fontFamily: F.regular }} className="text-xs text-white/80">{t('footer.certifiedLine')}</Text>
              </View>
            </View>
          ) : (
            <View className="items-center gap-2">
              <View className="flex-row items-center gap-2">
                <Image source={NTSA_LOGO} style={{ width: 32, height: 32 }} resizeMode="contain" />
                <Text style={{ fontFamily: F.regular }} className="text-[11px] text-white/80">{t('footer.certifiedLine')}</Text>
              </View>
              <Text style={{ fontFamily: F.regular }} className="text-center text-[11px] text-white/80">{t('footer.copyright')}</Text>
              <Text style={{ fontFamily: F.regular }} className="text-center text-[10px] text-white/60">
                {t('footer.developer')}: calvinedasilver96@gmail.com
              </Text>
            </View>
          )}
        </View>
      </View>
    </>
  );
}
