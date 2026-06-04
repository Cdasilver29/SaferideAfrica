// Supabase Edge Function — mpesa-stk-push
// Receives { phone, amount, accountRef, enrollmentId, installmentNumber? } from the app,
// obtains a Daraja Bearer token, fires an STK Push, and stores the pending transaction.

import { serve }        from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders }  from '../_shared/cors.ts';

const CONSUMER_KEY    = Deno.env.get('MPESA_CONSUMER_KEY')!;
const CONSUMER_SECRET = Deno.env.get('MPESA_CONSUMER_SECRET')!;
const PASSKEY         = Deno.env.get('MPESA_PASSKEY')!;
const SHORT_CODE      = Deno.env.get('MPESA_SHORTCODE') ?? '522533';
const CALLBACK_URL    = Deno.env.get('MPESA_CALLBACK_URL')!;
const DARAJA_BASE     = 'https://api.safaricom.co.ke';

async function getDarajaToken(): Promise<string> {
  const creds = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
  const res   = await fetch(`${DARAJA_BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${creds}` },
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Daraja auth failed: ${JSON.stringify(data)}`);
  return data.access_token as string;
}

// 07XXXXXXXX  →  2547XXXXXXXX
// +2547XXXXXXXX → 2547XXXXXXXX
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('254') && digits.length === 12) return digits;
  if (digits.startsWith('0')   && digits.length === 10) return '254' + digits.slice(1);
  if ((digits.startsWith('7') || digits.startsWith('1')) && digits.length === 9) return '254' + digits;
  throw new Error('Invalid Kenyan phone number — expected format: 07XXXXXXXX');
}

// YYYYMMDDHHmmss
function timestamp(): string {
  return new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  const { phone, amount, accountRef, enrollmentId, installmentNumber } = body as {
    phone:              string;
    amount:             number;
    accountRef:         string;
    enrollmentId:       string;
    installmentNumber?: number;
  };

  if (!phone || !amount || !accountRef || !enrollmentId) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: phone, amount, accountRef, enrollmentId' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  let formattedPhone: string;
  try {
    formattedPhone = formatPhone(phone);
  } catch (e: unknown) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  try {
    const token = await getDarajaToken();
    const ts       = timestamp();
    const password = btoa(`${SHORT_CODE}${PASSKEY}${ts}`);

    const stkRes = await fetch(`${DARAJA_BASE}/mpesa/stkpush/v1/processrequest`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        BusinessShortCode: SHORT_CODE,
        Password:          password,
        Timestamp:         ts,
        TransactionType:   'CustomerPayBillOnline',
        Amount:            Math.ceil(amount),
        PartyA:            formattedPhone,
        PartyB:            SHORT_CODE,
        PhoneNumber:       formattedPhone,
        CallBackURL:       CALLBACK_URL,
        AccountReference:  String(accountRef).slice(0, 12),
        TransactionDesc:   'SafeRide Africa',
      }),
    });

    const stkData = await stkRes.json();

    if (stkData.ResponseCode !== '0') {
      return new Response(
        JSON.stringify({ error: stkData.CustomerMessage ?? stkData.errorMessage ?? 'STK Push failed' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Persist pending transaction so the callback can match by CheckoutRequestID
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { error: dbErr } = await supabase.from('mpesa_transactions').insert({
      checkout_request_id: stkData.CheckoutRequestID,
      enrollment_id:       enrollmentId,
      installment_number:  installmentNumber ?? null,
      phone:               formattedPhone,
      amount:              Math.ceil(amount),
      status:              'pending',
    });
    if (dbErr) console.error('DB insert error:', dbErr);

    return new Response(
      JSON.stringify({ checkoutRequestId: stkData.CheckoutRequestID }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e: unknown) {
    console.error('STK Push error:', e);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
