// Plan designer engine: from a land and a programme (villa, duplex, apartment building …)
// to an editable concept floor plan per floor.
//
// A floor is a slicing tree: every split cuts its rectangle along x or y into weighted parts,
// every leaf is a room. That keeps the plan editable (drag any dividing wall, split, merge, swap)
// while walls, doors and windows are derived again from the rectangles after every edit.
// Coordinates are metres, x to the right, y away from the street (the street is at y = 0).

export type Kind =
  | 'entrance' | 'hall' | 'living' | 'majlis' | 'ladies' | 'dining' | 'kitchen'
  | 'master' | 'bedroom' | 'guest' | 'bath' | 'wc' | 'dress' | 'maid' | 'driver'
  | 'laundry' | 'store' | 'office' | 'prayer' | 'stair' | 'lift' | 'landing'
  | 'shop' | 'parking' | 'terrace' | 'void';

export const KINDS: Kind[] = ['entrance', 'hall', 'living', 'majlis', 'ladies', 'dining', 'kitchen', 'master', 'bedroom', 'guest', 'bath', 'wc', 'dress', 'maid', 'driver', 'laundry', 'store', 'office', 'prayer', 'stair', 'lift', 'landing', 'shop', 'parking', 'terrace', 'void'];

export type Rect = { x0: number; y0: number; x1: number; y1: number };
export type Axis = 'x' | 'y';
export type Leaf = { t: 'room'; id: string; kind: Kind; name?: string; unit: string; parent?: string };
export type Split = { t: 'split'; id: string; axis: Axis; kids: Node[]; w: number[] };
export type Node = Leaf | Split;

export type FloorKey = 'ground' | 'upper' | 'typical' | 'roof';
export type Floor = { id: string; key: FloorKey; level: number; repeat: number; rect: Rect; root: Node };

export type BuildingType = 'villa' | 'duplex' | 'building' | 'mixed' | 'istiraha';
export type Brief = {
  type: BuildingType;
  land: { w: number; d: number; streets: number; streetW: number };
  setback: { front: number; back: number; side: number };
  villa: {
    floors: number; roof: boolean; bedrooms: number; masters: number; ensuiteAll: boolean; baths: number;
    majlis: boolean; ladies: boolean; dining: boolean; kitchen: 'closed' | 'open';
    maid: boolean; driver: boolean; laundry: boolean; store: boolean; office: boolean; guestBed: boolean; prayer: boolean; lift: boolean;
  };
  bld: { floors: number; perFloor: number; beds: number; majlis: boolean; maid: boolean; ground: 'parking' | 'shops' | 'apartments'; roof: boolean; lift: boolean };
};

export type Project = { brief: Brief; land: Rect; build: Rect; floors: Floor[]; seq: number; warnings: string[] };

export const T_EXT = 0.25, T_INT = 0.15;
const STAIR_LEN = 4.2, STAIR_W = 2.6, LIFT_LEN = 2.1, CORE_W = 2.8;

/** Typical net areas (m²) used as starting weights. */
export const AREA: Record<Kind, number> = {
  entrance: 6, hall: 14, living: 26, majlis: 30, ladies: 24, dining: 18, kitchen: 15, master: 22, bedroom: 16, guest: 15,
  bath: 5, wc: 3, dress: 5, maid: 11, driver: 11, laundry: 6, store: 4, office: 12, prayer: 8, stair: 11, lift: 5, landing: 10,
  shop: 40, parking: 60, terrace: 20, void: 6,
};
/** Minimum sensible width of a room (m), used for warnings. */
const MIN_W: Partial<Record<Kind, number>> = { master: 3.4, bedroom: 3, guest: 3, majlis: 3.8, ladies: 3.6, living: 3.6, dining: 3, kitchen: 2.4, maid: 2.4, driver: 2.4, office: 2.6 };

export const CIRC = new Set<Kind>(['entrance', 'hall', 'landing', 'living', 'dining']);
const PASSAGE = new Set<Kind>(['entrance', 'hall', 'landing', 'living', 'dining']);
const WET = new Set<Kind>(['bath', 'wc', 'laundry']);

export const defaultBrief = (): Brief => ({
  type: 'villa',
  land: { w: 20, d: 25, streets: 1, streetW: 15 },
  setback: { front: 3, back: 2, side: 2 },
  villa: { floors: 2, roof: true, bedrooms: 5, masters: 1, ensuiteAll: true, baths: 1, majlis: true, ladies: true, dining: true, kitchen: 'closed', maid: true, driver: false, laundry: true, store: true, office: false, guestBed: false, prayer: false, lift: false },
  bld: { floors: 3, perFloor: 2, beds: 3, majlis: true, maid: false, ground: 'parking', roof: true, lift: true },
});

/** Saudi rule of thumb: front setback one fifth of the street width, at least 2 m and at most 6 m. */
export const frontSetback = (streetW: number) => Math.round(Math.min(6, Math.max(2, streetW / 5)) * 10) / 10;

// ------------------------------------------------------------------ tree helpers
type Ctx = { seq: number };
const nid = (c: Ctx) => 'n' + (c.seq++).toString(36);
const leaf = (c: Ctx, kind: Kind, unit: string, parent?: string): Leaf => ({ t: 'room', id: nid(c), kind, unit, ...(parent ? { parent } : {}) });
const split = (c: Ctx, axis: Axis, kids: Node[], w: number[]): Node => (kids.length === 1 ? kids[0] : { t: 'split', id: nid(c), axis, kids, w });
const other = (a: Axis): Axis => (a === 'x' ? 'y' : 'x');
const size = (r: Rect, a: Axis) => (a === 'x' ? r.x1 - r.x0 : r.y1 - r.y0);

export function layout(node: Node, r: Rect, out = new Map<string, Rect>()): Map<string, Rect> {
  if (node.t === 'room') { out.set(node.id, r); return out; }
  const tot = node.w.reduce((a, b) => a + b, 0) || 1;
  let p = node.axis === 'x' ? r.x0 : r.y0;
  const L = size(r, node.axis);
  node.kids.forEach((k, i) => {
    const q = i === node.kids.length - 1 ? (node.axis === 'x' ? r.x1 : r.y1) : p + (L * node.w[i]) / tot;
    layout(k, node.axis === 'x' ? { x0: p, y0: r.y0, x1: q, y1: r.y1 } : { x0: r.x0, y0: p, x1: r.x1, y1: q }, out);
    p = q;
  });
  return out;
}

export function leaves(node: Node, out: Leaf[] = []): Leaf[] {
  if (node.t === 'room') out.push(node);
  else node.kids.forEach((k) => leaves(k, out));
  return out;
}

export function findParent(root: Node, id: string): { parent: Split; index: number } | null {
  if (root.t === 'room') return null;
  for (let i = 0; i < root.kids.length; i++) {
    const k = root.kids[i];
    if (k.id === id) return { parent: root, index: i };
    const f = findParent(k, id);
    if (f) return f;
  }
  return null;
}

// ------------------------------------------------------------------ unit generator
type Side = 'S' | 'N' | 'W' | 'E';
type Item = { kind: Kind; area: number; group: number; parentIdx?: number; near?: boolean };

/** Builds a list of items; children (ensuite, dressing) stay next to their room. */
class Prog {
  items: Item[] = [];
  private g = 0;
  add(kind: Kind, opts: { area?: number; near?: boolean; kids?: [Kind, number?][] } = {}) {
    const group = this.g++;
    const idx = this.items.length;
    this.items.push({ kind, area: opts.area ?? AREA[kind], group, near: opts.near });
    for (const [k, a] of opts.kids || []) this.items.push({ kind: k, area: a ?? AREA[k], group, parentIdx: idx });
    return this;
  }
  get area() { return this.items.reduce((s, i) => s + i.area, 0); }
}

type UnitOpts = { unit: string; entrance: Side | null; stair: boolean; lift: boolean; band?: number; vestibule?: boolean; fill?: Kind; blind?: Side[] };
type Shape = { mode: 'perp' | 'para'; strips: 1 | 2; band: number; depth: number };

