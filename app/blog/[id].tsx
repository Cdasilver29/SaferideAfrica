import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft, Calendar, Clock } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BLOG_POSTS } from '../../src/components/landing/constants';
import { C, F, IS_WEB } from '../../src/components/landing/constants';
import { useTheme } from '../../src/lib/theme';

export default function BlogPostPage() {
  const router = useRouter();
  const T = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const index = parseInt(id ?? '0', 10);
  const post = BLOG_POSTS[index];

  if (!post) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Text style={{ color: C.heading, fontFamily: F.bold, fontSize: 16 }}>Post not found.</Text>
        <TouchableOpacity onPress={() => router.replace('/')} style={{ marginTop: 20 }}>
          <Text style={{ color: C.blue, fontFamily: F.semibold }}>Go Home</Text>
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
      <View style={IS_WEB ? { maxWidth: 720, width: '100%', alignSelf: 'center', paddingHorizontal: 24 } : { paddingHorizontal: 20 }}>

        {/* Back */}
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 24 }}
          activeOpacity={0.7}
          accessibilityLabel="Back"
        >
          <ArrowLeft size={22} color={C.blue} />
          <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 14 }}>Back</Text>
        </TouchableOpacity>

        {/* Category + date */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <View style={{ backgroundColor: C.yellow, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
            <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Driving Tips
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Calendar size={13} color={C.muted} />
            <Text style={{ color: C.muted, fontFamily: F.medium, fontSize: 13 }}>{post.date}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: IS_WEB ? 28 : 22, lineHeight: IS_WEB ? 38 : 30, marginBottom: 16 }}>
          {post.title}
        </Text>

        <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 15, lineHeight: 25, marginBottom: 32 }}>
          {post.excerpt}
        </Text>

        <View style={{ backgroundColor: T.card, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: T.border, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Clock size={20} color={T.mutedForeground} />
            <Text style={{ color: T.foreground, fontFamily: F.semibold, fontSize: 15 }}>Full article coming soon</Text>
          </View>
          <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
            Our team is working on the full article. Check back shortly or follow us on social media for updates.
          </Text>
        </View>

      </View>
    </ScrollView>
  );
}
