import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, Image, Platform, UIManager, Linking, useWindowDimensions } from 'react-native';
import { ChevronDown, Send } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { C, F, IS_WEB, MAX_W, HERO_SRC } from './constants';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function AccordionItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    Animated.parallel([
      Animated.spring(rotateAnim, { toValue: isOpen ? 0 : 1, useNativeDriver: Platform.OS !== 'web', tension: 180, friction: 12 }),
      Animated.spring(heightAnim, { toValue: isOpen ? 0 : 1, useNativeDriver: false, tension: 120, friction: 14 }),
    ]).start();
    onToggle();
  };

  const arrowRotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const answerHeight = heightAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 120] });

  return (
    <View style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 10, borderWidth: 1, borderColor: isOpen ? C.yellow : C.darkBorder, backgroundColor: isOpen ? 'rgba(251,191,36,0.06)' : 'rgba(255,255,255,0.04)' }}>
      <TouchableOpacity onPress={toggle} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 16, gap: 12 }}>
        <Text style={{ flex: 1, color: isOpen ? C.yellow : '#ffffff', fontFamily: F.semibold, fontSize: 14, lineHeight: 20 }}>{q}</Text>
        <Animated.View style={{ transform: [{ rotate: arrowRotate }] }}>
          <ChevronDown size={18} color={isOpen ? C.yellow : C.mutedDark} />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={{ overflow: 'hidden', maxHeight: answerHeight }}>
        <View style={{ paddingHorizontal: 18, paddingBottom: 16 }}>
          <Text style={{ color: C.mutedDark, fontFamily: F.regular, fontSize: 13, lineHeight: 22 }}>{a}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

function ContactForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const fields: { key: keyof typeof form; labelKey: string; multiline?: boolean }[] = [
    { key: 'name',    labelKey: 'faq.form.fieldName' },
    { key: 'email',   labelKey: 'faq.form.fieldEmail' },
    { key: 'phone',   labelKey: 'faq.form.fieldPhone' },
    { key: 'subject', labelKey: 'faq.form.fieldSubject' },
    { key: 'message', labelKey: 'faq.form.fieldMessage', multiline: true },
  ];

  const handleSend = () => {
    if (!form.name || !form.email) return;
    const subject = encodeURIComponent(form.subject || 'Website Enquiry');
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || '—'}\n\n${form.message}`
    );
    Linking.openURL(`mailto:saferideafrica777@gmail.com?subject=${subject}&body=${body}`);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: IS_WEB ? 32 : 20, borderWidth: 1, borderColor: C.darkBorder }}>
      <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
        {t('faq.form.overline')}
      </Text>
      <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: IS_WEB ? 22 : 18, marginBottom: 20 }}>
        {t('faq.form.heading')}
      </Text>

      {fields.map(f => {
        const label = t(f.labelKey);
        return (
          <View key={f.key} style={{ marginBottom: 12 }}>
            <Text style={{ color: C.mutedDark, fontFamily: F.medium, fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              {label}
            </Text>
            <TextInput
              value={form[f.key]}
              onChangeText={v => setForm(prev => ({ ...prev, [f.key]: v }))}
              multiline={f.multiline}
              numberOfLines={f.multiline ? 4 : 1}
              style={{
                backgroundColor: 'rgba(255,255,255,0.07)',
                borderWidth: 1, borderColor: C.darkBorder, borderRadius: 10,
                paddingHorizontal: 14, paddingVertical: f.multiline ? 12 : 10,
                color: '#ffffff', fontFamily: F.regular, fontSize: 13,
                textAlignVertical: f.multiline ? 'top' : 'auto',
                height: f.multiline ? 96 : undefined,
              }}
              placeholderTextColor={C.darkBorder}
              placeholder={t('faq.form.placeholder', { field: label.toLowerCase() })}
            />
          </View>
        );
      })}

      <TouchableOpacity
        onPress={handleSend}
        style={{ marginTop: 8, backgroundColor: C.yellow, paddingVertical: 14, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: C.yellow, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
        activeOpacity={0.85}
      >
        <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 14 }}>
          {sent ? t('faq.form.sent') : t('faq.form.send')}
        </Text>
        {!sent && <Send size={16} color={C.dark} />}
      </TouchableOpacity>
    </View>
  );
}

export default function FAQ() {
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqItems = t('faq.items', { returnObjects: true }) as Array<{ q: string; a: string }>;

  return (
    <View style={{ position: 'relative', paddingVertical: 72, paddingHorizontal: 24, overflow: 'hidden' }}>
      <Image source={HERO_SRC} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} resizeMode="cover" />
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,18,36,0.88)', pointerEvents: 'none' } as any} />

      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>
        <View style={{ alignItems: 'center', marginBottom: 44 }}>
          <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>
            {t('faq.overline')}
          </Text>
          <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: IS_WEB ? 34 : 26, textAlign: 'center', marginBottom: 12 }}>
            {t('faq.heading')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 2, width: 40, backgroundColor: 'rgba(255,216,0,0.4)', borderRadius: 2 }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.yellow }} />
            <View style={{ height: 2, width: 40, backgroundColor: 'rgba(255,216,0,0.4)', borderRadius: 2 }} />
          </View>
        </View>

        <View style={IS_WEB ? { flexDirection: 'row', gap: 48, alignItems: 'flex-start' } : {}}>
          <View style={IS_WEB ? { flex: 1 } : { marginBottom: 32 }}>
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                q={item.q}
                a={item.a}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            ))}
          </View>
          <View style={IS_WEB ? { width: Math.min(380, winW * 0.42) } : {}}>
            <ContactForm />
          </View>
        </View>
      </View>
    </View>
  );
}
