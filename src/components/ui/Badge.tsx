import React from 'react';
import { View, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import { F } from '../landing/constants';

// Pill badge for chips and tags. Pill radius, token-driven colours.

const badgeVariants = cva('self-start flex-row items-center rounded-pill px-3 py-1', {
  variants: {
    variant: {
      primary:   'bg-primary',
      secondary: 'bg-secondary',
      accent:    'bg-accent',
      outline:   'border border-border bg-transparent',
    },
  },
  defaultVariants: { variant: 'primary' },
});

const badgeTextVariants = cva('text-xs', {
  variants: {
    variant: {
      primary:   'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      accent:    'text-accent-foreground',
      outline:   'text-foreground',
    },
  },
  defaultVariants: { variant: 'primary' },
});

type BadgeProps = VariantProps<typeof badgeVariants> & {
  className?: string;
  textClassName?: string;
  children: React.ReactNode;
};

export function Badge({ variant, className, textClassName, children }: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)}>
      <Text className={cn(badgeTextVariants({ variant }), textClassName)} style={{ fontFamily: F.medium }}>
        {children}
      </Text>
    </View>
  );
}

export { badgeVariants };
