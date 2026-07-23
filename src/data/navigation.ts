import type { Href } from "expo-router";

/**
 * Three-tier navigation, modelled on the AA Kenya header structure.
 *
 * ROUTE REALITY CHECK
 * Typed routes are enabled, so every href must resolve to a file in app/.
 * Items below are split into two lists: EXISTING routes you already have,
 * and PROPOSED items that need a route file created before they can be
 * linked. Do not move a proposed item into the live nav until its page
 * exists, or tsc will fail.
 */

export interface NavItem {
  label: string;
  href: Href;
  /** Optional dropdown children. Desktop opens on hover or click, mobile as accordion. */
  children?: { label: string; href: Href }[];
}

/**
 * TIER 2, utility bar. AA uses this for corporate housekeeping links.
 * SafeRide equivalents, using synonyms rather than AA's exact wording:
 *   AA "Enquiries"          -> "Enquiries"      (same, it is the plain word)
 *   AA "Careers"            -> "Work with us"
 *   AA "Road Safety Awards" -> "Road safety"
 *   AA "Events"             -> "Events"         (same, plain word)
 *   AA "Investor Relations" -> dropped. You are not raising capital publicly,
 *                              so this would be an empty page pretending at scale.
 */
export const utilityNav: NavItem[] = [
  // ACTIVE once app/contact.tsx exists, which it already does
  { label: "Enquiries", href: "/contact" },
];

/** Needs route files created first. Move into utilityNav once the page exists. */
export const proposedUtilityNav: { label: string; route: string; why: string }[] = [
  {
    label: "Work with us",
    route: "app/careers.tsx",
    why: "Driving schools hire instructors constantly. AA runs this and it converts.",
  },
  {
    label: "Road safety",
    route: "app/road-safety.tsx",
    why: "Free advice content. Strong SEO for a driving school and it earns trust before the sale.",
  },
  {
    label: "Events",
    route: "app/events.tsx",
    why: "Only worth it if you actually run driver days or clinics. Skip otherwise.",
  },
];

/**
 * TIER 3, primary nav. Your existing routes, regrouped so the bar holds
 * one line instead of wrapping to two. Gallery and Blog move under About,
 * which is where AA puts Gallery too.
 */
export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About us",
    href: "/about",
    children: [
      { label: "Our story", href: "/about" },
      { label: "Gallery", href: "/gallery" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    label: "Driving school",
    href: "/courses",
    children: [
      { label: "All courses", href: "/courses" },
      { label: "Services", href: "/services" },
    ],
  },
  { label: "Branches", href: "/branches" },
  { label: "Get in touch", href: "/contact" },
];

/**
 * Proposed primary-nav children, adapted from AA's driving school menu.
 * Each needs a route file before linking.
 *
 *   AA "Driver Assessment" -> "Driver assessment"
 *       Companies send prospective hires for testing before employment.
 *       This is real B2B revenue and you have the instructors for it.
 *   AA "Premier Driving"   -> "Private tuition"
 *       One-to-one lessons at a premium rate.
 *   AA "AA Institute"      -> "Corporate training"
 *       Defensive driving for company fleets.
 */
export const proposedCourseChildren: { label: string; route: string; why: string }[] = [
  {
    label: "Driver assessment",
    route: "app/driver-assessment.tsx",
    why: "B2B: employers testing hires. Highest-margin item on AA's driving school menu.",
  },
  {
    label: "Private tuition",
    route: "app/private-tuition.tsx",
    why: "Premium one-to-one lessons, flexible scheduling.",
  },
  {
    label: "Corporate training",
    route: "app/corporate-training.tsx",
    why: "Defensive driving for fleets. Recurring contracts rather than one-off learners.",
  },
];
