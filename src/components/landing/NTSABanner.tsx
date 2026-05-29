import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Shield, Monitor, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W } from './constants';

// Only non-translatable data; titles/descs come from t()
const ITEMS_META = [
  { key: 'smartDl',      Icon: Shield },
  { key: 'tims',         Icon: Monitor },
  { key: 'onlineTheory', Icon: Monitor },
];

export default function NTSABanner() {
  const { t } = useTranslation();

  return (
    <View style={{ backgroundColor: C.blueDeep, paddingVertical: 56, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        <View style={{ alignItems: 'center', marginBottom: 36 }}>
          <Text style={{ color: 'rgba(186,230,253,0.9)', fontFamily: F.bold, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>
            {t('ntsaBanner.overline')}
          </Text>
          <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: IS_WEB ? 30 : 22, textAlign: 'center', lineHeight: IS_WEB ? 40 : 32 }}>
            {t('ntsaBanner.heading')}
          </Text>
        </View>

        <View style={IS_WEB ? { flexDirection: 'row', gap: 20, marginBottom: 36 } : { gap: 16, marginBottom: 28 }}>
          {ITEMS_META.map(({ key, Icon }) => (
            <View
              key={key}
              style={{ flex: IS_WEB ? 1 : undefined, backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 16, padding: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' }}
            >
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Icon size={22} color="#ffffff" />
              </View>
              <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 15, marginBottom: 8 }}>
                {t(`ntsaBanner.items.${key}.title`)}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.75)', fontFamily: F.regular, fontSize: 13, lineHeight: 20 }}>
                {t(`ntsaBanner.items.${key}.desc`)}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => router.push('/login')}
            style={{ backgroundColor: '#ffffff', paddingVertical: 14, paddingHorizontal: 36, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, elevation: 4 }}
            activeOpacity={0.85}
          >
            <Text style={{ color: C.blueDeep, fontFamily: F.bold, fontSize: 15 }}>{t('ntsaBanner.cta')}</Text>
            <ArrowRight size={16} color={C.blueDeep} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}
