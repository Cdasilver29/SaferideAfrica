import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, Platform, KeyboardAvoidingView,
  useWindowDimensions, Linking, Pressable,
} from 'react-native';
import AnimatedRN, {
  useSharedValue, useAnimatedStyle, withSequence, withTiming,
} from 'react-native-reanimated';
import { CheckCircle, MessageCircle } from 'lucide-react-native';
import { useEnrollModal } from '../context/EnrollModalContext';
import { BRANCHES, CLASSES, CLASS_SERIES, SOCIALS } from '../data/saferide';
import {
  Dialog, DialogTitle, DialogDescription, DialogClose,
  Input, Textarea, Select, Button, Spinner, Icon, cn,
} from './ui';
import { F } from './landing/constants';
import { useTheme } from '@/lib/theme';

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

// ─── Helpers (submission logic unchanged from Phase 3) ──────────────────────────

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

// ─── Field atoms ────────────────────────────────────────────────────────────────

function Field({
  label, required, error, children,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <View className="mb-3.5">
      <Text style={{ fontFamily: F.semibold }} className="mb-1.5 text-xs uppercase tracking-wide text-muted-foreground">
        {label}
        {required && <Text className="text-destructive"> *</Text>}
      </Text>
      {children}
      {error ? (
        <Text
          accessibilityLiveRegion="polite"
          style={{ fontFamily: F.regular }}
          className="mt-1 text-xs text-destructive"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

function SectionLabel({ title }: { title: string }) {
  return (
    <View className="mb-4 mt-5 flex-row items-center gap-2.5">
      <Text style={{ fontFamily: F.bold, letterSpacing: 0.8 }} className="text-[11px] uppercase text-primary">
        {title}
      </Text>
      <View className="h-px flex-1 bg-border" />
    </View>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export default function EnrollModal() {
  const { isOpen, close, presetCourseCode } = useEnrollModal();
  const Th = useTheme();
  const { height: winH } = useWindowDimensions();
  const scrollMax = Math.max(240, winH - 280);

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
      return () => { body.style.overflow = ''; };
    }
    body.style.overflow = '';
  }, [isOpen]);

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

  // ── Sent state ──────────────────────────────────────────────────────────────
  const renderSent = () => {
    const waLink = buildWhatsAppLink(
      form,
      selectedClass?.name  ?? form.courseCode,
      selectedBranch?.name ?? form.branchId,
    );
    return (
      <View className="items-center px-6 py-12">
        <View className="mb-7 h-[88px] w-[88px] items-center justify-center rounded-pill border-2 border-primary bg-primary/10">
          <Icon icon={CheckCircle} size={48} color={Th.primary} />
        </View>
        <Text style={{ fontFamily: F.bold }} className="mb-3 text-center text-xl text-foreground">Enquiry received!</Text>
        <Text style={{ fontFamily: F.regular }} className="mb-7 max-w-[320px] text-center text-sm leading-6 text-muted-foreground">
          We will be in touch soon. You can also reach us directly on WhatsApp right now.
        </Text>
        <Button variant="accent" size="lg" className="w-full max-w-[320px] rounded-card" onPress={() => Linking.openURL(waLink)}>
          <Icon icon={MessageCircle} size="sm" color={Th.accentDark} />
          <Text style={{ fontFamily: F.bold }} className="text-base text-accent-foreground">Continue on WhatsApp</Text>
        </Button>
        <Pressable onPress={close} accessibilityRole="button" className="mt-4 h-11 items-center justify-center px-4">
          <Text style={{ fontFamily: F.semibold }} className="text-sm text-primary">Done</Text>
        </Pressable>
      </View>
    );
  };

  const sending = submitState === 'sending';

  return (
    <Dialog visible={isOpen} onClose={handleClose} className="max-w-lg overflow-hidden p-0">
      {/* Header */}
      <View className="border-b border-border px-6 pb-4 pt-6">
        <DialogTitle>Enrol Now</DialogTitle>
        <DialogDescription>Safe Ride Africa Driving School</DialogDescription>
      </View>
      {submitState !== 'sending' && <DialogClose onPress={handleClose} />}

      {submitState === 'sent' ? (
        renderSent()
      ) : (
        <>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
              style={{ maxHeight: scrollMax }}
              contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 4, paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <SectionLabel title="Your Details" />

              <Field label="Full Name" required error={err('fullName')}>
                <Input
                  value={form.fullName}
                  onChangeText={v => setF('fullName', v)}
                  onBlur={() => handleBlur('fullName')}
                  placeholder="Your full legal name"
                  autoCapitalize="words"
                  textContentType="name"
                  className={cn(err('fullName') && 'border-destructive')}
                />
              </Field>

              <Field label="Phone" required error={err('phone')}>
                <Input
                  value={form.phone}
                  onChangeText={v => setF('phone', v)}
                  onBlur={() => handleBlur('phone')}
                  placeholder="07XX XXX XXX"
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  className={cn(err('phone') && 'border-destructive')}
                />
              </Field>

              <Field label="Email" required error={err('email')}>
                <Input
                  value={form.email}
                  onChangeText={v => setF('email', v)}
                  onBlur={() => handleBlur('email')}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textContentType="emailAddress"
                  className={cn(err('email') && 'border-destructive')}
                />
              </Field>

              <Field label="ID / Passport Number (optional)">
                <Input
                  value={form.idNumber}
                  onChangeText={v => setF('idNumber', v)}
                  placeholder="National ID or Passport"
                  autoCapitalize="characters"
                />
              </Field>

              <SectionLabel title="Your Course" />

              <Field label="Branch" required error={err('branchId')}>
                <Select
                  selectedValue={form.branchId}
                  onValueChange={v => { setF('branchId', v); touch('branchId'); }}
                  items={branchItems}
                  placeholder="Select a branch..."
                  className={cn(err('branchId') && 'border-destructive')}
                />
              </Field>

              <Field label="Course" required error={err('courseCode')}>
                <Select
                  selectedValue={form.courseCode}
                  onValueChange={v => { setF('courseCode', v); touch('courseCode'); }}
                  items={courseItems}
                  placeholder="Select a course..."
                  className={cn(err('courseCode') && 'border-destructive')}
                />
              </Field>

              <Field label="Preferred Start Date (DD/MM/YYYY)" required error={err('startDate')}>
                <Input
                  value={form.startDate}
                  onChangeText={v => setF('startDate', v)}
                  onBlur={() => handleBlur('startDate')}
                  placeholder="15/07/2025"
                  keyboardType="numeric"
                  className={cn(err('startDate') && 'border-destructive')}
                />
              </Field>

              <SectionLabel title="Anything Else?" />

              <Field label="Message (optional)">
                <Textarea
                  value={form.message}
                  onChangeText={v => setF('message', v)}
                  placeholder="Questions, preferred schedule, special requests..."
                  autoCapitalize="sentences"
                  numberOfLines={3}
                />
              </Field>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Footer */}
          <View className="border-t border-border px-6 py-4">
            {submitState === 'error' && errorMsg ? (
              <View
                accessibilityLiveRegion="polite"
                className="mb-3 rounded-card border border-destructive/25 bg-destructive/5 p-3"
              >
                <Text style={{ fontFamily: F.regular }} className="text-[13px] leading-[18px] text-destructive">{errorMsg}</Text>
              </View>
            ) : null}
            <AnimatedRN.View style={btnShakeStyle}>
              <Button
                variant="accent"
                size="lg"
                className="w-full rounded-card"
                disabled={sending}
                onPress={handleSubmit}
              >
                {sending && <Spinner color={Th.accentDark} />}
                <Text style={{ fontFamily: F.bold }} className="text-base text-accent-foreground">
                  {sending ? 'Sending...' : 'Send Enquiry'}
                </Text>
              </Button>
            </AnimatedRN.View>
          </View>
        </>
      )}
    </Dialog>
  );
}
