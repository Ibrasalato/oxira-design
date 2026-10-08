// Automatic first-pass furnishing: simple furniture made of primitives, placed
// against walls of each room's largest free rectangle, avoiding door sides.
import * as THREE from 'three';
import type { Plan, Room, Rect, Grid } from './plan.ts';
import type { Style } from './styles.ts';

type Side = 'N' | 'S' | 'E' | 'W';
type SideInfo = { side: Side; len: number; door: number; win: number; open: number; wall: number };

const mats = new Map<string, THREE.MeshStandardMaterial>();
function mat(color: string, rough = 0.8, metal = 0) {
  const k = color + rough + metal;
  let m = mats.get(k);
  if (!m) { m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal }); mats.set(k, m); }
  return m;
}

/** Piece in local space: width along x, depth along z, back at z = -d/2, floor at y = 0. */
class Piece extends THREE.Group {
  w: number;
  d: number;
  constructor(w: number, d: number) { super(); this.w = w; this.d = d; }
  box(w: number, h: number, d: number, color: string, x = 0, y = 0, z = 0, rough = 0.8, metal = 0) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, rough, metal));
    m.position.set(x, y + h / 2, z);
    m.castShadow = true; m.receiveShadow = true;
    this.add(m);
    return m;
  }
  cyl(r: number, h: number, color: string, x = 0, y = 0, z = 0, r2 = r, seg = 20) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r2, h, seg), mat(color));
    m.position.set(x, y + h / 2, z);
    m.castShadow = true; m.receiveShadow = true;
    this.add(m);
    return m;
  }
}

