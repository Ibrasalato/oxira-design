// Build-cost calculator controller: reads the form, fetches live rates (fallback: bundled),
// renders the estimate, keeps the state in the URL, prints a PDF report and sends quote requests.
import { estimate, builtFromPlot, type CostInput } from '../lib/cost';
import type { CountryCode, Level, Rates, Soil } from '../lib/costRates';
import type { Lang } from '../i18n/content';

type Cfg = { lang: Lang; rates: Rates; live: string; quote: string; whatsapp: string; country: CountryCode; city: string; area: number };

const COLORS = { shell: '#4EA8DE', foundation: '#8FB8D8', finish: '#F5A800', design: '#9B8AFB', supervision: '#C3B5FD', contingency: '#7C8B99', extras: '#3DD68C' } as const;

export function startCost(root: HTMLElement) {
  const cfg: Cfg = JSON.parse(root.dataset.cfg!);
  const T = JSON.parse(root.dataset.t!);
  let rates: Rates = cfg.rates;
  const form = root.querySelector<HTMLFormElement>('#cc-form')!;
  const $ = <E extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as E;
  const field = <E extends HTMLInputElement | HTMLSelectElement>(n: string) => form.elements.namedItem(n) as E;
  const locale = cfg.lang === 'ar' ? 'ar-SA-u-nu-latn-ca-gregory' : cfg.lang === 'ur' ? 'ur-PK-u-nu-latn' : cfg.lang;
  const nf = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const cur = (c: string) => (cfg.lang === 'ar' ? (c === 'SAR' ? 'ر.س' : 'ج.م') : c);
  const money = (n: number, c: string) => `${nf.format(n)} ${cur(c)}`;
  const range = (r: [number, number], c: string) => `${nf.format(r[0])} – ${nf.format(r[1])} ${cur(c)}`;

  // ------------------------------------------------------------ state from the URL
  const qs = new URLSearchParams(location.search);
  const setVal = (n: string, v: string | null) => { if (v === null) return; const el = field(n); if (el) el.value = v; };
  const country = (qs.get('country') === 'EG' ? 'EG' : qs.get('country') === 'SA' ? 'SA' : cfg.country) as CountryCode;
  field<HTMLSelectElement>('country').value = country;
  const fillCities = (c: CountryCode, keep = '') => {
    const sel = field<HTMLSelectElement>('city');
    sel.innerHTML = '';
    for (const k of Object.keys(rates[c].cities)) sel.add(new Option(T.cities[k] || k, k));
    if (c === 'SA') sel.add(new Option(T.cityAny, ''));
    sel.value = keep && rates[c].cities[keep] !== undefined ? keep : sel.options[0].value;
  };
  fillCities(country, qs.get('city') || cfg.city);
  for (const k of ['area', 'w', 'd', 'floors', 'cov', 'annex', 'soil', 'extras']) setVal(k, qs.get(k));
  if (qs.get('mode') === 'plot') (form.querySelector('[name=mode][value=plot]') as HTMLInputElement).checked = true;
  const lv = qs.get('level');
  if (lv === 'economy' || lv === 'standard' || lv === 'luxury') (form.querySelector(`[name=level][value=${lv}]`) as HTMLInputElement).checked = true;
  for (const k of ['cont', 'design', 'sup']) if (qs.has(k)) (field<HTMLInputElement>(k)).checked = qs.get(k) === '1';
  const plan = qs.get('plan');
  if (plan && /^[a-z0-9-]{3,80}$/.test(plan)) { const p = $('cc-plan'); p.textContent = T.fromPlan.replace('{s}', plan); p.hidden = false; }

  // ------------------------------------------------------------ read and render
  const num = (n: string) => Number(field(n).value) || 0;
  const read = () => {
    const c = field<HTMLSelectElement>('country').value as CountryCode;
    const mode = (form.querySelector('[name=mode]:checked') as HTMLInputElement).value;
    const area = mode === 'plot' ? builtFromPlot(num('w'), num('d'), num('cov') / 100, num('floors'), num('annex')) : num('area');
    const input: CostInput = {
      area, level: (form.querySelector('[name=level]:checked') as HTMLInputElement).value as Level,
      city: field<HTMLSelectElement>('city').value, soil: field<HTMLSelectElement>('soil').value as Soil,
      design: field<HTMLInputElement>('design').checked, supervision: field<HTMLInputElement>('sup').checked,
      contingency: field<HTMLInputElement>('cont').checked, extras: Math.max(0, num('extras')),
    };
    return { c, mode, input };
  };

  let last: { c: CountryCode; input: CostInput; total: [number, number]; currency: string } | null = null;
  function render() {
    const { c, mode, input } = read();
    form.querySelectorAll<HTMLElement>('.cc-mode').forEach((el) => { el.hidden = el.dataset.mode !== mode; });
    if (mode === 'plot') $('cc-built').textContent = T.builtIs.replace('{n}', nf.format(input.area));
    const R = rates[c];
    const r = estimate(R, input);
    last = { c, input, total: r.total, currency: r.currency };
    $('cc-total').textContent = input.area > 0 ? range(r.total, r.currency) : '—';
    $('cc-per').textContent = input.area > 0 ? `${range(r.perM2, r.currency)} ${T.perM2} · ${nf.format(input.area)} ${T.m2}` : '';
    // stacked bar by midpoint share
    const mid = (x: [number, number]) => (x[0] + x[1]) / 2;
    const sum = r.lines.reduce((s, l) => s + mid(l.range), 0) || 1;
    $('cc-split').innerHTML = r.lines.filter((l) => mid(l.range) > 0).map((l) => `<i style="width:${(mid(l.range) / sum) * 100}%;background:${COLORS[l.key]}" title="${T.lines[l.key]}"></i>`).join('');
    $('cc-lines').innerHTML = r.lines.filter((l) => l.range[1] > 0).map((l) =>
      `<li><span class="dot" style="background:${COLORS[l.key]}"></span><span>${T.lines[l.key]}</span><b>${l.range[0] === l.range[1] ? money(l.range[0], r.currency) : range(l.range, r.currency)}</b></li>`).join('')
      + `<li><span class="dot" style="background:transparent"></span><span>${T.materials} / ${T.labour}</span><b>${nf.format(Math.round(R.materials[0] * 100))}% / ${nf.format(Math.round((1 - R.materials[1]) * 100))}%</b></li>`;
    const rows = (['economy', 'standard', 'luxury'] as Level[]).map((l) => {
      const e = estimate(R, { ...input, level: l });
      return `<tr class="${l === input.level ? 'is-on' : ''}"><td>${T.levels[l].t}</td><td>${input.area > 0 ? range(e.total, e.currency) : '—'}</td></tr>`;
    }).join('');
    ($('cc-cmp').querySelector('tbody') as HTMLElement).innerHTML = rows;
    $('cc-ref').textContent = `${T.steel}: ${range(R.steelTon, R.currency)}` + (R.cementTon ? ` · ${T.cement}: ${range(R.cementTon, R.currency)}` : '');
    const upd = /^\d{4}-\d{2}/.test(rates.updated) ? new Date(rates.updated.slice(0, 7) + '-01T12:00:00').toLocaleDateString(locale, { month: 'long', year: 'numeric' }) : rates.updated;
    $('cc-upd').textContent = T.updated.replace('{d}', upd);
    // keep the URL shareable
    const u = new URLSearchParams();
    u.set('country', c); if (input.city) u.set('city', input.city);
    u.set('mode', mode);
    if (mode === 'plot') for (const k of ['w', 'd', 'floors', 'cov', 'annex']) u.set(k, field(k).value); else u.set('area', String(input.area));
    u.set('level', input.level); u.set('soil', input.soil);
    u.set('cont', input.contingency ? '1' : '0'); u.set('design', input.design ? '1' : '0'); u.set('sup', input.supervision ? '1' : '0');
    if (input.extras) u.set('extras', String(input.extras));
    if (plan) u.set('plan', plan);
    history.replaceState(null, '', `${location.pathname}?${u}${location.hash}`);
  }

  form.addEventListener('input', render);
  form.addEventListener('change', (e) => {
    if ((e.target as HTMLElement).getAttribute('name') === 'country') fillCities(field<HTMLSelectElement>('country').value as CountryCode);
    render();
  });
  render();

  // live rates from n8n (approved monthly); silently keep the bundled ones if unavailable
  fetch(cfg.live, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: '{}' })
    .then((r) => r.json())
    .then((j) => {
      const live = j && j.rates;
      if (live && live.SA && live.EG && live.SA.shell && live.EG.shell) {
        rates = { ...cfg.rates, ...live, SA: { ...cfg.rates.SA, ...live.SA }, EG: { ...cfg.rates.EG, ...live.EG } };
        const keep = field<HTMLSelectElement>('city').value;
        fillCities(field<HTMLSelectElement>('country').value as CountryCode, keep);
        render();
      }
    })
    .catch(() => {});

  // ------------------------------------------------------------ actions
  $('cc-print').addEventListener('click', () => window.print());
  $('cc-copy').addEventListener('click', async (e) => {
    const b = e.currentTarget as HTMLButtonElement;
    try { await navigator.clipboard.writeText(location.href); } catch {}
    const t = b.textContent; b.textContent = T.copied; setTimeout(() => { b.textContent = t; }, 1800);
  });

  const q = $<HTMLFormElement>('cc-qform');
  const qmsg = $('cc-qmsg');
  const say = (html: string, ok: boolean) => { qmsg.hidden = false; qmsg.className = 'cc-qmsg cc-wide' + (ok ? '' : ' is-err'); qmsg.innerHTML = html; };
  q.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(q);
    const name = String(fd.get('name') || '').trim(), phone = String(fd.get('phone') || '').replace(/[^\d+]/g, '');
    if (name.length < 2 || phone.replace(/\D/g, '').length < 8) { say(T.invalid, false); return; }
    const btn = q.querySelector('button[type=submit]') as HTMLButtonElement;
    btn.disabled = true; const label = btn.textContent; btn.textContent = T.sending;
    try {
      const body = {
        name, phone, email: String(fd.get('email') || '').trim(), notes: String(fd.get('notes') || '').trim(), company_website: String(fd.get('company_website') || ''),
        country: last?.c, city: last?.input.city, area: last?.input.area, level: last?.input.level, soil: last?.input.soil,
        low: last?.total[0], high: last?.total[1], currency: last?.currency, plan: plan || '', lang: cfg.lang, page: location.href,
      };
      const r = await (await fetch(cfg.quote, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body) })).json();
      if (r.success) { say(T.ok.replace('{id}', String(r.id || '')), true); q.reset(); }
      else if (r.reason === 'limit') say(`${T.limit} <a href="${cfg.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>`, false);
      else if (r.reason === 'invalid') say(T.invalid, false);
      else throw new Error(r.reason || 'failed');
    } catch {
      say(`${T.fail} <a href="${cfg.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>`, false);
    }
    btn.disabled = false; btn.textContent = label;
  });
}
