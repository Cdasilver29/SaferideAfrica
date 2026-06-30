import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { cn } from './utils';
import { C, F, IS_WEB } from '../landing/constants';

// Select primitive on the already-installed @react-native-picker/picker (renders
// a native <select> on web). The wrapper carries the border and button radius;
// the picker fills it. Used by the branch and course pickers in the lead form.

export type SelectItem = { label: string; value: string };

type SelectProps = {
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: SelectItem[];
  placeholder?: string;
  enabled?: boolean;
  className?: string;
};

export function Select({
  selectedValue,
  onValueChange,
  items,
  placeholder,
  enabled = true,
  className,
}: SelectProps) {
  return (
    <View className={cn('h-12 justify-center overflow-hidden rounded-button border border-border bg-card', className)}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(v) => onValueChange(String(v))}
        enabled={enabled}
        dropdownIconColor={C.dark}
        style={{
          fontFamily: F.regular,
          color: C.dark,
          ...(IS_WEB
            ? ({ borderWidth: 0, backgroundColor: 'transparent', height: 48, paddingLeft: 12 } as object)
            : null),
        }}
      >
        {placeholder ? <Picker.Item label={placeholder} value="" color={C.muted} /> : null}
        {items.map((it) => (
          <Picker.Item key={it.value} label={it.label} value={it.value} color={C.dark} />
        ))}
      </Picker>
    </View>
  );
}
