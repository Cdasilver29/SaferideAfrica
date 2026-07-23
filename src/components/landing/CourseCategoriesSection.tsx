import React from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Section, Card } from "../../ui/Section";
import { Heading, Subheading, Body, Eyebrow, Caption } from "../../ui/Typography";
import { PlateBadge } from "../../ui/PlateBadge";
import { Button } from "../../ui/Button";
import { CourseCardSkeleton } from "../../ui/Skeleton";
import { courseCategories, CourseCategory } from "../../data/courseCategories";
import { useEnrollModal } from "../../context/EnrollModalContext";

/**
 * Card-based course layout, the pattern that carries the AA page.
 * Data is static today (imported from src/data), but the section
 * accepts props so it keeps working unchanged if categories ever
 * come from the ops platform API: pass loading while fetching and
 * it renders skeletons; pass an empty array and it renders a real
 * empty state instead of a blank hole.
 */
export function CourseCategoriesSection({
  categories = courseCategories,
  loading = false,
}: {
  categories?: CourseCategory[];
  loading?: boolean;
}) {
  const { openEnrollModal } = useEnrollModal();
  const router = useRouter();

  return (
    <Section tone="tinted">
      <Eyebrow>What you can train for</Eyebrow>
      <Heading className="mt-2">Courses for every kind of driver</Heading>
      <Body className="mt-3 max-w-2xl">
        Whether you are starting from zero, adding a category to your licence,
        or getting back behind the wheel, there is a structured course for you.
        Exact requirements are confirmed when you enrol.
      </Body>

      <View
        className="mt-8 flex-row flex-wrap gap-5"
        accessibilityLabel={loading ? "Loading courses" : undefined}
        accessibilityState={loading ? { busy: true } : undefined}
      >
        {loading ? (
          <>
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </>
        ) : categories.length === 0 ? (
          <Card className="w-full items-start">
            <Subheading>Course list is being updated</Subheading>
            <Body className="mt-2">
              Talk to us directly and we will match you to the right course.
            </Body>
            <View className="mt-4">
              <Button label="Enquire now" onPress={openEnrollModal} />
            </View>
          </Card>
        ) : (
          categories.map((c) => (
            <Card
              key={c.id}
              className="w-full md:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
            >
              <PlateBadge code={c.code} />
              <Subheading className="mt-4">{c.title}</Subheading>
              <Caption className="mt-1 uppercase tracking-wide">
                {c.audience === "beginner"
                  ? "Fresh learner"
                  : c.audience === "endorsement"
                  ? "Licence endorsement"
                  : "Licensed drivers"}
              </Caption>
              <Body className="mt-2 flex-1">{c.blurb}</Body>
              <View className="mt-5 flex-row items-center gap-4">
                <Button label="Enrol" onPress={openEnrollModal} />
                {c.href ? (
                  <Pressable
                    accessibilityRole="link"
                    onPress={() => router.push(c.href!)}
                    className="rounded-sm web:outline-none web:focus-visible:ring-2 web:focus-visible:ring-amber"
                  >
                    <Text className="font-body-medium text-base text-ink underline">
                      Details
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </Card>
          ))
        )}
      </View>
    </Section>
  );
}
