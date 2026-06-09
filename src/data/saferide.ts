// src/data/saferide.ts
// Single source of truth for all SafeRide Africa business content.
// Components import from here. Strings are in English; other locales marked TODO in en.json.

// ─── Company ─────────────────────────────────────────────────────────────────

export const COMPANY = {
  legalName:         'Safe Ride Africa Driving School Ltd',
  tagline:           'Safety Beyond.....',
  address:           'P.O. Box 1126-00300, Nairobi, Kenya',
  hq:                'Buruburu, Nairobi',
  primaryPhone:      '0746 097 033',
  primaryEmail:      'saferideafrica777@gmail.com',
  secondaryPhone:    '0746 097 033',
  phones:            ['0746 097 033'],
  email:             'saferideafrica777@gmail.com',
  website:           'www.safride-africa-driving-school.com',
  socials: {
    facebook: 'https://facebook.com/safrideafrica',
    twitter:  'https://twitter.com/safrideafrica',
  },
  registration: {
    bn:               'BN/2015/349431',
    pvt:              'PVT-6LUXXPK',
    foundedYear:      2015,
    incorporatedDate: '20 Feb 2020',
  },
} as const;

export const VISION  = 'To play a leading role in excellent training of all kinds of drivers in Africa and beyond.';
export const MISSION = 'To facilitate the very best theoretical and practical safe solutions in the field of driving that eventually results in accident free ecosystem.';
export const CORE_VALUES = ['Professionalism', 'Team Work', 'Customer Care', 'Communication', 'Honesty'] as const;

export const MANAGEMENT = [
  { title: 'CEO / Director',  name: 'Grace Wanjiru', photo: '/gracewanjiru.webp' },
  { title: 'General Manager', name: 'Felix Mwai',    photo: '/felixmwai.webp'    },
] as const;

// ─── Branches ────────────────────────────────────────────────────────────────

export const BRANCHES = [
  {
    id: 'donholm',
    name: 'Donholm HQ',
    isHQ: true,
    address: 'Donholm, Nairobi',
    phone: '0746 097 033',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa Donholm Nairobi',
  },
  {
    id: 'buruburu',
    name: 'Buru Buru',
    isHQ: false,
    address: 'Buru Buru, Nairobi',
    phone: '0746 097 033',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa Buru Buru Nairobi',
  },
  {
    id: 'embakasi',
    name: 'Embakasi',
    isHQ: false,
    address: 'Embakasi, Nairobi',
    phone: '0746 097 033',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa Embakasi Nairobi',
  },
  {
    id: 'beecentre',
    name: 'Bee Centre',
    isHQ: false,
    address: 'Bee Centre, Nairobi',
    phone: '0746 097 033',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa Bee Centre Nairobi',
  },
  {
    id: 'nasra',
    name: 'Nasra',
    isHQ: false,
    address: 'Nasra, Nairobi',
    phone: '0746 097 033',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa Nasra Nairobi',
  },
  {
    id: 'tena',
    name: 'Tena',
    isHQ: false,
    address: 'Tena, Nairobi',
    phone: '0746 097 033',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa Tena Nairobi',
  },
  {
    id: 'hamza',
    name: 'Hamza',
    isHQ: false,
    address: 'Hamza, Nairobi',
    phone: '0757 209 966',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa Hamza Nairobi',
  },
  {
    id: 'kayole',
    name: 'Kayole',
    isHQ: false,
    address: 'Kayole, Nairobi',
    phone: '0746 097 033',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa Kayole Nairobi',
  },
  {
    id: 'umoja',
    name: 'Umoja',
    isHQ: false,
    address: 'Umoja, Nairobi',
    phone: '0757 209 966',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa Umoja Nairobi',
  },
  {
    id: 'elim',
    name: 'Elim',
    isHQ: false,
    address: 'Elim, Nairobi',
    phone: '0746 097 033',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa Elim Nairobi',
  },
  {
    id: 'newdonholm',
    name: 'New Donholm',
    isHQ: false,
    address: 'New Donholm, Nairobi',
    phone: '0746 097 033',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa New Donholm Nairobi',
  },
  {
    id: 'umoja3',
    name: 'Umoja 3 / Kagundo Rd',
    isHQ: false,
    address: 'Umoja 3, Kagundo Road, Nairobi',
    phone: '0757 209 966',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa Umoja 3 Kagundo Road Nairobi',
  },
] as const;

