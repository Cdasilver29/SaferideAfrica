import React from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from './utils';

// Loading placeholder block. Static for now: the shimmer / pulse arrives in
// Phase 12 with the shared reduce-motion hook, so nothing here needs gating yet.
// Uses foreground/10 because the muted token is white in light mode.

export function Skeleton({ className, ...props }: ViewProps & { className?: string }) {
  return <View className={cn('rounded-card bg-foreground/10', className)} {...props} />;
}
