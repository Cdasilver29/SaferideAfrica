import React from 'react';
import { View, Text, Pressable, Linking, useWindowDimensions } from 'react-native';
import { useColorScheme } from 'nativewind';

import { C, F, IS_WEB, MAX_W } from './constants';
import { COMPANY, SOCIALS } from '@/data/saferide';

import {
  WhatsAppIcon, FacebookIcon, TwitterXIcon, TikTokIcon, InstagramIcon, YouTubeIcon,
} from '../SocialIcons';

// Slim utility strip above the primary navigation: phone (and email on wide
// screens) on the left, the full social set on the right. Lives outside the
// main nav row so the logo and menu keep their space at 360 and 414.
const SOCIAL_LINKS = [
  { key: 'whatsapp',  label: 'WhatsApp',  Glyph: WhatsAppIcon },
  { key: 'facebook',  label: 'Facebook',  Glyph: FacebookIcon },
  { key: 'twitter',   label: 'X',         Glyph: TwitterXIcon },
  { key: 'tiktok',    label: 'TikTok',    Glyph: TikTokIcon },
  { key: 'instagram', label: 'Instagram', Glyph: InstagramIcon },
  { key: 'youtube',   label: 'YouTube',   Glyph: YouTubeIcon },
] as const;

// 36px visual row; hitSlop tops each control up to the 44px minimum target.
const HIT_SLOP = { top: 4, bottom: 4, left: 4, right: 4 };

export default function TopContactBar() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width: winW } = useWindowDimensions();
  const showEmail = IS_WEB && winW >= 768;

  const fg = isDark ? C.white : C.dark;

  return (
    <View className="border-b border-foreground/10 bg-secondary dark:bg-background">
      <View
        className="h-9 w-full flex-row items-center justify-between px-4"
        style={IS_WEB ? { maxWidth: MAX_W, alignSelf: 'center' } : undefined}
      >
        {/* Contact shortcuts */}
        <View className="flex-row items-center gap-4">
          <Pressable
            onPress={() => Linking.openURL(`tel:${COMPANY.primaryPhone.replace(/\s/g, '')}`)}
            accessibilityRole="link"
            hitSlop={HIT_SLOP}
            className="flex-row items-center gap-1.5"
          >
            <Text style={{ fontSize: 12 }}>📞</Text>
            <Text
              style={{ fontFamily: F.semibold }}
              className="text-xs text-secondary-foreground dark:text-white/80"
            >
              {COMPANY.primaryPhone}
            </Text>
          </Pressable>

          {showEmail && (
            <Pressable
              onPress={() => Linking.openURL(`mailto:${COMPANY.email}`)}
              accessibilityRole="link"
              hitSlop={HIT_SLOP}
              className="flex-row items-center gap-1.5"
            >
              <Text style={{ fontSize: 12 }}>✉️</Text>
              <Text
                style={{ fontFamily: F.medium }}
                className="text-xs text-secondary-foreground dark:text-white/80"
              >
                {COMPANY.email}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Social set */}
        <View className="flex-row items-center">
          {SOCIAL_LINKS.map(({ key, label, Glyph }) => (
            <Pressable
              key={key}
              onPress={() => Linking.openURL(SOCIALS[key])}
              accessibilityRole="link"
              accessibilityLabel={label}
              hitSlop={HIT_SLOP}
              className="h-9 w-9 items-center justify-center rounded-pill hover:bg-foreground/10 active:bg-foreground/15"
            >
              <Glyph size={15} color={fg} />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