// ------------------------------------------------------------------ pieces
function bed(s: Style, w = 1.6, l = 2.05): Piece {
  const p = new Piece(w + 1.1, l + 0.1);
  const z0 = -p.d / 2;
  p.box(w + 0.1, 0.32, l, s.wood, 0, 0, z0 + 0.1 + l / 2);
  p.box(w, 0.22, l - 0.08, s.linen, 0, 0.32, z0 + 0.1 + l / 2 + 0.02, 0.95);
  p.box(w + 0.02, 0.06, l * 0.55, s.fabric2, 0, 0.53, z0 + 0.1 + l * 0.64, 0.95);
  p.box(w + 0.16, 1.05, 0.1, s.fabric, 0, 0, z0 + 0.05, 0.9);
  for (const x of [-w / 4, w / 4]) p.box(w / 2 - 0.12, 0.12, 0.4, '#FFFFFF', x, 0.54, z0 + 0.35, 0.95);
  for (const x of [-(w / 2 + 0.33), w / 2 + 0.33]) {
    p.box(0.46, 0.5, 0.42, s.wood, x, 0, z0 + 0.25);
    p.cyl(0.08, 0.3, s.metal, x, 0.5, z0 + 0.25, 0.12);
  }
  return p;
}
function wardrobe(s: Style, len: number): Piece {
  const p = new Piece(len, 0.62);
  p.box(len, 2.3, 0.6, s.door === '#FFFFFF' ? '#F2F0EC' : s.wood, 0, 0, 0, 0.6);
  const doors = Math.max(2, Math.round(len / 0.5));
  for (let i = 1; i < doors; i++) p.box(0.01, 2.2, 0.01, s.woodDark, -len / 2 + (len * i) / doors, 0.05, 0.305);
  return p;
}
function sofa(s: Style, len = 2.4): Piece {
  const p = new Piece(len, 0.95);
  p.box(len, 0.42, 0.95, s.fabric, 0, 0.05);
  p.box(len, 0.45, 0.22, s.fabric, 0, 0.42, -0.36);
  for (const x of [-len / 2 + 0.1, len / 2 - 0.1]) p.box(0.2, 0.22, 0.95, s.fabric, x, 0.42);
  const seats = Math.max(2, Math.round(len / 0.8));
  for (let i = 0; i < seats; i++) p.box((len - 0.45) / seats - 0.03, 0.12, 0.66, s.fabric2, -len / 2 + 0.22 + ((len - 0.45) / seats) * (i + 0.5), 0.47, 0.08, 0.95);
  for (const x of [-len / 2 + 0.06, len / 2 - 0.06]) for (const z of [-0.4, 0.4]) p.box(0.05, 0.05, 0.05, s.metal, x, 0, z);
  return p;
}
function tvUnit(s: Style, len = 1.8): Piece {
  const p = new Piece(len, 0.45);
  p.box(len, 0.45, 0.42, s.woodDark, 0, 0.1);
  p.box(Math.min(1.45, len - 0.1), 0.82, 0.05, '#111418', 0, 0.75, -0.12, 0.3, 0.2);
  return p;
}
function coffeeTable(s: Style): Piece {
  const p = new Piece(1.1, 0.6);
  p.box(1.1, 0.05, 0.6, s.stone, 0, 0.36, 0, 0.4);
  p.box(0.9, 0.36, 0.42, s.woodDark, 0, 0, 0);
  return p;
}
function rug(s: Style, w: number, d: number): Piece {
  const p = new Piece(w, d);
  const m = p.box(w, 0.012, d, s.rug, 0, 0.002, 0, 1);
  m.castShadow = false;
  return p;
}
function chair(s: Style): Piece {
  const p = new Piece(0.46, 0.5);
  p.box(0.44, 0.06, 0.44, s.fabric2, 0, 0.42, 0.02);
  p.box(0.44, 0.45, 0.05, s.wood, 0, 0.47, -0.2);
  for (const x of [-0.19, 0.19]) for (const z of [-0.18, 0.2]) p.box(0.04, 0.42, 0.04, s.wood, x, 0, z);
  return p;
}
function diningSet(s: Style, len: number, seats: number): Piece {
  const p = new Piece(len + 0.2, 0.9 + 1.1);
  p.box(len, 0.05, 0.95, s.wood, 0, 0.72, 0, 0.5);
  for (const x of [-len / 2 + 0.1, len / 2 - 0.1]) for (const z of [-0.38, 0.38]) p.box(0.06, 0.72, 0.06, s.woodDark, x, 0, z);
  const per = Math.max(1, Math.floor(seats / 2));
  for (let i = 0; i < per; i++) {
    const x = -len / 2 + (len / per) * (i + 0.5);
    const c1 = chair(s); c1.position.set(x, 0, -0.68); p.add(c1);
    const c2 = chair(s); c2.position.set(x, 0, 0.68); c2.rotation.y = Math.PI; p.add(c2);
  }
  return p;
}
function kitchenRun(s: Style, len: number, upper: boolean, fridge: boolean): Piece {
  const p = new Piece(len, 0.65);
  const fr = fridge && len > 2.2 ? 0.8 : 0;
  const run = len - fr;
  const x0 = -len / 2 + run / 2;
  p.box(run, 0.86, 0.6, s.door === '#FFFFFF' ? '#F4F3F0' : s.wood, x0, 0.04, 0, 0.6);
  p.box(run, 0.04, 0.64, s.stone, x0, 0.9, 0.01, 0.3);
  p.box(run, 0.04, 0.56, '#1d1d1d', x0, 0, 0.02);
  // sink and hob
  p.box(0.55, 0.02, 0.42, '#B9BEC2', x0 - run * 0.2, 0.935, 0.02, 0.2, 0.8);
  if (run > 1.6) p.box(0.6, 0.02, 0.5, '#15171A', x0 + run * 0.25, 0.935, 0.02, 0.3);
  if (upper) p.box(run, 0.7, 0.35, s.door === '#FFFFFF' ? '#F4F3F0' : s.wood, x0, 1.5, -0.15, 0.6);
  if (fr) p.box(0.76, 1.9, 0.66, '#D9DCDF', len / 2 - fr / 2, 0, 0, 0.3, 0.6);
  return p;
}
function island(s: Style): Piece {
  const p = new Piece(1.8, 0.9);
  p.box(1.8, 0.88, 0.85, s.woodDark, 0, 0);
  p.box(1.9, 0.04, 0.95, s.stone, 0, 0.88, 0, 0.3);
  return p;
}
function toilet(s: Style): Piece {
  const p = new Piece(0.42, 0.7);
  p.box(0.4, 0.38, 0.18, '#FFFFFF', 0, 0.3, -0.26, 0.3);
  p.cyl(0.2, 0.4, '#FFFFFF', 0, 0, 0.05, 0.16);
  return p;
}
function vanity(s: Style, len = 0.9): Piece {
  const p = new Piece(len, 0.52);
  p.box(len, 0.55, 0.5, s.woodDark, 0, 0.3);
  p.box(len + 0.02, 0.04, 0.52, s.stone, 0, 0.85, 0, 0.3);
  p.cyl(0.18, 0.1, '#FFFFFF', 0, 0.89, 0.02, 0.16);
  p.box(len * 0.8, 0.8, 0.02, '#CFE3EE', 0, 1.2, -0.24, 0.05, 0.9);
  return p;
}
function shower(s: Style, w = 0.9): Piece {
  const p = new Piece(w, w);
  p.box(w, 0.05, w, '#F4F4F2', 0, 0, 0, 0.4);
  const g = new THREE.Mesh(new THREE.BoxGeometry(w, 1.95, 0.012), new THREE.MeshStandardMaterial({ color: '#BFD9E6', transparent: true, opacity: 0.25, roughness: 0.05 }));
  g.position.set(0, 1.0, w / 2);
  p.add(g);
  p.cyl(0.015, 1.9, s.metal, w / 2 - 0.12, 0.05, -w / 2 + 0.05);
  return p;
}
function plant(s: Style): Piece {
  const p = new Piece(0.5, 0.5);
  p.cyl(0.17, 0.4, s.stone, 0, 0, 0, 0.13);
  const leaf = mat('#4E7A4A');
  for (let i = 0; i < 5; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.17 + (i % 2) * 0.04, 12, 10), leaf);
    m.position.set(Math.cos(i * 1.3) * 0.1, 0.65 + i * 0.12, Math.sin(i * 1.3) * 0.1);
    m.castShadow = true;
    p.add(m);
  }
  return p;
}
function desk(s: Style): Piece {
  const p = new Piece(1.4, 1.2);
  p.box(1.4, 0.04, 0.65, s.wood, 0, 0.73, -0.27, 0.5);
  for (const x of [-0.66, 0.66]) p.box(0.04, 0.73, 0.6, s.metal, x, 0, -0.27);
  const c = chair(s); c.position.set(0, 0, 0.25); c.rotation.y = Math.PI; p.add(c);
  return p;
}
function majlisSeat(s: Style, len: number): Piece {
  // low floor seating along a wall (traditional Saudi majlis)
  const p = new Piece(len, 0.8);
  p.box(len, 0.16, 0.78, s.fabric, 0, 0);
  p.box(len, 0.45, 0.16, s.fabric, 0, 0.16, -0.31);
  const n = Math.max(1, Math.round(len / 0.75));
  for (let i = 0; i < n; i++) p.box(len / n - 0.06, 0.32, 0.12, s.fabric2, -len / 2 + (len / n) * (i + 0.5), 0.16, -0.18, 0.95);
  return p;
}
function console_(s: Style, len = 1.2): Piece {
  const p = new Piece(len, 0.36);
  p.box(len, 0.06, 0.34, s.wood, 0, 0.8);
  for (const x of [-len / 2 + 0.05, len / 2 - 0.05]) p.box(0.04, 0.8, 0.3, s.metal, x, 0);
  return p;
}
function outdoorSet(s: Style): Piece {
  const p = new Piece(1.6, 1.4);
  p.cyl(0.35, 0.03, s.metal, 0, 0.7, 0);
  p.cyl(0.03, 0.7, s.metal, 0, 0, 0);
  for (const a of [0, Math.PI]) { const c = chair(s); c.position.set(Math.sin(a) * 0.7, 0, Math.cos(a) * 0.7); c.rotation.y = a + Math.PI; p.add(c); }
  return p;
}

