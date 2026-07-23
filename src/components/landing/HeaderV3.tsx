import React, { useState } from "react";
import {
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Link, usePathname } from "expo-router";
import {
  Home,
  Info,
  GraduationCap,
  MapPin,
  Phone,
  ChevronDown,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react-native";
import { brand } from "../../ui/tokens";
import { primaryNav, utilityNav, NavItem } from "../../data/navigation";

/**
 * HeaderV3, two tiers.
 *
 *   Tier 1  brand-deep     logo, wordmark, socials, language, theme   ~64px
 *   Tier 2  brand-primary  nav with icons and dropdowns, CTAs         ~52px
 *
 * Three tiers was too much furniture for a nav carrying five items.
 * Merging the utility row into tier 1 halves the height while keeping
 * every control reachable.
 *
 * IMAGE SIZING: dimensions go through the style prop, never className.
 * NativeWind h- and w- classes do not reliably apply to Image on web,
 * which is what made the logo render at its natural size.
 */

export interface HeaderV3Props {
  languageSwitcher?: React.ReactNode;
  themeToggle?: React.ReactNode;
  socials: {
    label: string;
    url: string;
    Icon: React.ComponentType<{ size?: number; color?: string }>;
  }[];
  onCallNow: () => void;
  onEnrol: () => void;
  logoSource: number | { uri: string };
}

const NAV_ICONS: Record<string, LucideIcon> = {
  Home,
  "About us": Info,
  "Driving school": GraduationCap,
  Branches: MapPin,
  "Get in touch": Phone,
};

const LOGO_DESKTOP = { width: 44, height: 44 };
const LOGO_MOBILE = { width: 38, height: 38 };

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <View>
      <Text
        className={`font-display ${
          compact ? "text-base" : "text-lg"
        } leading-tight text-brand-accent`}
      >
        Safe Ride Africa
      </Text>
      <Text className="font-body text-[9px] uppercase tracking-[0.22em] text-white/70">
        Safety beyond
      </Text>
    </View>
  );
}

