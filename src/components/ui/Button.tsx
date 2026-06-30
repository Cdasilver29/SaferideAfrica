import React from 'react';
import { Pressable, Text, type PressableProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import { F } from '../landing/constants';

// Button primitive. Variants map to the brand tokens; every size keeps a 44px
// minimum hit area. Press feedback is a state-layer-style opacity dim plus an
// Android ripple. Manrope (SemiBold) comes through the F constants to avoid the
// font-weight / font-family utility collision in the Tailwind config.

const buttonVariants = cva('flex-row items-center justify-center rounded-button', {
  variants: {
    variant: {
      primary:   'bg-primary',
      secondary: 'bg-secondary',
      outline:   'border border-border bg-transparent',
      ghost:     'bg-transparent',
    },
    size: {
      sm: 'h-11 gap-1.5 px-4', // 44px
      md: 'h-12 gap-2 px-5',   // 48px
      lg: 'h-14 gap-2 px-6',   // 56px
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

const buttonTextVariants = cva('', {
  variants: {
    variant: {
      primary:   'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      outline:   'text-foreground',
      ghost:     'text-foreground',
    },
    size: { sm: 'text-sm', md: 'text-base', lg: 'text-lg' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

type ButtonProps = PressableProps &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    textClassName?: string;
    children?: React.ReactNode;
  };

export function Button({
  variant,
  size,
  className,
  textClassName,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
      className={cn(
        buttonVariants({ variant, size }),
        'active:opacity-90',
        disabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          className={cn(buttonTextVariants({ variant, size }), textClassName)}
          style={{ fontFamily: F.semibold }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export { buttonVariants, buttonTextVariants };