export type Branch = typeof BRANCHES[number];

// Branch GPS coordinates — [latitude, longitude]
// TODO: verify each with Google Maps right-click → "What's here?"
export const BRANCH_COORDS: Record<string, [number, number]> = {
  donholm:    [-1.2912, 36.8922],
  buruburu:   [-1.2826, 36.8740],
  embakasi:   [-1.3194, 36.8953],
  beecentre:  [-1.2860, 36.8930],
  nasra:      [-1.2745, 36.8830],
  tena:       [-1.2960, 36.9020],
  hamza:      [-1.2921, 36.8565],
  kayole:     [-1.2746, 36.9099],
  umoja:      [-1.2864, 36.8924],
  elim:       [-1.2870, 36.8855],
  newdonholm: [-1.2880, 36.8960],
  umoja3:     [-1.2783, 36.9160],
};

// ─── Classes & Pricing ───────────────────────────────────────────────────────

export type SeriesCode = 'A' | 'B' | 'C' | 'D' | 'EXEC';

export interface DriveClass {
  code:      string;
  name:      string;
  fees:      number;
  pdl:       number;
  exams:     number;
  defensive: number;
  total:     number;
  lessons:   number | null;
  series:    SeriesCode;
}

export const CLASSES: DriveClass[] = [
  // A series — motorcycles & tricycles
  { code: 'A2-TEST',   name: 'A2 — Test Only',        fees: 5_240,  pdl: 680, exams: 2_080, defensive: 0,     total: 8_000,  lessons: null, series: 'A' },
  { code: 'A2-FULL',   name: 'A2 — Full Course',      fees: 9_240,  pdl: 680, exams: 2_080, defensive: 1_000, total: 13_000, lessons: 10,   series: 'A' },
  { code: 'A3-TUKTUK', name: 'A3 — Tuk-tuk / Parcel', fees: 4_240,  pdl: 680, exams: 2_080, defensive: 1_000, total: 8_000,  lessons: 10,   series: 'A' },

  // B series — light vehicles
  { code: 'B-LIGHT',   name: 'B — Light (Manual)',    fees: 12_240, pdl: 680, exams: 2_080, defensive: 1_000, total: 16_000, lessons: 20,   series: 'B' },
  { code: 'B-AUTO',    name: 'B — Auto',              fees: 12_240, pdl: 680, exams: 2_080, defensive: 1_000, total: 16_000, lessons: 20,   series: 'B' },
  { code: 'B-HALF',    name: 'B — Half Course',       fees: 9_740,  pdl: 680, exams: 2_080, defensive: 1_000, total: 13_500, lessons: 10,   series: 'B' },
  { code: 'B-TEST',    name: 'B — Test Only',         fees: 6_240,  pdl: 680, exams: 2_080, defensive: 1_000, total: 10_000, lessons: null, series: 'B' },

  // C series — heavy commercial
  { code: 'C-LIGHT',   name: 'C — Light',             fees: 12_740, pdl: 680, exams: 2_080, defensive: 1_000, total: 16_500, lessons: 20,   series: 'C' },
  { code: 'BC',        name: 'BC',                    fees: 12_940, pdl: 680, exams: 2_080, defensive: 1_000, total: 16_700, lessons: 20,   series: 'C' },
  { code: 'C-HALF',    name: 'C — Half Course',       fees: 9_740,  pdl: 680, exams: 2_080, defensive: 1_000, total: 13_500, lessons: null, series: 'C' },
  { code: 'C-TEST',    name: 'C — Test Only',         fees: 7_740,  pdl: 680, exams: 2_080, defensive: 1_000, total: 11_500, lessons: null, series: 'C' },

  // D / PSV — passenger service vehicles
  { code: 'D-PSV',     name: 'D1, D2, D3, PSV',       fees: 8_240,  pdl: 680, exams: 2_080, defensive: 1_000, total: 12_000, lessons: null, series: 'D' },
  { code: 'BPSV',      name: 'BPSV',                  fees: 7_740,  pdl: 680, exams: 2_080, defensive: 1_000, total: 11_500, lessons: null, series: 'D' },

  // Executive — premium private training
  { code: 'EXECUTIVE', name: 'Executive Class',       fees: 24_000, pdl: 0,   exams: 0,     defensive: 0,     total: 24_000, lessons: null, series: 'EXEC' },
];

