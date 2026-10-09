// First page of a PDF as a JPEG data URL, rendered in the browser with pdf.js (loaded only when needed).
export const isPdf = (f: File) => f.type === 'application/pdf' || /\.pdf$/i.test(f.name);

export async function pdfToImage(file: Blob, maxSide = 1600): Promise<string> {
  // pdf.js 4 relies on Promise.withResolvers (Safari < 17.4 lacks it)
  const P = Promise as any;
  if (!P.withResolvers) P.withResolvers = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
  const [pdfjs, worker] = await Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')]);
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  try {
    const page = await doc.getPage(1);
    const base = page.getViewport({ scale: 1 });
    const scale = Math.min(4, maxSide / Math.max(base.width, base.height));
    const vp = page.getViewport({ scale });
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(vp.width));
    c.height = Math.max(1, Math.round(vp.height));
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, c.width, c.height);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    return c.toDataURL('image/jpeg', 0.86);
  } finally {
    doc.destroy();
  }
}
