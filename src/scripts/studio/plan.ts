// Turns flat DXF primitives into a building model:
// walls (from pairs of parallel lines), openings (gaps between collinear walls,
// classified by nearby door/window symbols) and rooms (flood fill on a raster grid).
import type { Flat, Seg, Box, P, Role } from './dxf.ts';

export type Wall = { ox: number; oy: number; ux: number; uy: number; len: number; t: number; single?: boolean };
export type OpeningKind = 'door' | 'window' | 'open';
export type Opening = { kind: OpeningKind; cx: number; cy: number; ux: number; uy: number; width: number; t: number; leaf?: { a: P; b: P }; hinge?: P };
export type RoomType = 'living' | 'bedroom' | 'kitchen' | 'bath' | 'dining' | 'hall' | 'balcony' | 'service' | 'room';
export type Rect = { x0: number; y0: number; x1: number; y1: number };
export type Room = {
  id: number; name: string; labeled: boolean; type: RoomType;
  area: number; perimeter: number; center: P; rects: Rect[]; maxRect: Rect;
  doors: number; windows: number; openingWidth: number; openingArea: number;
};
export type Grid = { w: number; h: number; cell: number; x0: number; y0: number; v: Uint8Array; room: Int32Array };
export type Plan = { walls: Wall[]; openings: Opening[]; rooms: Room[]; bounds: Box; grid: Grid; height: number; warnings: string[]; stats: { lines: number; markers: number } };

const DEG = Math.PI / 180;
const MIN_T = 0.05, MAX_T = 0.6, MIN_OVERLAP = 0.12;

type Line = { th: number; ux: number; uy: number; nx: number; ny: number; c: number; t0: number; t1: number };

function toLine(a: P, b: P): Line | null {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len < 0.02) return null;
  let th = Math.atan2(dy, dx);
  if (th < 0) th += Math.PI;
  if (th >= Math.PI - 0.003) th -= Math.PI;
  const ux = Math.cos(th), uy = Math.sin(th);
  const nx = -uy, ny = ux;
  const ta = ux * a.x + uy * a.y, tb = ux * b.x + uy * b.y;
  return { th, ux, uy, nx, ny, c: nx * a.x + ny * a.y, t0: Math.min(ta, tb), t1: Math.max(ta, tb) };
}
const pt = (L: Line, t: number, off = 0): P => ({ x: L.nx * (L.c + off) + L.ux * t, y: L.ny * (L.c + off) + L.uy * t });

type Iv = [number, number];
function subtract(base: Iv[], cut: Iv[]): Iv[] {
  let out = base.slice();
  for (const [s, e] of cut) {
    const next: Iv[] = [];
    for (const [a, b] of out) {
      if (e <= a || s >= b) { next.push([a, b]); continue; }
      if (s > a) next.push([a, s]);
      if (e < b) next.push([e, b]);
    }
    out = next;
  }
  return out;
}

/** Merge collinear, touching pieces (polylines often split one straight face into several). */
function mergeLines(segs: Seg[]): Line[] {
  const ls = segs.map((s) => toLine(s.a, s.b)).filter(Boolean) as Line[];
  ls.sort((p, q) => p.th - q.th);
  const out: Line[] = [];
  let i = 0;
  while (i < ls.length) {
    let j = i + 1;
    while (j < ls.length && ls[j].th - ls[j - 1].th < 0.15 * DEG) j++;
    const grp = ls.slice(i, j);
    // common frame for this angle cluster
    const th = grp.reduce((s, l) => s + l.th, 0) / grp.length;
    const ux = Math.cos(th), uy = Math.sin(th), nx = -uy, ny = ux;
    const items = grp.map((l) => {
      const a = pt(l, l.t0), b = pt(l, l.t1);
      const ta = ux * a.x + uy * a.y, tb = ux * b.x + uy * b.y;
      return { c: (nx * a.x + ny * a.y + nx * b.x + ny * b.y) / 2, t0: Math.min(ta, tb), t1: Math.max(ta, tb) };
    }).sort((p, q) => p.c - q.c);
    let k = 0;
    while (k < items.length) {
      let m = k + 1;
      while (m < items.length && items[m].c - items[m - 1].c < 0.002) m++;
      const row = items.slice(k, m).sort((p, q) => p.t0 - q.t0);
      const c = row.reduce((s, r) => s + r.c, 0) / row.length;
      let cur: Iv | null = null;
      for (const r of row) {
        if (cur && r.t0 <= cur[1] + 0.002) cur[1] = Math.max(cur[1], r.t1);
        else { if (cur) out.push({ th, ux, uy, nx, ny, c, t0: cur[0], t1: cur[1] }); cur = [r.t0, r.t1]; }
      }
      if (cur) out.push({ th, ux, uy, nx, ny, c, t0: cur[0], t1: cur[1] });
      k = m;
    }
    i = j;
  }
  return out;
}

