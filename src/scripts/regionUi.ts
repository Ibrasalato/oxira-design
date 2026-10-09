// Applies the visitor's country to the page: local prices next to SAR prices, and the country pickers.
import { detectRegion, regionById, saveRegion, localPrice } from '../lib/region';

export function initRegionUi() {
  const lang = document.documentElement.lang || 'en';
  const apply = () => {
    const r = detectRegion(lang);
    document.querySelectorAll<HTMLSelectElement>('[data-region-select]').forEach((s) => { s.value = r.id; });
    document.querySelectorAll<HTMLElement>('[data-sar]').forEach((el) => {
      const sar = Number(el.dataset.sar);
      if (!sar || r.currency === 'SAR') { el.hidden = true; return; }
      el.hidden = false;
      el.textContent = `≈ ${localPrice(sar, r, lang)}${el.dataset.suffix || ''}`;
    });
  };
  document.addEventListener('change', (e) => {
    const s = (e.target as HTMLElement).closest<HTMLSelectElement>('[data-region-select]');
    if (s && regionById(s.value)) saveRegion(s.value);
  });
  document.addEventListener('ox-region', apply);
  apply();
}
