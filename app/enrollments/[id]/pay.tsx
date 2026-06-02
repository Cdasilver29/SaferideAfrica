import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  ActivityIndicator, Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, AlertTriangle, CheckCircle, Shield, Info } from 'lucide-react-native';
import {
  getEnrollment, submitPayment, submitInstallmentPayment,
  Enrollment, PaymentPlan, InstallmentEntry,
} from '../../../src/api/enrollments';
import { splitIntoThree, installmentDueDates } from '../../../src/lib/installments';
import { PAYMENT } from '../../../src/data/saferide';
import { C, F, IS_WEB } from '../../../src/components/landing/constants';

const KSH = (n: number) => 'Ksh ' + n.toLocaleString('en-KE');

const MPESA_CODE_RE = /^[A-Za-z0-9]{10}$/;

function InfoCard({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <View style={{ backgroundColor: accent ? 'rgba(251,191,36,0.08)' : '#ffffff', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: accent ? 'rgba(251,191,36,0.35)' : '#e5e7eb' }}>
      {children}
    </View>
  );
}

function PaymentRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
      <Text style={{ color: C.muted, fontFamily: F.regular, fontSize: 13 }}>{label}</Text>
      <Text style={{ color: C.heading, fontFamily: bold ? F.bold : F.medium, fontSize: bold ? 16 : 13 }}>{value}</Text>
    </View>
  );
}