function wallFrom(L: Line, s0: number, s1: number, offA: number, offB: number, single = false): Wall {
  const mid = (offA + offB) / 2;
  const o = pt(L, s0, mid);
  return { ox: o.x, oy: o.y, ux: L.ux, uy: L.uy, len: s1 - s0, t: Math.abs(offB - offA), single };
}

function findWalls(segs: Seg[]): { walls: Wall[]; lines: number } {
  const L = mergeLines(segs);
  const n = L.length;
  // angle buckets for neighbour search
  const bins = new Map<number, number[]>();
  const binOf = (th: number) => ((Math.round(th / DEG) % 180) + 180) % 180;
  L.forEach((l, i) => { const b = binOf(l.th); (bins.get(b) || bins.set(b, []).get(b)!).push(i); });

  type Cand = { i: number; j: number; d: number; o0: number; o1: number };
  const cands: Cand[] = [];
  for (let i = 0; i < n; i++) {
    const A = L[i];
    const b = binOf(A.th);
    for (const bb of [b - 1, b, b + 1]) {
      const list = bins.get((bb + 180) % 180);
      if (!list) continue;
      for (const j of list) {
        if (j <= i) continue;
        const B = L[j];
        const cos = A.ux * B.ux + A.uy * B.uy;
        if (Math.abs(cos) < Math.cos(1.5 * DEG)) continue;
        // B's extent in A's frame
        const pa = pt(B, B.t0), pb = pt(B, B.t1);
        const ta = A.ux * pa.x + A.uy * pa.y, tb = A.ux * pb.x + A.uy * pb.y;
        const o0 = Math.max(A.t0, Math.min(ta, tb)), o1 = Math.min(A.t1, Math.max(ta, tb));
        if (o1 - o0 < MIN_OVERLAP) continue;
        const tm = (o0 + o1) / 2;
        // distance at overlap middle
        const f = (tm - Math.min(ta, tb)) / Math.max(1e-9, Math.abs(tb - ta));
        const q = { x: pa.x + (pb.x - pa.x) * (ta < tb ? f : 1 - f), y: pa.y + (pb.y - pa.y) * (ta < tb ? f : 1 - f) };
        const d = A.nx * q.x + A.ny * q.y - A.c;
        if (Math.abs(d) < MIN_T || Math.abs(d) > MAX_T) continue;
        cands.push({ i, j, d, o0, o1 });
      }
    }
  }
  cands.sort((p, q) => Math.abs(p.d) - Math.abs(q.d) || (q.o1 - q.o0) - (p.o1 - p.o0));

  const cov: Iv[][] = L.map(() => []);
  const side: { s: number; t: number }[] = L.map(() => ({ s: 0, t: 0 }));
  const walls: Wall[] = [];
  const toFrame = (from: Line, to: Line, t: number) => { const p = pt(from, t); return to.ux * p.x + to.uy * p.y; };

  for (const c of cands) {
    const A = L[c.i], B = L[c.j];
    const mappedB: Iv[] = cov[c.j].map(([s, e]) => { const x = toFrame(B, A, s), y = toFrame(B, A, e); return [Math.min(x, y), Math.max(x, y)] as Iv; });
    const free = subtract(subtract([[c.o0, c.o1]], cov[c.i]), mappedB).filter(([s, e]) => e - s >= 0.03);
    for (const [s, e] of free) walls.push(wallFrom(A, s, e, 0, c.d));
    if (free.length) {
      if (!side[c.i].t) side[c.i] = { s: Math.sign(c.d), t: Math.abs(c.d) };
      if (!side[c.j].t) {
        const mid = pt(A, (c.o0 + c.o1) / 2);
        const dj = B.nx * mid.x + B.ny * mid.y - B.c;
        side[c.j] = { s: Math.sign(dj), t: Math.abs(c.d) };
      }
    }
    cov[c.i].push([c.o0, c.o1]);
    const x = toFrame(A, B, c.o0), y = toFrame(A, B, c.o1);
    cov[c.j].push([Math.min(x, y), Math.max(x, y)]);
  }

  // Leftovers: corners and junction pieces get the thickness of their paired wall;
  // long lonely lines are single-line walls.
  for (let i = 0; i < n; i++) {
    const A = L[i];
    const rest = subtract([[A.t0, A.t1]], cov[i]).filter(([s, e]) => e - s >= 0.02);
    for (const [s, e] of rest) {
      if (side[i].t) walls.push(wallFrom(A, s, e, 0, side[i].s * side[i].t));
      else if (e - s > 0.6 && cov[i].length === 0) walls.push(wallFrom(A, s, e, -0.06, 0.06, true));
    }
  }
  return { walls, lines: n };
}

