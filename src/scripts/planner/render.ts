// Drawing a floor: SVG for the editor and print, DXF for AutoCAD and the 3D studio.
import { geometry, dividers, type Floor, type Project, type Kind, type Geometry, type Opening, type Rect, T_EXT } from './model.ts';

export type Names = (kind: Kind) => string;

const FILL: Record<string, string> = {
  pub: '#FFF4DE', fam: '#EAF4FB', bed: '#EEF0FB', wet: '#E3F3F1', svc: '#F3F1EC', circ: '#F7F8FA', core: '#ECEFF3', out: '#EEF6E8', shop: '#FBEDE7',
};
const GROUP: Record<Kind, string> = {
  entrance: 'circ', hall: 'circ', landing: 'core', stair: 'core', lift: 'core', living: 'fam', dining: 'fam', kitchen: 'svc',
  majlis: 'pub', ladies: 'pub', office: 'pub', prayer: 'pub', master: 'bed', bedroom: 'bed', guest: 'bed', dress: 'bed',
  bath: 'wet', wc: 'wet', laundry: 'wet', maid: 'svc', driver: 'svc', store: 'svc', shop: 'shop', parking: 'out', terrace: 'out', void: 'out', garage: 'out',
};
export const kindColor = (k: Kind) => FILL[GROUP[k]];

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const f2 = (n: number) => (Math.round(n * 1000) / 1000).toString();

export type SvgOpts = { names: Names; fmt: (n: number, d?: number) => string; m2: string; len?: (m: number, d?: number) => string; area?: (m2: number) => string; dims?: (w: number, h: number) => string; street: string; rtl?: boolean; site?: boolean; edit?: boolean; selected?: string | null; swapFrom?: string | null };

