// 4K export: ESRGAN (UpscalerJS, esrgan-medium ×3, MIT) runs in the browser with TensorFlow.js,
// then the result is fitted to 3840 px on the long side. Loaded only when someone asks for 4K.
import '@tensorflow/tfjs';
import Upscaler from 'upscaler';
import x3 from '@upscalerjs/esrgan-medium/3x';

const TARGET = 3840;
let upscaler: InstanceType<typeof Upscaler> | null = null;

const load = (src: string) => new Promise<HTMLImageElement>((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = bad; i.src = src; });

/** Upscales an image (data/object URL) to about 4K and returns a JPEG data URL. */
export async function to4k(src: string, modelUrl: string, onProgress?: (pct: number) => void, signal?: AbortSignal): Promise<string> {
  if (!upscaler) upscaler = new Upscaler({ model: { ...x3, path: new URL(modelUrl, location.href).href } as any });
  const img = await load(src);
  // feed at most 1600 px wide so ×3 lands just above 4K
  const scaleIn = Math.min(1, 1600 / Math.max(img.width, img.height));
  const c = document.createElement('canvas');
  c.width = Math.round(img.width * scaleIn); c.height = Math.round(img.height * scaleIn);
  c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
  const big = await upscaler.upscale(c, {
    output: 'base64', patchSize: 96, padding: 6, awaitNextFrame: true, signal,
    progress: (p: number) => onProgress?.(Math.round(p * 100)),
  });
  const up = await load(big as string);
  const k = TARGET / Math.max(up.width, up.height);
  const out = document.createElement('canvas');
  out.width = Math.round(up.width * Math.min(1, k)); out.height = Math.round(up.height * Math.min(1, k));
  const g = out.getContext('2d')!;
  g.imageSmoothingQuality = 'high';
  g.drawImage(up, 0, 0, out.width, out.height);
  return out.toDataURL('image/jpeg', 0.92);
}
