import React from "react";
import { Text, View } from "react-native";

/**
 * Signature element. Licence-category codes (A2, B1, C1, D1) rendered
 * as a Kenyan number-plate lozenge: amber field, black type, rounded
 * corners, subtle rivet dots. Used anywhere a category code appears,
 * so the codes read as objects from the driving world instead of
 * abstract labels.
 */
export function PlateBadge({
  code,
  size = "md",
}: {
  code: string;
  size?: "md" | "lg";
}) {
  const box = size === "lg" ? "px-4 py-2" : "px-3 py-1";
  const text = size === "lg" ? "text-xl" : "text-sm";
  return (
    <View
      accessibilityLabel={`Licence category ${code}`}
      className={`self-start flex-row items-center rounded-[6px] border-2 border-ink/80 bg-amber ${box}`}
    >
      <View className="mr-2 h-1.5 w-1.5 rounded-full bg-ink/40" />
      <Text className={`font-display tracking-widest text-ink ${text}`}>{code}</Text>
      <View className="ml-2 h-1.5 w-1.5 rounded-full bg-ink/40" />
    </View>
  );
}