export function floorSvg(p: Project, f: Floor, o: SvgOpts): { svg: string; geo: Geometry; view: { x0: number; y1: number } } {
  const geo = geometry(f, f.level === 0);
  const L = o.len || ((m: number, d = 1) => `${o.fmt(m, d)} m`);
  const AR = o.area || ((a: number) => `${o.fmt(a)} ${o.m2}`);
  const DM = o.dims || ((w: number, h: number) => `${o.fmt(w, 2)} × ${o.fmt(h, 2)}`);
  const site = o.site !== false && f.level === 0;
  const pad = 1.6;
  const box: Rect = site ? { ...p.land } : { x0: f.rect.x0 - 0.2, y0: f.rect.y0 - 0.2, x1: f.rect.x1 + 0.2, y1: f.rect.y1 + 0.2 };
  const vx0 = box.x0 - pad, vy0 = box.y0 - pad - (site ? 1.2 : 0.6), vx1 = box.x1 + pad, vy1 = box.y1 + pad;
  const W = vx1 - vx0, H = vy1 - vy0;
  const X = (x: number) => f2(x - vx0), Y = (y: number) => f2(vy1 - y);
  const s: string[] = [];
  s.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f2(W)} ${f2(H)}" class="pl-svg" font-family="Cairo, 'IBM Plex Sans', sans-serif">`);
  s.push(`<defs><pattern id="pl-hatch" width="0.4" height="0.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="0.4" stroke="#B9CBA9" stroke-width="0.05"/></pattern></defs>`);
  const rect = (r: Rect, attrs: string) => `<rect x="${X(r.x0)}" y="${Y(r.y1)}" width="${f2(r.x1 - r.x0)}" height="${f2(r.y1 - r.y0)}" ${attrs}/>`;
  const line = (x0: number, y0: number, x1: number, y1: number, attrs: string) => `<line x1="${X(x0)}" y1="${Y(y0)}" x2="${X(x1)}" y2="${Y(y1)}" ${attrs}/>`;
  const text = (x: number, y: number, t: string, size: number, attrs = '') => `<text x="${X(x)}" y="${Y(y)}" font-size="${f2(size)}" text-anchor="middle" dominant-baseline="middle" ${attrs}>${esc(t)}</text>`;

  if (site) {
    s.push(rect(p.land, 'fill="#F4F7F1" stroke="#7C8B70" stroke-width="0.06" stroke-dasharray="0.4 0.2"'));
    s.push(rect(p.build, 'fill="none" stroke="#B7C2CC" stroke-width="0.04" stroke-dasharray="0.25 0.18"'));
    // street
    s.push(`<rect x="${X(p.land.x0 - pad)}" y="${Y(p.land.y0 - 0.25)}" width="${f2(p.land.x1 - p.land.x0 + 2 * pad)}" height="${f2(pad + 0.9)}" fill="#E4E8EC"/>`);
    s.push(text((p.land.x0 + p.land.x1) / 2, p.land.y0 - 0.95, o.street, 0.42, 'fill="#556779" font-weight="600"'));
    // land dimensions
    s.push(dimH(p.land.x0, p.land.x1, p.land.y1 + 0.7, L(p.land.x1 - p.land.x0), X, Y));
    s.push(dimV(p.land.y0, p.land.y1, p.land.x1 + 0.7, L(p.land.y1 - p.land.y0), X, Y));
  }

  // rooms
  for (const r of geo.rooms) {
    const k = r.leaf.kind;
    const sel = o.selected === r.leaf.id ? ' pl-sel' : '';
    const swp = o.swapFrom === r.leaf.id ? ' pl-swp' : '';
    s.push(rect(r.net, `fill="${k === 'terrace' || k === 'void' ? 'url(#pl-hatch)' : kindColor(k)}" class="pl-room${sel}${swp}" data-id="${r.leaf.id}"`));
  }
  // stairs and lifts
  for (const r of geo.rooms) {
    const n = r.net;
    if (r.leaf.kind === 'stair') {
      const alongX = n.x1 - n.x0 >= n.y1 - n.y0;
      const L = alongX ? n.x1 - n.x0 : n.y1 - n.y0;
      const steps = Math.max(6, Math.round(L / 0.3));
      for (let i = 1; i < steps; i++) {
        const t = (alongX ? n.x0 : n.y0) + (L * i) / steps;
        s.push(alongX ? line(t, n.y0, t, n.y1, 'stroke="#8A9AAA" stroke-width="0.025" pointer-events="none"') : line(n.x0, t, n.x1, t, 'stroke="#8A9AAA" stroke-width="0.025" pointer-events="none"'));
      }
      const mid = alongX ? (n.y0 + n.y1) / 2 : (n.x0 + n.x1) / 2;
      s.push(alongX ? line(n.x0 + 0.3, mid, n.x1 - 0.3, mid, 'stroke="#556779" stroke-width="0.04" pointer-events="none"') : line(mid, n.y0 + 0.3, mid, n.y1 - 0.3, 'stroke="#556779" stroke-width="0.04" pointer-events="none"'));
    }
    if (r.leaf.kind === 'lift') {
      s.push(line(n.x0 + 0.15, n.y0 + 0.15, n.x1 - 0.15, n.y1 - 0.15, 'stroke="#8A9AAA" stroke-width="0.03" pointer-events="none"'));
      s.push(line(n.x0 + 0.15, n.y1 - 0.15, n.x1 - 0.15, n.y0 + 0.15, 'stroke="#8A9AAA" stroke-width="0.03" pointer-events="none"'));
    }
  }
  // walls
  for (const w of geo.walls) s.push(rect(w, `fill="${w.ext ? '#0A253E' : '#2B4257'}" pointer-events="none"`));
  // openings
  for (const op of geo.openings) s.push(openingSvg(op, X, Y));
  // labels
  for (const r of geo.rooms) {
    const n = r.net;
    const cx = (n.x0 + n.x1) / 2, cy = (n.y0 + n.y1) / 2;
    const w = n.x1 - n.x0, h = n.y1 - n.y0;
    if (r.leaf.kind === 'stair' || r.leaf.kind === 'lift') {
      if (Math.min(w, h) > 0.9) s.push(text(cx, cy + (r.leaf.kind === 'stair' ? 0.35 : 0), r.leaf.name || o.names(r.leaf.kind), 0.26, 'fill="#3B4F63" font-weight="600" pointer-events="none" paint-order="stroke" stroke="#ECEFF3" stroke-width="0.08"'));
      continue;
    }
    const size = Math.max(0.2, Math.min(0.42, Math.min(w, h) / 5.5, w / Math.max(4, (r.leaf.name || o.names(r.leaf.kind)).length * 0.62)));
    s.push(text(cx, cy + size * 0.55, r.leaf.name || o.names(r.leaf.kind), size, 'fill="#0A253E" font-weight="700" pointer-events="none"'));
    if (h > 1.4 && w > 1.2) s.push(text(cx, cy - size * 0.75, AR(r.area), size * 0.72, `fill="#556779" pointer-events="none" direction="${o.rtl ? 'rtl' : 'ltr'}"`));
    if (h > 2.2 && w > 2) s.push(text(cx, cy - size * 1.75, DM(n.x1 - n.x0, n.y1 - n.y0), size * 0.62, 'fill="#8A9AAA" pointer-events="none" direction="ltr"'));
  }
  // footprint dimensions
  const F = f.rect, e = T_EXT / 2;
  s.push(dimH(F.x0 - e, F.x1 + e, F.y0 - e - 0.55, L(F.x1 - F.x0 + T_EXT, 2), X, Y));
  s.push(dimV(F.y0 - e, F.y1 + e, F.x0 - e - 0.55, L(F.y1 - F.y0 + T_EXT, 2), X, Y));
  // editing handles
  if (o.edit) {
    dividers(f).forEach((d, i) => {
      const a = d.axis === 'x' ? line(d.at, d.from, d.at, d.to, '') : line(d.from, d.at, d.to, d.at, '');
      s.push(a.replace('/>', ` class="pl-div pl-div-${d.axis}" data-div="${i}" stroke="transparent" stroke-width="0.5"/>`));
    });
  }
  s.push('</svg>');
  return { svg: s.join(''), geo, view: { x0: vx0, y1: vy1 } };
}

