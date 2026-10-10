// Build-cost rates used by the calculator (/cost/). Per m² of built area, materials and labour included.
// Bundled defaults, researched October 2026 from the sources below; the live values come from the n8n
// workflow "Oxira Design — Build costs" (table oxira_design_cost_rates) once approved there.
// Keep ranges wide: these are planning estimates, not quotes.

export type Range = [number, number];
export type Level = 'economy' | 'standard' | 'luxury';
export type Soil = 'good' | 'average' | 'raft' | 'piles';
export type CountryCode = 'SA' | 'EG';

export type CountryRates = {
  currency: 'SAR' | 'EGP';
  /** structure with materials: excavation, foundations, reinforced-concrete frame, slabs, block/brick walls */
  shell: Range;
  /** finishing on top of the shell: plaster, MEP, tiles, paint, doors, windows, kitchens, bathrooms */
  finish: Record<Level, Range>;
  /** foundation premium as a share of the shell cost */
  foundation: Record<Soil, Range>;
  /** engineering office: design drawings and site supervision, share of construction cost (optional) */
  design: Range;
  supervision: Range;
  /** contingency share added to construction */
  contingency: number;
  /** share of the construction cost that is materials (the rest is labour) */
  materials: Range;
  /** reference material prices shown on the page */
  steelTon: Range;
  cementTon?: Range;
  /** city factor on construction cost; 1 = the national range */
  cities: Record<string, number>;
};

export type Rates = { updated: string; SA: CountryRates; EG: CountryRates };

export const BUNDLED_RATES: Rates = {
  updated: '2026-10',
  SA: {
    currency: 'SAR',
    shell: [550, 800],
    finish: { economy: [600, 900], standard: [900, 1400], luxury: [1600, 2800] },
    foundation: { good: [0, 0.05], average: [0.05, 0.1], raft: [0.15, 0.2], piles: [0.2, 0.35] },
    design: [0.05, 0.1],
    supervision: [0.02, 0.05],
    contingency: 0.1,
    materials: [0.7, 0.7],
    steelTon: [3100, 3300],
    cities: { riyadh: 1, jeddah: 1, dammam: 1, makkah: 1, madinah: 1 },
  },
  EG: {
    currency: 'EGP',
    shell: [3800, 5000],
    finish: { economy: [3500, 5000], standard: [5000, 7500], luxury: [7500, 12000] },
    foundation: { good: [0, 0.05], average: [0.05, 0.1], raft: [0.15, 0.2], piles: [0.2, 0.35] },
    design: [0.05, 0.1],
    supervision: [0.02, 0.05],
    contingency: 0.1,
    materials: [0.55, 0.6],
    steelTon: [37500, 39800],
    cementTon: [3850, 4010],
    // Greater Cairo sits at the top of the range; other governorates are about 10–15% cheaper
    cities: { cairo: 1, giza: 1, alexandria: 1, other: 0.87 },
  },
};

export const COST_CITIES: { id: string; country: CountryCode }[] = [
  { id: 'riyadh', country: 'SA' }, { id: 'jeddah', country: 'SA' }, { id: 'dammam', country: 'SA' },
  { id: 'makkah', country: 'SA' }, { id: 'madinah', country: 'SA' },
  { id: 'cairo', country: 'EG' }, { id: 'giza', country: 'EG' }, { id: 'alexandria', country: 'EG' },
];

/** Where the bundled numbers come from (shown on the page). */
export const COST_SOURCES = [
  { title: 'سعر متر البناء عظم في السعودية — Mentor KSA', url: 'https://mentorksa.com/%D8%B3%D8%B9%D8%B1-%D9%85%D8%AA%D8%B1-%D8%A7%D9%84%D8%A8%D9%86%D8%A7%D8%A1-%D8%B9%D8%B8%D9%85/' },
  { title: 'تكلفة البناء في السعودية 2026 — SCC', url: 'https://scc-sa.com/%D8%AA%D9%83%D9%84%D9%81%D8%A9-%D8%A7%D9%84%D8%A8%D9%86%D8%A7%D8%A1-%D9%81%D9%8A-%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9/' },
  { title: 'كم تكلفة تشطيب فيلا في السعودية 2026 — الاتحاد الرائدة', url: 'https://alittihad.sa/villa-finishing-cost-saudi-arabia-2026/' },
  { title: 'أسعار متر المقاولات في مصر 2026 — عقار 24', url: 'https://aqaar24.com/%D8%A3%D8%B3%D8%B9%D8%A7%D8%B1-%D9%85%D8%AA%D8%B1-%D8%A7%D9%84%D9%85%D9%82%D8%A7%D9%88%D9%84%D8%A7%D8%AA-%D9%81%D9%8A-%D9%85%D8%B5%D8%B1-2026-%D8%AA%D8%B4%D8%B7%D9%8A%D8%A8-%D8%B9%D8%B8/' },
  { title: 'كم تكلفة بناء المتر المربع 2026 — هندسة', url: 'https://www.handasa.xyz/2026/03/2026_14.html' },
  { title: 'نشرة أسعار مواد البناء في مصر أكتوبر 2026 — MatBuild', url: 'https://matbuild.net/%D9%86%D8%B4%D8%B1%D8%A9-%D8%A3%D8%B3%D8%B9%D8%A7%D8%B1-%D9%85%D9%88%D8%A7%D8%AF-%D8%A7%D9%84%D8%A8%D9%86%D8%A7%D8%A1-%D9%81%D9%8A-%D9%85%D8%B5%D8%B1-%D9%85%D8%A7%D9%8A%D9%88-2026/' },
  { title: 'أسعار الحديد في السعودية 2026 — Prices World', url: 'https://www.pricesworld.net/%D8%A7%D8%B3%D8%B9%D8%A7%D8%B1-%D8%A7%D9%84%D8%AD%D8%AF%D9%8A%D8%AF-%D8%A7%D9%84%D9%8A%D9%88%D9%85' },
];
