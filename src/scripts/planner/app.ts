// Plan designer page: brief form → concept plan → editing → request to the team.
import { generate, fromRooms, defaultBrief, totals, dividers, moveDivider, splitRoom, mergeRoom, swapRooms, leaves, geometry, type Brief, type Project, type Floor, type Kind, type Divider } from './model.ts';
import { floorSvg, toDxf } from './render.ts';
import { pl, PLAN_TYPES } from '../../i18n/planner';
import type { Lang } from '../../i18n/content';
import { isPdf, pdfToImage } from '../pdfImage';
import { rg } from '../../i18n/region';
import { acc as accCall, getToken, sharedPlan } from '../../lib/account';
import { acc as accCopy } from '../../i18n/account';
import { detectRegion, regionById, regionName, saveRegion, lenIn, lenOut, areaIn, type Region, type Units, type Programme } from '../../lib/region';

/** Rooms people expect by default, per region (the visitor can tick anything on or off). */
const PROGRAMME: Record<Programme, { villa: Partial<Brief['villa']>; bld: Partial<Brief['bld']> }> = {
  gulf: { villa: { majlis: true, ladies: true, dining: true, maid: true, driver: false, laundry: true, store: true, office: false, garage: false, kitchen: 'closed', ensuiteAll: true, prayer: false, guestBed: false }, bld: { majlis: true, maid: false } },
  egypt: { villa: { majlis: false, ladies: false, dining: true, maid: false, driver: false, laundry: false, store: true, office: false, garage: false, kitchen: 'closed', ensuiteAll: false, baths: 1, prayer: false, guestBed: false }, bld: { majlis: false, maid: false } },
  levant: { villa: { majlis: false, ladies: false, dining: true, maid: false, driver: false, laundry: true, store: true, office: false, garage: false, kitchen: 'closed', ensuiteAll: false, baths: 1, prayer: false, guestBed: false }, bld: { majlis: false, maid: false } },
  western: { villa: { majlis: false, ladies: false, dining: true, maid: false, driver: false, laundry: true, store: false, office: true, garage: true, kitchen: 'open', ensuiteAll: false, baths: 1, prayer: false, guestBed: false }, bld: { majlis: false, maid: false } },
  asia: { villa: { majlis: false, ladies: false, dining: true, maid: true, driver: false, laundry: true, store: true, office: false, garage: false, kitchen: 'closed', ensuiteAll: true, prayer: false, guestBed: false }, bld: { majlis: false, maid: false } },
};
const LEN = ['land.w', 'land.d', 'land.streetW', 'setback.front', 'setback.back', 'setback.side'];

type Cfg = { lang: Lang; ai: string; order: string; studio: string; whatsapp: string; account: string };
type Cloud = { pid: string; share: string; title: string };
type Extras = { planTypes: string[]; formats: string[]; facade: string };
type Saved = { v: 1; brief: Brief; extras: Extras; floors: Floor[]; seq: number; edited: boolean; path: 'new' | 'upload'; variant?: number; imported?: boolean; cloud?: Cloud | null };

const KEY = 'ox-plan-v1';
const MAX = 15 * 1048576;