type Mk = { kind: 'door' | 'window'; box: Box; segs: Seg[] };

function collectMarkers(flat: Flat, roles: Record<string, Role>): Mk[] {
  const out: Mk[] = [];
  for (const b of flat.blockMarkers) {
    const byName = /win|wind|glaz|fenster|fen[eê]tre|окн|شباك|نافذ|^w\d*$/i.test(b.name) ? 'window' : /door|tür|porte|двер|باب|^d\d*$/i.test(b.name) ? 'door' : null;
    const r = roles[b.layer];
    const kind = byName || (r === 'window' ? 'window' : r === 'door' ? 'door' : null);
    if (kind) out.push({ kind, box: b.box, segs: b.segs });
  }
  for (const s of flat.segs) {
    const r = roles[s.layer];
    if (r === 'door' || r === 'window') {
      out.push({ kind: r, box: { x0: Math.min(s.a.x, s.b.x), y0: Math.min(s.a.y, s.b.y), x1: Math.max(s.a.x, s.b.x), y1: Math.max(s.a.y, s.b.y) }, segs: [s] });
    }
  }
  return out;
}

function findOpenings(walls: Wall[], markers: Mk[]): Opening[] {
  // group collinear walls
  type W = { th: number; ux: number; uy: number; nx: number; ny: number; c: number; s0: number; s1: number; t: number };
  const ws: W[] = walls.filter((w) => !w.single).map((w) => {
    let th = Math.atan2(w.uy, w.ux); if (th < 0) th += Math.PI; if (th >= Math.PI - 0.003) th -= Math.PI;
    const ux = Math.cos(th), uy = Math.sin(th), nx = -uy, ny = ux;
    const ex = w.ox + w.ux * w.len, ey = w.oy + w.uy * w.len;
    const a = ux * w.ox + uy * w.oy, b = ux * ex + uy * ey;
    return { th, ux, uy, nx, ny, c: nx * w.ox + ny * w.oy, s0: Math.min(a, b), s1: Math.max(a, b), t: w.t };
  }).sort((p, q) => p.th - q.th);

  const groups: W[][] = [];
  let i = 0;
  while (i < ws.length) {
    let j = i + 1;
    while (j < ws.length && ws[j].th - ws[j - 1].th < 0.8 * DEG) j++;
    const byC = ws.slice(i, j).sort((p, q) => p.c - q.c);
    let k = 0;
    while (k < byC.length) {
      let m = k + 1;
      while (m < byC.length && byC[m].c - byC[m - 1].c < 0.05) m++;
      groups.push(byC.slice(k, m));
      k = m;
    }
    i = j;
  }

  const ops: Opening[] = [];
  for (const g of groups) {
    const th = g.reduce((s, w) => s + w.th, 0) / g.length;
    const ux = Math.cos(th), uy = Math.sin(th), nx = -uy, ny = ux;
    const c = g.reduce((s, w) => s + w.c, 0) / g.length;
    const iv = g.map((w) => [w.s0, w.s1, w.t] as [number, number, number]).sort((p, q) => p[0] - q[0]);
    const merged: [number, number, number][] = [];
    for (const x of iv) {
      const last = merged[merged.length - 1];
      if (last && x[0] <= last[1] + 0.01) { last[1] = Math.max(last[1], x[1]); last[2] = Math.max(last[2], x[2]); }
      else merged.push([...x]);
    }
    for (let q = 1; q < merged.length; q++) {
      const a = merged[q - 1], b = merged[q];
      const gap = b[0] - a[1];
      if (gap < 0.45 || gap > 3.5) continue;
      const t = Math.min(a[2], b[2]);
      const mid = (a[1] + b[0]) / 2;
      const cx = nx * c + ux * mid, cy = ny * c + uy * mid;
      ops.push({ kind: 'open', cx, cy, ux, uy, width: gap, t });
    }
  }

  // classify by door / window symbols near each gap
  for (const o of ops) {
    const half = o.width / 2 - 0.03, depth = o.t / 2 + 0.2;
    const dHalf = o.width / 2 + 0.06, dDepth = o.t / 2 + 0.35;
    const nx = -o.uy, ny = o.ux;
    const gx0 = o.cx - Math.abs(o.ux) * dHalf - Math.abs(nx) * dDepth, gx1 = o.cx + Math.abs(o.ux) * dHalf + Math.abs(nx) * dDepth;
    const gy0 = o.cy - Math.abs(o.uy) * dHalf - Math.abs(ny) * dDepth, gy1 = o.cy + Math.abs(o.uy) * dHalf + Math.abs(ny) * dDepth;
    const score = { door: 0, window: 0 };
    let leaf: { a: P; b: P } | undefined;
    let leafLen = 0;
    for (const m of markers) {
      if (m.box.x1 < gx0 || m.box.x0 > gx1 || m.box.y1 < gy0 || m.box.y0 > gy1) continue;
      let hits = 0;
      for (const s of m.segs) {
        const len = Math.hypot(s.b.x - s.a.x, s.b.y - s.a.y);
        const steps = Math.max(1, Math.ceil(len / 0.05));
        for (let k = 0; k <= steps; k++) {
          const x = s.a.x + ((s.b.x - s.a.x) * k) / steps, y = s.a.y + ((s.b.y - s.a.y) * k) / steps;
          const lu = (x - o.cx) * o.ux + (y - o.cy) * o.uy, ln = (x - o.cx) * nx + (y - o.cy) * ny;
          if (m.kind === 'window' ? Math.abs(lu) <= half && Math.abs(ln) <= depth : Math.abs(lu) <= dHalf && Math.abs(ln) <= dDepth) hits++;
        }
      }
      score[m.kind] += hits;
      if (m.kind === 'door' && hits) {
        for (const s of m.segs) {
          const len = Math.hypot(s.b.x - s.a.x, s.b.y - s.a.y);
          if (len > leafLen && len >= 0.5 * o.width && len <= 1.6 * o.width) { leafLen = len; leaf = { a: s.a, b: s.b }; }
        }
      }
    }
    if (score.window >= 3 && score.window >= score.door) o.kind = 'window';
    else if (score.door >= 2) { o.kind = 'door'; if (leaf) o.leaf = leaf; }
  }
  return ops;
}

