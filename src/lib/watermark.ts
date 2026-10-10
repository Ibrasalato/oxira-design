// "Made with Oxira Design" mark on exported images (studio PNG, free AI renders).
export async function watermark(src: string, type = 'image/png'): Promise<Blob> {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = src;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const g = c.getContext('2d')!;
  g.drawImage(img, 0, 0);
  const s = Math.max(12, Math.round(c.width / 70));
  g.font = `600 ${s}px "IBM Plex Sans", system-ui, sans-serif`;
  const text = 'Made with Oxira Design · design.oxira.sa';
  const w = g.measureText(text).width + s * 1.4, h = s * 2;
  const x = c.width - w - s, y = c.height - h - s;
  g.fillStyle = 'rgba(10, 37, 62, 0.78)';
  g.beginPath(); g.roundRect(x, y, w, h, h / 2); g.fill();
  g.fillStyle = '#fff'; g.textBaseline = 'middle';
  g.fillText(text, x + s * 0.7, y + h / 2 + 1);
  return new Promise((ok, no) => c.toBlob((b) => (b ? ok(b) : no(new Error('blob'))), type, 0.92));
}