// ------------------------------------------------------------------ placement
function sideInfo(g: Grid, R: Rect, side: Side, roomId: number): SideInfo {
  const { cell } = g;
  const horiz = side === 'N' || side === 'S';
  const len = horiz ? R.x1 - R.x0 : R.y1 - R.y0;
  const out = { side, len, door: 0, win: 0, open: 0, wall: 0 };
  const steps = Math.max(1, Math.floor(len / cell));
  for (let k = 0; k <= steps; k++) {
    const t = (horiz ? R.x0 : R.y0) + (len * k) / steps;
    let hit = 0;
    for (let o = cell; o <= 0.45; o += cell) {
      const x = horiz ? t : side === 'E' ? R.x1 + o : R.x0 - o;
      const y = horiz ? (side === 'N' ? R.y1 + o : R.y0 - o) : t;
      const i = Math.round((x - g.x0) / cell), j = Math.round((y - g.y0) / cell);
      if (i < 0 || j < 0 || i >= g.w || j >= g.h) break;
      const v = g.v[j * g.w + i];
      if (v === 2) { hit = 2; break; }
      if (v === 3) { hit = 3; break; }
      if (v === 4) { hit = 4; break; }
      if (v === 1) { hit = 1; break; }
      if (g.room[j * g.w + i] !== roomId) { hit = 5; break; }
    }
    if (hit === 1) out.wall++; else if (hit === 2) out.door++; else if (hit === 3) out.win++; else out.open++;
  }
  const n = steps + 1;
  out.wall /= n; out.door /= n; out.win /= n; out.open /= n;
  return out;
}

