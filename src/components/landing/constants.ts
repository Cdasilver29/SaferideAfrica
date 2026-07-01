import { Platform } from 'react-native';

// Screen dimensions are intentionally not read at module scope: reading them at
// import time is unsafe under static (Node) rendering. Components read live size
// with useWindowDimensions() instead.
export const IS_WEB = Platform.OS === 'web';
export const MAX_W = 1100;

// ─── Safe Ride colour tokens — locked 6-colour palette ─────────────────────────
export const C = {
  // ── Canonical palette colours ──────────────────────────────────────────────
  skyLight:   '#58ccf7',               // header strip, info banners
  skyDeep:    '#01a5f0',               // primary actions, links
  yellow:     '#ffd800',               // accent, badges, Sign In
  red:        '#e11d2e',               // destructive only
  dark:       '#221f20',               // text on light / dark surfaces (black)
  white:      '#ffffff',               // canvas / text on dark
  // ── Semantic aliases used by components (kept for backward compat) ─────────
  blue:       '#01a5f0',               // → skyDeep
  blueDark:   '#58ccf7',               // → skyLight
  blueDeep:   '#01a5f0',               // → skyDeep
  amberDark:  'rgba(255,216,0,0.7)',   // dimmed yellow — loading button states
  amber:      '#ffd800',               // → yellow
  gold:       '#ffd800',               // → yellow
  darkBg:     '#221f20',               // dark section backgrounds
  darkCard:   '#221f20',               // dark card surfaces (border differentiates)
  darkBorder: 'rgba(255,255,255,0.15)',
  muted:      'rgba(34,31,32,0.6)',    // muted text on light bg  (black/60)
  mutedDark:  'rgba(255,255,255,0.7)', // muted text on dark bg   (white/70)
  lightBg:    '#ffffff',               // light section bg
  heading:    '#221f20',               // heading text
  green:      '#01a5f0',               // success states → sky-deep
  greenLight: '#58ccf7',               // light success → sky-light
};

// ─── Font names (must match useFonts keys in _layout.tsx) ─────────────────────
// Manrope, the single brand type family. Weight-only hierarchy, no second
// display font. Reference fonts through F, never hardcode a family.
export const F = {
  regular:  'Manrope-Regular',
  medium:   'Manrope-Medium',
  semibold: 'Manrope-SemiBold',
  bold:     'Manrope-Bold',
};

// ─── Image sources ────────────────────────────────────────────────────────────
export const HERO_SRC = IS_WEB
  ? { uri: '/DSC_2116.webp' }
  : require('../../../assets/images/car-pic.png');

// "Built for Kenyan Roads" section on home page
export const ABOUT_IMG = IS_WEB
  ? { uri: '/gallery/DSC_2089.webp' }
  : require('../../../assets/images/car-pic.png');

// "WHO WE ARE" opener on the About page
export const ABOUT_OPENER_IMG = IS_WEB
  ? { uri: '/gallery/DSC_6830.webp' }
  : require('../../../assets/images/car-pic.png');

// "Programmes Tailored to How You Drive" section
export const SERVICES_IMG = IS_WEB
  ? { uri: '/student-driver.webp' }
  : require('../../../assets/images/car-pic.png');