export const CLASS_SERIES: { code: SeriesCode; label: string; subtitle: string }[] = [
  { code: 'A',    label: 'A Series',  subtitle: 'Motorcycles & Tricycles'      },
  { code: 'B',    label: 'B Series',  subtitle: 'Light Vehicles (Manual & Auto)' },
  { code: 'C',    label: 'C Series',  subtitle: 'Heavy Commercial Vehicles'    },
  { code: 'D',    label: 'D / PSV',   subtitle: 'Passenger Service Vehicles'   },
  { code: 'EXEC', label: 'Executive', subtitle: 'Premium Private Training'     },
];

export const REFRESHER_LESSONS = [
  { code: 'REF-BLIGHT', name: 'B-Light Refresher', perLesson: 700,   minLessons: 3 },
  { code: 'REF-AUTO',   name: 'Auto Refresher',    perLesson: 800,   minLessons: 3 },
  { code: 'REF-CLIGHT', name: 'C-Light Refresher', perLesson: 1_000, minLessons: 3 },
] as const;

export const EXTRA_FEES = {
  interimLicence: 780,
  smartDL:        3_100,
} as const;

export const PAYMENT = {
  mpesaPaybill:    '522533',
  mpesaAccountName:'SAFE RIDE AFRICA',
  kcbAccount:      '8045710',
  bankName:        'KCB Bank',
  notice:          'STRICTLY NO CASH PAYMENT',
} as const;

// ─── Services (10) ───────────────────────────────────────────────────────────

export interface ServiceItem {
  code:      string;
  name:      string;
  iconName:  string;
  shortDesc: string;
  fullDesc:  string;
}

