import React, { useState } from "react";
import {
  Image,
  Linking,
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
  Wrench,
  ChevronDown,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react-native";
import { brand } from "../../lib/tokens";
import { primaryNav, secondaryNav, NavItem } from "../../data/navigation";

/**
 * HeaderV3, three tiers, modelled on AA's value rhythm: light, dark, bright.
 *
 *   Tier 1  brand-primary  logo, wordmark, socials, language, theme
 *   Tier 2  brand-deep     secondary nav, white text          5.78:1
 *   Tier 3  brand-accent   primary nav, dark text, CTAs       ~15:1
 *
 * WHY DARK TEXT ON YELLOW: white on the brand yellow measures about
 * 1.1:1, which is unreadable. AA's own yellow bar uses dark text for the
 * same reason. Dark ink on yellow clears 15:1.
 *
 * THREE BUGS FIXED FROM THE PREVIOUS VERSION:
 * 1. Dropdown parents are no longer wrapped in Link. The Link consumed
 *    the press and navigated before the toggle could fire, so panels
 *    never opened.
 * 2. The mobile drawer no longer uses Modal. React Native's Modal is
 *    unreliable on web and presentationStyle is iOS-only, so the drawer
 *    rendered empty. It is now an absolutely positioned overlay.
 * 3. Image dimensions and corner radius go through the style prop.
 *    NativeWind h-, w- and rounded- classes do not reliably apply to
 *    Image on web, which is what made the logo render at natural size.
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
  Services: Wrench,
  Branches: MapPin,
  "Get in touch": Phone,
};

const LOGO_DESKTOP = { width: 52, height: 52, borderRadius: 13 };
const LOGO_MOBILE = { width: 44, height: 44, borderRadius: 11 };

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <View>
      <Text
        className={`font-display ${
          compact ? "text-lg" : "text-xl"
        } leading-tight text-brand-accent`}
      >
        Safe Ride Africa
      </Text>
      <Text className="font-body text-[9px] uppercase tracking-[0.22em] text-white/80">
        Safety beyond
      </Text>
    </View>
  );
}

/**
 * Yellow-tier nav item. Items with children render as a button, not a
 * link, so the press toggles the panel instead of navigating. The
 * section's own landing page stays reachable as the first child.
 */
function PrimaryNavItem({
  item,
  active,
  isOpen,
  onOpen,
  onClose,
}: {
  item: NavItem;
  active: boolean;
  isOpen: boolean;
  onOpen: (label: string) => void;
  onClose: () => void;
}) {
  const Icon = NAV_ICONS[item.label];
  const hasChildren = !!item.children?.length;
  const isWeb = Platform.OS === "web";

  // Panels with more than six children split into two even columns; About
  // us and Driving school stay single-column.
  const childItems = item.children ?? [];
  const twoColumn = childItems.length > 6;
  const mid = Math.ceil(childItems.length / 2);
  const columns = twoColumn
    ? [childItems.slice(0, mid), childItems.slice(mid)]
    : [childItems];

  // On web, hover is the only trigger, matching AA. Touch devices have no
  // hover, so there the button press toggles the panel.
  const hoverProps =
    isWeb && hasChildren
      ? { onHoverIn: () => onOpen(item.label), onHoverOut: () => onClose() }
      : {};

  const inner = (
    <>
      {Icon ? <Icon size={16} color={brand.ink} /> : null}
      <Text
        className={`font-body-bold text-[13px] uppercase tracking-wide ${
          active ? "text-brand-deep" : "text-brand-ink"
        }`}
      >
        {item.label}
      </Text>
      {hasChildren ? (
        <ChevronDown
          size={14}
          color={brand.ink}
          style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
        />
      ) : null}
    </>
  );

  const pressableClass =
    "flex-row items-center gap-1.5 rounded-sm px-3 py-3.5 web:outline-none web:focus-visible:ring-2 web:focus-visible:ring-brand-ink";

  return (
    <View
      className="relative"
      style={
        Platform.OS === "web" ? { overflow: "visible", zIndex: 30 } : undefined
      }
      {...hoverProps}
    >
      {hasChildren ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${item.label} menu`}
          accessibilityState={{ expanded: isOpen }}
          onPress={
            isWeb ? undefined : () => (isOpen ? onClose() : onOpen(item.label))
          }
          className={pressableClass}
          {...(isWeb
            ? { "aria-haspopup": "menu" as const, "aria-expanded": isOpen }
            : {})}
        >
          {inner}
        </Pressable>
      ) : (
        <Link href={item.href} asChild>
          <Pressable
            accessibilityRole="link"
            accessibilityState={{ selected: active }}
            className={pressableClass}
          >
            {inner}
          </Pressable>
        </Link>
      )}

      {hasChildren && isOpen ? (
        <View
          className="absolute left-0 top-full z-50 flex-row rounded-b-md border border-black/10 bg-white py-1.5 shadow-lg"
          style={{ width: twoColumn ? 440 : 220 }}
        >
          {columns.map((col, colIndex) => (
            <View key={colIndex} className="flex-1">
              {col.map((child) => (
                <Link key={child.label} href={child.href} asChild>
                  <Pressable
                    accessibilityRole="link"
                    onPress={() => onClose()}
                    className="px-4 py-2.5 web:hover:bg-black/5 web:focus-visible:bg-black/5"
                  >
                    <Text className="font-body-medium text-sm text-brand-ink">
                      {child.label}
                    </Text>
                  </Pressable>
                </Link>
              ))}
            </View>
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
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const isDesktop = width >= 1024;

  if (!isDesktop) {
    return (
      <View className="bg-brand-primary">
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

        {/* Overlay drawer. Not a Modal: RN Modal is unreliable on web. */}
        {drawer ? (
          <View
            className="absolute inset-0 z-[100] bg-brand-deep"
            style={
              Platform.OS === "web"
                ? ({ position: "fixed", height: "100vh" } as never)
                : undefined
            }
          >
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

            <ScrollView className="flex-1 px-4" contentContainerClassName="pb-16">
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

              {secondaryNav.map((item) => (
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

              <View className="mt-8 flex-row flex-wrap justify-center gap-4">
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
        ) : null}
      </View>
    );
  }

  return (
    <View
      style={
        Platform.OS === "web" ? { overflow: "visible", zIndex: 30 } : undefined
      }
    >
      {/* Tier 1, brand strip */}
      <View className="bg-brand-primary">
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
                className="h-8 w-8 items-center justify-center rounded-full bg-white/20 web:transition-colors web:hover:bg-white/35 web:focus-visible:ring-2 web:focus-visible:ring-white"
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

      {/* Tier 2, secondary nav, white on deep blue */}
      <View className="bg-brand-deep">
        <View className="mx-auto w-full max-w-7xl flex-row items-center px-6">
          {secondaryNav.map((item) => (
            <Link key={item.label} href={item.href} asChild>
              <Pressable
                accessibilityRole="link"
                accessibilityState={{ selected: pathname === item.href }}
                className="rounded-sm px-4 py-2.5 web:transition-colors web:hover:bg-white/10 web:outline-none web:focus-visible:ring-2 web:focus-visible:ring-brand-accent"
              >
                <Text className="font-body-bold text-xs uppercase tracking-[0.12em] text-white">
                  {item.label}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </View>

      {/* Tier 3, primary nav, dark on yellow */}
      <View
        className="bg-brand-accent"
        style={
          Platform.OS === "web" ? { overflow: "visible", zIndex: 30 } : undefined
        }
      >
        <View
          className="mx-auto w-full max-w-7xl flex-row items-center justify-between px-6"
          style={
            Platform.OS === "web"
              ? { overflow: "visible", zIndex: 30 }
              : undefined
          }
        >
          <View
            className="flex-row items-center"
            style={
              Platform.OS === "web"
                ? { overflow: "visible", zIndex: 30 }
                : undefined
            }
          >
            {primaryNav.map((item) => (
              <PrimaryNavItem
                key={item.label}
                item={item}
                active={pathname === item.href}
                isOpen={openMenu === item.label}
                onOpen={setOpenMenu}
                onClose={() => setOpenMenu(null)}
              />
            ))}
          </View>

          <View className="flex-row items-center gap-2.5 py-1.5">
            <Pressable
              onPress={onCallNow}
              accessibilityRole="button"
              accessibilityLabel="Call Safe Ride Africa now"
              className="h-9 flex-row items-center rounded-pill bg-brand-action px-4 web:transition-opacity web:hover:opacity-90 web:focus-visible:ring-2 web:focus-visible:ring-brand-ink"
            >
              <Phone size={15} color="#FFFFFF" />
              <Text className="ml-1.5 font-body-bold text-[13px] text-white">
                Call now
              </Text>
            </Pressable>
            <Pressable
              onPress={onEnrol}
              accessibilityRole="button"
              className="h-9 items-center justify-center rounded-pill bg-brand-deep px-5 web:transition-opacity web:hover:opacity-90 web:focus-visible:ring-2 web:focus-visible:ring-brand-ink"
            >
              <Text className="font-body-bold text-[13px] text-white">Enrol now</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