/** Choose band direction and number of room strips so rooms get a sensible depth. */
const OPP: Record<Side, Side> = { S: 'N', N: 'S', W: 'E', E: 'W' };

/** Outer sides of the room strips for a shape (the side each strip gets its windows from). */
function stripSides(side: Side, sh: Pick<Shape, 'mode' | 'strips'>, blind: Side[]): Side[] {
  const ns = side === 'S' || side === 'N';
  if (sh.mode === 'para') return sh.strips === 2 ? [side, OPP[side]] : [OPP[side]];
  const lo: Side = ns ? 'W' : 'S', hi: Side = ns ? 'E' : 'N';
  if (sh.strips === 2) return [lo, hi];
  return [blind.includes(lo) && !blind.includes(hi) ? hi : lo];
}

function chooseShape(r: Rect, side: Side, band: number, needLen: number, blind: Side[] = [], items: Item[] = []): Shape {
  const ns = side === 'S' || side === 'N';
  const Lp = ns ? r.x1 - r.x0 : r.y1 - r.y0; // parallel to the entrance side
  const Ld = ns ? r.y1 - r.y0 : r.x1 - r.x0;
  const cands: Shape[] = [
    { mode: 'para', strips: 2, band, depth: (Ld - band) / 2 },
    { mode: 'perp', strips: 2, band, depth: (Lp - band) / 2 },
    { mode: 'para', strips: 1, band, depth: Ld - band },
    { mode: 'perp', strips: 1, band, depth: Lp - band },
  ];
  const score = (c: Shape) => {
    const bandLen = c.mode === 'para' ? Lp : Ld;
    let s = Math.abs(c.depth - 4.8);
    if (c.depth < 2.8) s += 20;
    if (c.depth > 7) s += (c.depth - 7) * 2.5;
    if (bandLen < needLen) s += 15;
    if (c.strips === 1) s += 0.6;
    if (c.mode === 'para') s -= 0.3; // a hall parallel to the street reads better
    // rooms get narrow when a long programme shares a short strip
    const tot = items.reduce((a, i) => a + i.area, 0) || 1;
    for (const it of items) {
      const m = MIN_W[it.kind];
      if (!m || it.parentIdx !== undefined) continue;
      const w = (bandLen * it.area) / (tot / c.strips);
      if (w < m) s += Math.min(4, (m - w) * 3);
    }
    // a strip whose outer wall is shared (core, neighbour flat) gets no windows; fine for service rooms
    const service = items.filter((i) => SERVICE.has(i.kind) && i.parentIdx === undefined).reduce((a, i) => a + i.area, 0);
    for (const sd of stripSides(side, c, blind)) if (blind.includes(sd)) s += c.strips === 2 ? 8 * Math.max(0.2, 1 - service / (tot / 2)) : 8;
    return s;
  };
  return cands.sort((a, b) => score(a) - score(b))[0];
}

const SMALL = new Set<Kind>(['wc', 'bath', 'store', 'laundry', 'dress']);
const SERVICE = new Set<Kind>(['kitchen', 'wc', 'bath', 'store', 'laundry', 'dress', 'dining']);
type Col = { main: Item; kids: Item[]; band?: Item };

/**
 * Rooms of one strip, laid along the band. A room's ensuite and dressing go in a narrow column
 * beside it, stacked across the strip (outside wall first, so bathrooms get a window); a lone small
 * room (guest WC, store, shared bath) takes the hall end of a neighbour's column so it still opens
 * onto the hall.
 */
function stripNode(c: Ctx, axis: Axis, items: Item[], unit: string, reverse: boolean, ids: Map<Item, Leaf>, depth: number, extFirst: boolean): Node {
  const cross = other(axis);
  const cols: Col[] = [];
  const loose: Item[] = [];
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (it.parentIdx !== undefined) continue;
    const kids = items.filter((k) => k.parentIdx !== undefined && items.indexOf(k) > i && k.group === it.group);
    if (!kids.length && SMALL.has(it.kind) && it.area < 7.5 && it.group >= 0) { loose.push(it); cols.push({ main: it, kids: [] }); continue; }
    cols.push({ main: it, kids });
  }
  // attach loose small rooms to a neighbour column that has room for them
  for (const s of loose) {
    const at = cols.findIndex((x) => x.main === s);
    const ok = (x?: Col) => x && x.main !== s && !loose.includes(x.main) && !x.band && x.main.area >= 12 && x.kids.length <= 1;
    const host = ok(cols[at - 1]) ? cols[at - 1] : ok(cols[at + 1]) ? cols[at + 1] : null;
    if (host) { host.band = s; cols.splice(at, 1); }
  }
  const list = reverse ? cols.slice().reverse() : cols;
  const nodes: Node[] = [], ws: number[] = [];
  for (const col of list) {
    const m = leaf(c, col.main.kind, unit);
    ids.set(col.main, m);
    if (!col.kids.length && !col.band) { nodes.push(m); ws.push(Math.max(0.5, col.main.area)); continue; }
    const subItems = [...col.kids];
    const subArea = subItems.reduce((s, k) => s + k.area, 0) + (col.band ? col.band.area : 0);
    const subW = Math.max(col.main.area < 14 ? 1.4 : 1.6, Math.min(2.8, subArea / depth));
    const parts: { n: Node; w: number }[] = col.kids.map((k) => { const l = leaf(c, k.kind, unit); ids.set(k, l); return { n: l, w: k.area }; });
    const free = subW * depth - subArea;
    if (free > 1.6) {
      const filler = ['master', 'bedroom', 'guest'].includes(col.main.kind) && !col.kids.some((k) => k.kind === 'dress') ? 'dress' : 'store';
      const l = leaf(c, filler, unit, filler === 'dress' ? m.id : undefined);
      parts.push({ n: l, w: free });
    }
    if (col.band) { const l = leaf(c, col.band.kind, unit); ids.set(col.band, l); parts.push({ n: l, w: col.band.area }); }
    // parts run from the outside wall to the hall
    if (!extFirst) parts.reverse();
    const sub = split(c, cross, parts.map((p) => p.n), parts.map((p) => p.w));
    const pair = reverse ? [sub, m] : [m, sub];
    nodes.push(split(c, axis, pair, reverse ? [subW * depth, col.main.area] : [col.main.area, subW * depth]));
    ws.push(col.main.area + subW * depth);
  }
  return split(c, axis, nodes, ws);
}

