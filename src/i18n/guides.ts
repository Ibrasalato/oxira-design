// SEO landing pages (services, regions, hub). Only Arabic and English exist for these pages.
// Copy lives in guides-ar.ts / guides-en.ts; this file holds structure, schema hints and UI strings.
import type { Lang } from './content';
import { guidesAr } from './guides-ar';
import { guidesEn } from './guides-en';

export type GuideLang = 'ar' | 'en';
export const GUIDE_LANGS: GuideLang[] = ['ar', 'en'];
export const isGuideLang = (l: Lang): l is GuideLang => l === 'ar' || l === 'en';

/** Last content update of the guide pages (sitemap lastmod). */
export const GUIDES_UPDATED = '2026-10-09';

export type Section = {
  h: string;
  p?: string[];
  ul?: string[];
  steps?: { t: string; d: string }[];
  tip?: string;
};

export type GuideCopy = {
  title: string;        // <title>, ≤ 60 chars, main keyword first
  description: string;  // meta description, 120–160 chars
  nav: string;          // short name for links, cards and breadcrumbs
  card: string;         // one-line teaser for the hub, home and related cards
  kicker: string;
  h1: string;
  lead: string;
  facts: [string, string][];
  sections: Section[];
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaText: string;
};

export type GuideSlug =
  | 'autocad-to-3d' | 'apartment-3d-design' | 'villa-3d-design' | 'interior-renders'
  | 'ai-room-design' | 'finishing-quantities' | 'saudi-arabia' | 'gulf' | 'egypt';

export type GuideMeta = {
  slug: GuideSlug;
  kind: 'service' | 'region';
  icon: string;
  primary: 'studio' | 'redesign';
  secondary?: 'studio' | 'redesign';
  related: GuideSlug[];
  serviceType: string;
  areaServed: string[];
  /** Section index whose `steps` also become HowTo JSON-LD. */
  howto?: number;
};

export const GUIDES: GuideMeta[] = [
  { slug: 'autocad-to-3d', kind: 'service', icon: 'cube', primary: 'studio', related: ['apartment-3d-design', 'villa-3d-design', 'interior-renders'], serviceType: 'AutoCAD DWG/DXF floor plan to 3D model conversion', areaServed: ['Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Egypt'], howto: 1 },
  { slug: 'apartment-3d-design', kind: 'service', icon: 'sofa', primary: 'studio', related: ['autocad-to-3d', 'finishing-quantities', 'egypt'], serviceType: 'Apartment 3D interior design', areaServed: ['Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Egypt'], howto: 1 },
  { slug: 'villa-3d-design', kind: 'service', icon: 'building', primary: 'studio', related: ['autocad-to-3d', 'interior-renders', 'saudi-arabia'], serviceType: 'Villa 3D interior design', areaServed: ['Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Egypt'], howto: 2 },
  { slug: 'interior-renders', kind: 'service', icon: 'spark', primary: 'studio', related: ['villa-3d-design', 'apartment-3d-design', 'ai-room-design'], serviceType: 'Photorealistic interior rendering and 3ds Max modelling', areaServed: ['Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Egypt'], howto: 3 },
  { slug: 'ai-room-design', kind: 'service', icon: 'spark', primary: 'redesign', secondary: 'studio', related: ['interior-renders', 'apartment-3d-design', 'autocad-to-3d'], serviceType: 'AI room interior redesign from a photo', areaServed: ['Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Egypt'], howto: 1 },
  { slug: 'finishing-quantities', kind: 'service', icon: 'ruler', primary: 'studio', related: ['apartment-3d-design', 'egypt', 'saudi-arabia'], serviceType: 'Finishing quantity take-off and finishing quotes', areaServed: ['Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Egypt'], howto: 2 },
  { slug: 'saudi-arabia', kind: 'region', icon: 'pin', primary: 'studio', secondary: 'redesign', related: ['villa-3d-design', 'apartment-3d-design', 'finishing-quantities'], serviceType: '3D interior design for apartments and villas', areaServed: ['Saudi Arabia'] },
  { slug: 'gulf', kind: 'region', icon: 'pin', primary: 'studio', secondary: 'redesign', related: ['villa-3d-design', 'autocad-to-3d', 'interior-renders'], serviceType: '3D interior design for apartments and villas', areaServed: ['United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain', 'Oman'] },
  { slug: 'egypt', kind: 'region', icon: 'pin', primary: 'studio', secondary: 'redesign', related: ['apartment-3d-design', 'finishing-quantities', 'ai-room-design'], serviceType: '3D apartment and villa design before finishing', areaServed: ['Egypt'] },
];

export const guideCopy: Record<GuideLang, Record<GuideSlug, GuideCopy>> = { ar: guidesAr, en: guidesEn };

