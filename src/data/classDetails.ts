// src/data/classDetails.ts
// Content for every NTSA class detail page, wired from
// docs/SAFERIDE_COURSE_CONTENT.md. Anything marked [CONFIRM] is a fact the
// school must verify (mostly with NTSA) before it is treated as true; do not
// replace a [CONFIRM] with a guess, and do not rewrite hedged facts into
// confident claims.
//
// Deliberately absent: prices, lesson counts, and course durations. The site
// carries no pricing, NTSA fees are described as process only, and course
// length is described qualitatively.

export interface ClassDetail {
  overview: string;
  whoFor: string[];
  learn: string[];
  structure: { title: string; desc: string }[];
  requirements: string[];
  faq: { q: string; a: string }[];
}

// ─── Shared requirement lines (the content doc's shared block) ───────────────

const REQ_ID = 'Valid Kenyan national ID or passport';
const REQ_KRA = 'KRA PIN';
const REQ_PHOTOS = 'Passport-size photos';
const REQ_INTERIM =
  'A valid NTSA interim (provisional) licence, obtained via the eCitizen / TIMS portal before practical training begins (we help you set this up at enrolment)';
const REQ_ENROL = 'Enrolment at Safe Ride Africa, an NTSA-registered school';

const REQ_BASE = [REQ_ID, REQ_KRA, REQ_PHOTOS, REQ_INTERIM, REQ_ENROL];

// Per-class age lines. Where the source is unverified the line is hedged and
// carries [CONFIRM]; leave the hedging exactly as written.
const REQ_AGE_A2 = 'Minimum age: 16, with parental consent if under 18';
const REQ_AGE_A3 =
  'Minimum age: per NTSA Category A requirements [CONFIRM: the exact A3 minimum age with NTSA]';
const REQ_AGE_18 = 'Minimum age: 18 years';

// Commercial tiers: owner-supplied reference, not yet confirmed against
// NTSA's published schedule. Render with the uncertainty intact.
const REQ_C_TIERS = [
  'NTSA runs commercial licensing as a tiered system. The tiers below are from an owner-supplied reference and are not yet confirmed against NTSA\'s published schedule [CONFIRM all age and experience tiers with NTSA]:',
  'C1: minimum age 22, must hold B2 for at least 2 years',
  'C: minimum age 24, must hold C1 for at least 2 years',
  'CE: minimum age 28, must hold C for at least 4 years',
  'CD: minimum age 30, must hold CE for at least 2 years',
];

// PSV tiers: same owner-supplied source, same caveat.
const REQ_D_TIERS = [
  'PSV age minimums step up with vehicle capacity. The tiers below are from an owner-supplied reference and are not yet confirmed against NTSA\'s published schedule [CONFIRM all with NTSA]:',
  'D1 (van): minimum age 22',
  'D2 (minibus): minimum age 25',
  'D3 (bus, 33+ passengers): minimum age 30',
  'PSV work generally requires professional driver training and a Certificate of Competence [CONFIRM current NTSA requirements]',
];

// ─── Shared FAQ entries ──────────────────────────────────────────────────────

