import React, { useState } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Line } from 'react-native-svg';
import { C } from './constants';

// Road lane markings: 44 px yellow dash, 28 px gap — replicates a real centre-line
const H    = 28;   // strip height (24–32 px spec)
const DASH = 44;
const GAP  = 28;

export default function LaneStrip() {
  const [stripW, setStripW] = useState(0);

  return (
    // Shadow wrapper — must NOT carry overflow:hidden so iOS renders the drop-shadow
    <View
      style={{
        zIndex:        50,
        shadowColor:   '#000',
        shadowOffset:  { width: 0, height: 3 },
        shadowOpacity: 0.22,
        shadowRadius:  6,
        elevation:     5,
      }}
    >
      {/* Clipping container — measures the real rendered width */}
      <View
        onLayout={e => setStripW(e.nativeEvent.layout.width)}
        style={{ height: H, overflow: 'hidden' }}
      >
        {/* Sky-light → Sky-deep gradient */}
        <LinearGradient
          colors={[C.skyLight, C.skyDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* Dashed yellow centre lane — rendered once width is known */}
        {stripW > 0 && (
          <Svg
            width={stripW}
            height={H}
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            <Line
              x1={0}
              y1={H / 2}
              x2={stripW}
              y2={H / 2}
              stroke={C.yellow}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={`${DASH} ${GAP}`}
            />
          </Svg>
        )}

        {/* Top gloss edge — 1 px white/30 */}
        <View
          style={{
            position:        'absolute',
            top:             0,
            left:            0,
            right:           0,
            height:          1,
            backgroundColor: 'rgba(255,255,255,0.30)',
          }}
        />

        {/* Bottom shadow edge — 1 px dark/12 */}
        <View
          style={{
            position:        'absolute',
            bottom:          0,
            left:            0,
            right:           0,
            height:          1,
            backgroundColor: 'rgba(34,31,32,0.12)',
          }}
        />
      </View>
    </View>
  );
}
