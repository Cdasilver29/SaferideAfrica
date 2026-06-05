import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Platform, KeyboardAvoidingView, ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AnimatedRN, {
  useSharedValue, useAnimatedStyle, withSequence, withTiming,
} from 'react-native-reanimated';
import { X, Check, CheckCircle, AlertTriangle } from 'lucide-react-native';
import { useEnrollModal } from '../context/EnrollModalContext';
import { BRANCHES, CLASSES, CLASS_SERIES, PAYMENT } from '../data/saferide';
import { splitIntoThree } from '../lib/installments';
import { createEnrollment } from '../api/enrollments';
import { initiateStkPush, waitForPayment } from '../api/mpesa';
import { C, F, IS_WEB } from './landing/constants';

// ─── Types ────────────────────────────────────────────────────────────────────

type SubmitState = 'idle' | 'submitting' | 'awaiting_pin' | 'success';

interface FormFields {
  fullName:      string;
  idNumber:      string;
  email:         string;
  phone:         string;
  branchId:      string;
  courseCode:    string;
  startDate:     string;
  paymentPlan:   'full' | 'installments_3';
  mpesaNumber:   string;
  termsAccepted: boolean;
}

type FormErrors = Partial<Record<keyof FormFields, string>>;

const DEFAULT_FORM: FormFields = {
  fullName:      '',
  idNumber:      '',
  email:         '',
  phone:         '',
  branchId:      '',
  courseCode:    '',
  startDate:     '',
  paymentPlan:   'full',
  mpesaNumber:   '',
  termsAccepted: false,
};

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

function fmt(n: number): string {
  return `Ksh ${n.toLocaleString()}`;
}

function validate(f: FormFields): FormErrors {
  const e: FormErrors = {};
  if (!f.fullName.trim())  e.fullName  = 'Full name is required';
  if (!f.idNumber.trim())  e.idNumber  = 'ID / Passport number is required';
  if (!f.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
                           e.email     = 'Valid email required';
  if (!isValidPhone(f.phone))
                           e.phone     = 'Valid Kenyan number required (07… or +254…)';
  if (!f.branchId)         e.branchId  = 'Please select a branch';
  if (!f.courseCode)       e.courseCode = 'Please select a course';

  const sd = parseDDMMYYYY(f.startDate);
  if (!sd) {
    e.startDate = 'Use DD/MM/YYYY format';
  } else {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (sd < today) e.startDate = 'Date must be today or later';
  }

  if (!isValidPhone(f.mpesaNumber))
                           e.mpesaNumber = 'Valid M-Pesa number required';
  if (!f.termsAccepted)    e.termsAccepted = 'You must accept the terms to proceed';
  return e;
}

// ─── Atoms ───────────────────────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <Text style={s.fieldError}>{msg}</Text>;
}

function StyledInput({
  value, onChangeText, onBlur, placeholder, keyboardType, autoCapitalize, hasError, name,
}: {
  value: string; onChangeText: (v: string) => void; onBlur?: () => void;
  placeholder?: string; keyboardType?: any; autoCapitalize?: any; hasError?: boolean; name?: string;
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
      style={[s.input, hasError && s.inputError]}
      {...(name ? ({ id: name, name } as any) : {})}
    />
  );
}