export const GALLERY_IMGS: { uri: string; caption: string }[] | { src: any; caption: string }[] = IS_WEB
  ? [
      { uri: '/gallery/DSC_2089.webp',     caption: 'Training session' },
      { uri: '/gallery/DSC_2116.webp',     caption: 'Road practice' },
      { uri: '/gallery/DSC_2179.webp',     caption: 'Branches' },
      { uri: '/gallery/DSC_2225.webp',     caption: 'Student practice' },
      { uri: '/gallery/DSC_2258.webp',     caption: 'Highway skills' },
      { uri: '/gallery/DSC_2411.webp',     caption: 'Practical session' },
      { uri: '/gallery/DSC_2678.webp',     caption: 'Instructor guidance' },
      { uri: '/gallery/DSC_2691.webp',     caption: 'Road training' },
      { uri: '/gallery/DSC_2699.webp',     caption: 'Road training' },
      { uri: '/gallery/DSC_2709.webp',     caption: 'Driving lesson' },
      { uri: '/gallery/DSC_2725.webp',     caption: 'Happy students' },
      { uri: '/gallery/DSC_2798.webp',     caption: 'Practical session' },
      { uri: '/gallery/DSC_2976.webp',     caption: 'Driving test' },
      { uri: '/gallery/DSC_6800.webp',     caption: 'Road safety' },
      { uri: '/gallery/DSC_6824.webp',     caption: 'Road training' },
      { uri: '/gallery/DSC_6830.webp',     caption: 'Happy family' },
      { uri: '/gallery/DSC_6866.webp',     caption: 'Practical session' },
      { uri: '/gallery/DSC_6903.webp',     caption: 'Defensive driving' },
      { uri: '/gallery/DSC_6912.webp',     caption: 'Instructor guidance' },
      { uri: '/gallery/DSC_6927.webp',     caption: 'Car training' },
      { uri: '/gallery/DSC_6966.webp',     caption: 'Practical session' },
      { uri: '/gallery/DSC_6994.webp',     caption: 'Student progress' },
      { uri: '/gallery/DSC_7014.webp',     caption: 'Road skills' },
      { uri: '/gallery/DSC_7016.webp',     caption: 'Theory class' },
      { uri: '/gallery/DSC_7765.webp',     caption: 'Training day' },
      { uri: '/gallery/DSC_7786.webp',     caption: 'Practical lesson' },
      { uri: '/gallery/DSC_7796.webp',     caption: 'Highway training' },
      { uri: '/gallery/DSC_7805.webp',     caption: 'Driving session' },
      { uri: '/gallery/DSC_7824.webp',     caption: 'Testimonial' },
      { uri: '/gallery/DSC_7825.webp',     caption: 'Theory class' },
      { uri: '/gallery/DSC_7832.webp',     caption: 'Road practice' },
      { uri: '/gallery/DSC_7834.webp',     caption: 'Student confidence' },
      { uri: '/gallery/DSC_7860.webp',     caption: 'Instructor session' },
      { uri: '/gallery/DSC_7863.webp',     caption: 'Driving skills' },
      { uri: '/gallery/DSC_7879.webp',     caption: 'Bodaboda training' },
      { uri: '/gallery/DSC_7902.webp',     caption: 'Road lesson' },
      { uri: '/gallery/DSC_7904.webp',     caption: 'Happy customers' },
      { uri: '/gallery/DSC_7925.webp',     caption: 'Instructor guidance' },
      { uri: '/gallery/DSC_7946.webp',     caption: 'Practical session' },
      { uri: '/gallery/DSC_7956.webp',     caption: 'Highway skills' },
      { uri: '/gallery/DSC_7976.webp',     caption: 'Instructor' },
      { uri: '/gallery/DSC_7981.webp',     caption: 'Training day' },
      { uri: '/gallery/DSC_7991.webp',     caption: 'Instructor guidance' },
      { uri: '/gallery/DSC_7998.webp',     caption: 'Road confidence' },
    ]
  : Array(9).fill(null).map(() => ({
      src: require('../../../assets/images/car-pic.png'),
      caption: 'Training session',
    }));

export const BLOG_IMGS = IS_WEB
  ? [
      { uri: '/gallery/DSC_7786.webp' },
      { uri: '/gallery/DSC_7765.webp' },
      { uri: '/gallery/DSC_7016.webp' },
    ]
  : Array(3).fill(require('../../../assets/images/car-pic.png'));

export const INSTRUCTOR_IMGS = IS_WEB
  ? [
      { uri: '/gallery/DSC_7991.webp' },
      { uri: '/gallery/DSC_7976.webp' },
      { uri: '/gallery/DSC_7824.webp' },
      { uri: '/gallery/DSC_7925.webp' },
    ]
  : null;

// ─── Data ─────────────────────────────────────────────────────────────────────
// Note: SERVICES and CLASSES/COURSES data live in src/data/saferide.ts

export const FAQS = [
  { q: 'How long does it take to complete a driving course?', a: 'Most students complete our standard course in 3 to 4 weeks. The duration depends on the package chosen and your availability for lessons.' },
  { q: 'Are your instructors NTSA certified?', a: 'Yes. All Safe Ride Africa instructors hold valid NTSA certification and undergo continuous professional development.' },
  { q: 'Do you help with the NTSA Smart DL application?', a: 'Absolutely. We guide every student through the full NTSA Smart DL application and TIMS account setup at no extra charge.' },
  { q: 'What is the pass rate for your students?', a: 'We are proud of a 98% NTSA first-attempt pass rate, well above the national average, thanks to our intensive test preparation.' },
  { q: 'Do you offer refresher courses?', a: 'Yes. We offer flexible refresher programmes tailored to drivers who want to rebuild confidence or prepare for retesting.' },
];

