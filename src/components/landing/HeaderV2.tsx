import React, { useState } from "react";
import { Modal, Pressable, Text, View, useWindowDimensions } from "react-native";
import { Link, usePathname } from "expo-router";
import { Menu, X } from "lucide-react-native";
import { Button } from "../../ui/Button";
import { color, breakpoint } from "../../ui/tokens";
import { useEnrollModal } from "../../context/EnrollModalContext";

/**
 * Flat, hierarchical nav in the AA style: no mega menu, no app shell.
 * Desktop: inline links + one primary CTA. Mobile: full-screen drawer
 * in a Modal so focus is trapped and Android back closes it.
 */

const NAV = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Services", href: "/services" },
  { label: "Branches", href: "/branches" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

function NavLink({
  href,
  label,
  active,
  onPress,
  drawer = false,
}: {
  href: string;
  label: string;
  active: boolean;
  onPress?: () => void;
  drawer?: boolean;
}) {
  return (
    <Link href={href} asChild>
      <Pressable
        onPress={onPress}
        accessibilityRole="link"
        accessibilityState={{ selected: active }}
        className={
          drawer
            ? "border-b border-chalk/10 py-4"
            : "web:outline-none web:focus-visible:ring-2 web:focus-visible:ring-amber rounded-sm px-3 py-2"
        }
      >
        <Text
          className={`font-body-medium ${
            drawer ? "text-2xl text-chalk" : "text-base text-ink"
          } ${active ? "text-amber-deep" : ""}`}
        >
          {label}
        </Text>
        {active ? <View className="mt-1 h-0.5 w-6 rounded-full bg-amber" /> : null}
      </Pressable>
    </Link>
  );
}

export function HeaderV2() {
  const [open, setOpen] = useState(false);
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const { openEnrollModal } = useEnrollModal();
  const isDesktop = width >= breakpoint.md;

  return (
    <View className="sticky top-0 z-50 border-b border-ink/10 bg-chalk/95 web:backdrop-blur">
      <View className="mx-auto w-full max-w-6xl flex-row items-center justify-between px-5 py-3 md:px-10">
        <Link href="/" asChild>
          <Pressable accessibilityRole="link" accessibilityLabel="SafeRide Africa, home">
            <Text className="font-display text-xl text-ink">
              SafeRide <Text className="text-amber-deep">Africa</Text>
            </Text>
          </Pressable>
        </Link>

        {isDesktop ? (
          <View className="flex-row items-center gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                active={pathname === item.href}
              />
            ))}
            <View className="ml-3">
              <Button label="Enrol now" onPress={openEnrollModal} size="md" />
            </View>
          </View>
        ) : (
          <Pressable
            onPress={() => setOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            className="h-11 w-11 items-center justify-center rounded-md"
          >
            <Menu size={26} color={color.ink} />
          </Pressable>
        )}
      </View>

      <Modal
        visible={open}
        animationType="slide"
        onRequestClose={() => setOpen(false)}
        presentationStyle="fullScreen"
      >
        <View className="flex-1 bg-asphalt px-6 pt-4">
          <View className="flex-row items-center justify-between">
            <Text className="font-display text-xl text-chalk">
              SafeRide <Text className="text-amber">Africa</Text>
            </Text>
            <Pressable
              onPress={() => setOpen(false)}
              accessibilityRole="button"
              accessibilityLabel="Close menu"
              className="h-11 w-11 items-center justify-center"
            >
              <X size={26} color={color.chalk} />
            </Pressable>
          </View>

          <View className="mt-8">
            {NAV.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                active={pathname === item.href}
                onPress={() => setOpen(false)}
                drawer
              />
            ))}
          </View>

          <View className="mt-10">
            <Button
              label="Enrol now"
              size="lg"
              fullWidth
              onPress={() => {
                setOpen(false);
                openEnrollModal();
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
