# Safe Ride Africa

Public marketing and enrollment-lead site for **Safe Ride Africa Driving School** (Nairobi, Kenya). Built with Expo Router and React Native Web.

There is no online payment, no database, and no accounts or admin area. Enrollment is a lead form that hands off to WhatsApp and email.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo ~51 / React Native 0.74 |
| Routing | Expo Router (file-based) |
| Styling | NativeWind 4 + Tailwind CSS 3, design tokens in `src/lib/tokens.ts` |
| Animations | React Native Reanimated 3 |
| Icons | Lucide |
| i18n | i18next (EN, SW, FR, ZH) |
| Maps | pigeon-maps (web) / react-native-maps (native) |
| Lead capture | Web3Forms + WhatsApp handoff |

## Getting Started

### Prerequisites

- Node.js 18+ (CI builds on Node 24)

### Install

```bash
npm install
```

### Environment

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

Both variables are optional for local development. The enrollment modal falls back to a built-in Web3Forms key, and the canonical origin is hardcoded in `src/components/PageHead.tsx`.

```
EXPO_PUBLIC_APP_URL=
EXPO_PUBLIC_WEB3FORMS_KEY=
```

### Run locally

```bash
# Web (recommended for development)
npm run web

# iOS simulator
npm run ios

# Android emulator
npm run android
```

Open [http://localhost:8081](http://localhost:8081) in your browser.

### Checks

```bash
npm run type-check    # tsc --noEmit
npm run build:web     # expo export --platform web
```

## Project Structure

```
app/                    # Expo Router pages
  _layout.tsx           # Root layout, fonts, enrollment modal provider
  +html.tsx             # Web HTML shell
  index.tsx             # Landing page
  about.tsx             # About overview
  about/                # story, values, why-us, how-we-work, faq
  classes/              # Class index and [code] detail pages
  courses.tsx           # Course catalogue
  services.tsx          # Services overview
  services/[code].tsx   # Service detail
  branches.tsx          # Branch map and directory
  gallery.tsx           # Photo gallery
  blog.tsx              # Blog listing
  blog/[id].tsx         # Blog post
  contact.tsx           # Contact page

src/
  components/
    landing/            # Landing-page section components
    animations/         # KenBurns, VerticalCutReveal
    EnrollModal.tsx     # Global enrollment lead modal
    PageHead.tsx        # Meta tags, canonical URL, JSON-LD
    SocialFloat.tsx     # Floating social media buttons
  context/              # EnrollModalContext
  data/                 # saferide.ts (all business data)
  hooks/                # useInView, useReduceMotion
  i18n/                 # i18next config + locale files
  lib/                  # theme, tokens, responsive, viewTransitions
  ui/                   # UI System v2 primitives

docs/UI-SYSTEM.md       # UI system spec, read before touching landing UI
public/                 # Web static assets (images, index.html)
assets/                 # App icons, splash, fonts
```

## Key Features

- **Landing site**: hero, services, courses, testimonials, branch map, blog
- **Enrollment flow**: modal lead form, emailed via Web3Forms, then a prefilled WhatsApp handoff
- **Class and service pages**: per-licence-class detail with requirements and FAQ
- **Internationalisation**: English, Swahili, French, Chinese
- **Dark mode**: full NativeWind dark theme support

## Enrollment Lead Flow

```
EnrollModal -> validate fields -> POST to Web3Forms (email to the team)
    -> open prefilled WhatsApp message for the student to send
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs `npm run build:web` and uploads `dist/` to HostAfrica over FTP.

A `vercel.json` is also present, configured to build with `npx expo export --platform web` and serve `dist/`.

Required GitHub Actions secrets:

```
FTP_SERVER, FTP_USERNAME, FTP_PASSWORD
EXPO_PUBLIC_APP_URL, EXPO_PUBLIC_WEB3FORMS_KEY
```

## License

Private. Safe Ride Africa Driving School Ltd. All rights reserved.
