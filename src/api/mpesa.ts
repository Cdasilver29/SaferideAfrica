// src/api/mpesa.ts
// App-side M-Pesa Daraja helpers.
// All secret credentials stay in Supabase Edge Functions — never here.

const SUPABASE_URL  = process.env.EXPO_PUBLIC_SUPABASE_URL  ?? '';
const SUPABASE_ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

function fnUrl(name: string) {
  return `${SUPABASE_URL}/functions/v1/${name}`;
}

function authHeaders() {
  return {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON}`,
    'apikey':        SUPABASE_ANON,
  };
}

// ─── STK Push ────────────────────────────────────────────────────────────────

export interface StkPushParams {
  phone:              string;
  amount:             number;
  accountRef:         string;
  enrollmentId:       string;
  installmentNumber?: 1 | 2 | 3;
}

/** Sends the STK Push request and returns the CheckoutRequestID. */
export async function initiateStkPush(params: StkPushParams): Promise<string> {
  const res  = await fetch(fnUrl('mpesa-stk-push'), {
    method:  'POST',
    headers: authHeaders(),
    body:    JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Failed to initiate M-Pesa payment.');
  return data.checkoutRequestId as string;
}

// ─── Status polling ──────────────────────────────────────────────────────────

export type StkStatus = 'pending' | 'success' | 'failed';

export interface StkResult {
  status:       StkStatus;
  mpesaReceipt: string | null;
  resultDesc:   string | null;
}

/** Single status check — use waitForPayment for the full polling loop. */
export async function pollStkStatus(checkoutRequestId: string): Promise<StkResult> {
  const res  = await fetch(
    `${fnUrl('mpesa-status')}?checkoutRequestId=${encodeURIComponent(checkoutRequestId)}`,
    { headers: authHeaders() },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Failed to check payment status.');
  return {
    status:       data.status        as StkStatus,
    mpesaReceipt: data.mpesa_receipt ?? null,
    resultDesc:   data.result_desc   ?? null,
  };
}

/**
 * Polls every 5 s until the payment succeeds, fails, or times out (default 2 min).
 * Call onStatusChange to drive UI updates without awaiting the whole loop.
 */
export async function waitForPayment(
  checkoutRequestId: string,
  onStatusChange?: (status: StkStatus) => void,
  timeoutMs = 120_000,
): Promise<StkResult> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, 5_000));
    const result = await pollStkStatus(checkoutRequestId);
    onStatusChange?.(result.status);
    if (result.status !== 'pending') return result;
  }
  return {
    status:       'failed',
    mpesaReceipt: null,
    resultDesc:   'Payment timed out. Please try again or enter your M-Pesa code manually.',
  };
}
