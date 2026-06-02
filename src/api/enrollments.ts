// src/api/enrollments.ts
// TODO(backend): replace every function here with real Supabase/API calls.

import { getItem, setItem, list } from './storage';
import { splitIntoThree, installmentDueDates } from '../lib/installments';

export type EnrollmentStatus =
  | 'pending_payment'
  | 'payment_submitted'
  | 'confirmed'
  | 'cancelled';

export type PaymentPlan = 'full' | 'installments_3';

export interface AdminNote {
  text:      string;
  adminId:   string;
  createdAt: string;
}

export interface InstallmentEntry {
  number:     1 | 2 | 3;
  amount:     number;
  dueAt:      string;   // ISO date YYYY-MM-DD
  mpesaCode?: string;
  paidAt?:    string;   // ISO datetime
}

export interface Enrollment {
  id:               string;
  userId:           string;
  branchId:         string;
  classCode:        string;
  className:        string;
  totalAmount:      number;
  status:           EnrollmentStatus;
  mpesaCode?:       string;
  createdAt:        string;
  updatedAt:        string;
  confirmedAt?:     string;
  confirmedBy?:     string;
  cancelledReason?: string;
  adminNotes:       AdminNote[];
  // Student details snapshot at enrollment time
  studentName:      string;
  studentEmail:     string;
  studentPhone:     string;
  studentIdNumber:  string;
  // Installment plan
  paymentPlan:      PaymentPlan;
  installments?:    InstallmentEntry[];
}

export interface EnrollmentInput {
  userId:          string;
  branchId:        string;
  classCode:       string;
  className:       string;
  totalAmount:     number;
  studentName:     string;
  studentEmail:    string;
  studentPhone:    string;
  studentIdNumber: string;
  paymentPlan?:    PaymentPlan;  // defaults to 'full'
}

const delay  = () => new Promise(r => setTimeout(r, 400));
const uid    = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
const eKey   = (id: string) => `sr:enrollment:${id}`;
const PREFIX = 'sr:enrollment:';

// TODO(backend): replace with real API call
export async function createEnrollment(input: EnrollmentInput): Promise<Enrollment> {
  await delay();
  const now  = new Date().toISOString();
  const plan = input.paymentPlan ?? 'full';

  let installments: InstallmentEntry[] | undefined;
  if (plan === 'installments_3') {
    const [a, b, c] = splitIntoThree(input.totalAmount);
    const [d0, d30, d60] = installmentDueDates();
    installments = [
      { number: 1, amount: a, dueAt: d0  },
      { number: 2, amount: b, dueAt: d30 },
      { number: 3, amount: c, dueAt: d60 },
    ];
  }

  const enrollment: Enrollment = {
    id: uid(),
    ...input,
    paymentPlan: plan,
    installments,
    status:     'pending_payment',
    createdAt:  now,
    updatedAt:  now,
    adminNotes: [],
  };
  await setItem(eKey(enrollment.id), enrollment);
  return enrollment;
}

// TODO(backend): replace with real API call
export async function submitPayment(enrollmentId: string, mpesaCode: string): Promise<Enrollment> {
  await delay();
  const enrollment = await getItem<Enrollment>(eKey(enrollmentId));
  if (!enrollment) throw new Error('Enrollment not found.');
  const updated: Enrollment = {
    ...enrollment,
    mpesaCode,
    status:    'payment_submitted',
    updatedAt: new Date().toISOString(),
  };
  await setItem(eKey(enrollmentId), updated);
  return updated;
}

// TODO(backend): replace with real API call
export async function listMyEnrollments(userId: string): Promise<Enrollment[]> {
  await delay();
  const all = await list<Enrollment>(PREFIX);
  return all
    .filter(e => e.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// TODO(backend): replace with real API call
export async function listBranchEnrollments(branchId: string): Promise<Enrollment[]> {
  await delay();
  const all = await list<Enrollment>(PREFIX);
  return all
    .filter(e => e.branchId === branchId && e.status === 'payment_submitted')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

// TODO(backend): replace with real API call
export async function confirmEnrollment(enrollmentId: string, adminId: string): Promise<Enrollment> {
  await delay();
  const enrollment = await getItem<Enrollment>(eKey(enrollmentId));
  if (!enrollment) throw new Error('Enrollment not found.');
  const now = new Date().toISOString();
  const updated: Enrollment = {
    ...enrollment,
    status:      'confirmed',
    confirmedAt: now,
    confirmedBy: adminId,
    updatedAt:   now,
  };
  await setItem(eKey(enrollmentId), updated);
  return updated;
}

// TODO(backend): replace with real API call
export async function rejectEnrollment(enrollmentId: string, reason: string): Promise<Enrollment> {
  await delay();
  const enrollment = await getItem<Enrollment>(eKey(enrollmentId));
  if (!enrollment) throw new Error('Enrollment not found.');
  const updated: Enrollment = {
    ...enrollment,
    status:           'cancelled',
    cancelledReason:  reason,
    updatedAt:        new Date().toISOString(),
  };
  await setItem(eKey(enrollmentId), updated);
  return updated;
}

// TODO(backend): replace with real API call
export async function addAdminNote(enrollmentId: string, text: string, adminId: string): Promise<Enrollment> {
  await delay();
  const enrollment = await getItem<Enrollment>(eKey(enrollmentId));
  if (!enrollment) throw new Error('Enrollment not found.');
  const note: AdminNote = { text, adminId, createdAt: new Date().toISOString() };
  const updated: Enrollment = {
    ...enrollment,
    adminNotes: [...enrollment.adminNotes, note],
    updatedAt:  new Date().toISOString(),
  };
  await setItem(eKey(enrollmentId), updated);
  return updated;
}

// TODO(backend): replace with real API call
export async function getEnrollment(enrollmentId: string): Promise<Enrollment | null> {
  await delay();
  return getItem<Enrollment>(eKey(enrollmentId));
}

// TODO(backend): replace with real API call
// Submits a single installment payment.
// Only installment 1 changes overall status to 'payment_submitted'.
// Installments 2 and 3 are tracked in the installments array — admin reviews in notes.
export async function submitInstallmentPayment(
  enrollmentId:      string,
  installmentNumber: 1 | 2 | 3,
  mpesaCode:         string,
): Promise<Enrollment> {
  await delay();
  const enrollment = await getItem<Enrollment>(eKey(enrollmentId));
  if (!enrollment) throw new Error('Enrollment not found.');

  const now = new Date().toISOString();

  // Stamp the payment plan + initial installment schedule if not yet set
  // (covers the case where plan was chosen on the pay screen, not at enrol time)
  let installments = enrollment.installments;
  if (!installments) {
    const [a, b, c]      = splitIntoThree(enrollment.totalAmount);
    const [d0, d30, d60] = installmentDueDates();
    installments = [
      { number: 1, amount: a, dueAt: d0  },
      { number: 2, amount: b, dueAt: d30 },
      { number: 3, amount: c, dueAt: d60 },
    ];
  }

  const updatedInstallments: InstallmentEntry[] = installments.map(inst =>
    inst.number === installmentNumber
      ? { ...inst, mpesaCode, paidAt: now }
      : inst,
  );

  const updated: Enrollment = {
    ...enrollment,
    paymentPlan:  'installments_3',
    installments: updatedInstallments,
    // Only installment 1 bubbles up to the admin queue
    status:    installmentNumber === 1 ? 'payment_submitted' : enrollment.status,
    mpesaCode: installmentNumber === 1 ? mpesaCode : enrollment.mpesaCode,
    updatedAt: now,
  };
  await setItem(eKey(enrollmentId), updated);
  return updated;
}
