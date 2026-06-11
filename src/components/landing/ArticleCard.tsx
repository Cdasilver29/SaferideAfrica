import React, { useEffect, useState } from 'react'
import { View, Text, Image, Pressable, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { ArrowRight } from 'lucide-react-native'

import { useTranslation } from 'react-i18next'

import { useTheme } from '@/lib/theme'
import { C, F } from './constants'
import type { BlogArticle } from '@/data/saferide'

function ReadMoreLink({ hovered }: { hovered: boolean }) {
  const T = useTheme()
  const { t } = useTranslation()
  const out = useSharedValue(0)
  const inn = useSharedValue(-20)

  useEffect(() => {
    if (hovered) {
      out.value = withTiming(32, { duration: 500, easing: Easing.bezier(0.16, 1, 0.3, 1) })
      inn.value = withTiming(0,  { duration: 500, easing: Easing.bezier(0.16, 1, 0.3, 1) })
    } else {
      out.value = withTiming(0,   { duration: 300 })
      inn.value = withTiming(-20, { duration: 300 })
    }
  }, [hovered])

  const outStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: out.value }],
    opacity: interpolate(out.value, [0, 32], [1, 0]),
  }))
  const innStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: inn.value }],
    opacity: interpolate(inn.value, [-20, 0], [0, 1]),
  }))

  const arrowColor = T.isDark ? C.white : C.dark

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          width: 32, height: 32,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: T.border,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 8,
        }}
      >
        <Animated.View style={[{ position: 'absolute' }, outStyle]}>
          <ArrowRight size={14} color={arrowColor} />
        </Animated.View>
        <Animated.View style={[{ position: 'absolute' }, innStyle]}>
          <ArrowRight size={14} color={arrowColor} />
        </Animated.View>
      </View>
      <Text style={{ fontFamily: F.medium, fontSize: 13, color: T.foreground }}>
        {t('blogPage.readMore')}
      </Text>
    </View>
  )
}

export function ArticleCard({ article, image }: { article: BlogArticle; image: any }) {
  const router = useRouter()
  const T = useTheme()
  const [hovered, setHovered] = useState(false)

  const cardBg   = T.isDark ? 'rgba(34,31,32,0.5)' : 'rgba(255,255,255,0.5)'
  const badgeBg  = T.isDark ? 'rgba(255,255,255,0.1)' : C.white
  const badgeTxt = T.isDark ? C.white : C.dark

  return (
    <Pressable
      onPress={() => router.push(`/blog/${article.id}` as any)}
      onHoverIn={Platform.OS === 'web' ? () => setHovered(true) : undefined}
      onHoverOut={Platform.OS === 'web' ? () => setHovered(false) : undefined}
      onPressIn={Platform.OS !== 'web' ? () => setHovered(true) : undefined}
      onPressOut={Platform.OS !== 'web' ? () => setHovered(false) : undefined}
      style={{
        flex: 1,
        borderWidth: 1,
        borderColor: T.border,
        backgroundColor: cardBg,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: hovered ? 0.08 : 0,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: hovered ? 4 : 0,
      }}
    >
      {/* Image + category badge */}
      <View style={{ position: 'relative' }}>
        <Image
          source={image}
          style={{ width: '100%', height: 220 }}
          resizeMode="cover"
        />
        <View
          style={{
            position: 'absolute', top: 0, left: 0,
            paddingHorizontal: 12, paddingVertical: 6,
            backgroundColor: badgeBg,
          }}
        >
          <Text
            style={{
              fontFamily: F.bold, fontSize: 10,
              textTransform: 'uppercase', color: badgeTxt,
            }}
          >
            #{article.category}
          </Text>
        </View>
      </View>

      {/* Body */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
        <Text
          style={{
            fontFamily: F.bold, fontSize: 16, lineHeight: 24,
            color: T.foreground, marginBottom: 8,
          }}
        >
          {article.title}
        </Text>
        <Text
          style={{
            fontFamily: F.regular, fontSize: 13, lineHeight: 20,
            color: T.mutedForeground, marginBottom: 20,
          }}
          numberOfLines={3}
        >
          {article.description}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <ReadMoreLink hovered={hovered} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontFamily: F.regular, fontSize: 11, color: T.mutedForeground }}>
              {article.publishDate}
            </Text>
            <View style={{ width: 40, height: 1, backgroundColor: T.border }} />
          </View>
        </View>
      </View>
    </Pressable>
  )
}
