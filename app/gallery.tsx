import React, { useState, useEffect } from 'react'
import {
  View, Text, SafeAreaView, ScrollView,
  Image, TouchableOpacity, Modal, Platform,
} from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSpring, withDelay,
} from 'react-native-reanimated'
import { X, ChevronLeft, ChevronRight, ZoomIn, Camera } from 'lucide-react-native'
import Navbar  from '@/components/landing/Navbar'
import Footer  from '@/components/landing/Footer'
import { C, F, IS_WEB, MAX_W, GALLERY_IMGS, SCREEN_W, SCREEN_H } from '@/components/landing/constants'
import { useTheme } from '@/lib/theme'

type GalleryItem = { uri: string; caption: string } | { src: any; caption: string }
function getSource(item: GalleryItem) {
  return 'uri' in item ? { uri: item.uri } : item.src
}

function PageHero() {
  return (
    <View style={{
      backgroundColor: C.skyDeep,
      paddingVertical: IS_WEB ? 10 : 8,
      paddingHorizontal: 24,
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.20)',
    }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>
        <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 6 }}>
          Photography
        </Text>
        <Text style={{ color: C.white, fontFamily: F.bold, fontSize: IS_WEB ? 32 : 24, lineHeight: IS_WEB ? 42 : 32 }}>
          Our Gallery
        </Text>
      </View>
    </View>
  )
}

// ── Animated photo card ───────────────────────────────────────────────────────

