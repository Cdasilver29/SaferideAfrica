/**
 * Section rhythm. THE single source of truth for the vertical padding on a
 * section root, replacing the py-14 / py-16 / py-[72px] / paddingVertical: 72
 * spread that used to be copy-pasted into each section.
 *
 * Read these through `style={{ paddingVertical: SECTION_PY }}` rather than a
 * Tailwind class. The value is dynamic now, so a className cannot carry it,
 * and routing every section through the same inline style is what keeps the
 * className-based and inline-style sections reading from one constant.
 *
 * Horizontal padding is deliberately NOT here. The px-6 gutter is uniform
 * already and is not what these tokens are for.
 */

/** Standard content section, top and bottom. */
export const SECTION_PY = 48;

/** Closing CTA strips, which sit tighter than a content section. */
export const SECTION_PY_CTA = 36;
