import React from 'react';
import { View, Text, Image, Pressable, type ImageSourcePropType } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react-native';
import { Badge, Icon } from '@/components/ui';
import { C, F } from './constants';

// Photo-first link card, extracted from PremiumCourseCards so the same shape
// can front any destination rather than only a CLASSES row. The whole card is
// the link and the Read More row is the visible affordance.
type ImageCardProps = {
  /** Route to push on press, for example /classes/B-LIGHT or /services/BEGINNER. */
  href: string;
  title: string;
  description: string;
  image?: ImageSourcePropType;
  /** Optional pill over the top-left of the photo. Omit for no badge. */
  badge?: string;
  /** Image alt text, defaults to the title. */
  imageAlt?: string;
};

export function ImageCard({ href, title, description, image, badge, imageAlt }: ImageCardProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={() => router.push(href as any)}
      accessibilityRole="link"
      accessibilityLabel={title}
      className="overflow-hidden rounded-card border border-border bg-card hover:border-primary/50 active:opacity-90"
    >
      {/* Sized image container: a 3:2 aspect-ratio box frames the landscape
          photos with little crop and gives portrait sources a taller band.
          Explicit inline dimensions on the Image stop react-native-web
          injecting the source's intrinsic height (same fix as courses). */}
      <View style={{ aspectRatio: 3 / 2, width: '100%' }} className="overflow-hidden">
        {image && (
          <Image
            source={image}
            resizeMode="cover"
            accessibilityLabel={imageAlt ?? title}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        )}
        {badge ? (
          <Badge variant="accent" className="absolute left-3 top-3">
            {badge}
          </Badge>
        ) : null}
      </View>

      <View className="p-5">
        <Text style={{ fontFamily: F.bold }} className="mb-1 text-lg text-foreground">
          {title}
        </Text>
        <Text style={{ fontFamily: F.regular }} className="mb-2 text-sm leading-5 text-muted-foreground">
          {description}
        </Text>
        <View className="h-11 flex-row items-center gap-1.5">
          <Text style={{ fontFamily: F.semibold }} className="text-sm text-primary">
            {t('common.readMore')}
          </Text>
          <Icon icon={ArrowRight} size="sm" color={C.skyDeep} />
        </View>
      </View>
    </Pressable>
  );
}
