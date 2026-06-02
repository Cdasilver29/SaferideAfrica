import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  RefreshControl, Platform,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { LogOut, BookOpen, ChevronRight, User, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Shield, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { listMyEnrollments, Enrollment, EnrollmentStatus } from '../../src/api/enrollments';
import { BRANCHES } from '../../src/data/saferide';
import { C, F, IS_WEB, MAX_W } from '../../src/components/landing/constants';
import { useTheme } from '../../src/lib/theme';

const KSH = (n: number) => 'Ksh ' + n.toLocaleString('en-KE');

const STATUS_CONFIG: Record<EnrollmentStatus, { label: string; color: string; bg: string; Icon: any }> = {
  pending_payment:   { label: 'Pending Payment',   color: '#d97706', bg: 'rgba(251,191,36,0.12)',  Icon: Clock      },
  payment_submitted: { label: 'Payment Submitted', color: C.blue,   bg: 'rgba(14,165,233,0.12)',  Icon: AlertCircle },
  confirmed:         { label: 'Confirmed',         color: '#16a34a', bg: 'rgba(34,197,94,0.12)',   Icon: CheckCircle },
  cancelled:         { label: 'Cancelled',         color: '#dc2626', bg: 'rgba(239,68,68,0.12)',   Icon: XCircle    },
};

function StatusBadge({ status }: { status: EnrollmentStatus }) {
  const { label, color, bg, Icon } = STATUS_CONFIG[status];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
      <Icon size={11} color={color} />
      <Text style={{ color, fontFamily: F.semibold, fontSize: 11 }}>{label}</Text>
    </View>
  );
}

