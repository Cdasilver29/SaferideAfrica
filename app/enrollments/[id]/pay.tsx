// DEPRECATED: enrollment now uses the EnrollModal triggered from anywhere
import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  ActivityIndicator, Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft, AlertTriangle, CheckCircle, Shield, Info, Smartphone, ChevronDown,
} from 'lucide-react-native';
import {
  getEnrollment, submitPayment, submitInstallmentPayment,
  Enrollment, PaymentPlan, InstallmentEntry,
} from '../../../src/api/enrollments';
import { initiateStkPush, waitForPayment, StkStatus } from '../../../src/api/mpesa';
import { splitIntoThree, installmentDueDates } from '../../../src/lib/installments';
import { PAYMENT } from '../../../src/data/saferide';
import { C, F, IS_WEB } from '../../../src/components/landing/constants';
import { useTheme } from '../../../src/lib/theme';

const KSH = (n: number) => 'Ksh ' + n.toLocaleString('en-KE');

const MPESA_CODE_RE = /^[A-Za-z0-9]{10}$/;

type StkState = 'idle' | 'pending' | 'confirmed' | 'failed';

function InfoCard({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  const T = useTheme();
  return (
    <View style={{ backgroundColor: accent ? 'rgba(251,191,36,0.08)' : T.card, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: accent ? 'rgba(251,191,36,0.35)' : T.border }}>
      {children}
    </View>
  );
}

function PaymentRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  const T = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: T.border }}>
      <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 13 }}>{label}</Text>
      <Text style={{ color: T.foreground, fontFamily: bold ? F.bold : F.medium, fontSize: bold ? 16 : 13 }}>{value}</Text>
    </View>
  );
}

function buildPreviewInstallments(total: number): InstallmentEntry[] {
  const [a, b, c]      = splitIntoThree(total);
  const [d0, d30, d60] = installmentDueDates();
  return [
    { number: 1, amount: a, dueAt: d0  },
    { number: 2, amount: b, dueAt: d30 },
    { number: 3, amount: c, dueAt: d60 },
  ];
}

