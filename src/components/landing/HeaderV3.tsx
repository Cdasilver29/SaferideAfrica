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
} from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { brand } from "../../ui/tokens";
import { primaryNav, utilityNav, NavItem } from "../../data/navigation";

/**
 * HeaderV3. Three-tier structure borrowed from AA Kenya:
 *
 *   Tier 1  brand strip   logo + tagline, socials on the right
 *   Tier 2  utility bar   secondary links, language + theme controls
 *   Tier 3  primary nav   main sections with icons and dropdowns, CTAs right
 *
 * Splitting the bar three ways is what stops your nav wrapping to two
 * lines: five controls no longer compete with seven links for one row.
 *
 * Everything the old Navbar did is preserved. The language switcher and
 * theme toggle move to tier 2 where they belong as utilities, and Call
 * Now stays beside Enrol Now in tier 3 where the intent is highest.
 *
 * Below 1024px all three tiers collapse into a logo bar plus drawer.
 */

export interface HeaderV3Props {
  /** Existing language switcher component, rendered into tier 2 */
  languageSwitcher?: React.ReactNode;
  /** Existing dark mode toggle, rendered into tier 2 */
  themeToggle?: React.ReactNode;
  /** Existing social links from src/data/saferide.ts */
  socials: { label: string; url: string; Icon: React.ComponentType<{ size?: number; color?: string }> }[];
  onCallNow: () => void;
  onEnrol: () => void;
  /** Logo asset, passed in so this component owns no assets */
  logoSource: number | { uri: string };
}

const NAV_ICONS: Record<string, LucideIcon> = {
  Home,
  "About us": Info,
  "Driving school": GraduationCap,
  Branches: MapPin,
  "Get in touch": Phone,
};