function dimH(x0: number, x1: number, y: number, label: string, X: (n: number) => string, Y: (n: number) => string) {
  const t = 0.18;
  return `<g pointer-events="none" stroke="#7D8C9B" stroke-width="0.03"><line x1="${X(x0)}" y1="${Y(y)}" x2="${X(x1)}" y2="${Y(y)}"/><line x1="${X(x0)}" y1="${Y(y - t)}" x2="${X(x0)}" y2="${Y(y + t)}"/><line x1="${X(x1)}" y1="${Y(y - t)}" x2="${X(x1)}" y2="${Y(y + t)}"/></g><text x="${X((x0 + x1) / 2)}" y="${Y(y + 0.22)}" font-size="0.32" text-anchor="middle" fill="#556779" direction="ltr" pointer-events="none">${label}</text>`;
}
function dimV(y0: number, y1: number, x: number, label: string, X: (n: number) => string, Y: (n: number) => string) {
  const t = 0.18;
  const cx = X(x - 0.25), cy = Y((y0 + y1) / 2);
  return `<g pointer-events="none" stroke="#7D8C9B" stroke-width="0.03"><line x1="${X(x)}" y1="${Y(y0)}" x2="${X(x)}" y2="${Y(y1)}"/><line x1="${X(x - t)}" y1="${Y(y0)}" x2="${X(x + t)}" y2="${Y(y0)}"/><line x1="${X(x - t)}" y1="${Y(y1)}" x2="${X(x + t)}" y2="${Y(y1)}"/></g><text x="${cx}" y="${cy}" font-size="0.32" text-anchor="middle" fill="#556779" direction="ltr" transform="rotate(-90 ${cx} ${cy})" pointer-events="none">${label}</text>`;
}

