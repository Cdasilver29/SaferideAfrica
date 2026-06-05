import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Modal,
  ActivityIndicator, Animated, Platform, RefreshControl,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import {
  Shield, ChevronLeft, CheckCircle, XCircle, MessageSquare,
  Clock, ChevronDown, ChevronUp, User, AlertTriangle, ArrowLeft,
} from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import {
  listBranchEnrollments, confirmEnrollment, rejectEnrollment,
  addAdminNote, Enrollment, AdminNote,
} from '../../src/api/enrollments';
import { BRANCHES } from '../../src/data/saferide';
import { C, F, IS_WEB, MAX_W } from '../../src/components/landing/constants';
import { useTheme } from '../../src/lib/theme';

const KSH = (n: number) => 'Ksh ' + n.toLocaleString('en-KE');

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Toast ───────────────────────────────────────────────────────────────────

function useToast() {
  const opacity = useRef(new Animated.Value(0)).current;
  const [msg, setMsg] = useState('');

  const show = (text: string) => {
    setMsg(text);
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: Platform.OS !== 'web' }),
      Animated.delay(2800),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: Platform.OS !== 'web' }),
    ]).start();
  };

  const Toast = () => (
    <Animated.View
      style={{
        position: 'absolute', bottom: 32, left: 20, right: 20,
        backgroundColor: C.dark, borderRadius: 14, padding: 16,
        flexDirection: 'row', alignItems: 'center', gap: 10,
        pointerEvents: 'none',
        opacity, zIndex: 999,
        shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, elevation: 10,
      }}
    >
      <AlertTriangle size={16} color={C.yellow} />
      <Text style={{ color: '#ffffff', fontFamily: F.regular, fontSize: 13, flex: 1 }}>{msg}</Text>
    </Animated.View>
  );

  return { show, Toast };
}

// ─── Reject modal ─────────────────────────────────────────────────────────────

function RejectModal({
  visible,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}) {
  const T = useTheme();
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason.trim());
    setReason('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', padding: 24 }}>
        <View style={{ backgroundColor: T.card, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: T.border }}>
          <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 17, marginBottom: 6 }}>Reject Enrollment</Text>
          <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 13, marginBottom: 16 }}>
            Provide a reason for rejection. This will be stored on the enrollment record.
          </Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="e.g. Invalid M-Pesa code, insufficient amount…"
            placeholderTextColor={T.mutedForeground}
            multiline
            numberOfLines={3}
            style={{
              backgroundColor: T.muted, borderWidth: 1.5,
              borderColor: reason ? C.red : T.border,
              borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
              color: T.foreground, fontFamily: F.regular, fontSize: 14,
              textAlignVertical: 'top', minHeight: 80, marginBottom: 20,
            }}
          />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={onCancel}
              style={{ flex: 1, paddingVertical: 13, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: T.border }}
              activeOpacity={0.8}
            >
              <Text style={{ color: T.mutedForeground, fontFamily: F.bold, fontSize: 14 }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={!reason.trim()}
              style={{ flex: 1, paddingVertical: 13, borderRadius: 12, alignItems: 'center', backgroundColor: reason.trim() ? C.red : 'rgba(225, 29, 46, 0.4)' }}
              activeOpacity={0.85}
            >
              <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 14 }}>Confirm Rejection</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Notes section ────────────────────────────────────────────────────────────

