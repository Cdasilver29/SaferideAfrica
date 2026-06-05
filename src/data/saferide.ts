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
  secondaryPhone:    '0757 209 966',
  phones:            ['0746 097 033', '0757 209 966', '0712 045 710'],
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
  { title: 'CEO / Director',    name: 'Grace Wanjiru' },
  { title: 'General Manager',   name: 'Felix Mwai'    },
] as const;

// ─── Branches ────────────────────────────────────────────────────────────────

export const BRANCHES = [
  {
    id: 'donholm',
    name: 'Donholm',
    isHQ: false,
    address: 'Donholm, Nairobi',
    phone: '0746 097 033',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa Donholm Nairobi',
  },
  {
    id: 'buruburu',
    name: 'Buruburu',
    isHQ: true,
    address: 'Buruburu, Nairobi',
    phone: '0746 097 033',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa Buruburu Nairobi',
  },
  {
    id: 'pipeline',
    name: 'Pipeline',
    isHQ: false,
    address: 'Pipeline, Embakasi, Nairobi',
    phone: '0746 097 033',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa Pipeline Embakasi Nairobi',
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
    id: 'ruaraka',
    name: 'Ruaraka',
    isHQ: false,
    address: 'Ruaraka, Nairobi',
    phone: '0757 209 966',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa Ruaraka Nairobi',
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
    id: 'hamza',
    name: 'Hamza-Jogoo Rd',
    isHQ: false,
    address: 'Hamza, Jogoo Road, Nairobi',
    phone: '0757 209 966',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa Hamza Jogoo Road Nairobi',
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
    id: 'tenab',
    name: 'Tena B',
    isHQ: false,
    address: 'Tena B, Nairobi',
    phone: '0746 097 033',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa Tena B Nairobi',
  },
  {
    id: 'kayole',
    name: 'Kayole PCEA',
    isHQ: false,
    address: 'Kayole PCEA, Nairobi',
    phone: '0746 097 033',
    hours: 'Mon–Sat 7am–6pm',
    mapsQuery: 'SafeRide Africa Kayole PCEA Nairobi',
  },
] as const;

export type Branch = typeof BRANCHES[number];

// Branch GPS coordinates — [latitude, longitude]
// TODO: verify each with Google Maps right-click → "What's here?"
export const BRANCH_COORDS: Record<string, [number, number]> = {
  donholm:   [-1.2912, 36.89219],
  buruburu:  [-1.2826, 36.8740],
  pipeline:  [-1.3197, 36.8930],
  beecentre: [-1.2860, 36.8930],
  ruaraka:   [-1.2492, 36.8723],
  umoja:     [-1.2864, 36.8924],
  hamza:     [-1.2887, 36.8517],
  nasra:     [-1.2745, 36.8830],
  tenab:     [-1.2960, 36.9020],
  kayole:    [-1.2746, 36.9099],
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
  branches:    10,
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
  whatsapp:  'https://wa.me/254712045710?text=Hi%20SafeRide%2C%20I%20want%20to%20enquire%20about%20driving%20classes',
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

export interface BlogArticle {
  id: string;
  category: string;
  title: string;
  description: string;
  publishDate: string;
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'ntsa-smart-dl-guide',
    category: 'GUIDES',
    title: 'How to Apply for an NTSA Smart DL in 2026',
    description: 'A step-by-step walkthrough of the TIMS portal application, including required documents and common errors to avoid.',
    publishDate: 'Dec 22, 2025',
  },
  {
    id: 'defensive-driving-basics',
    category: 'DEFENSIVE',
    title: 'Five Defensive Driving Habits Every Kenyan Driver Should Know',
    description: 'Practical lessons drawn from our instructors on managing Nairobi traffic, weather, and unpredictable road conditions.',
    publishDate: 'Nov 11, 2025',
  },
  {
    id: 'choosing-the-right-class',
    category: 'CLASSES',
    title: 'B-Light vs B-Auto: Which Licence Class is Right for You?',
    description: 'A quick comparison of the two most popular SafeRide classes, with cost, lesson count, and career implications.',
    publishDate: 'Oct 9, 2025',
  },
];
