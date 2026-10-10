// Progressive path-traced render of the studio model (loaded on demand).
// Physically based light transport with a sun and a sky dome, several light bounces
// (global illumination), auto exposure, a light denoise and a soft bloom/vignette finish,
// in the spirit of Corona Renderer's interactive frame buffer.
import * as THREE from 'three';
import { WebGLPathTracer, GradientEquirectTexture, DenoiseMaterial } from 'three-gpu-pathtracer';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { enhanceForRender } from './renderkit.ts';
import type { Plan } from './plan.ts';
import type { Style } from './styles.ts';

export type Rig = {
  scene: THREE.Scene; camera: THREE.PerspectiveCamera; interior: boolean; sky: string; span: number;
  root: THREE.Object3D; plan: Plan; style: Style; toWorld: (x: number, y: number) => THREE.Vector3;
};
export type TraceOptions = {
  width: number; height: number; samples: number;
  /** called every frame with the live canvas so the page can show it converging */
  onProgress?: (done: number, total: number) => void;
  signal?: AbortSignal;
};
export type Trace = { canvas: HTMLCanvasElement; done: Promise<HTMLCanvasElement>; stop: () => void };

export function supported(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    return !!gl && !!gl.getExtension('EXT_color_buffer_float');
  } catch { return false; }
}

export function trace(rig: Rig, o: TraceOptions): Trace {
  const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1);
  renderer.setSize(o.width, o.height, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMappingExposure = rig.interior ? 1.9 : 1.0;
  const canvas = renderer.domElement;

  // sky dome: deep blue overhead fading to a bright hazy horizon (Corona sun & sky look)
  const sky = new GradientEquirectTexture(256);
  sky.topColor.set(rig.interior ? '#8DB8E8' : '#9CC2EA');
  sky.bottomColor.set(rig.interior ? '#F4F1EA' : rig.sky);
  sky.exponent = 0.7;
  sky.update();
  rig.scene.environment = sky;
  rig.scene.background = sky;
  rig.scene.environmentIntensity = rig.interior ? 1.35 : 1.0;
  rig.scene.backgroundIntensity = 1.0;

  const pt = new WebGLPathTracer(renderer);
  pt.multipleImportanceSampling = true; // needed for the sun (directional light)
  pt.bounces = rig.interior ? 8 : 5;
  pt.transmissiveBounces = 4;
  pt.filterGlossyFactor = rig.interior ? 1 : 0.5; // tames fireflies from light reaching in through windows
  pt.minSamples = 1;
  pt.fadeDuration = 0;
  pt.renderDelay = 0;
  pt.dynamicLowRes = false;
  pt.rasterizeScene = true;
  pt.tiles.set(2, 2);
  pt.textureSize.set(512, 512); // our procedural maps are 512 px; keeps GPU memory low on phones

  const denoise = new FullScreenQuad(new DenoiseMaterial({ map: null } as any));
  const dm = denoise.material as any;
  pt.renderToCanvasCallback = (target, r) => {
    dm.map = target.texture;
    // stronger smoothing while noisy, close to none once converged
    const s = Math.max(1, pt.samples);
    dm.uniforms.threshold.value = Math.max(rig.interior ? 0.03 : 0.015, (rig.interior ? 0.2 : 0.12) / Math.sqrt(s / 8));
    dm.uniforms.sigma.value = rig.interior ? 4.5 : 3.5;
    dm.uniforms.kSigma.value = 1.0;
    const ac = r.autoClear; r.autoClear = false; denoise.render(r); r.autoClear = ac;
  };

  let stopped = false;
  const stop = () => { stopped = true; };
  o.signal?.addEventListener('abort', stop);

  const done = (async () => {
    await new Promise((r) => setTimeout(r, 30)); // let the dialog paint first
    try { enhanceForRender({ root: rig.root, scene: rig.scene, plan: rig.plan, style: rig.style, toWorld: rig.toWorld, interior: rig.interior }); }
    catch (e) { console.warn('render upgrade skipped', e); }
    rig.scene.updateMatrixWorld(true); // the sun's direction comes from its world matrix and its target's
    pt.setScene(rig.scene, rig.camera);
    let measured = 0;
    await new Promise<void>((resolve) => {
      const step = () => {
        if (stopped || pt.samples >= o.samples) return resolve();
        pt.renderSample();
        // auto exposure from the tone-mapped frame, twice early on
        if ((measured === 0 && pt.samples >= 6) || (measured === 1 && pt.samples >= 20)) {
          measured++;
          const m = meanLuma(canvas);
          const target = rig.interior ? 0.44 : 0.47;
          if (m > 0.01) renderer.toneMappingExposure *= Math.min(2.5, Math.max(0.5, (target / m) ** 1.4));
        }
        o.onProgress?.(Math.min(o.samples, Math.floor(pt.samples)), o.samples);
        requestAnimationFrame(step);
      };
      step();
    });
    const out = finish(canvas, rig.interior);
    pt.dispose(); denoise.dispose(); dm.dispose(); sky.dispose(); renderer.dispose();
    return out;
  })();
  return { canvas, done, stop };
}