function genUnit(c: Ctx, r: Rect, prog: Prog, o: UnitOpts): Node {
  const side = o.entrance || 'S';
  const band = o.band ?? (o.stair ? STAIR_W : 1.7);
  const needLen = (o.stair ? STAIR_LEN : 0) + (o.lift ? LIFT_LEN : 0) + 2;
  const blind = o.blind || [];
  const sh = chooseShape(r, side, band, needLen, blind, prog.items);
  const ns = side === 'S' || side === 'N';
  // axes in world terms
  const bandAxis: Axis = sh.mode === 'para' ? (ns ? 'x' : 'y') : (ns ? 'y' : 'x');
  const crossAxis = other(bandAxis);
  // along the band, "from the entrance end" is reversed when the entrance is on the high side
  const revAlong = sh.mode === 'perp' && (side === 'N' || side === 'E');
  const revCross = sh.mode === 'para' && (side === 'N' || side === 'E');
  const bandLen = size(r, bandAxis);
  const depthTot = size(r, crossAxis);

  // --- band: hall + stair + lift
  const bandKids: { n: Node; w: number }[] = [];
  const hallW = Math.max(1.5, bandLen - (o.stair ? STAIR_LEN : 0) - (o.lift ? LIFT_LEN : 0));
  const hall = leaf(c, 'hall', o.unit);
  if (sh.mode === 'perp') {
    bandKids.push({ n: hall, w: hallW });
    if (o.lift) bandKids.push({ n: leaf(c, 'lift', o.unit), w: LIFT_LEN });
    if (o.stair) bandKids.push({ n: leaf(c, 'stair', o.unit), w: STAIR_LEN });
  } else {
    if (o.stair) bandKids.push({ n: leaf(c, 'stair', o.unit), w: STAIR_LEN });
    if (o.lift) bandKids.push({ n: leaf(c, 'lift', o.unit), w: LIFT_LEN });
    bandKids.push({ n: hall, w: hallW });
  }
  if (revAlong) bandKids.reverse();
  const bandNode = split(c, bandAxis, bandKids.map((k) => k.n), bandKids.map((k) => k.w));

  // --- assign items to strips
  const items = prog.items.slice();
  const groups: Item[][] = [];
  for (const it of items) (groups[it.group] ||= []).push(it);
  const gl = groups.filter(Boolean);
  const stripCap = bandLen * (sh.strips === 2 ? (depthTot - band) / 2 : depthTot - band);
  const A: Item[] = [], B: Item[] = [];
  const outer = stripSides(side, sh, blind);
  const blindA = sh.strips === 2 && blind.includes(outer[0]) && !blind.includes(outer[1]);
  const blindB = sh.strips === 2 && blind.includes(outer[1]) && !blind.includes(outer[0]);
  if (sh.strips === 1) gl.forEach((g) => A.push(...g));
  else if (blindA || blindB) {
    // service rooms against the shared wall, rooms that need daylight on the outside
    const svc = gl.filter((g) => SERVICE.has(g[0].kind) && g.length === 1);
    const day = gl.filter((g) => !svc.includes(g));
    // the outside strip should not get deeper than ~6 m: move the rooms that need daylight least
    const free = depthTot - band;
    const area = (l: Item[][]) => l.reduce((q, g) => q + g.reduce((a, i) => a + i.area, 0), 0);
    const ORDER: Kind[] = ['dining', 'office', 'prayer', 'majlis', 'guest', 'living', 'bedroom', 'master'];
    while (day.length > 2 && !o.stair) {
      const tot = area(day) + area(svc);
      const dDay = (free * area(day)) / tot;
      if (dDay <= 6.2) break;
      let pick = -1;
      for (const k of ORDER) { pick = day.findIndex((g) => g[0].kind === k); if (pick >= 0) break; }
      if (pick < 0) break;
      svc.push(...day.splice(pick, 1));
    }
    (blindA ? A : B).push(...svc.flat());
    (blindA ? B : A).push(...day.flat());
  } else if (sh.mode === 'para') {
    // near strip: public rooms first, the rest goes to the far strip, then balance
    const area = (l: Item[]) => l.reduce((s, i) => s + i.area, 0);
    const near = gl.filter((g) => g[0].near), far = gl.filter((g) => !g[0].near);
    const nA: Item[][] = [...near], fB: Item[][] = [...far];
    const tot = area(items);
    // move groups so each strip holds about half of the area
    while (fB.length > 1 && area(nA.flat()) < tot / 2 - 4) {
      const g = fB.shift()!;
      if (area(nA.flat()) + area(g) > tot / 2 + area(g) / 2) { fB.unshift(g); break; }
      nA.push(g);
    }
    while (nA.length > 1 && area(nA.flat()) > tot / 2 + 6) {
      const g = nA.pop()!;
      fB.unshift(g);
    }
    nA.forEach((g) => A.push(...g));
    fB.forEach((g) => B.push(...g));
  } else {
    let fa = 0, fb = 0;
    for (const g of gl) {
      const a = g.reduce((s, i) => s + i.area, 0);
      if (fa <= fb) { A.push(...g); fa += a; } else { B.push(...g); fb += a; }
    }
  }
  // the entrance vestibule sits in the middle of the near strip (para, two strips, front door)
  if (o.vestibule && sh.mode === 'para' && sh.strips === 2) {
    const v: Item = { kind: 'entrance', area: 2.4 * ((depthTot - band) / 2), group: -1 };
    let acc = 0, at = 0;
    const tot = A.reduce((s, i) => s + i.area, 0);
    for (let i = 0; i < A.length; i++) {
      acc += A[i].area;
      if (acc >= tot / 2 && (i === A.length - 1 || A[i + 1].group !== A[i].group)) { at = i + 1; break; }
    }
    A.splice(at, 0, v);
  }
  // free space: fill so rooms don't get stretched (roof terrace)
  const fillStrip = (S: Item[]) => {
    if (!o.fill) return;
    const a = S.reduce((s, i) => s + i.area, 0);
    if (stripCap - a > 4) S.push({ kind: o.fill, area: stripCap - a, group: -2 });
  };
  fillStrip(A);
  if (sh.strips === 2) fillStrip(B);

  const ids = new Map<Item, Leaf>();
  const dStrip = sh.strips === 2 ? (depthTot - band) / 2 : depthTot - band;
  // single strip: the band goes against a shared wall when there is one
  const lowSide: Side = crossAxis === 'x' ? 'W' : 'S', highSide: Side = crossAxis === 'x' ? 'E' : 'N';
  const flip1 = sh.strips === 1 && sh.mode === 'perp' && blind.includes(highSide) && !blind.includes(lowSide);
  const extA = sh.strips === 2 ? !revCross : flip1 ? true : revCross;
  const sA = A.length ? stripNode(c, bandAxis, A, o.unit, revAlong, ids, dStrip, extA) : leaf(c, o.fill || 'living', o.unit);
  const sB = sh.strips === 2 ? (B.length ? stripNode(c, bandAxis, B, o.unit, revAlong, ids, dStrip, revCross) : leaf(c, o.fill || 'living', o.unit)) : null;
  // parents
  for (const it of items) {
    if (it.parentIdx === undefined) continue;
    const me = ids.get(it), p = ids.get(items[it.parentIdx]);
    if (me && p) me.parent = p.id;
  }
  // cross order: [near strip, band, far strip] (para) — perp: [A, band, B]
  let cross: { n: Node; w: number }[];
  if (sh.strips === 2) {
    const d = (depthTot - band) / 2;
    let dA = d, dB = d;
    if (!o.stair && (blindA || blindB)) {
      const aA = A.reduce((q, i) => q + i.area, 0), aB = B.reduce((q, i) => q + i.area, 0);
      dA = Math.max(2.4, Math.min(depthTot - band - 2.4, ((depthTot - band) * aA) / (aA + aB || 1)));
      dB = depthTot - band - dA;
    }
    cross = [{ n: sA, w: dA }, { n: bandNode, w: band }, { n: sB!, w: dB }];
  } else {
    // para-1: band on the entrance side; perp-1: band on one side
    cross = [{ n: bandNode, w: band }, { n: sA, w: depthTot - band }];
    if (flip1) cross.reverse();
  }
  if (revCross) cross.reverse();
  return split(c, crossAxis, cross.map((k) => k.n), cross.map((k) => k.w));
}

// ------------------------------------------------------------------ programmes
function villaGround(b: Brief['villa'], single: boolean, small: boolean): Prog {
  const p = new Prog();
  if (b.majlis) p.add('majlis', { near: true, area: small ? 22 : 30, kids: [['wc', 3]] });
  if (b.ladies) p.add('ladies', { near: true, area: small ? 18 : 24 });
  if (b.office) p.add('office', { near: true });
  p.add('wc', { near: true, area: 3 });
  if (b.dining) p.add('dining');
  p.add('living', { area: single ? 28 : 24 });
  p.add('kitchen', { area: b.kitchen === 'open' ? 18 : 15 });
  if (b.maid) p.add('maid', { kids: [['bath', 3.5]] });
  if (b.driver) p.add('driver', { kids: [['bath', 3.5]] });
  if (b.laundry) p.add('laundry');
  if (b.store) p.add('store');
  if (b.prayer) p.add('prayer');
  if (b.guestBed) p.add('guest', { kids: [['bath', 4.5]] });
  return p;
}

function addBedrooms(p: Prog, n: number, masters: number, ensuiteAll: boolean, shared: number) {
  for (let i = 0; i < n; i++) {
    if (i < masters) p.add('master', { kids: [['bath', 7], ['dress', 5]] });
    else if (ensuiteAll) p.add('bedroom', { kids: [['bath', 4.5]] });
    else p.add('bedroom');
  }
  const need = ensuiteAll ? shared : Math.max(shared, n - masters > 0 ? 1 : 0);
  for (let i = 0; i < need; i++) p.add('bath', { area: 4.5 });
}

