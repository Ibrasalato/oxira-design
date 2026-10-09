// Studio plan (read from DXF) → IFC4: one storey, walls, doors and windows in openings, rooms.
import { toIfc } from '../../lib/ifc.ts';
import type { Plan, RoomType } from './plan.ts';

export function studioIfc(plan: Plan, o: { title: string; storey: string; typeName: (t: RoomType) => string }): string {
  return toIfc({
    project: o.title,
    building: o.title,
    storeys: [{
      name: o.storey,
      elevation: 0,
      wallHeight: plan.height,
      walls: plan.walls.map((w) => ({ x: w.ox, y: w.oy, ux: w.ux, uy: w.uy, len: w.len, t: w.t })),
      openings: plan.openings.map((p) => ({ kind: p.kind, cx: p.cx, cy: p.cy, ux: p.ux, uy: p.uy, width: p.width, t: p.t })),
      rooms: plan.rooms.map((r) => ({ name: r.name || o.typeName(r.type), long: o.typeName(r.type), rects: r.rects.slice(0, 300) })),
      slab: plan.rooms.flatMap((r) => r.rects.slice(0, 300)),
    }],
  });
}
