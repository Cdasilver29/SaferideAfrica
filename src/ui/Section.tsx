import React from "react";
import { View, ViewProps } from "react-native";

/**
 * Section owns vertical rhythm and horizontal gutters so individual
 * sections never invent their own padding. tone switches text and
 * background pairs together, which prevents contrast bugs when a
 * section is moved.
 */
export function Section({
  tone = "light",
  className = "",
  children,
  ...rest
}: ViewProps & { tone?: "light" | "dark" | "tinted"; className?: string }) {
  const bg =
    tone === "dark" ? "bg-asphalt" : tone === "tinted" ? "bg-chalk-dim" : "bg-chalk";
  return (
    <View className={`${bg} px-5 py-12 md:px-10 md:py-[72px] ${className}`} {...rest}>
      <View className="mx-auto w-full max-w-6xl">{children}</View>
    </View>
  );
}

/**
 * RoadDivider. A dashed centre line between sections, the one piece
 * of decoration the page allows itself. Marked decorative for
 * assistive tech.
 */
export function RoadDivider() {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="h-10 flex-row items-center justify-center bg-chalk"
    >
      <View className="flex-row gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <View key={i} className="h-1 w-8 rounded-full bg-ink/15" />
        ))}
      </View>
    </View>
  );
}

export function Card({
  className = "",
  children,
  ...rest
}: ViewProps & { className?: string }) {
  return (
    <View
      className={
        "rounded-lg border border-ink/10 bg-chalk p-6 " +
        "web:transition-shadow web:hover:shadow-lg " +
        className
      }
      {...rest}
    >
      {children}
    </View>
  );
}