export default function PayScreen() {
  const T = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [enrollment,  setEnrollment]  = useState<Enrollment | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>('full');

  // STK Push state
  const [stkState,  setStkState]  = useState<StkState>('idle');
  const [stkError,  setStkError]  = useState('');

  // Manual fallback state
  const [showManual,  setShowManual]  = useState(false);
  const [mpesaCode,   setMpesaCode]   = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [manualError, setManualError] = useState('');

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getEnrollment(id).then(e => {
      setEnrollment(e);
      if (e?.paymentPlan === 'installments_3') setPaymentPlan('installments_3');
      setLoadingData(false);
    });
  }, [id]);

  // ── STK Push handler ────────────────────────────────────────────────────────
  const handleStkPay = async () => {
    if (!enrollment) return;
    setStkError('');
    setStkState('pending');

    const amount = paymentPlan === 'installments_3'
      ? buildPreviewInstallments(enrollment.totalAmount)[0].amount
      : enrollment.totalAmount;

    try {
      const checkoutRequestId = await initiateStkPush({
        phone:              enrollment.studentPhone,
        amount,
        accountRef:         enrollment.classCode,
        enrollmentId:       enrollment.id,
        installmentNumber:  paymentPlan === 'installments_3' ? 1 : undefined,
      });

      const result = await waitForPayment(checkoutRequestId, (s: StkStatus) => {
        if (s !== 'pending') setStkState(s === 'success' ? 'confirmed' : 'failed');
      });

      if (result.status === 'success') {
        const receipt = result.mpesaReceipt ?? 'MPESA';
        if (paymentPlan === 'installments_3') {
          await submitInstallmentPayment(enrollment.id, 1, receipt);
        } else {
          await submitPayment(enrollment.id, receipt);
        }
        setSuccess(true);
      } else {
        setStkError(result.resultDesc ?? 'Payment not completed. Please try again.');
        setStkState('failed');
      }
    } catch (e: any) {
      setStkError(e?.message ?? 'Could not initiate M-Pesa payment. Please try again.');
      setStkState('failed');
    }
  };

  // ── Manual code handler ─────────────────────────────────────────────────────
  const handleManualPay = async () => {
    if (!enrollment) return;
    setManualError('');
    const code = mpesaCode.trim().toUpperCase();
    if (!MPESA_CODE_RE.test(code)) {
      setManualError('Enter a valid 10-character M-Pesa transaction code.');
      return;
    }
    setSubmitting(true);
    try {
      if (paymentPlan === 'installments_3') {
        await submitInstallmentPayment(enrollment.id, 1, code);
      } else {
        await submitPayment(enrollment.id, code);
      }
      setSuccess(true);
    } catch (e: any) {
      setManualError(e?.message ?? 'Could not submit payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loadingData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: T.background }}>
        <ActivityIndicator color={C.blue} size="large" />
      </View>
    );
  }

  if (!enrollment) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: T.background }}>
        <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 16, textAlign: 'center' }}>Enrollment not found.</Text>
        <TouchableOpacity onPress={() => router.replace('/account')} style={{ marginTop: 20 }}>
          <Text style={{ color: C.blue, fontFamily: F.semibold }}>Back to Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Success state ────────────────────────────────────────────────────────────
  if (success || enrollment.status === 'confirmed') {
    const isInstallment = paymentPlan === 'installments_3';
    return (
      <View style={{ flex: 1, backgroundColor: T.background, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(1,165,240,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <CheckCircle size={36} color={C.skyDeep} />
        </View>
        <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 22, textAlign: 'center', marginBottom: 12 }}>
          {isInstallment ? 'Installment 1 Submitted!' : 'Payment Submitted!'}
        </Text>
        <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 32, maxWidth: 320 }}>
          {isInstallment
            ? 'Your branch admin will confirm installment 1 shortly. Installments 2 and 3 can be tracked on your account page.'
            : "Your branch admin will confirm shortly. You'll receive an email and SMS once confirmed."}
        </Text>
        <TouchableOpacity
          onPress={() => router.replace('/account')}
          style={{ backgroundColor: C.yellow, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 }}
          activeOpacity={0.85}
        >
          <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 15 }}>View My Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const preview    = buildPreviewInstallments(enrollment.totalAmount);
  const payAmount  = paymentPlan === 'installments_3' ? preview[0].amount : enrollment.totalAmount;
  const dispPhone  = enrollment.studentPhone;

  // ── STK Push pending state ───────────────────────────────────────────────────
  if (stkState === 'pending') {
    return (
      <View style={{ flex: 1, backgroundColor: T.background, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <ActivityIndicator size="large" color={C.blue} style={{ marginBottom: 24 }} />
        <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 20, textAlign: 'center', marginBottom: 10 }}>
          Waiting for M-Pesa...
        </Text>
        <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 8, maxWidth: 300 }}>
          A payment prompt of {KSH(payAmount)} was sent to {dispPhone}.
        </Text>
        <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 32, maxWidth: 300 }}>
          Open your M-Pesa app and enter your PIN to complete the payment.
        </Text>
        <TouchableOpacity
          onPress={() => { setStkState('idle'); setShowManual(true); }}
          style={{ paddingVertical: 12, paddingHorizontal: 24 }}
          activeOpacity={0.7}
        >
          <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 14 }}>
            Didn't receive a prompt? Enter code manually
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Main pay screen ──────────────────────────────────────────────────────────
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: T.background }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={IS_WEB ? { maxWidth: 600, width: '100%', alignSelf: 'center', paddingHorizontal: 24 } : { paddingHorizontal: 20 }}>

        {/* Back */}
        <View style={{ paddingTop: Platform.OS === 'ios' ? 56 : 36, marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }} activeOpacity={0.7}>
            <ChevronLeft size={18} color={C.blue} />
            <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 13 }}>Back</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 22, marginBottom: 6 }}>Payment</Text>
        <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 13, marginBottom: 20 }}>
          {enrollment.className} — {KSH(enrollment.totalAmount)}
        </Text>

        {/* ── Segmented control: Full vs Installments ── */}
        <View style={{ flexDirection: 'row', backgroundColor: T.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(34,31,32,0.08)', borderRadius: 12, padding: 4, marginBottom: 20 }}>
          {(['full', 'installments_3'] as PaymentPlan[]).map(plan => {
            const active = paymentPlan === plan;
            return (
              <TouchableOpacity
                key={plan}
                onPress={() => setPaymentPlan(plan)}
                style={{
                  flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center',
                  backgroundColor: active ? T.card : 'transparent',
                  shadowColor: active ? '#000' : 'transparent',
                  shadowOpacity: active ? 0.06 : 0,
                  shadowRadius: active ? 4 : 0,
                  elevation: active ? 2 : 0,
                }}
                activeOpacity={0.8}
              >
                <Text style={{ fontFamily: active ? F.bold : F.medium, fontSize: 13, color: active ? T.foreground : T.mutedForeground }}>
                  {plan === 'full' ? 'Pay in full' : '3 installments'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Installment schedule ── */}
        {paymentPlan === 'installments_3' && (
          <>
            <View style={{ backgroundColor: T.card, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: T.border }}>
              <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 15, marginBottom: 14 }}>Installment Schedule</Text>
              {preview.map((inst, idx) => (
                <View
                  key={inst.number}
                  style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    paddingVertical: 12,
                    borderBottomWidth: idx < preview.length - 1 ? 1 : 0,
                    borderBottomColor: T.border,
                  }}
                >
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ color: inst.number === 1 ? C.blue : T.foreground, fontFamily: F.semibold, fontSize: 14 }}>
                        Installment {inst.number}
                      </Text>
                      {inst.number === 1 && (
                        <View style={{ backgroundColor: 'rgba(1, 165, 240, 0.1)', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 }}>
                          <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 10 }}>Due now</Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 12, marginTop: 3 }}>
                      Due {inst.dueAt}
                    </Text>
                  </View>
                  <Text style={{ color: inst.number === 1 ? C.blue : T.foreground, fontFamily: F.bold, fontSize: 16 }}>
                    {KSH(inst.amount)}
                  </Text>
                </View>
              ))}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: 'rgba(1, 165, 240, 0.06)', borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(1, 165, 240, 0.18)' }}>
              <Info size={15} color={C.blue} style={{ marginTop: 1 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 12, marginBottom: 3 }}>Why pay in installments?</Text>
                <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 12, lineHeight: 18 }}>
                  Spread the cost over three M-Pesa payments. The branch admin will track each.
                </Text>
              </View>
            </View>
          </>
        )}

        {/* STRICTLY NO CASH notice */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(225, 29, 46, 0.08)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(225, 29, 46, 0.25)' }}>
          <AlertTriangle size={16} color={C.red} />
          <Text style={{ color: C.red, fontFamily: F.bold, fontSize: 13, flex: 1 }}>{PAYMENT.notice}</Text>
        </View>

        {/* Paybill reference card */}
        <InfoCard accent>
          <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 15, marginBottom: 14 }}>Lipa Na M-Pesa</Text>
          <PaymentRow label="Paybill Number" value={PAYMENT.mpesaPaybill} bold />
          <PaymentRow label="Account Name"   value={PAYMENT.mpesaAccountName} />
          <PaymentRow label="Amount" value={KSH(payAmount)} bold />
        </InfoCard>

        {/* KCB card — only shown for full payment */}
        {paymentPlan === 'full' && (
          <InfoCard>
            <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 15, marginBottom: 14 }}>{PAYMENT.bankName} Bank Transfer</Text>
            <PaymentRow label="Account Number" value={PAYMENT.kcbAccount} bold />
            <PaymentRow label="Account Name"   value={PAYMENT.mpesaAccountName} />
            <PaymentRow label="Amount"         value={KSH(enrollment.totalAmount)} bold />
          </InfoCard>
        )}

        {/* ── STK Push CTA ─────────────────────────────────────────────────── */}
        <View style={{ backgroundColor: T.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: T.border, marginBottom: 20 }}>
          <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 15, marginBottom: 6 }}>
            {paymentPlan === 'installments_3' ? 'Pay Installment 1' : 'Pay Now'}
          </Text>
          <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 13, marginBottom: 16, lineHeight: 20 }}>
            We'll send a payment prompt to {dispPhone}. Enter your M-Pesa PIN when it arrives.
          </Text>

          {/* STK error banner */}
          {stkState === 'failed' && !!stkError && (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: 'rgba(225, 29, 46, 0.08)', borderWidth: 1, borderColor: 'rgba(225, 29, 46, 0.3)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16 }}>
              <Shield size={14} color={C.red} style={{ marginTop: 1 }} />
              <Text style={{ color: C.red, fontFamily: F.regular, fontSize: 13, flex: 1 }}>{stkError}</Text>
            </View>
          )}

          {/* Primary: STK Push button */}
          <TouchableOpacity
            onPress={handleStkPay}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15, borderRadius: 12, backgroundColor: C.yellow, shadowColor: C.yellow, shadowOpacity: 0.4, shadowRadius: 10, elevation: 4, marginBottom: 12 }}
            activeOpacity={0.85}
          >
            <Smartphone size={18} color={C.dark} />
            <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 15 }}>
              Pay {KSH(payAmount)} via M-Pesa
            </Text>
          </TouchableOpacity>

          {/* Secondary: collapse/expand manual entry */}
          <TouchableOpacity
            onPress={() => setShowManual(v => !v)}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8 }}
            activeOpacity={0.7}
          >
            <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 13 }}>
              I already paid — enter code manually
            </Text>
            <ChevronDown
              size={14}
              color={C.blue}
              style={{ transform: [{ rotate: showManual ? '180deg' : '0deg' }] }}
            />
          </TouchableOpacity>

          {/* Manual entry section */}
          {showManual && (
            <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: T.border }}>
              <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 13, marginBottom: 14, lineHeight: 20 }}>
                {paymentPlan === 'installments_3'
                  ? `Enter your M-Pesa code for installment 1 (${KSH(preview[0].amount)}).`
                  : `After paying via M-Pesa or KCB, enter your 10-character transaction code below.`}
              </Text>

              {!!manualError && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(225, 29, 46, 0.08)', borderWidth: 1, borderColor: 'rgba(225, 29, 46, 0.3)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16 }}>
                  <Shield size={14} color={C.red} />
                  <Text style={{ color: C.red, fontFamily: F.regular, fontSize: 13, flex: 1 }}>{manualError}</Text>
                </View>
              )}

              <Text style={{ color: T.foreground, fontFamily: F.semibold, fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase', marginBottom: 8 }}>
                M-Pesa Transaction Code
              </Text>
              <TextInput
                value={mpesaCode}
                onChangeText={v => setMpesaCode(v.toUpperCase().slice(0, 10))}
                placeholder="e.g. QKR1AB2345"
                placeholderTextColor={T.mutedForeground}
                autoCapitalize="characters"
                maxLength={10}
                style={{ backgroundColor: T.card, borderWidth: 1.5, borderColor: mpesaCode.length === 10 ? C.yellow : T.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, color: T.foreground, fontFamily: F.bold, fontSize: 16, letterSpacing: 2, marginBottom: 14 }}
              />

              <TouchableOpacity
                onPress={handleManualPay}
                disabled={submitting}
                style={{ paddingVertical: 14, borderRadius: 12, alignItems: 'center', backgroundColor: submitting ? C.amberDark : 'rgba(34, 31, 32, 0.08)' }}
                activeOpacity={0.85}
              >
                {submitting
                  ? <ActivityIndicator color={C.dark} size="small" />
                  : <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 14 }}>
                      {paymentPlan === 'installments_3' ? 'Submit Installment 1' : 'Submit Code'}
                    </Text>
                }
              </TouchableOpacity>
            </View>
          )}
        </View>

      </View>
    </ScrollView>
  );
}
