import React from "react";
import { Text, TextProps, Platform } from "react-native";

/**
 * Typography primitives. Sections never use raw <Text> with ad-hoc
 * classes; they compose these. Keeps the scale consistent and makes
 * a future rebrand a one-file change.
 *
 * On web, headings render with the correct aria level for screen
 * readers and SEO.
 */

type TypoProps = TextProps & { className?: string };

const heading = (level: number) =>
  Platform.OS === "web"
    ? ({ accessibilityRole: "header" as const, "aria-level": level } as object)
    : { accessibilityRole: "header" as const };

export function Display({ className = "", ...rest }: TypoProps) {
  return (
    <Text
      {...heading(1)}
      className={`font-display text-4xl leading-tight tracking-tight text-ink md:text-6xl ${className}`}
      {...rest}
    />
  );
}

export function Heading({ className = "", ...rest }: TypoProps) {
  return (
    <Text
      {...heading(2)}
      className={`font-display text-2xl leading-snug text-ink md:text-4xl ${className}`}
      {...rest}
    />
  );
}

export function Subheading({ className = "", ...rest }: TypoProps) {
  return (
    <Text
      {...heading(3)}
      className={`font-display-medium text-lg text-ink md:text-xl ${className}`}
      {...rest}
    />
  );
}

/** Small uppercase label above a heading. One per section, max. */
export function Eyebrow({ className = "", ...rest }: TypoProps) {
  return (
    <Text
      className={`font-body-bold text-xs uppercase tracking-[0.18em] text-amber-deep ${className}`}
      {...rest}
    />
  );
}

export function Body({ className = "", ...rest }: TypoProps) {
  return (
    <Text
      className={`font-body text-base leading-relaxed text-ink-muted ${className}`}
      {...rest}
    />
  );
}

export function Caption({ className = "", ...rest }: TypoProps) {
  return (
    <Text className={`font-body text-sm text-ink-muted ${className}`} {...rest} />
  );
}
