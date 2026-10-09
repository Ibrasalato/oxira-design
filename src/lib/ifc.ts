// Minimal IFC4 (STEP) writer for simple buildings: storeys with straight walls, doors and windows
// in real openings, floor slabs and rooms (IfcSpace). Opens in Revit, ArchiCAD, BIMcollab, etc.
// Units: metres. Used by the plan designer (src/scripts/planner) and the studio (src/scripts/studio).

export type IfcWall = { x: number; y: number; ux: number; uy: number; len: number; t: number; ext?: boolean };
export type IfcOpening = { kind: 'door' | 'window' | 'open'; cx: number; cy: number; ux: number; uy: number; width: number; t: number };
export type IfcRect = { x0: number; y0: number; x1: number; y1: number };
export type IfcRoom = { name: string; long: string; rects: IfcRect[] };
export type IfcStorey = { name: string; elevation: number; wallHeight: number; walls: IfcWall[]; openings: IfcOpening[]; rooms: IfcRoom[]; slab?: IfcRect[] };
export type IfcModel = { project: string; building: string; storeys: IfcStorey[]; author?: string };

const DOOR_H = 2.1, WIN_SILL = 0.9, WIN_H = 1.3, SLAB = 0.2;
const B64 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$';

/** 22-character IFC GlobalId (128 random bits in IFC base64). */
export function guid(): string {
  const b = new Uint8Array(16);
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (c) c.getRandomValues(b);
  else for (let i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256);
  let n = 0n;
  for (const x of b) n = (n << 8n) | BigInt(x);
  let s = '';
  for (let i = 0; i < 22; i++) { s = B64[Number(n & 63n)] + s; n >>= 6n; }
  return s;
}

/** STEP string: ASCII as is, everything else as \X2\hhhh\X0\ (UTF-16). */
export function str(v: string | null | undefined): string {
  if (v == null || v === '') return '$';
  let out = '', run = '';
  const flush = () => { if (run) { out += '\\X2\\' + run + '\\X0\\'; run = ''; } };
  for (let i = 0; i < v.length; i++) {
    const c = v.charCodeAt(i);
    if (c >= 32 && c <= 126) {
      flush();
      const ch = v[i];
      out += ch === "'" ? "''" : ch === '\\' ? '\\\\' : ch;
    } else if (c >= 32) run += c.toString(16).toUpperCase().padStart(4, '0');
  }
  flush();
  return `'${out}'`;
}

const num = (v: number) => {
  const r = Math.round(v * 100000) / 100000;
  const s = String(r === 0 ? 0 : r);
  return s.includes('.') || s.includes('e') ? s : s + '.';
};

