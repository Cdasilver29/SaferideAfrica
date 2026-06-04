// Supabase Edge Function — mpesa-status
// The app polls this endpoint every 5 s while waiting for the STK Push result.

import { serve }        from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders }  from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const url               = new URL(req.url);
  const checkoutRequestId = url.searchParams.get('checkoutRequestId');

  if (!checkoutRequestId) {
    return new Response(
      JSON.stringify({ error: 'Missing checkoutRequestId query param' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data, error } = await supabase
    .from('mpesa_transactions')
    .select('status, mpesa_receipt, result_desc, enrollment_id, installment_number')
    .eq('checkout_request_id', checkoutRequestId)
    .single();

  if (error || !data) {
    return new Response(
      JSON.stringify({ error: 'Transaction not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  return new Response(JSON.stringify(data), {
    status:  200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
