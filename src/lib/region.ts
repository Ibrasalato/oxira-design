// Countries: currency for price display, metric or imperial units, typical setbacks and the
// room programme people there expect. Values are planning defaults, not regulations: the
// engineers check every project against the local rules before drawings are issued.
import type { Lang } from '../i18n/content';

export type Units = 'm' | 'ft';
export type Programme = 'gulf' | 'egypt' | 'levant' | 'western' | 'asia';
export type Region = {
  id: string;
  currency: string;
  units: Units;
  programme: Programme;
  /** front setback from the street width (m), side and back setbacks (m), max ground coverage */
  setback: { front: (streetW: number) => number; side: number; back: number; coverage: number };
  /** setbacks for apartment buildings, when they differ */
  bldSetback?: { front: (streetW: number) => number; side: number; back: number; coverage: number };
  streetW: number;
};

const clamp = (v: number, a: number, b: number) => Math.round(Math.min(b, Math.max(a, v)) * 10) / 10;
const fifth = (w: number) => clamp(w / 5, 2, 6);

export const REGIONS: Region[] = [
  { id: 'SA', currency: 'SAR', units: 'm', programme: 'gulf', streetW: 15, setback: { front: fifth, side: 2, back: 2, coverage: 0.6 }, bldSetback: { front: fifth, side: 2, back: 2, coverage: 0.6 } },
  { id: 'AE', currency: 'AED', units: 'm', programme: 'gulf', streetW: 15, setback: { front: () => 3, side: 1.5, back: 1.5, coverage: 0.6 } },
  { id: 'KW', currency: 'KWD', units: 'm', programme: 'gulf', streetW: 12, setback: { front: () => 2, side: 1.5, back: 1.5, coverage: 0.7 } },
  { id: 'QA', currency: 'QAR', units: 'm', programme: 'gulf', streetW: 15, setback: { front: () => 3, side: 2, back: 2, coverage: 0.6 } },
  { id: 'BH', currency: 'BHD', units: 'm', programme: 'gulf', streetW: 12, setback: { front: () => 3, side: 1.5, back: 1.5, coverage: 0.6 } },
  { id: 'OM', currency: 'OMR', units: 'm', programme: 'gulf', streetW: 15, setback: { front: () => 3, side: 1.5, back: 1.5, coverage: 0.6 } },
  { id: 'EG', currency: 'EGP', units: 'm', programme: 'egypt', streetW: 12, setback: { front: () => 3, side: 3, back: 3, coverage: 0.5 }, bldSetback: { front: () => 0, side: 0, back: 2, coverage: 0.9 } },
  { id: 'JO', currency: 'JOD', units: 'm', programme: 'levant', streetW: 12, setback: { front: () => 4, side: 3, back: 3, coverage: 0.5 } },
  { id: 'TR', currency: 'TRY', units: 'm', programme: 'levant', streetW: 10, setback: { front: () => 5, side: 3, back: 3, coverage: 0.4 } },
  { id: 'US', currency: 'USD', units: 'ft', programme: 'western', streetW: 15, setback: { front: () => 6, side: 1.5, back: 6, coverage: 0.4 } },
  { id: 'GB', currency: 'GBP', units: 'm', programme: 'western', streetW: 10, setback: { front: () => 5, side: 1, back: 10, coverage: 0.5 } },
  { id: 'DE', currency: 'EUR', units: 'm', programme: 'western', streetW: 10, setback: { front: () => 3, side: 3, back: 3, coverage: 0.4 } },
  { id: 'FR', currency: 'EUR', units: 'm', programme: 'western', streetW: 10, setback: { front: () => 5, side: 3, back: 4, coverage: 0.4 } },
  { id: 'ES', currency: 'EUR', units: 'm', programme: 'western', streetW: 10, setback: { front: () => 3, side: 3, back: 3, coverage: 0.5 } },
  { id: 'RU', currency: 'RUB', units: 'm', programme: 'western', streetW: 10, setback: { front: () => 5, side: 3, back: 3, coverage: 0.3 } },
  { id: 'IN', currency: 'INR', units: 'ft', programme: 'asia', streetW: 9, setback: { front: () => 3, side: 1.5, back: 1.5, coverage: 0.6 } },
  { id: 'PK', currency: 'PKR', units: 'ft', programme: 'asia', streetW: 9, setback: { front: () => 3, side: 1, back: 2, coverage: 0.6 } },
  { id: 'CN', currency: 'CNY', units: 'm', programme: 'asia', streetW: 10, setback: { front: () => 3, side: 2, back: 3, coverage: 0.4 } },
  { id: 'XX', currency: 'USD', units: 'm', programme: 'western', streetW: 12, setback: { front: () => 3, side: 2, back: 3, coverage: 0.5 } },
];
export const regionById = (id: string | null | undefined) => REGIONS.find((r) => r.id === id) || null;