// ------------------------------------------------------------------ rooms
const TYPES: [RoomType, RegExp][] = [
  ['bath', /bath|w\.?c\b|toilet|lav|حمام|دورة|مياه|bad\b|badezimmer|salle de bain|toilette|ванн|туалет|санузел/i],
  ['kitchen', /kitch|pantry|مطبخ|küche|kuche|cuisine|кухн/i],
  ['bedroom', /bed|master|نوم|schlaf|chambre|спальн/i],
  ['dining', /dining|طعام|سفر|essen|salle à manger|столов/i],
  ['living', /living|lounge|family|salon|صال|معيش|مجلس|majlis|recep|استقبال|wohn|séjour|sejour|гостин|зал/i],
  ['balcony', /balcon|terrace|بلكون|شرف|تراس|balkon|балкон|лоджи/i],
  ['hall', /corrid|hall|lobby|entr|foyer|ممر|موزع|مدخل|flur|diele|couloir|entrée|коридор|прихож|холл/i],
  ['service', /laund|غسيل|store|storage|مخزن|خادم|maid|driver|سائق|abstell|cellier|кладов|прачеч|утилит/i],
];
export function typeFromName(name: string): RoomType | null {
  for (const [t, rx] of TYPES) if (rx.test(name)) return t;
  return null;
}