function apartmentProg(b: Brief['bld']): Prog {
  const p = new Prog();
  if (b.majlis) p.add('majlis', { area: 18, near: true });
  p.add('living', { area: 22, near: true });
  if (b.majlis) p.add('wc', { area: 2.5, near: true });
  p.add('kitchen', { area: 10 });
  if (b.beds >= 3) p.add('dining', { area: 12 });
  if (b.maid) p.add('maid', { area: 7, kids: [['bath', 3]] });
  for (let i = 0; i < b.beds; i++) {
    if (i === 0) p.add('master', { area: 17, kids: [['bath', 5]] });
    else p.add('bedroom', { area: 13 });
  }
  if (b.beds > 1) p.add('bath', { area: 4.2 });
  if (b.beds >= 4) p.add('bath', { area: 4 });
  return p;
}

// ------------------------------------------------------------------ project generator
export function generate(brief: Brief): Project {
  const c: Ctx = { seq: 1 };
  const warnings: string[] = [];
  const L = brief.land;
  const sb = brief.setback;
  const land: Rect = { x0: 0, y0: 0, x1: L.w, y1: L.d };
  const build: Rect = { x0: sb.side, y0: sb.front, x1: L.w - sb.side, y1: L.d - sb.back };
  const BW = build.x1 - build.x0, BD = build.y1 - build.y0;
  const floors: Floor[] = [];
  if (BW < 6 || BD < 6) {
    warnings.push('tooSmall');
    return { brief, land, build, floors, seq: c.seq, warnings };
  }

  if (brief.type === 'villa' || brief.type === 'istiraha' || brief.type === 'duplex') {
    const v = brief.villa;
    const isIst = brief.type === 'istiraha';
    const nUp = isIst ? 0 : Math.max(0, Math.min(3, v.floors - 1));
    const units = brief.type === 'duplex' ? 2 : 1;
    const unitW = BW / units;
    const stair = nUp > 0 || (v.roof && !isIst);
    const lift = v.lift && stair;
    // programmes per floor (per unit)
    const ground = isIst ? istirahaProg(v) : villaGround(v, nUp === 0, unitW < 11);
    const ups: Prog[] = [];
    if (nUp === 0) {
      if (!isIst) addBedrooms(ground, v.bedrooms, v.masters, v.ensuiteAll, v.baths);
    } else {
      const per = Array.from({ length: nUp }, (_, i) => Math.floor(v.bedrooms / nUp) + (i < v.bedrooms % nUp ? 1 : 0));
      let mLeft = v.masters;
      per.forEach((n) => {
        const p = new Prog();
        p.add('living', { area: 20 });
        const m = Math.min(mLeft, n);
        mLeft -= m;
        addBedrooms(p, n, m, v.ensuiteAll, v.baths);
        ups.push(p);
      });
    }
    // footprint: as wide as allowed, as deep as the largest floor needs
    const bandArea = (w: number) => (stair ? STAIR_W : 1.7) * w;
    const need = Math.max(ground.area, ...ups.map((p) => p.area));
    let fw = unitW;
    let fd = Math.min(BD, Math.max(2 * 3.6 + STAIR_W, (need * 1.12) / fw + bandArea(fw) / fw));
    if (fd >= BD - 0.01 && need * 1.12 + bandArea(fw) > fw * BD * 1.05) warnings.push('tight');
    if (fd <= 2 * 3.6 + STAIR_W + 0.01 && units === 1) {
      fw = Math.min(unitW, Math.max(9, (need * 1.12 + bandArea(fw)) / fd));
    }
    const fwTot = fw * units;
    const x0 = build.x0 + (BW - fwTot) / 2;
    const foot: Rect = { x0, y0: build.y0, x1: x0 + fwTot, y1: build.y0 + fd };
    const unitRect = (i: number): Rect => ({ x0: foot.x0 + i * fw, y0: foot.y0, x1: foot.x0 + (i + 1) * fw, y1: foot.y1 });
    const mk = (prog: Prog, uopts: Omit<UnitOpts, 'unit'>) => {
      if (units === 1) return genUnit(c, foot, prog, { ...uopts, unit: 'A' });
      const a = genUnit(c, unitRect(0), prog, { ...uopts, unit: 'A', blind: ['E'] });
      const b = mirrorX(c, genUnit(c, unitRect(0), prog, { ...uopts, unit: 'B', blind: ['E'] }));
      return split(c, 'x', [a, b], [1, 1]);
    };
    floors.push({ id: nid(c), key: 'ground', level: 0, repeat: 1, rect: foot, root: mk(ground, { entrance: 'S', stair, lift, vestibule: true }) });
    ups.forEach((p, i) => floors.push({ id: nid(c), key: 'upper', level: i + 1, repeat: 1, rect: foot, root: mk(p, { entrance: 'S', stair, lift }) }));
    if (v.roof && !isIst) {
      const p = new Prog();
      p.add('majlis', { area: 20 });
      p.add('wc', { area: 3 });
      p.add('laundry', { area: 6 });
      floors.push({ id: nid(c), key: 'roof', level: nUp + 1, repeat: 1, rect: foot, root: mk(p, { entrance: 'S', stair, lift, fill: 'terrace' }) });
    }
  } else {
    // apartment buildings: a core column (landing, stair, lift) and apartments that all touch the landing
    const b = brief.bld;
    let n = Math.max(1, Math.min(4, b.perFloor));
    const foot: Rect = { ...build };
    const coreW = CORE_W;
    const ground = brief.type === 'mixed' ? 'shops' : b.ground;
    const lift = b.lift;
    const sideW = (BW - coreW) / 2;
    // side by side needs room for two apartments next to a central core
    if (n >= 3 && sideW < 7) { n = 2; warnings.push('perFloor'); }
    const centre = n >= 3 || (n === 2 && sideW >= 7);
    const stacked = (centre && n >= 3) || (!centre && n >= 2); // front and back apartments
    if (!centre && n > 2) n = 2;
    const coreX = centre ? (foot.x0 + foot.x1) / 2 - coreW / 2 : foot.x0;
    const cutY = (foot.y0 + foot.y1) / 2;
    const LAND = 3.6;
    const lan0 = cutY - LAND / 2; // the landing sits mid-depth, where the apartments' halls start
    const lan1 = lan0 + LAND;
    const st1 = lan1 + STAIR_LEN, li1 = st1 + (lift ? LIFT_LEN : 0);
    const core = (groundFloor: boolean, preUnit: string, postUnit: string): Node => {
      const parts: { n: Node; w: number }[] = [];
      const pre = lan0 - foot.y0;
      if (pre > 0.05) parts.push(groundFloor ? { n: leaf(c, 'landing', 'C'), w: pre } : { n: pre > 4 ? leaf(c, 'void', 'C') : leaf(c, 'store', preUnit), w: pre });
      parts.push({ n: leaf(c, 'landing', 'C'), w: LAND }, { n: leaf(c, 'stair', 'C'), w: STAIR_LEN });
      if (lift) parts.push({ n: leaf(c, 'lift', 'C'), w: LIFT_LEN });
      const rest = foot.y1 - li1;
      if (rest > 1.4) parts.push({ n: leaf(c, rest > 4 ? 'void' : 'store', rest > 4 ? 'C' : postUnit), w: rest });
      else parts[parts.length - 1].w += Math.max(0, rest);
      return split(c, 'y', parts.map((p) => p.n), parts.map((p) => p.w));
    };
    const leftR: Rect = { x0: foot.x0, y0: foot.y0, x1: coreX, y1: foot.y1 };
    const rightR: Rect = { x0: coreX + coreW, y0: foot.y0, x1: foot.x1, y1: foot.y1 };
    let ui = 0;
    const apt = (r: Rect, side: Side, blind: Side[]) => genUnit(c, r, apartmentProg(b), { unit: 'A' + ++ui, entrance: side, stair: false, lift: false, blind: [side, ...blind] });
    const column = (r: Rect, side: Side, count: number): Node => {
      if (count <= 1) return apt(r, side, []);
      const f = apt({ ...r, y1: cutY }, side, ['N']);
      const k = apt({ ...r, y0: cutY }, side, ['S']);
      return split(c, 'y', [f, k], [cutY - r.y0, r.y1 - cutY]);
    };
    const typical = (groundFloor = false): Node => {
      ui = 0;
      if (!centre) return split(c, 'x', [core(groundFloor, 'A1', n >= 2 ? 'A2' : 'A1'), column(rightR, 'W', n)], [coreW, rightR.x1 - rightR.x0]);
      const left = column(leftR, 'E', n >= 3 ? 2 : 1);
      const leftUnits = ui;
      const right = column(rightR, 'W', n >= 4 ? 2 : 1);
      return split(c, 'x', [left, core(groundFloor, 'A1', 'A' + (leftUnits)), right], [leftR.x1 - leftR.x0, coreW, rightR.x1 - rightR.x0]);
    };
    const groundNode = (): Node => {
      if (ground === 'apartments') return typical(true);
      const fillSide = (r: Rect, unitBase: string): Node => {
        if (ground === 'parking') return leaf(c, 'parking', 'P');
        const k = Math.max(1, Math.round((r.x1 - r.x0) / 5.5));
        const shops = Array.from({ length: k }, (_, i) => leaf(c, 'shop', unitBase + (i + 1)));
        return split(c, 'x', shops, shops.map(() => 1));
      };
      if (!centre) return split(c, 'x', [core(true, 'P', 'P'), fillSide(rightR, 'S')], [coreW, rightR.x1 - rightR.x0]);
      return split(c, 'x', [fillSide(leftR, 'S'), core(true, 'P', 'P'), fillSide(rightR, 'T')], [leftR.x1 - leftR.x0, coreW, rightR.x1 - rightR.x0]);
    };
    floors.push({ id: nid(c), key: 'ground', level: 0, repeat: 1, rect: foot, root: groundNode() });
    floors.push({ id: nid(c), key: 'typical', level: 1, repeat: Math.max(1, b.floors), rect: foot, root: typical() });
    if (b.roof) {
      const p = new Prog();
      p.add('majlis', { area: 22 });
      p.add('wc', { area: 3 });
      p.add('laundry', { area: 8 });
      const annexR: Rect = stacked ? { ...rightR, y1: cutY } : rightR;
      const annex = genUnit(c, annexR, p, { unit: 'R', entrance: 'W', stair: false, lift: false, fill: 'terrace' });
      const rightNode = stacked ? split(c, 'y', [annex, leaf(c, 'terrace', 'R')], [cutY - rightR.y0, rightR.y1 - cutY]) : annex;
      const root = !centre
        ? split(c, 'x', [core(false, 'R', 'R'), rightNode], [coreW, rightR.x1 - rightR.x0])
        : split(c, 'x', [leaf(c, 'terrace', 'R'), core(false, 'R', 'R'), rightNode], [leftR.x1 - leftR.x0, coreW, rightR.x1 - rightR.x0]);
      floors.push({ id: nid(c), key: 'roof', level: 2, repeat: 1, rect: foot, root });
    }
  }
  const p: Project = { brief, land, build, floors, seq: c.seq, warnings };
  for (const f of floors) checkFloor(f, warnings);
  return p;
}

