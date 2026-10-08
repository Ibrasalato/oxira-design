import fs from 'node:fs';
import * as THREE from 'three';
import { readDxf } from '../src/scripts/studio/dxf.ts';
import { buildPlan } from '../src/scripts/studio/plan.ts';
import { furnish } from '../src/scripts/studio/furnish.ts';
import { STYLES } from '../src/scripts/studio/styles.ts';
const f = process.argv[2] || 'public/samples/apartment-3br.dxf';
const flat = readDxf(fs.readFileSync(f, 'utf8'));
const plan = buildPlan(flat, Object.fromEntries(flat.layers.map((l) => [l.name, l.role])), 3);
const b = plan.bounds, cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
for (const r of plan.rooms) console.log(r.id, r.name, r.type, JSON.stringify(Object.fromEntries(Object.entries(r.maxRect).map(([k, v]) => [k, +v.toFixed(2)]))));
const g = furnish(plan, STYLES.modern, (x, y) => new THREE.Vector3(x - cx, 0, -(y - cy)));
for (const c of g.children) { const p = c.position; console.log((c as any).w?.toFixed(2), (c as any).d?.toFixed(2), 'plan', (p.x + cx).toFixed(2), (-p.z + cy).toFixed(2), 'rot', (c.rotation.y * 180 / Math.PI).toFixed(0), c.children.length); }
