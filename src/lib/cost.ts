// Build-cost estimate: ranges (low–high) from built area, finish level, city and soil.
import type { CountryRates, Level, Range, Soil } from './costRates';

export type CostInput = {
  area: number;            // built area in m² (all floors, annex included)
  level: Level;
  city: string;            // key in rates.cities ('' = national range)
  soil: Soil;
  design: boolean;         // engineering office design drawings
  supervision: boolean;    // engineering site supervision
  contingency: boolean;
  extras: number;          // lump sum the client typed (pool, lift, wall…), same currency
};

export type CostLine = { key: 'shell' | 'foundation' | 'finish' | 'design' | 'supervision' | 'contingency' | 'extras'; range: Range };
export type CostResult = {
  lines: CostLine[];
  total: Range;
  perM2: Range;
  construction: Range;     // shell + foundation + finishing (before soft costs)
  materials: Range;        // materials share of construction
  labour: Range;
  currency: string;
};

const mul = (r: Range, k: number): Range => [r[0] * k, r[1] * k];
const add = (...rs: Range[]): Range => rs.reduce<Range>((s, r) => [s[0] + r[0], s[1] + r[1]], [0, 0]);
const round = (n: number, step: number) => Math.round(n / step) * step;

export function estimate(rates: CountryRates, i: CostInput): CostResult {
  const area = Math.max(0, i.area || 0);
  const f = rates.cities[i.city] ?? 1;
  const shell = mul(rates.shell, area * f);
  const fp = rates.foundation[i.soil] || [0, 0];
  const foundation: Range = [shell[0] * fp[0], shell[1] * fp[1]];
  const finish = mul(rates.finish[i.level], area * f);
  const construction = add(shell, foundation, finish);
  const lines: CostLine[] = [
    { key: 'shell', range: shell },
    { key: 'foundation', range: foundation },
    { key: 'finish', range: finish },
  ];
  if (i.design) lines.push({ key: 'design', range: [construction[0] * rates.design[0], construction[1] * rates.design[1]] });
  if (i.supervision) lines.push({ key: 'supervision', range: [construction[0] * rates.supervision[0], construction[1] * rates.supervision[1]] });
  if (i.contingency) lines.push({ key: 'contingency', range: mul(construction, rates.contingency) });
  if (i.extras > 0) lines.push({ key: 'extras', range: [i.extras, i.extras] });
  const step = rates.currency === 'EGP' ? 10000 : 1000;
  const total = add(...lines.map((l) => l.range));
  const out: CostResult = {
    lines: lines.map((l) => ({ key: l.key, range: [round(l.range[0], step / 10), round(l.range[1], step / 10)] })),
    total: [round(total[0], step), round(total[1], step)],
    perM2: area ? [Math.round(total[0] / area), Math.round(total[1] / area)] : [0, 0],
    construction: [round(construction[0], step), round(construction[1], step)],
    materials: [round(construction[0] * rates.materials[0], step), round(construction[1] * rates.materials[1], step)],
    labour: [round(construction[0] * (1 - rates.materials[1]), step), round(construction[1] * (1 - rates.materials[0]), step)],
    currency: rates.currency,
  };
  return out;
}

/** Built area from the plot: footprint = plot × coverage, times floors, plus an optional annex. */
export const builtFromPlot = (w: number, d: number, coverage: number, floors: number, annex: number) =>
  Math.round(Math.max(0, w) * Math.max(0, d) * Math.min(1, Math.max(0, coverage)) * Math.max(1, floors) + Math.max(0, annex));
