import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { cn } from './utils';
import { Icon } from './Icon';
import { C, F } from '../landing/constants';

// Dialog primitive built on React Native's Modal (the proven EnrollModal
// pattern), themed to the tokens. A 50% black scrim isolates the foreground;
// tapping the scrim dismisses, tapping the card does not. Phase 11 rebuilds the
// lead form on this.

type DialogProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export function Dialog({ visible, onClose, children, className }: DialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close dialog"
        className="flex-1 items-center justify-center bg-black/50 p-4"
      >
        {/* Absorb presses on the card so they do not reach the scrim. */}
        <Pressable onPress={() => {}} className={cn('w-full max-w-md rounded-card-lg bg-card p-6', className)}>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Text className={cn('text-xl text-foreground', className)} style={{ fontFamily: F.bold }}>
      {children}
    </Text>
  );
}

export function DialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Text className={cn('mt-1 text-sm text-muted-foreground', className)} style={{ fontFamily: F.regular }}>
      {children}
    </Text>
  );
}

export function DialogClose({ onPress, className }: { onPress: () => void; className?: string }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Close"
      className={cn('absolute right-2 top-2 h-11 w-11 items-center justify-center rounded-pill active:opacity-70', className)}
    >
      <Icon icon={X} size="md" color={C.dark} />
    </Pressable>
  );
}
