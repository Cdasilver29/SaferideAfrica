import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge conditional class lists and de-dupe conflicting Tailwind utilities.
// Shared by every ui primitive so variant + override classes compose cleanly.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
