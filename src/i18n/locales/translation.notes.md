# Translation Notes

## Items that need review before going to production

### `hero.headlineWords` (all non-English locales)
The animated headline was designed for exactly 6 English words with the last 2 highlighted
in yellow ("Right Skills"). Each locale provides a 6-token split as a best-effort match,
but the animation relies on English word-boundary rhythm. For Arabic especially, the
right-to-left word order combined with left-to-right animation layout will look odd.
**Action required:** Review the word-by-word animation design before launching non-English.

### `testimonials.items[0].text` (all non-English locales)
Eric Musyoka's original quote contains mixed Swahili/English street language:
"Walinisaidia kuapply hii smart dl manze..haraka haraka kwanza hadi sikuamini."
The Swahili locale preserves this verbatim (it IS Swahili). All other locales translate
the meaning while preserving the authentic tone. Re-verify the tone is right with a
native speaker in each language.

### NTSA / Smart DL / TIMS (all locales)
These are Kenyan government agency acronyms and product names. They are intentionally
kept in English/Latin script across all translations. Do not localise these terms.

### Blog post dates
Dates have been reformatted per locale convention:
- zh: "2025年X月X日"
- ar: "DD Month YYYY" (Latin numerals, Arabic month names)
- sw: "Mon DD, YYYY" (English month abbreviations are standard in Kenyan Swahili)
- fr: "DD mois YYYY" (standard French format)
For production, replace hard-coded date strings with a locale-aware date formatter
(e.g. `new Intl.DateTimeFormat(lng).format(date)`).

### Course prices (`courses.items.*.price` / `.yearlyPrice`)
These are defined in `constants.ts` and are NOT in translation files. They display as
"Ksh 12,000" etc. across all languages. Currency formatting for non-Kenyan users is
out of scope for this round.

### Arabic RTL layout
Arabic strings are correct right-to-left text but the app layout is currently LTR.
RTL layout flip is explicitly deferred — see the original task brief. The strings are
ready; only the layout direction needs to be added when that work is scheduled.

### `about.heading` / `about.headingAccent`
The English heading splits "Safety" out as a yellow-coloured accent word. Each locale
has a matching `headingAccent` key with the translated accent word. Verify the
component uses `t('about.headingAccent')` for the coloured span once refactored.
