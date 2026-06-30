import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Platform, KeyboardAvoidingView, ActivityIndicator,
  useWindowDimensions, Linking,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AnimatedRN, {
  useSharedValue, useAnimatedStyle, withSequence, withTiming,
} from 'react-native-reanimated';
import { X, CheckCircle, MessageCircle } from 'lucide-react-native';
import { useEnrollModal } from '../context/EnrollModalContext';
import { BRANCHES, CLASSES, CLASS_SERIES, SOCIALS } from '../data/saferide';
import { C, F, IS_WEB } from './landing/constants';

// ─── Types ────────────────────────────────────────────────────────────────────

type SubmitState = 'idle' | 'sending' | 'sent' | 'error';

interface FormFields {
  fullName:   string;
  phone:      string;
  email:      string;
  branchId:   string;
  courseCode: string;
  startDate:  string;
  idNumber:   string;
  message:    string;
}

type FormErrors = Partial<Record<keyof FormFields, string>>;

const DEFAULT_FORM: FormFields = {
  fullName:   '',
  phone:      '',
  email:      '',
  branchId:   '',
  courseCode: '',
  startDate:  '',
  idNumber:   '',
  message:    '',
};

const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
const WEB3FORMS_KEY = process.env.EXPO_PUBLIC_WEB3FORMS_KEY ?? '';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDDMMYYYY(s: string): Date | null {
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const d = new Date(+m[3], +m[2] - 1, +m[1]);
  return isNaN(d.getTime()) ? null : d;
}

function isValidPhone(p: string): boolean {
  return /^(\+254\d{9}|0\d{9})$/.test(p.replace(/[\s-]/g, ''));
}

function validate(f: FormFields): FormErrors {
  const e: FormErrors = {};
  if (!f.fullName.trim())
    e.fullName  = 'Full name is required';
  if (!f.phone || !isValidPhone(f.phone))
    e.phone     = 'Valid Kenyan number required (07... or +254...)';
  if (!f.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    e.email     = 'Valid email required';
  if (!f.branchId)
    e.branchId  = 'Please select a branch';
  if (!f.courseCode)
    e.courseCode = 'Please select a course';
  const sd = parseDDMMYYYY(f.startDate);
  if (!sd) {
    e.startDate = 'Use DD/MM/YYYY format';
  } else {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (sd < today) e.startDate = 'Date must be today or later';
  }
  return e;
}

function buildWhatsAppLink(f: FormFields, courseName: string, branchName: string): string {
  const base  = SOCIALS.whatsapp.split('?')[0];
  const lines = [
    'Enrollment Enquiry - Safe Ride Africa',
    `Name: ${f.fullName}`,
    `Phone: ${f.phone}`,
    `Email: ${f.email}`,
    `Branch: ${branchName}`,
    `Course: ${courseName}`,
    `Start Date: ${f.startDate}`,
    f.idNumber ? `ID/Passport: ${f.idNumber}` : '',
    f.message  ? `Message: ${f.message}`       : '',
  ].filter(Boolean);
  return `${base}?text=${encodeURIComponent(lines.join('\n'))}`;
}

// ─── Atoms ───────────────────────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <Text style={s.fieldError}>{msg}</Text>;
}

function StyledInput({
  value, onChangeText, onBlur, placeholder, keyboardType, autoCapitalize,
  hasError, name, multiline, numberOfLines,
}: {
  value: string; onChangeText: (v: string) => void; onBlur?: () => void;
  placeholder?: string; keyboardType?: any; autoCapitalize?: any;
  hasError?: boolean; name?: string; multiline?: boolean; numberOfLines?: number;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      placeholder={placeholder}
      placeholderTextColor="rgba(1,165,240,0.35)"
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize ?? 'none'}
      multiline={multiline}
      numberOfLines={numberOfLines}
      style={[s.input, hasError && s.inputError, multiline && s.inputMultiline]}
      {...(name ? ({ id: name, name } as any) : {})}
    />
  );
}

