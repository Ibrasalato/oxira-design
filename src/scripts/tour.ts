// Shared 3D listing tour: loads the listing from n8n and shows it with the studio viewer.
import { planFromJson } from './studio/share.ts';
import type { View } from './studio/viewer.ts';
import type { StyleId } from './studio/styles.ts';

interface Cfg {
  lang: string;
  get: string;
  types: Record<string, string>;
  t: { notFound: string; draft: string; checking: string; onRequest: string; sar: string; m2: string; copied: string; share: string; contactMsg: string };
}
interface Listing {
  success?: boolean; id?: string; status?: string; title?: string; city?: string; district?: string; price?: string;
  area?: number; style?: string; phone?: string; plan?: string;
  copy?: { ar?: { headline?: string; body?: string }; en?: { headline?: string; body?: string }; hashtags?: string[] };
}

export async function initTour() {
  const root = document.getElementById('tr');
  if (!root) return;
  const cfg = JSON.parse(root.dataset.cfg || '{}') as Cfg;
  const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const msg = $('tr-msg');
  const fail = (text: string) => { msg.classList.add('is-err'); msg.querySelector('p')!.textContent = text; };
  const fmt = (n: number, d = 0) => new Intl.NumberFormat(cfg.lang === 'ar' ? 'ar-SA-u-nu-latn' : cfg.lang, { maximumFractionDigits: d }).format(n);

  const params = new URLSearchParams(location.search);
  const id = (params.get('id') || '').replace(/[^a-z0-9]/g, '').slice(0, 20);
  if (!id) { fail(cfg.t.notFound); return; }

  let data: Listing;
  try {
    const res = await fetch(cfg.get, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    data = await res.json();
  } catch { fail(cfg.t.notFound); return; }
  if (!data.success || !data.plan) { fail(cfg.t.notFound); return; }

  let plan: ReturnType<typeof planFromJson>;
  try { plan = planFromJson(data.plan); } catch { fail(cfg.t.notFound); return; }
  const title = data.title || '';
  document.title = `${title} | Oxira Design`;

  // status
  if (data.status !== 'active') {
    const b = $('tr-banner');
    b.textContent = params.has('paid') ? cfg.t.checking : cfg.t.draft;
    b.hidden = false;
  }

  // facts
  $('tr-title').textContent = title;
  $('tr-loc').textContent = [data.district, data.city].filter(Boolean).join(cfg.lang === 'ar' || cfg.lang === 'ur' ? '، ' : ', ');
  const price = Number(String(data.price || '').replace(/[^\d.]/g, ''));
  $('tr-price').textContent = price ? `${fmt(price)} ${cfg.t.sar}` : (data.price || cfg.t.onRequest);
  const area = plan.rooms.reduce((s, r) => s + r.area, 0);
  $('tr-area').textContent = `${fmt(area, 1)} ${cfg.t.m2}`;
  $('tr-beds').textContent = String(plan.rooms.filter((r) => r.type === 'bedroom').length);
  $('tr-baths').textContent = String(plan.rooms.filter((r) => r.type === 'bath').length);
  $('tr-rooms').innerHTML = '';
  for (const r of plan.rooms.slice().sort((a, b) => b.area - a.area)) {
    const li = document.createElement('li');
    const n = document.createElement('span');
    n.textContent = r.name || cfg.types[r.type] || r.type;
    const a = document.createElement('small');
    a.textContent = `${fmt(r.area, 1)} ${cfg.t.m2}`;
    li.append(n, a);
    $('tr-rooms').appendChild(li);
  }

  const url = `${location.origin}${location.pathname}?id=${id}`;
  if (data.phone) {
    const digits = data.phone.replace(/\D/g, '').replace(/^0(5\d{8})$/, '966$1');
    const c = $<HTMLAnchorElement>('tr-contact');
    c.href = `https://wa.me/${digits}?text=${encodeURIComponent(`${cfg.t.contactMsg.replace('{t}', title)}\n${url}`)}`;
    c.hidden = false;
  }
  $<HTMLImageElement>('tr-qr').src = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=12&data=${encodeURIComponent(url)}`;

  // ad copy (Arabic page → Arabic copy, other languages → English copy)
  const copy = data.copy || {};
  const c = (cfg.lang === 'ar' ? copy.ar : copy.en) || copy.ar || {};
  if (c.headline || c.body) {
    $('tr-ad-h').textContent = c.headline || '';
    $('tr-ad-b').textContent = c.body || '';
    $('tr-ad-tags').textContent = (copy.hashtags || []).map((h) => (h.startsWith('#') ? h : '#' + h)).join(' ');
    $('tr-ad-box').hidden = false;
    $('tr-ad-copy').addEventListener('click', async () => {
      const text = [c.headline, c.body, url, $('tr-ad-tags').textContent].filter(Boolean).join('\n\n');
      try { await navigator.clipboard.writeText(text); $('tr-ad-copy').textContent = cfg.t.copied; } catch { /* ignore */ }
    });
  }

  $('tr-share').addEventListener('click', async () => {
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (nav.share) { try { await nav.share({ title, url }); return; } catch { /* cancelled */ } }
    try { await navigator.clipboard.writeText(url); $('tr-share').lastChild!.textContent = cfg.t.copied; } catch { /* ignore */ }
  });
  $('tr-info').hidden = false;

  // 3D
  const { Viewer } = await import('./studio/viewer.ts');
  const host = $('tr-view');
  const viewer = new Viewer(host, { labels: (n, a) => `${n}\n${fmt(a, 1)} ${cfg.t.m2}` });
  viewer.setPlan(plan);
  viewer.setStyle((data.style || 'modern') as StyleId);
  msg.remove();
  $('tr-tools').hidden = false;

  const setView = (v: View) => {
    viewer.setView(v);
    root.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === v)));
    $('tr-walk').hidden = v !== 'walk';
    if (v === 'walk') viewer.renderer.domElement.focus();
  };
  root.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((b) => b.addEventListener('click', () => setView(b.dataset.view as View)));
  $('tr-full').addEventListener('click', () => { document.fullscreenElement ? document.exitFullscreen() : host.requestFullscreen?.(); });

  let turnTimer = 0;
  root.querySelectorAll<HTMLButtonElement>('[data-move]').forEach((b) => {
    const m = b.dataset.move!;
    const start = (e: Event) => {
      e.preventDefault();
      if (m === 'f') viewer.setMove(1, 0);
      if (m === 'b') viewer.setMove(-1, 0);
      if (m === 'l') viewer.setMove(0, -1);
      if (m === 'r') viewer.setMove(0, 1);
      if (m === 'tl' || m === 'tr') { clearInterval(turnTimer); turnTimer = window.setInterval(() => viewer.turn(m === 'tl' ? -0.04 : 0.04), 16); }
    };
    const stop = () => { viewer.setMove(0, 0); clearInterval(turnTimer); };
    b.addEventListener('pointerdown', start);
    b.addEventListener('pointerup', stop);
    b.addEventListener('pointerleave', stop);
    b.addEventListener('pointercancel', stop);
  });
}
