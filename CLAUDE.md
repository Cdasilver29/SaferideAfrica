# CLAUDE.md: Safe Ride Africa (web)

## What this project is
A public marketing and enrollment-lead site for Safe Ride Africa, a Nairobi driving school. Stack: Expo Router and React Native Web, deployed on Vercel. We are staying on React Native Web; there is no Next.js. There is no online payment, no Supabase, and no accounts or admin. Enrollment is a lead form that goes to WhatsApp and email. If you find M-Pesa, Supabase, pricing, or a demo auth/admin layer, do not reintroduce it.

## How we work, every session
- Do one phase at a time from the plan file I name. Execute only the phase I name, stop at its gate, print a diff summary and the verification output, then wait for me to say proceed. Do not start the next phase.
- If the repo does not match what the plan describes, STOP and report it. Do not improvise a workaround.
- When you are unsure between two approaches, explain both and let me choose. Do not make architectural calls silently.
- Flag uncertainty plainly. Never say a check passed if it did not run. Do not present a guess as a fact.
- On any UI work, apply the ui-ux-pro-max skill in .claude/skills/. Use Material 3 (m3.material.io) as a reference for mobile feel; do not add a Material component library.
- Your status reports and prose follow the no-em-dash rule too, not just committed code.

## Standing decisions (already made, do not re-ask)
- No published branch count. The number of branches is never hardcoded in stats, copy, blog, meta, or JSON-LD. A count either derives from BRANCHES.length or is omitted, with copy saying "branches across Nairobi" and no figure.
- Lesson counts and durations stay out of public-facing pages. This holds the earlier removal decision. Describe course length qualitatively ("structured multi-week programme"), never a lesson number or a week estimate.
- No pricing anywhere on the site, including NTSA fees. NTSA fees are referenced as process only, via eCitizen, with no numbers.
- Class-page course-variant fan-out is approved. The A2, B, and C variants (Full, Half, Test Only) inherit overview, requirements, and FAQ from their parent class. Test Only entries describe assessment and test prep only, never the full "what you will learn" curriculum.
- Refresher courses belong in the services section, not the class detail pages.
- Testimonials on the site are real students (Peter Mutuku, Ben Mwangi, Christine Atieno), shown with initials avatars. Do not restore the old portrait images (erickmusyoka, mainamburu, mitchelakinyi). Never invent customer names, quotes, or ratings.

## Content integrity (Truth Protocol for site copy)
- Do not fabricate facts, figures, quotes, or ratings in any site copy.
- Where a fact is unconfirmed, use a [CONFIRM] placeholder rather than a plausible guess.
- Items marked VERIFY in the content docs render with their hedging intact and stay [CONFIRM] until I confirm them with NTSA. Do not rewrite hedged facts into confident claims. Still open: the specific minimum ages for the heavier commercial classes (C, CE, CD) and the PSV professional-training / Certificate of Competence requirement.
- The automatic-transmission restriction is described by function only: an automatic licence restricts you to automatic vehicles, manual training licenses you for both. Never attach a B1 or B2 subclass number to it, sources conflict on which is which.

## Verify before declaring a phase done
- Run `npm run type-check` and `npm run build:web`. Both must be green. After a deletion, a green type-check is the proof nothing dangling references the removed code.
- Check the layout at 360, 414, 768, and 1280 px.
- Keep tap targets at a minimum of 44px.

## Design system and code conventions
- IMPORTANT: no em dashes anywhere, in code, comments, or copy. Use commas, colons, or shorter sentences.
- The font is Manrope, referenced through the F constants or the font config; never hardcode a family.
- The design system is NativeWind plus react-native-reusables primitives plus design tokens. New and rebuilt components use the primitives and the tokens. Components not yet migrated still use inline styles and the C constants; do not extend the C constants.
- Brand palette: sky #01a5f0, yellow #ffd800, dark #221f20. No raw hex in components; map to the tokens. Do not invent new colors.
- Shape language, Airbnb-style: rounded corners (roughly 8px buttons, 12 to 20px cards, pill on search and chips), an 8px spacing rhythm, one type family with weight-only hierarchy, a single reserved accent for the primary action, photo-first depth.
- Icons are Lucide, standardized to one stroke width with rounded caps.
- Animation is react-native-reanimated, transform and opacity only, and must respect reduce-motion. No GSAP.
- Images: react-native-web overrides NativeWind sizing on Image. Constrain with an explicit sized container or inline width and height, or the image renders at full natural height. This already bit the course images once.
- Keep backdrop-filter behind the existing @supports gate in global.css.
- UI strings go through the i18n t() function.

## Do not change
- The BRANCHES list in src/data/saferide.ts is the authoritative current set of 12 branches. Do not change it, MANAGEMENT, or CLASS_SERIES without my explicit say-so.
- CLASSES: names, codes, and descriptions stay. Price and lesson-count fields are gone and do not come back.

## Git
- Make minimal changes. Do not refactor unrelated code.
- Commit after each logical chunk with a clear, specific message.
- Tag the repo at each phase boundary.

## The plans
Finished: docs/IMPROVEMENT_PLAN.md (Phases 0 to 17b, merged). Active: docs/UI_REVAMP_2.md and the course content in docs/SAFERIDE_COURSE_CONTENT.md. Follow the execution protocol in the plan I name. This file is the standing rules; the plans are the work.