function istirahaProg(v: Brief['villa']): Prog {
  const p = new Prog();
  p.add('majlis', { near: true, area: 45, kids: [['wc', 3]] });
  if (v.ladies) p.add('ladies', { near: true, area: 30 });
  p.add('wc', { near: true, area: 3 });
  p.add('living', { area: 24 });
  p.add('kitchen', { area: 16 });
  if (v.dining) p.add('dining', { area: 18 });
  for (let i = 0; i < Math.max(0, Math.min(4, v.bedrooms)); i++) p.add('bedroom', { kids: [['bath', 4.5]] });
  if (v.store) p.add('store');
  if (v.driver) p.add('driver', { kids: [['bath', 3.5]] });
  return p;
}

function mirrorX(c: Ctx, n: Node): Node {
  if (n.t === 'room') return n;
  const kids = n.kids.map((k) => mirrorX(c, k));
  if (n.axis === 'x') return { ...n, kids: kids.reverse(), w: n.w.slice().reverse() };
  return { ...n, kids };
}

function checkFloor(f: Floor, warnings: string[]) {
  const R = layout(f.root, f.rect);
  for (const l of leaves(f.root)) {
    const r = R.get(l.id)!;
    const m = MIN_W[l.kind];
    if (m && Math.min(r.x1 - r.x0, r.y1 - r.y0) < m * 0.85 && !warnings.includes('narrow')) warnings.push('narrow');
  }
}

// ------------------------------------------------------------------ editing
export const MIN_ROOM = 1.0;
function minSize(n: Node, a: Axis): number {
  if (n.t === 'room') return MIN_ROOM;
  if (n.axis === a) return n.kids.reduce((s, k) => s + minSize(k, a), 0);
  return Math.max(...n.kids.map((k) => minSize(k, a)));
}

export type Divider = { split: string; i: number; axis: Axis; at: number; from: number; to: number; min: number; max: number };

/** Every movable wall: between kid i and i+1 of a split. */
export function dividers(f: Floor): Divider[] {
  const out: Divider[] = [];
  const walk = (n: Node, r: Rect) => {
    if (n.t === 'room') return;
    const tot = n.w.reduce((a, b) => a + b, 0);
    const L = size(r, n.axis);
    const start = n.axis === 'x' ? r.x0 : r.y0;
    let p = start;
    const pos: number[] = [start];
    n.w.forEach((w) => { p += (L * w) / tot; pos.push(p); });
    pos[pos.length - 1] = n.axis === 'x' ? r.x1 : r.y1;
    n.kids.forEach((k, i) => {
      const kr = n.axis === 'x' ? { x0: pos[i], y0: r.y0, x1: pos[i + 1], y1: r.y1 } : { x0: r.x0, y0: pos[i], x1: r.x1, y1: pos[i + 1] };
      walk(k, kr);
      if (i < n.kids.length - 1) {
        out.push({
          split: n.id, i, axis: n.axis, at: pos[i + 1],
          from: n.axis === 'x' ? r.y0 : r.x0, to: n.axis === 'x' ? r.y1 : r.x1,
          min: pos[i] + minSize(k, n.axis), max: pos[i + 2] - minSize(n.kids[i + 1], n.axis),
        });
      }
    });
  };
  walk(f.root, f.rect);
  return out;
}

function findNode(n: Node, id: string): Node | null {
  if (n.id === id) return n;
  if (n.t === 'room') return null;
  for (const k of n.kids) { const f = findNode(k, id); if (f) return f; }
  return null;
}

/** Move a divider to a new absolute position. */
export function moveDivider(f: Floor, d: Divider, at: number) {
  const s = findNode(f.root, d.split);
  if (!s || s.t !== 'split') return;
  const v = Math.max(d.min, Math.min(d.max, at));
  const tot = s.w.reduce((a, b) => a + b, 0);
  const L = (() => { const r = rectOf(f, s.id)!; return size(r, s.axis); })();
  const abs = s.w.map((w) => (L * w) / tot);
  const delta = v - d.at;
  abs[d.i] += delta;
  abs[d.i + 1] -= delta;
  s.w = abs;
}

export function rectOf(f: Floor, id: string): Rect | null {
  let found: Rect | null = null;
  const walk = (n: Node, r: Rect) => {
    if (found) return;
    if (n.id === id) { found = r; return; }
    if (n.t === 'room') return;
    const tot = n.w.reduce((a, b) => a + b, 0);
    const L = size(r, n.axis);
    let p = n.axis === 'x' ? r.x0 : r.y0;
    n.kids.forEach((k, i) => {
      const q = i === n.kids.length - 1 ? (n.axis === 'x' ? r.x1 : r.y1) : p + (L * n.w[i]) / tot;
      walk(k, n.axis === 'x' ? { x0: p, y0: r.y0, x1: q, y1: r.y1 } : { x0: r.x0, y0: p, x1: r.x1, y1: q });
      p = q;
    });
  };
  walk(f.root, f.rect);
  return found;
}

