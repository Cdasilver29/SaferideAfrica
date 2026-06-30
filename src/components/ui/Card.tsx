import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from './utils';
import { F } from '../landing/constants';

// Card primitive. Card radius (16px) and the border token, photo-first surfaces
// build on this. Header / Title / Content / Footer are thin layout helpers.

export function Card({ className, children, ...props }: ViewProps & { className?: string }) {
  return (
    <View className={cn('rounded-card border border-border bg-card p-4', className)} {...props}>
      {children}
    </View>
  );
}

export function CardHeader({ className, children, ...props }: ViewProps & { className?: string }) {
  return (
    <View className={cn('gap-1', className)} {...props}>
      {children}
    </View>
  );
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Text className={cn('text-lg text-foreground', className)} style={{ fontFamily: F.bold }}>
      {children}
    </Text>
  );
}

export function CardContent({ className, children, ...props }: ViewProps & { className?: string }) {
  return (
    <View className={cn('mt-3', className)} {...props}>
      {children}
    </View>
  );
}

export function CardFooter({ className, children, ...props }: ViewProps & { className?: string }) {
  return (
    <View className={cn('mt-4 flex-row items-center gap-2', className)} {...props}>
      {children}
    </View>
  );
}
