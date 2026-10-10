// Render-only scene upgrade for the path tracer (runs on the cloned scene, never on the live viewer):
// rounded edges on furniture, physically based materials with procedural maps (wood grain, fabric
// weave, plaster, floor joints as relief), curtains at windows and warm ceiling lights for interiors.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { Plan } from './plan.ts';
import type { Style } from './styles.ts';

export type KitInput = {
  root: THREE.Object3D;          // cloned model group (walls, floors, furniture…)
  scene: THREE.Scene;
  plan: Plan;
  style: Style;
  toWorld: (x: number, y: number) => THREE.Vector3;
  interior: boolean;
};

// ---------------------------------------------------------------- procedural maps
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function canvas(S: number) {
  const c = document.createElement('canvas');
  c.width = c.height = S;
  return { c, g: c.getContext('2d', { willReadFrequently: true })! };
}
function tex(c: HTMLCanvasElement, srgb: boolean) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  return t;
}
/** Height (canvas luminance) → tangent-space normal map. */
function normalFrom(src: HTMLCanvasElement, strength: number) {
  const S = src.width;
  const d = src.getContext('2d', { willReadFrequently: true })!.getImageData(0, 0, S, S).data;
  const h = (x: number, y: number) => { const i = (((y + S) % S) * S + ((x + S) % S)) * 4; return (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) / 255; };
  const { c, g } = canvas(S);
  const out = g.createImageData(S, S);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const dx = (h(x + 1, y) - h(x - 1, y)) * strength;
    const dy = (h(x, y + 1) - h(x, y - 1)) * strength;
    const n = new THREE.Vector3(-dx, -dy, 1).normalize();
    const i = (y * S + x) * 4;
    out.data[i] = (n.x * 0.5 + 0.5) * 255; out.data[i + 1] = (n.y * 0.5 + 0.5) * 255; out.data[i + 2] = (n.z * 0.5 + 0.5) * 255; out.data[i + 3] = 255;
  }
  g.putImageData(out, 0, 0);
  return tex(c, false);
}
const cache = new Map<string, any>();
const once = <T>(k: string, f: () => T): T => { if (!cache.has(k)) cache.set(k, f()); return cache.get(k); };

/** Fine fabric weave height. */
const weaveNormal = () => once('weave', () => {
  const S = 256, { c, g } = canvas(S), r = rng(7);
  g.fillStyle = '#808080'; g.fillRect(0, 0, S, S);
  const n = 64, s = S / n;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const over = (x + y) % 2 === 0;
    const v = 110 + Math.round(r() * 30) + (over ? 40 : 0);
    g.fillStyle = `rgb(${v},${v},${v})`;
    if (over) g.fillRect(x * s, y * s + s * 0.15, s, s * 0.7); else g.fillRect(x * s + s * 0.15, y * s, s * 0.7, s);
  }
  return normalFrom(c, 2.2);
});
/** Soft plaster / paint unevenness. */
const plasterNormal = () => once('plaster', () => {
  const S = 256, { c, g } = canvas(S), r = rng(11);
  g.fillStyle = '#808080'; g.fillRect(0, 0, S, S);
  for (let k = 0; k < 1400; k++) { const v = 100 + r() * 60; g.fillStyle = `rgba(${v},${v},${v},0.25)`; g.beginPath(); g.arc(r() * S, r() * S, 1 + r() * 5, 0, 7); g.fill(); }
  return normalFrom(c, 0.9);
});
/** Pile for rugs. */
const pileNormal = () => once('pile', () => {
  const S = 256, { c, g } = canvas(S), r = rng(5);
  for (let k = 0; k < 9000; k++) { const v = r() * 255; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(r() * S, r() * S, 2, 2); }
  return normalFrom(c, 3);
});
/** Wood grain albedo tinted to the colour + matching relief. */
function woodMaps(color: string) {
  return once('wood' + color, () => {
    const S = 512, { c, g } = canvas(S), r = rng(color.length * 31 + parseInt(color.slice(1), 16) % 997);
    const base = new THREE.Color(color);
    g.fillStyle = '#' + base.getHexString(); g.fillRect(0, 0, S, S);
    for (let k = 0; k < 220; k++) {
      const y = r() * S, amp = 2 + r() * 6, dark = r() < 0.5;
      const col = base.clone().multiplyScalar(dark ? 0.78 + r() * 0.12 : 1.06 + r() * 0.1);
      g.strokeStyle = '#' + col.getHexString(); g.globalAlpha = 0.25 + r() * 0.35; g.lineWidth = 0.6 + r() * 2.4;
      g.beginPath(); g.moveTo(0, y);
      for (let x = 0; x <= S; x += 32) g.lineTo(x, y + Math.sin(x / (40 + r() * 60) + k) * amp);
      g.stroke();
    }
    g.globalAlpha = 1;
    return { map: tex(c, true), normal: normalFrom(c, 1.2) };
  });
}

