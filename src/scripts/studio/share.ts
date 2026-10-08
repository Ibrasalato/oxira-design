// Plan <-> JSON for shared 3D listing tours. The grid arrays are run-length encoded
// (rooms and free space come in long runs), which keeps a typical flat around 20–60 KB.
import type { Plan } from './plan.ts';

type Rle = number[]; // value, count, value, count, …

function rle(a: ArrayLike<number>): Rle {
  const out: number[] = [];
  let i = 0;
  while (i < a.length) {
    const v = a[i];
    let n = 1;
    while (i + n < a.length && a[i + n] === v) n++;
    out.push(v, n);
    i += n;
  }
  return out;
}

function unrle<T extends Uint8Array | Int32Array>(r: Rle, into: T): T {
  let k = 0;
  for (let i = 0; i + 1 < r.length; i += 2) {
    into.fill(r[i], k, k + r[i + 1]);
    k += r[i + 1];
  }
  return into;
}

const round = (_k: string, v: unknown) => (typeof v === 'number' && !Number.isInteger(v) ? Math.round(v * 1000) / 1000 : v);

export function planToJson(plan: Plan): string {
  const { grid, ...rest } = plan;
  return JSON.stringify({ v: 1, ...rest, warnings: [], grid: { w: grid.w, h: grid.h, cell: grid.cell, x0: grid.x0, y0: grid.y0, v: rle(grid.v), room: rle(grid.room) } }, round);
}

export function planFromJson(text: string): Plan {
  const j = JSON.parse(text);
  const g = j.grid;
  const size = g.w * g.h;
  return {
    walls: j.walls, openings: j.openings, rooms: j.rooms, bounds: j.bounds, height: j.height, warnings: [], stats: j.stats || { lines: 0, markers: 0 },
    grid: { w: g.w, h: g.h, cell: g.cell, x0: g.x0, y0: g.y0, v: unrle(g.v, new Uint8Array(size)), room: unrle(g.room, new Int32Array(size)) },
  };
}