function openingSvg(o: Opening, X: (n: number) => string, Y: (n: number) => string): string {
  const th = o.th;
  const out: string[] = [];
  const p = (t: number, off: number) => (o.axis === 'y' ? { x: t, y: o.c + off } : { x: o.c + off, y: t });
  const L = (a: { x: number; y: number }, b: { x: number; y: number }, attrs: string) => `<line x1="${X(a.x)}" y1="${Y(a.y)}" x2="${X(b.x)}" y2="${Y(b.y)}" ${attrs}/>`;
  if (o.kind === 'window') {
    for (const off of [-th / 2, -th * 0.12, th * 0.12, th / 2]) out.push(L(p(o.t0, off), p(o.t1, off), 'stroke="#2E8BC0" stroke-width="0.03"'));
    out.push(L(p(o.t0, -th / 2), p(o.t0, th / 2), 'stroke="#2E8BC0" stroke-width="0.03"'));
    out.push(L(p(o.t1, -th / 2), p(o.t1, th / 2), 'stroke="#2E8BC0" stroke-width="0.03"'));
  } else if (o.kind === 'door') {
    const w = o.t1 - o.t0;
    const into = o.into || 1;
    const ht = o.hingeAt0 ? o.t0 : o.t1;
    const tt = o.hingeAt0 ? o.t1 : o.t0;
    const face = (into * th) / 2;
    const hinge = p(ht, face);
    const leafEnd = p(ht, face + into * w);
    const closed = p(tt, face);
    out.push(L(hinge, leafEnd, `stroke="#0A253E" stroke-width="${o.main ? 0.06 : 0.04}"`));
    // arc from the leaf tip to the closed position
    const sweep = (() => {
      // cross product sign decides the SVG sweep flag (y is flipped)
      const ax = leafEnd.x - hinge.x, ay = leafEnd.y - hinge.y, bx = closed.x - hinge.x, by = closed.y - hinge.y;
      return ax * by - ay * bx > 0 ? 0 : 1;
    })();
    out.push(`<path d="M ${X(leafEnd.x)} ${Y(leafEnd.y)} A ${f2(w)} ${f2(w)} 0 0 ${sweep} ${X(closed.x)} ${Y(closed.y)}" fill="none" stroke="#7D8C9B" stroke-width="0.025" stroke-dasharray="0.08 0.06"/>`);
  } else if (o.kind === 'gate') {
    out.push(L(p(o.t0, 0), p(o.t1, 0), 'stroke="#7D8C9B" stroke-width="0.04" stroke-dasharray="0.2 0.12"'));
  }
  return `<g pointer-events="none">${out.join('')}</g>`;
}

// ------------------------------------------------------------------ DXF (R12, metres)
const enc = (s: string) => Array.from(s).map((ch) => { const c = ch.codePointAt(0)!; return c < 128 ? ch : '\\U+' + c.toString(16).toUpperCase().padStart(4, '0'); }).join('');

export type DxfOpts = { names: Names; title?: (f: Floor) => string; m2: string; site?: boolean; areas?: boolean };

