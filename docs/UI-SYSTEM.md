# SafeRide Africa UI System v2

Modernized landing UI following the AA Kenya information architecture:
marketing site + conversion funnel, card-based course layout, flat
hierarchical nav, no app shell. Same IA, executed like a 2026 product
instead of a page-builder export.

## What we took from AA, what we fixed

Kept: the funnel (hero, what we teach, why us, apply, footer), the
card-based course layout, licence categories as the organizing unit,
flat nav with a single primary CTA.

Fixed: AA's page duplicates its nav markup, mixes heading levels
(paragraph copy set as h5), pushes a dense fee table above the fold,
and has no consistent spacing rhythm. We replace that with a token
system, typographic scale, one CTA per section, and no public pricing
(per SafeRide convention, fees are discussed at enrolment).

## Architecture

```
src/ui/                  Primitives. Zero business knowledge.
  tokens.ts              Colors, radii, spacing, fonts. Single source of truth.
  Typography.tsx         Display, Heading, Subheading, Eyebrow, Body, Caption
  Button.tsx             primary | secondary | ghost | whatsapp, loading state
  PlateBadge.tsx         Signature element: licence codes as KE plate lozenges
  Section.tsx            Section (tone: light|dark|tinted), RoadDivider, Card
  Skeleton.tsx           Reduced-motion-aware skeletons

src/components/landing/  Sections. Compose primitives + data + contexts.
  HeaderV2.tsx           Sticky header, desktop nav, accessible mobile drawer
  HeroV2.tsx             Split hero, image skeleton + error fallback
  CourseCategoriesSection.tsx   Card grid, loading + empty states
  WhySafeRideSection.tsx        Benefits + ApplyCtaSection (dark CTA band)
  FooterV2.tsx           Nav mirror + socials

src/data/courseCategories.ts    Typed content, no fees, hedged wording
```

Dependency direction is one-way: sections import primitives, never the
reverse. Primitives never import contexts, router, or data, so they
drop into the courses page, branch pages and the ops admin unchanged.

## Landing composition (app/index.tsx)

```tsx
import { ScrollView } from "react-native";
import { HeaderV2 } from "../src/components/landing/HeaderV2";
import { HeroV2 } from "../src/components/landing/HeroV2";
import { CourseCategoriesSection } from "../src/components/landing/CourseCategoriesSection";
import { WhySafeRideSection, ApplyCtaSection } from "../src/components/landing/WhySafeRideSection";
import { FooterV2 } from "../src/components/landing/FooterV2";
import { RoadDivider } from "../src/ui/Section";
import { openWhatsApp } from "../src/lib/whatsapp"; // existing deep-link helper

export default function Landing() {
  return (
    <>
      <HeaderV2 />
      <ScrollView>
        <HeroV2 />
        <RoadDivider />
        <CourseCategoriesSection />
        <RoadDivider />
        <WhySafeRideSection />
        <ApplyCtaSection onWhatsApp={openWhatsApp} />
        <FooterV2 />
      </ScrollView>
    </>
  );
}
```

## tailwind.config.js extension

Mirror of tokens.ts. Keep the two in sync manually (NativeWind can't
import TS into the config without extra tooling; not worth it here).

```js
theme: {
  extend: {
    colors: {
      asphalt: { DEFAULT: "#14181F", 800: "#1E242E", 700: "#2A3140" },
      chalk: { DEFAULT: "#F7F8F5", dim: "#ECEEE9" },
      amber: { DEFAULT: "#FFB700", deep: "#DF9E00" },
      signal: "#1FA85B",
      ink: {
        DEFAULT: "#14181F",
        muted: "#5A6272",
        "on-dark": "#F7F8F5",
        "on-dark-muted": "#9AA3B2",
      },
      danger: "#D64545",
    },
    fontFamily: {
      display: ["Archivo_700Bold"],
      "display-medium": ["Archivo_600SemiBold"],
      body: ["Inter_400Regular"],
      "body-medium": ["Inter_500Medium"],
      "body-bold": ["Inter_700Bold"],
    },
  },
}
```

Fonts: `npx expo install @expo-google-fonts/archivo @expo-google-fonts/inter`
and load them in app/_layout.tsx with the existing useFonts call.
Archivo has a road-signage voice that fits a driving school; Inter
stays out of its way for body copy.

## Props API principles

1. Sections take data as optional props with static defaults
   (`categories`, `loading`). Static site today, API-ready tomorrow,
   zero call-site churn.
2. Booleans describe state, not appearance: `loading`, `disabled`,
   never `isGrey`.
3. Handlers are injected where side effects live outside the component
   (`onWhatsApp`), pulled from context where they are app-global
   (`useEnrollModal`).
4. Every interactive primitive exposes `accessibilityLabel` and
   `testID` passthroughs.

## States handled

Loading: hero image skeleton; `CourseCardSkeleton` grid via the
`loading` prop; Button `loading` shows a spinner, blocks presses, and
sets `accessibilityState.busy`.

Empty: zero categories renders an enquiry card with a working CTA,
never a blank region.

Errors: hero image failure degrades to a tinted panel, layout intact.

Edge cases: reduced motion disables the skeleton pulse (and should
gate the existing scroll-reveal animations too via `useReducedMotion`);
Android back closes the mobile drawer (`onRequestClose`); nav drawer
uses Modal so focus can't escape to the page behind it; long course
titles wrap inside fixed-width cards because cards flex, not clip.

## Accessibility floor

Headings carry real levels on web (aria-level via Typography), one
Display per page. All touch targets are 44px+. Focus-visible rings on
every interactive element (`web:focus-visible:ring-2 ring-amber`).
Decorative elements (RoadDivider, skeletons) are hidden from assistive
tech. Contrast: ink on chalk 15.9:1, ink on amber 9.8:1, chalk on
asphalt 15.2:1, all past AA-level requirements; the one to watch is
ink-muted on chalk-dim (4.9:1), which passes AA for body text but
don't shrink it below 14px.

## Best practices going forward

Sections never define their own vertical padding; Section owns rhythm.
No raw hex outside tokens.ts and the tailwind config. New pages start
from Section + Typography, not from copied JSX. One primary Button per
viewport-height of content; everything else is secondary or a link.
Keep the PlateBadge exclusive to licence codes so the signature stays
meaningful. Standing content rules still apply: no fees on public
pages, no branch counts, regulator specifics stay hedged until
confirmed.