export function toIfc(m: IfcModel): string {
  const L: string[] = [];
  let id = 0;
  const e = (body: string) => { L.push(`#${++id}=${body};`); return `#${id}`; };
  const list = (xs: string[]) => `(${xs.join(',')})`;
  const pt3 = (x: number, y: number, z: number) => e(`IFCCARTESIANPOINT((${num(x)},${num(y)},${num(z)}))`);
  const pt2 = (x: number, y: number) => e(`IFCCARTESIANPOINT((${num(x)},${num(y)}))`);
  const dir3 = (x: number, y: number, z: number) => e(`IFCDIRECTION((${num(x)},${num(y)},${num(z)}))`);
  const Z = dir3(0, 0, 1);
  const place3 = (x: number, y: number, z: number, ux = 1, uy = 0) => e(`IFCAXIS2PLACEMENT3D(${pt3(x, y, z)},${Z},${dir3(ux, uy, 0)})`);
  const origin = place3(0, 0, 0);
  const local = (rel: string | null, x = 0, y = 0, z = 0, ux = 1, uy = 0) => e(`IFCLOCALPLACEMENT(${rel || '$'},${place3(x, y, z, ux, uy)})`);

  // context and units
  const ctx = e(`IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.E-05,${origin},${e('IFCDIRECTION((0.,1.))')})`);
  const body = e(`IFCGEOMETRICREPRESENTATIONSUBCONTEXT('Body','Model',*,*,*,*,${ctx},$,.MODEL_VIEW.,$)`);
  const units = e(`IFCUNITASSIGNMENT(${list([
    e('IFCSIUNIT(*,.LENGTHUNIT.,$,.METRE.)'), e('IFCSIUNIT(*,.AREAUNIT.,$,.SQUARE_METRE.)'),
    e('IFCSIUNIT(*,.VOLUMEUNIT.,$,.CUBIC_METRE.)'), e('IFCSIUNIT(*,.PLANEANGLEUNIT.,$,.RADIAN.)'),
  ])})`);
  const project = e(`IFCPROJECT('${guid()}',$,${str(m.project)},$,$,$,$,(${ctx}),${units})`);

  // a box extruded upwards: centred on (cx, cy) in the placement's own axes
  const box = (cx: number, cy: number, w: number, d: number, h: number, z = 0) => {
    const prof = e(`IFCRECTANGLEPROFILEDEF(.AREA.,$,${e(`IFCAXIS2PLACEMENT2D(${pt2(cx, cy)},$)`)},${num(Math.max(w, 0.001))},${num(Math.max(d, 0.001))})`);
    return e(`IFCEXTRUDEDAREASOLID(${prof},${place3(0, 0, z)},${Z},${num(Math.max(h, 0.001))})`);
  };
  const shape = (items: string[]) => e(`IFCPRODUCTDEFINITIONSHAPE($,$,(${e(`IFCSHAPEREPRESENTATION(${body},'Body','SweptSolid',${list(items)})`)}))`);

  const sitePl = local(null);
  const site = e(`IFCSITE('${guid()}',$,'Site',$,$,${sitePl},$,$,.ELEMENT.,$,$,$,$,$)`);
  const bldPl = local(sitePl);
  const building = e(`IFCBUILDING('${guid()}',$,${str(m.building)},$,$,${bldPl},$,$,.ELEMENT.,$,$,$)`);
  e(`IFCRELAGGREGATES('${guid()}',$,$,$,${project},(${site}))`);
  e(`IFCRELAGGREGATES('${guid()}',$,$,$,${site},(${building}))`);

  const storeys: string[] = [];
  for (const s of m.storeys) {
    const stPl = local(bldPl, 0, 0, s.elevation);
    const st = e(`IFCBUILDINGSTOREY('${guid()}',$,${str(s.name)},$,$,${stPl},$,$,.ELEMENT.,${num(s.elevation)})`);
    storeys.push(st);
    const contained: string[] = [];
    const spaces: string[] = [];

    // walls
    const walls = s.walls.filter((w) => w.len > 0.01 && w.t > 0.01).map((w) => ({ ...w }));
    const wallIds: string[] = [];
    const wallPl: string[] = [];
    const addWall = (w: IfcWall, i: number) => {
      const pl = local(stPl, w.x, w.y, 0, w.ux, w.uy);
      const id = e(`IFCWALL('${guid()}',$,${str(`Wall ${i + 1}`)},$,$,${pl},${shape([box(w.len / 2, 0, w.len, w.t, s.wallHeight)])},$,.${w.ext ? 'STANDARD' : 'PARTITIONING'}.)`);
      wallIds.push(id); wallPl.push(pl); contained.push(id);
      return id;
    };
    walls.forEach(addWall);

    // openings, each in the wall it sits in (a wall piece is added if there is none)
    s.openings.forEach((o, i) => {
      if (o.width < 0.2) return;
      let host = -1;
      for (let k = 0; k < walls.length; k++) {
        const w = walls[k];
        if (Math.abs(w.ux * o.uy - w.uy * o.ux) > 0.05) continue;
        const dx = o.cx - w.x, dy = o.cy - w.y;
        const along = dx * w.ux + dy * w.uy, off = Math.abs(-dx * w.uy + dy * w.ux);
        if (off < Math.max(w.t, o.t) / 2 + 0.05 && along > o.width / 2 - 0.05 && along < w.len - o.width / 2 + 0.05) { host = k; break; }
      }
      if (host < 0) {
        const w: IfcWall = { x: o.cx - (o.ux * o.width) / 2, y: o.cy - (o.uy * o.width) / 2, ux: o.ux, uy: o.uy, len: o.width, t: Math.max(o.t, 0.1) };
        walls.push(w);
        addWall(w, walls.length - 1);
        host = walls.length - 1;
      }
      const w = walls[host];
      const z0 = o.kind === 'window' ? WIN_SILL : 0;
      const h = o.kind === 'window' ? WIN_H : DOOR_H;
      const opPl = local(stPl, o.cx, o.cy, z0, w.ux, w.uy);
      const op = e(`IFCOPENINGELEMENT('${guid()}',$,${str(`Opening ${i + 1}`)},$,$,${opPl},${shape([box(0, 0, o.width, w.t + 0.1, h)])},$,.OPENING.)`);
      e(`IFCRELVOIDSELEMENT('${guid()}',$,$,$,${wallIds[host]},${op})`);
      if (o.kind === 'open') return;
      const fillPl = local(stPl, o.cx, o.cy, z0, w.ux, w.uy);
      const fill = o.kind === 'door'
        ? e(`IFCDOOR('${guid()}',$,${str(`Door ${i + 1}`)},$,$,${fillPl},${shape([box(0, 0, o.width, 0.05, h)])},$,${num(h)},${num(o.width)},.DOOR.,.SINGLE_SWING_LEFT.,$)`)
        : e(`IFCWINDOW('${guid()}',$,${str(`Window ${i + 1}`)},$,$,${fillPl},${shape([box(0, 0, o.width, 0.06, h)])},$,${num(h)},${num(o.width)},.WINDOW.,.SINGLE_PANEL.,$)`);
      e(`IFCRELFILLSELEMENT('${guid()}',$,$,$,${op},${fill})`);
      contained.push(fill);
    });

    // floor slab under the storey
    if (s.slab?.length) {
      const pl = local(stPl);
      contained.push(e(`IFCSLAB('${guid()}',$,${str(s.name)},$,$,${pl},${shape(s.slab.map((r) => box((r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2, r.x1 - r.x0, r.y1 - r.y0, SLAB, -SLAB)))},$,.FLOOR.)`));
    }

    // rooms
    s.rooms.forEach((r) => {
      const rects = r.rects.filter((q) => q.x1 - q.x0 > 0.05 && q.y1 - q.y0 > 0.05);
      if (!rects.length) return;
      const pl = local(stPl);
      spaces.push(e(`IFCSPACE('${guid()}',$,${str(r.name)},$,$,${pl},${shape(rects.map((q) => box((q.x0 + q.x1) / 2, (q.y0 + q.y1) / 2, q.x1 - q.x0, q.y1 - q.y0, s.wallHeight)))},${str(r.long)},.ELEMENT.,.INTERNAL.,$)`));
    });

    if (contained.length) e(`IFCRELCONTAINEDINSPATIALSTRUCTURE('${guid()}',$,$,$,${list(contained)},${st})`);
    if (spaces.length) e(`IFCRELAGGREGATES('${guid()}',$,$,$,${st},${list(spaces)})`);
  }
  if (storeys.length) e(`IFCRELAGGREGATES('${guid()}',$,$,$,${building},${list(storeys)})`);

  const now = new Date().toISOString().slice(0, 19);
  const head = [
    'ISO-10303-21;', 'HEADER;',
    "FILE_DESCRIPTION(('ViewDefinition [ReferenceView]'),'2;1');",
    `FILE_NAME(${str(m.project.replace(/[^\x20-\x7e]/g, '').trim() || 'oxira')},'${now}',(${str(m.author || 'Oxira Design')}),('Oxira Design'),'Oxira Design','design.oxira.sa','');`,
    "FILE_SCHEMA(('IFC4'));", 'ENDSEC;', 'DATA;',
  ];
  return [...head, ...L, 'ENDSEC;', 'END-ISO-10303-21;', ''].join('\n');
}
