import React from 'react';
import { View, Text, SafeAreaView, ScrollView, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';

import { PageHero } from '@/components/landing/PageHero';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { ArticleCard } from '@/components/landing/ArticleCard';

import { C, F, IS_WEB, MAX_W, BLOG_IMGS } from '@/components/landing/constants';
import { BLOG_ARTICLES } from '@/data/saferide';
import { useTheme } from '@/lib/theme';
import { PageHead } from '@/components/PageHead';
import { Reveal } from '@/components/animations/Reveal';

// ─── Article grid ────────────────────────────────────────────────────────────
function ArticleGrid() {
  const T = useTheme();
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || (IS_WEB && winW < 768);

  return (
    <View style={{ backgroundColor: T.background, paddingVertical: IS_WEB ? 80 : 48, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        {/* Centred caption + title */}
        <View style={{ marginBottom: 48, alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: F.medium, fontSize: 11, textTransform: 'uppercase',
              letterSpacing: 2, color: T.mutedForeground, marginBottom: 12,
            }}
          >
            {t('blogPage.sectionOverline')}
          </Text>
          <Text
            style={{
              fontFamily: F.regular,
              fontSize: IS_WEB ? 46 : 28,
              lineHeight: IS_WEB ? 56 : 36,
              letterSpacing: -0.5,
              color: T.foreground,
              textAlign: 'center',
            }}
          >
            {t('blogPage.title')}
          </Text>
        </View>

        {/* 3-column on desktop, single-column on mobile */}
        <View style={isMobile
          ? { gap: 16 }
          : { flexDirection: 'row', gap: 24, flexWrap: 'wrap' }
        }>
          {BLOG_ARTICLES.map((article, i) => (
            <View
              key={article.id}
              style={isMobile
                ? { width: '100%' }
                : { width: 'calc(33.333% - 16px)' as any }
              }
            >
              <ArticleCard article={article} image={BLOG_IMGS[i]} />
            </View>
          ))}
        </View>

      </View>
    </View>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const T = useTheme();
  const { t } = useTranslation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.background }}>
      <PageHead
        title="Blog: Driving Tips and NTSA Guides | Safe Ride Africa"
        description="Practical driving advice, NTSA Smart DL guides, and defensive driving tips from Safe Ride Africa's certified instructors in Nairobi."
        path="/blog"
      />
      <Navbar />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <PageHero overline={t('blogPage.pageOverline')} title={t('blogPage.title')} />
        <Reveal><ArticleGrid /></Reveal>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