function EnrollmentRow({ e }: { e: Enrollment }) {
  const T = useTheme();
  const isPending = e.status === 'pending_payment';

  const paidCount = e.installments?.filter(i => i.paidAt).length ?? 0;
  const showInstallmentProgress =
    e.paymentPlan === 'installments_3' &&
    !!e.installments &&
    e.status !== 'pending_payment';

  return (
    <TouchableOpacity
      onPress={() => isPending ? router.push(`/enrollments/${e.id}/pay`) : undefined}
      activeOpacity={isPending ? 0.8 : 1}
      style={{ backgroundColor: T.card, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: T.border, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <Text style={{ color: T.foreground, fontFamily: F.semibold, fontSize: 14, flex: 1, marginRight: 8 }}>{e.className}</Text>
        <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 14 }}>{KSH(e.totalAmount)}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <StatusBadge status={e.status} />
        {isPending && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 12 }}>Pay Now</Text>
            <ChevronRight size={13} color={C.blue} />
          </View>
        )}
      </View>
      {showInstallmentProgress && (
        <Text style={{ color: C.muted, fontFamily: F.regular, fontSize: 12, marginTop: 8 }}>
          Installment {paidCount} of 3 submitted · {3 - paidCount} remaining
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default function AccountScreen() {
  const T = useTheme();
  const { user, loading: authLoading, signOut, switchRole } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [signingOut,  setSigningOut]  = useState(false);

  // Hooks must all be declared before any conditional return.
  const load = useCallback(async () => {
    if (!user) return;
    try {
      const list = await listMyEnrollments(user.id);
      setEnrollments(list);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useFocusEffect(useCallback(() => { setLoading(true); load(); }, [load]));

  if (authLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: T.background }}><ActivityIndicator color={C.blue} size="large" /></View>;
  }

  if (!user) {
    router.replace('/login');
    return null;
  }

  const branch = (BRANCHES as readonly typeof BRANCHES[number][]).find(b => b.id === user.branchId);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    router.replace('/');
  };

  const handleSwitchToAdmin = async () => {
    await switchRole('branch_admin');
    router.replace('/admin');
  };

  const handleSwitchToStudent = async () => {
    await switchRole('student');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: T.background }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 48 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
    >
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center', paddingHorizontal: 24 } : { paddingHorizontal: 20 }}>

        {/* Header bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 24 }}>
          <TouchableOpacity onPress={() => router.replace('/')} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.7}>
            <ArrowLeft size={14} color={C.blue} />
            <Text style={{ color: C.blue, fontFamily: F.semibold, fontSize: 13 }}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignOut}
            disabled={signingOut}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(239,68,68,0.08)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 }}
            activeOpacity={0.8}
          >
            {signingOut ? <ActivityIndicator size="small" color="#dc2626" /> : <LogOut size={14} color="#dc2626" />}
            <Text style={{ color: '#dc2626', fontFamily: F.semibold, fontSize: 13 }}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Profile card */}
        <View style={{ backgroundColor: C.darkBg, borderRadius: 20, padding: 24, marginBottom: 24 }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <User size={26} color={C.dark} />
          </View>
          <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 20, marginBottom: 4 }}>{user.name}</Text>
          <Text style={{ color: C.mutedDark, fontFamily: F.regular, fontSize: 13, marginBottom: 12 }}>{user.email}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MapPin size={13} color={C.yellow} />
            <Text style={{ color: C.mutedDark, fontFamily: F.regular, fontSize: 13 }}>
              {branch ? branch.name : user.branchId} branch
            </Text>
          </View>
          {user.role === 'branch_admin' && (
            <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(251,191,36,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start' }}>
              <Shield size={12} color={C.yellow} />
              <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>Branch Admin</Text>
            </View>
          )}
        </View>

        {/* Quick actions */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 28 }}>
          <TouchableOpacity
            onPress={() => router.push('/classes')}
            style={{ flex: 1, backgroundColor: C.yellow, paddingVertical: 14, borderRadius: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
            activeOpacity={0.85}
          >
            <BookOpen size={16} color={C.dark} />
            <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 14 }}>Browse Classes</Text>
          </TouchableOpacity>

          {user.role === 'branch_admin' && (
            <TouchableOpacity
              onPress={() => router.push('/admin')}
              style={{ flex: 1, backgroundColor: C.blue, paddingVertical: 14, borderRadius: 14, alignItems: 'center' }}
              activeOpacity={0.85}
            >
              <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 14 }}>Admin View</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* My Enrollments */}
        <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 18, marginBottom: 16 }}>My Enrollments</Text>

        {loading ? (
          <ActivityIndicator color={C.blue} style={{ marginTop: 32 }} />
        ) : enrollments.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <BookOpen size={40} color={T.border} />
            <Text style={{ color: T.mutedForeground, fontFamily: F.semibold, fontSize: 15, marginTop: 16 }}>No enrollments yet</Text>
            <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 13, marginTop: 6, textAlign: 'center' }}>
              Browse our courses and enrol to get started.
            </Text>
            <TouchableOpacity onPress={() => router.push('/classes')} style={{ marginTop: 20, backgroundColor: C.yellow, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 12 }} activeOpacity={0.85}>
              <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 14 }}>Browse Classes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          enrollments.map(e => <EnrollmentRow key={e.id} e={e} />)
        )}

        {/* DEV-ONLY role switcher */}
        {__DEV__ && (
          <View style={{ marginTop: 40, padding: 16, backgroundColor: '#fef3c7', borderRadius: 12, borderWidth: 1, borderColor: '#fcd34d' }}>
            <Text style={{ color: '#92400e', fontFamily: F.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>⚙ Dev: Role Switcher</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity onPress={handleSwitchToAdmin} style={{ flex: 1, backgroundColor: '#92400e', paddingVertical: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }} activeOpacity={0.8}>
                <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 12 }}>Switch</Text>
                <ArrowRight size={12} color="#ffffff" />
                <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 12 }}>Admin</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSwitchToStudent} style={{ flex: 1, backgroundColor: C.blue, paddingVertical: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }} activeOpacity={0.8}>
                <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 12 }}>Switch</Text>
                <ArrowRight size={12} color="#ffffff" />
                <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 12 }}>Student</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </View>
    </ScrollView>
  );
}
