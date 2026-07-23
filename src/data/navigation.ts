import type { Href } from "expo-router";
import { SERVICES } from "./saferide";

/**
 * Two navigation sets, mirroring the AA structure:
 *
 *   secondaryNav  deep blue tier, white text   supporting pages
 *   primaryNav    yellow tier, dark text       main sections
 *
 * Every href points at a route that already exists. Typed routes are on,
 * so adding an item without its file in app/ fails the build.
 */

export interface NavItem {
  label: string;
  href: Href;
  children?: { label: string; href: Href }[];
}

/**
 * Deep blue tier. AA puts corporate housekeeping here. SafeRide's
 * equivalent is supporting content that shouldn't crowd the main nav.
 * Wording is our own, not AA's.
 */
export const secondaryNav: NavItem[] = [
  { label: "Photos", href: "/gallery" },
  { label: "News", href: "/blog" },
  { label: "Enquiries", href: "/contact" },
];

/** Yellow tier. The five main sections, dark text. */
export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About us",
    href: "/about",
    children: [
      { label: "Our story", href: "/about" },
      { label: "Photo gallery", href: "/gallery" },
      { label: "News and updates", href: "/blog" },
    ],
  },
  {
    label: "Driving school",
    href: "/courses",
    children: [
      { label: "All courses", href: "/courses" },
      { label: "What we offer", href: "/services" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: SERVICES.map((svc) => ({
      label: svc.name,
      href: { pathname: "/services/[code]", params: { code: svc.code } },
    })),
  },
  { label: "Branches", href: "/branches" },
  { label: "Get in touch", href: "/contact" },
];

/**
 * Pages worth adding, adapted from AA's menu with our own wording.
 * Each needs its route file before it can be linked.
 *
 *   Work with us        app/careers.tsx            you hire instructors constantly
 *   Road safety         app/road-safety.tsx        free advice, strong SEO, earns trust
 *   Driver assessment   app/driver-assessment.tsx  employers testing hires, B2B revenue
 *   Private tuition     app/private-tuition.tsx    premium one-to-one lessons
 *   Corporate training  app/corporate-training.tsx defensive driving for fleets
 *
 * Investor relations deliberately excluded. You are not raising publicly.
 */
