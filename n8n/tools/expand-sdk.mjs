// Expands helper functions in an n8n SDK workflow file into plain node()/trigger() literals,
// because the n8n SDK parser does not allow arrow functions or helpers.
// Usage: node n8n/tools/expand-sdk.mjs input.ts > output.js
import fs from 'node:fs';
const src = fs.readFileSync(process.argv[2], 'utf8');
const chainStart = src.indexOf('export default workflow(');
const noteStart = src.indexOf('const note = sticky(');
const head = src.slice(0, noteStart >= 0 ? noteStart : chainStart).replace(/^import .*$/m, '');
const noteSrc = noteStart >= 0 ? src.slice(noteStart, chainStart) : '';
const chain = src.slice(chainStart);
const names = [...head.matchAll(/^const (\w+) = (node|trigger|ifElse|switchCase|respond)\(/gm)].map((m) => m[1]);
const mk = (fn) => (cfg) => ({ __fn: fn, cfg });
const ctx = { node: mk('node'), trigger: mk('trigger'), ifElse: mk('ifElse'), switchCase: mk('switchCase'), expr: (s) => ({ __expr: s }) };
const body = head + '\nreturn {' + names.join(',') + '};';
const vals = new Function(...Object.keys(ctx), body)(...Object.values(ctx));
const ser = (v) => {
  const exprs = [];
  const json = JSON.stringify(v, (k, x) => (x && typeof x === 'object' && '__expr' in x ? `@@EXPR${exprs.push(x.__expr) - 1}@@` : x));
  return json.replace(/"@@EXPR(\d+)@@"/g, (_, i) => `expr(${JSON.stringify(exprs[+i])})`);
};
let out = "import { workflow, node, trigger, sticky, ifElse, switchCase, expr } from '@n8n/workflow-sdk';\n\n";
for (const n of names) out += `const ${n} = ${vals[n].__fn}(${ser(vals[n].cfg)});\n\n`;
out += noteSrc + chain;
process.stdout.write(out);