export const SERVICES: ServiceItem[] = [
  {
    code:      'DEFENSIVE',
    name:      'Defensive Driving',
    iconName:  'Shield',
    shortDesc: 'Hazard perception, emergency braking, and space management for every Kenyan road condition.',
    fullDesc:  'Our Defensive Driving course trains you to anticipate and respond to road hazards before they become accidents. You master hazard perception, proper following distances, emergency braking, evasive manoeuvres, and night-driving safety. The course is conducted on real Nairobi roads — including the Expressway and city streets — giving you skills that could save your life and the lives of others.',
  },
  {
    code:      'SMART_DL',
    name:      'Smart DL',
    iconName:  'Award',
    shortDesc: 'Full NTSA Smart Digital Licence application and TIMS account setup, handled start to finish.',
    fullDesc:  'SafeRide Africa manages the entire NTSA Smart Digital Licence process on your behalf. We handle TIMS account registration, biometric capture coordination, payment processing, and status tracking — so you receive your Smart DL without joining long queues. Our staff stays current with every NTSA system update to ensure fast, accurate processing at a fixed fee of Ksh 3,100.',
  },
  {
    code:      'EXECUTIVE',
    name:      'Executive Classes',
    iconName:  'Star',
    shortDesc: 'Premium one-on-one training with a personalised schedule, ideal for busy professionals.',
    fullDesc:  'The Executive Class offers a truly personalised driving experience. Sessions are booked around your schedule and delivered by our most senior instructors. Whether you are learning from scratch or refining existing skills, the Executive programme delivers discreet, flexible, results-focused training at a flat Ksh 24,000 — no hidden charges.',
  },
  {
    code:      'LADIES',
    name:      'Ladies Special',
    iconName:  'Users',
    shortDesc: 'A tailored programme for female learners with the option of a female instructor.',
    fullDesc:  'Our Ladies Special programme creates a comfortable, confidence-building environment for female students. Lessons are conducted at your pace, with the option of a female instructor. The curriculum covers all NTSA requirements while placing extra emphasis on confidence-building exercises, city navigation, parking, and personal road safety.',
  },
  {
    code:      'EXPRESSWAY',
    name:      'Express Way / Super Highway Special',
    iconName:  'Navigation',
    shortDesc: 'Specialist training for the Nairobi Expressway and super-highways at safe high speeds.',
    fullDesc:  "Kenya's expressways demand different skills from city driving — high speeds, lane discipline, merge management, and safe exit procedures. Our Expressway Special gives you supervised practice on the Nairobi Expressway and Thika Super Highway, building the confidence to drive safely on Kenya's fastest roads.",
  },
  {
    code:      'BEGINNER',
    name:      'Beginner Driver Education',
    iconName:  'BookOpen',
    shortDesc: 'A complete from-scratch programme: vehicle controls, road signs, theory class, and road practice.',
    fullDesc:  'The Beginner Driver Education programme is designed for first-time learners with zero prior experience. Starting in a controlled environment, you progress through vehicle familiarisation, basic controls, road signs, NTSA theory, and supervised road practice. By completion you will be fully prepared for the NTSA driving test and confident on real roads.',
  },
  {
    code:      'ADVANCED',
    name:      'Advanced Driver Training',
    iconName:  'GraduationCap',
    shortDesc: 'Skill-upgrade training for licenced drivers mastering challenging roads and night conditions.',
    fullDesc:  'Already licenced but want to level up? Our Advanced Driver Training covers high-speed highway driving, night driving, extreme-weather handling, and professional driving techniques. Ideal for drivers who want greater confidence on Kenyan roads or are preparing for corporate and professional driving roles.',
  },
  {
    code:      'ROAD_TEST',
    name:      'Road Test Preparation',
    iconName:  'CheckCircle',
    shortDesc: 'Intensive NTSA test simulation so you know exactly what examiners look for on exam day.',
    fullDesc:  'Our Road Test Preparation sessions mirror the exact NTSA driving test — you practice the same manoeuvres, routes, and assessment criteria examiners use. We cover parallel parking, three-point turns, emergency stops, road observation, and examiner communication. Students who complete this programme achieve a 98% first-attempt pass rate.',
  },
  {
    code:      'CORPORATE',
    name:      'Corporate Driver Training',
    iconName:  'Briefcase',
    shortDesc: 'Fleet and company driver training covering defensive driving, NTSA compliance, and first aid.',
    fullDesc:  'SafeRide Africa delivers comprehensive corporate driver training programmes for companies of all sizes. We assess your fleet drivers, provide defensive driving refreshers, cover NTSA compliance and log-keeping, and deliver basic first-aid training. Programmes can be conducted at your premises or any of our ten branches. Group rates apply for fleets of five or more.',
  },
  {
    code:      'ONLINE',
    name:      'Online Learning Platform',
    iconName:  'Monitor',
    shortDesc: 'Live and recorded NTSA-aligned theory classes accessible from any device, anywhere in Kenya.',
    fullDesc:  'Our Online Learning Platform gives you the full NTSA theory curriculum from your phone, tablet, or laptop. Live classes run multiple times per week, with recordings available on demand. Topics include road signs, traffic laws, first aid for drivers, and defensive driving theory. Track your progress through our LMS and chat directly with instructors at any time.',
  },
];

// ─── Homepage stats ──────────────────────────────────────────────────────────

export const STATS = {
  branches:    12,
  instructors: 20,
  passRate:    98,
  yearsActive: new Date().getFullYear() - 2015,
} as const;

// ─── Why Choose Us ───────────────────────────────────────────────────────────

export const WHY_CHOOSE_US = [
  'We train you to be a driver, not a licence holder',
  "Lessons at students' convenient time",
  'Digital smart licence',
  'New NTSA curriculum',
  'Guarantee you become a competent driver on all major and minor roads',
] as const;

// ─── Social links ─────────────────────────────────────────────────────────────

export const SOCIALS = {
  whatsapp:  'https://wa.me/254746097033?text=Hi%20SafeRide%2C%20I%20want%20to%20enquire%20about%20driving%20classes',
  facebook:  'https://www.facebook.com/safrideafrica',
  twitter:   'https://twitter.com/safrideafrica',
  tiktok:    'https://www.tiktok.com/@saferide254',
  instagram: 'https://www.instagram.com/safe_rideafrica',
} as const;

// ─── Company story (two paragraphs for the About opener) ─────────────────────

