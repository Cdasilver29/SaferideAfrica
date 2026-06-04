import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { C } from './constants';

export function WavyLine({ invert = false }: { invert?: boolean }) {
  const stroke = invert ? 'rgba(255,255,255,0.4)' : C.yellow;
  return (
    <Svg width={80} height={12} viewBox="0 0 80 12" style={{ marginTop: 12 }}>
      <Path
        d="M2 6 Q 12 1, 22 6 T 42 6 T 62 6 T 78 6"
        stroke={stroke}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
