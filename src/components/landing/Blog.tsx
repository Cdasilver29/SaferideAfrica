import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Calendar, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, BLOG_IMGS } from './constants';

export default function Blog() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const posts = t('blog.posts', { returnObjects: true }) as Array<{ date: string; title: string; excerpt: string }>;
  const anims = useRef(posts.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(120, anims.map(a => Animated.timing(a, { toValue: 1, duration: 500, useNativeDriver: true }))).start();
  }, []);

  return (
    <View style={{ backgroundColor: isDark ? C.darkBg : '#f9fafb', paddingVertical: 72, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        <View style={{ alignItems: 'center', marginBottom: 44 }}>
          <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>
            {t('blog.overline')}
          </Text>
          <Text style={{ color: C.heading, fontFamily: F.bold, fontSize: IS_WEB ? 34 : 26, textAlign: 'center', marginBottom: 12 }}>
            {t('blog.heading')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue }} />
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
          </View>
        </View>

        <View style={IS_WEB ? { flexDirection: 'row', gap: 20 } : { gap: 20 }}>
          {posts.map((post, i) => (
            <Animated.View
              key={post.title}
              style={{
                flex: IS_WEB ? 1 : undefined,
                opacity: anims[i],
                transform: [{ translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }],
                backgroundColor: isDark ? C.darkCard : '#ffffff',
                borderRadius: 20, overflow: 'hidden',
                shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 14, elevation: 2,
                borderWidth: 1, borderColor: isDark ? C.darkBorder : '#e5e7eb',
              }}
            >
              <View style={{ height: 180, position: 'relative' }}>
                <Image source={BLOG_IMGS[i]} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} resizeMode="cover" />
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.25)' }} />
                <View style={{ position: 'absolute', top: 14, left: 14, backgroundColor: C.yellow, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
                  <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 10 }}>{t('blog.categoryTag')}</Text>
                </View>
              </View>

              <View style={{ padding: 22 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Calendar size={12} color={C.blue} />
                  <Text style={{ color: C.blue, fontFamily: F.medium, fontSize: 12 }}>{post.date}</Text>
                </View>
                <Text style={{ color: C.heading, fontFamily: F.bold, fontSize: 16, lineHeight: 24, marginBottom: 10 }} numberOfLines={2}>
                  {post.title}
                </Text>
                <Text style={{ color: C.muted, fontFamily: F.regular, fontSize: 13, lineHeight: 20, marginBottom: 18 }} numberOfLines={3}>
                  {post.excerpt}
                </Text>
                <View style={{ height: 1, backgroundColor: '#e5e7eb', marginBottom: 14 }} />
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }} activeOpacity={0.7}>
                  <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 13 }}>{t('blog.readMore')}</Text>
                  <ChevronRight size={14} color={C.blue} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>
    </View>
  );
}
