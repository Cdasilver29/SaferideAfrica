// Supabase Edge Function — mpesa-callback  (verify_jwt = false in config.toml)
// Safaricom POSTs payment results here after the user completes (or cancels) the STK Push.
// Validates an optional CALLBACK_SECRET query param, then updates mpesa_transactions.

import { serve }        from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const CALLBACK_SECRET = Deno.env.get('MPESA_CALLBACK_SECRET'); // optional but recommended

serve(async (req) => {
  // Optionally validate a secret appended to the callback URL:
  // MPESA_CALLBACK_URL=https://xxx.supabase.co/functions/v1/mpesa-callback?secret=<your-secret>
  if (CALLBACK_SECRET) {
    const url    = new URL(req.url);
    const secret = url.searchParams.get('secret');
    if (secret !== CALLBACK_SECRET) {
      console.warn('mpesa-callback: rejected request — bad secret');
      return new Response('OK', { status: 200 }); // always 200 to avoid Safaricom retries
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response('OK', { status: 200 });
  }

  // Safaricom payload structure: { Body: { stkCallback: { ... } } }
  const stkCallback = (body as any)?.Body?.stkCallback;
  if (!stkCallback) {
    console.warn('mpesa-callback: no stkCallback in body');
    return new Response('OK', { status: 200 });
  }

  const {
    CheckoutRequestID: checkoutRequestId,
    ResultCode:        resultCode,
    ResultDesc:        resultDesc,
    CallbackMetadata,
  } = stkCallback;

  // Extract the M-Pesa receipt number from CallbackMetadata (present only on success)
  let mpesaReceipt: string | null = null;
  if (resultCode === 0 && CallbackMetadata?.Item) {
    const item = (CallbackMetadata.Item as { Name: string; Value: unknown }[])
      .find(i => i.Name === 'MpesaReceiptNumber');
    mpesaReceipt = item ? String(item.Value) : null;
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { error } = await supabase
    .from('mpesa_transactions')
    .update({
      status:        resultCode === 0 ? 'success' : 'failed',
      mpesa_receipt: mpesaReceipt,
      result_code:   resultCode,
      result_desc:   resultDesc,
      updated_at:    new Date().toISOString(),
    })
    .eq('checkout_request_id', checkoutRequestId);

  if (error) console.error('mpesa-callback DB update error:', error);

  // Safaricom expects a 200 — never return 4xx/5xx or it will retry indefinitely
  return new Response('OK', { status: 200 });
});
