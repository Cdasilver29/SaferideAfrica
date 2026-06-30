import React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { cn } from './utils';
import { C, F } from '../landing/constants';

// Single-line text input. 48px tall (>=44px hit area), border token, focus ring
// on the primary token. Placeholder colour comes from the muted C constant since
// placeholderTextColor needs a concrete value, not a CSS variable.

export const Input = React.forwardRef<TextInput, TextInputProps & { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        placeholderTextColor={C.muted}
        style={{ fontFamily: F.regular }}
        className={cn(
          'h-12 rounded-button border border-border bg-card px-4 text-base text-foreground focus:border-primary',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
