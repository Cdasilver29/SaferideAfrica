import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { router } from 'expo-router';
import { Phone, Mail, MapPin } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W } from './constants';
import LanguageSwitcher from './LanguageSwitcher';

const SOCIAL_LINKS = [
  { color: '#1877f2', label: 'f', url: 'https://facebook.com' },
  { color: '#1da1f2', label: 't', url: 'https://twitter.com' },
  { color: '#0a66c2', label: 'in', url: 'https://linkedin.com' },
];

export default function TopBar() {
  const { t } = useTranslation();
  if (!IS_WEB) return null;

  return (
    <View style={{ backgroundColor: C.darkBg, borderBottomWidth: 1, borderBottomColor: C.darkBorder, zIndex: 50, elevation: 50 }}>
      <View style={{ maxWidth: MAX_W, width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 8 }}>

        {/* Left: contact info */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <MapPin size={11} color={C.yellow} />
            <Text style={{ color: C.mutedDark, fontSize: 12, fontFamily: F.regular }}>{t('topbar.address')}</Text>
          </View>

          <TouchableOpacity
            onPress={() => Linking.openURL('tel:+254712045710')}
            activeOpacity={0.7}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
          >
            <Phone size={11} color={C.yellow} />
            <Text style={{ color: C.mutedDark, fontSize: 12, fontFamily: F.regular }}>{t('topbar.phone')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL('mailto:saferideafrica777@gmail.com')}
            activeOpacity={0.7}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
          >
            <Mail size={11} color={C.yellow} />
            <Text style={{ color: C.mutedDark, fontSize: 12, fontFamily: F.regular }}>{t('topbar.email')}</Text>
          </TouchableOpacity>
        </View>

        {/* Right: social dots + sign-in link */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          {SOCIAL_LINKS.map(({ color, label, url }) => (
            <TouchableOpacity key={label} onPress={() => Linking.openURL(url)} activeOpacity={0.7}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontSize: 9, fontFamily: F.bold }}>{label}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <View style={{ width: 1, height: 14, backgroundColor: C.darkBorder }} />

          <LanguageSwitcher />

          <View style={{ width: 1, height: 14, backgroundColor: C.darkBorder }} />

          <TouchableOpacity onPress={() => router.push('/login')} activeOpacity={0.8}>
            <Text style={{ color: C.yellow, fontSize: 12, fontFamily: F.semibold }}>{t('topbar.signIn')}</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}
