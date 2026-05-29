import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Car, Phone, Mail, MapPin, Send } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W } from './constants';

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const courseLinks  = t('footer.courseLinks',  { returnObjects: true }) as string[];
  const companyLinks = t('footer.companyLinks', { returnObjects: true }) as string[];

  const handleSubscribe = () => {
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <View style={{ backgroundColor: '#020617' }}>

      {/* Main footer grid */}
      <View style={{ paddingHorizontal: 24, paddingTop: 56, paddingBottom: 40 }}>
        <View style={[IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}, IS_WEB ? { flexDirection: 'row', gap: 48 } : { gap: 36 }]}>

          {/* Brand column */}
          <View style={IS_WEB ? { flex: 2 } : {}}>
            <TouchableOpacity onPress={() => router.push('/')} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }} activeOpacity={0.85}>
              <View style={{ backgroundColor: C.yellow, borderRadius: 10, padding: 7 }}>
                <Car size={20} color={C.dark} />
              </View>
              <View>
                <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 16 }}>{t('footer.brand')}</Text>
                <Text style={{ color: C.yellow, fontFamily: F.regular, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase' }}>{t('footer.tagline')}</Text>
              </View>
            </TouchableOpacity>

            <Text style={{ color: '#64748b', fontFamily: F.regular, fontSize: 13, lineHeight: 22, marginBottom: 20, maxWidth: IS_WEB ? 300 : undefined }}>
              {t('footer.description')}
            </Text>

            <View style={{ gap: 10 }}>
              {[
                { Icon: MapPin, text: 'PO. BOX 25716 - 00603 Nairobi, Kenya' },
                { Icon: Phone, text: '+254 712 045 710' },
                { Icon: Mail,  text: 'saferideafrica777@gmail.com' },
              ].map(({ Icon, text }) => (
                <View key={text} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                  <Icon size={13} color={C.yellow} style={{ marginTop: 2 }} />
                  <Text style={{ color: '#64748b', fontFamily: F.regular, fontSize: 13, flex: 1, lineHeight: 19 }}>{text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Our Courses (web only) */}
          {IS_WEB && (
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 14, marginBottom: 16 }}>{t('footer.coursesColumnTitle')}</Text>
              {courseLinks.map(item => (
                <TouchableOpacity key={item} style={{ marginBottom: 10 }} activeOpacity={0.7}>
                  <Text style={{ color: '#64748b', fontFamily: F.regular, fontSize: 13 }}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Company (web only) */}
          {IS_WEB && (
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 14, marginBottom: 16 }}>{t('footer.companyColumnTitle')}</Text>
              {companyLinks.map(item => (
                <TouchableOpacity key={item} style={{ marginBottom: 10 }} activeOpacity={0.7}>
                  <Text style={{ color: '#64748b', fontFamily: F.regular, fontSize: 13 }}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Newsletter */}
          <View style={IS_WEB ? { flex: 1.5 } : {}}>
            <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 14, marginBottom: 8 }}>{t('footer.newsletterTitle')}</Text>
            <Text style={{ color: '#64748b', fontFamily: F.regular, fontSize: 13, lineHeight: 20, marginBottom: 16 }}>
              {t('footer.newsletterSubtitle')}
            </Text>

            <View style={{ flexDirection: 'row', gap: 0 }}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={t('footer.newsletterPlaceholder')}
                placeholderTextColor="#475569"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ flex: 1, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, paddingHorizontal: 14, paddingVertical: 12, color: '#ffffff', fontFamily: F.regular, fontSize: 13 }}
              />
              <TouchableOpacity onPress={handleSubscribe} style={{ backgroundColor: C.yellow, paddingHorizontal: 16, borderTopRightRadius: 10, borderBottomRightRadius: 10, alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.85}>
                <Send size={16} color={C.dark} />
              </TouchableOpacity>
            </View>

            {subscribed && (
              <Text style={{ color: C.green, fontFamily: F.medium, fontSize: 12, marginTop: 8 }}>
                {t('footer.newsletterSubscribed')}
              </Text>
            )}

            {/* Social icons */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              {[{ color: '#1877f2', label: 'f' }, { color: '#1da1f2', label: 't' }, { color: '#0a66c2', label: 'in' }].map(s => (
                <TouchableOpacity key={s.label} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: s.color, alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.8}>
                  <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 12 }}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Copyright bar */}
      <View style={{ borderTopWidth: 1, borderTopColor: '#1e293b', paddingVertical: 18, paddingHorizontal: 24 }}>
        <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } : { alignItems: 'center' }}>
          <Text style={{ color: '#475569', fontFamily: F.regular, fontSize: 12, textAlign: 'center' }}>
            {t('footer.copyright')}
          </Text>
          {IS_WEB && (
            <Text style={{ color: '#334155', fontFamily: F.regular, fontSize: 12 }}>
              {t('footer.certifiedLine')}
            </Text>
          )}
        </View>
      </View>

    </View>
  );
}
