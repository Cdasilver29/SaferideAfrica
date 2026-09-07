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
 * HeaderV3, two rows on desktop.
 *
 *   Row 1  brand-deep     thin utility strip: secondary nav, socials,
 *                         language, theme. White text, 5.78:1. No logo.
 *   Row 2  brand-surface  logo, primary nav, CTAs. Light grey, so every
 *                         label is brand-ink; nothing on this row is white.
 *
 * WHY DARK TEXT THROUGHOUT ROW 2: the surface is light, so white would be
 * unreadable. State is signalled with a yellow pad behind the item instead
 * of a colour change, keeping dark ink on yellow at about 15:1. The same
 * rule governs the dropdown panels: sky background, brand-ink labels at
 * about 6.9:1, yellow pad on hover.
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

/**
 * The language switcher and theme toggle appear on two grounds: the sky row 1
 * and the brand-deep mobile drawer. Pass a function to colour them per ground
 * (onLight is true on row 1); a plain node is still accepted and used as is.
 */
export type HeaderControl =
  | React.ReactNode
  | ((onLight: boolean) => React.ReactNode);

const renderControl = (control: HeaderControl, onLight: boolean) =>
  typeof control === "function" ? control(onLight) : control;

export interface HeaderV3Props {
  languageSwitcher?: HeaderControl;
  themeToggle?: HeaderControl;
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

/**
 * The wordmark sits on two very different grounds: the sky mobile bar and
 * deep drawer (yellow name, white tagline) and the light grey desktop row 2,
 * where both of those would fail contrast. onLight switches it to ink.
 */
function Wordmark({
  compact = false,
  onLight = false,
}: {
  compact?: boolean;
  onLight?: boolean;
}) {
  return (
    <View>
      <Text
        className={`font-display ${
          compact ? "text-lg" : "text-xl"
        } leading-tight ${onLight ? "text-brand-ink" : "text-brand-accent"}`}
      >
        Safe Ride Africa
      </Text>
      <Text
        className={`font-body text-[9px] uppercase tracking-[0.22em] ${
          onLight ? "text-brand-ink/60" : "text-white/80"
        }`}
      >
        Safety beyond
      </Text>
    </View>
  );
}

/**
 * One row inside a dropdown panel. The panel is brand-deep, so the label is
 * white (5.79:1). On hover the row takes the yellow pad, and there the label
 * must flip to ink, since white on brand-accent is about 1.1:1.
 *
 * Hover is tracked in state rather than with a CSS hover class: a :hover on
 * the Text only fires while the pointer is over the glyphs, so hovering the
 * row's padding would leave white text sitting on the yellow pad. Focus uses
 * a ring instead of the pad, so the label colour never has to change for it.
 */
function PanelItem({
  href,
  label,
  bold = false,
  className = "",
  onNavigate,
}: {
  href: NavItem["href"];
  label: string;
  bold?: boolean;
  className?: string;
  onNavigate: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityRole="link"
        onPress={onNavigate}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        className={`${className} web:outline-none web:focus-visible:ring-2 web:focus-visible:ring-brand-accent ${
          hovered ? "bg-brand-accent" : ""
        }`}
      >
        <Text
          className={`${bold ? "font-body-bold" : "font-body-medium"} text-sm ${
            hovered ? "text-brand-ink" : "text-white"
          }`}
        >
          {label}
        </Text>
      </Pressable>
    </Link>
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
  const hasChildren = !!item.children?.length;
  const isWeb = Platform.OS === "web";

  // A grouped panel (series headings plus their classes) takes priority
  // over the plain child list. Items with children and no groups keep the
  // simple flat-list behaviour below.
  const groups = item.groups ?? [];
  const hasGroups = groups.length > 0;

  // Panels with more than six children split into two even columns; About
  // us stays single-column.
  const childItems = item.children ?? [];
  const twoColumn = childItems.length > 6;
  const mid = Math.ceil(childItems.length / 2);
  const columns = twoColumn
    ? [childItems.slice(0, mid), childItems.slice(mid)]
    : [childItems];

  // Distribute the groups across three columns, balancing total row count,
  // not group count: each group weighs one heading row plus one row per
  // class. Greedy in series order, each group added to the shortest column.
  const groupColumns: (typeof groups)[] = [[], [], []];
  const groupRows = [0, 0, 0];
  groups.forEach((group) => {
    let target = 0;
    for (let i = 1; i < groupRows.length; i++) {
      if (groupRows[i] < groupRows[target]) target = i;
    }
    groupColumns[target].push(group);
    groupRows[target] += 1 + group.items.length;
  });

  // On web, hover is the only trigger, matching AA. Touch devices have no
  // hover, so there the button press toggles the panel. These go on the outer
  // View, so we use pointer events, not Pressable's onHoverIn/onHoverOut:
  // react-native-web only wires those on Pressable, and silently drops them on
  // a plain View. onPointerLeave fires only when leaving the View and every
  // descendant, so moving from the trigger into the panel keeps it open.
  const hoverProps =
    isWeb && hasChildren
      ? {
          onPointerEnter: () => onOpen(item.label),
          onPointerLeave: () => onClose(),
        }
      : {};

  // Text-only on desktop. The leading glyph cost about 22px per item and put
  // the row over budget at 1280; the drawer keeps its icons, it has the room.
  const inner = (
    <>
      <Text className="font-body-bold text-[13px] uppercase tracking-wide text-brand-ink">
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

  // Row 2 is light grey, so the label colour never changes. State is a yellow
  // pad behind the item: hovered, open, or active all read dark-on-yellow,
  // everything else dark-on-grey.
  const highlighted = active || isOpen;
  const pressableClass = [
    "flex-row items-center gap-1.5 rounded-sm px-3 py-3.5",
    "web:transition-colors web:hover:bg-brand-accent",
    "web:outline-none web:focus-visible:ring-2 web:focus-visible:ring-brand-ink",
    highlighted ? "bg-brand-accent" : "",
  ].join(" ");

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

      {hasGroups && isOpen ? (
        <View
          className="absolute left-0 top-full z-50 rounded-b-md border border-black/10 bg-brand-deep px-2 py-2 shadow-lg"
          style={{ width: 680 }}
        >
          {/* Plain children (All courses) sit above the grouped columns. */}
          {childItems.map((child) => (
            <PanelItem
              key={child.label}
              href={child.href}
              label={child.label}
              bold
              className="mx-2 rounded-sm px-2 py-2.5"
              onNavigate={onClose}
            />
          ))}
          <View className="mx-2 my-1 h-px bg-white/25" />
          <View className="flex-row">
            {groupColumns.map((col, colIndex) => (
              <View key={colIndex} className="flex-1 px-2">
                {col.map((group) => (
                  <View key={group.label} className="mb-3">
                    <Text className="px-2 pb-1 font-body-bold text-[11px] uppercase tracking-[0.1em] text-white/85">
                      {group.label}
                    </Text>
                    {group.items.map((gi) => (
                      <PanelItem
                        key={gi.label}
                        href={gi.href}
                        label={gi.label}
                        className="rounded-sm px-2 py-1.5"
                        onNavigate={onClose}
                      />
                    ))}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {hasChildren && !hasGroups && isOpen ? (
        <View
          className="absolute left-0 top-full z-50 flex-row rounded-b-md border border-black/10 bg-brand-deep py-1.5 shadow-lg"
          style={{ width: twoColumn ? 440 : 220 }}
        >
          {columns.map((col, colIndex) => (
            <View key={colIndex} className="flex-1">
              {col.map((child) => (
                <PanelItem
                  key={child.label}
                  href={child.href}
                  label={child.label}
                  className="px-4 py-2.5"
                  onNavigate={onClose}
                />
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
  // The two-row header needs the full 1280 container: below that the nav,
  // logo and CTAs no longer fit on one line, so 1024 to 1279 gets the drawer.
  const isDesktop = width >= 1280;

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

                    {isOpen ? (
                      <>
                        {item.children?.map((child) => (
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
                        ))}
                        {/* Grouped classes: series heading then its classes. */}
                        {item.groups?.map((group) => (
                          <View key={group.label} className="pb-1 pt-2">
                            <Text className="pb-1 pl-9 font-body-bold text-xs uppercase tracking-[0.1em] text-white/85">
                              {group.label}
                            </Text>
                            {group.items.map((gi) => (
                              <Link key={gi.label} href={gi.href} asChild>
                                <Pressable
                                  accessibilityRole="link"
                                  onPress={() => setDrawer(false)}
                                  className="py-3 pl-9"
                                >
                                  <Text className="font-body text-base text-white/85">
                                    {gi.label}
                                  </Text>
                                </Pressable>
                              </Link>
                            ))}
                          </View>
                        ))}
                      </>
                    ) : null}
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
                {renderControl(languageSwitcher, false)}
                {renderControl(themeToggle, false)}
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
      {/* Row 1, thin utility strip on true sky. Labels and social glyphs are
          white by design decision; note white on brand-primary measures
          2.75:1, below the 4.5:1 text threshold. No logo on this row. */}
      <View className="bg-brand-primary">
        <View className="mx-auto w-full max-w-7xl flex-row items-center justify-between px-6 py-2">
          <View className="flex-row items-center">
            {secondaryNav.map((item) => (
              <Link key={item.label} href={item.href} asChild>
                <Pressable
                  accessibilityRole="link"
                  accessibilityState={{ selected: pathname === item.href }}
                  className="rounded-sm px-3 py-1 web:transition-colors web:hover:bg-white/10 web:outline-none web:focus-visible:ring-2 web:focus-visible:ring-brand-accent"
                >
                  <Text className="font-body-bold text-xs uppercase tracking-[0.12em] text-white">
                    {item.label}
                  </Text>
                </Pressable>
              </Link>
            ))}
          </View>

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
              {renderControl(languageSwitcher, true)}
              {renderControl(themeToggle, true)}
            </View>
          </View>
        </View>
      </View>

      {/* Row 2, main nav on the light surface: logo left, nav centre, CTAs
          right. The dropdown panels anchor here, so this row carries the
          overflow/zIndex chain that stops them being clipped: wrapper, row,
          container, nav group, then each PrimaryNavItem root. Do not flatten. */}
      <View
        className="bg-brand-surface"
        style={
          Platform.OS === "web" ? { overflow: "visible", zIndex: 30 } : undefined
        }
      >
        <View
          className="mx-auto w-full max-w-7xl flex-row items-center justify-between gap-x-8 px-6"
          style={
            Platform.OS === "web"
              ? { overflow: "visible", zIndex: 30 }
              : undefined
          }
        >
          <Link href="/" asChild>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Safe Ride Africa, home"
              className="shrink-0 flex-row items-center gap-3 py-2"
            >
              <Image source={logoSource} style={LOGO_DESKTOP} resizeMode="contain" />
              <Wordmark onLight />
            </Pressable>
          </Link>

          <View
            className="flex-1 flex-row items-center justify-start"
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

          <View className="flex-row items-center gap-2.5 py-2">
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
              className="h-9 items-center justify-center rounded-pill bg-brand-accent px-5 web:transition-opacity web:hover:opacity-90 web:focus-visible:ring-2 web:focus-visible:ring-brand-ink"
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
