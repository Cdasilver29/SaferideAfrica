# SafeRide Africa — Driving School App

Cross-platform application for **SafeRide Africa Driving School** (Nairobi, Kenya). Built with Expo + React Native, serving iOS, Android, and Web from a single codebase.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo ~51 / React Native 0.74 |
| Routing | Expo Router (file-based) |
| Styling | NativeWind 4 + Tailwind CSS 3 |
| Backend | Supabase (PostgreSQL, Auth, Edge Functions) |
| Payments | M-Pesa Daraja STK Push |
| Animations | React Native Reanimated 3 + Skia |
| Forms | React Hook Form + Zod |
| i18n | i18next (EN, SW, FR, ZH, AR) |
| Maps | pigeon-maps (web) / react-native-maps (native) |

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`

### Install

```bash
npm install
```

### Environment

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

Required variables:

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_PASSKEY=
MPESA_SHORTCODE=
MPESA_CALLBACK_URL=
MPESA_CALLBACK_SECRET=
```

### Run locally

```bash
# Web (recommended for development)
NODE_TLS_REJECT_UNAUTHORIZED=0 npx expo start --web --port 8081 --offline

# iOS simulator
npx expo start --ios

# Android emulator
npx expo start --android
```

Open [http://localhost:8081](http://localhost:8081) in your browser.

## Project Structure

```
app/                    # Expo Router pages
  _layout.tsx           # Root layout, fonts, auth + modal providers
  index.tsx             # Landing page
  about.tsx             # About SafeRide
  courses.tsx           # Course catalogue
  services.tsx          # Services overview
  branches.tsx          # Branch map & directory
  gallery.tsx           # Photo gallery
  blog.tsx              # Blog listing
  login.tsx / register.tsx
  account/index.tsx     # Student dashboard
  admin/index.tsx       # Branch admin panel
  classes/              # Class browsing & enrolment
  enrollments/[id]/pay.tsx  # M-Pesa payment screen

src/
  api/                  # Auth, enrolments, M-Pesa, storage stubs
  components/
    landing/            # All landing-page section components
    animations/         # KenBurns, VerticalCutReveal
    EnrollModal.tsx     # Global enrolment modal
    LoginForm.tsx
    SocialFloat.tsx     # Floating social media buttons
  context/              # AuthContext, EnrollModalContext
  data/                 # saferide.ts (all business data), statusColors.ts
  i18n/                 # i18next config + locale files
  lib/                  # theme.ts, installments.ts

supabase/
  functions/            # Edge functions: mpesa-stk-push, mpesa-callback, mpesa-status
  migrations/           # SQL migrations

public/                 # Web static assets (images, index.html)
assets/                 # App icons, splash, fonts
```

## Key Features

- **Landing site** — hero, stats, services, courses, testimonials, branch map, blog
- **Enrolment flow** — modal form → M-Pesa STK Push → installment tracking
- **Student account** — enrolment history, payment status, installment progress
- **Admin panel** — branch-scoped queue, confirm/reject payments, notes
- **Internationalisation** — English, Swahili, French, Chinese, Arabic
- **Dark mode** — full NativeWind dark theme support

## Payment Flow (M-Pesa)

```
EnrollModal → createEnrollment() → initiateStkPush() (Edge Function)
    → Safaricom Daraja API → STK prompt on student's phone
    → mpesa-callback Edge Function → mpesa_transactions table
    → waitForPayment() polling → confirmed / failed
```

## Deployment

### Web (Expo)

```bash
npx expo export --platform web
# Deploy the dist/ folder to any static host (Cloudflare Pages, Vercel, etc.)
```

### Supabase Edge Functions

```bash
supabase functions deploy mpesa-stk-push
supabase functions deploy mpesa-callback
supabase functions deploy mpesa-status
```

Set secrets in the Supabase dashboard:

```
MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_PASSKEY,
MPESA_SHORTCODE, MPESA_CALLBACK_URL, MPESA_CALLBACK_SECRET
```

## License

Private — SafeRide Africa Driving School Ltd. All rights reserved.
