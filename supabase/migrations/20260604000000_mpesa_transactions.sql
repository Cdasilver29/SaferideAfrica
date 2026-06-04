-- M-Pesa STK Push transaction log
-- One row per STK Push attempt; updated when Safaricom POSTs the callback.

create table if not exists mpesa_transactions (
  id                  uuid        primary key default gen_random_uuid(),
  checkout_request_id text        unique not null,
  enrollment_id       text        not null,
  installment_number  smallint,           -- null for full-pay, 1/2/3 for installments
  phone               text        not null,
  amount              integer     not null,
  status              text        not null default 'pending'
                        check (status in ('pending', 'success', 'failed')),
  mpesa_receipt       text,               -- MpesaReceiptNumber from callback
  result_code         integer,
  result_desc         text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Edge functions use the service-role key and bypass RLS.
-- The app never queries this table directly.
alter table mpesa_transactions enable row level security;
