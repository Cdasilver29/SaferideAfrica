import React, { useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Modal, Animated } from 'react-native';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, GALLERY_IMGS, SCREEN_W, SCREEN_H } from './constants';

type GalleryItem = { uri: string; caption: string } | { src: any; caption: string };

function getSource(item: GalleryItem) {
  return 'uri' in item ? { uri: item.uri } : item.src;
}

function GalleryCard({ item, index, onPress }: { item: GalleryItem; index: number; onPress: () => void }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const captionAnim = useRef(new Animated.Value(0)).current;

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1.03, useNativeDriver: true, tension: 200, friction: 10 }),
      Animated.timing(captionAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 200, friction: 10 }),
      Animated.timing(captionAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
  };

  const cardW = IS_WEB ? 240 : 200;
  const cardH = IS_WEB ? 180 : 150;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], marginRight: 12 }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <View style={{ width: cardW, height: cardH, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
          <Image source={getSource(item)} style={{ width: '100%', height: '100%' }} resizeMode="cover" />

          {/* Dim overlay */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.22)' }} />

          {/* Zoom icon */}
          <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20, padding: 6 }}>
            <ZoomIn size={13} color="#ffffff" />
          </View>

          {/* Caption slides up on press */}
          <Animated.View
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              backgroundColor: 'rgba(0,0,0,0.68)',
              paddingHorizontal: 12, paddingVertical: 8,
              opacity: captionAnim,
              transform: [{ translateY: captionAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
            }}
          >
            <Text style={{ color: '#ffffff', fontFamily: F.medium, fontSize: 12 }}>{item.caption}</Text>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function Gallery() {
  const { t } = useTranslation();
  const [modalIdx, setModalIdx] = useState<number | null>(null);

  // Overlay translated captions onto each gallery image at render time
  const captions = t('gallery.captions', { returnObjects: true }) as string[];
  const galleryItems = (GALLERY_IMGS as GalleryItem[]).map((item, i) => ({
    ...item,
    caption: captions[i] ?? item.caption,
  }));

  const close = () => setModalIdx(null);
  const prev  = () => setModalIdx(i => (i !== null ? (i - 1 + GALLERY_IMGS.length) % GALLERY_IMGS.length : 0));
  const next  = () => setModalIdx(i => (i !== null ? (i + 1) % GALLERY_IMGS.length : 0));

  return (
    <View style={{ backgroundColor: '#f9fafb', paddingVertical: 72 }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
        <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center', alignItems: 'center' } : { alignItems: 'center' }}>
          <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>
            {t('gallery.overline')}
          </Text>
          <Text style={{ color: C.heading, fontFamily: F.bold, fontSize: IS_WEB ? 34 : 26, textAlign: 'center', marginBottom: 12 }}>
            {t('gallery.heading')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue }} />
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
          </View>
        </View>
      </View>

      {/* Horizontal scroll gallery */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 8 }}
      >
        {galleryItems.map((item, i) => (
          <GalleryCard key={i} item={item} index={i} onPress={() => setModalIdx(i)} />
        ))}
      </ScrollView>

      {/* Fullscreen modal */}
      <Modal visible={modalIdx !== null} transparent animationType="fade" onRequestClose={close}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.97)', justifyContent: 'center', alignItems: 'center' }}>
          {modalIdx !== null && (
            <>
              <Image
                source={getSource(galleryItems[modalIdx])}
                style={{ width: SCREEN_W, height: SCREEN_H * 0.7 }}
                resizeMode="contain"
              />

              {/* Caption */}
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontFamily: F.regular, fontSize: 14, marginTop: 12 }}>
                {galleryItems[modalIdx].caption}
              </Text>

              {/* Counter */}
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: F.regular, fontSize: 13, marginTop: 6 }}>
                {modalIdx + 1} / {GALLERY_IMGS.length}
              </Text>

              {/* Navigation */}
              <View style={{ flexDirection: 'row', gap: 24, marginTop: 20 }}>
                <TouchableOpacity onPress={prev} style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: 14, borderRadius: 50 }}>
                  <ChevronLeft size={22} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={next} style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: 14, borderRadius: 50 }}>
                  <ChevronRight size={22} color="white" />
                </TouchableOpacity>
              </View>

              {/* Close */}
              <TouchableOpacity onPress={close} style={{ position: 'absolute', top: 52, right: 22, backgroundColor: 'rgba(255,255,255,0.12)', padding: 12, borderRadius: 50 }}>
                <X size={20} color="white" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}
