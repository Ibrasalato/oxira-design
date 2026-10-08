// Studio controller: file loading, layer roles, rebuilding, panels, exports, AI render and order hand-off.
import { readDxf, rescale, type Flat, type Role } from './dxf.ts';
import { buildPlan, type Plan, type RoomType } from './plan.ts';
import { computeBoq, boqCsv } from './boq.ts';
import { planToJson } from './share.ts';
import type { Viewer, View } from './viewer.ts';
import type { StyleId } from './styles.ts';
import { st } from '../../i18n/studio';
import type { Lang } from '../../i18n/content';

type Cfg = { lang: Lang; render: string; finishing: string; listing: string; tour: string; samples: Record<string, string>; whatsapp: string };

export function startStudio(root: HTMLElement) {
  const cfg: Cfg = JSON.parse(root.dataset.cfg!);
  const T = st[cfg.lang];
  const $ = <E extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as E;
  const fmt = (n: number, d = 1) => new Intl.NumberFormat(cfg.lang === 'ar' ? 'ar-SA-u-nu-latn' : cfg.lang, { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);

  let viewer: Viewer | null = null;
  let flat0: Flat | null = null;      // as read (auto units)
  let flat: Flat | null = null;       // current units
  let roles: Record<string, Role> = {};
  let plan: Plan | null = null;
  let style: StyleId = 'modern';
  let fileName = '';
  let fileBlob: Blob | null = null;
  let dwgBlob: File | null = null;
  const edits = new Map<number, { name?: string; type?: RoomType }>();

  const busy = (txt: string | null) => { $('sd-busy').hidden = !txt; $('sd-busy-t').textContent = txt || ''; };
  const alert = (html: string | null) => { const a = $('sd-alert'); a.hidden = !html; a.innerHTML = html || ''; };

  async function ensureViewer() {
    if (viewer) return viewer;
    const { Viewer } = await import('./viewer.ts');
    viewer = new Viewer($('sd-view'), { labels: (n, a) => `${n}\n${fmt(a)} m²` });
    return viewer;
  }

  // ------------------------------------------------------------ loading
  async function loadFile(f: File) {
    alert(null);
    if (f.size > 40 * 1048576) { alert(T.upload.tooBig); return; }
    const head = new Uint8Array(await f.slice(0, 6).arrayBuffer());
    const isDwg = /\.dwg$/i.test(f.name) || String.fromCharCode(...head).startsWith('AC10');
    if (isDwg) {
      dwgBlob = f;
      alert(`${T.upload.dwg}<br><button type="button" class="btn btn-amber" data-sd-order>${T.upload.sendDwg}</button>`);
      exposeAttach();
      return;
    }
    await loadText(await f.text(), f.name, f);
  }

  async function loadText(text: string, name: string, blob: Blob) {
    busy(T.upload.reading);
    await new Promise((r) => setTimeout(r, 30));
    try {
      flat0 = readDxf(text);
    } catch (e) {
      console.warn(e);
      busy(null);
      alert(T.upload.fail);
      return;
    }
    fileName = name; fileBlob = blob; dwgBlob = null;
    edits.clear();
    flat = flat0;
    roles = Object.fromEntries(flat0.layers.map((l) => [l.name, l.role]));
    ($('sd-units') as HTMLSelectElement).value = 'auto';
    $('sd-guessed').hidden = !flat0.unitGuessed;
    $('sd-file-name').textContent = name;
    $('sd-file-row').hidden = false;
    $('sd-drop').hidden = true;
    renderLayers();
    await rebuild();
  }

  async function rebuild() {
    if (!flat) return;
    busy(T.upload.building);
    await new Promise((r) => setTimeout(r, 30));
    const h = Math.max(2.2, Math.min(8, parseFloat(($('sd-height') as HTMLInputElement).value) || 3));
    plan = buildPlan(flat, roles, h);
    applyEdits();
    const v = await ensureViewer();
    v.setStyle(style);
    v.setFurniture(($('sd-furnish') as HTMLInputElement).checked);
    v.setLabels(($('sd-labels') as HTMLInputElement).checked);
    v.setPlan(plan);
    setView('orbit');
    $('sd-empty').hidden = true;
    $('sd-tools').hidden = false;
    $('sd-after').hidden = false;
    busy(null);
    renderSummary();
    if (plan.warnings.includes('noWalls')) alert(T.warn.noWalls);
    else if (plan.warnings.includes('noRooms')) alert(T.warn.noRooms);
    else alert(null);
  }

  function applyEdits() {
    if (!plan) return;
    for (const r of plan.rooms) {
      const e = edits.get(r.id);
      if (e?.name !== undefined) r.name = e.name;
      if (e?.type) r.type = e.type;
      if (!r.name) r.name = T.types[r.type];
    }
  }

  // ------------------------------------------------------------ panels
  function renderLayers() {
    const ul = $('sd-layers');
    ul.innerHTML = '';
    for (const l of flat0!.layers) {
      const li = document.createElement('li');
      const label = document.createElement('span');
      label.dir = 'auto';
      label.textContent = l.name;
      const small = document.createElement('small');
      small.textContent = `${l.segs} ${T.layers.lines}`;
      label.appendChild(small);
      const sel = document.createElement('select');
      for (const r of ['wall', 'door', 'window', 'ignore'] as Role[]) {
        const o = document.createElement('option');
        o.value = r; o.textContent = T.layers.roles[r];
        sel.appendChild(o);
      }
      sel.value = roles[l.name] || 'ignore';
      sel.addEventListener('change', () => { roles[l.name] = sel.value as Role; });
      li.append(label, sel);
      ul.appendChild(li);
    }
  }

  function renderSummary() {
    if (!plan) return;
    const total = plan.rooms.reduce((s, r) => s + r.area, 0);
    $('sd-total').textContent = `${fmt(total)} ${T.boq.m2}`;
    $('sd-stats').textContent = T.stats(plan.walls.length, plan.openings.length, plan.rooms.length);
    // rooms
    const ul = $('sd-rooms');
    ul.innerHTML = '';
    if (!plan.rooms.length) { const li = document.createElement('li'); li.textContent = T.rooms.empty; ul.appendChild(li); }
    for (const r of plan.rooms.slice().sort((a, b) => b.area - a.area)) {
      const li = document.createElement('li');
      const name = document.createElement('input');
      name.value = r.name; name.dir = 'auto'; name.maxLength = 40;
      name.addEventListener('change', () => { edits.set(r.id, { ...edits.get(r.id), name: name.value.trim() }); r.name = name.value.trim() || T.types[r.type]; refreshModel(); });
      const area = document.createElement('b');
      area.textContent = `${fmt(r.area)} ${T.boq.m2}`;
      const type = document.createElement('select');
      for (const k of Object.keys(T.types) as RoomType[]) { const o = document.createElement('option'); o.value = k; o.textContent = T.types[k]; type.appendChild(o); }
      type.value = r.type;
      type.addEventListener('change', () => { edits.set(r.id, { ...edits.get(r.id), type: type.value as RoomType }); r.type = type.value as RoomType; refreshModel(); renderBoq(); });
      const meta = document.createElement('small');
      meta.textContent = `${r.doors} ${T.rooms.doors} · ${r.windows} ${T.rooms.windows}`;
      li.append(name, area, type, meta);
      ul.appendChild(li);
    }
    renderBoq();
    publishContext();
    renderQuota();
  }

  function renderBoq() {
    if (!plan) return;
    const b = computeBoq(plan);
    const rows: [string, number, string][] = [
      [T.boq.floor, b.total.floor, T.boq.m2],
      [T.boq.paint, b.total.paint, T.boq.m2],
      [T.boq.wetWalls, b.total.tiles, T.boq.m2],
      [T.boq.ceiling, b.total.ceiling, T.boq.m2],
      [T.boq.skirting, b.total.skirting, T.boq.m],
    ];
    $('sd-boq').innerHTML = rows.map(([k, v, u]) => `<tr><td>${k}</td><td>${fmt(v, 1)} ${u}</td></tr>`).join('');
  }

  function refreshModel() {
    if (!viewer || !plan) return;
    const cut = viewer.cut, view = viewer.view;
    viewer.setPlan(plan);
    if (view !== 'orbit') setView(view);
    else if (cut) viewer.setCut(true);
    publishContext();
  }

  function publishContext() {
    if (!plan) return;
    const total = plan.rooms.reduce((s, r) => s + r.area, 0);
    const w = window as any;
    w.oxDesignArea = total;
    w.oxDesignStyle = style;
    w.oxDesignContext = `Studio plan "${fileName}": total ${total.toFixed(1)} m², ceiling ${plan.height} m, style ${style}. Rooms: ` +
      plan.rooms.map((r) => `${r.name} (${r.type}) ${r.area.toFixed(1)} m²`).join('; ');
    exposeAttach();
  }

  function summaryJson() {
    if (!plan) return JSON.stringify({ file: dwgBlob?.name || fileName });
    const b = computeBoq(plan);
    return JSON.stringify({
      file: fileName, style, height: plan.height, totalArea: +b.total.area.toFixed(2),
      rooms: plan.rooms.map((r) => ({ name: r.name, type: r.type, area: +r.area.toFixed(2), doors: r.doors, windows: r.windows })),
      quantities: Object.fromEntries(Object.entries(b.total).map(([k, v]) => [k, +v.toFixed(2)])),
      walls: plan.walls.length, openings: plan.openings.length,
    });
  }

  function exposeAttach() {
    const w = window as any;
    w.oxDesignAttach = async () => {
      const files: { field: string; name: string; blob: Blob }[] = [];
      if (dwgBlob) files.push({ field: 'source', name: dwgBlob.name, blob: dwgBlob });
      if (fileBlob && plan) files.push({ field: 'source', name: fileName, blob: fileBlob });
      if (viewer && plan) {
        const shot = await (await fetch(viewer.snapshot('image/jpeg', 0.85, 1600))).blob();
        files.push({ field: 'preview', name: 'preview.jpg', blob: shot });
        try { const glb = await viewer.exportGLB(); if (glb.size < 6 * 1048576) files.push({ field: 'model', name: 'model.glb', blob: glb }); } catch {}
      }
      return { files, summary: summaryJson() };
    };
    document.querySelectorAll('form.of').forEach((f) => f.dispatchEvent(new Event('ox-sync')));
  }

  // ------------------------------------------------------------ views
  function setView(v: View) {
    if (!viewer) return;
    viewer.setView(v);
    root.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === v)));
    $('sd-cut').setAttribute('aria-pressed', String(viewer.cut));
    $('sd-walk').hidden = v !== 'walk';
    $('sd-cut').hidden = v === 'walk';
    if (v === 'walk') viewer.renderer.domElement.focus();
  }

  // ------------------------------------------------------------ AI render
  const SID_KEY = 'oxira-design-sid';
  let sid = '';
  try { sid = localStorage.getItem(SID_KEY) || ''; } catch {}
  if (!sid) { sid = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()).replace(/[^a-z0-9]/gi, ''); try { localStorage.setItem(SID_KEY, sid); } catch {} }
  let remaining: number | null = null;
  const renderQuota = () => { $('sd-render-left').textContent = remaining === null ? '' : `${T.render.left}: ${remaining}`; };

  // Same view + style already rendered in this visit: show it again instead of spending another render.
  const renderCache = new Map<string, string>();
  const hash = (t: string) => { let h = 2166136261; for (let i = 0; i < t.length; i += 7) h = Math.imul(h ^ t.charCodeAt(i), 16777619); return (h >>> 0).toString(36) + t.length; };
  const showRender = (src: string) => {
    const out = $('sd-render-out');
    const dl = $('sd-render-dl') as HTMLAnchorElement;
    out.innerHTML = '';
    const img = new Image();
    img.alt = T.render.title;
    img.src = src;
    out.appendChild(img);
    dl.href = src; dl.hidden = false;
  };

  async function aiRender() {
    if (!viewer || !plan) return;
    const dlg = $('sd-render-dlg') as HTMLDialogElement;
    const out = $('sd-render-out');
    const dl = $('sd-render-dl') as HTMLAnchorElement;
    dl.hidden = true;
    out.innerHTML = `<div><div class="sd-busy" style="position:static;background:none"><i></i><span>${T.render.working}</span></div></div>`;
    dlg.showModal();
    try {
      const labels = viewer.showLabels;
      viewer.setLabels(false);
      const image = viewer.snapshot('image/jpeg', 0.85, 1024);
      viewer.setLabels(labels);
      const key = `${style}|${viewer.view}|${hash(image)}`;
      const cached = renderCache.get(key);
      if (cached) { showRender(cached); return; }
      const room = plan.rooms.slice().sort((a, b) => b.area - a.area)[0];
      const res = await fetch(cfg.render, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' }, // simple request, no CORS preflight
        body: JSON.stringify({ sessionId: sid, image, style, view: viewer.view, room: room ? room.type : 'room', lang: cfg.lang }),
      });
      const j = await res.json();
      if (typeof j.remaining === 'number') { remaining = j.remaining; renderQuota(); }
      if (j.reason === 'limit') { out.innerHTML = `<p>${T.render.limit}</p>`; return; }
      if (!j.success || !j.image) throw new Error(j.reason || 'failed');
      const src = String(j.image).startsWith('data:') || String(j.image).startsWith('http') ? j.image : `data:image/jpeg;base64,${j.image}`;
      renderCache.set(key, src);
      showRender(src);
    } catch (e) {
      console.warn(e);
      out.innerHTML = `<p>${T.render.fail}</p>`;
    }
  }

  // ------------------------------------------------------------ downloads
  const save = (blob: Blob, name: string) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  };
  const base = () => (fileName.replace(/\.[^.]+$/, '') || 'oxira-design') + '-oxira';

  // ------------------------------------------------------------ events
  const fileInput = $('sd-file') as HTMLInputElement;
  fileInput.addEventListener('change', () => { const f = fileInput.files?.[0]; if (f) loadFile(f); fileInput.value = ''; });
  $('sd-replace').addEventListener('click', () => fileInput.click());
  const drop = $('sd-drop');
  for (const el of [drop, $('sd-stage')]) {
    el.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('is-over'); });
    el.addEventListener('dragleave', () => drop.classList.remove('is-over'));
    el.addEventListener('drop', (e) => { e.preventDefault(); drop.classList.remove('is-over'); const f = (e as DragEvent).dataTransfer?.files?.[0]; if (f) loadFile(f); });
  }
  root.addEventListener('click', async (e) => {
    const el = e.target as HTMLElement;
    const sample = el.closest<HTMLElement>('[data-sample]');
    if (sample) {
      const url = cfg.samples[sample.dataset.sample!];
      busy(T.upload.reading);
      const txt = await (await fetch(url)).text();
      await loadText(txt, url.split('/').pop()!, new Blob([txt], { type: 'application/dxf' }));
      return;
    }
    const sb = el.closest<HTMLElement>('[data-style]');
    if (sb) {
      style = sb.dataset.style as StyleId;
      root.querySelectorAll('[data-style]').forEach((b) => b.setAttribute('aria-pressed', String(b === sb)));
      viewer?.setStyle(style);
      if (viewer?.view === 'top') viewer.setCut(true);
      publishContext();
      return;
    }
    const vb = el.closest<HTMLElement>('[data-view]');
    if (vb) { setView(vb.dataset.view as View); return; }
    const ex = el.closest<HTMLElement>('[data-export]');
    if (ex && viewer) {
      const k = ex.dataset.export;
      if (k === 'png') save(await (await fetch(viewer.snapshot('image/png'))).blob(), base() + '.png');
      if (k === 'glb') save(await viewer.exportGLB(), base() + '.glb');
      if (k === 'obj') save(await viewer.exportOBJ(), base() + '.obj');
    }
  });
  document.addEventListener('click', (e) => {
    const el = e.target as HTMLElement;
    if (el.closest('[data-sd-order]') || el.closest('#hd-order')) {
      e.preventDefault();
      ($('sd-render-dlg') as HTMLDialogElement).close();
      exposeAttach();
      ($('sd-order-dlg') as HTMLDialogElement).showModal();
    }
    const close = el.closest('[data-close]');
    if (close) (close.closest('dialog') as HTMLDialogElement).close();
  });
  $('sd-cut').addEventListener('click', () => { if (!viewer) return; viewer.setCut(!viewer.cut); $('sd-cut').setAttribute('aria-pressed', String(viewer.cut)); });
  $('sd-reset').addEventListener('click', () => { if (viewer) setView(viewer.view === 'walk' ? 'walk' : viewer.view); });
  $('sd-full').addEventListener('click', () => { const s = $('sd-stage'); document.fullscreenElement ? document.exitFullscreen() : s.requestFullscreen?.(); });
  $('sd-furnish').addEventListener('change', (e) => viewer?.setFurniture((e.target as HTMLInputElement).checked));
  $('sd-labels').addEventListener('change', (e) => viewer?.setLabels((e.target as HTMLInputElement).checked));
  $('sd-rebuild').addEventListener('click', () => {
    if (!flat0) return;
    const u = ($('sd-units') as HTMLSelectElement).value;
    flat = u === 'auto' ? flat0 : rescale(flat0, parseFloat(u));
    edits.clear();
    rebuild();
  });
  $('sd-csv').addEventListener('click', () => {
    if (!plan) return;
    const head = [T.rooms.title, '', T.boq.m2, T.boq.floor, T.boq.paint, T.boq.wetWalls, T.boq.ceiling, T.boq.skirting];
    save(new Blob([boqCsv(computeBoq(plan), head, (k) => T.types[k as RoomType] || k)], { type: 'text/csv' }), base() + '-quantities.csv');
  });
  $('sd-render').addEventListener('click', aiRender);

  // 3D listing tours: the plan goes to the n8n workflow "Oxira Design — Listing tours" (draft → paid → live)
  const lForm = $<HTMLFormElement>('sd-listing-form');
  const lMsg = $('sd-listing-msg');
  const lSay = (txt: string, ok = false) => { lMsg.hidden = !txt; lMsg.textContent = txt; lMsg.classList.toggle('is-ok', ok); };
  document.addEventListener('click', (ev) => {
    if (!(ev.target as HTMLElement).closest('[data-sd-listing]') || !plan) return;
    lSay(plan.rooms.length ? '' : T.listing.plan);
    $('sd-listing-done').hidden = true;
    $('sd-listing-send').hidden = false;
    $<HTMLButtonElement>('sd-listing-send').disabled = !plan.rooms.length;
    $<HTMLDialogElement>('sd-listing-dlg').showModal();
  });
  lForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!plan || !plan.rooms.length) return;
    const f = new FormData(lForm);
    const val = (k: string) => String(f.get(k) || '').trim();
    if (!val('title') || val('phone').replace(/\D/g, '').length < 7) { lSay(T.listing.invalid); return; }
    const send = $<HTMLButtonElement>('sd-listing-send');
    send.disabled = true; send.textContent = T.listing.sending;
    try {
      const res = await fetch(cfg.listing, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: val('title'), city: val('city'), district: val('district'), price: val('price'), phone: val('phone'), email: val('email'), lang: cfg.lang, style, plan: planToJson(plan) }),
      });
      const r = await res.json() as { success?: boolean; id?: string; payUrl?: string | null; reason?: string };
      if (r.success && r.id) {
        const url = `${location.origin}${cfg.tour}?id=${r.id}`;
        $<HTMLAnchorElement>('sd-listing-preview').href = url;
        const pay = $<HTMLAnchorElement>('sd-listing-pay');
        if (r.payUrl) { pay.href = r.payUrl; pay.textContent = T.listing.pay; lSay(T.listing.done, true); }
        else {
          pay.href = `${cfg.whatsapp}?text=${encodeURIComponent(`${T.listing.title}: ${url}`)}`;
          pay.target = '_blank';
          pay.textContent = T.listing.whatsapp;
          lSay(`${T.listing.done} ${T.listing.payDown}`, true);
        }
        $('sd-listing-done').hidden = false;
        send.hidden = true;
      } else lSay(r.reason === 'limit' ? T.listing.limit : r.reason === 'plan' ? T.listing.plan : r.reason === 'invalid' ? T.listing.invalid : T.listing.fail);
    } catch {
      lSay(T.listing.fail);
    }
    send.disabled = false; send.textContent = T.listing.send;
  });

  // finishing quotes: the plan quantities + contact go to the n8n workflow "Oxira Design — Finishing quotes"
  const qForm = $<HTMLFormElement>('sd-quote-form');
  const qMsg = $('sd-quote-msg');
  const qSay = (txt: string, ok = false) => { qMsg.hidden = !txt; qMsg.textContent = txt; qMsg.classList.toggle('is-ok', ok); };
  document.addEventListener('click', (ev) => {
    if (!(ev.target as HTMLElement).closest('[data-sd-quote]') || !plan) return;
    const b = computeBoq(plan);
    $('sd-quote-sum').innerHTML = [
      [T.rooms.total, b.total.area, T.boq.m2], [T.boq.floor, b.total.floor, T.boq.m2], [T.boq.paint, b.total.paint, T.boq.m2],
      [T.boq.wetWalls, b.total.tiles, T.boq.m2], [T.boq.ceiling, b.total.ceiling, T.boq.m2], [T.boq.skirting, b.total.skirting, T.boq.m],
    ].map(([k, v, u]) => `<span>${k}: <b>${fmt(v as number, 0)} ${u}</b></span>`).join('');
    qSay(plan.rooms.length ? '' : T.quote.noRooms);
    $<HTMLButtonElement>('sd-quote-send').disabled = !plan.rooms.length;
    $('sd-quote-send').hidden = false;
    $<HTMLDialogElement>('sd-quote-dlg').showModal();
  });
  qForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!plan || !plan.rooms.length) return;
    const f = new FormData(qForm);
    const val = (k: string) => String(f.get(k) || '').trim();
    if (!val('name') || val('phone').replace(/\D/g, '').length < 7) { qSay(T.quote.invalid); return; }
    const b = computeBoq(plan);
    const send = $<HTMLButtonElement>('sd-quote-send');
    send.disabled = true; send.textContent = T.quote.sending;
    try {
      const res = await fetch(cfg.finishing, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: val('name'), phone: val('phone'), email: val('email'), city: val('city'), level: val('level'), notes: val('notes'), lang: cfg.lang,
          file: fileName, area: b.total.area,
          boq: { floor: b.total.floor, paint: b.total.paint, tiles: b.total.tiles, ceiling: b.total.ceiling, skirting: b.total.skirting },
          rooms: plan.rooms.map((r) => ({ name: r.name, type: r.type, area: r.area })),
        }),
      });
      const r = await res.json() as { success?: boolean; id?: number | string; reason?: string };
      if (r.success) { qSay(T.quote.ok(String(r.id ?? '')), true); qForm.reset(); send.hidden = true; }
      else qSay(r.reason === 'limit' ? T.quote.limit : r.reason === 'invalid' ? T.quote.invalid : T.quote.fail);
    } catch {
      qSay(T.quote.fail);
    }
    send.disabled = false; send.textContent = T.quote.send;
  });

  // walk pad (hold to move)
  let turnTimer = 0;
  root.querySelectorAll<HTMLButtonElement>('[data-move]').forEach((b) => {
    const m = b.dataset.move!;
    const startMove = (e: Event) => {
      e.preventDefault();
      if (!viewer) return;
      if (m === 'f') viewer.setMove(1, 0);
      if (m === 'b') viewer.setMove(-1, 0);
      if (m === 'l') viewer.setMove(0, -1);
      if (m === 'r') viewer.setMove(0, 1);
      if (m === 'tl' || m === 'tr') { clearInterval(turnTimer); turnTimer = window.setInterval(() => viewer!.turn(m === 'tl' ? -0.04 : 0.04), 16); }
    };
    const stop = () => { viewer?.setMove(0, 0); clearInterval(turnTimer); };
    b.addEventListener('pointerdown', startMove);
    b.addEventListener('pointerup', stop);
    b.addEventListener('pointerleave', stop);
    b.addEventListener('pointercancel', stop);
  });

  // test / automation hook
  (window as any).__oxStudio = { viewer: () => viewer, plan: () => plan, setView, setStyle: (id: StyleId) => (root.querySelector(`[data-style="${id}"]`) as HTMLElement)?.click() };

  // ?sample=apartment|studio opens a sample directly
  const q = new URLSearchParams(location.search).get('sample');
  if (q && cfg.samples[q]) (root.querySelector(`[data-sample="${q}"]`) as HTMLElement)?.click();
}
