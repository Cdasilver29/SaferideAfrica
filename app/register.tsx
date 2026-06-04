import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Image, ActivityIndicator,
  Modal, FlatList, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, ChevronDown, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react-native';
import { useAuth } from '../src/context/AuthContext';
import { BRANCHES } from '../src/data/saferide';
import { C, F, IS_WEB } from '../src/components/landing/constants';

const LOGO   = require('../assets/images/saferide-logo.jpg');
const BG_SRC = IS_WEB
  ? { uri: '/DSC_2116.webp' }
  : require('../assets/images/car-pic.png');
const { height: SCREEN_H } = Dimensions.get('window');

// ─── Kenyan phone validation ──────────────────────────────────────────────────
function isKenyanPhone(v: string) {
  return /^(\+2547\d{8}|07\d{8}|\+2541\d{8}|01\d{8})$/.test(v.replace(/\s/g, ''));
}

// ─── Branch picker modal ──────────────────────────────────────────────────────
function BranchPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = (BRANCHES as readonly typeof BRANCHES[number][]).find(b => b.id === value);

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
        style={{
          flexDirection: 'row', alignItems: 'center',
          backgroundColor: '#ffffff',
          borderWidth: 1.5, borderColor: value ? C.yellow : C.darkBorder,
          borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14,
        }}
      >
        <Text style={{ flex: 1, color: selected ? C.heading : C.mutedDark, fontFamily: F.regular, fontSize: 14 }}>
          {selected ? selected.name + (selected.isHQ ? ' (HQ)' : '') : 'Select your branch'}
        </Text>
        <ChevronDown size={16} color={C.mutedDark} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 }} activeOpacity={1} onPress={() => setOpen(false)}>
          <TouchableOpacity activeOpacity={1}>
            <View style={{ backgroundColor: '#ffffff', borderRadius: 20, overflow: 'hidden', maxHeight: SCREEN_H * 0.65 }}>
              <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(34, 31, 32, 0.06)' }}>
                <Text style={{ color: C.heading, fontFamily: F.bold, fontSize: 16 }}>Select Branch</Text>
              </View>
              <FlatList
                data={BRANCHES as readonly typeof BRANCHES[number][]}
                keyExtractor={b => b.id}
                renderItem={({ item: b }) => (
                  <TouchableOpacity
                    onPress={() => { onChange(b.id); setOpen(false); }}
                    style={{
                      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                      paddingHorizontal: 20, paddingVertical: 14,
                      backgroundColor: b.id === value ? 'rgba(88, 204, 247, 0.08)' : 'transparent',
                      borderBottomWidth: 1, borderBottomColor: 'rgba(34, 31, 32, 0.04)',
                    }}
                    activeOpacity={0.7}
                  >
                    <View>
                      <Text style={{ color: b.id === value ? C.blue : C.heading, fontFamily: b.id === value ? F.semibold : F.regular, fontSize: 14 }}>
                        {b.name}
                      </Text>
                      {b.isHQ && (
                        <Text style={{ color: C.yellow, fontFamily: F.semibold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 1 }}>Headquarters</Text>
                      )}
                    </View>
                    {b.id === value && <CheckCircle size={16} color={C.blue} />}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: C.dark, fontFamily: F.semibold, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 }}>
        {label}
      </Text>
      {children}
    </View>
  );
}

