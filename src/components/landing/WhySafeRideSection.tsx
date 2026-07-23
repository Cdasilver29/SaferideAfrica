import React from "react";
import { View } from "react-native";
import { ShieldCheck, Users, MapPin, BadgeCheck } from "lucide-react-native";
import { Section } from "../../ui/Section";
import { Heading, Subheading, Body, Eyebrow } from "../../ui/Typography";
import { Button } from "../../ui/Button";
import { color } from "../../ui/tokens";
import { useEnrollModal } from "../../context/EnrollModalContext";

/**
 * Benefits, then the closing CTA band. Together these are the bottom
 * of the conversion funnel: reassure, then ask once, clearly.
 */

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Safety-first curriculum",
    body: "Defensive habits are built in from lesson one, not bolted on before the test.",
  },
  {
    icon: Users,
    title: "Patient, certified instructors",
    body: "Instructors trained to teach, not just to drive. No shouting, no shortcuts.",
  },
  {
    icon: MapPin,
    title: "Real-road training",
    body: "Lessons on the routes you will actually drive, from estate roads to highway merges.",
  },
  {
    icon: BadgeCheck,
    title: "Test-day ready",
    body: "Structured progress checks so you book your test when you are ready, not before.",
  },
] as const;

export function WhySafeRideSection() {
  return (
    <Section tone="light">
      <Eyebrow>Why SafeRide</Eyebrow>
      <Heading className="mt-2">Built around how people actually learn</Heading>

      <View className="mt-8 flex-row flex-wrap gap-x-10 gap-y-8">
        {BENEFITS.map(({ icon: Icon, title, body }) => (
          <View key={title} className="w-full flex-row gap-4 md:w-[calc(50%-20px)]">
            <View className="h-12 w-12 items-center justify-center rounded-md bg-amber/15">
              <Icon size={24} color={color.amberDeep} />
            </View>
            <View className="flex-1">
              <Subheading>{title}</Subheading>
              <Body className="mt-1">{body}</Body>
            </View>
          </View>
        ))}
      </View>
    </Section>
  );
}

export function ApplyCtaSection({
  onWhatsApp,
}: {
  /** Wire to the existing WhatsApp deep-link helper used by EnrollModal */
  onWhatsApp: () => void;
}) {
  const { open: openEnrollModal } = useEnrollModal();
  return (
    <Section tone="dark">
      <View className="items-center">
        <Heading className="text-center text-chalk">
          Ready for your first lesson?
        </Heading>
        <Body className="mt-3 max-w-xl text-center text-ink-on-dark-muted">
          Enrolment takes a few minutes. Tell us what you want to drive and we
          will get you scheduled.
        </Body>
        <View className="mt-8 flex-col items-center gap-3 md:flex-row">
          <Button label="Enrol now" size="lg" onPress={openEnrollModal} />
          <Button
            label="Ask on WhatsApp"
            size="lg"
            variant="whatsapp"
            onPress={onWhatsApp}
            accessibilityLabel="Ask a question on WhatsApp"
          />
        </View>
      </View>
    </Section>
  );
}