export function startPlanner(root: HTMLElement) {
  const cfg: Cfg = JSON.parse(root.dataset.cfg!);
  const T = pl[cfg.lang];
  const AR = pl.ar;
  const rtl = cfg.lang === 'ar';
  const $ = <E extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as E;
  const nf = (d: number) => new Intl.NumberFormat(cfg.lang === 'ar' ? 'ar-SA-u-nu-latn' : cfg.lang, { minimumFractionDigits: d, maximumFractionDigits: d });
  const fmt = (n: number, d = 1) => nf(d).format(n);
  const names = (k: Kind) => T.kinds[k];
  const form = $<HTMLFormElement>('pl-brief');
  const canvas = $('pl-canvas');

  let project: Project | null = null;
  let floorIdx = 0;
  let selected: string | null = null;
  let swapFrom: string | null = null;
  let edited = false;
  let path: 'new' | 'upload' = 'new';
  const undo: string[] = [];
  let sbTouched = false;
  let variant = 0;
  let imported = false; // the plan came from a drawing (not from the generator)
  let cloud: Cloud | null = null; // saved in the visitor's account
  let region: Region = detectRegion(cfg.lang);
  let units: Units = 'm'; // the form is rendered in metres; applyRegion / restore switch it
  const u2 = () => (units === 'ft' ? 'ft²' : T.m2);
  const uL = () => (units === 'ft' ? 'ft' : T.land.m);
  /** lengths and areas in the visitor's units */
  const L = (m: number, d = 1) => `${fmt(lenIn(m, units), d)} ${uL()}`;
  const A = (m2: number, d = 1) => `${fmt(areaIn(m2, units), d)} ${u2()}`;
  const DM = (w: number, h: number) => `${fmt(lenIn(w, units), units === 'ft' ? 1 : 2)} × ${fmt(lenIn(h, units), units === 'ft' ? 1 : 2)}`;

  // ------------------------------------------------------------ brief form
  const val = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | RadioNodeList | null;
  const numOf = (name: string, def: number) => {
    const e = val(name) as HTMLInputElement | null;
    const v = parseFloat(e?.value || '');
    if (!isFinite(v)) return def;
    return LEN.includes(name) ? lenOut(v, units) : v;
  };
  const boolOf = (name: string) => !!(val(name) as HTMLInputElement | null)?.checked;
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  function readBrief(): Brief {
    const d = defaultBrief();
    const type = (form.querySelector<HTMLInputElement>('input[name=type]:checked')?.value || 'villa') as Brief['type'];
    const b: Brief = {
      type,
      region: region.id,
      units,
      land: { w: clamp(numOf('land.w', d.land.w), 6, 300), d: clamp(numOf('land.d', d.land.d), 6, 300), streets: numOf('land.streets', 1), streetW: clamp(numOf('land.streetW', 15), 4, 100) },
      setback: { front: clamp(numOf('setback.front', 2), 0, 20), back: clamp(numOf('setback.back', 2), 0, 20), side: clamp(numOf('setback.side', 2), 0, 20) },
      villa: {
        floors: clamp(Math.round(numOf('villa.floors', 2)), 1, 4), roof: boolOf('villa.roof'), bedrooms: clamp(Math.round(numOf('villa.bedrooms', 4)), 0, 10),
        masters: clamp(Math.round(numOf('villa.masters', 1)), 0, 4), ensuiteAll: boolOf('villa.ensuiteAll'), baths: clamp(Math.round(numOf('villa.baths', 1)), 0, 4),
        majlis: boolOf('villa.majlis'), ladies: boolOf('villa.ladies'), dining: boolOf('villa.dining'), kitchen: ((val('villa.kitchen') as HTMLSelectElement)?.value as 'open' | 'closed') || 'closed',
        maid: boolOf('villa.maid'), driver: boolOf('villa.driver'), laundry: boolOf('villa.laundry'), store: boolOf('villa.store'), office: boolOf('villa.office'),
        guestBed: boolOf('villa.guestBed'), prayer: boolOf('villa.prayer'), lift: boolOf('villa.lift'), garage: boolOf('villa.garage'),
      },
      bld: {
        floors: clamp(Math.round(numOf('bld.floors', 3)), 1, 20), perFloor: clamp(Math.round(numOf('bld.perFloor', 2)), 1, 4), beds: clamp(Math.round(numOf('bld.beds', 3)), 1, 5),
        majlis: boolOf('bld.majlis'), maid: boolOf('bld.maid'), ground: ((val('bld.ground') as HTMLSelectElement)?.value as Brief['bld']['ground']) || 'parking', roof: boolOf('bld.roof'), lift: boolOf('bld.lift'),
      },
    };
    if (b.villa.masters > b.villa.bedrooms) b.villa.masters = b.villa.bedrooms;
    return b;
  }
  const checked = (name: string, scope: ParentNode = root) => [...scope.querySelectorAll<HTMLInputElement>(`input[name=${name}]:checked`)].map((i) => i.value);
  const readExtras = (): Extras => ({ planTypes: checked('planTypes'), formats: checked('formats'), facade: (val('facade') as HTMLSelectElement)?.value || 'none' });

  function writeBrief(b: Brief, x: Extras) {
    const set = (name: string, v: number | string | boolean) => {
      const e = val(name) as HTMLInputElement | HTMLSelectElement | null;
      if (!e || e instanceof RadioNodeList) return;
      if (e instanceof HTMLInputElement && e.type === 'checkbox') e.checked = !!v;
      else e.value = typeof v === 'number' && LEN.includes(name) ? String(Math.round(lenIn(v, units) * 10) / 10) : String(v);
    };
    const r = form.querySelector<HTMLInputElement>(`input[name=type][value=${b.type}]`);
    if (r) r.checked = true;
    set('land.w', b.land.w); set('land.d', b.land.d); set('land.streets', b.land.streets); set('land.streetW', b.land.streetW);
    set('setback.front', b.setback.front); set('setback.back', b.setback.back); set('setback.side', b.setback.side);
    for (const [k, v] of Object.entries(b.villa)) set(`villa.${k}`, v as never);
    for (const [k, v] of Object.entries(b.bld)) set(`bld.${k}`, v as never);
    root.querySelectorAll<HTMLInputElement>('input[name=planTypes]').forEach((i) => { i.checked = x.planTypes.includes(i.value); });
    root.querySelectorAll<HTMLInputElement>('input[name=formats]').forEach((i) => { i.checked = x.formats.includes(i.value); });
    set('facade', x.facade);
  }

  /** Units: relabel and convert the length inputs. */
  function setUnits(next: Units) {
    if (next === units) return;
    const vals = LEN.map((n) => numOf(n, 0)); // metres, read with the old units
    units = next;
    LEN.forEach((n, i) => { const e = val(n) as HTMLInputElement | null; if (e) e.value = String(Math.round(lenIn(vals[i], units) * 10) / 10); });
    const k = units === 'ft' ? lenIn(1, 'ft') : 1;
    LEN.forEach((n) => {
      const e = val(n) as HTMLInputElement | null;
      if (!e) return;
      if (!e.dataset.min) { e.dataset.min = e.min; e.dataset.max = e.max; e.dataset.step = e.step; }
      e.min = String(Math.round(Number(e.dataset.min) * k)); e.max = String(Math.round(Number(e.dataset.max) * k));
      e.step = units === 'ft' ? '1' : e.dataset.step || '0.5';
    });
    root.querySelectorAll<HTMLElement>('.pl-u').forEach((i) => { i.textContent = uL(); });
    $('pl-area-u').textContent = u2();
    const r = form.querySelector<HTMLInputElement>(`input[name=units][value=${units}]`);
    if (r) r.checked = true;
  }

  /** Country preset: units, setbacks and the rooms people there usually ask for. */
  function applyRegion(r: Region, programme = true) {
    region = r;
    setUnits(r.units);
    const b = readBrief();
    const bld = b.type === 'building' || b.type === 'mixed';
    const sb = (bld && r.bldSetback) || r.setback;
    b.land.streetW = r.streetW;
    b.setback = { front: sb.front(r.streetW), side: sb.side, back: sb.back };
    if (programme) { Object.assign(b.villa, PROGRAMME[r.programme].villa); Object.assign(b.bld, PROGRAMME[r.programme].bld); }
    writeBrief(b, readExtras());
    sbTouched = false;
    syncForm();
  }

  function syncForm() {
    const b = readBrief();
    $('pl-area').textContent = fmt(areaIn(b.land.w * b.land.d, units), 0);
    const r1 = (m: number) => Math.round(lenIn(m, units) * 10) / 10;
    $('pl-sb-sum').textContent = `${r1(b.setback.front)} · ${r1(b.setback.side)} · ${r1(b.setback.back)} ${uL()}`;
    root.querySelectorAll<HTMLElement>('.pl-sub').forEach((s) => { s.hidden = !(s.dataset.for || '').split(' ').includes(b.type); });
    root.querySelectorAll<HTMLElement>('[data-hide-ist]').forEach((e) => { e.hidden = b.type === 'istiraha'; });
    root.querySelectorAll<HTMLElement>('[data-hide-mixed]').forEach((e) => { e.hidden = b.type === 'mixed'; });
  }

  form.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-step]');
    if (!btn) return;
    const input = btn.parentElement!.querySelector('input')!;
    const v = (parseFloat(input.value) || 0) + Number(btn.dataset.step);
    input.value = String(clamp(v, Number(input.min || 0), Number(input.max || 99)));
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  form.addEventListener('input', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name === 'units') { setUnits(t.value as Units); syncForm(); render(); save(); return; }
    if (t.name?.startsWith('setback.')) sbTouched = true;
    if (t.name === 'land.streetW' && !sbTouched) {
      const bld = ['building', 'mixed'].includes(readBrief().type);
      const f = ((bld && region.bldSetback) || region.setback).front(numOf('land.streetW', 15));
      (val('setback.front') as HTMLInputElement).value = String(Math.round(lenIn(f, units) * 10) / 10);
    }
    if (t.name === 'type' && !sbTouched) {
      const bld = ['building', 'mixed'].includes(t.value);
      const sb = (bld && region.bldSetback) || region.setback;
      const set = (n: string, m: number) => { (val(n) as HTMLInputElement).value = String(Math.round(lenIn(m, units) * 10) / 10); };
      set('setback.front', sb.front(numOf('land.streetW', 15))); set('setback.side', sb.side); set('setback.back', sb.back);
    }
    syncForm();
    if (['planTypes', 'formats', 'facade'].includes(t.name)) { save(); return; }
    if (!edited) scheduleGen();
    else $('pl-regen').hidden = false;
  });
  form.addEventListener('change', (e) => { const t = e.target as HTMLInputElement; if (t.tagName === 'SELECT' || t.type === 'radio') form.dispatchEvent(new Event('input')); });

  let genTimer = 0;
  const scheduleGen = () => { clearTimeout(genTimer); genTimer = window.setTimeout(() => regenerate(false), 250); };

  function regenerate(scroll = true) {
    imported = false;
    project = generate(readBrief(), variant);
    floorIdx = Math.min(floorIdx, Math.max(0, project.floors.length - 1));
    selected = null; swapFrom = null; edited = false; undo.length = 0;
    $('pl-regen').hidden = true;
    render();
    save();
    if (scroll && window.innerWidth < 960) $('pl-canvas').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  $('pl-gen').addEventListener('click', () => {
    if (edited && !confirm(T.regenAsk)) return;
    regenerate(true);
  });
  $('pl-regen').addEventListener('click', () => { if (confirm(T.regenAsk)) regenerate(false); });

  // ------------------------------------------------------------ rendering
  let view = { x0: 0, y1: 0 };
  const floorLabel = (f: Floor, t = T) => f.key === 'ground' ? t.editor.floor.ground : f.key === 'roof' ? t.editor.floor.roof : f.key === 'typical' ? t.editor.floor.typical.replace('{n}', String(f.repeat)) : t.editor.floor.upper.replace('{n}', String(f.level));

  function render() {
    if (!project) return;
    const tabs = $('pl-tabs');
    tabs.innerHTML = '';
    project.floors.forEach((f, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.role = 'tab';
      b.textContent = floorLabel(f);
      b.setAttribute('aria-selected', String(i === floorIdx));
      b.addEventListener('click', () => { floorIdx = i; selected = null; swapFrom = null; render(); });
      tabs.appendChild(b);
    });
    const warn = $('pl-warn');
    const ws = project.warnings.map((w) => (T.editor.warn as Record<string, string>)[w]).filter(Boolean);
    {
      const bld = project.brief.type === 'building' || project.brief.type === 'mixed';
      const max = ((bld && region.bldSetback) || region.setback).coverage;
      if (totals(project).coverage > max + 0.02) ws.push(T.editor.warn.coverage.replace('{max}', String(Math.round(max * 100))));
    }
    warn.hidden = !ws.length;
    warn.innerHTML = ws.map((w) => `<div>${w}</div>`).join('');
    const f = project.floors[floorIdx];
    if (!f) { canvas.innerHTML = `<p class="pl-empty">${T.editor.empty}</p>`; $('pl-stats').innerHTML = ''; return; }
    const out = floorSvg(project, f, { names, fmt, m2: T.m2, len: L, area: (a) => A(a), dims: DM, street: T.street, rtl, edit: true, selected, swapFrom });
    view = out.view;
    canvas.innerHTML = out.svg;
    // stats
    const tt = totals(project);
    const cur = tt.per[floorIdx];
    const stat = (k: string, v: string) => `<div><dt>${k}</dt><dd dir="ltr">${v}</dd></div>`;
    $('pl-stats').innerHTML =
      stat(T.editor.stats.land, A(tt.landArea, 0)) +
      stat(T.editor.stats.built, A(tt.built, 0)) +
      stat(T.editor.stats.coverage, `${fmt(tt.coverage * 100, 0)}%`) +
      stat(T.editor.stats.floorArea, A(cur.gross, 0)) +
      stat(T.editor.stats.rooms, String(out.geo.rooms.filter((r) => !['stair', 'lift', 'terrace', 'void'].includes(r.leaf.kind)).length));
    $<HTMLButtonElement>('pl-undo').disabled = !undo.length;
    renderRoomPanel();
    renderVariants();
  }

  /** Small previews of the alternative layouts for the current settings. */
  let varKey = '';
  function renderVariants() {
    const box = $('pl-variants');
    if (!project || imported) { box.hidden = true; return; }
    const brief = project.brief;
    const key = JSON.stringify(brief) + '|' + variant + '|' + units;
    if (key === varKey) return;
    varKey = key;
    const row = $('pl-var-row');
    row.innerHTML = '';
    const seen = new Set<string>();
    let n = 0;
    for (const v of [0, 1, 2, 3]) {
      const q = generate(brief, v);
      const sig = JSON.stringify(q.floors.map((f) => f.root)).replace(/"id":"[^"]+"/g, '').replace(/"parent":"[^"]+"/g, '');
      if (!q.floors.length || seen.has(sig)) continue;
      seen.add(sig);
      n++;
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-pressed', String(v === variant));
      b.innerHTML = floorSvg(q, q.floors[0], { names, fmt, m2: T.m2, street: T.street, site: false, edit: false }).svg + `<span>${T.variants.n.replace('{n}', String(n))}</span>`;
      b.querySelectorAll('text').forEach((t) => t.remove());
      b.addEventListener('click', () => {
        if (v === variant) return;
        if (edited && !confirm(T.variants.ask)) return;
        variant = v;
        regenerate(false);
      });
      row.appendChild(b);
    }
    box.hidden = n < 2;
  }
  function renderRoomPanel() {
    const panel = $('pl-room');
    const f = project?.floors[floorIdx];
    const l = f && selected ? leaves(f.root).find((x) => x.id === selected) : null;
    panel.hidden = !l;
    $('pl-swapnote').hidden = !swapFrom;
    if (!l || !f) return;
    // keep the panel away from the selected room
    const el = canvas.querySelector(`.pl-room[data-id="${l.id}"]`);
    if (el) {
      const r = el.getBoundingClientRect(), c = canvas.getBoundingClientRect();
      panel.classList.toggle('is-top', (r.top + r.bottom) / 2 > c.top + c.height * 0.55);
    }
    ($('pl-room-kind') as HTMLSelectElement).value = l.kind;
    const nameIn = $<HTMLInputElement>('pl-room-name');
    if (document.activeElement !== nameIn) nameIn.value = l.name || '';
    nameIn.placeholder = names(l.kind);
    const g = geometry(f, f.level === 0).rooms.find((r) => r.leaf.id === l.id);
    if (g) $('pl-room-size').textContent = `${DM(g.net.x1 - g.net.x0, g.net.y1 - g.net.y0)} ${uL()} · ${A(g.area)}`;
  }

  const snapshot = () => JSON.stringify(project!.floors);
  const pushUndo = () => { undo.push(snapshot()); if (undo.length > 60) undo.shift(); };
  const markEdited = () => { edited = true; save(); };

  $('pl-undo').addEventListener('click', () => {
    if (!project || !undo.length) return;
    project.floors = JSON.parse(undo.pop()!);
    selected = null; swapFrom = null;
    render(); save();
  });

  // ------------------------------------------------------------ editing on the canvas
  const toWorld = (ev: PointerEvent) => {
    const svg = canvas.querySelector('svg')!;
    const pt = svg.createSVGPoint();
    pt.x = ev.clientX; pt.y = ev.clientY;
    const q = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    return { x: q.x + view.x0, y: view.y1 - q.y };
  };
  let drag: { d: Divider; id: number; moved: boolean } | null = null;
  let raf = 0;

  canvas.addEventListener('pointerdown', (ev) => {
    const el = ev.target as Element;
    if (!project) return;
    const f = project.floors[floorIdx];
    const div = el.closest('.pl-div') as SVGElement | null;
    if (div) {
      const d = dividers(f)[Number(div.dataset.div)];
      if (!d) return;
      pushUndo();
      drag = { d, id: ev.pointerId, moved: false };
      canvas.setPointerCapture(ev.pointerId);
      div.classList.add('is-drag');
      ev.preventDefault();
      return;
    }
  });
  canvas.addEventListener('pointermove', (ev) => {
    if (!drag || ev.pointerId !== drag.id || !project) return;
    const w = toWorld(ev);
    const at = Math.round((drag.d.axis === 'x' ? w.x : w.y) * 20) / 20;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      if (!drag || !project) return;
      const f = project.floors[floorIdx];
      const cur = dividers(f).find((x) => x.split === drag!.d.split && x.i === drag!.d.i);
      if (!cur) return;
      moveDivider(f, cur, at);
      drag.moved = true;
      drag.d = cur;
      render();
      const again = dividers(f).findIndex((x) => x.split === cur.split && x.i === cur.i);
      canvas.querySelector(`.pl-div[data-div="${again}"]`)?.classList.add('is-drag');
    });
  });
  const endDrag = () => {
    if (!drag) return;
    if (drag.moved) markEdited(); else undo.pop();
    drag = null;
    render();
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('click', (ev) => {
    const room = (ev.target as Element).closest('.pl-room') as SVGElement | null;
    if (!room || !project) return;
    const id = room.dataset.id!;
    const f = project.floors[floorIdx];
    if (swapFrom && swapFrom !== id) {
      pushUndo();
      swapRooms(f, swapFrom, id);
      selected = id; swapFrom = null;
      markEdited(); render();
      return;
    }
    selected = selected === id ? null : id;
    swapFrom = null;
    render();
    if (selected && window.innerWidth < 960) $('pl-room').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  $('pl-room-x').addEventListener('click', () => { selected = null; swapFrom = null; render(); });
  $('pl-room-kind').addEventListener('change', () => {
    const f = project?.floors[floorIdx];
    const l = f && leaves(f.root).find((x) => x.id === selected);
    if (!l) return;
    pushUndo();
    l.kind = ($('pl-room-kind') as HTMLSelectElement).value as Kind;
    markEdited(); render();
  });
  let nameUndo = false;
  $('pl-room-name').addEventListener('input', () => {
    const f = project?.floors[floorIdx];
    const l = f && leaves(f.root).find((x) => x.id === selected);
    if (!l) return;
    if (!nameUndo) { pushUndo(); nameUndo = true; }
    const v = $<HTMLInputElement>('pl-room-name').value.trim();
    if (v) l.name = v; else delete l.name;
    markEdited(); render();
  });
  $('pl-room-name').addEventListener('blur', () => { nameUndo = false; });
  $('pl-split').addEventListener('click', () => {
    if (!project || !selected) return;
    const f = project.floors[floorIdx];
    pushUndo();
    const id = splitRoom(project, f, selected);
    if (!id) { undo.pop(); return; }
    selected = id;
    markEdited(); render();
  });
  $('pl-merge').addEventListener('click', () => {
    if (!project || !selected) return;
    const f = project.floors[floorIdx];
    if (leaves(f.root).length < 2) return;
    pushUndo();
    if (!mergeRoom(f, selected)) { undo.pop(); return; }
    selected = null;
    markEdited(); render();
  });
  $('pl-swap').addEventListener('click', () => { swapFrom = selected; render(); });
  $('pl-swap-x').addEventListener('click', () => { swapFrom = null; render(); });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !(e.target as HTMLElement).closest('input, textarea')) { e.preventDefault(); $('pl-undo').click(); }
    if (e.key === 'Escape' && (selected || swapFrom)) { selected = null; swapFrom = null; render(); }
  });

  // ------------------------------------------------------------ exports
  const download = (name: string, text: string, type: string) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  };
  const fullDxf = () => project ? toDxf(project, project.floors, { names, m2: T.m2, site: true, areas: true, title: (f) => floorLabel(f) }) : '';
  $('pl-dxf').addEventListener('click', () => { if (project?.floors.length) download('oxira-plan.dxf', fullDxf(), 'application/dxf'); });
  $('pl-3d').addEventListener('click', () => {
    if (!project) return;
    const f = project.floors[floorIdx];
    if (!f) return;
    const txt = toDxf(project, [f], { names, m2: T.m2 });
    try { sessionStorage.setItem('ox-plan-dxf', txt); sessionStorage.setItem('ox-plan-name', `oxira-plan-${f.key}${f.level}.dxf`); } catch {}
    location.href = `${cfg.studio}?from=plan`;
  });
  $('pl-print').addEventListener('click', () => {
    if (!project) return;
    const box = $('pl-printout');
    // print mode hides everything but direct children of <body> marked for print
    if (box.parentElement !== document.body) document.body.appendChild(box);
    const b = project.brief;
    const tt = totals(project);
    const rows = briefRows(T).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('');
    box.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    box.innerHTML = `<section><h1>Oxira Design — ${esc(T.type.names[b.type])}</h1><table>${rows}<tr><th>${esc(T.editor.stats.built)}</th><td dir="ltr">${A(tt.built, 0)}</td></tr></table><p>${esc(T.editor.note)}</p></section>` +
      project.floors.map((f) => `<section><h2>${esc(floorLabel(f))}</h2>${floorSvg(project!, f, { names, fmt, m2: T.m2, len: L, area: (a) => A(a), dims: DM, street: T.street, rtl, edit: false }).svg}</section>`).join('');
    window.print();
  });
  const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // ------------------------------------------------------------ brief summary (for print and the team)
  const r1m = (m: number) => Math.round(m * 100) / 100;
  function briefRows(t: typeof T): [string, string][] {
    if (!project) return [];
    const b = project.brief;
    const x = readExtras();
    const yes = (on: boolean, label: string) => (on ? label : '');
    const prog = b.type === 'building' || b.type === 'mixed'
      ? [`${b.bld.floors} × ${t.bld.floors}`, `${b.bld.perFloor} ${t.bld.perFloor}`, `${b.bld.beds} ${t.bld.beds}`, `${t.bld.ground}: ${b.type === 'mixed' ? t.bld.gShops : b.bld.ground === 'parking' ? t.bld.gParking : b.bld.ground === 'shops' ? t.bld.gShops : t.bld.gApts}`, yes(b.bld.majlis, t.bld.majlis), yes(b.bld.maid, t.bld.maid), yes(b.bld.roof, t.bld.roof), yes(b.bld.lift, t.bld.lift)]
      : [b.type === 'istiraha' ? '' : `${b.villa.floors} ${t.villa.floors}`, `${b.villa.bedrooms} ${t.villa.bedrooms}`, b.type === 'istiraha' ? '' : `${b.villa.masters} ${t.villa.masters}`, yes(b.villa.ensuiteAll && b.type !== 'istiraha', t.villa.ensuiteAll), b.villa.baths && b.type !== 'istiraha' ? `${b.villa.baths} ${t.villa.baths}` : '',
        yes(b.villa.majlis || b.type === 'istiraha', t.villa.majlis), yes(b.villa.ladies, t.villa.ladies), yes(b.villa.dining, t.villa.dining), yes(!!b.villa.garage && b.type !== 'istiraha', t.villa.garage), `${t.villa.kitchen}: ${b.villa.kitchen === 'open' ? t.villa.open : t.villa.closed}`,
        yes(b.villa.maid && b.type !== 'istiraha', t.villa.maid), yes(b.villa.driver, t.villa.driver), yes(b.villa.laundry && b.type !== 'istiraha', t.villa.laundry), yes(b.villa.store, t.villa.store), yes(b.villa.office && b.type !== 'istiraha', t.villa.office),
        yes(b.villa.guestBed && b.type !== 'istiraha', t.villa.guestBed), yes(b.villa.prayer && b.type !== 'istiraha', t.villa.prayer), yes(b.villa.roof && b.type !== 'istiraha', t.villa.roof), yes(b.villa.lift && b.type !== 'istiraha', t.villa.lift)];
    return [
      [rg[t === AR ? 'ar' : cfg.lang].country, `${regionName(region.id, t === AR ? 'ar' : cfg.lang)}${t === AR && units === 'ft' ? ' (يفضّل العميل القدم)' : ''}`],
      [t.brief.land, t === AR
        ? `${r1m(b.land.w)} × ${r1m(b.land.d)} m = ${Math.round(b.land.w * b.land.d)} m² · ${t.land.streets}: ${b.land.streets} · ${t.land.streetW}: ${r1m(b.land.streetW)} m · ${t.land.setbacks}: ${t.land.front} ${r1m(b.setback.front)} / ${t.land.side} ${r1m(b.setback.side)} / ${t.land.back} ${r1m(b.setback.back)}`
        : `${L(b.land.w)} × ${L(b.land.d)} = ${A(b.land.w * b.land.d, 0)} · ${t.land.streets}: ${b.land.streets} · ${t.land.streetW}: ${L(b.land.streetW)} · ${t.land.setbacks}: ${t.land.front} ${L(b.setback.front)} / ${t.land.side} ${L(b.setback.side)} / ${t.land.back} ${L(b.setback.back)}`],
      [t.brief.type, t.type.names[b.type]],
      [t.brief.program, prog.filter(Boolean).join(cfgSep(t))],
      [t.brief.planTypes, x.planTypes.map((k) => t.planTypes.names[k as (typeof PLAN_TYPES)[number]]).join(cfgSep(t))],
      [t.brief.facade, t.planTypes.facades[x.facade as keyof typeof t.planTypes.facades] || '-'],
      [t.brief.formats, x.formats.map((k) => t.planTypes.formatNames[k as keyof typeof t.planTypes.formatNames]).join(cfgSep(t))],
    ];
  }
  const cfgSep = (t: typeof T) => (t === AR ? '، ' : ', ');

  // ------------------------------------------------------------ storage
  function save() {
    if (!project) return;
    try { localStorage.setItem(KEY, JSON.stringify(snap())); } catch {}
  }
  const snap = (): Saved => ({ v: 1, brief: project!.brief, extras: readExtras(), floors: project!.floors, seq: project!.seq, edited, path, variant, imported, cloud });
  function restore(): boolean {
    let s: Saved | null = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { s = null; }
    return applySaved(s);
  }
  function applySaved(s: Saved | null): boolean {
    if (!s || s.v !== 1 || !s.brief) return false;
    cloud = s.cloud || null;
    showCloud();
    region = regionById(s.brief.region) || region;
    setUnits(s.brief.units || region.units);
    document.querySelectorAll<HTMLSelectElement>('[data-region-select]').forEach((x) => { x.value = region.id; });
    writeBrief(s.brief, s.extras || { planTypes: ['arch'], formats: ['pdf'], facade: 'none' });
    syncForm();
    variant = s.variant || 0;
    imported = !!s.imported;
    project = generate(s.brief, variant);
    if ((s.edited || s.imported) && Array.isArray(s.floors) && s.floors.length) { project.floors = s.floors; project.seq = s.seq || project.seq; }
    edited = !!s.edited;
    $('pl-regen').hidden = !edited;
    setPath(s.path === 'upload' ? 'upload' : 'new', false);
    render();
    return true;
  }

  // ------------------------------------------------------------ path: new / upload
  function setPath(p: 'new' | 'upload', store = true) {
    path = p;
    root.dataset.path = p;
    root.querySelectorAll<HTMLElement>('[data-go]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.go === p)));
    if (store) save();
  }
  root.querySelectorAll<HTMLElement>('[data-go]').forEach((b) => b.addEventListener('click', () => setPath(b.dataset.go as 'new' | 'upload')));

  // uploaded plan files (and extra attachments)
  type Picked = { file: File; thumb?: string };
  const lists: Record<'plan' | 'extra', Picked[]> = { plan: [], extra: [] };
  function renderFiles(which: 'plan' | 'extra') {
    const ul = $(which === 'plan' ? 'pl-file-list' : 'pl-extra-list');
    ul.innerHTML = '';
    lists[which].forEach((p, i) => {
      const li = document.createElement('li');
      li.innerHTML = `${p.thumb ? `<img alt="" src="${p.thumb}">` : ''}<span class="pl-fn"></span><small>${(p.file.size / 1048576).toFixed(1)} MB</small><button type="button" aria-label="×">×</button>`;
      li.querySelector('.pl-fn')!.textContent = p.file.name;
      li.querySelector('button')!.addEventListener('click', () => { lists[which].splice(i, 1); renderFiles(which); });
      ul.appendChild(li);
    });
    if (which === 'plan') $('pl-dxf-hint').hidden = !lists.plan.some((p) => /\.dxf$/i.test(p.file.name));
  }
  async function addFiles(which: 'plan' | 'extra', files: FileList | File[] | null | undefined) {
    for (const f of Array.from(files || [])) {
      if (lists[which].some((p) => p.file.name === f.name && p.file.size === f.size)) continue;
      const p: Picked = { file: f };
      lists[which].push(p);
      renderFiles(which);
      try {
        if (isPdf(f)) p.thumb = await pdfToImage(f, 240);
        else if (/^image\/(png|jpe?g|webp)$/.test(f.type)) p.thumb = URL.createObjectURL(f);
      } catch { /* no preview */ }
      renderFiles(which);
    }
  }
  const wireDrop = (inputId: string, which: 'plan' | 'extra') => {
    const input = $<HTMLInputElement>(inputId);
    const drop = input.closest('label')!;
    input.addEventListener('change', () => { addFiles(which, input.files); input.value = ''; });
    ['dragenter', 'dragover'].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add('is-over'); }));
    ['dragleave', 'drop'].forEach((t) => drop.addEventListener(t, () => drop.classList.remove('is-over')));
    drop.addEventListener('drop', (e) => { e.preventDefault(); addFiles(which, (e as DragEvent).dataTransfer?.files); });
  };
  wireDrop('pl-files', 'plan');
  wireDrop('pl-extra', 'extra');
  $('pl-dxf-open').addEventListener('click', async (e) => {
    e.preventDefault();
    const f = lists.plan.find((p) => /\.dxf$/i.test(p.file.name));
    if (!f) return;
    try { sessionStorage.setItem('ox-plan-dxf', await f.file.text()); sessionStorage.setItem('ox-plan-name', f.file.name); } catch {}
    location.href = `${cfg.studio}?from=plan`;
  });

  // ------------------------------------------------------------ request
  const order = $<HTMLFormElement>('pl-form');
  const msg = $('pl-msg');
  const say = (html: string, ok = true) => { msg.hidden = false; msg.className = 'pl-msg ' + (ok ? 'is-ok' : 'is-err'); msg.innerHTML = html; };

  function teamBrief(): { notes: string; summary: object; area: number; style: string } {
    if (path === 'upload') {
      const types = checked('upTypes');
      const fmts = checked('upFormats');
      const st = root.querySelector<HTMLInputElement>('input[name=state]:checked')?.value || '';
      const btype = ($('pl-up-btype') as HTMLSelectElement).value as Brief['type'];
      const facade = ($('pl-up-facade') as HTMLSelectElement).value;
      const area = parseFloat(($('pl-up-area') as HTMLInputElement).value) || 0;
      const lines = [
        `${AR.brief.path}: ${AR.brief.complete}`,
        `${AR.brief.state}: ${AR.upload.states[st as keyof typeof AR.upload.states] || '-'}`,
        `${AR.brief.type}: ${AR.type.names[btype]}${area ? ` · ${AR.land.area}: ${area} م²` : ''}`,
        `${AR.brief.planTypes}: ${types.map((k) => AR.planTypes.names[k as (typeof PLAN_TYPES)[number]]).join('، ') || '-'}`,
        `${AR.brief.facade}: ${AR.planTypes.facades[facade as keyof typeof AR.planTypes.facades] || '-'}`,
        `${AR.brief.formats}: ${fmts.map((k) => AR.planTypes.formatNames[k as keyof typeof AR.planTypes.formatNames]).join('، ') || '-'}`,
      ];
      return { notes: lines.join('\n'), summary: { kind: 'plan', path: 'complete', state: st, type: btype, area, planTypes: types, formats: fmts, facade }, area, style: facade };
    }
    const p = project!;
    const tt = totals(p);
    const x = readExtras();
    const rows = briefRows(AR as typeof T);
    const floorsTxt = p.floors.map((f, i) => `${floorLabel(f, AR as typeof T)}: ${fmtAr(tt.per[i].gross)} م²`).join('، ');
    const lines = [`${AR.brief.path}: ${AR.brief.newPlan}${edited ? ' (عدّل العميل المخطط)' : ''}`, ...rows.map(([k, v]) => `${k}: ${v}`), `${AR.brief.floors}: ${floorsTxt}`, `${AR.editor.stats.built}: ${fmtAr(tt.built)} م² · ${AR.editor.stats.coverage}: ${Math.round(tt.coverage * 100)}%`];
    const rooms = p.floors.flatMap((f) => geometry(f, f.level === 0).rooms.filter((r) => !['stair', 'lift', 'void'].includes(r.leaf.kind)).map((r) => ({ name: `${floorLabel(f, AR as typeof T)} - ${r.leaf.name || AR.kinds[r.leaf.kind]}`.slice(0, 40), type: r.leaf.kind, area: +r.area.toFixed(2) })));
    return {
      notes: lines.join('\n'),
      summary: { kind: 'plan', path: 'new', share: cloud?.share || '', brief: p.brief, planTypes: x.planTypes, formats: x.formats, facade: x.facade, edited, totalArea: +tt.built.toFixed(1), coverage: +tt.coverage.toFixed(3), floors: p.floors.map((f, i) => ({ label: floorLabel(f, AR as typeof T), repeat: f.repeat, gross: +tt.per[i].gross.toFixed(1) })), rooms: rooms.slice(0, 120) },
      area: Math.round(p.brief.land.w * p.brief.land.d),
      style: x.facade,
    };
  }
  const fmtAr = (n: number) => String(Math.round(n));

  order.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd0 = new FormData(order);
    const name = String(fd0.get('name') || '').trim(), phone = String(fd0.get('phone') || '').trim();
    if (!name || !phone) { say(T.form.required, false); return; }
    if (path === 'upload' && !lists.plan.length) { say(T.form.noFiles, false); $('pl-drop').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    if (path === 'new' && !project?.floors.length) { say(T.editor.empty, false); return; }
    const brief = teamBrief();
    const fd = new FormData();
    fd.set('package', 'plan');
    fd.set('name', name); fd.set('phone', phone);
    fd.set('email', String(fd0.get('email') || '')); fd.set('city', String(fd0.get('city') || ''));
    fd.set('company_website', String(fd0.get('company_website') || ''));
    const userNotes = String(fd0.get('notes') || '').trim();
    fd.set('notes', (brief.notes + (userNotes ? `\n—\n${userNotes}` : '')).slice(0, 3000));
    fd.set('summary', JSON.stringify(brief.summary).slice(0, 29000));
    fd.set('area', String(brief.area || ''));
    fd.set('style', brief.style);
    let size = 0, i = 0;
    const add = (b: Blob, n: string) => { fd.append(`plan${i++}`, b, n); size += b.size; };
    if (path === 'new' && project) add(new Blob([fullDxf()], { type: 'application/dxf' }), 'oxira-plan.dxf');
    if (path === 'upload') lists.plan.forEach((p) => add(p.file, p.file.name));
    lists.extra.forEach((p) => add(p.file, p.file.name));
    if (size > MAX) { say(T.form.tooBig, false); return; }
    fd.set('lang', cfg.lang);
    fd.set('page', location.href.split('?')[0].split('#')[0]);
    fd.set('returnUrl', location.href.split('?')[0].split('#')[0]);
    const btn = $<HTMLButtonElement>('pl-submit');
    btn.disabled = true;
    btn.textContent = T.form.sending;
    msg.hidden = true;
    try {
      const res = await fetch(cfg.order, { method: 'POST', body: fd });
      const out = await res.json();
      if (!out.success) throw new Error(out.reason || 'failed');
      say(`<b>${T.form.success} #${out.orderId}</b><br>${T.form.successNext}`);
      order.reset();
      lists.extra = []; renderFiles('extra');
      if (path === 'upload') { lists.plan = []; renderFiles('plan'); }
    } catch {
      const text = encodeURIComponent(`${name} - ${phone}\n${brief.notes}`.slice(0, 1500));
      say(`${T.form.error} <a href="${cfg.whatsapp}?text=${text}" target="_blank" rel="noopener">WhatsApp</a>`, false);
    } finally {
      btn.disabled = false;
      btn.textContent = T.form.submit;
    }
  });

  // ------------------------------------------------------------ AI: description → settings
  const aiMsg = (el: HTMLElement, text: string, err = false) => { el.hidden = !text; el.textContent = text; el.classList.toggle('is-err', err); };
  async function callAi(body: object): Promise<any> {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 150000);
    try {
      const res = await fetch(cfg.ai, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctl.signal });
      return await res.json();
    } finally { clearTimeout(timer); }
  }
  $('pl-ai-go').addEventListener('click', async () => {
    const text = $<HTMLTextAreaElement>('pl-ai-text').value.trim();
    const msg = $('pl-ai-msg');
    if (text.length < 4) { $('pl-ai-text').focus(); return; }
    if (edited && !confirm(T.regenAsk)) return;
    const btn = $<HTMLButtonElement>('pl-ai-go');
    btn.disabled = true;
    aiMsg(msg, T.ai.busy);
    try {
      const out = await callAi({ kind: 'brief', text, lang: cfg.lang, region: region.id, brief: readBrief() });
      if (!out?.success) { aiMsg(msg, out?.reason === 'limit' ? T.ai.limit : T.ai.err, true); return; }
      const b = readBrief();
      const pt = out.patch || {};
      const TYPES = ['villa', 'duplex', 'building', 'mixed', 'istiraha'];
      if (TYPES.includes(pt.type)) b.type = pt.type;
      const num = (v: unknown) => (typeof v === 'number' && isFinite(v) ? v : undefined);
      if (pt.land) for (const k of ['w', 'd', 'streets', 'streetW'] as const) { const v = num(pt.land[k]); if (v !== undefined) (b.land as any)[k] = v; }
      for (const grp of ['villa', 'bld'] as const) {
        if (!pt[grp] || typeof pt[grp] !== 'object') continue;
        for (const [k, v] of Object.entries(pt[grp])) {
          if (!(k in b[grp]) && k !== 'garage') continue;
          if (typeof v === 'boolean' || typeof v === 'number' || (typeof v === 'string' && v.length < 20)) (b[grp] as any)[k] = v;
        }
      }
      const x = readExtras();
      if (Array.isArray(pt.planTypes)) x.planTypes = pt.planTypes.filter((k: string) => (PLAN_TYPES as readonly string[]).includes(k));
      if (typeof pt.facade === 'string') x.facade = pt.facade;
      // the plot changed: setbacks follow the country again
      const bld = b.type === 'building' || b.type === 'mixed';
      const sbr = (bld && region.bldSetback) || region.setback;
      if (!sbTouched) b.setback = { front: sbr.front(b.land.streetW), side: sbr.side, back: sbr.back };
      writeBrief(b, x);
      syncForm();
      variant = 0;
      regenerate(true);
      aiMsg(msg, out.reply || '');
    } catch {
      aiMsg(msg, T.ai.err, true);
    } finally {
      btn.disabled = false;
    }
  });

  // ------------------------------------------------------------ AI: drawing → editable plan
  async function imageFor(f: File): Promise<string> {
    if (isPdf(f)) return pdfToImage(f, 1800);
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(f);
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, 1800 / Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement('canvas');
        c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image')); };
      img.src = url;
    });
  }
  $('pl-imp-go').addEventListener('click', async () => {
    const msg = $('pl-imp-msg');
    const f = lists.plan.find((p) => isPdf(p.file) || /^image\/(png|jpe?g|webp)$/.test(p.file.type))?.file;
    if (!f) { aiMsg(msg, T.imp.noFile, true); return; }
    const btn = $<HTMLButtonElement>('pl-imp-go');
    btn.disabled = true;
    aiMsg(msg, T.imp.busy);
    try {
      const image = await imageFor(f);
      const wIn = parseFloat($<HTMLInputElement>('pl-imp-w').value);
      const out = await callAi({ kind: 'image', image, knownWidth: isFinite(wIn) ? lenOut(wIn, units) : 0, lang: cfg.lang, region: region.id });
      if (!out?.success) { aiMsg(msg, out?.reason === 'limit' ? T.ai.limit : T.imp.err, true); return; }
      project = fromRooms(out.rooms || [], out.width, out.depth, readBrief());
      writeBrief(project.brief, readExtras());
      syncForm();
      imported = true; edited = true; floorIdx = 0; selected = null; swapFrom = null; undo.length = 0;
      setPath('new');
      $('pl-regen').hidden = false;
      render(); save();
      aiMsg($('pl-ai-msg'), `${T.imp.done}${out.notes ? ' ' + out.notes : ''}`);
      $('pl-canvas').scrollIntoView({ behavior: 'smooth', block: 'center' });
      aiMsg(msg, T.imp.done);
    } catch {
      aiMsg(msg, T.imp.err, true);
    } finally {
      btn.disabled = false;
    }
  });

  // ------------------------------------------------------------ account: save, share, open
  const AC = accCopy[cfg.lang];
  const shareUrl = (s: string) => `${location.origin}${location.pathname}?s=${s}`;
  function showCloud() {
    const signed = !!getToken();
    $('pl-save-in').hidden = signed;
    $('pl-save-form').hidden = !signed;
    $('pl-share').hidden = !cloud;
    if (cloud) {
      $<HTMLInputElement>('pl-share-url').value = shareUrl(cloud.share);
      const n = $<HTMLInputElement>('pl-save-name');
      if (!n.value) n.value = cloud.title;
    }
  }
  function saveMsg(text: string, err = false) {
    const m = $('pl-save-msg');
    m.textContent = text; m.hidden = !text; m.classList.toggle('is-err', err);
  }
  $('pl-save-go').addEventListener('click', async () => {
    if (!project) return;
    const b = $<HTMLButtonElement>('pl-save-go');
    const title = $<HTMLInputElement>('pl-save-name').value.trim() || `${T.type.names[project.brief.type]} ${fmt(project.brief.land.w, 0)}×${fmt(project.brief.land.d, 0)}`;
    b.disabled = true;
    try {
      const data = { ...snap(), cloud: null };
      const r = await accCall('save', { pid: cloud?.pid || '', title, kind: 'plan', data: JSON.stringify(data) }, cfg.lang);
      if (!r.success) {
        if (r.reason === 'session') { showCloud(); saveMsg(AC.signIn.expired, true); }
        else saveMsg(AC.err, true);
        return;
      }
      cloud = { pid: r.pid, share: r.share, title };
      $<HTMLInputElement>('pl-save-name').value = title;
      showCloud(); save();
      saveMsg(AC.save.saved);
    } catch { saveMsg(AC.err, true); } finally { b.disabled = false; }
  });
  $('pl-share-copy').addEventListener('click', () => {
    const inp = $<HTMLInputElement>('pl-share-url');
    const b = $('pl-share-copy');
    const done = () => { b.textContent = AC.save.copied; setTimeout(() => { b.textContent = AC.save.copy; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(inp.value).then(done, () => { inp.select(); });
    else { inp.select(); document.execCommand('copy'); done(); }
  });
  /** ?p=<pid> opens a plan from the visitor's account, ?s=<share> a plan shared with them. */
  async function openFromLink(q: URLSearchParams) {
    const pid = q.get('p'), s = q.get('s');
    if (!pid && !s) return;
    history.replaceState(null, '', location.pathname + location.hash);
    try {
      let data: string | undefined, own: Cloud | null = null;
      if (pid && getToken()) {
        const r = await accCall('project', { pid }, cfg.lang);
        if (r.success && r.project) { data = r.project.data; own = { pid: r.project.pid, share: r.project.share, title: r.project.title }; }
      } else if (s && /^[a-z0-9]{16}$/.test(s)) {
        const r = await sharedPlan(s);
        if (r.success) data = r.data;
      }
      if (!data) { aiMsg($('pl-ai-msg'), AC.err, true); return; }
      const saved = JSON.parse(data) as Saved;
      saved.cloud = own;
      $<HTMLInputElement>('pl-save-name').value = own?.title || '';
      if (!applySaved(saved)) return;
      save();
      $('pl-shared-note').hidden = !!own;
      $('pl-canvas').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch { aiMsg($('pl-ai-msg'), AC.err, true); }
  }

  // ------------------------------------------------------------ start
  document.addEventListener('ox-region', (e) => {
    const r = regionById((e as CustomEvent).detail);
    if (!r) return;
    applyRegion(r);
    if (!edited) regenerate(false);
    else { $('pl-regen').hidden = false; render(); save(); }
  });
  void saveRegion;
  syncForm();
  const q = new URLSearchParams(location.search);
  showCloud();
  if (!restore()) { applyRegion(region); regenerate(false); }
  if (q.get('path') === 'upload') setPath('upload');
  openFromLink(q);
}
