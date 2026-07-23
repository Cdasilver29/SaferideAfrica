import React, { useState } from "react";
import { Image, View } from "react-native";
import { Button } from "../../ui/Button";
import { Display, Body, Eyebrow } from "../../ui/Typography";
import { PlateBadge } from "../../ui/PlateBadge";
import { Section } from "../../ui/Section";
import { Skeleton } from "../../ui/Skeleton";
import { useEnrollModal } from "../../context/EnrollModalContext";
import { useRouter } from "expo-router";

/**
 * Hero. Split layout on desktop, stacked on mobile. The copy leads
 * with the outcome (a confident licensed driver), not the school.
 * Image loads behind a skeleton and degrades to a plain amber panel
 * if the asset fails, so the hero never renders broken.
 */
export function HeroV2() {
  const { openEnrollModal } = useEnrollModal();
  const router = useRouter();
  const [imgState, setImgState] = useState<"loading" | "ready" | "error">("loading");

  return (
    <Section tone="light" className="pt-8 md:pt-14">
      <View className="flex-col gap-10 md:flex-row md:items-center">
        <View className="flex-1">
          <Eyebrow>Driving school, Nairobi</Eyebrow>
          <Display className="mt-3">
            Learn to drive with instructors who take the pass seriously.
          </Display>
          <Body className="mt-4 max-w-xl">
            From your first lesson to test day, SafeRide trains you on real
            Nairobi roads with a structured curriculum and patient, certified
            instructors. Beginners, endorsements and refreshers.
          </Body>

          <View className="mt-5 flex-row flex-wrap gap-2">
            {["A2", "B1", "C1", "D1"].map((c) => (
              <PlateBadge key={c} code={c} />
            ))}
          </View>

          <View className="mt-8 flex-col gap-3 md:flex-row">
            <Button label="Enrol now" size="lg" onPress={openEnrollModal} />
            <Button
              label="Browse courses"
              size="lg"
              variant="secondary"
              onPress={() => router.push("/courses")}
            />
          </View>
        </View>

        <View className="min-h-[260px] flex-1 overflow-hidden rounded-lg md:min-h-[420px]">
          {imgState === "loading" && <Skeleton className="absolute inset-0" />}
          {imgState === "error" ? (
            <View className="flex-1 items-center justify-center bg-amber/20" />
          ) : (
            <Image
              source={require("../../../public/images/hero-lesson.webp")}
              accessibilityLabel="Instructor guiding a student driver through a lesson"
              className="h-full w-full"
              resizeMode="cover"
              onLoad={() => setImgState("ready")}
              onError={() => setImgState("error")}
            />
          )}
        </View>
      </View>
    </Section>
  );
}