function NotesSection({
  notes,
  enrollmentId,
  adminId,
  onNoteAdded,
}: {
  notes: AdminNote[];
  enrollmentId: string;
  adminId: string;
  onNoteAdded: (updated: Enrollment) => void;
}) {
  const T = useTheme();
  const [open,    setOpen]    = useState(false);
  const [text,    setText]    = useState('');
  const [saving,  setSaving]  = useState(false);

  const handleAdd = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      const updated = await addAdminNote(enrollmentId, text.trim(), adminId);
      onNoteAdded(updated);
      setText('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ borderTopWidth: 1, borderTopColor: T.border, marginTop: 12, paddingTop: 12 }}>
      <TouchableOpacity
        onPress={() => setOpen(v => !v)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: open ? 12 : 0 }}
        activeOpacity={0.7}
      >
        <MessageSquare size={13} color={T.mutedForeground} />
        <Text style={{ color: T.mutedForeground, fontFamily: F.semibold, fontSize: 12 }}>
          Admin Notes ({notes.length})
        </Text>
        {open ? <ChevronUp size={13} color={T.mutedForeground} /> : <ChevronDown size={13} color={T.mutedForeground} />}
      </TouchableOpacity>

      {open && (
        <>
          {notes.length === 0 && (
            <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 12, marginBottom: 10 }}>
              No notes yet.
            </Text>
          )}
          {notes.map((n, i) => (
            <View key={i} style={{ backgroundColor: T.muted, borderRadius: 8, padding: 10, marginBottom: 8 }}>
              <Text style={{ color: T.foreground, fontFamily: F.regular, fontSize: 12, lineHeight: 18 }}>{n.text}</Text>
              <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 10, marginTop: 4 }}>
                {relativeTime(n.createdAt)} · {n.adminId.slice(0, 8)}
              </Text>
            </View>
          ))}

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Add a note…"
              placeholderTextColor={T.mutedForeground}
              style={{
                flex: 1, backgroundColor: T.muted, borderWidth: 1,
                borderColor: T.border, borderRadius: 10,
                paddingHorizontal: 12, paddingVertical: 9,
                color: T.foreground, fontFamily: F.regular, fontSize: 13,
              }}
            />
            <TouchableOpacity
              onPress={handleAdd}
              disabled={!text.trim() || saving}
              style={{ backgroundColor: C.blue, paddingHorizontal: 14, borderRadius: 10, justifyContent: 'center' }}
              activeOpacity={0.8}
            >
              {saving
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={{ color: '#fff', fontFamily: F.bold, fontSize: 12 }}>Add</Text>
              }
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

// ─── Enrollment card ──────────────────────────────────────────────────────────

