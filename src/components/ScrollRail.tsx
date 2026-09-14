import React, { useState } from 'react';
import { View, Text, Pressable, Platform, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { brand } from '@/lib/tokens';
import { F } from '@/components/landing/constants';
import { useReduceMotion } from '@/hooks/useReduceMotion';

/**
 * Desktop scroll-progress rail for the landing page.
 *
 * A thin fixed rail on the right edge: a faint track, a fill that tracks how
 * far down the page you are, and one dot per major section that jumps there.
 *
 * Four things shape the implementation:
 *
 * 1. The page does not scroll the document. The expo web reset puts
 *    body overflow hidden on the root and app/index.tsx owns the only
 *    scroller, so every value here comes from that ScrollView's scroll event
 *    (scrollY, contentHeight, viewportHeight) rather than from window.
 *
 * 2. Positions are measured, not assumed. Sections report their y through
 *    onLayout in index.tsx, so a section that has not laid out yet reports
 *    UNMEASURED and is simply skipped by the active-dot search.
 *
 * 3. Transform and opacity only. The fill is a full-height bar translated up
 *    inside a clipped track rather than an animated height, and the active dot
 *    is a second dot layered over the idle one, faded and scaled in. Nothing
 *    here animates a colour or a layout box.
 *
 * 4. It has to clear SocialFloat. That component pins its up-chevron at
 *    right 20, bottom 20 on every route, so the rail centres itself in the
 *    space above BOTTOM_CLEARANCE instead of in the raw viewport.
 */

/** Sentinel for a section whose wrapper has not reported onLayout yet. */
export const UNMEASURED = -1;

export type RailSection = {
  /** Stable key, also the lookup into the positions map. */
  key: string;
  /** i18n key for the dot's accessible name and hover label. */
  labelKey: string;
};

type ScrollRailProps = {
  sections: readonly RailSection[];
  /** Section key to its y offset inside the scroll content, from onLayout. */
  positions: Record<string, number>;
  scrollY: SharedValue<number>;
  contentHeight: SharedValue<number>;
  viewportHeight: SharedValue<number>;
  /** Scrolls the page. The ScrollView ref lives with the scroller, not here. */
  onJump: (y: number) => void;
};

const IS_WEB = Platform.OS === 'web';

// Matches HeaderV3's breakpoint: below 1280 the header is in drawer mode and
// the rail would crowd a layout that is already tight.
const DESKTOP_MIN_WIDTH = 1280;

const DOT_HIT = 44;      // Minimum tap target, and the rail's row pitch.
const DOT_SIZE = 9;      // The idle dot people actually see.
const ACTIVE_SIZE = 13;
const TRACK_W = 3;
const RIGHT_OFFSET = 22;

// The scrim only has to cover the track and the largest dot, so it stays a
// narrow pill rather than filling the 44px hit column.
const SCRIM_W = 22;
const SCRIM_BLEED = 8;

// Vertical space kept free at each end. The bottom figure clears SocialFloat's
// 50px chevron at bottom 20 with room to spare.
const BOTTOM_CLEARANCE = 100;
const TOP_CLEARANCE = 24;

// Fraction of the viewport down from the top where a section counts as the one
// being read. A third down tracks the eye better than the very top edge.
const ACTIVATION = 0.35;

// Past this much of the page, the last dot wins outright, so arriving at the
// footer always lights the final section even if it is shorter than the
// activation line.
const END_THRESHOLD = 0.995;

const FADE = 180;

/** Brand hex to rgba, so alpha variants stay derived from the tokens. */
function withAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

type Palette = {
  scrim: string;
  track: string;
  fill: string;
  idleDot: string;
  activeDot: string;
  labelBg: string;
  labelFg: string;
};

/**
 * brand.deep carries the fill and the active dot. brand.primary is the obvious
 * pick but sits at about 2.8:1 on white, under the 3:1 non-text minimum; deep
 * is the same hue darkened and clears 5:1. On the dark ground the roles swap,
 * since deep is then the low-contrast one.
 *
 * The scrim is what makes the rest of the palette safe. The rail floats over
 * whatever the page happens to be showing, and on the hero photo an ink track
 * at 0.12 disappears completely. A soft pill behind the marks gives them a
 * predictable ground: invisible over the light sections, a faint lift over the
 * photography.
 */
function palette(isDark: boolean): Palette {
  if (isDark) {
    return {
      scrim: withAlpha(brand.ink, 0.55),
      track: withAlpha(brand.onPrimary, 0.22),
      fill: brand.primary,
      idleDot: withAlpha(brand.onPrimary, 0.4),
      activeDot: brand.primary,
      labelBg: withAlpha(brand.onPrimary, 0.12),
      labelFg: brand.onPrimary,
    };
  }
  return {
    scrim: withAlpha(brand.onPrimary, 0.62),
    track: withAlpha(brand.ink, 0.16),
    fill: brand.deep,
    idleDot: withAlpha(brand.ink, 0.35),
    activeDot: brand.deep,
    labelBg: withAlpha(brand.ink, 0.88),
    labelFg: brand.onPrimary,
  };
}

type RailDotProps = {
  index: number;
  label: string;
  accessibilityLabel: string;
  activeIndex: SharedValue<number>;
  colors: Palette;
  reduceMotion: boolean;
  disabled: boolean;
  onPress: () => void;
};

function RailDot({
  index,
  label,
  accessibilityLabel,
  activeIndex,
  colors,
  reduceMotion,
  disabled,
  onPress,
}: RailDotProps) {
  const [hovered, setHovered] = useState(false);

  // The active dot is a separate layer over the idle one so the state change
  // stays opacity and scale. Animating backgroundColor would read the same but
  // break the transform-and-opacity rule.
  const activeStyle = useAnimatedStyle(() => {
    const on = activeIndex.value === index ? 1 : 0;
    const duration = reduceMotion ? 0 : FADE;
    return {
      opacity: withTiming(on, { duration }),
      transform: [{ scale: withTiming(0.55 + 0.45 * on, { duration }) }],
    };
  });

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onHoverIn={IS_WEB ? () => setHovered(true) : undefined}
      onHoverOut={IS_WEB ? () => setHovered(false) : undefined}
    >
      {/* Plain View: it owns the 44px hit area and the centring, which keeps
          layout off the animated node. */}
      <View style={{ width: DOT_HIT, height: DOT_HIT, alignItems: 'center', justifyContent: 'center' }}>
        {hovered ? (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              right: DOT_HIT - 6,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 999,
              backgroundColor: colors.labelBg,
            }}
          >
            <Text numberOfLines={1} style={{ fontFamily: F.semibold, fontSize: 12, color: colors.labelFg }}>
              {label}
            </Text>
          </View>
        ) : null}

        <View
          style={{
            width: DOT_SIZE,
            height: DOT_SIZE,
            borderRadius: DOT_SIZE / 2,
            backgroundColor: colors.idleDot,
          }}
        />
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              width: ACTIVE_SIZE,
              height: ACTIVE_SIZE,
              borderRadius: ACTIVE_SIZE / 2,
              backgroundColor: colors.activeDot,
            },
            activeStyle,
          ]}
        />
      </View>
    </Pressable>
  );
}

