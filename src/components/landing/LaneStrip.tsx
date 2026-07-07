import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from './constants';

const H = 28;

// Modern lane strip — CSS gradient with dotted center line instead of SVG.
// Looks cleaner and loads faster on all platforms.
export default function LaneStrip({ reverse = false }: { reverse?: boolean }) {
  return (
    <View
      style={{
        zIndex: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.22,
        shadowRadius: 6,
        elevation: 5,
      }}
    >
      <View style={{ height: H, overflow: 'hidden' }}>
        <LinearGradient
          colors={[C.skyLight, C.skyDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* Modern dashed center line using View-based dashes */}
        <View style={{
          position: 'absolute',
          top: H / 2 - 1.5,
          left: 0,
          right: 0,
          height: 3,
          flexDirection: 'row',
          gap: 28,
          paddingHorizontal: 4,
        }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <View
              key={i}
              style={{
                width: 44,
                height: 3,
                borderRadius: 1.5,
                backgroundColor: C.yellow,
              }}
            />
          ))}
        </View>

        {/* Top highlight line */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.30)' }} />
        {/* Bottom shadow line */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(34,31,32,0.12)' }} />
      </View>
    </View>
  );
}
