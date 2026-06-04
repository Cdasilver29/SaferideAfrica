import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Linking } from 'react-native';
import { router } from 'expo-router';
import { Phone, Mail, MapPin, Send } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import { C, F, IS_WEB, MAX_W } from './constants';
import { COMPANY } from '@/data/saferide';
import LaneStrip from './LaneStrip';

const FOOTER_NAV = [
  { label: 'Home',     path: '/' },
  { label: 'About',    path: '/about' },
  { label: 'Courses',  path: '/courses' },
  { label: 'Services', path: '/services' },
  { label: 'Branches', path: '/branches' },
  { label: 'Gallery',  path: '/gallery' },
  { label: 'Blog',     path: '/blog' },
  { label: 'Contact',  path: '/contact' },
  { label: 'Login',    path: '/login' },
  { label: 'Register', path: '/register' },
];

const LOGO      = require('../../../assets/images/saferide-logo.jpg');
const NTSA_LOGO = require('../../../assets/images/ntsa-logo.png');

export default function Footer() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [email, setEmail]           = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const courseLinks  = t('footer.courseLinks',  { returnObjects: true }) as string[];
  const companyLinks = t('footer.companyLinks', { returnObjects: true }) as string[];

  const handleSubscribe = () => {
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  // ── Theme-aware colour tokens ────────────────────────────────────────────────
  // Light: yellow main body, skyDeep copyright bar
  // Dark:  near-black throughout
  const mainBg      = isDark ? C.dark      : C.yellow;
  const bottomBg    = isDark ? '#1a0a0b'   : C.red;      // red bottom bar
  const headingC    = isDark ? C.white     : C.dark;
  const bodyC       = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(34,31,32,0.70)';
  const accentC     = isDark ? C.yellow    : C.skyDeep;  // icons & links
  const dividerC    = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(34,31,32,0.12)';
  const inputBg     = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(34,31,32,0.06)';
  const inputBorderC = isDark ? 'rgba(255,255,255,0.20)' : 'rgba(34,31,32,0.20)';
  const inputTextC  = isDark ? C.white     : C.dark;
  const socialBg    = C.red;                             // red social icons on both modes
  const bottomTextC = C.white;
  const sendBtnBg   = C.red;                            // red send button on both modes
  const sendBtnIcon = C.white;

  return (
    <>
      <LaneStrip />

      {/* ── Main footer body ─────────────────────────────────────────────────── */}
      <View style={{ backgroundColor: mainBg }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 36 }}>
          <View style={[
            IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {},
            IS_WEB ? { flexDirection: 'row', gap: 48 } : { gap: 32 },
          ]}>

            {/* Brand column */}
            <View style={IS_WEB ? { flex: 2 } : {}}>
              <TouchableOpacity
                onPress={() => router.push('/')}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}
                activeOpacity={0.85}
              >
                <Image source={LOGO} style={{ width: 44, height: 44, borderRadius: 8 }} resizeMode="contain" />
                <View>
                  <Text style={{ color: headingC, fontFamily: F.bold, fontSize: 16 }}>{t('footer.brand')}</Text>
                  <Text style={{ color: accentC, fontFamily: F.regular, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                    {t('footer.tagline')}
                  </Text>
                </View>
              </TouchableOpacity>

              <Text style={{ color: bodyC, fontFamily: F.regular, fontSize: 13, lineHeight: 22, marginBottom: 20, maxWidth: IS_WEB ? 300 : undefined }}>
                {t('footer.description')}
              </Text>

              <View style={{ gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                  <MapPin size={13} color={accentC} style={{ marginTop: 2 }} />
                  <Text style={{ color: bodyC, fontFamily: F.regular, fontSize: 13, flex: 1, lineHeight: 19 }}>
                    {COMPANY.address}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${COMPANY.primaryPhone.replace(/\s/g, '')}`)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                  activeOpacity={0.7}
                >
                  <Phone size={13} color={accentC} />
                  <Text style={{ color: bodyC, fontFamily: F.regular, fontSize: 13 }}>{COMPANY.primaryPhone}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`mailto:${COMPANY.email}`)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                  activeOpacity={0.7}
                >
                  <Mail size={13} color={accentC} />
                  <Text style={{ color: bodyC, fontFamily: F.regular, fontSize: 13 }}>{COMPANY.email}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Our Courses — web only */}
            {IS_WEB && (
              <View style={{ flex: 1 }}>
                <Text style={{ color: headingC, fontFamily: F.bold, fontSize: 14, marginBottom: 16 }}>
                  {t('footer.coursesColumnTitle')}
                </Text>
                {courseLinks.map(item => (
                  <TouchableOpacity key={item} style={{ marginBottom: 10 }} activeOpacity={0.7}>
                    <Text style={{ color: bodyC, fontFamily: F.regular, fontSize: 13 }}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Navigate — web only */}
            {IS_WEB && (
              <View style={{ flex: 1 }}>
                <Text style={{ color: headingC, fontFamily: F.bold, fontSize: 14, marginBottom: 16 }}>Navigate</Text>
                {FOOTER_NAV.map(item => (
                  <TouchableOpacity
                    key={item.path}
                    onPress={() => router.push(item.path as any)}
                    style={{ marginBottom: 10 }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: bodyC, fontFamily: F.regular, fontSize: 13 }}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Newsletter */}
            <View style={IS_WEB ? { flex: 1.5 } : {}}>
              <Text style={{ color: headingC, fontFamily: F.bold, fontSize: 14, marginBottom: 8 }}>
                {t('footer.newsletterTitle')}
              </Text>
              <Text style={{ color: bodyC, fontFamily: F.regular, fontSize: 13, lineHeight: 20, marginBottom: 16 }}>
                {t('footer.newsletterSubtitle')}
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder={t('footer.newsletterPlaceholder')}
                  placeholderTextColor={bodyC}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    flex: 1,
                    backgroundColor: inputBg,
                    borderWidth: 1,
                    borderColor: inputBorderC,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    color: inputTextC,
                    fontFamily: F.regular,
                    fontSize: 13,
                  }}
                />
                <TouchableOpacity
                  onPress={handleSubscribe}
                  style={{ backgroundColor: sendBtnBg, paddingHorizontal: 16, borderTopRightRadius: 10, borderBottomRightRadius: 10, alignItems: 'center', justifyContent: 'center' }}
                  activeOpacity={0.85}
                >
                  <Send size={16} color={sendBtnIcon} />
                </TouchableOpacity>
              </View>

              {subscribed && (
                <Text style={{ color: accentC, fontFamily: F.medium, fontSize: 12, marginTop: 8 }}>
                  {t('footer.newsletterSubscribed')}
                </Text>
              )}

              {/* Social icons */}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                {[{ label: 'f' }, { label: 't' }, { label: 'in' }].map(s => (
                  <TouchableOpacity
                    key={s.label}
                    style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: socialBg, alignItems: 'center', justifyContent: 'center' }}
                    activeOpacity={0.8}
                  >
                    <Text style={{ color: C.white, fontFamily: F.bold, fontSize: 12 }}>{s.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

          </View>
        </View>



        {/* ── Copyright bar ────────────────────────────────────────────────────── */}
        <View style={{ backgroundColor: bottomBg, paddingVertical: 16, paddingHorizontal: 24 }}>
          <View style={IS_WEB
            ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
            : { alignItems: 'center' }
          }>
            <Text style={{ color: bottomTextC, fontFamily: F.regular, fontSize: 12, textAlign: 'center', opacity: 0.85 }}>
              {t('footer.copyright')}
            </Text>
            {IS_WEB && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={NTSA_LOGO} style={{ width: 36, height: 36, marginRight: 10 }} resizeMode="contain" />
                <Text style={{ color: bottomTextC, fontFamily: F.regular, fontSize: 12, opacity: 0.85 }}>
                  {t('footer.certifiedLine')}
                </Text>
              </View>
            )}
          </View>
        </View>

      </View>
    </>
  );
}
