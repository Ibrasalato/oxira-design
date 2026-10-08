// Runs the plan engine on the sample drawings and writes an SVG preview of each result.
// node --experimental-strip-types scripts/test-plan.ts [file.dxf ...]
import fs from 'node:fs';
import path from 'node:path';
import { readDxf } from '../src/scripts/studio/dxf.ts';
import { buildPlan } from '../src/scripts/studio/plan.ts';

const files = process.argv.slice(2).length ? process.argv.slice(2) : ['public/samples/apartment-3br.dxf', 'public/samples/studio-ar.dxf'];
const outDir = process.env.OUT || '/tmp/claude-0/plan-test';
fs.mkdirSync(outDir, { recursive: true });

for (const f of files) {
  const t0 = performance.now();
  const flat = readDxf(fs.readFileSync(f, 'utf8'));
  const roles = Object.fromEntries(flat.layers.map((l) => [l.name, l.role]));
  const plan = buildPlan(flat, roles, 3);
  const ms = Math.round(performance.now() - t0);
  console.log(`\n${f}  (${ms} ms)  units ${flat.unitScale}${flat.unitGuessed ? ' (guessed)' : ''}`);
  console.log('layers', flat.layers.map((l) => `${l.name}:${l.role}`).join(', '));
  console.log(`walls ${plan.walls.length}  openings ${plan.openings.map((o) => o.kind[0] + o.width.toFixed(2)).join(' ')}  warnings ${plan.warnings}`);
  let total = 0;
  for (const r of plan.rooms) { total += r.area; console.log(`  #${r.id} ${r.name || '-'} [${r.type}] ${r.area.toFixed(2)} m²  perim ${r.perimeter.toFixed(1)}  doors ${r.doors} win ${r.windows}`); }
  console.log(`  total ${total.toFixed(2)} m²`);

  const b = plan.bounds, s = 60, W = (b.x1 - b.x0) * s + 40, H = (b.y1 - b.y0) * s + 40;
  const X = (x: number) => 20 + (x - b.x0) * s, Y = (y: number) => 20 + (b.y1 - y) * s;
  const col: Record<string, string> = { door: '#c0392b', window: '#2980b9', open: '#f39c12' };
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="background:#fff">`;
  plan.rooms.forEach((r, i) => {
    for (const q of r.rects) svg += `<rect x="${X(q.x0)}" y="${Y(q.y1)}" width="${(q.x1 - q.x0) * s}" height="${(q.y1 - q.y0) * s}" fill="hsl(${(i * 67) % 360} 60% 85%)"/>`;
    svg += `<text x="${X(r.center.x)}" y="${Y(r.center.y)}" font-size="13" text-anchor="middle" font-family="sans-serif">${r.name || r.type} ${r.area.toFixed(1)}</text>`;
  });
  for (const w of plan.walls) {
    const nx = -w.uy, ny = w.ux, h = w.t / 2;
    const p = [[w.ox + nx * h, w.oy + ny * h], [w.ox + w.ux * w.len + nx * h, w.oy + w.uy * w.len + ny * h], [w.ox + w.ux * w.len - nx * h, w.oy + w.uy * w.len - ny * h], [w.ox - nx * h, w.oy - ny * h]];
    svg += `<polygon points="${p.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ')}" fill="${w.single ? '#888' : '#0A253E'}"/>`;
  }
  for (const o of plan.openings) {
    const h = o.width / 2;
    svg += `<line x1="${X(o.cx - o.ux * h)}" y1="${Y(o.cy - o.uy * h)}" x2="${X(o.cx + o.ux * h)}" y2="${Y(o.cy + o.uy * h)}" stroke="${col[o.kind]}" stroke-width="5"/>`;
    if (o.leaf) svg += `<line x1="${X(o.leaf.a.x)}" y1="${Y(o.leaf.a.y)}" x2="${X(o.leaf.b.x)}" y2="${Y(o.leaf.b.y)}" stroke="#c0392b" stroke-width="2"/>`;
  }
  svg += '</svg>';
  fs.writeFileSync(path.join(outDir, path.basename(f) + '.svg'), svg);
}