export default function ScrollRail({
  sections,
  positions,
  scrollY,
  contentHeight,
  viewportHeight,
  onJump,
}: ScrollRailProps) {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const { width } = useWindowDimensions();
  const reduceMotion = useReduceMotion();

  const colors = palette(colorScheme === 'dark');
  const railH = sections.length * DOT_HIT;

  // Plain array so the worklets below close over numbers, not over the object.
  const ys = sections.map((s) => positions[s.key] ?? UNMEASURED);

  const activeIndex = useDerivedValue(() => {
    const span = contentHeight.value - viewportHeight.value;
    const progress = span > 0 ? scrollY.value / span : 0;
    if (progress >= END_THRESHOLD) return ys.length - 1;

    const line = scrollY.value + viewportHeight.value * ACTIVATION;
    let found = 0;
    for (let i = 0; i < ys.length; i += 1) {
      if (ys[i] !== UNMEASURED && ys[i] <= line) found = i;
    }
    return found;
  });

  // A full-height bar slid up inside a clipped track: transform only, no
  // animated height.
  const fillStyle = useAnimatedStyle(() => {
    const span = contentHeight.value - viewportHeight.value;
    const raw = span > 0 ? scrollY.value / span : 0;
    const progress = raw < 0 ? 0 : raw > 1 ? 1 : raw;
    return { transform: [{ translateY: -(1 - progress) * railH }] };
  });

  if (width < DESKTOP_MIN_WIDTH) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: (IS_WEB ? 'fixed' : 'absolute') as 'absolute',
        top: 0,
        bottom: 0,
        right: RIGHT_OFFSET,
        // Centring happens inside these clearances, which is what keeps the
        // rail off SocialFloat's chevron.
        paddingTop: TOP_CLEARANCE,
        paddingBottom: BOTTOM_CLEARANCE,
        justifyContent: 'center',
        alignItems: 'center',
        // Under HeaderV3's mobile drawer at 200, above page content.
        zIndex: 90,
      }}
    >
      <View
        role="navigation"
        aria-label={t('scrollRail.label')}
        style={{ height: railH, alignItems: 'center', justifyContent: 'space-between' }}
      >
        {/* Decorative: the dots carry the navigation, the track carries none. */}
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          aria-hidden
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: -SCRIM_BLEED,
            height: railH + SCRIM_BLEED * 2,
            width: SCRIM_W,
            borderRadius: SCRIM_W / 2,
            backgroundColor: colors.scrim,
          }}
        />
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          aria-hidden
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            height: railH,
            width: TRACK_W,
            borderRadius: TRACK_W / 2,
            backgroundColor: colors.track,
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={[
              { width: TRACK_W, height: railH, borderRadius: TRACK_W / 2, backgroundColor: colors.fill },
              fillStyle,
            ]}
          />
        </View>

        {sections.map((section, index) => {
          const label = t(section.labelKey);
          const y = positions[section.key] ?? UNMEASURED;
          return (
            <RailDot
              key={section.key}
              index={index}
              label={label}
              accessibilityLabel={t('scrollRail.jumpTo', { section: label })}
              activeIndex={activeIndex}
              colors={colors}
              reduceMotion={reduceMotion}
              disabled={y === UNMEASURED}
              onPress={() => onJump(y)}
            />
          );
        })}
      </View>
    </View>
  );
}
