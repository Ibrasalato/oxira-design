// Interior style presets and procedural floor textures (drawn on canvas, no image files).
import * as THREE from 'three';

export type TexKind = 'planks' | 'tiles' | 'marble' | 'terracotta' | 'concrete';
export type TexSpec = { kind: TexKind; base: string; alt: string; joint: string; size: number }; // size = metres per texture repeat
export type StyleId = 'modern' | 'classic' | 'najdi' | 'scandi' | 'luxury';
export type Style = {
  id: StyleId;
  wall: string; accentWall: string; ceiling: string; door: string; frame: string; glass: string;
  floor: { dry: TexSpec; wet: TexSpec; kitchen: TexSpec; outdoor: TexSpec };
  fabric: string; fabric2: string; wood: string; woodDark: string; metal: string; linen: string; rug: string; stone: string;
  ground: string; sky: string;
};

export const STYLES: Record<StyleId, Style> = {
  modern: {
    id: 'modern', wall: '#F2F1EE', accentWall: '#2F3B45', ceiling: '#FFFFFF', door: '#E9E6E1', frame: '#3A3F44', glass: '#9EC9E2',
    floor: {
      dry: { kind: 'planks', base: '#C8A57A', alt: '#B48D63', joint: '#8C6B47', size: 2.4 },
      wet: { kind: 'tiles', base: '#D9D9D6', alt: '#CFCFCB', joint: '#B5B5B0', size: 1.2 },
      kitchen: { kind: 'tiles', base: '#E4E2DD', alt: '#D9D6D0', joint: '#BDB9B2', size: 2.4 },
      outdoor: { kind: 'concrete', base: '#BDBAB3', alt: '#B0ADA6', joint: '#9C9891', size: 2 },
    },
    fabric: '#5B6670', fabric2: '#C9C4BB', wood: '#B98E5E', woodDark: '#4A3B30', metal: '#1F2328', linen: '#F4F2EE', rug: '#D8D2C6', stone: '#E8E6E2',
    ground: '#E7EBEE', sky: '#F3F6F8',
  },
  classic: {
    id: 'classic', wall: '#EFE6D6', accentWall: '#7A5C44', ceiling: '#FBF7F0', door: '#5E4331', frame: '#C9A86A', glass: '#A9C8D8',
    floor: {
      dry: { kind: 'planks', base: '#7B5434', alt: '#6A4529', joint: '#3F2716', size: 1.6 },
      wet: { kind: 'marble', base: '#EFE9DD', alt: '#D9CDB6', joint: '#C7B998', size: 1.2 },
      kitchen: { kind: 'marble', base: '#F1EBE0', alt: '#DCCFB8', joint: '#C9BB9C', size: 1.6 },
      outdoor: { kind: 'tiles', base: '#CDBBA0', alt: '#C0AD90', joint: '#A08E72', size: 1.6 },
    },
    fabric: '#8C2F39', fabric2: '#E3D3B5', wood: '#6B4429', woodDark: '#3B2617', metal: '#B8963E', linen: '#F7F1E6', rug: '#9B4A3B', stone: '#EFE9DD',
    ground: '#EDE7DD', sky: '#F7F3EC',
  },
  najdi: {
    id: 'najdi', wall: '#E3CFAE', accentWall: '#A8643C', ceiling: '#F3E6CF', door: '#5A3B22', frame: '#3B2615', glass: '#9FC2CF',
    floor: {
      dry: { kind: 'terracotta', base: '#C98B5E', alt: '#B9774A', joint: '#E8D6BC', size: 1.2 },
      wet: { kind: 'tiles', base: '#E6D8C2', alt: '#DCCBB1', joint: '#C4B194', size: 0.8 },
      kitchen: { kind: 'terracotta', base: '#D29A6E', alt: '#C3875B', joint: '#EAD9C0', size: 1.2 },
      outdoor: { kind: 'concrete', base: '#D6C1A0', alt: '#CBB492', joint: '#B59D7A', size: 2 },
    },
    fabric: '#9E2B25', fabric2: '#E8D8BC', wood: '#7A4E2C', woodDark: '#3E2716', metal: '#8E6B3A', linen: '#F2E8D6', rug: '#8E2F24', stone: '#E6D8C2',
    ground: '#EADBC3', sky: '#F6EEE2',
  },
  scandi: {
    id: 'scandi', wall: '#FAFAF8', accentWall: '#9DB3A8', ceiling: '#FFFFFF', door: '#FFFFFF', frame: '#D9D6D0', glass: '#B8D6E6',
    floor: {
      dry: { kind: 'planks', base: '#E2CDAF', alt: '#D6BE9C', joint: '#B9A07D', size: 2.4 },
      wet: { kind: 'tiles', base: '#F0F0EE', alt: '#E8E8E5', joint: '#CFCFCB', size: 0.6 },
      kitchen: { kind: 'planks', base: '#E2CDAF', alt: '#D6BE9C', joint: '#B9A07D', size: 2.4 },
      outdoor: { kind: 'planks', base: '#A98D6E', alt: '#9A7F61', joint: '#7C6449', size: 1.8 },
    },
    fabric: '#B9BDB8', fabric2: '#E9E4DA', wood: '#D9BF97', woodDark: '#8A7358', metal: '#2B2B2B', linen: '#FFFFFF', rug: '#EDE8DF', stone: '#F0F0EE',
    ground: '#EEF1F0', sky: '#F7F9F9',
  },
  luxury: {
    id: 'luxury', wall: '#D9D4CE', accentWall: '#2C2A29', ceiling: '#F5F3F0', door: '#2E2722', frame: '#B8913F', glass: '#8FB2C4',
    floor: {
      dry: { kind: 'marble', base: '#F2F0EC', alt: '#C9C3BA', joint: '#B5AFA6', size: 1.2 },
      wet: { kind: 'marble', base: '#2D2B2A', alt: '#6A6560', joint: '#1B1A19', size: 1.2 },
      kitchen: { kind: 'marble', base: '#F4F2EE', alt: '#CFC8BF', joint: '#BAB3A9', size: 1.2 },
      outdoor: { kind: 'tiles', base: '#B9B3AA', alt: '#ADA79E', joint: '#958F86', size: 1.2 },
    },
    fabric: '#2F4A47', fabric2: '#D7CDBD', wood: '#3E2F26', woodDark: '#221A15', metal: '#C6A15B', linen: '#F6F3EE', rug: '#BFB3A1', stone: '#F2F0EC',
    ground: '#E6E3DE', sky: '#F2F0ED',
  },
};

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function mix(a: string, b: string, t: number) {
  return '#' + new THREE.Color(a).lerp(new THREE.Color(b), t).getHexString();
}

