import { C } from '../components/landing/constants';
import type { EnrollmentStatus } from '../api/enrollments';

export const STATUS_COLORS: Record<EnrollmentStatus, { fg: string; bg: string }> = {
  pending_payment:   { fg: C.dark,    bg: 'rgba(34, 31, 32, 0.08)' },
  payment_submitted: { fg: C.dark,    bg: 'rgba(255, 216, 0, 0.20)' },
  confirmed:         { fg: C.skyDeep, bg: 'rgba(1, 165, 240, 0.12)' },
  cancelled:         { fg: C.red,     bg: 'rgba(225, 29, 46, 0.10)' },
};