function makeGrid(bounds: Box): Grid {
  const W = bounds.x1 - bounds.x0, H = bounds.y1 - bounds.y0;
  const cell = Math.max(0.04, Math.max(W, H) / 1400);
  const w = Math.ceil(W / cell) + 1, h = Math.ceil(H / cell) + 1;
  return { w, h, cell, x0: bounds.x0, y0: bounds.y0, v: new Uint8Array(w * h), room: new Int32Array(w * h) };
}

/** Visit grid cells whose centre lies in a rotated rectangle. */
function cellsIn(g: Grid, cx: number, cy: number, ux: number, uy: number, len: number, t: number, grow: number, fn: (k: number) => void) {
  const { w, h, cell } = g;
  const nx = -uy, ny = ux;
  const hl = len / 2 + grow, ht = t / 2 + grow;
  const ex = Math.abs(ux) * hl + Math.abs(nx) * ht, ey = Math.abs(uy) * hl + Math.abs(ny) * ht;
  const i0 = Math.max(0, Math.floor((cx - ex - g.x0) / cell)), i1 = Math.min(w - 1, Math.ceil((cx + ex - g.x0) / cell));
  const j0 = Math.max(0, Math.floor((cy - ey - g.y0) / cell)), j1 = Math.min(h - 1, Math.ceil((cy + ey - g.y0) / cell));
  for (let j = j0; j <= j1; j++) {
    const y = g.y0 + j * cell - cy;
    for (let i = i0; i <= i1; i++) {
      const x = g.x0 + i * cell - cx;
      if (Math.abs(x * ux + y * uy) <= hl && Math.abs(x * nx + y * ny) <= ht) fn(j * w + i);
    }
  }
}

function paintWalls(g: Grid, walls: Wall[]) {
  for (const wl of walls) cellsIn(g, wl.ox + (wl.ux * wl.len) / 2, wl.oy + (wl.uy * wl.len) / 2, wl.ux, wl.uy, wl.len, Math.max(wl.t, g.cell), g.cell * 0.3, (k) => { g.v[k] = 1; });
}

/** A real opening has no other wall running through it (collinear walls across a corridor are not a doorway). */
function keepOpening(g: Grid, o: Opening) {
  let tot = 0, hit = 0;
  cellsIn(g, o.cx, o.cy, o.ux, o.uy, Math.max(0, o.width - 0.1), o.t * 0.6, 0, (k) => { tot++; if (g.v[k] === 1) hit++; });
  return tot === 0 || hit / tot < 0.08;
}

function paintOpenings(g: Grid, ops: Opening[]) {
  for (const o of ops) {
    const val = o.kind === 'door' ? 2 : o.kind === 'window' ? 3 : 4;
    cellsIn(g, o.cx, o.cy, o.ux, o.uy, o.width + 0.02, Math.max(o.t, g.cell), g.cell * 0.3, (k) => { if (g.v[k] === 0) g.v[k] = val; });
  }
}

function floodRooms(g: Grid): number {
  const { w, h, v, room } = g;
  const stack = new Int32Array(w * h);
  const fill = (start: number, id: number) => {
    let sp = 0; stack[sp++] = start; room[start] = id;
    while (sp) {
      const k = stack[--sp];
      const x = k % w, y = (k - x) / w;
      if (x > 0) { const q = k - 1; if (!v[q] && !room[q]) { room[q] = id; stack[sp++] = q; } }
      if (x < w - 1) { const q = k + 1; if (!v[q] && !room[q]) { room[q] = id; stack[sp++] = q; } }
      if (y > 0) { const q = k - w; if (!v[q] && !room[q]) { room[q] = id; stack[sp++] = q; } }
      if (y < h - 1) { const q = k + w; if (!v[q] && !room[q]) { room[q] = id; stack[sp++] = q; } }
    }
  };
  // exterior = -1
  for (let x = 0; x < w; x++) { for (const k of [x, (h - 1) * w + x]) if (!v[k] && !room[k]) fill(k, -1); }
  for (let y = 0; y < h; y++) { for (const k of [y * w, y * w + w - 1]) if (!v[k] && !room[k]) fill(k, -1); }
  let id = 0;
  for (let k = 0; k < w * h; k++) if (!v[k] && !room[k]) fill(k, ++id);
  return id;
}

