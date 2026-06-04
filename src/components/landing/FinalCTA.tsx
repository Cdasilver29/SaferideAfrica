import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { ArrowRight, Phone } from 'lucide-react-native'
import { C, F, IS_WEB, MAX_W } from './constants'
import { SectionIntro } from './SectionIntro'
import { useEnrollModal } from '@/context/EnrollModalContext'

export default function FinalCTA() {
  const { open } = useEnrollModal();
  return (
    <View
      style={{
        backgroundColor: C.skyDeep,
        paddingVertical: IS_WEB ? 80 : 60,
        paddingHorizontal: 24,
        alignItems: 'center',
      }}
    >
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignItems: 'center' } : { alignItems: 'center' }}>

        <SectionIntro
          badge="Get Started"
          title="Ready to Drive with Safety Beyond?"
          description="Join thousands of Kenyan drivers who earned their licence with SafeRide Africa. Pick your course and start today."
          invert
        />

        <View style={{ flexDirection: IS_WEB ? 'row' : 'column', gap: 14, width: IS_WEB ? undefined : '100%' }}>
          {/* Enrol Now — yellow on skyDeep */}
          <TouchableOpacity
            onPress={() => open()}
            activeOpacity={0.85}
            style={{
              backgroundColor: C.yellow,
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 28,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              shadowColor: C.yellow,
              shadowOpacity: 0.35,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 15 }}>Enrol Now</Text>
            <ArrowRight size={17} color={C.dark} />
          </TouchableOpacity>

          {/* Talk to Us — white outline on skyDeep */}
          <TouchableOpacity
            onPress={() => router.push('/contact')}
            activeOpacity={0.8}
            style={{
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 28,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              backgroundColor: C.red,
              shadowColor: C.red,
              shadowOpacity: 0.38,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <Phone size={16} color={C.white} />
            <Text style={{ color: C.white, fontFamily: F.semibold, fontSize: 15 }}>Talk to Us</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}
