import React from 'react';
import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';
import { C } from '../landing/constants';

// Activity spinner. Native platform control, so it is exempt from the Reanimated
// rule. Defaults to the primary brand colour via the C source-of-truth constant
// (ActivityIndicator needs a concrete colour, not a CSS variable).

export function Spinner({ color, size = 'small', ...props }: ActivityIndicatorProps) {
  return <ActivityIndicator size={size} color={color ?? C.skyDeep} {...props} />;
}