/** One DXF with the given floors side by side (left to right), on layers the studio understands. */
export function toDxf(p: Project, floors: Floor[], o: DxfOpts): string {
  const E: string[] = [];
  const g = (...kv: (string | number)[]) => { for (let i = 0; i < kv.length; i += 2) E.push(String(kv[i]), typeof kv[i + 1] === 'number' ? fmtNum(kv[i + 1] as number) : String(kv[i + 1])); };
  const lineE = (layer: string, x0: number, y0: number, x1: number, y1: number) => g(0, 'LINE', 8, layer, 10, x0, 20, y0, 30, 0, 11, x1, 21, y1, 31, 0);
  const textE = (layer: string, x: number, y: number, h: number, s: string) => g(0, 'TEXT', 8, layer, 10, x, 20, y, 30, 0, 40, h, 1, enc(s), 72, 1, 73, 2, 11, x, 21, y, 31, 0);
  let dx = 0;
  const gap = 6;
  for (const f of floors) {
    const site = o.site && f.level === 0;
    const geo = geometry(f, f.level === 0);
    const left = site ? p.land.x0 : f.rect.x0 - 1;
    const ox = dx - left;
    // walls: outline of the union of all wall pieces
    for (const s of outline(geo.walls)) lineE('A-WALL', s[0] + ox, s[1], s[2] + ox, s[3]);
    for (const op of geo.openings) {
      if (op.kind === 'window') {
        if (op.axis === 'y') g(0, 'INSERT', 8, 'A-GLAZ', 2, 'WIN', 10, op.t0 + ox, 20, op.c - op.th / 2, 30, 0, 41, op.t1 - op.t0, 42, op.th, 50, 0);
        else g(0, 'INSERT', 8, 'A-GLAZ', 2, 'WIN', 10, op.c + op.th / 2 + ox, 20, op.t0, 30, 0, 41, op.t1 - op.t0, 42, op.th, 50, 90);
      } else if (op.kind === 'door') {
        const w = op.t1 - op.t0, into = op.into || 1;
        const ht = op.hingeAt0 ? op.t0 : op.t1;
        const dir = op.hingeAt0 ? 1 : -1;
        const face = (into * op.th) / 2;
        const hx = op.axis === 'y' ? ht : op.c + face, hy = op.axis === 'y' ? op.c + face : ht;
        const ux = op.axis === 'y' ? dir : 0, uy = op.axis === 'y' ? 0 : dir;
        const rot = (Math.atan2(uy, ux) * 180) / Math.PI;
        const ly = { x: -uy, y: ux }; // local +y after rotation
        const nx = op.axis === 'y' ? 0 : into, ny = op.axis === 'y' ? into : 0;
        const ys = ly.x * nx + ly.y * ny >= 0 ? w : -w;
        g(0, 'INSERT', 8, 'A-DOOR', 2, 'DOOR', 10, hx + ox, 20, hy, 30, 0, 41, w, 42, ys, 50, rot);
      }
    }
    for (const r of geo.rooms) {
      const n = r.net, cx = (n.x0 + n.x1) / 2 + ox, cy = (n.y0 + n.y1) / 2;
      const h = Math.max(0.15, Math.min(0.3, Math.min(n.x1 - n.x0, n.y1 - n.y0) / 6));
      if (r.leaf.kind === 'stair') {
        const alongX = n.x1 - n.x0 >= n.y1 - n.y0;
        const L = alongX ? n.x1 - n.x0 : n.y1 - n.y0, steps = Math.max(6, Math.round(L / 0.3));
        for (let i = 1; i < steps; i++) { const t = (alongX ? n.x0 : n.y0) + (L * i) / steps; if (alongX) lineE('A-FLOR-STRS', t + ox, n.y0, t + ox, n.y1); else lineE('A-FLOR-STRS', n.x0 + ox, t, n.x1 + ox, t); }
      }
      textE('A-ANNO-TEXT', cx, cy + h * 0.6, h, r.leaf.name || o.names(r.leaf.kind));
      if (o.areas) textE('A-ANNO-AREA', cx, cy - h * 0.9, h * 0.7, `${(Math.round(r.area * 10) / 10).toFixed(1)} m2`);
    }
    if (site) {
      const L = p.land, B = p.build;
      for (const [a, b, c2, d] of [[L.x0, L.y0, L.x1, L.y0], [L.x1, L.y0, L.x1, L.y1], [L.x1, L.y1, L.x0, L.y1], [L.x0, L.y1, L.x0, L.y0]]) lineE('A-SITE-PLOT', a + ox, b, c2 + ox, d);
      for (const [a, b, c2, d] of [[B.x0, B.y0, B.x1, B.y0], [B.x1, B.y0, B.x1, B.y1], [B.x1, B.y1, B.x0, B.y1], [B.x0, B.y1, B.x0, B.y0]]) lineE('A-SITE-SETBACK', a + ox, b, c2 + ox, d);
    }
    if (o.title) textE('A-ANNO-TTLB', (f.rect.x0 + f.rect.x1) / 2 + ox, (site ? p.land.y0 : f.rect.y0) - 1.6, 0.5, o.title(f));
    dx += (site ? p.land.x1 - p.land.x0 : f.rect.x1 - f.rect.x0 + 2) + gap;
  }
  const layers: [string, number][] = [['0', 7], ['A-WALL', 7], ['A-DOOR', 1], ['A-GLAZ', 4], ['A-ANNO-TEXT', 3], ['A-ANNO-AREA', 8], ['A-ANNO-TTLB', 2], ['A-FLOR-STRS', 8], ['A-SITE-PLOT', 6], ['A-SITE-SETBACK', 9]];
  const H: string[] = [];
  const h = (...kv: (string | number)[]) => { for (let i = 0; i < kv.length; i += 2) H.push(String(kv[i]), typeof kv[i + 1] === 'number' ? fmtNum(kv[i + 1] as number) : String(kv[i + 1])); };
  h(0, 'SECTION', 2, 'HEADER', 9, '$ACADVER', 1, 'AC1009', 9, '$INSUNITS', 70, 6, 9, '$MEASUREMENT', 70, 1, 0, 'ENDSEC');
  h(0, 'SECTION', 2, 'TABLES');
  h(0, 'TABLE', 2, 'LTYPE', 70, 1, 0, 'LTYPE', 2, 'CONTINUOUS', 70, 0, 3, 'Solid line', 72, 65, 73, 0, 40, 0, 0, 'ENDTAB');
  h(0, 'TABLE', 2, 'LAYER', 70, layers.length);
  for (const [n, c] of layers) h(0, 'LAYER', 2, n, 70, 0, 62, c, 6, 'CONTINUOUS');
  h(0, 'ENDTAB');
  h(0, 'TABLE', 2, 'STYLE', 70, 1, 0, 'STYLE', 2, 'STANDARD', 70, 0, 40, 0, 41, 1, 50, 0, 71, 0, 42, 0.3, 3, 'arial.ttf', 4, '', 0, 'ENDTAB');
  h(0, 'ENDSEC');
  h(0, 'SECTION', 2, 'BLOCKS');
  h(0, 'BLOCK', 8, '0', 2, 'DOOR', 70, 0, 10, 0, 20, 0, 30, 0, 3, 'DOOR');
  h(0, 'LINE', 8, '0', 10, 0, 20, 0, 30, 0, 11, 0, 21, 1, 31, 0);
  h(0, 'ARC', 8, '0', 10, 0, 20, 0, 30, 0, 40, 1, 50, 0, 51, 90);
  h(0, 'ENDBLK', 8, '0');
  h(0, 'BLOCK', 8, '0', 2, 'WIN', 70, 0, 10, 0, 20, 0, 30, 0, 3, 'WIN');
  for (const v of [0, 0.42, 0.58, 1]) h(0, 'LINE', 8, '0', 10, 0, 20, v, 30, 0, 11, 1, 21, v, 31, 0);
  h(0, 'LINE', 8, '0', 10, 0, 20, 0, 30, 0, 11, 0, 21, 1, 31, 0);
  h(0, 'LINE', 8, '0', 10, 1, 20, 0, 30, 0, 11, 1, 21, 1, 31, 0);
  h(0, 'ENDBLK', 8, '0');
  h(0, 'ENDSEC');
  return [...H, '0', 'SECTION', '2', 'ENTITIES', ...E, '0', 'ENDSEC', '0', 'EOF'].join('\r\n') + '\r\n';
}
const fmtNum = (n: number) => (Number.isInteger(n) ? String(n) : (Math.round(n * 10000) / 10000).toString());

