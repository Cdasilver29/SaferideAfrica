import React from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { ChevronUp, ChevronDown } from 'lucide-react-native';

interface Props {
  scrollY:       Animated.Value;
  activeSection: string;
  onNavPress:    (section: string) => void;
  onStep:        (direction: 'up' | 'down') => void;
}

const BTN = {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: 'rgba(15,23,42,0.72)',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.15)',
  shadowColor: '#000',
  shadowOpacity: 0.18,
  shadowRadius: 5,
  elevation: 4,
};

export default function ScrollSideNav({ scrollY, onStep }: Props) {
  const opacity = scrollY.interpolate({
    inputRange:  [80, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position:  'absolute',
        right:     14,
        top:       '35%' as any,
        transform: [{ translateY: -36 }],
        zIndex:    90,
        opacity,
        alignItems: 'center',
        gap:        8,
      }}
    >
      <TouchableOpacity onPress={() => onStep('up')} activeOpacity={0.8} style={BTN}>
        <ChevronUp size={15} color="#ffffff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onStep('down')} activeOpacity={0.8} style={BTN}>
        <ChevronDown size={15} color="#ffffff" />
      </TouchableOpacity>
    </Animated.View>
  );
}