function meanLuma(src: HTMLCanvasElement) {
  const c = document.createElement('canvas');
  c.width = 48; c.height = Math.max(1, Math.round((48 * src.height) / src.width));
  const g = c.getContext('2d', { willReadFrequently: true })!;
  g.drawImage(src, 0, 0, c.width, c.height);
  const d = g.getImageData(0, 0, c.width, c.height).data;
  let s = 0;
  for (let i = 0; i < d.length; i += 4) s += (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
  return s / (d.length / 4);
}

/** Camera finish: soft bloom from the highlights, a gentle S-curve and a light vignette. */
function finish(src: HTMLCanvasElement, interior: boolean): HTMLCanvasElement {
  const w = src.width, h = src.height;
  const out = document.createElement('canvas');
  out.width = w; out.height = h;
  const g = out.getContext('2d')!;
  g.drawImage(src, 0, 0);

  // bloom: blurred highlights screened over the frame
  const hi = document.createElement('canvas');
  hi.width = Math.round(w / 4); hi.height = Math.round(h / 4);
  const hg = hi.getContext('2d', { willReadFrequently: true })!;
  hg.drawImage(src, 0, 0, hi.width, hi.height);
  const px = hg.getImageData(0, 0, hi.width, hi.height);
  for (let i = 0; i < px.data.length; i += 4) {
    const l = (0.2126 * px.data[i] + 0.7152 * px.data[i + 1] + 0.0722 * px.data[i + 2]) / 255;
    const k = Math.max(0, (l - 0.78) / 0.22);
    px.data[i] *= k; px.data[i + 1] *= k; px.data[i + 2] *= k;
  }
  hg.putImageData(px, 0, 0);
  g.save();
  g.globalCompositeOperation = 'screen';
  g.globalAlpha = interior ? 0.55 : 0.35;
  g.filter = `blur(${Math.round(w / 90)}px)`;
  g.drawImage(hi, 0, 0, w, h);
  g.restore();

  // gentle contrast curve
  const img = g.getImageData(0, 0, w, h);
  const lut = new Uint8ClampedArray(256);
  const a = 0.22; // S-curve strength: slope 1-a in the toe and shoulder, 1+a in the mid-tones
  for (let i = 0; i < 256; i++) { const x = i / 255; lut[i] = Math.round(255 * (x - (a / (2 * Math.PI)) * Math.sin(2 * Math.PI * x))); }
  for (let i = 0; i < img.data.length; i += 4) { img.data[i] = lut[img.data[i]]; img.data[i + 1] = lut[img.data[i + 1]]; img.data[i + 2] = lut[img.data[i + 2]]; }
  g.putImageData(img, 0, 0);

  // vignette
  const r = Math.hypot(w, h) / 2;
  const v = g.createRadialGradient(w / 2, h / 2, r * 0.55, w / 2, h / 2, r);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, `rgba(0,0,0,${interior ? 0.22 : 0.14})`);
  g.fillStyle = v;
  g.fillRect(0, 0, w, h);
  return out;
}
