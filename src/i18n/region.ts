// Country picker copy (footer, plan designer, studio).
import type { Lang } from './content';

export const rg: Record<Lang, { country: string; units: string; metric: string; imperial: string; approx: string }> = {
  ar: { country: 'الدولة والعملة', units: 'الوحدات', metric: 'متر', imperial: 'قدم', approx: 'الأسعار بالعملات الأخرى تقريبية، والدفع بالريال.' },
  en: { country: 'Country and currency', units: 'Units', metric: 'Metres', imperial: 'Feet', approx: 'Prices in other currencies are approximate; you pay in SAR or USD.' },
  de: { country: 'Land und Währung', units: 'Einheiten', metric: 'Meter', imperial: 'Fuß', approx: 'Preise in anderen Währungen sind Richtwerte; bezahlt wird in SAR oder USD.' },
  fr: { country: 'Pays et devise', units: 'Unités', metric: 'Mètres', imperial: 'Pieds', approx: 'Les prix en autres devises sont indicatifs ; le paiement se fait en SAR ou USD.' },
  ru: { country: 'Страна и валюта', units: 'Единицы', metric: 'Метры', imperial: 'Футы', approx: 'Цены в других валютах примерные; оплата в SAR или USD.' },
};
