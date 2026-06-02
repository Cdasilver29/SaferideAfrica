// src/api/storage.ts
// Typed AsyncStorage helpers. All API stubs go through these.

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) return null;
  return JSON.parse(raw) as T;
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function remove(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export async function list<T>(prefix: string): Promise<T[]> {
  const allKeys = await AsyncStorage.getAllKeys();
  const matching = allKeys.filter(k => k.startsWith(prefix));
  if (!matching.length) return [];
  const pairs = await AsyncStorage.multiGet(matching);
  return pairs
    .map(([, v]) => (v ? (JSON.parse(v) as T) : null))
    .filter((v): v is T => v !== null);
}