function PickerField({
  value, onChange, items, placeholder, hasError,
}: {
  value: string; onChange: (v: string) => void;
  items: { label: string; value: string; enabled?: boolean }[];
  placeholder: string; hasError?: boolean;
}) {
  return (
    <View style={[s.pickerWrap, hasError && s.inputError]}>
      <Picker selectedValue={value} onValueChange={v => onChange(v as string)}
              style={s.picker} dropdownIconColor={C.skyDeep}>
        <Picker.Item label={placeholder} value="" color="rgba(1,165,240,0.45)" />
        {items.map(i => (
          <Picker.Item
            key={i.value}
            label={i.label}
            value={i.value}
            enabled={i.enabled !== false}
            color={i.enabled === false ? C.skyDeep : C.dark}
          />
        ))}
      </Picker>
    </View>
  );
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <View style={s.fieldWrap}>
      <Text style={s.label}>{label}</Text>
      {children}
      <FieldError msg={error} />
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={s.sectionHeader}>
      <View style={s.sectionPill}>
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
      <View style={s.sectionLine} />
    </View>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export default function EnrollModal() {
  const { isOpen, close, presetCourseCode } = useEnrollModal();
  const { width: winW } = useWindowDimensions();
  const modalW    = Math.min(680, winW - 32);
  const modalLeft = (winW - modalW) / 2;

  const [form,        setForm]        = useState<FormFields>(DEFAULT_FORM);
  const [errors,      setErrors]      = useState<FormErrors>({});
  const [touched,     setTouched]     = useState<Set<keyof FormFields>>(new Set());
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMsg,    setErrorMsg]    = useState<string | null>(null);

  const btnX = useSharedValue(0);
  const btnShakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: btnX.value }] }));

  const selectedClass  = CLASSES.find(c => c.code === form.courseCode);
  const selectedBranch = BRANCHES.find(b => b.id === form.branchId);

  const setF = useCallback(<K extends keyof FormFields>(key: K, val: FormFields[K]) => {
    setForm(prev => ({ ...prev, [key]: val }));
  }, []);

  const touch = useCallback((key: keyof FormFields) => {
    setTouched(prev => new Set([...prev, key]));
  }, []);

  const err = (key: keyof FormFields) => touched.has(key) ? errors[key] : undefined;

  useEffect(() => {
    if (isOpen) {
      setForm({ ...DEFAULT_FORM, courseCode: presetCourseCode ?? '' });
      setErrors({});
      setTouched(new Set());
      setSubmitState('idle');
      setErrorMsg(null);
    }
  }, [isOpen, presetCourseCode]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const body = (document as any).body;
    if (isOpen) {
      body.style.overflow = 'hidden';
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && submitState === 'idle') close();
      };
      document.addEventListener('keydown', handler);
      return () => { body.style.overflow = ''; document.removeEventListener('keydown', handler); };
    } else {
      body.style.overflow = '';
    }
  }, [isOpen, submitState, close]);

  const handleBlur = (key: keyof FormFields) => {
    touch(key);
    setErrors(validate(form));
  };

  const handleSubmit = async () => {
    const allKeys = new Set(Object.keys(DEFAULT_FORM) as (keyof FormFields)[]);
    setTouched(allKeys);
    const errs = validate(form);
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      btnX.value = withSequence(
        withTiming(-9, { duration: 55 }), withTiming(9,  { duration: 55 }),
        withTiming(-7, { duration: 55 }), withTiming(7,  { duration: 55 }),
        withTiming(0,  { duration: 55 }),
      );
      return;
    }

    setErrorMsg(null);
    setSubmitState('sending');

    try {
      const res = await fetch(WEB3FORMS_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key:          WEB3FORMS_KEY,
          subject:             'Enrollment Enquiry - Safe Ride Africa',
          from_name:           form.fullName,
          name:                form.fullName,
          email:               form.email,
          phone:               form.phone,
          branch:              selectedBranch?.name ?? form.branchId,
          course:              selectedClass?.name  ?? form.courseCode,
          preferred_start_date: form.startDate,
          id_number:           form.idNumber || '—',
          message:             form.message  || '(no message)',
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message ?? 'Submission failed');
      setSubmitState('sent');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
      setErrorMsg(msg);
      setSubmitState('error');
    }
  };

  const handleClose = () => {
    if (submitState === 'sending') return;
    close();
  };

  // ── State screens ─────────────────────────────────────────────────────────

  const SentContent = () => {
    const waLink = buildWhatsAppLink(
      form,
      selectedClass?.name  ?? form.courseCode,
      selectedBranch?.name ?? form.branchId,
    );
    return (
      <View style={s.centredState}>
        <View style={[s.stateRing, { backgroundColor: 'rgba(1,165,240,0.10)', borderColor: C.skyDeep }]}>
          <CheckCircle size={52} color={C.skyDeep} />
        </View>
        <Text style={s.stateHeading}>Enquiry received!</Text>
        <Text style={s.stateBody}>
          We will be in touch soon. You can also reach us directly on WhatsApp right now.
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL(waLink)}
          activeOpacity={0.85}
          style={s.whatsappBtn}
        >
          <MessageCircle size={18} color={C.dark} />
          <Text style={s.whatsappText}>Continue on WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={close} activeOpacity={0.7} style={{ marginTop: 16 }}>
          <Text style={{ color: C.skyDeep, fontFamily: F.semibold, fontSize: 14 }}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const branchItems = BRANCHES.map(b => ({
    label: b.name + (b.isHQ ? ' (HQ)' : ''),
    value: b.id,
  }));

  const courseItems = CLASS_SERIES.flatMap(series => {
    const seriesCourses = CLASSES.filter(c => c.series === series.code);
    return [
      { label: `-- ${series.label}  (${series.subtitle}) --`, value: `__hdr_${series.code}`, enabled: false },
      ...seriesCourses.map(c => ({ label: c.name, value: c.code, enabled: true })),
    ];
  });

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType={IS_WEB ? 'none' : 'slide'}
      onRequestClose={handleClose}
      accessibilityViewIsModal
    >
      <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={handleClose} />

      <View
        style={[
          s.card,
          IS_WEB && winW >= 520 && {
            top: '4%' as any, bottom: '4%' as any,
            left: modalLeft, right: undefined as any,
            width: modalW,
            borderRadius: 20,
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
          },
        ]}
        accessibilityLabel="Enrol form"
        accessible
      >
        {/* Header */}
        <View style={s.header}>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle}>Enrol Now</Text>
            <Text style={s.headerSub}>Safe Ride Africa Driving School</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={s.closeBtn} activeOpacity={0.7}>
            <X size={20} color={C.white} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

            {submitState === 'sent' ? (
              <SentContent />
            ) : (
              <>
                {/* Section 1 - Your Details */}
                <SectionHeader title="Your Details" />

                <Field label="Full Name *" error={err('fullName')}>
                  <StyledInput value={form.fullName} onChangeText={v => setF('fullName', v)}
                    onBlur={() => handleBlur('fullName')} placeholder="Your full legal name"
                    autoCapitalize="words" hasError={!!err('fullName')} name="fullName" />
                </Field>

                <Field label="Phone *" error={err('phone')}>
                  <StyledInput value={form.phone} onChangeText={v => setF('phone', v)}
                    onBlur={() => handleBlur('phone')} placeholder="07XX XXX XXX"
                    keyboardType="phone-pad" hasError={!!err('phone')} name="phone" />
                </Field>

                <Field label="Email *" error={err('email')}>
                  <StyledInput value={form.email} onChangeText={v => setF('email', v)}
                    onBlur={() => handleBlur('email')} placeholder="you@example.com"
                    keyboardType="email-address" hasError={!!err('email')} name="email" />
                </Field>

                <Field label="ID / Passport Number (optional)">
                  <StyledInput value={form.idNumber} onChangeText={v => setF('idNumber', v)}
                    placeholder="National ID or Passport"
                    autoCapitalize="characters" name="idNumber" />
                </Field>

                {/* Section 2 - Your Course */}
                <SectionHeader title="Your Course" />

                <Field label="Branch *" error={err('branchId')}>
                  <PickerField value={form.branchId}
                    onChange={v => { setF('branchId', v); touch('branchId'); }}
                    items={branchItems} placeholder="Select a branch..."
                    hasError={!!err('branchId')} />
                </Field>

                <Field label="Course *" error={err('courseCode')}>
                  <PickerField value={form.courseCode}
                    onChange={v => { setF('courseCode', v); touch('courseCode'); }}
                    items={courseItems} placeholder="Select a course..."
                    hasError={!!err('courseCode')} />
                </Field>

                <Field label="Preferred Start Date * (DD/MM/YYYY)" error={err('startDate')}>
                  <StyledInput value={form.startDate} onChangeText={v => setF('startDate', v)}
                    onBlur={() => handleBlur('startDate')} placeholder="15/07/2025"
                    keyboardType="numeric" hasError={!!err('startDate')} name="startDate" />
                </Field>

                {/* Section 3 - Message */}
                <SectionHeader title="Anything Else?" />

                <Field label="Message (optional)">
                  <StyledInput value={form.message} onChangeText={v => setF('message', v)}
                    placeholder="Questions, preferred schedule, special requests..."
                    autoCapitalize="sentences" name="message"
                    multiline numberOfLines={3} />
                </Field>
              </>
            )}

          </ScrollView>
        </KeyboardAvoidingView>

        {/* Footer */}
        {submitState !== 'sent' && (
          <View style={s.footer}>
            {(submitState === 'error' && errorMsg) && (
              <View style={s.errorBanner}>
                <Text style={s.errorBannerText}>{errorMsg}</Text>
              </View>
            )}
            <AnimatedRN.View style={btnShakeStyle}>
              <TouchableOpacity
                onPress={handleSubmit}
                activeOpacity={0.85}
                disabled={submitState === 'sending'}
                style={[s.submitBtn, submitState === 'sending' && { opacity: 0.72 }]}
              >
                {submitState === 'sending' && (
                  <ActivityIndicator size="small" color={C.white} style={{ marginRight: 8 }} />
                )}
                <Text style={s.submitText}>
                  {submitState === 'sending' ? 'Sending...' : 'Send Enquiry'}
                </Text>
              </TouchableOpacity>
            </AnimatedRN.View>
          </View>
        )}
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(1,25,50,0.72)' },

  card: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    maxHeight: '92%' as any,
    backgroundColor: '#F4FAFF',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    overflow: 'hidden',
  },

  header: {
    backgroundColor: C.skyDeep,
    paddingHorizontal: 20, paddingTop: 22, paddingBottom: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: C.skyDeep, shadowOpacity: 0.22, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  headerTitle: { fontFamily: F.bold, fontSize: 20, color: C.white },
  headerSub:   { fontFamily: F.regular, fontSize: 12, color: 'rgba(255,255,255,0.68)', marginTop: 3 },
  closeBtn: { padding: 9, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.18)' },

  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 24 },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginTop: 22, marginBottom: 16,
  },
  sectionPill: {
    backgroundColor: C.skyDeep, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 5,
  },
  sectionTitle: {
    fontFamily: F.bold, fontSize: 11, color: C.white,
    letterSpacing: 0.8, textTransform: 'uppercase',
  },
  sectionLine: { flex: 1, height: 1.5, backgroundColor: 'rgba(1,165,240,0.18)', borderRadius: 1 },

  fieldWrap: { marginBottom: 14 },
  label: {
    fontFamily: F.semibold, fontSize: 12, color: C.skyDeep,
    marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5, borderColor: 'rgba(1,165,240,0.28)',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13,
    fontFamily: F.regular, fontSize: 14, color: C.dark,
    backgroundColor: C.white,
  },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  inputError:     { borderColor: C.red },
  fieldError:     { fontFamily: F.regular, fontSize: 12, color: C.red, marginTop: 4 },

  pickerWrap: {
    borderWidth: 1.5, borderColor: 'rgba(1,165,240,0.28)',
    borderRadius: 12, overflow: 'hidden', backgroundColor: C.white,
  },
  picker: { height: 48, color: C.dark },

  footer: {
    paddingHorizontal: 20, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: 'rgba(1,165,240,0.14)',
    backgroundColor: C.white,
  },
  errorBanner: {
    backgroundColor: 'rgba(225,29,46,0.07)',
    borderRadius: 12, padding: 12, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(225,29,46,0.22)',
  },
  errorBannerText: { fontFamily: F.regular, fontSize: 13, color: C.red, lineHeight: 18 },

  submitBtn: {
    backgroundColor: C.skyDeep,
    paddingVertical: 16, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 6,
    shadowColor: C.skyDeep, shadowOpacity: 0.40, shadowRadius: 14, elevation: 6,
  },
  submitText: { fontFamily: F.bold, fontSize: 15, color: C.white },

  centredState: { alignItems: 'center', paddingVertical: 52, paddingHorizontal: 24 },
  stateRing: {
    width: 92, height: 92, borderRadius: 46,
    borderWidth: 2.5,
    alignItems: 'center', justifyContent: 'center', marginBottom: 28,
  },
  stateHeading: { fontFamily: F.bold, fontSize: 22, color: C.dark, marginBottom: 12, textAlign: 'center' },
  stateBody:    {
    fontFamily: F.regular, fontSize: 15, color: 'rgba(34,31,32,0.60)',
    textAlign: 'center', lineHeight: 24, marginBottom: 28,
  },
  whatsappBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.yellow,
    paddingVertical: 14, paddingHorizontal: 28,
    borderRadius: 14,
    shadowColor: C.yellow, shadowOpacity: 0.30, shadowRadius: 10, elevation: 4,
  },
  whatsappText: { fontFamily: F.bold, fontSize: 15, color: C.dark },
});