const cache = new Map<string, THREE.Texture>();

export function floorTexture(spec: TexSpec): THREE.Texture | null {
  if (typeof document === 'undefined') return null;
  const key = JSON.stringify(spec);
  const hit = cache.get(key);
  if (hit) return hit;
  const S = 512;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const g = cv.getContext('2d')!;
  const r = rng(spec.base.length * 977 + spec.size * 131);
  g.fillStyle = spec.base;
  g.fillRect(0, 0, S, S);

  if (spec.kind === 'planks') {
    const rows = 12, rh = S / rows;
    for (let y = 0; y < rows; y++) {
      let x = -r() * S * 0.6;
      while (x < S) {
        const len = S * (0.35 + r() * 0.4);
        g.fillStyle = mix(spec.base, spec.alt, r());
        g.fillRect(x, y * rh, len, rh);
        // grain
        g.globalAlpha = 0.12;
        for (let k = 0; k < 6; k++) {
          g.strokeStyle = spec.joint;
          g.lineWidth = 1;
          g.beginPath();
          const yy = y * rh + r() * rh;
          g.moveTo(x, yy);
          g.bezierCurveTo(x + len * 0.3, yy + (r() - 0.5) * 6, x + len * 0.6, yy + (r() - 0.5) * 6, x + len, yy);
          g.stroke();
        }
        g.globalAlpha = 1;
        g.fillStyle = spec.joint;
        g.fillRect(x, y * rh, 2, rh);
        x += len;
      }
      g.fillStyle = spec.joint;
      g.fillRect(0, y * rh, S, 1.5);
    }
  } else if (spec.kind === 'tiles' || spec.kind === 'terracotta') {
    const n = spec.kind === 'terracotta' ? 4 : 2, ts = S / n;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      g.fillStyle = mix(spec.base, spec.alt, spec.kind === 'terracotta' ? r() : r() * 0.5);
      g.fillRect(x * ts, y * ts, ts, ts);
      if (spec.kind === 'terracotta') {
        g.globalAlpha = 0.08;
        for (let k = 0; k < 40; k++) { g.fillStyle = r() > 0.5 ? '#ffffff' : '#5a2d14'; g.fillRect(x * ts + r() * ts, y * ts + r() * ts, 3, 3); }
        g.globalAlpha = 1;
      }
    }
    g.fillStyle = spec.joint;
    const jw = spec.kind === 'terracotta' ? 6 : 3;
    for (let k = 0; k <= n; k++) { g.fillRect(k * ts - jw / 2, 0, jw, S); g.fillRect(0, k * ts - jw / 2, S, jw); }
  } else if (spec.kind === 'marble') {
    g.globalAlpha = 0.35;
    for (let k = 0; k < 26; k++) {
      g.strokeStyle = mix(spec.alt, spec.base, r() * 0.6);
      g.lineWidth = 0.6 + r() * 2.2;
      g.beginPath();
      let x = r() * S, y = r() * S;
      g.moveTo(x, y);
      for (let s = 0; s < 6; s++) { const nx = x + (r() - 0.3) * 160, ny = y + (r() - 0.5) * 120; g.quadraticCurveTo((x + nx) / 2 + (r() - 0.5) * 60, (y + ny) / 2 + (r() - 0.5) * 60, nx, ny); x = nx; y = ny; }
      g.stroke();
    }
    g.globalAlpha = 1;
    g.fillStyle = spec.joint;
    g.fillRect(0, 0, S, 1.5); g.fillRect(0, S / 2, S, 1.5); g.fillRect(0, 0, 1.5, S); g.fillRect(S / 2, 0, 1.5, S);
  } else {
    g.globalAlpha = 0.07;
    for (let k = 0; k < 3000; k++) { g.fillStyle = r() > 0.5 ? '#ffffff' : '#000000'; g.fillRect(r() * S, r() * S, 2, 2); }
    g.globalAlpha = 1;
    g.fillStyle = spec.joint;
    g.fillRect(0, 0, S, 2); g.fillRect(0, 0, 2, S);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  cache.set(key, tex);
  return tex;
}