export const COMPANY_STORY = [
  `Safe Ride Africa Driving School was founded in ${COMPANY.registration.foundedYear} with a single conviction: that every Kenyan driver deserves world-class training, not just a piece of paper. Starting from a single Nairobi location, the school quickly gained a reputation for rigorous instruction, genuine care for students, and an NTSA-aligned curriculum that prepared learners for real roads — not just the test track.`,
  `In ${COMPANY.registration.incorporatedDate.split(' ').pop()}, the school was formally incorporated as ${COMPANY.legalName} (PVT ${COMPANY.registration.pvt}), formalising five years of growth into a registered institution. Today we operate ${STATS.branches} branches across Nairobi — from Buruburu (HQ) to Kayole PCEA — and have trained over 2,100 licensed drivers.`,
] as const;

// ─── Blog articles ────────────────────────────────────────────────────────────

export interface BlogSection {
  type: 'paragraph' | 'heading' | 'list' | 'callout';
  text?: string;
  items?: string[];
}

export interface BlogArticle {
  id: string;
  category: string;
  title: string;
  description: string;
  publishDate: string;
  readTime: string;
  body: BlogSection[];
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'ntsa-smart-dl-guide',
    category: 'GUIDES',
    title: 'How to Apply for an NTSA Smart DL in 2026',
    description: 'A step-by-step walkthrough of the TIMS portal application, including required documents and common errors to avoid.',
    publishDate: 'Dec 22, 2025',
    readTime: '5 min read',
    body: [
      {
        type: 'paragraph',
        text: "Kenya's National Transport and Safety Authority (NTSA) has fully transitioned to the Smart Driving Licence (Smart DL) system. Whether you are applying for your first licence after completing your training at SafeRide Africa, or upgrading from an older laminated licence, here is the complete 2026 guide.",
      },
      {
        type: 'heading',
        text: 'What Is the NTSA Smart DL?',
      },
      {
        type: 'paragraph',
        text: 'The Smart DL is Kenya\'s second-generation driving licence. It features an embedded microchip containing your biometric data, digital photograph, vehicle class authorisation, and a record of any traffic offences. It is linked to NTSA\'s automated enforcement cameras and police handheld devices for real-time compliance monitoring. A three-year Smart DL costs Ksh 3,050.',
      },
      {
        type: 'heading',
        text: 'Documents You Will Need',
      },
      {
        type: 'list',
        items: [
          'Original National ID or valid Kenyan passport',
          'Valid Provisional Driving Licence (PDL) — obtained after passing the NTSA theory test',
          'Completed NTSA TIMS online application (tims.ntsa.go.ke)',
          'Payment receipt of Ksh 3,050 via M-Pesa, bank, or Huduma Centre counter',
          'Passport-sized photograph (if not captured biometrically at the Huduma Centre)',
        ],
      },
      {
        type: 'heading',
        text: 'Step-by-Step Application Process',
      },
      {
        type: 'list',
        items: [
          'Step 1 — Register on the NTSA TIMS portal at tims.ntsa.go.ke using your National ID number and create an account.',
          'Step 2 — Log in and navigate to "Driving Licence Application." Select your vehicle class (Class B for light vehicles is the most common for new drivers).',
          'Step 3 — Fill in your personal details and upload the required documents. Double-check that your name matches your National ID exactly.',
          'Step 4 — Make payment of Ksh 3,050. M-Pesa Paybill number 641700, account number: your ID number.',
          'Step 5 — Book a biometric appointment at one of the 15 Huduma Centres nationwide. Nairobi options include Huduma Centre GPO, Westlands, and Embakasi.',
          'Step 6 — Attend your appointment for fingerprinting and photograph capture. Arrive with your original ID and payment receipt.',
          'Step 7 — Collect your Smart DL — typically ready within 5 to 10 working days from your biometric appointment.',
        ],
      },
      {
        type: 'heading',
        text: 'Common Mistakes to Avoid',
      },
      {
        type: 'list',
        items: [
          'Applying without a valid PDL — your PDL must be current and match your applied vehicle class.',
          'Selecting the wrong vehicle class — confirm with your instructor whether you need Class B (light vehicles), Class C (heavy commercial), or another category.',
          'Outstanding NTSA fines — unpaid penalties can block your application. Check and clear any fines on the TIMS portal first.',
          'Expired National ID — ensure your ID is valid. An expired ID will cause your biometric appointment to fail.',
          'Incorrect M-Pesa payment details — always use your own ID number as the account reference, not your phone number.',
        ],
      },
      {
        type: 'heading',
        text: 'How SafeRide Africa Helps',
      },
      {
        type: 'paragraph',
        text: 'At SafeRide Africa, Smart DL application guidance is included in every full course at no extra charge. Our instructors walk you through TIMS registration, PDL application, theory test booking, payment, and biometric scheduling. We have assisted over 2,100 drivers through this process across our 10 Nairobi branches.',
      },
      {
        type: 'callout',
        text: 'Need help with your Smart DL? Contact SafeRide Africa on 0746 097 033 or WhatsApp us. We will guide you through the full application from start to finish.',
      },
    ],
  },
  {
    id: 'defensive-driving-basics',
    category: 'DEFENSIVE',
    title: 'Five Defensive Driving Habits Every Kenyan Driver Should Know',
    description: 'Practical lessons drawn from our instructors on managing Nairobi traffic, weather, and unpredictable road conditions.',
    publishDate: 'Nov 11, 2025',
    readTime: '6 min read',
    body: [
      {
        type: 'paragraph',
        text: "Kenya recorded 5,009 road fatalities in 2025 — a 5.5% increase from 2024. Pedestrians alone accounted for 1,889 of those deaths. These are not just statistics; they are preventable tragedies. Defensive driving is the discipline that separates drivers who navigate Kenyan roads safely from those who become part of those numbers.",
      },
      {
        type: 'heading',
        text: '1. The Three-Second Following Rule',
      },
      {
        type: 'paragraph',
        text: 'Most rear-end collisions happen because drivers follow too closely. The three-second rule is simple: pick a fixed point on the road ahead — a sign, a pothole, a marking. Count the seconds between the car in front crossing it and you reaching it. If it is less than three, you are too close. On wet roads, in poor visibility, or at night, extend this to five seconds minimum. On Nairobi\'s most congested routes — Thika Road, Mombasa Road, Ngong Road — matatus and boda bodas will test this buffer every few minutes.',
      },
      {
        type: 'heading',
        text: '2. Scan Far Ahead, Not Just in Front',
      },
      {
        type: 'paragraph',
        text: 'New drivers fixate on the car directly ahead. Experienced defensive drivers scan 12 to 15 seconds down the road — roughly 200 to 300 metres at 60 km/h. This gives you reaction time for sudden stops, pedestrians crossing mid-block, debris, animals, or potholes. At SafeRide Africa, our instructors train this habit from the very first practical lesson — it is the single most effective way to avoid emergency braking.',
      },
      {
        type: 'heading',
        text: '3. Check Blind Spots Every Time',
      },
      {
        type: 'paragraph',
        text: 'No mirror setup eliminates every blind spot. Before changing lanes, overtaking, or pulling out from a junction, physically turn your head to check. This takes under one second. Motorcyclists are the highest-risk hazard in blind spots — boda bodas travel fast, fill gaps quickly, and are difficult to detect in mirrors, especially at night or in heavy rain.',
      },
      {
        type: 'heading',
        text: '4. Adapt Your Speed to Conditions',
      },
      {
        type: 'paragraph',
        text: "The posted speed limit is a legal maximum, not a recommended target. On Nairobi's unpaved estate roads, during the long rains, or on the Nakuru and Mombasa highways in early morning fog, reducing speed by 20 to 30 km/h below the limit is the correct decision. NTSA data consistently identifies speed as a contributing factor in the majority of fatal crashes. Our defensive driving module at SafeRide teaches you to read the road — not just the speedometer.",
      },
      {
        type: 'heading',
        text: '5. Anticipate Pedestrian Movement',
      },
      {
        type: 'paragraph',
        text: "Kenya's pedestrian fatality rate is among the highest in sub-Saharan Africa. Near bus stages, schools, open-air markets, and informal settlements, expect unpredictable movement at all times. Slow down before pedestrian crossings even when you have right of way. At night, assume pedestrians may step out anywhere — very few Nairobi roads outside the CBD have adequate lighting.",
      },
      {
        type: 'heading',
        text: 'The SafeRide Defensive Driving Module',
      },
      {
        type: 'list',
        items: [
          'Hazard perception training — identifying risks before they become emergencies',
          'Emergency braking and vehicle control under panic conditions',
          'Night driving and low-visibility techniques',
          'Managing road rage and aggressive driver interactions',
          'Navigating roundabouts, junctions, and unmarked intersections safely',
        ],
      },
      {
        type: 'callout',
        text: "SafeRide Africa's defensive driving module is included in every B-Light, B-Auto, C-Light, and BC full course. It is the training behind our 98% NTSA first-attempt pass rate — and more importantly, it keeps our graduates safe long after the test.",
      },
    ],
  },
  {
    id: 'choosing-the-right-class',
    category: 'CLASSES',
    title: 'B-Light vs B-Auto: Which Licence Class is Right for You?',
    description: 'A quick comparison of the two most popular SafeRide classes, with cost, lesson count, and career implications.',
    publishDate: 'Oct 9, 2025',
    readTime: '4 min read',
    body: [
      {
        type: 'paragraph',
        text: "When most Kenyans decide to get their driving licence, the first question is simple: which class? The two most popular options at SafeRide Africa are Class B — Light (Manual) and Class B — Auto. Both cover the same NTSA syllabus and road test, but the vehicle type and long-term implications differ significantly.",
      },
      {
        type: 'heading',
        text: 'What Each Class Covers',
      },
      {
        type: 'paragraph',
        text: 'Class B — Light (Manual) trains you on a dual-control manual transmission car — the type used in most Kenyan taxis, personal cars, PSV minibuses, and commercial fleets. Class B — Auto trains you on an automatic transmission vehicle, increasingly common in newer private cars and imported second-hand vehicles from Japan. Both classes include 20 practical driving lessons, NTSA theory preparation, a defensive driving module, the NTSA road test, and Smart DL application guidance.',
      },
      {
        type: 'heading',
        text: 'Cost Comparison',
      },
      {
        type: 'list',
        items: [
          'B — Light (Manual): Ksh 16,000 total — includes PDL, theory, 20 lessons, road test, and Smart DL guidance',
          'B — Auto: Ksh 16,000 total — same package, automatic vehicle',
          'Executive Class: Ksh 24,000 — private lessons, fully flexible, home pickup on request',
          'Additional government fees: Interim Licence Ksh 780 + Smart DL Ksh 3,050 (payable to NTSA separately)',
        ],
      },
      {
        type: 'heading',
        text: 'Which Should You Choose?',
      },
      {
        type: 'paragraph',
        text: 'If you plan to drive a personal car, work in ride-hailing (Uber/Bolt), or enter the transport industry, Class B — Light (Manual) gives you the broadest flexibility. The majority of vehicles on Kenyan roads are manual. Crucially, a manual licence also permits you to drive automatic vehicles — but not the other way around.',
      },
      {
        type: 'paragraph',
        text: 'Class B — Auto is the right choice if you specifically intend to drive an automatic vehicle and are not comfortable with manual gear changes. It is also popular with students who have physical limitations that make a clutch difficult to operate. Note that an automatic-only licence does NOT permit you to drive a manual vehicle — if you later want to switch, you would need to retrain and retest.',
      },
      {
        type: 'heading',
        text: 'What About the Executive Class?',
      },
      {
        type: 'paragraph',
        text: "SafeRide's Executive Class (Ksh 24,000) is our premium private training option. It is designed for students who want a dedicated instructor, fully flexible lesson scheduling, personalised pacing, and optional home pickup. It covers any vehicle class and is particularly popular with professionals, returning drivers, and those with tight schedules.",
      },
      {
        type: 'heading',
        text: 'New NTSA Licence Classes in 2026',
      },
      {
        type: 'paragraph',
        text: 'NTSA has expanded the licence class system beyond the old BCE categories to more specialised categories tailored to specific vehicle types. If you are applying for a commercial, PSV, or heavy-vehicle licence, speak to our instructors — we offer C-Light, BC, D/PSV, and BPSV courses as well.',
      },
      {
        type: 'callout',
        text: 'Our recommendation for most first-time Kenyan drivers: Class B — Light (Manual). The flexibility across every vehicle type on Kenyan roads is unmatched. Not sure? Call us on 0746 097 033 and we will help you choose at no obligation.',
      },
    ],
  },
];
