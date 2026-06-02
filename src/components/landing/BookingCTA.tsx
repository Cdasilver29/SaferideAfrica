import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Phone, Calendar, MessageCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W } from './constants';
import { COMPANY } from '@/data/saferide';

export default function BookingCTA() {
  const { t } = useTranslation();

  return (
    <View style={{ backgroundColor: C.darkBg, paddingVertical: 72, paddingHorizontal: 24 }}>
      <View
        style={[
          IS_WEB
            ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }
            : { alignItems: 'center' },
        ]}
      >
        {/* Left: phone + heading */}
        <View style={IS_WEB ? { flex: 1, marginRight: 48 } : { alignItems: 'center', marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(251,191,36,0.12)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, alignSelf: IS_WEB ? 'flex-start' : 'center', marginBottom: 16, borderWidth: 1, borderColor: 'rgba(251,191,36,0.25)' }}>
            <Phone size={13} color={C.yellow} />
            <Text style={{ color: C.yellow, fontFamily: F.semibold, fontSize: 13 }}>{COMPANY.primaryPhone}</Text>
          </View>

          <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: IS_WEB ? 36 : 26, lineHeight: IS_WEB ? 46 : 34, textAlign: IS_WEB ? 'left' : 'center', marginBottom: 14 }}>
            {t('bookingCta.heading')}{'\n'}
            <Text style={{ color: C.yellow }}>{t('bookingCta.headingAccent')}</Text>
          </Text>

          <Text style={{ color: C.mutedDark, fontFamily: F.regular, fontSize: 14, lineHeight: 22, textAlign: IS_WEB ? 'left' : 'center' }}>
            {t('bookingCta.subtitle')}
          </Text>
        </View>

        {/* Right: buttons */}
        <View style={{ flexDirection: IS_WEB ? 'column' : 'row', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => router.push('/login')}
            style={{ backgroundColor: C.yellow, paddingVertical: 16, paddingHorizontal: 36, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8, shadowColor: C.yellow, shadowOpacity: 0.35, shadowRadius: 12, elevation: 5, minWidth: IS_WEB ? 200 : undefined, justifyContent: 'center' }}
            activeOpacity={0.85}
          >
            <Calendar size={17} color={C.dark} />
            <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 15 }}>{t('bookingCta.bookNow')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/login')}
            style={{ paddingVertical: 16, paddingHorizontal: 36, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)', minWidth: IS_WEB ? 200 : undefined, justifyContent: 'center' }}
            activeOpacity={0.75}
          >
            <MessageCircle size={17} color="#ffffff" />
            <Text style={{ color: '#ffffff', fontFamily: F.semibold, fontSize: 15 }}>{t('bookingCta.contactUs')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