export function furnish(plan: Plan, style: Style, toWorld: (x: number, y: number) => THREE.Vector3): THREE.Group {
  const root = new THREE.Group();
  root.name = 'furniture';
  const g = plan.grid;

  const put = (piece: Piece, R: Rect, side: Side, along = 0, inset = 0.03) => {
    let x: number, y: number, rot: number;
    const cx = (R.x0 + R.x1) / 2, cy = (R.y0 + R.y1) / 2;
    if (side === 'N') { x = cx + along; y = R.y1 - inset - piece.d / 2; rot = 0; }
    else if (side === 'S') { x = cx - along; y = R.y0 + inset + piece.d / 2; rot = Math.PI; }
    else if (side === 'E') { x = R.x1 - inset - piece.d / 2; y = cy - along; rot = -Math.PI / 2; }
    else { x = R.x0 + inset + piece.d / 2; y = cy + along; rot = Math.PI / 2; }
    const p = toWorld(x, y);
    piece.position.set(p.x, 0, p.z);
    piece.rotation.y = rot;
    root.add(piece);
  };
  const putCenter = (piece: Piece, R: Rect, alongX: boolean, offX = 0, offY = 0) => {
    const p = toWorld((R.x0 + R.x1) / 2 + offX, (R.y0 + R.y1) / 2 + offY);
    piece.position.set(p.x, 0, p.z);
    piece.rotation.y = alongX ? 0 : Math.PI / 2;
    root.add(piece);
  };
  const opp: Record<Side, Side> = { N: 'S', S: 'N', E: 'W', W: 'E' };
  /** Signed `along` offset for a piece on side `on` that moves it `amount` metres away from side `from`. */
  const awayFrom = (on: Side, from: Side, amount: number) => {
    if (on === 'N') return from === 'E' ? -amount : amount;
    if (on === 'S') return from === 'E' ? amount : -amount;
    if (on === 'E') return from === 'N' ? amount : -amount;
    return from === 'N' ? -amount : amount;
  };
  const lenOf = (R: Rect, s: Side) => (s === 'N' || s === 'S' ? R.x1 - R.x0 : R.y1 - R.y0);
  const depthOf = (R: Rect, s: Side) => (s === 'N' || s === 'S' ? R.y1 - R.y0 : R.x1 - R.x0);

  for (const room of plan.rooms) {
    const R = { ...room.maxRect };
    // keep clear of the wall faces a little
    R.x0 += 0.02; R.y0 += 0.02; R.x1 -= 0.02; R.y1 -= 0.02;
    const W = R.x1 - R.x0, D = R.y1 - R.y0;
    if (W < 0.9 || D < 0.9) continue;
    const sides = (['N', 'S', 'E', 'W'] as Side[]).map((s) => sideInfo(g, R, s, room.id));
    const score = (si: SideInfo, avoidWin = 0) => si.wall * 2 - si.door * 6 - si.open * 2 - si.win * avoidWin + si.len * 0.05;
    const best = (avoidWin = 0, filter: (s: SideInfo) => boolean = () => true) => sides.filter(filter).sort((a, b) => score(b, avoidWin) - score(a, avoidWin))[0];
    const type = room.type === 'room' ? (room.area >= 9 ? 'bedroom' : room.area >= 5 ? 'office' : 'none') : room.type;

    if (type === 'bedroom') {
      const bw = W >= 3.2 && D >= 3.2 ? 1.8 : W >= 2.8 || D >= 2.8 ? 1.6 : 1.2;
      const head = best(1, (s) => s.len >= bw + 0.9 && depthOf(R, s.side) >= 2.7);
      if (!head) continue;
      put(bed(style, bw), R, head.side);
      put(rug(style, Math.min(bw + 0.8, head.len - 0.4), 1.4), R, head.side, 0, 1.4);
      // wardrobe on a perpendicular side
      const perp = sides.filter((s) => s.side !== head.side && s.side !== opp[head.side]).sort((a, b) => score(b, 2) - score(a, 2))[0];
      const wl = perp ? Math.min(2.4, perp.len - 2.4) : 0;
      if (perp && wl >= 1.0 && depthOf(R, perp.side) >= bw + 1.8) put(wardrobe(style, wl), R, perp.side, awayFrom(perp.side, head.side, (perp.len - wl) / 2 - 0.05));
      else {
        const far = sides.find((s) => s.side === opp[head.side])!;
        if (depthOf(R, head.side) >= 2.05 + 0.1 + 0.6 + 0.7 && far.door < 0.15) put(wardrobe(style, Math.min(2.4, far.len - 0.4)), R, far.side);
      }
    } else if (type === 'living' || type === 'dining') {
      const long = W >= D ? W : D;
      const alongX = W >= D;
      // a long living room also gets a dining area at one end
      let LR = R, DR: Rect | null = type === 'dining' ? R : null;
      if (type === 'living' && long >= 6.4 && Math.min(W, D) >= 2.8) {
        const cut = long * 0.6;
        LR = alongX ? { ...R, x1: R.x0 + cut } : { ...R, y1: R.y0 + cut };
        DR = alongX ? { ...R, x0: R.x0 + cut } : { ...R, y0: R.y0 + cut };
      }
      if (type === 'living') {
        const lw = LR.x1 - LR.x0, ld = LR.y1 - LR.y0;
        const ls = (['N', 'S', 'E', 'W'] as Side[]).map((s) => sideInfo(g, LR, s, room.id));
        if (style.id === 'najdi' && lw >= 3 && ld >= 3) {
          // majlis: seating on three walls
          const back = ls.filter((s) => s.door < 0.1).sort((a, b) => b.wall - a.wall)[0] || ls[0];
          put(majlisSeat(style, back.len - 0.1), LR, back.side);
          for (const s of ls) if (s.side !== back.side && s.side !== opp[back.side] && s.door < 0.2) put(majlisSeat(style, Math.max(1, s.len - 1.0)), LR, s.side, -0.1);
          put(rug(style, Math.min(lw, ld) - 1.8, Math.min(lw, ld) - 1.8), LR, back.side, 0, 0.9);
        } else {
          const sf = ls.filter((s) => depthOf(LR, s.side) >= 3).sort((a, b) => score(b, 0.5) - score(a, 0.5))[0];
          if (sf) {
            const slen = Math.min(2.6, sf.len - 0.6);
            if (slen >= 1.6) {
              put(sofa(style, slen), LR, sf.side);
              put(rug(style, Math.min(3, sf.len - 0.4), 2.0), LR, sf.side, 0, 0.75);
              put(coffeeTable(style), LR, sf.side, 0, 1.4);
              const tv = ls.find((s) => s.side === opp[sf.side])!;
              if (tv.door < 0.3 && depthOf(LR, sf.side) >= 3.2) put(tvUnit(style, Math.min(2, tv.len - 0.6)), LR, tv.side);
            }
          }
          put(plant(style), LR, ls.sort((a, b) => b.wall - a.wall)[0].side, Math.max(0, (Math.min(lw, ld) / 2) - 0.4));
        }
      }
      if (DR) {
        const dw = DR.x1 - DR.x0, dd = DR.y1 - DR.y0;
        const alongDX = dw >= dd;
        const tl = Math.min(2.2, Math.max(dw, dd) - 1.6);
        if (tl >= 1.0 && Math.min(dw, dd) >= 2.4) {
          const set = diningSet(style, tl, tl >= 1.8 ? 6 : 4);
          putCenter(set, DR, alongDX);
        }
      }
    } else if (type === 'kitchen') {
      const run = best(1, (s) => s.door < 0.35);
      if (!run) continue;
      const len = run.len - 0.1;
      put(kitchenRun(style, len, run.win < 0.2, true), R, run.side);
      const perp = sides.filter((s) => s.side !== run.side && s.side !== opp[run.side] && s.door < 0.2).sort((a, b) => b.wall - a.wall)[0];
      if (perp && perp.len > 1.8) {
        const pl = Math.min(perp.len - 0.75, 2.8);
        put(kitchenRun(style, pl, perp.win < 0.2, false), R, perp.side, -awayFrom(perp.side, run.side, perp.len / 2 - (0.66 + pl / 2)));
      }
      if (W >= 3.6 && D >= 3.6) putCenter(island(style), R, W >= D);
    } else if (type === 'bath') {
      if (W < 1.1 || D < 1.1) continue;
      const order = sides.slice().sort((a, b) => score(b, 0.5) - score(a, 0.5));
      const s1 = order[0], s2 = order.find((s) => s.side !== s1.side && s.side !== opp[s1.side]);
      put(toilet(style), R, s1.side, s1.len / 2 - 0.35);
      if (s2 && s2.len >= 1.5) put(vanity(style, Math.min(1.0, s2.len - 0.9)), R, s2.side, awayFrom(s2.side, s1.side, s2.len / 2 - Math.min(1.0, s2.len - 0.9) / 2 - 0.05));
      if (room.area >= 3.2 && s1.len >= 2.0) put(shower(style, 0.9), R, s1.side, -(s1.len / 2 - 0.5));
    } else if (type === 'office') {
      const s1 = best(0);
      if (s1 && s1.len >= 1.5 && depthOf(R, s1.side) >= 1.6) put(desk(style), R, s1.side);
      put(plant(style), R, opp[s1.side], lenOf(R, opp[s1.side]) / 2 - 0.35);
    } else if (type === 'hall') {
      if (Math.min(W, D) >= 1.4) { const s1 = best(0, (s) => s.len >= 1.4); if (s1) put(console_(style), R, s1.side); }
    } else if (type === 'balcony') {
      if (W >= 1.6 && D >= 1.6) putCenter(outdoorSet(style), R, W >= D);
    }
  }
  return root;
}