/** SAR per unit of each currency (approximate, for showing prices only; payment is in SAR or USD). */
export const SAR_PER: Record<string, number> = {
  SAR: 1, USD: 3.75, AED: 1.021, KWD: 12.2, QAR: 1.03, BHD: 9.95, OMR: 9.74, EGP: 0.077, JOD: 5.29, TRY: 0.11,
  GBP: 4.95, EUR: 4.3, RUB: 0.046, INR: 0.044, PKR: 0.0134, CNY: 0.52,
};

const KEY = 'ox-region';
const LANG_DEFAULT: Record<string, string> = { ar: 'SA', en: 'XX', de: 'DE', fr: 'FR', ru: 'RU', es: 'ES', tr: 'TR', zh: 'CN', hi: 'IN', ur: 'PK' };

/** Stored choice, else the browser's country (language tag or time zone), else the page language. */
export function detectRegion(lang: Lang | string): Region {
  try { const s = regionById(localStorage.getItem(KEY)); if (s) return s; } catch {}
  const tags = [...(navigator.languages || []), navigator.language].filter(Boolean);
  for (const t of tags) {
    const m = /-([A-Z]{2})$/i.exec(t);
    const r = m && regionById(m[1].toUpperCase());
    if (r) return r;
  }
  const tz = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { return ''; } })();
  const TZ: Record<string, string> = { Riyadh: 'SA', Dubai: 'AE', Kuwait: 'KW', Qatar: 'QA', Bahrain: 'BH', Muscat: 'OM', Cairo: 'EG', Amman: 'JO', Istanbul: 'TR', London: 'GB', Berlin: 'DE', Paris: 'FR', Madrid: 'ES', Moscow: 'RU', Kolkata: 'IN', Calcutta: 'IN', Karachi: 'PK', Shanghai: 'CN', New_York: 'US', Chicago: 'US', Denver: 'US', Los_Angeles: 'US' };
  for (const [k, v] of Object.entries(TZ)) if (tz.endsWith(k)) return regionById(v)!;
  return regionById(LANG_DEFAULT[lang] || 'XX')!;
}
export function saveRegion(id: string) {
  try { localStorage.setItem(KEY, id); } catch {}
  document.dispatchEvent(new CustomEvent('ox-region', { detail: id }));
}

/** Country name in the page language. */
export function regionName(id: string, lang: string): string {
  if (id === 'XX') return ({ ar: 'دولة أخرى', de: 'Anderes Land', fr: 'Autre pays', ru: 'Другая страна', es: 'Otro país', tr: 'Diğer ülke', zh: '其他国家', hi: 'अन्य देश', ur: 'دوسرا ملک' } as Record<string, string>)[lang] || 'Other country';
  try { return new Intl.DisplayNames([lang], { type: 'region' }).of(id) || id; } catch { return id; }
}

export function localPrice(sar: number, r: Region, lang: string): string {
  const rate = SAR_PER[r.currency] || 3.75;
  const v = sar / rate;
  const digits = v >= 100 ? 0 : v >= 10 ? 1 : 2;
  try {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA-u-nu-latn' : lang, { style: 'currency', currency: r.currency, maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(v);
  } catch { return `${v.toFixed(digits)} ${r.currency}`; }
}

// ------------------------------------------------------------ units
export const FT = 3.28084;
export const lenIn = (m: number, u: Units) => (u === 'ft' ? m * FT : m);
export const lenOut = (v: number, u: Units) => (u === 'ft' ? v / FT : v);
export const areaIn = (m2: number, u: Units) => (u === 'ft' ? m2 * FT * FT : m2);