export const guidePath = (slug: GuideSlug) => `/${slug}/`;
export const HUB_PATH = '/services/';

export const ui = {
  ar: {
    home: 'الرئيسية',
    hub: 'الخدمات والأدلة',
    hubTitle: 'خدمات التصميم ثلاثي الأبعاد وأدلتها | Oxira Design',
    hubDescription: 'كل خدمات Oxira Design في مكان واحد: تحويل مخطط أوتوكاد إلى 3D، تصميم الشقق والفلل، الرندر الواقعي، تصميم الغرف بالذكاء الاصطناعي وحساب كميات التشطيب.',
    hubKicker: 'الخدمات والأدلة',
    hubH1: 'خدمات التصميم ثلاثي الأبعاد من المخطط إلى الرندر',
    hubLead: 'اختر ما يناسب مرحلتك: عندك مخطط أوتوكاد وتبي تشوفه 3D، أو تجهّز شقة أو فيلا للتشطيب، أو عندك صورة غرفة وتبي فكرة ديكور سريعة. كل صفحة تشرح الخطوات والملفات المطلوبة وما تحصل عليه.',
    services: 'الخدمات',
    servicesLead: 'أدلة عملية لكل خدمة: طريقة العمل، الملفات المقبولة، ما يتم تلقائياً وما ينفذه الفريق.',
    regions: 'حسب البلد',
    regionsLead: 'نفس الخدمة أونلاين، مع ما يختلف في كل بلد: المصطلحات وأنماط الشقق والفلل والوحدات وطريقة الدفع.',
    which: {
      h: 'من أين أبدأ؟',
      items: [
        'عندك ملف أوتوكاد (DWG أو DXF) لشقة أو فيلا: ابدأ بالاستوديو المجاني، فهو يعطيك النموذج والمساحات والكميات خلال ثوانٍ.',
        'عندك صورة غرفة فقط بدون مخطط: جرّب تصميم الغرفة بالذكاء الاصطناعي، أول تصميم في اليوم مجاني.',
        'تحتاج صوراً واقعية للعرض أو ملف 3ds Max للمصمم والمقاول: اطلب إحدى باقات الفريق بعد تجربة الاستوديو.',
        'مقبل على التشطيب وتبي تقارن عروض المقاولين: نزّل جدول الكميات من الاستوديو أو اطلب عروض أسعار تشطيب.',
      ],
    },
    open: 'اقرأ الدليل',
    steps: 'الخطوات',
    faq: 'الأسئلة الشائعة',
    related: 'صفحات ذات صلة',
    allServices: 'كل الخدمات والأدلة',
    onThisPage: 'في هذه الصفحة',
    note: 'بدون تسجيل. الملف يُعالج داخل متصفحك.',
    breadcrumb: 'مسار الصفحة',
    homeSection: { label: 'الخدمات والأدلة', title: 'أدلة عملية حسب احتياجك', more: 'كل الخدمات والأدلة' },
  },
  en: {
    home: 'Home',
    hub: 'Services & guides',
    hubTitle: '3D Design Services & Guides | Oxira Design',
    hubDescription: 'All Oxira Design services in one place: AutoCAD plan to 3D, apartment and villa 3D design, photoreal renders, AI room redesign and finishing quantities.',
    hubKicker: 'Services & guides',
    hubH1: '3D design services, from floor plan to photoreal render',
    hubLead: 'Pick what fits where you are: you have an AutoCAD plan and want to see it in 3D, you are preparing an apartment or villa for finishing, or you have a photo of a room and want a quick design idea. Each page explains the steps, the files we need and what you get.',
    services: 'Services',
    servicesLead: 'Practical guides for each service: how it works, accepted files, what is automatic and what our team does.',
    regions: 'By country',
    regionsLead: 'The same online service, plus what differs in each country: terminology, typical apartments and villas, units and payment.',
    which: {
      h: 'Where should I start?',
      items: [
        'You have an AutoCAD file (DWG or DXF) of an apartment or villa: start with the free studio, which gives you the model, areas and quantities in seconds.',
        'You only have a photo of a room: try AI room redesign. Your first design each day is free.',
        'You need realistic images for marketing or a 3ds Max file for your designer or contractor: order one of the team packages after trying the studio.',
        'You are about to start finishing works and want to compare contractor quotes: download the quantity table from the studio or request finishing quotes.',
      ],
    },
    open: 'Read the guide',
    steps: 'Steps',
    faq: 'Frequently asked questions',
    related: 'Related pages',
    allServices: 'All services and guides',
    onThisPage: 'On this page',
    note: 'No sign-up. Your file is processed in your browser.',
    breadcrumb: 'Breadcrumb',
    homeSection: { label: 'Services & guides', title: 'Practical guides for what you need', more: 'All services and guides' },
  },
};