// ---------------------------------------------------------------- geometry helpers
/** Box projection UVs in metres so tiled maps keep their real scale on any object. */
function boxUV(geo: THREE.BufferGeometry, metres: number) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  const p = g.getAttribute('position'), n = g.getAttribute('normal');
  if (!p || !n) return geo;
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    let u: number, v: number;
    if (ay >= ax && ay >= az) { u = p.getX(i); v = p.getZ(i); }
    else if (ax >= az) { u = p.getZ(i); v = p.getY(i); }
    else { u = p.getX(i); v = p.getY(i); }
    uv[i * 2] = u / metres; uv[i * 2 + 1] = v / metres;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
}

// ---------------------------------------------------------------- material classes
type Kind = 'fabric' | 'rug' | 'wood' | 'metal' | 'stone' | 'ceramic' | 'screen' | 'mirror' | 'glass' | 'leaf' | 'plaster' | 'frame' | 'floor' | 'other';

function kindOf(mesh: THREE.Mesh, m: THREE.MeshStandardMaterial, s: Style): Kind {
  const name = mesh.name;
  if (name === 'walls' || name === 'lintels' || name === 'ceiling') return 'plaster';
  if (name === 'glass') return 'glass';
  if (name === 'window-frames') return 'frame';
  if (name === 'doors') return 'wood';
  if (name.startsWith('floor-')) return 'floor';
  if (m.transparent && m.opacity < 0.6) return 'glass';
  const hex = '#' + m.color.getHexString().toUpperCase();
  const is = (...c: string[]) => c.some((x) => x.toUpperCase() === hex);
  if (is(s.rug)) return 'rug';
  if (is(s.fabric, s.fabric2, s.linen)) return 'fabric';
  if (is(s.wood, s.woodDark, s.door)) return 'wood';
  if (m.metalness >= 0.5 || is(s.metal)) return 'metal';
  if (is(s.stone)) return 'stone';
  if (is('#FFFFFF', '#F4F4F2', '#F4F3F0', '#F2F0EC')) return 'ceramic';
  if (is('#111418', '#15171A', '#1D1D1D')) return 'screen';
  if (is('#CFE3EE')) return 'mirror';
  if (is('#4E7A4A')) return 'leaf';
  return 'other';
}