/** Desktop nav item. Opens its dropdown on hover and on click, closes on blur. */
function PrimaryNavItem({ item, active }: { item: NavItem; active: boolean }) {
  const [open, setOpen] = useState(false);
  const Icon = NAV_ICONS[item.label];
  const hasChildren = !!item.children?.length;

  const webProps =
    Platform.OS === "web" && hasChildren
      ? {
          onHoverIn: () => setOpen(true),
          onHoverOut: () => setOpen(false),
          "aria-haspopup": "menu" as const,
          "aria-expanded": open,
        }
      : {};

  return (
    <View
      className="relative"
      // Keep the panel open while the pointer travels into it
      {...(Platform.OS === "web" && hasChildren
        ? { onPointerLeave: () => setOpen(false) }
        : {})}
    >
      <Link href={item.href} asChild>
        <Pressable
          accessibilityRole="link"
          accessibilityState={{ selected: active }}
          onPress={hasChildren ? () => setOpen((v) => !v) : undefined}
          className="flex-row items-center gap-2 rounded-sm px-4 py-3 web:outline-none web:focus-visible:ring-2 web:focus-visible:ring-brand-ink"
          {...webProps}
        >
          {Icon ? <Icon size={17} color={brand.ink} /> : null}
          <Text
            className={`font-body-bold text-sm uppercase tracking-wide ${
              active ? "text-brand-deep" : "text-brand-ink"
            }`}
          >
            {item.label}
          </Text>
          {hasChildren ? <ChevronDown size={15} color={brand.ink} /> : null}
        </Pressable>
      </Link>

      {hasChildren && open ? (
        <View
          accessibilityRole={Platform.OS === "web" ? ("menu" as never) : undefined}
          className="absolute left-0 top-full z-50 min-w-[220px] rounded-b-md border border-black/10 bg-white py-2 shadow-lg"
        >
          {item.children!.map((child) => (
            <Link key={child.label} href={child.href} asChild>
              <Pressable
                accessibilityRole="link"
                onPress={() => setOpen(false)}
                className="px-4 py-3 web:hover:bg-black/5 web:outline-none web:focus-visible:bg-black/5"
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

  const Logo = (
    <Link href="/" asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Safe Ride Africa, home"
        className="flex-row items-center gap-3"
      >
        <Image
          source={logoSource}
          className="h-12 w-12 rounded-md"
          resizeMode="contain"
          accessibilityLabel=""
        />
        <View>
          <Text className="font-display text-xl text-brand-accent">
            Safe Ride Africa
          </Text>
          <Text className="font-body text-[10px] uppercase tracking-[0.2em] text-brand-on-primary/80">
            Safety beyond
          </Text>
        </View>
      </Pressable>
    </Link>
  );

  if (!isDesktop) {
    return (
      <View className="bg-brand-primary">
        <View className="flex-row items-center justify-between px-4 py-3">
          {Logo}
          <Pressable
            onPress={() => setDrawer(true)}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            className="h-11 w-11 items-center justify-center rounded-md"
          >
            <Menu size={26} color={brand.onPrimary} />
          </Pressable>
        </View>

        <Modal
          visible={drawer}
          animationType="slide"
          onRequestClose={() => setDrawer(false)}
          presentationStyle="fullScreen"
        >
          <View className="flex-1 bg-brand-primary">
            <View className="flex-row items-center justify-between px-4 py-3">
              {Logo}
              <Pressable
                onPress={() => setDrawer(false)}
                accessibilityRole="button"
                accessibilityLabel="Close menu"
                className="h-11 w-11 items-center justify-center"
              >
                <X size={26} color={brand.onPrimary} />
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
                          {Icon ? <Icon size={20} color={brand.ink} /> : null}
                          <Text className="font-body-bold text-lg text-brand-ink">
                            {item.label}
                          </Text>
                        </Pressable>
                      </Link>
                      {item.children?.length ? (
                        <Pressable
                          onPress={() => setExpanded(isOpen ? null : item.label)}
                          accessibilityRole="button"
                          accessibilityLabel={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
                          accessibilityState={{ expanded: isOpen }}
                          className="h-11 w-11 items-center justify-center"
                        >
                          <ChevronDown
                            size={20}
                            color={brand.ink}
                            style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
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
                              <Text className="font-body text-base text-brand-on-primary/90">
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
                    <Text className="font-body text-base text-brand-on-primary/90">
                      {item.label}
                    </Text>
                  </Pressable>
                </Link>
              ))}

              <View className="mt-6 flex-row items-center gap-4">
                {languageSwitcher}
                {themeToggle}
              </View>

              <View className="mt-6 gap-3 pb-10">
                <Pressable
                  onPress={() => {
                    setDrawer(false);
                    onCallNow();
                  }}
                  accessibilityRole="button"
                  className="h-14 flex-row items-center justify-center rounded-pill bg-brand-action"
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
                  className="h-14 items-center justify-center rounded-pill bg-brand-accent"
                >
                  <Text className="font-body-bold text-base text-brand-ink">
                    Enrol now
                  </Text>
                </Pressable>
              </View>

              <View className="flex-row justify-center gap-5 pb-10">
                {socials.map(({ label, url, Icon }) => (
                  <Pressable
                    key={label}
                    onPress={() => Linking.openURL(url)}
                    accessibilityRole="link"
                    accessibilityLabel={`Safe Ride Africa on ${label}`}
                    className="h-11 w-11 items-center justify-center"
                  >
                    <Icon size={22} color={brand.onPrimary} />
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
      <View className="bg-white">
        <View className="mx-auto w-full max-w-7xl flex-row items-center justify-between px-6 py-2">
          <View className="flex-row items-center gap-3">
            <Image
              source={logoSource}
              className="h-11 w-11 rounded-md"
              resizeMode="contain"
              accessibilityLabel=""
            />
            <View>
              <Text className="font-display text-xl text-brand-deep">
                Safe Ride Africa
              </Text>
              <Text className="font-body text-[10px] uppercase tracking-[0.2em] text-brand-ink/60">
                Safety beyond
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            {socials.map(({ label, url, Icon }) => (
              <Pressable
                key={label}
                onPress={() => Linking.openURL(url)}
                accessibilityRole="link"
                accessibilityLabel={`Safe Ride Africa on ${label}`}
                className="h-9 w-9 items-center justify-center rounded-full bg-brand-primary web:transition-opacity web:hover:opacity-80 web:focus-visible:ring-2 web:focus-visible:ring-brand-ink"
              >
                <Icon size={17} color={brand.onPrimary} />
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Tier 2, utility bar */}
      <View className="bg-brand-deep">
        <View className="mx-auto w-full max-w-7xl flex-row items-center justify-between px-6">
          <View className="flex-row">
            {utilityNav.map((item) => (
              <Link key={item.label} href={item.href} asChild>
                <Pressable
                  accessibilityRole="link"
                  className="px-4 py-3 rounded-sm web:outline-none web:focus-visible:ring-2 web:focus-visible:ring-brand-accent"
                >
                  <Text className="font-body-bold text-xs uppercase tracking-[0.12em] text-white">
                    {item.label}
                  </Text>
                </Pressable>
              </Link>
            ))}
          </View>
          <View className="flex-row items-center gap-3 py-1">
            {languageSwitcher}
            {themeToggle}
          </View>
        </View>
      </View>

      {/* Tier 3, primary nav */}
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
          </View>

          <View className="flex-row items-center gap-3 py-2">
            <Pressable
              onPress={onCallNow}
              accessibilityRole="button"
              accessibilityLabel="Call Safe Ride Africa now"
              className="h-11 flex-row items-center rounded-pill bg-brand-action px-5 web:transition-opacity web:hover:opacity-90 web:focus-visible:ring-2 web:focus-visible:ring-white"
            >
              <Phone size={17} color="#FFFFFF" />
              <Text className="ml-2 font-body-bold text-sm text-white">Call now</Text>
            </Pressable>
            <Pressable
              onPress={onEnrol}
              accessibilityRole="button"
              className="h-11 items-center justify-center rounded-pill bg-brand-accent px-6 web:transition-opacity web:hover:opacity-90 web:focus-visible:ring-2 web:focus-visible:ring-white"
            >
              <Text className="font-body-bold text-sm text-brand-ink">Enrol now</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
