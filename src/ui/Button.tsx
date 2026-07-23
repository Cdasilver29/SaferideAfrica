import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { color } from "./tokens";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "whatsapp";
export type ButtonSize = "md" | "lg";

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, blocks presses, announces busy state */
  loading?: boolean;
  disabled?: boolean;
  /** Optional leading icon element, e.g. a lucide icon sized 18 */
  icon?: React.ReactNode;
  /** Stretch to container width. Default true on its own line in mobile layouts */
  fullWidth?: boolean;
  /** Override the announced label when the visible label lacks context */
  accessibilityLabel?: string;
  testID?: string;
}

const base =
  "flex-row items-center justify-center rounded-md transition-colors " +
  "web:cursor-pointer web:select-none web:outline-none " +
  "web:focus-visible:ring-2 web:focus-visible:ring-amber web:focus-visible:ring-offset-2";

const variants: Record<ButtonVariant, { box: string; text: string; spinner: string }> = {
  primary: {
    box: "bg-amber active:bg-amber-deep web:hover:bg-amber-deep",
    text: "text-ink",
    spinner: color.ink,
  },
  secondary: {
    box: "bg-transparent border-2 border-ink active:bg-ink/5 web:hover:bg-ink/5",
    text: "text-ink",
    spinner: color.ink,
  },
  ghost: {
    box: "bg-transparent active:bg-ink/5 web:hover:bg-ink/5",
    text: "text-ink",
    spinner: color.ink,
  },
  whatsapp: {
    box: "bg-signal active:opacity-90 web:hover:opacity-90",
    text: "text-chalk",
    spinner: color.chalk,
  },
};

const sizes: Record<ButtonSize, { box: string; text: string }> = {
  md: { box: "h-11 px-5", text: "text-base" },
  lg: { box: "h-14 px-8", text: "text-lg" },
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  accessibilityLabel,
  testID,
}: ButtonProps) {
  const v = variants[variant];
  const s = sizes[size];
  const blocked = disabled || loading;

  return (
    <Pressable
      onPress={blocked ? undefined : onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: blocked, busy: loading }}
      testID={testID}
      className={`${base} ${v.box} ${s.box} ${fullWidth ? "w-full" : "self-start"} ${
        blocked ? "opacity-50" : ""
      }`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.spinner} />
      ) : (
        <>
          {icon ? <View className="mr-2">{icon}</View> : null}
          <Text className={`font-body-bold ${v.text} ${s.text}`}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}
