import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator, Image, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Mail, Lock, ArrowRight, Shield, Eye, EyeOff, ChevronLeft } from 'lucide-react-native';
import { C, F, IS_WEB } from '@/components/landing/constants';
import { useAuth } from '@/context/AuthContext';

const LOGO = require('../../assets/images/saferide-logo.png');

const { height: SCREEN_H } = Dimensions.get('window');

const BG_SRC = IS_WEB
  ? { uri: '/DSC_2116.jpg' }
  : require('../../assets/images/car-pic.png');

const LoginForm: React.FC = () => {
  const { signIn }                      = useAuth();
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/account');
    } catch (e: any) {
      setError(e?.message ?? 'Sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const borderColor = (filled: boolean) => (filled ? C.yellow : C.darkBorder);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1, minHeight: SCREEN_H }}>

        {/* Background */}
        <Image
          source={BG_SRC}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,18,36,0.82)' }} />

        {/* Back arrow */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            position: 'absolute', top: IS_WEB ? 28 : 52, left: 20, zIndex: 10,
            backgroundColor: 'rgba(255,255,255,0.10)',
            borderRadius: 10, padding: 10,
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
          }}
          activeOpacity={0.8}
        >
          <ChevronLeft size={20} color="#ffffff" />
        </TouchableOpacity>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20, paddingVertical: 56 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              width: '100%',
              maxWidth: IS_WEB ? 460 : undefined,
              borderRadius: 24,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOpacity: 0.5,
              shadowRadius: 32,
              elevation: 16,
            }}
          >

            {/* Card header */}
            <View style={{ backgroundColor: C.dark, paddingHorizontal: 32, paddingVertical: 36, alignItems: 'center' }}>
              <Image
                source={LOGO}
                style={{ width: 80, height: 80, borderRadius: 16, marginBottom: 14 }}
                resizeMode="contain"
              />
              <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 22, letterSpacing: 0.4 }}>
                SafeRide Africa
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.65)', fontFamily: F.regular, fontSize: 13, marginTop: 4 }}>
                Sign in to your account
              </Text>
            </View>

            {/* Card body */}
            <View style={{ backgroundColor: '#ffffff', paddingHorizontal: 32, paddingVertical: 30 }}>

              {/* Error */}
              {!!error && (
                <View
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 8,
                    backgroundColor: 'rgba(239,68,68,0.08)',
                    borderWidth: 1, borderColor: 'rgba(239,68,68,0.35)',
                    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
                    marginBottom: 20,
                  }}
                >
                  <Shield size={14} color="#ef4444" />
                  <Text style={{ color: '#ef4444', fontFamily: F.regular, fontSize: 13, flex: 1 }}>{error}</Text>
                </View>
              )}

              {/* Email */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ color: C.dark, fontFamily: F.semibold, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 }}>
                  Email Address
                </Text>
                <View
                  style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: '#f9fafb',
                    borderWidth: 1.5, borderColor: borderColor(!!email),
                    borderRadius: 12, paddingHorizontal: 14,
                  }}
                >
                  <Mail size={16} color={email ? C.blue : C.mutedDark} />
                  <TextInput
                    style={{ flex: 1, paddingVertical: 14, paddingHorizontal: 10, color: C.heading, fontFamily: F.regular, fontSize: 14 }}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    placeholder="Enter your email"
                    placeholderTextColor={C.mutedDark}
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={{ marginBottom: 28 }}>
                <Text style={{ color: C.dark, fontFamily: F.semibold, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 }}>
                  Password
                </Text>
                <View
                  style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: '#f9fafb',
                    borderWidth: 1.5, borderColor: borderColor(!!password),
                    borderRadius: 12, paddingHorizontal: 14,
                  }}
                >
                  <Lock size={16} color={password ? C.blue : C.mutedDark} />
                  <TextInput
                    style={{ flex: 1, paddingVertical: 14, paddingHorizontal: 10, color: C.heading, fontFamily: F.regular, fontSize: 14 }}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholder="Enter your password"
                    placeholderTextColor={C.mutedDark}
                    editable={!isLoading}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(s => !s)} style={{ padding: 4 }}>
                    {showPassword
                      ? <EyeOff size={16} color={C.mutedDark} />
                      : <Eye    size={16} color={C.mutedDark} />}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isLoading}
                style={{
                  width: '100%', paddingVertical: 16,
                  borderRadius: 12, alignItems: 'center',
                  flexDirection: 'row', justifyContent: 'center', gap: 8,
                  backgroundColor: isLoading ? C.amberDark : C.yellow,
                  shadowColor: C.yellow, shadowOpacity: 0.4, shadowRadius: 12, elevation: 5,
                }}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color={C.dark} size="small" />
                ) : (
                  <>
                    <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 15 }}>Sign In</Text>
                    <ArrowRight size={18} color={C.dark} />
                  </>
                )}
              </TouchableOpacity>

              {/* Register link */}
              <TouchableOpacity onPress={() => router.push('/register')} style={{ marginTop: 20, alignItems: 'center' }} activeOpacity={0.7}>
                <Text style={{ color: C.muted, fontFamily: F.regular, fontSize: 13 }}>
                  Don't have an account?{' '}
                  <Text style={{ color: C.blue, fontFamily: F.semibold }}>Register</Text>
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginForm;