function upgrade(kind: Kind, m: THREE.MeshStandardMaterial): THREE.MeshPhysicalMaterial {
  const p = new THREE.MeshPhysicalMaterial({ color: m.color.clone(), roughness: m.roughness, metalness: m.metalness, map: m.map || null, side: m.side });
  switch (kind) {
    case 'fabric':
      p.roughness = 0.92; p.sheen = 1; p.sheenRoughness = 0.55; p.sheenColor = m.color.clone().lerp(new THREE.Color('#ffffff'), 0.45);
      p.normalMap = weaveNormal(); p.normalScale.set(0.6, 0.6); break;
    case 'rug':
      p.roughness = 1; p.sheen = 1; p.sheenRoughness = 0.8; p.sheenColor = m.color.clone().lerp(new THREE.Color('#ffffff'), 0.3);
      p.normalMap = pileNormal(); p.normalScale.set(0.9, 0.9); break;
    case 'wood': {
      const w = woodMaps('#' + m.color.getHexString());
      p.map = w.map; p.color.set('#ffffff'); p.normalMap = w.normal; p.normalScale.set(0.35, 0.35);
      p.roughness = 0.48; p.clearcoat = 0.25; p.clearcoatRoughness = 0.35; break;
    }
    case 'metal': p.metalness = 1; p.roughness = 0.32; break;
    case 'stone': p.roughness = 0.14; p.clearcoat = 0.6; p.clearcoatRoughness = 0.08; break;
    case 'ceramic': p.roughness = 0.12; p.clearcoat = 1; p.clearcoatRoughness = 0.04; break;
    case 'screen': p.roughness = 0.06; p.metalness = 0.1; p.clearcoat = 1; break;
    case 'mirror': p.color.set('#f4f6f7'); p.metalness = 1; p.roughness = 0.02; break;
    case 'glass':
      // mostly see-through with a faint reflection; alpha (not transmission) so sunlight still reaches inside
      p.color.set('#eef5f8'); p.roughness = 0.02; p.metalness = 0; p.transparent = true; p.opacity = 0.12; p.depthWrite = false; break;
    case 'leaf': p.roughness = 0.55; p.sheen = 0.4; p.sheenColor = new THREE.Color('#9fd18f'); p.color.set('#3f6e3b'); break;
    case 'plaster': p.roughness = 0.9; p.normalMap = plasterNormal(); p.normalScale.set(0.25, 0.25); break;
    case 'frame': p.roughness = 0.4; p.metalness = 0.6; break;
    case 'floor': {
      p.normalMap = m.map ? once('fn' + m.map.uuid, () => { const n = normalFrom(m.map!.image as HTMLCanvasElement, 1.6); return n; }) : null;
      if (p.normalMap) p.normalScale.set(0.7, 0.7);
      const marble = m.roughness <= 0.3;
      p.roughness = marble ? 0.12 : 0.42; p.clearcoat = marble ? 0.6 : 0.15; p.clearcoatRoughness = marble ? 0.05 : 0.25; break;
    }
  }
  return p;
}

// ---------------------------------------------------------------- additions
function curtainGeometry(w: number, h: number, folds: number) {
  const g = new THREE.PlaneGeometry(w, h, Math.max(12, folds * 6), 1);
  const p = g.getAttribute('position');
  for (let i = 0; i < p.count; i++) { const x = p.getX(i); p.setZ(i, Math.sin((x / w) * folds * Math.PI * 2) * 0.035); }
  g.computeVertexNormals();
  return boxUV(g, 0.25);
}

function addCurtains(k: KitInput, parent: THREE.Object3D) {
  const { plan, toWorld, style } = k;
  const g = plan.grid;
  const roomIds = new Set(plan.rooms.filter((r) => r.type !== 'balcony').map((r) => r.id));
  const roomAt = (x: number, y: number) => {
    const i = Math.round((x - g.x0) / g.cell), j = Math.round((y - g.y0) / g.cell);
    if (i < 0 || j < 0 || i >= g.w || j >= g.h) return 0;
    return g.room[j * g.w + i];
  };
  const fabric = upgrade('fabric', new THREE.MeshStandardMaterial({ color: style.linen, roughness: 0.95 }));
  fabric.side = THREE.DoubleSide;
  const rod = upgrade('metal', new THREE.MeshStandardMaterial({ color: style.metal, metalness: 1 }));
  const H = plan.height;
  for (const o of plan.openings) {
    if (o.kind !== 'window' || o.width < 0.6) continue;
    const nx = -o.uy, ny = o.ux;
    const off = o.t / 2 + 0.3;
    let sgn = 0;
    if (roomIds.has(roomAt(o.cx + nx * off, o.cy + ny * off))) sgn = 1;
    else if (roomIds.has(roomAt(o.cx - nx * off, o.cy - ny * off))) sgn = -1;
    if (!sgn) continue;
    const c = toWorld(o.cx, o.cy);
    const along = toWorld(o.cx + o.ux, o.cy + o.uy).sub(c).normalize();
    const inward = toWorld(o.cx + nx * sgn, o.cy + ny * sgn).sub(c).normalize();
    const basis = new THREE.Matrix4().makeBasis(along, new THREE.Vector3(0, 1, 0), inward);
    const grp = new THREE.Group();
    grp.applyMatrix4(basis);
    grp.position.copy(c).addScaledVector(inward, o.t / 2 + 0.1);
    const top = Math.min(H - 0.04, 2.6), bottom = 0.03, ph = top - bottom;
    const pw = Math.max(0.35, Math.min(0.7, o.width * 0.28));
    for (const s of [-1, 1]) {
      const m = new THREE.Mesh(curtainGeometry(pw, ph, Math.round(pw / 0.12)), fabric);
      m.position.set(s * (o.width / 2 + pw / 2 - 0.1), bottom + ph / 2, 0);
      m.castShadow = true; m.receiveShadow = true;
      grp.add(m);
    }
    const r = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, o.width + pw * 2, 10), rod);
    r.rotation.z = Math.PI / 2; r.position.set(0, top + 0.02, 0);
    grp.add(r);
    parent.add(grp);
  }
}

