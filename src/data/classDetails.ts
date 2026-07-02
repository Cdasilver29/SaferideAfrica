// src/data/classDetails.ts
// Phase F: expanded content for every NTSA class detail page. English, like
// the rest of the business content in this folder. Anything marked [CONFIRM]
// is a fact the school must verify before it is treated as true; do not
// replace a [CONFIRM] with a guess.
//
// Deliberately absent: prices, lesson counts, and course durations. The
// improvement plan removed pricing and lesson counts from the site; do not
// reintroduce them here.

export interface ClassDetail {
  overview: string;
  whoFor: string[];
  learn: string[];
  structure: { title: string; desc: string }[];
  requirements: string[];
  faq: { q: string; a: string }[];
}

// ─── Shared requirement lines ────────────────────────────────────────────────

const REQ_ID = 'Original national ID card or valid passport';
const REQ_KRA = 'KRA PIN certificate';
const REQ_TIMS = 'An eCitizen / NTSA TIMS account (we help you create one at enrolment)';
const REQ_PHOTOS = '[CONFIRM] Passport-size photos for school records';
const REQ_MEDICAL = 'Medical fitness certificate including an eye test, required by NTSA for commercial and passenger classes';
const REQ_B_FOR_C = 'A valid Class B licence, held for [CONFIRM: years of B experience NTSA requires] before upgrading to Class C';
const REQ_B_FOR_D = 'A valid driving licence, held for [CONFIRM: years of experience NTSA requires for PSV drivers]';
const REQ_GOOD_CONDUCT = '[CONFIRM] Certificate of Good Conduct, commonly required for PSV drivers';

const REQ_AGE_18 = 'Minimum age: 18 years';
const REQ_AGE_A = 'Minimum age: [CONFIRM: NTSA minimum age for Class A riders]';
const REQ_AGE_C = 'Minimum age: [CONFIRM: NTSA minimum age for Class C drivers]';
const REQ_AGE_D = 'Minimum age: [CONFIRM: NTSA minimum age for PSV drivers]';

const REQ_BASE = [REQ_ID, REQ_KRA, REQ_TIMS, REQ_PHOTOS];

// ─── Shared FAQ entries ──────────────────────────────────────────────────────

const FAQ_SMART_DL = {
  q: 'Will you help me get the Smart DL?',
  a: 'Yes. We walk you through the digital Smart DL application from your eCitizen / TIMS account through to collection, it is part of every programme.',
};
const FAQ_BRANCHES = {
  q: 'Where do lessons happen?',
  a: 'At any of our Nairobi branches. You pick the branch and the lesson times that suit you, weekday or weekend.',
};
const FAQ_NO_EXPERIENCE = {
  q: 'Do I need any driving experience to start?',
  a: 'No. The full course starts from zero, your first lesson assumes you have never been behind the wheel.',
};
const FAQ_TEST_ONLY_FIT = {
  q: 'I already know how to drive. Is this the right option?',
  a: 'Yes, test-only is built for drivers who already have road experience and need the licence made official. If an assessment shows gaps, we will recommend topping up with extra lessons first.',
};

// ─── Shared structure stages ─────────────────────────────────────────────────

const STAGE_THEORY = {
  title: 'Theory sessions',
  desc: 'Classroom and online sessions covering the NTSA theory curriculum: road signs, traffic law, and the rules of the road.',
};
const STAGE_TEST_PREP = {
  title: 'Test preparation',
  desc: 'A mock test against the NTSA assessment criteria, then we help you book the official test and apply for your Smart DL.',
};

const FULL_COURSE_STRUCTURE = (vehicle: string) => [
  STAGE_THEORY,
  {
    title: 'Yard practice',
    desc: `Controls, the cockpit drill, moving off, stopping, and slow-speed manoeuvres in the ${vehicle}, off the public road.`,
  },
  {
    title: 'Road lessons',
    desc: 'One-on-one lessons with your instructor on real routes, graduating from quiet roads to busy Nairobi traffic.',
  },
  STAGE_TEST_PREP,
];

const TEST_ONLY_STRUCTURE = [
  {
    title: 'Assessment drive',
    desc: 'Your instructor rides along to assess your current driving against the NTSA test standard.',
  },
  {
    title: 'Polish sessions',
    desc: 'Short, focused lessons on the specific manoeuvres and habits the assessment flagged.',
  },
  STAGE_TEST_PREP,
];

