// Plan designer → IFC4 model (walls from the uncut wall lines, doors and windows as real openings).
import { geometry, T_EXT, T_INT, type Project, type Floor, type Kind } from './model.ts';
import { toIfc, type IfcStorey, type IfcOpening, type IfcWall } from '../../lib/ifc.ts';

export const STOREY_H = 3.2;

export function planToIfc(p: Project, o: { names: (k: Kind) => string; floorName: (f: Floor, i: number) => string; title: string }): string {
  const storeys: IfcStorey[] = [];
  let level = 0;
  for (const f of p.floors) {
    const geo = geometry(f, f.level === 0);
    const F = f.rect, h = T_EXT / 2;
    const walls: IfcWall[] = geo.lines.map((l) => {
      const t = l.ext ? T_EXT : T_INT;
      return l.axis === 'x'
        ? { x: l.c, y: l.t0 - h, ux: 0, uy: 1, len: l.t1 - l.t0 + T_EXT, t, ext: l.ext }
        : { x: l.t0 - h, y: l.c, ux: 1, uy: 0, len: l.t1 - l.t0 + T_EXT, t, ext: l.ext };
    });
    const openings: IfcOpening[] = geo.openings.map((op) => {
      const mid = (op.t0 + op.t1) / 2;
      const kind = op.kind === 'window' ? 'window' : op.kind === 'open' ? 'open' : 'door';
      return op.axis === 'x'
        ? { kind, cx: op.c, cy: mid, ux: 0, uy: 1, width: op.t1 - op.t0, t: op.th }
        : { kind, cx: mid, cy: op.c, ux: 1, uy: 0, width: op.t1 - op.t0, t: op.th };
    });
    const rooms = geo.rooms
      .filter((r) => r.leaf.kind !== 'void')
      .map((r) => ({ name: r.leaf.name || o.names(r.leaf.kind), long: o.names(r.leaf.kind), rects: [r.net] }));
    const slab = [{ x0: F.x0 - h, y0: F.y0 - h, x1: F.x1 + h, y1: F.y1 + h }];
    for (let i = 0; i < Math.max(1, f.repeat); i++) {
      const name = o.floorName(f, i);
      storeys.push({ name, elevation: level * STOREY_H, wallHeight: STOREY_H - 0.2, walls, openings, rooms, slab });
      level++;
    }
  }
  return toIfc({ project: o.title, building: o.title, storeys });
}