export const INSTRUCTORS = [
  { name: 'James Odhiambo', role: 'Senior Instructor', exp: '8 yrs', initials: 'JO' },
  { name: 'Lucy Karimi',    role: 'Highway Expert',    exp: '6 yrs', initials: 'LK' },
  { name: 'Tom Mutua',      role: 'Defensive Driving', exp: '10 yrs', initials: 'TM' },
  { name: 'Anne Wambua',    role: 'Theory Specialist', exp: '5 yrs',  initials: 'AW' },
];

export const WHY_FEATURES = [
  { iconName: 'BookOpen',     title: 'Online Classes',      desc: 'Access theory lessons anywhere, anytime on any device.' },
  { iconName: 'Map',          title: 'Online Tracking',     desc: 'Track your progress and lesson schedule in real-time.' },
  { iconName: 'Tag',          title: 'Affordable Fee',      desc: 'Transparent pricing with no hidden charges.' },
  { iconName: 'Award',        title: 'Best Trainers',       desc: 'NTSA-certified instructors with years of experience.' },
  { iconName: 'Clock',        title: 'Perfect Timing',      desc: 'Flexible lesson slots that fit your schedule.' },
];

export const STATS = [
  { value: 2106, suffix: '+', label: 'Total Learners' },
  { value: 527,  suffix: '+', label: 'Current Students' },
  { value: 59,   suffix: '+', label: 'Expert Instructors' },
];

export const WORK_STEPS = [
  { num: '01', iconName: 'CheckSquare', title: 'Select Your Plan',    desc: 'Choose the course that matches your goals and budget.' },
  { num: '02', iconName: 'Users',       title: 'Consultation',        desc: 'Meet your instructor and discuss your learning path.' },
  { num: '03', iconName: 'CreditCard',  title: 'Buy Your Courses',    desc: 'Secure payment with flexible options available.' },
  { num: '04', iconName: 'Car',         title: 'Start Your Training', desc: 'Get behind the wheel and build real road confidence.' },
];

export const TESTIMONIALS = [
  {
    name: 'Eric Musyoka',
    role: 'Matatu Driver',
    initials: 'EM',
    text: 'Best driving school ever. Walinisaidia kuapply hii smart dl manze..haraka haraka kwanza hadi sikuamini.',
  },
  {
    name: 'Maina Mburu',
    role: 'University Student',
    initials: 'MM',
    text: 'The lessons are so much fun and in a month I was able to finish the whole driving course and passed the NTSA exams without any hustle.',
  },
  {
    name: 'Michelle Akinyi',
    role: 'Journalist',
    initials: 'MA',
    text: 'I did my refresher course here, they ensured I built confidence on the road. I would recommend it, I assure you it is worth it.',
  },
];

export const BLOG_POSTS = [
  {
    date: 'May 10, 2025',
    title: 'How to Pass Your NTSA Driving Test on the First Try',
    excerpt: 'Insider tips from our certified instructors on what examiners look for and how to avoid common mistakes.',
  },
  {
    date: 'Apr 22, 2025',
    title: 'Smart DL vs Old DL: What Every Kenyan Driver Must Know',
    excerpt: 'NTSA has fully switched to Smart DL. Here is everything you need to upgrade your licence without the queue.',
  },
  {
    date: 'Mar 15, 2025',
    title: 'Defensive Driving: Why It Could Save Your Life on Kenyan Roads',
    excerpt: 'Road fatalities are rising. Defensive driving is the skill that Safe Ride puts at the heart of every lesson.',
  },
];

export const NAV_ITEMS = [
  { label: 'Home',     path: '/',         key: 'home' },
  { label: 'About',    path: '/about',    key: 'about' },
  { label: 'Courses',  path: '/courses',  key: 'courses' },
  { label: 'Services', path: '/services', key: 'services' },
  { label: 'Branches', path: '/branches', key: 'branches' },
  { label: 'Gallery',  path: '/gallery',  key: 'gallery' },
  { label: 'Blog',     path: '/blog',     key: 'blog' },
  { label: 'Contact',  path: '/contact',  key: 'contact' },
];
