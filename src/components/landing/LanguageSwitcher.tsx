import React, { useState } from 'react';
import { View, Text, Pressable, Modal, Image } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { setLanguage } from '../../i18n';
import { C, F } from './constants';

// SVG flag strings from country-flag-icons (3:2 aspect ratio)
// @ts-ignore — no bundled TS declarations for individual flag paths
const GBFlag: string = require('country-flag-icons/string/3x2/GB').default;
// @ts-ignore
const CNFlag: string = require('country-flag-icons/string/3x2/CN').default;
// @ts-ignore
const SAFlag: string = require('country-flag-icons/string/3x2/SA').default;
// @ts-ignore
const KEFlag: string = require('country-flag-icons/string/3x2/KE').default;
// @ts-ignore
const FRFlag: string = require('country-flag-icons/string/3x2/FR').default;

type LangCode = 'en' | 'zh' | 'ar' | 'sw' | 'fr';

const LANGUAGES: Array<{ code: LangCode; flag: string }> = [
  { code: 'en', flag: GBFlag },
  { code: 'zh', flag: CNFlag },
  { code: 'ar', flag: SAFlag },
  { code: 'sw', flag: KEFlag },
  { code: 'fr', flag: FRFlag },
];

const FLAG_W = 28;
const FLAG_H = Math.round(FLAG_W * (2 / 3)); // 3:2 → 19px

// Encode the raw SVG string as a data URI so React Native's <Image> can render it
// on both web (renders as <img>) and native (uses the image decoder)
function svgToUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function Flag({ xml }: { xml: string }) {
  return (
    <View style={{ width: FLAG_W, height: FLAG_H, borderRadius: 3, overflow: 'hidden' }}>
      <Image
        source={{ uri: svgToUri(xml) }}
        style={{ width: FLAG_W, height: FLAG_H }}
        resizeMode="cover"
      />
    </View>
  );
}

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentCode = (LANGUAGES.some(l => l.code === i18n.language)
    ? i18n.language
    : 'en') as LangCode;
  const currentLang = LANGUAGES.find(l => l.code === currentCode)!;

  const handleSelect = async (code: LangCode) => {
    setOpen(false);
    await setLanguage(code);
  };

  return (
    <>
      {/* Trigger */}
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 9,
          paddingVertical: 5,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: pressed || open ? C.blue : C.darkBorder,
          backgroundColor: pressed || open ? 'rgba(1,165,240,0.08)' : 'transparent',
        })}
      >
        <Flag xml={currentLang.flag} />
        <Text style={{ color: C.mutedDark, fontSize: 12, fontFamily: F.medium }}>
          {t(`languageSwitcher.languages.${currentCode}`)}
        </Text>
        <ChevronDown
          size={12}
          color={C.mutedDark}
          style={{ transform: open ? [{ rotate: '180deg' }] : [] }}
        />
      </Pressable>

      {/* Dropdown */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        {/* Full-screen backdrop — tap anywhere to close */}
        <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)}>

          {/* Card — inner Pressable stops taps from reaching the backdrop */}
          <Pressable
            onPress={() => {/* stop propagation */}}
            style={{
              position: 'absolute',
              top: 46,   // sits just below the nav bar
              right: 24,
              backgroundColor: C.white,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: C.blue,
              shadowColor: '#000',
              shadowOpacity: 0.14,
              shadowRadius: 18,
              elevation: 10,
              minWidth: 210,
              overflow: 'hidden',
            }}
          >
            {/* Card header */}
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(1,165,240,0.15)',
                backgroundColor: 'rgba(88,204,247,0.10)',
              }}
            >
              <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase' }}>
                {t('languageSwitcher.title')}
              </Text>
            </View>

            {/* Language rows */}
            {LANGUAGES.map(lang => {
              const isActive = lang.code === currentCode;
              return (
                <Pressable
                  key={lang.code}
                  onPress={() => handleSelect(lang.code)}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    backgroundColor:
                      pressed ? 'rgba(88,204,247,0.15)'
                      : isActive ? 'rgba(88,204,247,0.10)'
                      : C.white,
                  })}
                >
                  <Flag xml={lang.flag} />
                  <Text
                    style={{
                      flex: 1,
                      color: isActive ? C.blue : C.heading,
                      fontFamily: isActive ? F.semibold : F.regular,
                      fontSize: 13,
                    }}
                  >
                    {t(`languageSwitcher.languages.${lang.code}`)}
                  </Text>
                  {isActive && <Check size={14} color={C.blue} />}
                </Pressable>
              );
            })}
          </Pressable>

        </Pressable>
      </Modal>
    </>
  );
}