function PickerField({
  value, onChange, items, placeholder, hasError,
}: {
  value: string; onChange: (v: string) => void;
  items: { label: string; value: string; enabled?: boolean }[]; placeholder: string; hasError?: boolean;
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

function SegmentedControl({
  options, value, onChange, disabledValues,
}: {
  options: { label: string; value: string }[]; value: string;
  onChange: (v: string) => void; disabledValues?: string[];
}) {
  return (
    <View style={s.segmented}>
      {options.map(opt => {
        const active   = opt.value === value;
        const disabled = disabledValues?.includes(opt.value);
        return (
          <TouchableOpacity key={opt.value} onPress={() => !disabled && onChange(opt.value)}
            activeOpacity={disabled ? 1 : 0.75}
            style={[s.segment, active && s.segmentActive, disabled && s.segmentDisabled]}>
            <Text style={[s.segmentText, active && s.segmentTextActive]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
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
  const [submitError, setSubmitError] = useState<string | null>(null);

  const btnX = useSharedValue(0);
  const btnShakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: btnX.value }] }));

  const selectedClass   = CLASSES.find(c => c.code === form.courseCode);
  const canInstallments = !!selectedClass;
  const [i1, i2, i3]   = selectedClass ? splitIntoThree(selectedClass.total) : [0, 0, 0];
  const payAmount       = form.paymentPlan === 'installments_3' ? i1 : (selectedClass?.total ?? 0);

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
      setSubmitError(null);
    }
  }, [isOpen, presetCourseCode]);

  useEffect(() => {
    if (form.phone && !touched.has('mpesaNumber')) {
      setF('mpesaNumber', form.phone);
    }
  }, [form.phone]);

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

    setSubmitError(null);

    try {
      setSubmitState('submitting');

      const enrollment = await createEnrollment({
        userId:          `guest_${Date.now()}`,
        branchId:        form.branchId,
        classCode:       form.courseCode,
        className:       selectedClass?.name ?? '',
        totalAmount:     selectedClass?.total ?? 0,
        studentName:     form.fullName,
        studentEmail:    form.email,
        studentPhone:    form.phone,
        studentIdNumber: form.idNumber,
        paymentPlan:     form.paymentPlan,
      });

      const checkoutRequestId = await initiateStkPush({
        phone:             form.mpesaNumber || form.phone,
        amount:            payAmount,
        accountRef:        enrollment.id.slice(0, 12),
        enrollmentId:      enrollment.id,
        installmentNumber: form.paymentPlan === 'installments_3' ? 1 : undefined,
      });

      setSubmitState('awaiting_pin');

      const result = await waitForPayment(checkoutRequestId);

      if (result.status === 'success') {
        setSubmitState('success');
      } else {
        setSubmitError(result.resultDesc ?? 'Payment was not completed. Please try again.');
        setSubmitState('idle');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setSubmitError(msg);
      setSubmitState('idle');
    }
  };

  const handleClose = () => {
    if (submitState === 'submitting') return;
    close();
  };

  // ── State screens ─────────────────────────────────────────────────────────

  const AwaitingPinContent = () => (
    <View style={s.centredState}>
      <View style={s.pingRing}>
        <ActivityIndicator size="large" color={C.skyDeep} />
      </View>
      <Text style={s.stateHeading}>Check your phone</Text>
      <Text style={s.stateBody}>
        We've sent an M-Pesa prompt to{'\n'}{form.mpesaNumber || form.phone}.{'\n\n'}
        Enter your PIN to complete the payment.
      </Text>
      <TouchableOpacity onPress={() => setSubmitState('idle')} activeOpacity={0.7} style={{ marginTop: 28 }}>
        <Text style={{ color: C.skyDeep, fontFamily: F.semibold, fontSize: 14 }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const SuccessContent = () => (
    <View style={s.centredState}>
      <View style={[s.pingRing, { backgroundColor: 'rgba(1,165,240,0.10)', borderColor: C.skyDeep }]}>
        <CheckCircle size={52} color={C.skyDeep} />
      </View>
      <Text style={s.stateHeading}>Enrolment received!</Text>
      <Text style={s.stateBody}>
        Your branch admin will confirm shortly.{'\n'}
        You'll receive a confirmation SMS and email.
      </Text>
      <TouchableOpacity onPress={close} activeOpacity={0.85}
        style={[s.submitBtn, { marginTop: 32, paddingHorizontal: 48 }]}>
        <Text style={s.submitText}>Done</Text>
      </TouchableOpacity>
    </View>
  );

  const isNonIdle = submitState === 'awaiting_pin' || submitState === 'success';

  const branchItems  = BRANCHES.map(b => ({ label: b.name + (b.isHQ ? ' (HQ)' : ''), value: b.id }));
  const courseItems  = CLASS_SERIES.flatMap(series => {
    const seriesCourses = CLASSES.filter(c => c.series === series.code);
    return [
      { label: `── ${series.label}  (${series.subtitle}) ──`, value: `__hdr_${series.code}`, enabled: false },
      ...seriesCourses.map(c => ({
        label:   `${c.name} — Ksh ${c.total.toLocaleString()}`,
        value:   c.code,
        enabled: true,
      })),
    ];
  });
  const planOptions  = [
    { label: 'Full Payment',   value: 'full' },
    { label: '3 Installments', value: 'installments_3' },
  ];

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

        {/* ── Sky-blue header ─────────────────────────────────────────── */}
        <View style={s.header}>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle}>Enrol Now</Text>
            <Text style={s.headerSub}>SafeRide Africa Driving School</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={s.closeBtn} activeOpacity={0.7}>
            <X size={20} color={C.white} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

            {isNonIdle ? (
              submitState === 'awaiting_pin' ? <AwaitingPinContent /> : <SuccessContent />
            ) : (
              <>
                {/* ── Section 1 — Your Details ──────────────────────── */}
                <SectionHeader title="Your Details" />

                <Field label="Full Name *" error={err('fullName')}>
                  <StyledInput value={form.fullName} onChangeText={v => setF('fullName', v)}
                    onBlur={() => handleBlur('fullName')} placeholder="Your full legal name"
                    autoCapitalize="words" hasError={!!err('fullName')} name="fullName" />
                </Field>

                <Field label="ID / Passport Number *" error={err('idNumber')}>
                  <StyledInput value={form.idNumber} onChangeText={v => setF('idNumber', v)}
                    onBlur={() => handleBlur('idNumber')} placeholder="National ID or Passport"
                    autoCapitalize="characters" hasError={!!err('idNumber')} name="idNumber" />
                </Field>

                <Field label="Email *" error={err('email')}>
                  <StyledInput value={form.email} onChangeText={v => setF('email', v)}
                    onBlur={() => handleBlur('email')} placeholder="you@example.com"
                    keyboardType="email-address" hasError={!!err('email')} name="email" />
                </Field>

                <Field label="Phone *" error={err('phone')}>
                  <StyledInput value={form.phone} onChangeText={v => setF('phone', v)}
                    onBlur={() => handleBlur('phone')} placeholder="07XX XXX XXX"
                    keyboardType="phone-pad" hasError={!!err('phone')} name="phone" />
                </Field>

                {/* ── Section 2 — Your Course ───────────────────────── */}
                <SectionHeader title="Your Course" />

                <Field label="Branch *" error={err('branchId')}>
                  <PickerField value={form.branchId}
                    onChange={v => { setF('branchId', v); touch('branchId'); }}
                    items={branchItems} placeholder="Select a branch…"
                    hasError={!!err('branchId')} />
                </Field>

                <Field label="Course *" error={err('courseCode')}>
                  <PickerField value={form.courseCode}
                    onChange={v => { setF('courseCode', v); touch('courseCode'); }}
                    items={courseItems} placeholder="Select a course…"
                    hasError={!!err('courseCode')} />
                </Field>

                <Field label="Preferred Start Date * (DD/MM/YYYY)" error={err('startDate')}>
                  <StyledInput value={form.startDate} onChangeText={v => setF('startDate', v)}
                    onBlur={() => handleBlur('startDate')} placeholder="15/07/2025"
                    keyboardType="numeric" hasError={!!err('startDate')} name="startDate" />
                </Field>

                {/* ── Section 3 — Payment ───────────────────────────── */}
                <SectionHeader title="Payment" />

                <Field label="Payment Plan">
                  <SegmentedControl options={planOptions} value={form.paymentPlan}
                    onChange={v => setF('paymentPlan', v as FormFields['paymentPlan'])} />
                </Field>

                {form.paymentPlan === 'installments_3' && selectedClass && (
                  <View style={s.installmentCard}>
                    <Text style={s.installmentTitle}>Installment Breakdown</Text>
                    {[
                      { label: 'Today (Installment 1)',       amount: i1 },
                      { label: 'In 10 days (Installment 2)',  amount: i2 },
                      { label: 'In 20 days (Installment 3)',  amount: i3 },
                    ].map(row => (
                      <View key={row.label} style={s.installmentRow}>
                        <Text style={s.installmentLabel}>{row.label}</Text>
                        <Text style={s.installmentAmount}>{fmt(row.amount)}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {selectedClass && (
                  <View style={s.amountPill}>
                    <Text style={s.amountLabel}>Amount due today</Text>
                    <Text style={s.amountValue}>{fmt(payAmount)}</Text>
                  </View>
                )}

                <Field label="M-Pesa Number *" error={err('mpesaNumber')}>
                  <StyledInput value={form.mpesaNumber}
                    onChangeText={v => { setF('mpesaNumber', v); touch('mpesaNumber'); }}
                    onBlur={() => handleBlur('mpesaNumber')}
                    placeholder="Auto-filled from your phone"
                    keyboardType="phone-pad" hasError={!!err('mpesaNumber')} name="mpesaNumber" />
                  <Text style={s.mpesaHint}>
                    The M-Pesa prompt will be sent to this number. Change it if paying from a different line.
                  </Text>
                </Field>

                {/* Payment instructions */}
                <View style={s.paymentBox}>
                  <View style={s.paymentWarnBar}>
                    <AlertTriangle size={14} color={C.red} />
                    <Text style={s.paymentWarnText}>{PAYMENT.notice}</Text>
                  </View>
                  <View style={s.paymentBody}>
                    <View style={s.paymentMethod}>
                      <Text style={s.paymentMethodTitle}>M-Pesa Lipa Na M-Pesa</Text>
                      <Text style={s.paymentDetail}>Paybill: <Text style={s.paymentBold}>{PAYMENT.mpesaPaybill}</Text></Text>
                      <Text style={s.paymentDetail}>Account: <Text style={s.paymentBold}>{PAYMENT.mpesaAccountName}</Text></Text>
                    </View>
                    <View style={s.paymentDivider} />
                    <View style={s.paymentMethod}>
                      <Text style={s.paymentMethodTitle}>Bank Transfer</Text>
                      <Text style={s.paymentDetail}>{PAYMENT.bankName}</Text>
                      <Text style={s.paymentDetail}>Account: <Text style={s.paymentBold}>{PAYMENT.kcbAccount}</Text></Text>
                    </View>
                  </View>
                </View>

                {/* Terms */}
                <TouchableOpacity
                  onPress={() => setF('termsAccepted', !form.termsAccepted)}
                  activeOpacity={0.7} style={s.termsRow}>
                  <View style={[s.checkbox, form.termsAccepted && s.checkboxChecked, !!err('termsAccepted') && s.checkboxError]}>
                    {form.termsAccepted && <Check size={12} color={C.white} />}
                  </View>
                  <Text style={s.termsText}>
                    I agree to SafeRide's terms of service and the strict no-cash payment policy.
                  </Text>
                </TouchableOpacity>
                {err('termsAccepted') && (
                  <Text style={[s.fieldError, { marginTop: -8, marginBottom: 12 }]}>
                    {err('termsAccepted')}
                  </Text>
                )}
              </>
            )}

          </ScrollView>
        </KeyboardAvoidingView>

        {/* Footer */}
        {!isNonIdle && (
          <View style={s.footer}>
            {submitError && (
              <View style={s.errorBanner}>
                <AlertTriangle size={14} color={C.red} />
                <Text style={s.errorBannerText}>{submitError}</Text>
              </View>
            )}
            <Text style={s.footerCaption}>Tap below to receive an M-Pesa PIN prompt on your phone.</Text>
            <AnimatedRN.View style={btnShakeStyle}>
              <TouchableOpacity onPress={handleSubmit} activeOpacity={0.85}
                disabled={submitState === 'submitting'}
                style={[s.submitBtn, submitState === 'submitting' && { opacity: 0.72 }]}>
                {submitState === 'submitting' && (
                  <ActivityIndicator size="small" color={C.white} style={{ marginRight: 8 }} />
                )}
                <Text style={s.submitText}>
                  {submitState === 'submitting' ? 'Sending prompt…' : 'Send M-Pesa Prompt'}
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

  // ── Sky-blue header ──────────────────────────────────────────────────────
  header: {
    backgroundColor: C.skyDeep,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Subtle bottom shimmer
    shadowColor: C.skyDeep,
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  headerTitle: { fontFamily: F.bold, fontSize: 20, color: C.white },
  headerSub:   { fontFamily: F.regular, fontSize: 12, color: 'rgba(255,255,255,0.68)', marginTop: 3 },
  closeBtn: {
    padding: 9, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 24 },

  // ── Section pills ────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginTop: 22, marginBottom: 16,
  },
  sectionPill: {
    backgroundColor: C.skyDeep,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  sectionTitle: {
    fontFamily: F.bold, fontSize: 11, color: C.white,
    letterSpacing: 0.8, textTransform: 'uppercase',
  },
  sectionLine: { flex: 1, height: 1.5, backgroundColor: 'rgba(1,165,240,0.18)', borderRadius: 1 },

  // ── Fields ───────────────────────────────────────────────────────────────
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
  inputError: { borderColor: C.red },
  fieldError: { fontFamily: F.regular, fontSize: 12, color: C.red, marginTop: 4 },

  pickerWrap: {
    borderWidth: 1.5, borderColor: 'rgba(1,165,240,0.28)',
    borderRadius: 12, overflow: 'hidden', backgroundColor: C.white,
  },
  picker: { height: 48, color: C.dark },

  // ── Segmented ────────────────────────────────────────────────────────────
  segmented: {
    flexDirection: 'row', borderRadius: 12,
    borderWidth: 1.5, borderColor: 'rgba(1,165,240,0.28)',
    overflow: 'hidden', backgroundColor: C.white,
  },
  segment:           { flex: 1, paddingVertical: 13, alignItems: 'center' },
  segmentActive:     { backgroundColor: C.skyDeep },
  segmentDisabled:   { opacity: 0.35 },
  segmentText:       { fontFamily: F.medium,  fontSize: 13, color: C.dark },
  segmentTextActive: { fontFamily: F.bold,    fontSize: 13, color: C.white },
  planCaption:       { fontFamily: F.regular, fontSize: 11, color: 'rgba(34,31,32,0.45)', marginTop: 6 },

  // ── Installment card ─────────────────────────────────────────────────────
  installmentCard: {
    backgroundColor: 'rgba(1,165,240,0.07)',
    borderRadius: 14, padding: 16, marginBottom: 14,
    borderWidth: 1.5, borderColor: 'rgba(1,165,240,0.22)',
  },
  installmentTitle: {
    fontFamily: F.bold, fontSize: 11, color: C.skyDeep,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12,
  },
  installmentRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: 'rgba(1,165,240,0.12)',
  },
  installmentLabel:  { fontFamily: F.regular,  fontSize: 13, color: 'rgba(34,31,32,0.65)' },
  installmentAmount: { fontFamily: F.bold,     fontSize: 13, color: C.skyDeep },

  // ── Amount pill ──────────────────────────────────────────────────────────
  amountPill: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: C.yellow, borderRadius: 14,
    paddingHorizontal: 18, paddingVertical: 14, marginBottom: 16,
    shadowColor: C.yellow, shadowOpacity: 0.25, shadowRadius: 8, elevation: 3,
  },
  amountLabel: { fontFamily: F.semibold, fontSize: 13, color: C.dark },
  amountValue: { fontFamily: F.bold,    fontSize: 20, color: C.dark },

  mpesaHint: {
    fontFamily: F.regular, fontSize: 11,
    color: 'rgba(34,31,32,0.45)', marginTop: 5, lineHeight: 15,
  },

  // ── Payment instruction box ───────────────────────────────────────────────
  paymentBox: {
    marginBottom: 18, borderRadius: 14, overflow: 'hidden',
    borderWidth: 1.5, borderColor: 'rgba(225,29,46,0.38)',
  },
  paymentWarnBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(225,29,46,0.10)',
    paddingHorizontal: 14, paddingVertical: 10,
  },
  paymentWarnText: { color: C.red, fontFamily: F.bold, fontSize: 12, letterSpacing: 0.6, flex: 1 },
  paymentBody:     { backgroundColor: C.yellow, paddingHorizontal: 14, paddingVertical: 14, gap: 10 },
  paymentMethod:   {},
  paymentMethodTitle: {
    color: C.red, fontFamily: F.bold, fontSize: 11,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4,
  },
  paymentDetail:  { color: C.red, fontFamily: F.regular, fontSize: 13 },
  paymentBold:    { fontFamily: F.bold },
  paymentDivider: { height: 1, backgroundColor: 'rgba(225,29,46,0.20)', marginVertical: 10 },

  // ── Terms ────────────────────────────────────────────────────────────────
  termsRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 14,
    backgroundColor: 'rgba(1,165,240,0.06)',
    borderRadius: 12, padding: 14,
    borderWidth: 1.5, borderColor: 'rgba(1,165,240,0.18)',
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: 'rgba(1,165,240,0.38)',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 1,
  },
  checkboxChecked: { backgroundColor: C.skyDeep, borderColor: C.skyDeep },
  checkboxError:   { borderColor: C.red },
  termsText: { flex: 1, fontFamily: F.regular, fontSize: 13, color: C.dark, lineHeight: 19 },

  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    paddingHorizontal: 20, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: 'rgba(1,165,240,0.14)',
    backgroundColor: C.white,
  },
  errorBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: 'rgba(225,29,46,0.07)',
    borderRadius: 12, padding: 12, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(225,29,46,0.22)',
  },
  errorBannerText: { flex: 1, fontFamily: F.regular, fontSize: 13, color: C.red, lineHeight: 18 },
  footerCaption: {
    fontFamily: F.regular, fontSize: 12,
    color: 'rgba(34,31,32,0.45)', textAlign: 'center', marginBottom: 10,
  },

  // ── Submit — sky blue ────────────────────────────────────────────────────
  submitBtn: {
    backgroundColor: C.skyDeep,
    paddingVertical: 16, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 6,
    shadowColor: C.skyDeep, shadowOpacity: 0.40, shadowRadius: 14, elevation: 6,
  },
  submitText: { fontFamily: F.bold, fontSize: 15, color: C.white },

  // ── State screens ────────────────────────────────────────────────────────
  centredState: { alignItems: 'center', paddingVertical: 52, paddingHorizontal: 24 },
  pingRing: {
    width: 92, height: 92, borderRadius: 46,
    backgroundColor: 'rgba(1,165,240,0.10)',
    borderWidth: 2.5, borderColor: 'rgba(1,165,240,0.28)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 28,
  },
  stateHeading: { fontFamily: F.bold, fontSize: 22, color: C.dark, marginBottom: 12, textAlign: 'center' },
  stateBody:    { fontFamily: F.regular, fontSize: 15, color: 'rgba(34,31,32,0.60)', textAlign: 'center', lineHeight: 24 },
});
