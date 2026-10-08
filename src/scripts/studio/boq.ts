// Estimated quantities (bill of quantities) from detected rooms.
import type { Plan, Room } from './plan.ts';

export type BoqRow = { room: Room; floor: number; paint: number; tiles: number; ceiling: number; skirting: number };
export type Boq = { rows: BoqRow[]; total: { area: number; floor: number; paint: number; tiles: number; ceiling: number; skirting: number } };

export function computeBoq(plan: Plan): Boq {
  const H = plan.height;
  const rows = plan.rooms.map((r) => {
    const wet = r.type === 'bath' || r.type === 'kitchen';
    const outdoor = r.type === 'balcony';
    const net = Math.max(0, r.perimeter * H - r.openingArea);
    return {
      room: r,
      floor: r.area * 1.1,
      paint: wet || outdoor ? 0 : net,
      tiles: wet ? net : 0,
      ceiling: outdoor ? 0 : r.area,
      skirting: wet || outdoor ? 0 : Math.max(0, r.perimeter - r.openingWidth),
    };
  });
  const sum = (k: keyof Omit<BoqRow, 'room'>) => rows.reduce((s, x) => s + x[k], 0);
  return { rows, total: { area: plan.rooms.reduce((s, r) => s + r.area, 0), floor: sum('floor'), paint: sum('paint'), tiles: sum('tiles'), ceiling: sum('ceiling'), skirting: sum('skirting') } };
}

export function boqCsv(b: Boq, head: string[], typeName: (t: string) => string): string {
  const f = (n: number) => n.toFixed(2);
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const lines = [head.map(esc).join(',')];
  for (const r of b.rows) lines.push([esc(r.room.name || typeName(r.room.type)), esc(typeName(r.room.type)), f(r.room.area), f(r.floor), f(r.paint), f(r.tiles), f(r.ceiling), f(r.skirting)].join(','));
  lines.push([esc('TOTAL'), '""', f(b.total.area), f(b.total.floor), f(b.total.paint), f(b.total.tiles), f(b.total.ceiling), f(b.total.skirting)].join(','));
  return '﻿' + lines.join('\n');
}
