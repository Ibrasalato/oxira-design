// Reads a DXF drawing into flat 2D primitives in metres.
// Blocks (INSERT) are expanded with their transforms; door and window blocks
// become "markers" used later to classify wall openings.
import DxfParser from 'dxf-parser';

export type P = { x: number; y: number };
export type Seg = { a: P; b: P; layer: string };
export type Txt = { p: P; text: string; layer: string; h: number };
export type Box = { x0: number; y0: number; x1: number; y1: number };
export type Marker = { kind: 'door' | 'window'; box: Box; segs: Seg[] };
export type Role = 'wall' | 'door' | 'window' | 'ignore';
export type LayerInfo = { name: string; segs: number; length: number; texts: number; role: Role };

export type Flat = {
  segs: Seg[];            // every straight piece outside door/window blocks (all layers)
  texts: Txt[];
  blockMarkers: { name: string; layer: string; box: Box; segs: Seg[] }[];
  layers: LayerInfo[];
  unitScale: number;      // drawing unit -> metres
  unitGuessed: boolean;
};

type M = [number, number, number, number, number, number]; // x' = a x + c y + e ; y' = b x + d y + f
const I: M = [1, 0, 0, 1, 0, 0];
const mul = (m: M, n: M): M => [
  m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5],
];
const ap = (m: M, x: number, y: number): P => ({ x: m[0] * x + m[2] * y + m[4], y: m[1] * x + m[3] * y + m[5] });

export const RX = {
  wall: /wall|wand|mur\b|murs|стен|جدار|جدر|حوائط|حائط|حيط|مبان|بناء|brick|block|concrete|خرسان|column|colon|عمود|اعمد|أعمد|säule|колон/i,
  door: /door|tür|tuer|porte|двер|باب|ابواب|أبواب/i,
  window: /window|wind|\bwin|glaz|glass|fenster|fen[eê]tre|окн|شباك|شبابيك|نافذ|نوافذ|زجاج/i,
  ignore: /dim|furn|أثاث|اثاث|فرش|hatch|تهشير|grid|محاور|axis|elec|كهرب|plumb|صحي|sanit|title|frame|border|defpoints|ابعاد|أبعاد|مقاس|text|txt|anno|نص|كتاب|tree|plant|شجر|landscape|tile|بلاط|ceiling|سقف|cars?\b|park|سيار/i,
};

export function guessRole(name: string): Role {
  // windows first: Arabic "شبابيك" contains the letters of "باب" (door)
  if (RX.window.test(name)) return 'window';
  if (RX.door.test(name)) return 'door';
  if (RX.wall.test(name)) return 'wall';
  if (RX.ignore.test(name)) return 'ignore';
  return 'ignore';
}

const UNIT: Record<number, number> = { 1: 0.0254, 2: 0.3048, 4: 0.001, 5: 0.01, 6: 1, 14: 0.1 };

/** AutoCAD writes non-ASCII text as \\U+XXXX (and \\M+nXXXX in old files); decode the Unicode form. */
const uni = (s: string) => s.replace(/\\U\+([0-9A-Fa-f]{4,5})/g, (_, h) => String.fromCodePoint(parseInt(h, 16)));