const FAQ_INTERIM = {
  q: 'Do I need an interim licence first?',
  a: 'Yes. NTSA requires a valid interim (provisional) licence, obtained on eCitizen, before practical training begins. We walk you through it at enrolment.',
};
const FAQ_SMART_DL = {
  q: 'Will you help me get the Smart DL?',
  a: 'Yes. We walk you through the digital Smart DL application from your eCitizen / TIMS account through to collection, it is part of every programme.',
};
const FAQ_BRANCHES = {
  q: 'Where do lessons happen?',
  a: 'At any of our Nairobi branches. You pick the branch and the lesson times that suit you, weekday or weekend.',
};
const FAQ_TEST_ONLY_FIT = {
  q: 'I already know how to drive. Is this the right option?',
  a: 'Yes, test-only is built for drivers who already have road experience and need the licence made official. If an assessment shows gaps, we will recommend topping up with extra lessons first.',
};
const FAQ_PACE = {
  q: 'How long does the course take?',
  a: 'Lessons run at a steady one-lesson-a-day pace, so the full course is a structured multi-week programme. Shorter options are available if you already have experience, and we pace lessons around your schedule.',
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
  'A2-FULL': {
    overview:
      'The A2 course trains you to ride and handle a motorcycle confidently on Kenyan roads and licenses you under NTSA Category A. Training covers machine control, road awareness, and the defensive habits that keep riders safe in mixed traffic.',
    whoFor: [
      'New riders starting from zero',
      'Boda boda operators who want to ride legally',
      'Anyone building toward professional two-wheel work',
    ],
    learn: [
      'Motorcycle controls, balance, and low-speed handling',
      'Road signs, markings, and the Highway Code',
      'Safe positioning, observation, and lane discipline in traffic',
      'Junctions, roundabouts, and overtaking',
      'Defensive riding and hazard anticipation',
      'Emergency braking and wet-road handling',
    ],
    structure: FULL_COURSE_STRUCTURE('motorcycle'),
    requirements: [REQ_AGE_A2, ...REQ_BASE],
    faq: [
      FAQ_INTERIM,
      {
        q: 'I already ride. Can I just do the test?',
        a: 'Yes. The Test Only option covers assessment and NTSA test preparation.',
      },
      {
        q: 'What licence do I get?',
        a: 'An NTSA Category A motorcycle licence after passing the theory and practical tests.',
      },
      FAQ_PACE,
    ],
  },

  'A2-TEST': {
    overview:
      'The A2 Test Only option is for riders who already have the skills and need assessment and NTSA test preparation. We assess your riding against the test standard, polish what the examiner scores, and take you through the test and Smart DL process.',
    whoFor: [
      'Experienced riders who never sat the official test',
      'Boda boda riders formalising their licence',
      'Riders whose licence process stalled and needs restarting',
    ],
    learn: [
      'How the NTSA motorcycle test is scored and what examiners watch for',
      'Correct road positioning, signalling, and observation at test standard',
      'The pre-ride safety check examiners expect',
      'NTSA theory essentials: signs, traffic law, and right of way',
    ],
    structure: TEST_ONLY_STRUCTURE,
    requirements: [REQ_AGE_A2, ...REQ_BASE],
    faq: [
      FAQ_TEST_ONLY_FIT,
      FAQ_INTERIM,
      {
        q: 'What licence do I get?',
        a: 'An NTSA Category A motorcycle licence after passing the theory and practical tests.',
      },
    ],
  },

  'A3-TUKTUK': {
    overview:
      'The A3 course covers three-wheeled vehicles: tuk-tuks used for passenger transport and for parcel and courier delivery. NTSA Category A3 is defined for three-wheelers and couriers. This course suits delivery riders, tuk-tuk operators, and small-business owners moving goods around Nairobi.',
    whoFor: [
      'Delivery and courier riders moving to three-wheelers',
      'Tuk-tuk operators carrying passengers',
      'Small-business owners moving goods around Nairobi',
    ],
    learn: [
      'Three-wheeler controls, balance, and load handling',
      'Road signs, markings, and the Highway Code',
      'Safe operation in dense urban traffic',
      'Junctions, roundabouts, and tight-space maneuvering',
      'Defensive driving and passenger or cargo safety',
      'Parking and reversing a three-wheeler',
    ],
    structure: FULL_COURSE_STRUCTURE('three-wheeler'),
    requirements: [REQ_AGE_A3, ...REQ_BASE],
    faq: [
      {
        q: 'Is this for passengers or deliveries?',
        a: 'Both. A3 covers tuk-tuks used for passenger transport and for parcel and courier work.',
      },
      {
        q: 'What can I drive with it?',
        a: 'Three-wheeled vehicles in NTSA Category A3.',
      },
      FAQ_INTERIM,
      FAQ_BRANCHES,
    ],
  },

  // ── B series: light vehicles ──────────────────────────────────────────────
  'B-LIGHT': {
    overview:
      'The B Manual course trains you on a manual-transmission light vehicle and is the most versatile choice for private drivers, because manual training prepares you to drive both manual and automatic cars. It suits first-time drivers, professionals who need to drive for work, and anyone who wants maximum flexibility on the road.',
    whoFor: [
      'First-time drivers starting from zero',
      'Professionals who need to drive for work',
      'Anyone who wants maximum flexibility: manual training covers automatics too',
    ],
    learn: [
      'Full car controls, clutch control, and gear changes',
      'Road signs, markings, and the Highway Code',
      'Road positioning, observation, and lane discipline',
      'Junctions, roundabouts, and dual carriageways',
      'Parking, reversing, hill starts, and three-point turns',
      'Defensive driving, hazard perception, and emergency stops',
      'Expressway and highway driving',
    ],
    structure: FULL_COURSE_STRUCTURE('dual-control manual car'),
    requirements: [REQ_AGE_18, ...REQ_BASE],
    faq: [
      {
        q: 'Can I drive automatic cars with a manual licence?',
        a: 'Yes. Training and licensing on a manual vehicle lets you drive both manual and automatic. [CONFIRM: the exact NTSA subclass wording, B1 vs B2, is disputed across sources; verify with NTSA.]',
      },
      {
        q: 'I have driven before. Do I need the full course?',
        a: 'The Half Course or Test Only options suit drivers with real prior experience.',
      },
      {
        q: 'What do I need to start?',
        a: 'A valid NTSA interim licence, national ID, KRA PIN, and passport photos.',
      },
      FAQ_PACE,
    ],
  },

  'B-AUTO': {
    overview:
      'The B Auto course trains you on an automatic-transmission light vehicle. It is the simplest, quickest route for drivers who prefer automatics, common with newer private cars and ride-hailing vehicles, and who do not need to drive manual. If you may need to drive manual later, choose B Manual instead.',
    whoFor: [
      'Drivers who will only ever drive automatic cars',
      'Ride-hailing drivers in automatic vehicles',
      'Learners who want the simplest route onto the road',
    ],
    learn: [
      'Automatic vehicle controls and smooth throttle and brake control',
      'Road signs, markings, and the Highway Code',
      'Road positioning, observation, and lane discipline',
      'Junctions, roundabouts, and dual carriageways',
      'Parking, reversing, and confined-space maneuvering',
      'Defensive driving, hazard perception, and emergency stops',
      'Expressway and highway driving',
    ],
    structure: FULL_COURSE_STRUCTURE('automatic car'),
    requirements: [REQ_AGE_18, ...REQ_BASE],
    faq: [
      {
        q: 'Can I drive manual cars after this?',
        a: 'No. An automatic-focused licence restricts you to automatic vehicles. If you want to drive both, take B Manual. [CONFIRM: whether the restricted subclass is B1 or B2 with NTSA; sources conflict.]',
      },
      {
        q: 'Is it faster than the manual course?',
        a: 'The curriculum covers the same ground, but many learners find automatic easier to pick up.',
      },
      {
        q: 'Who is this best for?',
        a: 'Drivers who will only drive automatic cars, including many ride-hailing drivers.',
      },
      FAQ_INTERIM,
    ],
  },

  'B-HALF': {
    overview:
      'A shortened version of the Class B manual programme for drivers with real prior experience: self-taught, lapsed, or partway through another school. An assessment at the start shapes the lesson block so you train on the gaps, then we take you through the NTSA test.',
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
    requirements: [REQ_AGE_18, ...REQ_BASE],
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
      'The Class B Test Only option, for competent drivers who just need the licence made official. We assess your driving against the NTSA standard, polish the specifics examiners score, and manage the test booking and Smart DL application.',
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
    requirements: [REQ_AGE_18, ...REQ_BASE],
    faq: [FAQ_TEST_ONLY_FIT, FAQ_SMART_DL, FAQ_BRANCHES],
  },

  // ── C series: commercial trucks ───────────────────────────────────────────
  'C-LIGHT': {
    overview:
      'The C course trains you to drive commercial vehicles and trucks under NTSA Category C, the door to a career moving goods. It suits drivers moving into logistics, distribution, and haulage. NTSA runs commercial licensing as a tiered system with age and experience requirements, so read the requirements carefully.',
    whoFor: [
      'Drivers moving into logistics, distribution, and haulage',
      'Licence holders upgrading to commercial categories',
      'Business owners who drive their own goods vehicles',
    ],
    learn: [
      'Handling and controls for larger commercial vehicles',
      'Load safety, weight distribution, and pre-trip checks',
      'Road signs, markings, and the Highway Code for commercial drivers',
      'Junctions, roundabouts, and highway driving with a large vehicle',
      'Reversing, coupling awareness, and maneuvering in tight yards',
      'Defensive driving and commercial road safety',
    ],
    structure: FULL_COURSE_STRUCTURE('light truck'),
    requirements: [...REQ_C_TIERS, ...REQ_BASE],
    faq: [
      {
        q: 'Do I need a car licence first?',
        a: 'Yes. Commercial categories require you to already hold, and to have held, a lower category. See the tier requirements above [CONFIRM with NTSA].',
      },
      {
        q: 'Can I go straight to the top commercial class?',
        a: 'No. NTSA uses a tiered progression with minimum ages and experience at each step.',
      },
      FAQ_SMART_DL,
      FAQ_BRANCHES,
    ],
  },

  BC: {
    overview:
      'BC is a Safe Ride Africa package that combines Category B (light vehicle) and Category C (commercial) training. It is a training bundle, not a single NTSA licence: NTSA issues each category separately once you meet the legal eligibility for each. The value is coordinated training toward both, not a shortcut around the requirements.',
    whoFor: [
      'Drivers going professional who need car and truck categories together',
      'Jobseekers making themselves employable across vehicle types',
      'Company drivers whose role mixes cars and goods vehicles',
    ],
    learn: [
      'The full Class B skill set: car control, manoeuvres, and road driving',
      'The Class C additions: truck handling, loads, and commercial road craft',
      'NTSA theory across both categories',
      'Training sequenced so your light-vehicle skills build into commercial handling',
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
    requirements: [
      'Minimum age: 18 years for the Class B portion',
      'You must meet the NTSA eligibility for each category separately. The Class C tiers carry age and experience minimums, see the Class C requirements [CONFIRM with NTSA]',
      ...REQ_BASE,
    ],
    faq: [
      {
        q: 'Is BC a single NTSA licence?',
        a: 'No. It is a training package. NTSA issues Category B and Category C separately once you qualify for each.',
      },
      {
        q: 'Why take BC together?',
        a: 'Coordinated training toward both categories in one programme, sequenced so your light-vehicle skills build into commercial handling.',
      },
      {
        q: 'Can I get the C licence immediately?',
        a: 'Only when you meet NTSA\'s age and experience requirements for it [CONFIRM with NTSA].',
      },
    ],
  },

  'C-HALF': {
    overview:
      'A shortened version of the Class C commercial programme for drivers with existing truck experience who need structured polish and the official licence: assessed first, then trained on exactly what is missing.',
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
    requirements: [...REQ_C_TIERS, ...REQ_BASE],
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
      'The Class C Test Only option for experienced truck drivers: an assessment against the NTSA Class C standard, targeted polish, then the official test and Smart DL handled with you.',
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
    requirements: [...REQ_C_TIERS, ...REQ_BASE],
    faq: [FAQ_TEST_ONLY_FIT, FAQ_SMART_DL, FAQ_BRANCHES],
  },

  // ── D series: passenger service vehicles ──────────────────────────────────
  'D-PSV': {
    overview:
      'The PSV course prepares you to drive Public Service Vehicles under NTSA Category D: matatus, vans, and buses. The exact subclass depends on the vehicle size, from vans to large buses. It suits drivers entering the matatu and bus sector, and it comes with age minimums that step up with vehicle capacity.',
    whoFor: [
      'Drivers joining matatu and bus crews',
      'Company and school bus drivers',
      'Class B or C holders moving into passenger work',
    ],
    learn: [
      'Handling passenger vehicles of the relevant size',
      'Passenger safety, loading, and route conduct',
      'Road signs, markings, and the Highway Code for PSV drivers',
      'Junctions, roundabouts, terminals, and stage discipline',
      'Defensive driving in heavy urban traffic',
      'Pre-trip inspections and passenger-service responsibilities',
    ],
    structure: FULL_COURSE_STRUCTURE('passenger vehicle'),
    requirements: [...REQ_D_TIERS, ...REQ_BASE],
    faq: [
      {
        q: 'Which PSV class do I need?',
        a: 'It depends on the vehicle: van (D1), minibus (D2), or large bus (D3). Each has its own minimum age. We advise you at enrolment based on the work you are going into.',
      },
      {
        q: 'Do I need anything beyond the driving test for PSV?',
        a: 'PSV work typically requires professional training and a Certificate of Competence [CONFIRM current NTSA requirements].',
      },
      {
        q: 'Can I drive a matatu on a normal car licence?',
        a: 'No. Passenger service requires the relevant PSV category.',
      },
    ],
  },

  BPSV: {
    overview:
      'BPSV is a Safe Ride Africa package combining Category B driving with preparation for professional passenger work: taxi, chauffeur, and ride-hailing. It is a training bundle, not a single NTSA category. The relevant professional licence is NTSA Category B3.',
    whoFor: [
      'Taxi and ride-hailing drivers going fully professional',
      'Chauffeurs and private-hire drivers',
      'Class B learners heading straight into passenger work',
    ],
    learn: [
      'The full B course: car control, manoeuvres, and road driving',
      'Professional-driver conduct and passenger-service standards',
      'Defensive driving with passengers aboard',
      'Preparation for NTSA Category B3 professional work',
    ],
    structure: [
      STAGE_THEORY,
      {
        title: 'PSV-focused lessons',
        desc: 'Practical sessions on passenger care, compliance, and the driving standard expected of professional drivers.',
      },
      STAGE_TEST_PREP,
    ],
    requirements: [
      'B3 professional: minimum age 21, professional driver training, and a Certificate of Competence [CONFIRM with NTSA]',
      ...REQ_BASE,
    ],
    faq: [
      {
        q: 'Is BPSV an NTSA licence?',
        a: 'No. It is a training package. The professional licence it prepares you for is NTSA Category B3.',
      },
      {
        q: 'What work does this qualify me for?',
        a: 'Professional passenger driving: taxi, chauffeur, and ride-hailing, once you hold B3.',
      },
      {
        q: 'What is the minimum age?',
        a: '21 for B3 professional [CONFIRM with NTSA].',
      },
    ],
  },

  // ── Executive ─────────────────────────────────────────────────────────────
  EXECUTIVE: {
    overview:
      'Executive Class is Safe Ride Africa\'s premium training package. It is not a separate NTSA licence category: you receive the same NTSA licence as any other learner once you pass. What changes is the experience: private one-on-one instruction, flexible scheduling, and a faster, more comfortable path to competence. It suits busy professionals who want discretion, convenience, and accelerated progress.',
    whoFor: [
      'Busy professionals who need lessons to fit a demanding calendar',
      'Anyone who prefers complete privacy while learning',
      'Learners who want accelerated, personalized progress',
    ],
    learn: [
      'The same core driving curriculum as the standard course for your category, delivered privately and at your pace',
      'Private one-on-one instruction throughout',
      'Flexible schedules built around you',
      'Accelerated training with a premium, personalized experience',
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
    requirements: [
      'The same NTSA requirements as the standard category you are training for, including its minimum age',
      ...REQ_BASE,
    ],
    faq: [
      {
        q: 'Do I get a different licence?',
        a: 'No. You get the same NTSA licence. Executive changes the training experience, not the licence.',
      },
      {
        q: 'What makes it executive?',
        a: 'Private instruction, flexible scheduling, and accelerated training.',
      },
      {
        q: 'Is it faster?',
        a: 'Yes, it is built for accelerated progress on your schedule.',
      },
      FAQ_SMART_DL,
    ],
  },
};
