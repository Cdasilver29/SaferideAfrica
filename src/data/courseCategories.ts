/**
 * Landing-page course categories. Mirrors the national licence
 * category structure at a high level. Wording stays hedged: exact
 * categories, hours and requirements are confirmed at enrolment,
 * so no fees and no regulator specifics are published here.
 */

export interface CourseCategory {
  id: string;
  /** Licence code shown in the PlateBadge */
  code: string;
  title: string;
  blurb: string;
  audience: "beginner" | "endorsement" | "refresher";
  /** Route within the app, or undefined if the card only opens the enrol modal */
  href?: string;
}

export const courseCategories: CourseCategory[] = [
  {
    id: "motorcycle",
    code: "A2",
    title: "Motorcycle & Courier",
    blurb:
      "Rider training for personal and courier use, from first lesson to test readiness.",
    audience: "beginner",
    href: "/courses",
  },
  {
    id: "saloon",
    code: "B1",
    title: "Saloon Car, Manual & Automatic",
    blurb:
      "Our most popular course. Structured lessons that take a fresh learner to a confident, test-ready driver.",
    audience: "beginner",
    href: "/courses",
  },
  {
    id: "trucks",
    code: "C1",
    title: "Truck & Bus Endorsement",
    blurb:
      "Category endorsements for licensed drivers moving up to medium trucks, buses and commercial work.",
    audience: "endorsement",
    href: "/courses",
  },
  {
    id: "refresher",
    code: "B",
    title: "Refresher Driving",
    blurb:
      "For licensed drivers returning to the road or tightening up habits. Rebuild confidence with an instructor beside you.",
    audience: "refresher",
    href: "/courses",
  },
];
