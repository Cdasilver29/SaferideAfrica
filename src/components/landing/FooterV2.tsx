import React from "react";
import { Pressable, Text, View, Linking } from "react-native";
import { Link, type Href } from "expo-router";
import { Caption } from "../../ui/Typography";

/**
 * Footer mirrors the header nav (AA pattern) plus contact and socials.
 * Kept to three quiet columns; the CTA band above it already made the
 * ask, so the footer only navigates.
 */

const COLUMNS: { heading: string; links: { label: string; href: Href }[] }[] = [
  {
    heading: "Training",
    links: [
      { label: "Courses", href: "/courses" },
      { label: "Services", href: "/services" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    heading: "SafeRide",
    links: [
      { label: "About us", href: "/about" },
      { label: "Branches", href: "/branches" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    heading: "Get in touch",
    links: [{ label: "Contact", href: "/contact" }],
  },
];

const SOCIALS: { label: string; url: string }[] = [
  { label: "Facebook", url: "https://facebook.com/" },
  { label: "Instagram", url: "https://instagram.com/" },
  { label: "TikTok", url: "https://tiktok.com/" },
];

export function FooterV2() {
  return (
    <View className="bg-asphalt px-5 py-12 md:px-10">
      <View className="mx-auto w-full max-w-6xl">
        <Text className="font-display text-xl text-chalk">
          SafeRide <Text className="text-amber">Africa</Text>
        </Text>

        <View className="mt-8 flex-row flex-wrap gap-x-16 gap-y-8">
          {COLUMNS.map((col) => (
            <View key={col.heading}>
              <Text className="font-body-bold text-sm uppercase tracking-widest text-ink-on-dark-muted">
                {col.heading}
              </Text>
              {col.links.map((l) => (
                <Link key={l.label} href={l.href} asChild>
                  <Pressable accessibilityRole="link" className="mt-3">
                    <Text className="font-body text-base text-chalk">{l.label}</Text>
                  </Pressable>
                </Link>
              ))}
            </View>
          ))}

          <View>
            <Text className="font-body-bold text-sm uppercase tracking-widest text-ink-on-dark-muted">
              Follow us
            </Text>
            {SOCIALS.map((s) => (
              <Pressable
                key={s.label}
                accessibilityRole="link"
                accessibilityLabel={`SafeRide Africa on ${s.label}`}
                onPress={() => Linking.openURL(s.url)}
                className="mt-3"
              >
                <Text className="font-body text-base text-chalk">{s.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="mt-10 border-t border-chalk/10 pt-6">
          <Caption className="text-ink-on-dark-muted">
            {new Date().getFullYear()} SafeRide Africa Driving School. All rights
            reserved.
          </Caption>
        </View>
      </View>
    </View>
  );
}
