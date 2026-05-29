import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import zh from './locales/zh.json';
import ar from './locales/ar.json';
import sw from './locales/sw.json';
import fr from './locales/fr.json';

const LANG_KEY = 'saferide.lang';
const SUPPORTED = ['en', 'zh', 'ar', 'sw', 'fr'];

// Best synchronous guess — overridden by persisted preference below
const deviceCode = Localization.getLocales()[0]?.languageCode ?? 'en';
const defaultLng = SUPPORTED.includes(deviceCode) ? deviceCode : 'en';

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: { translation: en },
    zh: { translation: zh },
    ar: { translation: ar },
    sw: { translation: sw },
    fr: { translation: fr },
  },
  lng: defaultLng,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

// Override with persisted preference on next tick (causes a silent re-render only when language differs)
AsyncStorage.getItem(LANG_KEY).then((saved) => {
  if (saved && SUPPORTED.includes(saved) && saved !== i18next.language) {
    i18next.changeLanguage(saved);
  }
});

export const setLanguage = async (code: string): Promise<void> => {
  await AsyncStorage.setItem(LANG_KEY, code);
  await i18next.changeLanguage(code);
};

export default i18next;