function PrimaryNavItem({ item, active }: { item: NavItem; active: boolean }) {
  const [open, setOpen] = useState(false);
  const Icon = NAV_ICONS[item.label];
  const hasChildren = !!item.children?.length;

  return (
    <View
      className="relative"
      {...(Platform.OS === "web" && hasChildren
        ? { onPointerEnter: () => setOpen(true), onPointerLeave: () => setOpen(false) }
        : {})}
    >
      <Link href={item.href} asChild>
        <Pressable
          accessibilityRole="link"
          accessibilityState={{ selected: active }}
          onPress={hasChildren ? () => setOpen((v) => !v) : undefined}
          className="flex-row items-center gap-1.5 rounded-sm px-3 py-3 web:outline-none web:focus-visible:ring-2 web:focus-visible:ring-brand-ink"
          {...(Platform.OS === "web" && hasChildren
            ? { "aria-haspopup": "menu" as const, "aria-expanded": open }
            : {})}
        >
          {Icon ? <Icon size={16} color={brand.ink} /> : null}
          <Text
            className={`font-body-bold text-[13px] uppercase tracking-wide ${
              active ? "text-brand-deep" : "text-brand-ink"
            }`}
          >
            {item.label}
          </Text>
          {hasChildren ? <ChevronDown size={14} color={brand.ink} /> : null}
        </Pressable>
      </Link>

      {hasChildren && open ? (
        <View className="absolute left-0 top-full z-50 min-w-[210px] rounded-b-md border border-black/10 bg-white py-1.5 shadow-lg">
          {item.children!.map((child) => (
            <Link key={child.label} href={child.href} asChild>
              <Pressable
                accessibilityRole="link"
                onPress={() => setOpen(false)}
                className="px-4 py-2.5 web:hover:bg-black/5 web:focus-visible:bg-black/5"
              >
                <Text className="font-body-medium text-sm text-brand-ink">
                  {child.label}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function HeaderV3({
  languageSwitcher,
  themeToggle,
  socials,
  onCallNow,
  onEnrol,
  logoSource,
}: HeaderV3Props) {
  const [drawer, setDrawer] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const isDesktop = width >= 1024;

  if (!isDesktop) {
    return (
      <View className="bg-brand-deep">
        <View className="flex-row items-center justify-between px-4 py-2.5">
          <Link href="/" asChild>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Safe Ride Africa, home"
              className="flex-row items-center gap-2.5"
            >
              <Image source={logoSource} style={LOGO_MOBILE} resizeMode="contain" />
              <Wordmark compact />
            </Pressable>
          </Link>
          <Pressable
            onPress={() => setDrawer(true)}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            className="h-11 w-11 items-center justify-center rounded-md"
          >
            <Menu size={26} color="#FFFFFF" />
          </Pressable>
        </View>

        <Modal
          visible={drawer}
          animationType="slide"
          onRequestClose={() => setDrawer(false)}
          presentationStyle="fullScreen"
        >
          <View className="flex-1 bg-brand-deep">
            <View className="flex-row items-center justify-between px-4 py-2.5">
              <View className="flex-row items-center gap-2.5">
                <Image source={logoSource} style={LOGO_MOBILE} resizeMode="contain" />
                <Wordmark compact />
              </View>
              <Pressable
                onPress={() => setDrawer(false)}
                accessibilityRole="button"
                accessibilityLabel="Close menu"
                className="h-11 w-11 items-center justify-center"
              >
                <X size={26} color="#FFFFFF" />
              </Pressable>
            </View>

            <ScrollView className="flex-1 px-4">
              {primaryNav.map((item) => {
                const Icon = NAV_ICONS[item.label];
                const isOpen = expanded === item.label;
                return (
                  <View key={item.label} className="border-b border-white/15">
                    <View className="flex-row items-center">
                      <Link href={item.href} asChild>
                        <Pressable
                          accessibilityRole="link"
                          onPress={() => setDrawer(false)}
                          className="flex-1 flex-row items-center gap-3 py-4"
                        >
                          {Icon ? <Icon size={20} color="#FFFFFF" /> : null}
                          <Text className="font-body-bold text-lg text-white">
                            {item.label}
                          </Text>
                        </Pressable>
                      </Link>
                      {item.children?.length ? (
                        <Pressable
                          onPress={() => setExpanded(isOpen ? null : item.label)}
                          accessibilityRole="button"
                          accessibilityLabel={`${isOpen ? "Collapse" : "Expand"} ${
                            item.label
                          }`}
                          accessibilityState={{ expanded: isOpen }}
                          className="h-11 w-11 items-center justify-center"
                        >
                          <ChevronDown
                            size={20}
                            color="#FFFFFF"
                            style={{
                              transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
                            }}
                          />
                        </Pressable>
                      ) : null}
                    </View>

                    {isOpen
                      ? item.children!.map((child) => (
                          <Link key={child.label} href={child.href} asChild>
                            <Pressable
                              accessibilityRole="link"
                              onPress={() => setDrawer(false)}
                              className="py-3 pl-9"
                            >
                              <Text className="font-body text-base text-white/85">
                                {child.label}
                              </Text>
                            </Pressable>
                          </Link>
                        ))
                      : null}
                  </View>
                );
              })}

              {utilityNav.map((item) => (
                <Link key={item.label} href={item.href} asChild>
                  <Pressable
                    accessibilityRole="link"
                    onPress={() => setDrawer(false)}
                    className="border-b border-white/15 py-4"
                  >
                    <Text className="font-body text-base text-white/85">
                      {item.label}
                    </Text>
                  </Pressable>
                </Link>
              ))}

              <View className="mt-6 flex-row items-center gap-4">
                {languageSwitcher}
                {themeToggle}
              </View>

              <View className="mt-6 gap-3">
                <Pressable
                  onPress={() => {
                    setDrawer(false);
                    onCallNow();
                  }}
                  accessibilityRole="button"
                  className="flex-row items-center justify-center rounded-pill bg-brand-action py-4"
                >
                  <Phone size={18} color="#FFFFFF" />
                  <Text className="ml-2 font-body-bold text-base text-white">
                    Call now
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setDrawer(false);
                    onEnrol();
                  }}
                  accessibilityRole="button"
                  className="items-center justify-center rounded-pill bg-brand-accent py-4"
                >
                  <Text className="font-body-bold text-base text-brand-ink">
                    Enrol now
                  </Text>
                </Pressable>
              </View>

              <View className="mt-8 flex-row justify-center gap-4 pb-10">
                {socials.map(({ label, url, Icon }) => (
                  <Pressable
                    key={label}
                    onPress={() => Linking.openURL(url)}
                    accessibilityRole="link"
                    accessibilityLabel={`Safe Ride Africa on ${label}`}
                    className="h-11 w-11 items-center justify-center rounded-full bg-white/15"
                  >
                    <Icon size={20} color="#FFFFFF" />
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View>
      {/* Tier 1, brand strip */}
      <View className="bg-brand-deep">
        <View className="mx-auto w-full max-w-7xl flex-row items-center justify-between px-6 py-2.5">
          <Link href="/" asChild>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Safe Ride Africa, home"
              className="flex-row items-center gap-3"
            >
              <Image source={logoSource} style={LOGO_DESKTOP} resizeMode="contain" />
              <Wordmark />
            </Pressable>
          </Link>

          <View className="flex-row items-center gap-2">
            {socials.map(({ label, url, Icon }) => (
              <Pressable
                key={label}
                onPress={() => Linking.openURL(url)}
                accessibilityRole="link"
                accessibilityLabel={`Safe Ride Africa on ${label}`}
                className="h-8 w-8 items-center justify-center rounded-full bg-white/15 web:transition-colors web:hover:bg-white/30 web:focus-visible:ring-2 web:focus-visible:ring-white"
              >
                <Icon size={16} color="#FFFFFF" />
              </Pressable>
            ))}
            <View className="ml-2 flex-row items-center gap-2">
              {languageSwitcher}
              {themeToggle}
            </View>
          </View>
        </View>
      </View>

      {/* Tier 2, primary nav */}
      <View className="bg-brand-primary">
        <View className="mx-auto w-full max-w-7xl flex-row items-center justify-between px-6">
          <View className="flex-row items-center">
            {primaryNav.map((item) => (
              <PrimaryNavItem
                key={item.label}
                item={item}
                active={pathname === item.href}
              />
            ))}
            {utilityNav.map((item) => (
              <Link key={item.label} href={item.href} asChild>
                <Pressable
                  accessibilityRole="link"
                  className="rounded-sm px-3 py-3 web:focus-visible:ring-2 web:focus-visible:ring-brand-ink"
                >
                  <Text className="font-body-bold text-[13px] uppercase tracking-wide text-brand-ink">
                    {item.label}
                  </Text>
                </Pressable>
              </Link>
            ))}
          </View>

          <View className="flex-row items-center gap-2.5 py-1.5">
            <Pressable
              onPress={onCallNow}
              accessibilityRole="button"
              accessibilityLabel="Call Safe Ride Africa now"
              className="h-9 flex-row items-center rounded-pill bg-brand-action px-4 web:transition-opacity web:hover:opacity-90 web:focus-visible:ring-2 web:focus-visible:ring-white"
            >
              <Phone size={15} color="#FFFFFF" />
              <Text className="ml-1.5 font-body-bold text-[13px] text-white">
                Call now
              </Text>
            </Pressable>
            <Pressable
              onPress={onEnrol}
              accessibilityRole="button"
              className="h-9 items-center justify-center rounded-pill bg-brand-accent px-5 web:transition-opacity web:hover:opacity-90 web:focus-visible:ring-2 web:focus-visible:ring-white"
            >
              <Text className="font-body-bold text-[13px] text-brand-ink">
                Enrol now
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