/** Split a room in two along its longer side. */
export function splitRoom(p: Project, f: Floor, id: string, kind?: Kind) {
  const r = rectOf(f, id);
  const node = findNode(f.root, id);
  if (!r || !node || node.t !== 'room') return null;
  const axis: Axis = r.x1 - r.x0 >= r.y1 - r.y0 ? 'x' : 'y';
  if (size(r, axis) < 2 * MIN_ROOM + 0.2) return null;
  const nl: Leaf = { t: 'room', id: 'e' + (p.seq++).toString(36), kind: kind || node.kind, unit: node.unit };
  const where = findParent(f.root, id);
  if (where && where.parent.axis === axis) {
    const w = where.parent.w[where.index] / 2;
    where.parent.w.splice(where.index, 1, w, w);
    where.parent.kids.splice(where.index + 1, 0, nl);
  } else {
    const s: Split = { t: 'split', id: 'e' + (p.seq++).toString(36), axis, kids: [node, nl], w: [1, 1] };
    if (where) where.parent.kids[where.index] = s;
    else f.root = s;
  }
  return nl.id;
}

/** Remove a room: its space goes to the neighbour inside the same split. */
export function mergeRoom(f: Floor, id: string) {
  const where = findParent(f.root, id);
  if (!where) return false;
  const { parent, index } = where;
  const to = index > 0 ? index - 1 : index + 1;
  parent.w[to] += parent.w[index];
  parent.kids.splice(index, 1);
  parent.w.splice(index, 1);
  for (const l of leaves(f.root)) if (l.parent === id) delete l.parent;
  if (parent.kids.length === 1) {
    const only = parent.kids[0];
    const up = findParent(f.root, parent.id);
    if (!up) f.root = only;
    else if (only.t === 'split' && only.axis === up.parent.axis) {
      const wsum = only.w.reduce((a, b) => a + b, 0);
      const share = up.parent.w[up.index];
      up.parent.kids.splice(up.index, 1, ...only.kids);
      up.parent.w.splice(up.index, 1, ...only.w.map((w) => (w / wsum) * share));
    } else up.parent.kids[up.index] = only;
  }
  return true;
}

/** Swap what two rooms are (kind, name, who belongs to whom); the walls stay. */
export function swapRooms(f: Floor, a: string, b: string) {
  const all = leaves(f.root);
  const A = all.find((l) => l.id === a), B = all.find((l) => l.id === b);
  if (!A || !B) return;
  [A.kind, B.kind] = [B.kind, A.kind];
  [A.name, B.name] = [B.name, A.name];
  const pa = A.parent, pb = B.parent;
  A.parent = pb === a ? b : pb;
  B.parent = pa === b ? a : pa;
  for (const l of all) {
    if (l === A || l === B) continue;
    if (l.parent === a) l.parent = b;
    else if (l.parent === b) l.parent = a;
  }
  if (A.parent === A.id) delete A.parent;
  if (B.parent === B.id) delete B.parent;
}

// ------------------------------------------------------------------ derived geometry
export type Opening = { kind: 'door' | 'open' | 'window' | 'gate'; axis: Axis; c: number; t0: number; t1: number; th: number; into?: 1 | -1; hingeAt0?: boolean; main?: boolean };
export type WallPiece = Rect & { ext: boolean };
export type RoomOut = { leaf: Leaf; rect: Rect; net: Rect; area: number };
export type Geometry = { rooms: RoomOut[]; openings: Opening[]; walls: WallPiece[]; lines: { axis: Axis; c: number; t0: number; t1: number; ext: boolean }[]; area: number };

const EPS = 0.02;
const r2 = (v: number) => Math.round(v * 1000) / 1000;

type Edge = { axis: Axis; c: number; t0: number; t1: number }; // axis: the line is x = c (axis 'x') or y = c (axis 'y')

function shared(a: Rect, b: Rect): Edge | null {
  if (Math.abs(a.x1 - b.x0) < EPS || Math.abs(b.x1 - a.x0) < EPS) {
    const c = Math.abs(a.x1 - b.x0) < EPS ? a.x1 : a.x0;
    const t0 = Math.max(a.y0, b.y0), t1 = Math.min(a.y1, b.y1);
    if (t1 - t0 > 0.3) return { axis: 'x', c, t0, t1 };
  }
  if (Math.abs(a.y1 - b.y0) < EPS || Math.abs(b.y1 - a.y0) < EPS) {
    const c = Math.abs(a.y1 - b.y0) < EPS ? a.y1 : a.y0;
    const t0 = Math.max(a.x0, b.x0), t1 = Math.min(a.x1, b.x1);
    if (t1 - t0 > 0.3) return { axis: 'y', c, t0, t1 };
  }
  return null;
}

function exteriorEdges(r: Rect, F: Rect): (Edge & { side: Side })[] {
  const out: (Edge & { side: Side })[] = [];
  if (Math.abs(r.y0 - F.y0) < EPS) out.push({ axis: 'y', c: F.y0, t0: r.x0, t1: r.x1, side: 'S' });
  if (Math.abs(r.y1 - F.y1) < EPS) out.push({ axis: 'y', c: F.y1, t0: r.x0, t1: r.x1, side: 'N' });
  if (Math.abs(r.x0 - F.x0) < EPS) out.push({ axis: 'x', c: F.x0, t0: r.y0, t1: r.y1, side: 'W' });
  if (Math.abs(r.x1 - F.x1) < EPS) out.push({ axis: 'x', c: F.x1, t0: r.y0, t1: r.y1, side: 'E' });
  return out;
}

const DOOR_W: Partial<Record<Kind, number>> = { bath: 0.8, wc: 0.8, dress: 0.8, store: 0.8, laundry: 0.8, lift: 1.0, majlis: 1.2, ladies: 1.0, kitchen: 0.9 };
const doorW = (k: Kind) => DOOR_W[k] ?? 0.9;
const PREF: Kind[] = ['hall', 'entrance', 'landing', 'living', 'dining', 'kitchen', 'majlis', 'master', 'bedroom', 'guest', 'maid', 'driver', 'office', 'prayer', 'ladies', 'laundry', 'store', 'dress', 'bath', 'wc', 'stair', 'lift', 'shop', 'parking', 'terrace', 'void'];
const rank = (k: Kind) => PREF.indexOf(k);

