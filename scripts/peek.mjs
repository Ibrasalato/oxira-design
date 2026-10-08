import DxfParser from 'dxf-parser';
import fs from 'fs';
const p = new DxfParser();
for (const f of process.argv.slice(2)) {
const d = p.parseSync(fs.readFileSync(f,'utf8'));
console.log(f, 'units', d.header.$INSUNITS, 'layers', Object.keys(d.tables.layer.layers));
const types = {}; for (const e of d.entities) types[e.type]=(types[e.type]||0)+1; console.log(types);
const pick = (t)=>d.entities.find(e=>e.type===t);
for (const t of ['LWPOLYLINE','INSERT','TEXT','DIMENSION']) { const e=pick(t); if(e) console.log(t, JSON.stringify(e).slice(0,400)); }
console.log('blocks', Object.keys(d.blocks)); console.log(JSON.stringify(d.blocks.DOOR).slice(0,600));
}