function AnimatedPhotoCard({
  item, globalIdx, onPress,
}: {
  item: GalleryItem; globalIdx: number; onPress: () => void;
}) {
  const opacity = useSharedValue(0)
  const scale   = useSharedValue(0.88)
  const translateY = useSharedValue(18)

  const IMG_H = IS_WEB ? 200 : 140

  useEffect(() => {
    const delay = globalIdx * 55
    opacity.value    = withDelay(delay, withTiming(1,  { duration: 380 }))
    scale.value      = withDelay(delay, withSpring(1,  { damping: 14, stiffness: 150 }))
    translateY.value = withDelay(delay, withSpring(0,  { damping: 14, stiffness: 140 }))
  }, [])

  const animStyle = useAnimatedStyle(() => ({
    opacity:   opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }))

  return (
    <Animated.View style={[{ borderRadius: 10, overflow: 'hidden', marginBottom: 8 }, animStyle]}>
      <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={{ borderRadius: 10, overflow: 'hidden' }}>
        <Image
          source={getSource(item)}
          style={{ width: '100%', height: IMG_H, backgroundColor: 'rgba(1,165,240,0.10)' }}
          resizeMode="cover"
          progressiveRenderingEnabled
          fadeDuration={200}
          {...(Platform.OS === 'web' ? { loading: 'lazy' } as any : {})}
        />
        <View style={{ position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(34,31,32,0.45)', borderRadius: 12, padding: 4 }}>
          <ZoomIn size={11} color={C.white} />
        </View>
        {item.caption ? (
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(34,31,32,0.50)', paddingHorizontal: 8, paddingVertical: 5 }}>
            <Text style={{ color: C.white, fontFamily: F.regular, fontSize: 10 }} numberOfLines={1}>
              {item.caption}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
    </Animated.View>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyGallery() {
  const T = useTheme()
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(24)

  useEffect(() => {
    opacity.value    = withTiming(1,  { duration: 500 })
    translateY.value = withSpring(0,  { damping: 16, stiffness: 120 })
  }, [])

  const animStyle = useAnimatedStyle(() => ({
    opacity:   opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View style={[{ alignItems: 'center', paddingVertical: IS_WEB ? 100 : 72, paddingHorizontal: 32 }, animStyle]}>
      <View style={{
        width: 88, height: 88, borderRadius: 44,
        backgroundColor: 'rgba(1,165,240,0.08)',
        borderWidth: 1.5, borderColor: 'rgba(1,165,240,0.20)',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
      }}>
        <Camera size={36} color={C.skyDeep} />
      </View>
      <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: IS_WEB ? 20 : 17, textAlign: 'center', marginBottom: 10 }}>
        Gallery Coming Soon
      </Text>
      <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 14, textAlign: 'center', lineHeight: 22, maxWidth: 340 }}>
        We're uploading photos of our training sessions, students, and facilities.{'\n'}Check back soon!
      </Text>
    </Animated.View>
  )
}

// ── Gallery grid ──────────────────────────────────────────────────────────────

function GalleryGrid() {
  const T = useTheme()
  const items  = GALLERY_IMGS as GalleryItem[]
  const total  = items.length

  const col1 = items.filter((_, i) => i % 3 === 0)
  const col2 = items.filter((_, i) => i % 3 === 1)
  const col3 = items.filter((_, i) => i % 3 === 2)

  const [modalIdx, setModalIdx] = useState<number | null>(null)
  const close = () => setModalIdx(null)
  const prev  = () => setModalIdx(i => (i !== null ? (i - 1 + total) % total : 0))
  const next  = () => setModalIdx(i => (i !== null ? (i + 1) % total : 0))

  const GAP = 8

  const Col = ({ col, colIdx }: { col: GalleryItem[]; colIdx: number }) => (
    <View style={{ flex: 1, gap: GAP }}>
      {col.map((item, rowIdx) => {
        const gIdx = rowIdx * 3 + colIdx
        return (
          <AnimatedPhotoCard
            key={rowIdx}
            item={item}
            globalIdx={gIdx}
            onPress={() => setModalIdx(gIdx)}
          />
        )
      })}
    </View>
  )

  return (
    <View style={{ backgroundColor: T.background, paddingHorizontal: 16, paddingVertical: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        {total === 0 ? (
          <EmptyGallery />
        ) : (
          <>
            <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 12, textAlign: 'center', marginBottom: 16 }}>
              {total} {total === 1 ? 'photo' : 'photos'} — tap to enlarge
            </Text>
            <View style={{ flexDirection: 'row', gap: GAP }}>
              <Col col={col1} colIdx={0} />
              <Col col={col2} colIdx={1} />
              <Col col={col3} colIdx={2} />
            </View>
          </>
        )}
      </View>

      {/* Lightbox */}
      <Modal visible={modalIdx !== null} transparent animationType="fade" onRequestClose={close}>
        <View style={{ flex: 1, backgroundColor: 'rgba(34,31,32,0.97)', justifyContent: 'center', alignItems: 'center' }}>
          {modalIdx !== null && (
            <>
              <Image
                source={getSource(items[modalIdx])}
                style={{ width: SCREEN_W, height: SCREEN_H * 0.7, backgroundColor: 'rgba(1,165,240,0.08)' }}
                resizeMode="contain"
                progressiveRenderingEnabled
                fadeDuration={150}
              />
              <Text style={{ color: 'rgba(255,255,255,0.65)', fontFamily: F.regular, fontSize: 13, marginTop: 10, textAlign: 'center', paddingHorizontal: 24 }}>
                {items[modalIdx].caption}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontFamily: F.regular, fontSize: 12, marginTop: 4 }}>
                {modalIdx + 1} / {total}
              </Text>
              <View style={{ flexDirection: 'row', gap: 24, marginTop: 20 }}>
                <TouchableOpacity onPress={prev} style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: 14, borderRadius: 50 }}>
                  <ChevronLeft size={22} color={C.white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={next} style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: 14, borderRadius: 50 }}>
                  <ChevronRight size={22} color={C.white} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={close} style={{ position: 'absolute', top: 52, right: 22, backgroundColor: 'rgba(255,255,255,0.12)', padding: 12, borderRadius: 50 }}>
                <X size={20} color={C.white} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </View>
  )
}

export default function GalleryPage() {
  const T = useTheme()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.background }}>
      <Navbar />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <PageHero />
        <GalleryGrid />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  )
}