const HALF_COURSE_STRUCTURE = [
  {
    title: 'Assessment drive',
    desc: 'We start by assessing what you already know so lessons target the gaps, not what you can already do.',
  },
  {
    title: 'Focused practical lessons',
    desc: 'A shortened lesson block concentrating on the skills the assessment flagged, on real roads.',
  },
  {
    title: 'Theory refresher',
    desc: 'A condensed pass through the NTSA theory curriculum: signs, law, and defensive driving.',
  },
  STAGE_TEST_PREP,
];

// ─── Per-class content ───────────────────────────────────────────────────────

export const CLASS_DETAILS: Record<string, ClassDetail> = {
  // ── A series: motorcycles and three-wheelers ──────────────────────────────
  'A2-TEST': {
    overview:
      'For riders who already handle a motorcycle confidently and need the licence made official. We assess your riding, polish what the NTSA examiner will look for, and take you through the test and Smart DL process.',
    whoFor: [
      'Experienced riders who never sat the official test',
      'Boda boda riders formalising their licence',
      'Riders whose licence process stalled and needs restarting',
    ],
    learn: [
      'How the NTSA motorcycle test is scored and what examiners watch for',
      'Correct road positioning, signalling, and observation on a motorcycle',
      'The pre-ride safety check examiners expect',
      'NTSA theory essentials: signs, traffic law, and right of way',
    ],
    structure: TEST_ONLY_STRUCTURE,
    requirements: [...REQ_BASE, REQ_AGE_A],
    faq: [FAQ_TEST_ONLY_FIT, FAQ_SMART_DL, FAQ_BRANCHES],
  },

  'A2-FULL': {
    overview:
      'The complete Class A2 motorcycle course, from your first time on the bike to the NTSA road test. Theory and practical riding follow the NTSA curriculum, with safety gear and habits built in from lesson one.',
    whoFor: [
      'First-time riders starting from zero',
      'Commuters switching to a motorcycle for daily transport',
      'Anyone starting boda boda or delivery work the right way',
    ],
    learn: [
      'Machine controls, balance, and slow-speed handling',
      'NTSA theory: road signs, traffic law, and rules of the road',
      'Road positioning, signalling, and hazard awareness in traffic',
      'Defensive riding habits that keep riders alive on Kenyan roads',
      'The NTSA test routine and how it is scored',
    ],
    structure: FULL_COURSE_STRUCTURE('motorcycle'),
    requirements: [...REQ_BASE, REQ_AGE_A],
    faq: [
      {
        q: 'Do I need my own motorcycle?',
        a: 'No, training and the test are done on school machines. If you prefer to learn on your own bike, ask at your branch.',
      },
      FAQ_NO_EXPERIENCE,
      FAQ_SMART_DL,
    ],
  },

  'A3-TUKTUK': {
    overview:
      'Class A3 training for tuk-tuks and cargo three-wheelers. The course covers the handling differences that catch out riders coming from two wheels, plus the passenger and parcel work most A3 riders do daily.',
    whoFor: [
      'Riders starting tuk-tuk passenger work',
      'Parcel and delivery riders moving to three-wheelers',
      'Motorcycle riders adding the three-wheeler category',
    ],
    learn: [
      'Three-wheeler controls, stability, and load behaviour',
      'Safe passenger pick-up, carriage, and drop-off',
      'Securing cargo and the limits of a loaded three-wheeler',
      'NTSA theory: signs, traffic law, and right of way',
      'The NTSA test routine for Class A3',
    ],
    structure: FULL_COURSE_STRUCTURE('three-wheeler'),
    requirements: [...REQ_BASE, REQ_AGE_A],
    faq: [
      {
        q: 'I already ride a motorcycle. Is the course shorter for me?',
        a: 'Your existing skills carry over and the assessment at the start shapes your lesson plan, so experienced riders typically move through faster.',
      },
      FAQ_SMART_DL,
      FAQ_BRANCHES,
    ],
  },

  // ── B series: light vehicles ──────────────────────────────────────────────
  'B-LIGHT': {
    overview:
      'Our most popular course: the full Class B programme in a dual-control manual car. You learn to drive properly on real Nairobi roads, not just to pass the test, following the NTSA curriculum from first lesson to road test.',
    whoFor: [
      'First-time drivers starting from zero',
      'Anyone who wants the manual licence that also covers automatics',
      'Learners who want a structured, examiner-standard course',
    ],
    learn: [
      'Clutch control, gear changes, and the cockpit drill',
      'NTSA theory: road signs, traffic law, and rules of the road',
      'Hill starts, reversing, parallel parking, and three-point turns',
      'Real-road driving graduated from quiet streets to city traffic',
      'Defensive driving habits that prevent accidents',
      'The NTSA road test routine and examiner expectations',
    ],
    structure: FULL_COURSE_STRUCTURE('dual-control manual car'),
    requirements: [...REQ_BASE, REQ_AGE_18],
    faq: [
      FAQ_NO_EXPERIENCE,
      {
        q: 'Manual or automatic, which should I pick?',
        a: 'A manual Class B licence also lets you drive automatics, while an automatic-only course is simpler to learn. If you are unsure, talk to us and we will advise based on what you plan to drive.',
      },
      FAQ_SMART_DL,
    ],
  },

  'B-AUTO': {
    overview:
      'The full Class B programme in an automatic car: the same NTSA curriculum as the manual course without the clutch, which most learners find quicker to pick up. Ideal if you plan to drive an automatic day to day.',
    whoFor: [
      'First-time drivers who will drive an automatic car',
      'Learners who found the clutch a barrier in past attempts',
      'Drivers prioritising city commuting comfort',
    ],
    learn: [
      'Vehicle controls and the cockpit drill in an automatic',
      'NTSA theory: road signs, traffic law, and rules of the road',
      'Hill starts, reversing, parallel parking, and three-point turns',
      'Real-road driving graduated from quiet streets to city traffic',
      'Defensive driving habits that prevent accidents',
    ],
    structure: FULL_COURSE_STRUCTURE('automatic car'),
    requirements: [...REQ_BASE, REQ_AGE_18],
    faq: [
      {
        q: 'Can I drive a manual car with an automatic licence?',
        a: '[CONFIRM: whether the automatic-course licence NTSA issues is restricted to automatics or covers manual vehicles too.]',
      },
      FAQ_NO_EXPERIENCE,
      FAQ_SMART_DL,
    ],
  },

  'B-HALF': {
    overview:
      'A shortened Class B programme for people who already have some driving experience, self-taught, lapsed, or partway through another school, and want to finish properly and pass the NTSA test.',
    whoFor: [
      'Self-taught drivers who want to correct bad habits and go legal',
      'Learners who stopped mid-course elsewhere and want to finish',
      'Drivers returning after years away from the wheel',
    ],
    learn: [
      'Whatever the assessment shows you are missing, taught one-on-one',
      'Correcting ingrained habits an examiner would fail',
      'NTSA theory refresher: signs, law, and defensive driving',
      'The NTSA test routine and examiner expectations',
    ],
    structure: HALF_COURSE_STRUCTURE,
    requirements: [...REQ_BASE, REQ_AGE_18],
    faq: [
      {
        q: 'How do you decide what my half course covers?',
        a: 'With an assessment drive at the start. Your instructor maps your driving against the NTSA standard and builds the lesson block around the gaps.',
      },
      FAQ_SMART_DL,
      FAQ_BRANCHES,
    ],
  },

  'B-TEST': {
    overview:
      'For competent drivers who just need the Class B licence made official. We assess your driving against the NTSA standard, polish the specifics examiners score, and manage the test booking and Smart DL application.',
    whoFor: [
      'Experienced drivers who never sat the official test',
      'Drivers whose foreign experience needs a Kenyan licence',
      'Anyone whose licence process stalled and needs restarting',
    ],
    learn: [
      'How the NTSA road test is scored and what examiners watch for',
      'The manoeuvres tested: parking, hill start, and turning routines',
      'Pre-drive checks and test-day procedure',
      'NTSA theory essentials for the written component',
    ],
    structure: TEST_ONLY_STRUCTURE,
    requirements: [...REQ_BASE, REQ_AGE_18],
    faq: [FAQ_TEST_ONLY_FIT, FAQ_SMART_DL, FAQ_BRANCHES],
  },

  // ── C series: commercial trucks ───────────────────────────────────────────
  'C-LIGHT': {
    overview:
      'Class C training for light trucks, the entry point into commercial driving. The course covers the size, weight, and load handling that make trucks different from cars, following the NTSA curriculum through to the road test.',
    whoFor: [
      'Drivers moving into delivery and logistics work',
      'Class B holders upgrading to commercial categories',
      'Business owners who drive their own goods vehicles',
    ],
    learn: [
      'Truck controls, mirrors, and blind-spot management',
      'Load awareness: braking distances, cornering, and stability',
      'Reversing and parking a longer, taller vehicle',
      'NTSA commercial vehicle theory and compliance basics',
      'The NTSA test routine for Class C',
    ],
    structure: FULL_COURSE_STRUCTURE('light truck'),
    requirements: [...REQ_BASE, REQ_MEDICAL, REQ_B_FOR_C, REQ_AGE_C],
    faq: [
      {
        q: 'Do I need a Class B licence first?',
        a: 'NTSA treats Class C as an upgrade from lighter categories. [CONFIRM: the exact prerequisite licence and experience NTSA requires for Class C.]',
      },
      FAQ_SMART_DL,
      FAQ_BRANCHES,
    ],
  },

  BC: {
    overview:
      'A combined programme covering both the Class B light vehicle and Class C light truck curricula in one enrolment, for drivers who need car and truck categories together. [CONFIRM: the exact categories this package covers and how the two courses are sequenced.]',
    whoFor: [
      'Drivers who need both car and light truck categories for work',
      'Jobseekers making themselves employable across vehicle types',
      'Company drivers whose role mixes cars and goods vehicles',
    ],
    learn: [
      'The full Class B skill set: car control, manoeuvres, and road driving',
      'The Class C additions: truck handling, loads, and compliance',
      'NTSA theory across both categories',
      'Test routines and examiner expectations for each category',
    ],
    structure: [
      STAGE_THEORY,
      {
        title: 'Class B block',
        desc: 'The light vehicle course first: yard practice, road lessons, and the Class B test standard.',
      },
      {
        title: 'Class C block',
        desc: 'Truck lessons building on your car skills: size, loads, and commercial road craft.',
      },
      STAGE_TEST_PREP,
    ],
    requirements: [...REQ_BASE, REQ_MEDICAL, REQ_AGE_C],
    faq: [
      {
        q: 'Is the combined course faster than doing B and C separately?',
        a: 'The two blocks share theory and build on each other, so the combined path avoids repeating ground. [CONFIRM: how scheduling and testing are sequenced for the BC package.]',
      },
      FAQ_SMART_DL,
      FAQ_BRANCHES,
    ],
  },

  'C-HALF': {
    overview:
      'A shortened Class C programme for drivers with existing truck experience who need structured polish and the official licence, assessed first, then trained on exactly what is missing.',
    whoFor: [
      'Working truck drivers formalising their licence',
      'Class C learners who stopped mid-course elsewhere',
      'Drivers returning to trucks after time away',
    ],
    learn: [
      'Whatever the assessment shows you are missing, taught one-on-one',
      'Truck manoeuvres examiners score: reversing, parking, and hill work',
      'NTSA commercial theory refresher',
      'The Class C test routine',
    ],
    structure: HALF_COURSE_STRUCTURE,
    requirements: [...REQ_BASE, REQ_MEDICAL, REQ_B_FOR_C, REQ_AGE_C],
    faq: [
      {
        q: 'How do you decide what my half course covers?',
        a: 'With an assessment drive at the start. Your instructor maps your driving against the NTSA standard and builds the lesson block around the gaps.',
      },
      FAQ_SMART_DL,
      FAQ_BRANCHES,
    ],
  },

  'C-TEST': {
    overview:
      'Test-only preparation for experienced truck drivers: an assessment against the NTSA Class C standard, targeted polish, then the official test and Smart DL handled with you.',
    whoFor: [
      'Experienced truck drivers who never sat the official test',
      'Drivers whose employer now requires the formal category',
      'Anyone whose Class C process stalled and needs restarting',
    ],
    learn: [
      'How the NTSA Class C test is scored and what examiners watch for',
      'The truck manoeuvres tested, at examiner standard',
      'Pre-drive checks and test-day procedure',
      'NTSA commercial theory essentials',
    ],
    structure: TEST_ONLY_STRUCTURE,
    requirements: [...REQ_BASE, REQ_MEDICAL, REQ_B_FOR_C, REQ_AGE_C],
    faq: [FAQ_TEST_ONLY_FIT, FAQ_SMART_DL, FAQ_BRANCHES],
  },

  // ── D series: passenger service vehicles ──────────────────────────────────
  'D-PSV': {
    overview:
      'The passenger service course covering the D categories, from vans (D1) through mid-size buses (D2) to large buses (D3), plus the PSV requirements for carrying paying passengers. Training follows the NTSA curriculum with a strong emphasis on passenger safety.',
    whoFor: [
      'Drivers joining matatu and bus crews',
      'Company and school bus drivers',
      'Class B or C holders moving into passenger work',
    ],
    learn: [
      'Handling passenger vehicles: length, mirrors, and stopping distances',
      'Passenger safety: boarding, alighting, and conduct on board',
      'PSV rules, badges, and NTSA compliance for passenger work',
      'Route discipline and defensive driving with passengers aboard',
      'The NTSA test routine for the D categories',
    ],
    structure: FULL_COURSE_STRUCTURE('passenger vehicle'),
    requirements: [...REQ_BASE, REQ_MEDICAL, REQ_B_FOR_D, REQ_GOOD_CONDUCT, REQ_AGE_D],
    faq: [
      {
        q: 'Which D category do I need?',
        a: 'It depends on the vehicle size you will drive: D1 for vans, D2 for mid-size buses, D3 for large buses. We advise you at enrolment based on the work you are going into.',
      },
      FAQ_SMART_DL,
      FAQ_BRANCHES,
    ],
  },

  BPSV: {
    overview:
      'PSV qualification for Class B drivers carrying paying passengers in light vehicles, taxi and ride-hailing work. [CONFIRM: the exact scope of the BPSV package and the categories or endorsements it results in.]',
    whoFor: [
      'Taxi and ride-hailing drivers going fully compliant',
      'Class B holders starting passenger work',
      'Fleet drivers whose employer requires PSV status',
    ],
    learn: [
      'PSV rules and compliance for light passenger vehicles',
      'Passenger care: safety, conduct, and professionalism',
      'Defensive driving with passengers aboard',
      'The NTSA requirements and process for PSV status',
    ],
    structure: [
      STAGE_THEORY,
      {
        title: 'PSV-focused lessons',
        desc: 'Practical sessions on passenger care, compliance, and the driving standard expected of PSV drivers.',
      },
      STAGE_TEST_PREP,
    ],
    requirements: [...REQ_BASE, REQ_MEDICAL, REQ_B_FOR_D, REQ_GOOD_CONDUCT, REQ_AGE_D],
    faq: [
      {
        q: 'I already have a Class B licence. What does this add?',
        a: 'Carrying paying passengers requires PSV status on top of your ordinary licence. This course takes you through the training and the NTSA process to get it.',
      },
      FAQ_SMART_DL,
      FAQ_BRANCHES,
    ],
  },

  // ── Executive ─────────────────────────────────────────────────────────────
  EXECUTIVE: {
    overview:
      'Private one-on-one training built entirely around you: a dedicated instructor, flexible scheduling, and lessons that move at your pace. The same NTSA curriculum and test preparation, delivered with full discretion and comfort.',
    whoFor: [
      'Professionals who need lessons to fit a demanding calendar',
      'Anyone who prefers complete privacy while learning',
      'Learners who want a dedicated instructor throughout',
    ],
    learn: [
      'The full NTSA curriculum, paced to you',
      'Car control, manoeuvres, and real-road driving',
      'Defensive driving tailored to the routes you actually drive',
      'The NTSA test routine and examiner expectations',
    ],
    structure: [
      {
        title: 'Personal plan',
        desc: 'You and your dedicated instructor agree a schedule and lesson plan around your calendar.',
      },
      STAGE_THEORY,
      {
        title: 'Private lessons',
        desc: 'One-on-one practical lessons at times and locations that suit you, including pick-up on request.',
      },
      STAGE_TEST_PREP,
    ],
    requirements: [...REQ_BASE, REQ_AGE_18],
    faq: [
      {
        q: 'Can lessons start from my home or office?',
        a: 'Yes, pick-up can be arranged on request as part of the executive programme.',
      },
      {
        q: 'Can I choose the vehicle type?',
        a: 'The executive programme covers the vehicle class you need. Tell us what you plan to drive and we will plan around it.',
      },
      FAQ_SMART_DL,
    ],
  },
};