function EnrollmentCard({
  enrollment,
  adminId,
  onConfirm,
  onReject,
  onUpdate,
}: {
  enrollment: Enrollment;
  adminId: string;
  onConfirm: (e: Enrollment) => void;
  onReject: (e: Enrollment) => void;
  onUpdate: (e: Enrollment) => void;
}) {
  const T = useTheme();
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      const updated = await confirmEnrollment(enrollment.id, adminId);
      onConfirm(updated);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <View style={{
      backgroundColor: T.card, borderRadius: 16, padding: 18, marginBottom: 14,
      borderWidth: 1, borderColor: T.border,
      shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
    }}>
      {/* Student + class */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <User size={13} color={C.blue} />
            <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 15 }}>{enrollment.studentName}</Text>
          </View>
          <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 12 }}>{enrollment.studentPhone}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 16 }}>{KSH(enrollment.totalAmount)}</Text>
          <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 11, marginTop: 2 }}>{enrollment.className}</Text>
        </View>
      </View>

      {/* M-Pesa code + time */}
      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 14 }}>
        <View style={{ flex: 1, backgroundColor: 'rgba(1, 165, 240, 0.08)', borderRadius: 10, padding: 10 }}>
          <Text style={{ color: T.mutedForeground, fontFamily: F.semibold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>
            M-Pesa Code
          </Text>
          <Text style={{ color: C.skyDeep, fontFamily: F.bold, fontSize: 16, letterSpacing: 1.5 }}>
            {enrollment.mpesaCode ?? '—'}
          </Text>
        </View>
        <View style={{ flex: 1, backgroundColor: T.muted, borderRadius: 10, padding: 10 }}>
          <Text style={{ color: T.mutedForeground, fontFamily: F.semibold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>
            Submitted
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Clock size={12} color={T.mutedForeground} />
            <Text style={{ color: T.foreground, fontFamily: F.medium, fontSize: 13 }}>
              {relativeTime(enrollment.updatedAt)}
            </Text>
          </View>
        </View>
      </View>

      {/* Notes */}
      <NotesSection
        notes={enrollment.adminNotes}
        enrollmentId={enrollment.id}
        adminId={adminId}
        onNoteAdded={onUpdate}
      />

      {/* Action buttons */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={confirming}
          style={{
            flex: 1, paddingVertical: 12, borderRadius: 12,
            backgroundColor: C.skyDeep,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
          activeOpacity={0.85}
        >
          {confirming
            ? <ActivityIndicator size="small" color="#fff" />
            : <>
                <CheckCircle size={15} color="#fff" />
                <Text style={{ color: '#fff', fontFamily: F.bold, fontSize: 14 }}>Confirm</Text>
              </>
          }
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onReject(enrollment)}
          style={{
            flex: 1, paddingVertical: 12, borderRadius: 12,
            backgroundColor: 'rgba(225, 29, 46, 0.08)',
            borderWidth: 1, borderColor: 'rgba(225, 29, 46, 0.3)',
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
          activeOpacity={0.8}
        >
          <XCircle size={15} color={C.red} />
          <Text style={{ color: C.red, fontFamily: F.bold, fontSize: 14 }}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AdminScreen() {
  const T = useTheme();
  const { user, loading: authLoading } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [rejectTarget, setRejectTarget] = useState<Enrollment | null>(null);
  const { show: showToast, Toast } = useToast();

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: T.background }}>
        <ActivityIndicator color={C.blue} size="large" />
      </View>
    );
  }

  if (!user || user.role !== 'branch_admin') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: T.background }}>
        <Shield size={48} color={T.mutedForeground} />
        <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 18, marginTop: 20, textAlign: 'center' }}>
          Admin Access Only
        </Text>
        <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 14, marginTop: 8, textAlign: 'center' }}>
          You must be a branch admin to view this screen.
        </Text>
        <TouchableOpacity onPress={() => router.replace('/account')} style={{ marginTop: 24, backgroundColor: C.yellow, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 12 }} activeOpacity={0.85}>
          <Text style={{ color: C.dark, fontFamily: F.bold, fontSize: 14 }}>Back to Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const branch = (BRANCHES as readonly typeof BRANCHES[number][]).find(b => b.id === user.branchId);

  const load = useCallback(async () => {
    try {
      const list = await listBranchEnrollments(user.branchId);
      setEnrollments(list);
    } finally {
      setDataLoading(false);
      setRefreshing(false);
    }
  }, [user.branchId]);

  useFocusEffect(useCallback(() => { setDataLoading(true); load(); }, [load]));

  const handleConfirm = (updated: Enrollment) => {
    setEnrollments(prev => prev.filter(e => e.id !== updated.id));
    // TODO(backend): send confirmation email and SMS here
    showToast('Confirmation email and SMS would be sent here (demo)');
  };

  const handleRejectOpen = (e: Enrollment) => setRejectTarget(e);

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectTarget) return;
    try {
      const updated = await rejectEnrollment(rejectTarget.id, reason);
      setEnrollments(prev => prev.filter(e => e.id !== updated.id));
      // TODO(backend): send rejection email and SMS here
      showToast('Confirmation email and SMS would be sent here (demo)');
    } finally {
      setRejectTarget(null);
    }
  };

  const handleUpdate = (updated: Enrollment) => {
    setEnrollments(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.background }}>

      {/* Header */}
      <View style={{ backgroundColor: C.darkBg, paddingTop: Platform.OS === 'ios' ? 56 : 36, paddingBottom: 20, paddingHorizontal: 24 }}>
        <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>
          <TouchableOpacity onPress={() => router.replace('/account')} style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.7}>
            <ArrowLeft size={14} color={C.mutedDark} />
            <Text style={{ color: C.mutedDark, fontFamily: F.semibold, fontSize: 13 }}>Account</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} color={C.dark} />
            </View>
            <View>
              <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 20 }}>Admin View</Text>
              <Text style={{ color: C.mutedDark, fontFamily: F.regular, fontSize: 13 }}>
                {branch ? branch.name : user.branchId} branch · payment submitted
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={[
          { flexGrow: 1, padding: 20, paddingBottom: 80 },
          IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {},
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); load(); }}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {dataLoading ? (
          <ActivityIndicator color={C.blue} style={{ marginTop: 48 }} size="large" />
        ) : enrollments.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 56 }}>
            <CheckCircle size={48} color={C.skyDeep} />
            <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: 16, marginTop: 16 }}>
              All caught up!
            </Text>
            <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 13, marginTop: 6, textAlign: 'center' }}>
              No enrollments awaiting confirmation for {branch?.name ?? 'this branch'}.
            </Text>
          </View>
        ) : (
          <>
            <Text style={{ color: T.mutedForeground, fontFamily: F.regular, fontSize: 13, marginBottom: 16 }}>
              {enrollments.length} enrollment{enrollments.length !== 1 ? 's' : ''} awaiting confirmation
            </Text>
            {enrollments.map(e => (
              <EnrollmentCard
                key={e.id}
                enrollment={e}
                adminId={user.id}
                onConfirm={handleConfirm}
                onReject={handleRejectOpen}
                onUpdate={handleUpdate}
              />
            ))}
          </>
        )}
      </ScrollView>

      {/* Reject modal */}
      <RejectModal
        visible={!!rejectTarget}
        onCancel={() => setRejectTarget(null)}
        onConfirm={handleRejectConfirm}
      />

      {/* Toast */}
      <Toast />
    </View>
  );
}