function maxRectOf(g: Grid, id: number, i0: number, j0: number, i1: number, j1: number): [number, number, number, number] {
  const W = i1 - i0 + 1;
  const hist = new Int32Array(W);
  let best = 0, bx = [0, 0, 0, 0] as [number, number, number, number];
  for (let j = j0; j <= j1; j++) {
    for (let i = 0; i < W; i++) hist[i] = g.room[j * g.w + i0 + i] === id ? hist[i] + 1 : 0;
    const st: number[] = [];
    for (let i = 0; i <= W; i++) {
      const hh = i < W ? hist[i] : 0;
      while (st.length && hist[st[st.length - 1]] >= hh) {
        const top = st.pop()!;
        const height = hist[top];
        const left = st.length ? st[st.length - 1] + 1 : 0;
        const area = height * (i - left);
        if (area > best) { best = area; bx = [i0 + left, j - height + 1, i0 + i - 1, j]; }
      }
      st.push(i);
    }
  }
  return bx;
}

export function buildPlan(flat: Flat, roles: Record<string, Role>, height = 3): Plan {
  const warnings: string[] = [];
  const wallSegs = flat.segs.filter((s) => roles[s.layer] === 'wall');
  const { walls, lines } = findWalls(wallSegs);
  const markers = collectMarkers(flat, roles);
  const openings = findOpenings(walls, markers);

  let bounds: Box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  for (const w of walls) {
    for (const p of [{ x: w.ox, y: w.oy }, { x: w.ox + w.ux * w.len, y: w.oy + w.uy * w.len }]) {
      bounds.x0 = Math.min(bounds.x0, p.x - w.t); bounds.y0 = Math.min(bounds.y0, p.y - w.t);
      bounds.x1 = Math.max(bounds.x1, p.x + w.t); bounds.y1 = Math.max(bounds.y1, p.y + w.t);
    }
  }
  if (!walls.length) { bounds = { x0: -5, y0: -5, x1: 5, y1: 5 }; warnings.push('noWalls'); }
  const pad = 1;
  const gb: Box = { x0: bounds.x0 - pad, y0: bounds.y0 - pad, x1: bounds.x1 + pad, y1: bounds.y1 + pad };
  const grid = makeGrid(gb);
  paintWalls(grid, walls);
  const kept = openings.filter((o) => keepOpening(grid, o));
  openings.length = 0;
  openings.push(...kept);
  paintOpenings(grid, openings);
  const count = floodRooms(grid);

  // per-room statistics in one pass
  const n = count + 1;
  const cells = new Int32Array(n), perim = new Int32Array(n);
  const minI = new Int32Array(n).fill(1e9), minJ = new Int32Array(n).fill(1e9), maxI = new Int32Array(n).fill(-1), maxJ = new Int32Array(n).fill(-1);
  const sx = new Float64Array(n), sy = new Float64Array(n);
  const { w, h, cell, room } = grid;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const id = room[j * w + i];
    if (id <= 0) continue;
    cells[id]++; sx[id] += i; sy[id] += j;
    if (i < minI[id]) minI[id] = i; if (i > maxI[id]) maxI[id] = i;
    if (j < minJ[id]) minJ[id] = j; if (j > maxJ[id]) maxJ[id] = j;
    const k = j * w + i;
    if (i === 0 || room[k - 1] !== id) perim[id]++;
    if (i === w - 1 || room[k + 1] !== id) perim[id]++;
    if (j === 0 || room[k - w] !== id) perim[id]++;
    if (j === h - 1 || room[k + w] !== id) perim[id]++;
  }

  const toX = (i: number) => grid.x0 + i * cell, toY = (j: number) => grid.y0 + j * cell;
  const rooms: Room[] = [];
  const remap = new Int32Array(n);
  for (let id = 1; id < n; id++) {
    const area = cells[id] * cell * cell;
    if (area < 0.8) continue;
    // floor rectangles: row runs merged downward
    const rects: Rect[] = [];
    let open = new Map<string, Rect>();
    for (let j = minJ[id]; j <= maxJ[id] + 1; j++) {
      const runs: [number, number][] = [];
      if (j <= maxJ[id]) {
        let s = -1;
        for (let i = minI[id]; i <= maxI[id] + 1; i++) {
          const inside = i <= maxI[id] && room[j * w + i] === id;
          if (inside && s < 0) s = i;
          if (!inside && s >= 0) { runs.push([s, i - 1]); s = -1; }
        }
      }
      const next = new Map<string, Rect>();
      for (const [a, b] of runs) {
        const key = a + ':' + b;
        const r = open.get(key);
        if (r) { r.y1 = toY(j) + cell / 2; next.set(key, r); open.delete(key); }
        else next.set(key, { x0: toX(a) - cell / 2, y0: toY(j) - cell / 2, x1: toX(b) + cell / 2, y1: toY(j) + cell / 2 });
      }
      for (const r of open.values()) rects.push(r);
      open = next;
    }
    for (const r of open.values()) rects.push(r);
    const mr = maxRectOf(grid, id, minI[id], minJ[id], maxI[id], maxJ[id]);
    const room0: Room = {
      id: rooms.length + 1, name: '', labeled: false, type: 'room',
      area, perimeter: perim[id] * cell,
      center: { x: toX(sx[id] / cells[id]), y: toY(sy[id] / cells[id]) },
      rects,
      maxRect: { x0: toX(mr[0]) - cell / 2, y0: toY(mr[1]) - cell / 2, x1: toX(mr[2]) + cell / 2, y1: toY(mr[3]) + cell / 2 },
      doors: 0, windows: 0, openingWidth: 0, openingArea: 0,
    };
    remap[id] = room0.id;
    rooms.push(room0);
  }
  for (let k = 0; k < room.length; k++) room[k] = room[k] > 0 ? remap[room[k]] || 0 : room[k];

  const roomAt = (p: P) => {
    const i = Math.round((p.x - grid.x0) / cell), j = Math.round((p.y - grid.y0) / cell);
    if (i < 0 || j < 0 || i >= w || j >= h) return 0;
    return room[j * w + i];
  };

  // labels from text
  const junk = /^[\d\s.,:x×*²³m+\-=()/\\%]+$|^\d|m2|m²|sqm|م2|م²/i;
  for (const t of flat.texts) {
    const s = t.text.trim();
    if (!s || s.length > 40 || junk.test(s)) continue;
    const r = rooms.find((x) => x.id === roomAt(t.p));
    if (!r) continue;
    const ty = typeFromName(s);
    if (!r.labeled || (ty && r.type === 'room')) { r.name = s; r.labeled = true; if (ty) r.type = ty; }
  }
  for (const r of rooms) {
    if (r.labeled) continue;
    const mw = Math.min(r.maxRect.x1 - r.maxRect.x0, r.maxRect.y1 - r.maxRect.y0);
    r.type = mw < 1.5 && r.area < 15 ? 'hall' : r.area < 4.5 ? 'bath' : 'room';
  }

  // openings per room
  for (const o of openings) {
    const nx = -o.uy, ny = o.ux, off = o.t / 2 + 0.12;
    const hOpen = o.kind === 'window' ? 1.3 : o.kind === 'door' ? 2.1 : Math.min(2.4, height);
    const seen = new Set<number>();
    for (const s of [-1, 1]) {
      const id = roomAt({ x: o.cx + nx * off * s, y: o.cy + ny * off * s });
      const r = id > 0 && !seen.has(id) ? rooms[id - 1] : null;
      if (!r) continue;
      seen.add(id);
      if (o.kind === 'door') r.doors++;
      if (o.kind === 'window') r.windows++;
      r.openingWidth += o.kind === 'window' ? 0 : o.width;
      r.openingArea += o.width * hOpen;
    }
  }
  if (walls.length && !rooms.length) warnings.push('noRooms');
  return { walls, openings, rooms, bounds, grid, height, warnings, stats: { lines, markers: markers.length } };
}
