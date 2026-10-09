// Generates concept plans for a few briefs, checks that the studio's DXF engine reads them back
// (walls, doors, windows, rooms), and writes SVG previews.
// node --experimental-strip-types scripts/test-planner.ts
import fs from 'node:fs';
import path from 'node:path';
import { generate, defaultBrief, totals, geometry, type Brief, type Kind } from '../src/scripts/planner/model.ts';
import { floorSvg, toDxf } from '../src/scripts/planner/render.ts';
import { readDxf } from '../src/scripts/studio/dxf.ts';
import { buildPlan } from '../src/scripts/studio/plan.ts';

const outDir = process.env.OUT || '/tmp/claude-0/planner-test';
fs.mkdirSync(outDir, { recursive: true });
const AR: Record<Kind, string> = { entrance: 'مدخل', hall: 'صالة توزيع', living: 'صالة معيشة', majlis: 'مجلس رجال', ladies: 'مجلس نساء', dining: 'طعام', kitchen: 'مطبخ', master: 'غرفة نوم رئيسية', bedroom: 'غرفة نوم', guest: 'غرفة ضيوف', bath: 'حمام', wc: 'دورة مياه', dress: 'غرفة ملابس', maid: 'غرفة خادمة', driver: 'غرفة سائق', laundry: 'غسيل', store: 'مستودع', office: 'مكتب', prayer: 'مصلى', stair: 'درج', lift: 'مصعد', landing: 'بهو', shop: 'محل', parking: 'مواقف', terrace: 'سطح', void: 'منور', garage: 'كراج' };

const cases: [string, (b: Brief) => void][] = [
  ['villa-20x25', () => {}],
  ['villa-15x30', (b) => { b.land.w = 15; b.land.d = 30; b.villa.bedrooms = 4; }],
  ['villa-30x20-1floor', (b) => { b.land.w = 30; b.land.d = 20; b.villa.floors = 1; b.villa.roof = false; b.villa.bedrooms = 4; }],
  ['duplex-24x30', (b) => { b.type = 'duplex'; b.land.w = 24; b.land.d = 30; b.villa.bedrooms = 4; b.villa.ladies = false; }],
  ['building-20x30-2apt', (b) => { b.type = 'building'; b.land.w = 20; b.land.d = 30; }],
  ['building-30x30-2apt', (b) => { b.type = 'building'; b.land.w = 30; b.land.d = 30; b.bld.ground = 'apartments'; }],
  ['mixed-25x30-4apt', (b) => { b.type = 'mixed'; b.land.w = 25; b.land.d = 30; b.bld.perFloor = 4; b.bld.beds = 2; }],
  ['istiraha-40x50', (b) => { b.type = 'istiraha'; b.land.w = 40; b.land.d = 50; b.villa.bedrooms = 2; }],
];

for (const [name, mod] of cases) {
  const b = defaultBrief();
  mod(b);
  const p = generate(b);
  const t = totals(p);
  console.log(`\n== ${name}: floors ${p.floors.length}, built ${t.built.toFixed(0)} m², coverage ${(t.coverage * 100).toFixed(0)}%, warnings ${p.warnings.join(',') || '-'}`);
  for (const f of p.floors) {
    const g = geometry(f, f.level === 0);
    const dxf = toDxf(p, [f], { names: (k) => AR[k], m2: 'م²', site: false });
    const file = path.join(outDir, `${name}-${f.key}${f.level}.dxf`);
    fs.writeFileSync(file, dxf);
    const flat = readDxf(dxf);
    const roles = Object.fromEntries(flat.layers.map((l) => [l.name, l.role]));
    const plan = buildPlan(flat, roles, 3);
    const nd = plan.openings.filter((o) => o.kind === 'door').length, nw = plan.openings.filter((o) => o.kind === 'window').length, no = plan.openings.filter((o) => o.kind === 'open').length;
    const gd = g.openings.filter((o) => o.kind === 'door').length, gw = g.openings.filter((o) => o.kind === 'window').length;
    const named = plan.rooms.filter((r) => r.labeled).length;
    console.log(`  ${f.key}${f.level}: rooms ${g.rooms.length} -> studio ${plan.rooms.length} (${named} named) | doors ${gd}->${nd} windows ${gw}->${nw} open ${no} | warn ${plan.warnings.join(',') || '-'}`);
    const { svg } = floorSvg(p, f, { names: (k) => AR[k], fmt: (n, d = 1) => n.toFixed(d), m2: 'م²', street: 'الشارع', edit: false });
    fs.writeFileSync(path.join(outDir, `${name}-${f.key}${f.level}.svg`), svg.replace('<svg ', '<svg width="900" style="background:#fff" '));
  }
}
console.log('\nwrote', outDir);
