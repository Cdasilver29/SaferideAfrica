import React from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { C, F, IS_WEB, MAX_W, GALLERY_IMGS } from './constants';
import { Button, Icon } from '@/components/ui';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { SectionIntro } from './SectionIntro';

// Homepage gallery teaser (home restructure Phase 5): six curated tiles from
// GALLERY_IMGS linking to the full gallery page. Tiles use the sized-container
// pattern, an explicit height on every image, or react-native-web renders the
// photo at its full natural height. The set skips the four hero-rotation
// photos so the homepage never shows the same shot twice.

type GalleryItem = { uri: string; caption: string } | { src: any; caption: string };
const getSource = (item: GalleryItem) => ('uri' in item ? { uri: item.uri } : item.src);

const PREVIEW_FILES = ['DSC_2225', 'DSC_2258', 'DSC_2725', 'DSC_2976', 'DSC_7016', 'DSC_7879'];
const THUMB_SIZES = '(max-width: 768px) 45vw, 350px';
// Loading placeholder, the palette sky at 10 percent (8-digit hex, no raw colour)
const THUMB_PLACEHOLDER = `${C.skyDeep}1a`;

export default function GalleryPreview() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || winW < 768;

  const all = GALLERY_IMGS as GalleryItem[];
  const items = IS_WEB
    ? PREVIEW_FILES
        .map((f) => all.find((g) => 'uri' in g && g.uri.includes(f)))
        .filter((g): g is GalleryItem => Boolean(g))
    : all.slice(0, 6);

  const tileH = isMobile ? 120 : 200;
  const openGallery = () => router.push('/gallery' as any);

  return (
    <View className="bg-secondary/10 px-6 py-14 dark:bg-background">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        <SectionIntro
          badge={t('home.gallerySnippet.badge')}
          title={t('home.gallerySnippet.title')}
          description={t('home.gallerySnippet.description')}
        />

        {/* 2 columns on phones, 3 on tablet and desktop */}
        <View className="flex-row flex-wrap justify-center gap-2 web:gap-3">
          {items.map((item, i) => (
            <Pressable
              key={('uri' in item ? item.uri : String(i))}
              onPress={openGallery}
              accessibilityRole="link"
              accessibilityLabel={item.caption}
              className="overflow-hidden rounded-card active:opacity-80"
              style={{ width: isMobile ? '48%' : '31%' }}
            >
              <ResponsiveImage
                source={getSource(item)}
                alt={item.caption}
                sizes={THUMB_SIZES}
                style={{ width: '100%', height: tileH, backgroundColor: THUMB_PLACEHOLDER }}
              />
            </Pressable>
          ))}
        </View>

        <View className="mt-8 items-center">
          <Button
            variant="outline"
            onPress={openGallery}
            accessibilityLabel={t('home.gallerySnippet.viewAll')}
            className="px-7"
          >
            <Text style={{ fontFamily: F.bold }} className="text-base text-foreground">
              {t('home.gallerySnippet.viewAll')}
            </Text>
            <Icon icon={ArrowRight} size="md" color={isDark ? C.white : C.dark} />
          </Button>
        </View>
      </View>
    </View>
  );
}
