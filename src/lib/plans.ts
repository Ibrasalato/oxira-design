// Ready-made plan pages (/plans/<slug>/): every common plot size × building type × bedrooms that the
// generator lays out cleanly (no warnings); on one plot size, room counts that give the same plan are kept once.
// The editor opens the same plan from /plan/?plan=<slug>&v=<variant>.
import { generate, defaultBrief, frontSetback, type Brief, type Project } from '../scripts/planner/model.ts';

export type PlanKind = 'villa' | 'house' | 'duplex' | 'building';
export type PlanSpec = { kind: PlanKind; w: number; d: number; beds: number; variant: number; slug: string };

export const PLAN_KINDS: PlanKind[] = ['villa', 'house', 'duplex', 'building'];
const SIZES: [number, number][] = [[10, 20], [12, 20], [12, 25], [15, 20], [15, 25], [15, 30], [18, 25], [20, 20], [20, 25], [20, 30], [20, 35], [25, 25], [25, 30], [25, 35], [30, 30], [30, 35], [30, 40], [35, 40], [40, 40]];
const BEDS: Record<PlanKind, number[]> = { villa: [3, 4, 5, 6], house: [2, 3, 4], duplex: [3, 4, 5], building: [1, 2, 3] };

export const slugOf = (kind: PlanKind, w: number, d: number, beds: number) =>
  kind === 'building' ? `apartment-building-${w}x${d}-${beds}-bedroom-units` : `${kind}-${w}x${d}-${beds}-bedrooms`;

export function parseSlug(slug: string): Omit<PlanSpec, 'variant'> | null {
  const m = slug.match(/^(villa|house|duplex|apartment-building)-(\d{1,3})x(\d{1,3})-(\d)-bedroom/);
  if (!m) return null;
  const kind = (m[1] === 'apartment-building' ? 'building' : m[1]) as PlanKind;
  return { kind, w: +m[2], d: +m[3], beds: +m[4], slug };
}

/** The brief behind a plan page: Gulf programme defaults, the plot and the room count. */
export function specBrief(s: Pick<PlanSpec, 'kind' | 'w' | 'd' | 'beds'>): Brief {
  const b = defaultBrief();
  b.type = s.kind === 'building' ? 'building' : s.kind === 'duplex' ? 'duplex' : 'villa';
  b.land.w = s.w; b.land.d = s.d;
  b.setback.front = frontSetback(b.land.streetW);
  if (s.kind === 'building') { b.bld.beds = s.beds; b.bld.floors = 3; }
  else {
    b.villa.bedrooms = s.beds;
    b.villa.floors = s.kind === 'house' ? 1 : 2;
    if (s.kind === 'house') { b.villa.roof = false; b.villa.ladies = false; }
  }
  return b;
}

export const specProject = (s: PlanSpec): Project => generate(specBrief(s), s.variant);

let cache: PlanSpec[] | null = null;
/** All plan pages, in a stable order (kind, plot area, bedrooms). Runs the generator, so build time only. */
export function planCatalog(): PlanSpec[] {
  if (cache) return cache;
  const seen = new Set<string>();
  const out: PlanSpec[] = [];
  for (const kind of PLAN_KINDS) {
    for (const [w, d] of SIZES) {
      for (const beds of BEDS[kind]) {
        for (let v = 0; v < 4; v++) {
          const p = generate(specBrief({ kind, w, d, beds }), v);
          if (p.warnings.length) continue;
          // same plot, different room count but the same plan: keep one
          const sig = `${w}x${d}:` + JSON.stringify(p.floors.map((f) => [f.rect, f.root]));
          if (!seen.has(sig)) { seen.add(sig); out.push({ kind, w, d, beds, variant: v, slug: slugOf(kind, w, d, beds) }); }
          break;
        }
      }
    }
  }
  return (cache = out);
}
