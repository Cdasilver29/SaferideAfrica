// DEPRECATED: enrollment now uses the EnrollModal triggered from anywhere
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  ActivityIndicator, Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Shield, ArrowRight } from 'lucide-react-native';
import { useAuth } from '../../../src/context/AuthContext';
import { createEnrollment } from '../../../src/api/enrollments';
import { CLASSES, BRANCHES } from '../../../src/data/saferide';
import { C, F, IS_WEB, MAX_W } from '../../../src/components/landing/constants';
import { useTheme } from '../../../src/lib/theme';

const KSH = (n: number) => (n === 0 ? '—' : 'Ksh ' + n.toLocaleString('en-KE'));

function BreakdownRow({ label, value }: { label: string; value: number }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.10)' }}>
      <Text style={{ color: 'rgba(255,255,255,0.65)', fontFamily: F.regular, fontSize: 13 }}>{label}</Text>
      <Text style={{ color: '#ffffff', fontFamily: F.medium, fontSize: 13 }}>{KSH(value)}</Text>
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const T = useTheme();
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: T.foreground, fontFamily: F.semibold, fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase', marginBottom: 8 }}>{label}</Text>
      {children}
    </View>
  );
}

export default function EnrolScreen() {
  const T = useTheme();
  const { code }              = useLocalSearchParams<{ code: string }>();
  const { user, loading: authLoading } = useAuth();
  const cls                   = CLASSES.find(c => c.code === code);

  if (authLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: T.background }}><ActivityIndicator color={C.blue} size="large" /></View>;
  }
  if (!user) { router.replace('/classes'); return null; }
  if (!cls)  { router.replace('/classes'); return null; }

  const branch = (BRANCHES as readonly typeof BRANCHES[number][]).find(b => b.id === user.branchId);

  const [name,      setName]      = useState(user.name);
  const [email,     setEmail]     = useState(user.email);
  const [phone,     setPhone]     = useState(user.phone);
  const [idNumber,  setIdNumber]  = useState(user.idNumber);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!name.trim() || !email.trim() || !phone.trim() || !idNumber.trim()) {
      setError('All fields are required.');
      return;
    }
    setIsLoading(true);
    try {
      const enrollment = await createEnrollment({
        userId:          user.id,
        branchId:        user.branchId,
        classCode:       cls.code,
        className:       cls.name,
        totalAmount:     cls.total,
        studentName:     name.trim(),
        studentEmail:    email.trim().toLowerCase(),
        studentPhone:    phone.trim(),
        studentIdNumber: idNumber.trim(),
      });
      router.replace(`/enrollments/${enrollment.id}/pay`);
    } catch (e: any) {
      setError(e?.message ?? 'Could not submit enrollment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: T.background }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 48 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={IS_WEB ? { maxWidth: 600, width: '100%', alignSelf: 'center', paddingHorizontal: 24 } : { paddingHorizontal: 20 }}>

        {/* Back */}
        <View style={{ paddingTop: Platform.OS === 'ios' ? 56 : 36, marginBottom: 24, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }} activeOpacity={0.7}>
            <ChevronLeft size={18} color={C.blue} />
            <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 13 }}>Back</Text>
          </TouchableOpacity>
        </View>

        {/* Class summary card */}
        <View style={{ backgroundColor: C.dark, borderRadius: 20, padding: 22, marginBottom: 24 }}>
          <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>Enrolling in</Text>
          <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 20, marginBottom: 16 }}>{cls.name}</Text>

          <BreakdownRow label="School Fees" value={cls.fees} />
          <BreakdownRow label="PDL"         value={cls.pdl} />
          <BreakdownRow label="Exams"       value={cls.exams} />
          <BreakdownRow label="Defensive"   value={cls.defensive} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)' }}>
            <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 15 }}>Total</Text>
            <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 22 }}>{KSH(cls.total)}</Text>
          </View>

          {cls.lessons !== null && (
            <Text style={{ color: 'rgba(255,255,255,0.55)', fontFamily: F.regular, fontSize: 12, marginTop: 8 }}>
              {cls.lessons} practical lessons included
            </Text>
          )}

          {branch && (
            <Text style={{ color: 'rgba(255,255,255,0.55)', fontFamily: F.regular, fontSize: 12, marginTop: 4 }}>
              Branch: {branch.name}
            </Text>
          )}
        </View>

        {/* Enrollment form */}
        <View style={{ backgroundColor: T.card, borderRadius: 20, padding: 22, borderWidth: 1, borderColor: T.border }}>
          <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 16, marginBottom: 20 }}>Your Details</Text>

          {!!error && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(225,29,46,0.08)', borderWidth: 1, borderColor: 'rgba(225,29,46,0.3)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 20 }}>
              <Shield size={14} color={C.red} />
              <Text style={{ color: C.red, fontFamily: F.regular, fontSize: 13, flex: 1 }}>{error}</Text>
            </View>
          )}

          <Field label="Full Name">
            <TextInput value={name} onChangeText={setName} placeholder="Your full name" placeholderTextColor={T.mutedForeground} autoCapitalize="words"
              style={{ backgroundColor: T.background, borderWidth: 1.5, borderColor: T.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, color: T.foreground, fontFamily: F.regular, fontSize: 14 }} />
          </Field>

          <Field label="Email Address">
            <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={T.mutedForeground} keyboardType="email-address" autoCapitalize="none"
              style={{ backgroundColor: T.background, borderWidth: 1.5, borderColor: T.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, color: T.foreground, fontFamily: F.regular, fontSize: 14 }} />
          </Field>

          <Field label="Phone Number">
            <TextInput value={phone} onChangeText={setPhone} placeholder="0712 045 710" placeholderTextColor={T.mutedForeground} keyboardType="phone-pad"
              style={{ backgroundColor: T.background, borderWidth: 1.5, borderColor: T.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, color: T.foreground, fontFamily: F.regular, fontSize: 14 }} />
          </Field>

          <Field label="ID / Passport Number">
            <TextInput value={idNumber} onChangeText={setIdNumber} placeholder="National ID or Passport" placeholderTextColor={T.mutedForeground} autoCapitalize="characters"
              style={{ backgroundColor: T.background, borderWidth: 1.5, borderColor: T.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, color: T.foreground, fontFamily: F.regular, fontSize: 14 }} />
          </Field>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            style={{ paddingVertical: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: isLoading ? C.amberDark : C.yellow, shadowColor: C.yellow, shadowOpacity: 0.4, shadowRadius: 10, elevation: 4, marginTop: 8 }}
            activeOpacity={0.85}
          >
            {isLoading
              ? <ActivityIndicator color={C.dark} size="small" />
              : <>
                  <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 15 }}>Confirm Enrollment</Text>
                  <ArrowRight size={16} color={C.dark} />
                </>
            }
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}
