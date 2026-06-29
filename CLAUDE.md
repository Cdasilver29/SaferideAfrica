# CLAUDE.md — Safe Ride Africa (web)

## What this project is
A public marketing and enrollment-lead site for Safe Ride Africa, a Nairobi driving school. Stack: Expo Router and React Native Web, deployed on Vercel. We are staying on React Native Web; there is no Next.js. There is no online payment, no Supabase, and no accounts or admin. Enrollment is a lead form that goes to WhatsApp and email. If you find M-Pesa, Supabase, pricing, or a demo auth/admin layer, it is being removed by the plan; do not reintroduce it.

## How we work, every session
- Do one phase at a time from docs/IMPROVEMENT_PLAN.md. Execute only the phase I name, stop at its gate, print a diff summary and the verification output, then wait for me to say proceed. Do not start the next phase.
- If the repo does not match what the plan describes, STOP and report it. Do not improvise a workaround.
- When you are unsure between two approaches, explain both and let me choose. Do not make architectural calls silently.
- Flag uncertainty plainly. Never say a check passed if it did not run. Do not present a guess as a fact.
- On any UI work, apply the ui-ux-pro-max skill in .claude/skills/. Use Material 3 (m3.material.io) as a reference for mobile feel; do not add a Material component library.

## Verify before declaring a phase done
- Run `npm run type-check` and `npm run build:web`. Both must be green. After a deletion, a green type-check is the proof nothing dangling references the removed code.
- Check the layout at 360, 414, 768, and 1280 px.
- Keep tap targets at a minimum of 44px.

## Design system and code conventions
- IMPORTANT: no em dashes anywhere, in code, comments, or copy. Use commas, colons, or shorter sentences.
- The font is Manrope. Phase 5 swaps it in and removes Work Sans. Reference it through the F constants or the font config; never hardcode a family.
- The design system is NativeWind plus react-native-reusables primitives plus design tokens, set up in Phases 5 and 6. New and rebuilt components use the primitives and the tokens. Components not yet migrated still use inline styles and the C constants; do not extend the C constants.
- Brand palette: sky #01a5f0, yellow #ffd800, dark #221f20. No raw hex in components; map to the tokens. Do not invent new colors.
- Shape language, Airbnb-style: rounded corners (roughly 8px buttons, 12 to 20px cards, pill on search and chips), an 8px spacing rhythm, one type family with weight-only hierarchy, a single reserved accent for the primary action, photo-first depth.
- Icons are Lucide, standardized to one stroke width with rounded caps.
- Animation is react-native-reanimated, transform and opacity only, and must respect reduce-motion. No GSAP.
- Keep backdrop-filter behind the existing @supports gate in global.css.
- UI strings go through the i18n t() function.

## Do not change
- Do not delete or change values in the BRANCHES, MANAGEMENT, or CLASS_SERIES constants in src/data/saferide.ts. For CLASSES, only the price and lesson-count fields are removed by the plan; names, codes, and descriptions stay.

## Git
- Make minimal changes. Do not refactor unrelated code.
- Commit after each logical chunk with a clear, specific message.
- Tag the repo at each phase boundary as phase-N.

## The plan
The sequenced work lives in docs/IMPROVEMENT_PLAN.md. Follow its execution protocol exactly. This file is the standing rules; the plan is the work.