function cleanMText(s: string) {
  return uni(s)
    .replace(/\\P/g, ' ')
    .replace(/\\[A-Za-z][^;\\{}]*;/g, '')
    .replace(/\\[~ ]/g, ' ')
    .replace(/[{}]/g, '')
    .replace(/%%[cdp]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function readDxf(text: string): Flat {
  const dxf: any = new DxfParser().parseSync(text);
  if (!dxf) throw new Error('parse');
  const blocks: Record<string, any> = dxf.blocks || {};
  const raw: Seg[] = [];
  const texts: Txt[] = [];
  const blockMarkers: Flat['blockMarkers'] = [];

  const pushArc = (out: Seg[], m: M, cx: number, cy: number, r: number, a0: number, a1: number, layer: string) => {
    let sweep = a1 - a0;
    while (sweep <= 0) sweep += Math.PI * 2;
    const n = Math.max(2, Math.ceil(sweep / (Math.PI / 18)));
    let prev = ap(m, cx + r * Math.cos(a0), cy + r * Math.sin(a0));
    for (let i = 1; i <= n; i++) {
      const a = a0 + (sweep * i) / n;
      const p = ap(m, cx + r * Math.cos(a), cy + r * Math.sin(a));
      out.push({ a: prev, b: p, layer });
      prev = p;
    }
  };

  const pushPoly = (out: Seg[], m: M, verts: any[], closed: boolean, layer: string) => {
    const n = verts.length;
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const v = verts[i];
      const w = verts[(i + 1) % n];
      const bulge = v.bulge || 0;
      if (Math.abs(bulge) > 1e-6) {
        // arc between v and w
        const dx = w.x - v.x, dy = w.y - v.y;
        const chord = Math.hypot(dx, dy);
        if (chord < 1e-9) continue;
        // centre sits on the chord's left normal; sweep is signed (positive bulge = counter-clockwise)
        const sweep = 4 * Math.atan(bulge);
        const d = (chord / 2) * ((1 - bulge * bulge) / (2 * bulge));
        const cx = (v.x + w.x) / 2 - (dy / chord) * d, cy = (v.y + w.y) / 2 + (dx / chord) * d;
        const r = Math.hypot(v.x - cx, v.y - cy);
        const a0 = Math.atan2(v.y - cy, v.x - cx);
        const n = Math.max(2, Math.ceil(Math.abs(sweep) / (Math.PI / 18)));
        let prev = ap(m, v.x, v.y);
        for (let k = 1; k <= n; k++) {
          const a = a0 + (sweep * k) / n;
          const p = k === n ? ap(m, w.x, w.y) : ap(m, cx + r * Math.cos(a), cy + r * Math.sin(a));
          out.push({ a: prev, b: p, layer });
          prev = p;
        }
      } else {
        out.push({ a: ap(m, v.x, v.y), b: ap(m, w.x, w.y), layer });
      }
    }
  };

  const isOpeningBlock = (name: string) => RX.door.test(name) || RX.window.test(name) || /^(d|w)\d*$/i.test(name);

  const walk = (ents: any[], m: M, parentLayer: string | null, out: Seg[], depth: number, outTexts: Txt[] | null) => {
    for (const e of ents || []) {
      const layer = (!e.layer || e.layer === '0') && parentLayer ? parentLayer : e.layer || '0';
      switch (e.type) {
        case 'LINE':
          if (e.vertices?.length >= 2) out.push({ a: ap(m, e.vertices[0].x, e.vertices[0].y), b: ap(m, e.vertices[1].x, e.vertices[1].y), layer });
          break;
        case 'LWPOLYLINE':
        case 'POLYLINE': {
          const verts = (e.vertices || []).filter((v: any) => !v.faces);
          if (verts.length >= 2) pushPoly(out, m, verts, !!(e.shape || e.closed), layer);
          break;
        }
        case 'ARC':
          pushArc(out, m, e.center.x, e.center.y, e.radius, e.startAngle, e.endAngle, layer);
          break;
        case 'CIRCLE':
          pushArc(out, m, e.center.x, e.center.y, e.radius, 0, Math.PI * 2, layer);
          break;
        case 'TEXT':
        case 'MTEXT': {
          if (!outTexts) break;
          const p = e.type === 'TEXT' && (e.halign || e.valign) && e.endPoint ? e.endPoint : e.position || e.startPoint;
          const s = e.type === 'MTEXT' ? cleanMText(String(e.text || '')) : uni(String(e.text || '')).trim();
          if (p && s) outTexts.push({ p: ap(m, p.x, p.y), text: s, layer, h: Math.abs((e.textHeight || e.height || 0) * Math.hypot(m[0], m[1])) });
          break;
        }
        case 'INSERT': {
          const b = blocks[e.name];
          if (!b || depth > 8) break;
          const sx = e.xScale ?? 1, sy = e.yScale ?? 1, r = ((e.rotation || 0) * Math.PI) / 180;
          const base = b.position || { x: 0, y: 0 };
          const T: M = [1, 0, 0, 1, e.position.x, e.position.y];
          const R: M = [Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0];
          const S: M = [sx, 0, 0, sy, 0, 0];
          const B: M = [1, 0, 0, 1, -base.x, -base.y];
          const mm = mul(m, mul(T, mul(R, mul(S, B))));
          if (depth === 0 && isOpeningBlock(e.name)) {
            const segs: Seg[] = [];
            walk(b.entities, mm, layer, segs, depth + 1, null);
            if (segs.length) blockMarkers.push({ name: e.name, layer, box: bbox(segs), segs });
          } else {
            walk(b.entities, mm, layer, out, depth + 1, outTexts);
          }
          break;
        }
        default:
          break; // DIMENSION, HATCH, SOLID, POINT ... ignored
      }
    }
  };

  walk(dxf.entities, I, null, raw, 0, texts);

  // Layer statistics (in drawing units for now)
  const stats = new Map<string, LayerInfo>();
  const st = (name: string) => {
    let s = stats.get(name);
    if (!s) { s = { name, segs: 0, length: 0, texts: 0, role: guessRole(name) }; stats.set(name, s); }
    return s;
  };
  for (const s of raw) { const L = st(s.layer); L.segs++; L.length += Math.hypot(s.b.x - s.a.x, s.b.y - s.a.y); }
  for (const t of texts) st(t.layer).texts++;
  for (const b of blockMarkers) st(b.layer);

  // Units: trust the header when it gives a believable building size, otherwise guess from extents.
  const wallish = raw.filter((s) => stats.get(s.layer)!.role === 'wall');
  const ext = extent(wallish.length > 20 ? wallish : raw);
  const size = Math.max(ext.x1 - ext.x0, ext.y1 - ext.y0);
  let unitScale = UNIT[dxf.header?.$INSUNITS as number] || 0;
  let unitGuessed = false;
  if (!unitScale || size * unitScale < 2 || size * unitScale > 600) {
    unitGuessed = true;
    unitScale = size > 2000 ? 0.001 : size > 200 ? 0.01 : 1;
  }

  const k = unitScale;
  const sc = (p: P): P => ({ x: p.x * k, y: p.y * k });
  const segs = raw.map((s) => ({ ...s, a: sc(s.a), b: sc(s.b) }));
  const txts = texts.map((t) => ({ ...t, p: sc(t.p), h: t.h * k }));
  const markers = blockMarkers.map((b) => ({ ...b, box: { x0: b.box.x0 * k, y0: b.box.y0 * k, x1: b.box.x1 * k, y1: b.box.y1 * k }, segs: b.segs.map((s) => ({ ...s, a: sc(s.a), b: sc(s.b) })) }));
  const layers = [...stats.values()].map((l) => ({ ...l, length: l.length * k }));

  // No layer looked like walls: take the busiest non-ignored layer (or the busiest overall).
  if (!layers.some((l) => l.role === 'wall')) {
    const cand = layers.filter((l) => l.role !== 'door' && l.role !== 'window' && !/dim|defpoints|text|furn|hatch/i.test(l.name)).sort((a, b) => b.length - a.length)[0]
      || layers.slice().sort((a, b) => b.length - a.length)[0];
    if (cand) cand.role = 'wall';
  }
  layers.sort((a, b) => (a.role === 'wall' ? -1 : 0) - (b.role === 'wall' ? -1 : 0) || b.length - a.length);
  return { segs, texts: txts, blockMarkers: markers, layers, unitScale, unitGuessed };
}

export function rescale(flat: Flat, newScale: number): Flat {
  const f = newScale / flat.unitScale;
  if (Math.abs(f - 1) < 1e-9) return flat;
  const sc = (p: P): P => ({ x: p.x * f, y: p.y * f });
  return {
    ...flat,
    unitScale: newScale,
    unitGuessed: false,
    segs: flat.segs.map((s) => ({ ...s, a: sc(s.a), b: sc(s.b) })),
    texts: flat.texts.map((t) => ({ ...t, p: sc(t.p), h: t.h * f })),
    blockMarkers: flat.blockMarkers.map((b) => ({ ...b, box: { x0: b.box.x0 * f, y0: b.box.y0 * f, x1: b.box.x1 * f, y1: b.box.y1 * f }, segs: b.segs.map((s) => ({ ...s, a: sc(s.a), b: sc(s.b) })) })),
    layers: flat.layers.map((l) => ({ ...l, length: l.length * f })),
  };
}

export function bbox(segs: Seg[]): Box {
  return extent(segs);
}
function extent(segs: Seg[]): Box {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const s of segs) {
    for (const p of [s.a, s.b]) {
      if (p.x < x0) x0 = p.x; if (p.y < y0) y0 = p.y;
      if (p.x > x1) x1 = p.x; if (p.y > y1) y1 = p.y;
    }
  }
  if (!isFinite(x0)) return { x0: 0, y0: 0, x1: 0, y1: 0 };
  return { x0, y0, x1, y1 };
}
