import React, { useRef } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { ChevronUp, ChevronDown } from 'lucide-react-native';
import { C, NAV_ITEMS } from './constants';

interface Props {
  scrollY: Animated.Value;
  activeSection: string;
  onNavPress: (section: string) => void;
  /** Called to scroll up/down by a fixed step */
  onStep: (direction: 'up' | 'down') => void;
}

const SECTION_KEYS = NAV_ITEMS.map(n => n.section);

export default function ScrollSideNav({ scrollY, activeSection, onNavPress, onStep }: Props) {
  // Fade the whole strip in once user has scrolled a little
  const opacity = scrollY.interpolate({
    inputRange: [80, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const activeIdx = SECTION_KEYS.indexOf(activeSection);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        right: 14,
        top: '50%' as any,
        transform: [{ translateY: -120 }],
        zIndex: 90,
        opacity,
        alignItems: 'center',
        gap: 6,
      }}
      pointerEvents="box-none"
    >
      {/* ── Scroll up button ── */}
      <TouchableOpacity
        onPress={() => onStep('up')}
        activeOpacity={0.8}
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: 'rgba(15,23,42,0.75)',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.15)',
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        <ChevronUp size={16} color="#ffffff" />
      </TouchableOpacity>

      {/* ── Section dots ── */}
      <View
        style={{
          backgroundColor: 'rgba(15,23,42,0.70)',
          borderRadius: 20,
          paddingVertical: 10,
          paddingHorizontal: 6,
          alignItems: 'center',
          gap: 10,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.10)',
        }}
      >
        {SECTION_KEYS.map((key, i) => {
          const isActive = key === activeSection;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => onNavPress(key)}
              activeOpacity={0.7}
              hitSlop={{ top: 6, bottom: 6, left: 10, right: 10 }}
            >
              <View
                style={{
                  width: isActive ? 8 : 6,
                  height: isActive ? 22 : 6,
                  borderRadius: 4,
                  backgroundColor: isActive ? C.yellow : 'rgba(255,255,255,0.35)',
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Scroll down button ── */}
      <TouchableOpacity
        onPress={() => onStep('down')}
        activeOpacity={0.8}
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: 'rgba(15,23,42,0.75)',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.15)',
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        <ChevronDown size={16} color="#ffffff" />
      </TouchableOpacity>
    </Animated.View>
  );
}