export function geometry(f: Floor, ground: boolean, topOfStair = false): Geometry {
  const R = layout(f.root, f.rect);
  const ls = leaves(f.root);
  const F = f.rect;
  const rect = (l: Leaf) => R.get(l.id)!;
  const sameUnit = (a: Leaf, b: Leaf) => a.unit === b.unit;
  const common = (l: Leaf) => l.unit === 'C';
  const openings: Opening[] = [];
  const doorKey = new Set<string>();
  const adj = new Map<string, Set<string>>();
  const link = (a: Leaf, b: Leaf) => {
    (adj.get(a.id) || adj.set(a.id, new Set()).get(a.id)!).add(b.id);
    (adj.get(b.id) || adj.set(b.id, new Set()).get(b.id)!).add(a.id);
  };
  const thOf = (e: Edge) => ((e.axis === 'x' && (Math.abs(e.c - F.x0) < EPS || Math.abs(e.c - F.x1) < EPS)) || (e.axis === 'y' && (Math.abs(e.c - F.y0) < EPS || Math.abs(e.c - F.y1) < EPS)) ? T_EXT : T_INT);

  /** Door between room a (opening into a) and b on their shared edge. */
  const addDoor = (a: Leaf, b: Leaf, kind: 'door' | 'open', width?: number) => {
    const key = [a.id, b.id].sort().join('|');
    if (doorKey.has(key)) return true;
    const e = shared(rect(a), rect(b));
    if (!e) return false;
    const len = e.t1 - e.t0;
    const th = thOf(e);
    let w = width ?? (kind === 'open' ? Math.min(1.6, len - 0.4) : doorW(a.kind === 'bath' || a.kind === 'wc' || a.kind === 'store' || a.kind === 'dress' || a.kind === 'laundry' || a.kind === 'lift' ? a.kind : b.kind === 'lift' ? 'lift' : a.kind));
    if (len < 0.75) return false;
    w = Math.min(w, len - 0.3);
    if (w < 0.6) return false;
    // position: open passages centred; doors near the end closer to b's centre
    let t0: number;
    if (kind === 'open') t0 = (e.t0 + e.t1) / 2 - w / 2;
    else {
      const rb = rect(b);
      const cb = e.axis === 'x' ? (rb.y0 + rb.y1) / 2 : (rb.x0 + rb.x1) / 2;
      const nearStart = Math.abs(cb - e.t0) <= Math.abs(cb - e.t1);
      t0 = nearStart ? e.t0 + 0.2 : e.t1 - 0.2 - w;
      if (len < w + 0.5) t0 = (e.t0 + e.t1) / 2 - w / 2;
    }
    // which side is room a
    const ra = rect(a);
    const into: 1 | -1 = e.axis === 'x' ? ((ra.x0 + ra.x1) / 2 > e.c ? 1 : -1) : ((ra.y0 + ra.y1) / 2 > e.c ? 1 : -1);
    const rb = rect(b);
    const cbAlong = e.axis === 'x' ? (rb.y0 + rb.y1) / 2 : (rb.x0 + rb.x1) / 2;
    openings.push({ kind, axis: e.axis, c: e.c, t0, t1: t0 + w, th, into, hingeAt0: Math.abs(cbAlong - t0) > Math.abs(cbAlong - (t0 + w)) });
    doorKey.add(key);
    link(a, b);
    return true;
  };

  const neighbours = (l: Leaf) => ls.filter((m) => m !== l && shared(rect(l), rect(m)));

  // 1. passages between circulation spaces of the same unit, stairs and lifts
  for (const a of ls) {
    for (const b of neighbours(a)) {
      if (a.id > b.id) continue;
      if (!sameUnit(a, b)) continue;
      if (PASSAGE.has(a.kind) && PASSAGE.has(b.kind)) addDoor(a, b, 'open');
    }
  }
  for (const a of ls) {
    if (a.kind !== 'stair' && a.kind !== 'lift') continue;
    const cands = neighbours(a).filter((b) => (sameUnit(a, b) || common(b)) && (b.kind === 'hall' || b.kind === 'landing' || b.kind === 'entrance' || b.kind === 'living'));
    cands.sort((p, q) => rank(p.kind) - rank(q.kind));
    if (cands[0]) addDoor(a, cands[0], a.kind === 'stair' ? 'open' : 'door', a.kind === 'stair' ? Math.min(1.3, STAIR_W - 0.4) : 1.0);
  }
  // 2. every other room: to its parent, else to circulation of its unit
  for (const a of ls) {
    if (PASSAGE.has(a.kind) || a.kind === 'stair' || a.kind === 'lift' || a.kind === 'shop' || a.kind === 'parking' || a.kind === 'void') continue;
    const nb = neighbours(a).filter((b) => sameUnit(a, b));
    if (a.parent) {
      const p = nb.find((b) => b.id === a.parent);
      if (p && addDoor(a, p, 'door')) continue;
    }
    const wet = WET.has(a.kind) || a.kind === 'dress';
    const order = (b: Leaf) => {
      let s = rank(b.kind);
      if (a.kind === 'kitchen' && b.kind === 'dining') s = -2;
      if (a.kind === 'terrace' && (b.kind === 'hall' || b.kind === 'stair')) s = -2;
      if (wet && (b.kind === 'bath' || b.kind === 'wc')) s += 50;
      if (b.parent === a.id) s += 40; // own ensuite is not a way in
      return s;
    };
    const circ = nb.filter((b) => CIRC.has(b.kind) || (a.kind === 'terrace' && b.kind === 'stair')).sort((p, q) => order(p) - order(q));
    if (circ[0] && addDoor(a, circ[0], 'door')) continue;
    if (a.kind === 'terrace') continue;
    const any = nb.filter((b) => !WET.has(b.kind) && b.parent !== a.id && b.kind !== 'stair' && b.kind !== 'lift').sort((p, q) => order(p) - order(q));
    if (any[0]) addDoor(a, any[0], 'door');
  }
  // 3. unit entrances from the common landing
  const units = [...new Set(ls.map((l) => l.unit))].filter((u) => u !== 'C');
  for (const u of units) {
    const land = ls.filter((l) => common(l) && l.kind === 'landing');
    if (!land.length) break;
    let best: { a: Leaf; b: Leaf; len: number; r: number } | null = null;
    for (const a of ls.filter((l) => l.unit === u)) {
      if (a.kind === 'shop' || a.kind === 'parking' || a.kind === 'terrace' && u !== 'R') continue;
      for (const b of land) {
        const e = shared(rect(a), rect(b));
        if (!e) continue;
        const rr = rank(a.kind) + (['kitchen', 'bath', 'wc', 'store', 'dress', 'laundry'].includes(a.kind) ? 100 : 0);
        const len = e.t1 - e.t0;
        if (!best || rr < best.r || (rr === best.r && len > best.len)) best = { a, b, len, r: rr };
      }
    }
    if (best) addDoor(best.a, best.b, 'door', 1.0);
  }
  // 4. front doors, shop fronts, parking gates
  const extDoors: Opening[] = [];
  if (ground) {
    const unitsWithEntry = new Set<string>();
    const cand = ls.filter((l) => l.kind === 'entrance' || l.kind === 'hall' || (l.kind === 'landing' && common(l)));
    cand.sort((p, q) => (p.kind === 'entrance' ? 0 : p.kind === 'landing' ? 1 : 2) - (q.kind === 'entrance' ? 0 : q.kind === 'landing' ? 1 : 2));
    for (const l of cand) {
      if (unitsWithEntry.has(l.unit)) continue;
      const e = exteriorEdges(rect(l), F).find((x) => x.side === 'S');
      if (!e) continue;
      const w = Math.min(1.2, e.t1 - e.t0 - 0.3);
      if (w < 0.8) continue;
      const t0 = (e.t0 + e.t1) / 2 - w / 2;
      extDoors.push({ kind: 'door', axis: 'y', c: e.c, t0, t1: t0 + w, th: T_EXT, into: 1, hingeAt0: true, main: true });
      unitsWithEntry.add(l.unit);
    }
    for (const l of ls) {
      if (l.kind !== 'shop' && l.kind !== 'parking') continue;
      const e = exteriorEdges(rect(l), F).find((x) => x.side === 'S');
      if (!e) continue;
      const len = e.t1 - e.t0;
      if (l.kind === 'parking') { const w = Math.min(len - 0.6, 6); const t0 = (e.t0 + e.t1) / 2 - w / 2; extDoors.push({ kind: 'gate', axis: 'y', c: e.c, t0, t1: t0 + w, th: T_EXT }); }
      else { const t0 = e.t0 + 0.3; extDoors.push({ kind: 'door', axis: 'y', c: e.c, t0, t1: t0 + 1.0, th: T_EXT, into: 1, hingeAt0: true, main: true }); }
    }
  }
  // 5. reachability: connect anything left over to a reached neighbour of the same unit
  const starts = ls.filter((l) => (ground && (l.kind === 'entrance' || l.kind === 'landing' || l.kind === 'hall' || l.kind === 'shop' || l.kind === 'parking')) || (!ground && (l.kind === 'stair' || l.kind === 'landing' || l.kind === 'hall')));
  const seen = new Set<string>();
  const queue = starts.map((s) => s.id);
  queue.forEach((s) => seen.add(s));
  const bfs = () => {
    while (queue.length) {
      const id = queue.shift()!;
      for (const n of adj.get(id) || []) if (!seen.has(n)) { seen.add(n); queue.push(n); }
    }
  };
  bfs();
  for (let guard = 0; guard < 40; guard++) {
    const lost = ls.filter((l) => !seen.has(l.id) && l.kind !== 'terrace' && l.kind !== 'void' || (l.kind === 'terrace' && !seen.has(l.id) && neighbours(l).some((n) => seen.has(n.id) && n.unit === l.unit)));
    if (!lost.length) break;
    let fixed = false;
    for (const a of lost) {
      const nb = neighbours(a).filter((b) => seen.has(b.id) && (sameUnit(a, b) || (common(b) && b.kind === 'landing'))).sort((p, q) => (WET.has(p.kind) ? 50 : 0) + rank(p.kind) - ((WET.has(q.kind) ? 50 : 0) + rank(q.kind)));
      if (nb[0] && addDoor(a, nb[0], 'door')) { seen.add(a.id); queue.push(a.id); bfs(); fixed = true; break; }
    }
    if (!fixed) break;
  }
  openings.push(...extDoors);

  // 6. windows on outside walls
  const WIN: Partial<Record<Kind, (len: number) => number>> = {
    master: (l) => Math.min(2.2, l * 0.45), bedroom: (l) => Math.min(1.8, l * 0.45), guest: (l) => Math.min(1.8, l * 0.45),
    majlis: (l) => Math.min(2.6, l * 0.4), ladies: (l) => Math.min(2.4, l * 0.4), living: (l) => Math.min(2.6, l * 0.45),
    dining: (l) => Math.min(2.0, l * 0.4), office: (l) => Math.min(1.6, l * 0.45), prayer: (l) => Math.min(1.4, l * 0.4),
    kitchen: (l) => Math.min(1.4, l * 0.4), maid: () => 1.0, driver: () => 1.0, bath: () => 0.6, wc: () => 0.5,
    laundry: () => 0.8, stair: () => 0.9, hall: (l) => Math.min(1.6, l * 0.3), entrance: () => 0, landing: () => 0.9, shop: (l) => l - 1.6,
  };
  for (const l of ls) {
    const fn = WIN[l.kind];
    if (!fn) continue;
    const wells = ls.filter((v) => v.kind === 'void').map((v) => shared(rect(l), rect(v))).filter(Boolean).map((e) => ({ ...e!, side: 'S' as Side }));
    const edges = [...exteriorEdges(rect(l), F), ...wells].sort((a, b) => b.t1 - b.t0 - (a.t1 - a.t0));
    const big = ['majlis', 'living', 'ladies', 'master', 'dining'].includes(l.kind);
    let n = 0;
    for (const e of edges) {
      if (l.kind === 'shop' && e.side !== 'S') continue;
      if (n >= (big ? 2 : 1)) break;
      const len = e.t1 - e.t0;
      let w = fn(len);
      if (w < 0.45 || len < w + 0.5) continue;
      let t0 = (e.t0 + e.t1) / 2 - w / 2;
      // keep clear of doors on the same wall
      const clash = (a: number, b: number) => [...openings].some((o) => o.axis === e.axis && Math.abs(o.c - e.c) < EPS && o.t0 < b + 0.25 && o.t1 > a - 0.25);
      if (clash(t0, t0 + w)) {
        const d = [...openings].find((o) => o.axis === e.axis && Math.abs(o.c - e.c) < EPS && o.t0 < t0 + w + 0.25 && o.t1 > t0 - 0.25)!;
        const right = d.t1 + 0.4, left = d.t0 - 0.4 - w;
        if (right + w <= e.t1 - 0.25) t0 = right; else if (left >= e.t0 + 0.25) t0 = left; else { w = 0; }
      }
      if (w < 0.45) continue;
      openings.push({ kind: 'window', axis: e.axis, c: e.c, t0, t1: t0 + w, th: thOf(e) });
      n++;
    }
  }
  void topOfStair;

  // 7. wall lines (union of all room edges) and pieces between openings
  const lines = new Map<string, { axis: Axis; c: number; iv: [number, number][] }>();
  const add = (axis: Axis, c: number, t0: number, t1: number) => {
    const k = axis + r2(c);
    const L = lines.get(k) || lines.set(k, { axis, c: r2(c), iv: [] }).get(k)!;
    L.iv.push([t0, t1]);
  };
  for (const l of ls) {
    const r = rect(l);
    add('y', r.y0, r.x0, r.x1); add('y', r.y1, r.x0, r.x1);
    add('x', r.x0, r.y0, r.y1); add('x', r.x1, r.y0, r.y1);
  }
  // open-plan pairs (terrace edges against terrace) keep their walls; that's fine for a concept
  const outLines: Geometry['lines'] = [];
  const walls: WallPiece[] = [];
  for (const L of lines.values()) {
    L.iv.sort((a, b) => a[0] - b[0]);
    const merged: [number, number][] = [];
    for (const [a, b] of L.iv) {
      const last = merged[merged.length - 1];
      if (last && a <= last[1] + EPS) last[1] = Math.max(last[1], b);
      else merged.push([a, b]);
    }
    const ext = (L.axis === 'x' && (Math.abs(L.c - F.x0) < EPS || Math.abs(L.c - F.x1) < EPS)) || (L.axis === 'y' && (Math.abs(L.c - F.y0) < EPS || Math.abs(L.c - F.y1) < EPS));
    const th = ext ? T_EXT : T_INT;
    const ops = openings.filter((o) => o.axis === L.axis && Math.abs(o.c - L.c) < EPS);
    for (const [a, b] of merged) {
      outLines.push({ axis: L.axis, c: L.c, t0: a, t1: b, ext });
      // cut openings
      let pieces: [number, number][] = [[a - T_EXT / 2, b + T_EXT / 2]];
      for (const o of ops) {
        const nx: [number, number][] = [];
        for (const [p, q] of pieces) {
          if (o.t1 <= p || o.t0 >= q) { nx.push([p, q]); continue; }
          if (o.t0 > p) nx.push([p, o.t0]);
          if (o.t1 < q) nx.push([o.t1, q]);
        }
        pieces = nx;
      }
      for (const [p, q] of pieces) {
        if (q - p < 0.02) continue;
        walls.push(L.axis === 'x' ? { x0: L.c - th / 2, x1: L.c + th / 2, y0: p, y1: q, ext } : { x0: p, x1: q, y0: L.c - th / 2, y1: L.c + th / 2, ext });
      }
    }
  }
  // 8. rooms with net areas (inside the wall faces)
  const half = (axis: Axis, c: number) => {
    const ext = (axis === 'x' && (Math.abs(c - F.x0) < EPS || Math.abs(c - F.x1) < EPS)) || (axis === 'y' && (Math.abs(c - F.y0) < EPS || Math.abs(c - F.y1) < EPS));
    return (ext ? T_EXT : T_INT) / 2;
  };
  const rooms: RoomOut[] = ls.map((l) => {
    const r = rect(l);
    const net = { x0: r.x0 + half('x', r.x0), x1: r.x1 - half('x', r.x1), y0: r.y0 + half('y', r.y0), y1: r.y1 - half('y', r.y1) };
    return { leaf: l, rect: r, net, area: Math.max(0, (net.x1 - net.x0) * (net.y1 - net.y0)) };
  });
  return { rooms, openings, walls, lines: outLines, area: (F.x1 - F.x0 + T_EXT) * (F.y1 - F.y0 + T_EXT) };
}

// ------------------------------------------------------------------ totals
export function totals(p: Project) {
  let built = 0;
  const per = p.floors.map((f) => {
    const g = geometry(f, f.level === 0);
    const terrace = g.rooms.filter((r) => r.leaf.kind === 'terrace').reduce((s, r) => s + (r.rect.x1 - r.rect.x0) * (r.rect.y1 - r.rect.y0), 0);
    const gross = g.area - terrace;
    built += gross * f.repeat;
    return { floor: f, gross, net: g.rooms.filter((r) => r.leaf.kind !== 'terrace').reduce((s, r) => s + r.area, 0) };
  });
  const landArea = (p.land.x1 - p.land.x0) * (p.land.y1 - p.land.y0);
  const ground = per.find((x) => x.floor.level === 0);
  return { per, built, landArea, coverage: ground ? ground.gross / landArea : 0 };
}