function Input({
  value, onChange, placeholder, keyboardType = 'default',
  autoCapitalize = 'none', secureTextEntry = false, editable = true,
  filled,
}: {
  value: string; onChange: (v: string) => void; placeholder: string;
  keyboardType?: any; autoCapitalize?: any; secureTextEntry?: boolean;
  editable?: boolean; filled: boolean;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={C.mutedDark}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      secureTextEntry={secureTextEntry}
      editable={editable}
      style={{
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderColor: filled ? C.yellow : C.darkBorder,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
        color: C.heading,
        fontFamily: F.regular,
        fontSize: 14,
      }}
    />
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function RegisterScreen() {
  const { signUp } = useAuth();

  const [name,            setName]            = useState('');
  const [email,           setEmail]           = useState('');
  const [phone,           setPhone]           = useState('');
  const [idNumber,        setIdNumber]        = useState('');
  const [branchId,        setBranchId]        = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd,         setShowPwd]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [isLoading,       setIsLoading]       = useState(false);
  const [error,           setError]           = useState('');

  const validate = (): string | null => {
    if (!name.trim())        return 'Full name is required.';
    if (!email.trim())       return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
    if (!phone.trim())       return 'Phone number is required.';
    if (!isKenyanPhone(phone)) return 'Enter a valid Kenyan phone number (e.g. 0712 045 710).';
    if (!idNumber.trim())    return 'ID / Passport number is required.';
    if (!branchId)           return 'Please select your branch.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async () => {
    setError('');
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setIsLoading(true);
    try {
      await signUp({ name, email, phone, idNumber, branchId, password });
      router.replace('/account');
    } catch (e: any) {
      setError(e?.message ?? 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{ flex: 1, minHeight: SCREEN_H }}>

        {/* Background */}
        <Image source={BG_SRC} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} resizeMode="cover" />
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,18,36,0.82)' }} />

        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', top: IS_WEB ? 28 : 52, left: 20, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' }} activeOpacity={0.8}>
          <ChevronLeft size={20} color="#ffffff" />
        </TouchableOpacity>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20, paddingVertical: 72 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ width: '100%', maxWidth: IS_WEB ? 520 : undefined, borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 32, elevation: 16 }}>

            {/* Header */}
            <View style={{ backgroundColor: C.dark, paddingHorizontal: 32, paddingVertical: 28, alignItems: 'center' }}>
              <Image source={LOGO} style={{ width: 64, height: 64, borderRadius: 14, marginBottom: 12 }} resizeMode="contain" />
              <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 20, letterSpacing: 0.4 }}>Create Account</Text>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontFamily: F.regular, fontSize: 13, marginTop: 4 }}>SafeRide Africa Student Registration</Text>
            </View>

            {/* Form body */}
            <View style={{ backgroundColor: '#ffffff', paddingHorizontal: 28, paddingVertical: 28 }}>

              {!!error && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(225, 29, 46, 0.08)', borderWidth: 1, borderColor: 'rgba(225, 29, 46, 0.35)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 20 }}>
                  <Shield size={14} color={C.red} />
                  <Text style={{ color: C.red, fontFamily: F.regular, fontSize: 13, flex: 1 }}>{error}</Text>
                </View>
              )}

              <Field label="Full Name">
                <Input value={name} onChange={setName} placeholder="e.g. Grace Wanjiru" autoCapitalize="words" filled={!!name} />
              </Field>

              <Field label="Email Address">
                <Input value={email} onChange={setEmail} placeholder="you@example.com" keyboardType="email-address" filled={!!email} />
              </Field>

              <Field label="Phone Number">
                <Input value={phone} onChange={setPhone} placeholder="0712 045 710" keyboardType="phone-pad" filled={!!phone} />
              </Field>

              <Field label="ID / Passport Number">
                <Input value={idNumber} onChange={setIdNumber} placeholder="National ID or Passport" autoCapitalize="characters" filled={!!idNumber} />
              </Field>

              <Field label="Nearest Branch">
                <BranchPicker value={branchId} onChange={setBranchId} />
              </Field>

              <Field label="Password">
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: password ? C.yellow : C.darkBorder, borderRadius: 12, paddingHorizontal: 14 }}>
                  <TextInput
                    value={password} onChangeText={setPassword}
                    placeholder="At least 8 characters"
                    placeholderTextColor={C.mutedDark}
                    secureTextEntry={!showPwd}
                    style={{ flex: 1, paddingVertical: 14, color: C.heading, fontFamily: F.regular, fontSize: 14 }}
                  />
                  <TouchableOpacity onPress={() => setShowPwd(v => !v)} style={{ padding: 4 }}>
                    {showPwd ? <EyeOff size={16} color={C.mutedDark} /> : <Eye size={16} color={C.mutedDark} />}
                  </TouchableOpacity>
                </View>
              </Field>

              <Field label="Confirm Password">
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: confirmPassword ? C.yellow : C.darkBorder, borderRadius: 12, paddingHorizontal: 14 }}>
                  <TextInput
                    value={confirmPassword} onChangeText={setConfirmPassword}
                    placeholder="Repeat your password"
                    placeholderTextColor={C.mutedDark}
                    secureTextEntry={!showConfirm}
                    style={{ flex: 1, paddingVertical: 14, color: C.heading, fontFamily: F.regular, fontSize: 14 }}
                  />
                  <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={{ padding: 4 }}>
                    {showConfirm ? <EyeOff size={16} color={C.mutedDark} /> : <Eye size={16} color={C.mutedDark} />}
                  </TouchableOpacity>
                </View>
              </Field>

              {/* Submit */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isLoading}
                style={{ width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: isLoading ? C.amberDark : C.yellow, shadowColor: C.yellow, shadowOpacity: 0.4, shadowRadius: 12, elevation: 5, marginTop: 4 }}
                activeOpacity={0.85}
              >
                {isLoading
                  ? <ActivityIndicator color={C.dark} size="small" />
                  : <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 15 }}>Create Account</Text>
                }
              </TouchableOpacity>

              {/* Sign in link */}
              <TouchableOpacity onPress={() => router.replace('/login')} style={{ marginTop: 20, alignItems: 'center' }} activeOpacity={0.7}>
                <Text style={{ color: C.muted, fontFamily: F.regular, fontSize: 13 }}>
                  Already have an account?{' '}
                  <Text style={{ color: C.blue, fontFamily: F.semibold }}>Sign In</Text>
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
