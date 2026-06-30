import React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { cn } from './utils';
import { C, F } from '../landing/constants';

// Multi-line text input for the lead-form message field. Card radius, top-aligned
// text, comfortable min height.

export const Textarea = React.forwardRef<TextInput, TextInputProps & { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        multiline
        textAlignVertical="top"
        placeholderTextColor={C.muted}
        style={{ fontFamily: F.regular }}
        className={cn(
          'min-h-[96px] rounded-card border border-border bg-card px-4 py-3 text-base text-foreground focus:border-primary',
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
