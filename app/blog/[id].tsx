import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft, Calendar, Clock } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { BLOG_ARTICLES, BlogSection } from '../../src/data/saferide';
import { C, F, IS_WEB } from '../../src/components/landing/constants';
import { useTheme } from '../../src/lib/theme';
import { PageHead } from '../../src/components/PageHead';

// Pre-render one static HTML page per article so deep links resolve without a
// client fallback.
export function generateStaticParams(): { id: string }[] {
  return BLOG_ARTICLES.map((a) => ({ id: a.id }));
}

function BodyBlock({ block, T }: { block: BlogSection; T: any }) {
  if (block.type === 'heading') {
    return (
      <Text
        style={{
          color: T.foreground,
          fontFamily: F.bold,
          fontSize: IS_WEB ? 20 : 17,
          lineHeight: IS_WEB ? 28 : 24,
          marginTop: 28,
          marginBottom: 10,
        }}
      >
        {block.text}
      </Text>
    );
  }

  if (block.type === 'paragraph') {
    return (
      <Text
        style={{
          color: T.mutedForeground,
          fontFamily: F.regular,
          fontSize: 15,
          lineHeight: 26,
          marginBottom: 16,
        }}
      >
        {block.text}
      </Text>
    );
  }

  if (block.type === 'list') {
    return (
      <View style={{ marginBottom: 16, gap: 10 }}>
        {block.items?.map((item, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: C.skyDeep,
                marginTop: 10,
                flexShrink: 0,
              }}
            />
            <Text
              style={{
                flex: 1,
                color: T.mutedForeground,
                fontFamily: F.regular,
                fontSize: 15,
                lineHeight: 26,
              }}
            >
              {item}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  if (block.type === 'callout') {
    return (
      <View
        style={{
          backgroundColor: T.isDark ? 'rgba(1,165,240,0.12)' : 'rgba(1,165,240,0.07)',
          borderLeftWidth: 3,
          borderLeftColor: C.skyDeep,
          borderRadius: 8,
          padding: 16,
          marginTop: 8,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            color: T.foreground,
            fontFamily: F.medium,
            fontSize: 14,
            lineHeight: 24,
          }}
        >
          {block.text}
        </Text>
      </View>
    );
  }

  return null;
}

export default function BlogPostPage() {
  const router = useRouter();
  const T = useTheme();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const post = BLOG_ARTICLES.find(a => a.id === id);

  if (!post) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: T.background }}>
        <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 16 }}>{t('blogPage.notFound')}</Text>
        <TouchableOpacity onPress={() => router.replace('/')} style={{ marginTop: 20 }}>
          <Text style={{ color: C.blue, fontFamily: F.semibold }}>{t('blogPage.goHome')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: T.background }}
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      <PageHead
        title={`${post.title} | Safe Ride Africa`}
        description={post.description}
        path={`/blog/${post.id}`}
      />
      <View style={IS_WEB ? { maxWidth: 720, width: '100%', alignSelf: 'center', paddingHorizontal: 24 } : { paddingHorizontal: 20 }}>

        {/* Back */}
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/blog')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 24 }}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={C.blue} />
          <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 14 }}>{t('blogPage.back')}</Text>
        </TouchableOpacity>

        {/* Category + meta */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <View style={{ backgroundColor: C.yellow, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
            <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              {post.category}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Calendar size={13} color={T.mutedForeground} />
            <Text style={{ color: T.mutedForeground, fontFamily: F.medium, fontSize: 13 }}>{post.publishDate}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Clock size={13} color={T.mutedForeground} />
            <Text style={{ color: T.mutedForeground, fontFamily: F.medium, fontSize: 13 }}>{post.readTime}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: IS_WEB ? 30 : 22, lineHeight: IS_WEB ? 40 : 30, marginBottom: 12 }}>
          {post.title}
        </Text>

        {/* Description / lead */}
        <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 15, lineHeight: 26, marginBottom: 32, fontStyle: 'italic' }}>
          {post.description}
        </Text>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: T.border, marginBottom: 28 }} />

        {/* Article body */}
        {post.body.map((block, i) => (
          <BodyBlock key={i} block={block} T={T} />
        ))}

      </View>
    </ScrollView>
  );
}