/** Thick slabs above the ceiling and under the floor so daylight cannot leak through hairline gaps. */
function addSealSlabs(k: KitInput) {
  const b = k.plan.bounds, H = k.plan.height;
  const a = k.toWorld(b.x0, b.y0), c = k.toWorld(b.x1, b.y1);
  const w = Math.abs(c.x - a.x) + 0.6, d = Math.abs(c.z - a.z) + 0.6;
  const cx = (a.x + c.x) / 2, cz = (a.z + c.z) / 2;
  const mat = new THREE.MeshPhysicalMaterial({ color: '#d8d4cc', roughness: 1 });
  const top = new THREE.Mesh(new THREE.BoxGeometry(w, 0.2, d), mat);
  top.position.set(cx, H + 0.105, cz);
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(w, 0.2, d), mat);
  bottom.position.set(cx, -0.115, cz);
  k.scene.add(top, bottom);
}

function addCeilingLights(k: KitInput) {
  const H = k.plan.height;
  for (const room of k.plan.rooms) {
    if (room.type === 'balcony' || room.area < 2) continue;
    const c = k.toWorld(room.center.x, room.center.y);
    // larger, softer panels converge with far less speckle than small bright ones
    const size = room.area > 14 ? 1.2 : 0.8;
    const light = new THREE.RectAreaLight('#FFD3A1', room.area > 14 ? 4 : 3, size, size);
    light.position.set(c.x, H - 0.03, c.z);
    light.rotation.x = -Math.PI / 2;
    k.scene.add(light);
  }
}

/** Upgrades the cloned scene in place for the path tracer. */
export function enhanceForRender(k: KitInput) {
  const swap = new Map<THREE.Material, THREE.Material>();
  const meshes: THREE.Mesh[] = [];
  k.root.traverse((o) => { if ((o as THREE.Mesh).isMesh && o.visible) meshes.push(o as THREE.Mesh); });
  for (const mesh of meshes) {
    const m = mesh.material as THREE.MeshStandardMaterial;
    if (!m || Array.isArray(m) || !(m as any).isMeshStandardMaterial) continue;
    const kind = kindOf(mesh, m, k.style);
    // rounded edges on furniture boxes: soft for upholstery, a fine bevel elsewhere
    const geo = mesh.geometry as THREE.BoxGeometry;
    if (geo.type === 'BoxGeometry' && geo.parameters) {
      const { width: w, height: h, depth: d } = geo.parameters;
      const min = Math.min(w, h, d);
      const r = kind === 'fabric' ? Math.min(0.06, min * 0.35) : kind === 'rug' ? 0 : Math.min(0.01, min * 0.3);
      if (r > 0.002 && min > 0.015) mesh.geometry = new RoundedBoxGeometry(w, h, d, kind === 'fabric' ? 4 : 2, r);
    }
    if (kind === 'wood' || kind === 'fabric' || kind === 'rug' || kind === 'plaster') mesh.geometry = boxUV(mesh.geometry, kind === 'wood' ? 1.2 : kind === 'plaster' ? 1.5 : 0.35);
    if (kind === 'other') continue;
    const key = kind + ':' + m.uuid;
    let nm = swap.get(m as any);
    if (!nm || (nm as any).userData.kind !== key) { nm = upgrade(kind, m); nm.userData.kind = key; swap.set(m, nm); }
    mesh.material = nm;
  }
  addCurtains(k, k.root);
  if (k.interior) { addSealSlabs(k); addCeilingLights(k); }
}