/** Outline of a union of axis-aligned rectangles, as merged line segments [x0,y0,x1,y1]. */
export function outline(rs: Rect[]): [number, number, number, number][] {
  const q = (v: number) => Math.round(v * 1000) / 1000;
  const xs = [...new Set(rs.flatMap((r) => [q(r.x0), q(r.x1)]))].sort((a, b) => a - b);
  const ys = [...new Set(rs.flatMap((r) => [q(r.y0), q(r.y1)]))].sort((a, b) => a - b);
  const xi = new Map(xs.map((v, i) => [v, i])), yi = new Map(ys.map((v, i) => [v, i]));
  const nx = xs.length - 1, ny = ys.length - 1;
  if (nx < 1 || ny < 1) return [];
  const cov = new Uint8Array(nx * ny);
  for (const r of rs) {
    const i0 = xi.get(q(r.x0))!, i1 = xi.get(q(r.x1))!, j0 = yi.get(q(r.y0))!, j1 = yi.get(q(r.y1))!;
    for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) cov[j * nx + i] = 1;
  }
  const at = (i: number, j: number) => (i < 0 || j < 0 || i >= nx || j >= ny ? 0 : cov[j * nx + i]);
  const out: [number, number, number, number][] = [];
  // vertical edges at x = xs[i]
  for (let i = 0; i <= nx; i++) {
    let start = -1;
    for (let j = 0; j <= ny; j++) {
      const edge = j < ny && at(i - 1, j) !== at(i, j);
      if (edge && start < 0) start = j;
      if (!edge && start >= 0) { out.push([xs[i], ys[start], xs[i], ys[j]]); start = -1; }
    }
  }
  for (let j = 0; j <= ny; j++) {
    let start = -1;
    for (let i = 0; i <= nx; i++) {
      const edge = i < nx && at(i, j - 1) !== at(i, j);
      if (edge && start < 0) start = i;
      if (!edge && start >= 0) { out.push([xs[start], ys[j], xs[i], ys[j]]); start = -1; }
    }
  }
  return out;
}
