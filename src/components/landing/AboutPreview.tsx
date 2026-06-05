import React from 'react';
import { View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { C, F, IS_WEB, MAX_W, ABOUT_IMG } from './constants';
import { SectionIntro } from './SectionIntro';
import { FeatureCard } from './FeatureCard';

export default function AboutPreview() {
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || (IS_WEB && winW < 768);

  return (
    <View style={{ backgroundColor: C.skyDeep, paddingVertical: 64, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        <SectionIntro
          invert
          badge="About Us"
          title="Built for Kenyan Roads"
          description="Since 2015, SafeRide has trained drivers across 10 branches in Nairobi with one promise: safety beyond a licence."
        />

        <View
          style={{ flexDirection: 'row', gap: isMobile ? 12 : 32, alignItems: 'stretch', marginBottom: 40 }}
        >
          {/* Photo — first on mobile (left), second on desktop (right) */}
          {isMobile && (
            <View style={{ flex: 1 }}>
              <Image
                source={ABOUT_IMG}
                style={{ width: '100%', height: 180, borderRadius: 24, backgroundColor: 'rgba(1,165,240,0.10)' }}
                resizeMode="cover"
                progressiveRenderingEnabled
                fadeDuration={200}
              />
            </View>
          )}

          {/* Feature cards */}
          <View style={{ flex: 1, gap: isMobile ? 10 : 16 }}>
            <FeatureCard
              variant="primary"
              title="NTSA-Aligned Curriculum"
              description="Certified instructors teach the full NTSA curriculum — theory, road rules, Smart DL application, and real-road practice."
            />
            <FeatureCard
              variant="accent"
              title="Flexible Lesson Slots"
              description="Morning, afternoon, or weekend — pick the slot that fits your life. 10 branches across Nairobi so you never travel far."
            />
          </View>

          {/* Photo — second on desktop (right side) */}
          {!isMobile && (
            <View style={{ flex: 1 }}>
              <Image
                source={ABOUT_IMG}
                style={{ width: '100%', height: 320, borderRadius: 24, backgroundColor: 'rgba(1,165,240,0.10)' }}
                resizeMode="cover"
                progressiveRenderingEnabled
                fadeDuration={200}
              />
            </View>
          )}
        </View>

        {/* CTA */}
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => router.push('/about')}
            activeOpacity={0.85}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: C.red,
              paddingHorizontal: 32,
              paddingVertical: 14,
              borderRadius: 28,
              shadowColor: C.red,
              shadowOpacity: 0.38,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            <Text style={{ color: C.white, fontFamily: F.bold, fontSize: 15 }}>About Us</Text>
            <ArrowRight size={16} color={C.white} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}
