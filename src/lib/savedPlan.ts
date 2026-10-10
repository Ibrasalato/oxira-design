// Turns a saved plan (account, share link, gallery) back into a Project for drawing.
import { generate, type Brief, type Floor, type Project } from '../scripts/planner/model';

export type SavedPlan = { v: 1; brief: Brief; floors: Floor[]; seq: number; edited?: boolean; imported?: boolean; variant?: number };

export function projectFromSaved(data: string | SavedPlan): Project | null {
  let s: SavedPlan | null = null;
  try { s = typeof data === 'string' ? JSON.parse(data) : data; } catch { return null; }
  if (!s || s.v !== 1 || !s.brief) return null;
  const p = generate(s.brief, s.variant || 0);
  if ((s.edited || s.imported) && Array.isArray(s.floors) && s.floors.length) { p.floors = s.floors; p.seq = s.seq || p.seq; }
  return p;
}