// Pre-compute the installment schedule for display (before the user submits)
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
  const { id } = useLocalSearchParams<{ id: string }>();

  const [enrollment,  setEnrollment]  = useState<Enrollment | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>('full');
  const [mpesaCode,   setMpesaCode]   = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState(false);

  useEffect(() => {
    getEnrollment(id).then(e => {
      setEnrollment(e);
      // If enrollment was already created with an installment plan, honour it
      if (e?.paymentPlan === 'installments_3') setPaymentPlan('installments_3');
      setLoadingData(false);
    });
  }, [id]);

  const handlePaid = async () => {
    setError('');
    const code = mpesaCode.trim().toUpperCase();
    if (!MPESA_CODE_RE.test(code)) {
      setError('Enter a valid 10-character M-Pesa transaction code (letters and digits only).');
      return;
    }
    setSubmitting(true);
    try {
      if (paymentPlan === 'installments_3') {
        await submitInstallmentPayment(id, 1, code);
      } else {
        await submitPayment(id, code);
      }
      setSuccess(true);
    } catch (e: any) {
      setError(e?.message ?? 'Could not submit payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loadingData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator color={C.blue} size="large" />
      </View>
    );
  }

  if (!enrollment) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Text style={{ color: C.heading, fontFamily: F.bold, fontSize: 16, textAlign: 'center' }}>Enrollment not found.</Text>
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
      <View style={{ flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(34,197,94,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <CheckCircle size={36} color="#16a34a" />
        </View>
        <Text style={{ color: C.heading, fontFamily: F.bold, fontSize: 22, textAlign: 'center', marginBottom: 12 }}>
          {isInstallment ? 'Installment 1 Submitted!' : 'Payment Submitted!'}
        </Text>
        <Text style={{ color: C.muted, fontFamily: F.regular, fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 32, maxWidth: 320 }}>
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

  // ── Pre-compute installment preview ─────────────────────────────────────────
  const preview = buildPreviewInstallments(enrollment.totalAmount);

  // ── Main pay screen ──────────────────────────────────────────────────────────
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f8fafc' }}
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

        <Text style={{ color: C.heading, fontFamily: F.bold, fontSize: 22, marginBottom: 6 }}>Payment Instructions</Text>
        <Text style={{ color: C.muted, fontFamily: F.regular, fontSize: 13, marginBottom: 20 }}>
          {enrollment.className} — {KSH(enrollment.totalAmount)}
        </Text>

        {/* ── Segmented control: Full vs Installments ── */}
        <View style={{ flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 12, padding: 4, marginBottom: 20 }}>
          {(['full', 'installments_3'] as PaymentPlan[]).map(plan => {
            const active = paymentPlan === plan;
            return (
              <TouchableOpacity
                key={plan}
                onPress={() => setPaymentPlan(plan)}
                style={{
                  flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center',
                  backgroundColor: active ? '#ffffff' : 'transparent',
                  shadowColor: active ? '#000' : 'transparent',
                  shadowOpacity: active ? 0.06 : 0,
                  shadowRadius: active ? 4 : 0,
                  elevation: active ? 2 : 0,
                }}
                activeOpacity={0.8}
              >
                <Text style={{ fontFamily: active ? F.bold : F.medium, fontSize: 13, color: active ? C.heading : C.muted }}>
                  {plan === 'full' ? 'Pay in full' : '3 installments'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Installment schedule (shown only when plan = installments_3) ── */}
        {paymentPlan === 'installments_3' && (
          <>
            <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' }}>
              <Text style={{ color: C.heading, fontFamily: F.bold, fontSize: 15, marginBottom: 14 }}>Installment Schedule</Text>
              {preview.map((inst, idx) => (
                <View
                  key={inst.number}
                  style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    paddingVertical: 12,
                    borderBottomWidth: idx < preview.length - 1 ? 1 : 0,
                    borderBottomColor: '#f1f5f9',
                  }}
                >
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ color: inst.number === 1 ? C.blue : C.heading, fontFamily: F.semibold, fontSize: 14 }}>
                        Installment {inst.number}
                      </Text>
                      {inst.number === 1 && (
                        <View style={{ backgroundColor: 'rgba(14,165,233,0.1)', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 }}>
                          <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 10 }}>Due now</Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ color: C.muted, fontFamily: F.regular, fontSize: 12, marginTop: 3 }}>
                      Due {inst.dueAt}
                    </Text>
                  </View>
                  <Text style={{ color: inst.number === 1 ? C.blue : C.heading, fontFamily: F.bold, fontSize: 16 }}>
                    {KSH(inst.amount)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Why installments disclosure */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: 'rgba(14,165,233,0.06)', borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(14,165,233,0.18)' }}>
              <Info size={15} color={C.blue} style={{ marginTop: 1 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 12, marginBottom: 3 }}>Why pay in installments?</Text>
                <Text style={{ color: C.muted, fontFamily: F.regular, fontSize: 12, lineHeight: 18 }}>
                  Spread the cost over three M-Pesa payments. The branch admin will track each.
                </Text>
              </View>
            </View>
          </>
        )}

        {/* STRICTLY NO CASH notice */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)' }}>
          <AlertTriangle size={16} color="#dc2626" />
          <Text style={{ color: '#dc2626', fontFamily: F.bold, fontSize: 13, flex: 1 }}>{PAYMENT.notice}</Text>
        </View>

        {/* M-Pesa card — amount reflects plan */}
        <InfoCard accent>
          <Text style={{ color: C.heading, fontFamily: F.bold, fontSize: 15, marginBottom: 14 }}>Lipa Na M-Pesa</Text>
          <PaymentRow label="Paybill Number" value={PAYMENT.mpesaPaybill} bold />
          <PaymentRow label="Account Name"   value={PAYMENT.mpesaAccountName} />
          <PaymentRow
            label="Amount"
            value={paymentPlan === 'installments_3' ? KSH(preview[0].amount) : KSH(enrollment.totalAmount)}
            bold
          />
        </InfoCard>

        {/* KCB card — only shown for full payment */}
        {paymentPlan === 'full' && (
          <InfoCard>
            <Text style={{ color: C.heading, fontFamily: F.bold, fontSize: 15, marginBottom: 14 }}>{PAYMENT.bankName} Bank Transfer</Text>
            <PaymentRow label="Account Number" value={PAYMENT.kcbAccount} bold />
            <PaymentRow label="Account Name"   value={PAYMENT.mpesaAccountName} />
            <PaymentRow label="Amount"         value={KSH(enrollment.totalAmount)} bold />
          </InfoCard>
        )}

        {/* Transaction code input */}
        <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 20 }}>
          <Text style={{ color: C.heading, fontFamily: F.bold, fontSize: 15, marginBottom: 6 }}>Confirm Your Payment</Text>

          {paymentPlan === 'installments_3' ? (
            <Text style={{ color: C.muted, fontFamily: F.regular, fontSize: 13, marginBottom: 16, lineHeight: 20 }}>
              You're paying installment 1 of 3 ({KSH(preview[0].amount)}). The next two installments will be due on {preview[1].dueAt} and {preview[2].dueAt}.
            </Text>
          ) : (
            <Text style={{ color: C.muted, fontFamily: F.regular, fontSize: 13, marginBottom: 16 }}>
              After paying via M-Pesa, enter your 10-character transaction code below.
            </Text>
          )}

          {!!error && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(239,68,68,0.08)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16 }}>
              <Shield size={14} color="#ef4444" />
              <Text style={{ color: '#ef4444', fontFamily: F.regular, fontSize: 13, flex: 1 }}>{error}</Text>
            </View>
          )}

          <Text style={{ color: '#374151', fontFamily: F.semibold, fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase', marginBottom: 8 }}>
            M-Pesa Transaction Code
          </Text>
          <TextInput
            value={mpesaCode}
            onChangeText={v => setMpesaCode(v.toUpperCase().slice(0, 10))}
            placeholder="e.g. QKR1AB2345"
            placeholderTextColor={C.mutedDark}
            autoCapitalize="characters"
            maxLength={10}
            style={{ backgroundColor: '#f9fafb', borderWidth: 1.5, borderColor: mpesaCode.length === 10 ? C.yellow : C.darkBorder, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, color: C.heading, fontFamily: F.bold, fontSize: 16, letterSpacing: 2, marginBottom: 20 }}
          />

          <TouchableOpacity
            onPress={handlePaid}
            disabled={submitting}
            style={{ paddingVertical: 15, borderRadius: 12, alignItems: 'center', backgroundColor: submitting ? C.amberDark : C.yellow, shadowColor: C.yellow, shadowOpacity: 0.4, shadowRadius: 10, elevation: 4 }}
            activeOpacity={0.85}
          >
            {submitting
              ? <ActivityIndicator color={C.dark} size="small" />
              : <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 15 }}>
                  {paymentPlan === 'installments_3' ? 'Submit Installment 1' : 'I Have Paid'}
                </Text>
            }
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}
