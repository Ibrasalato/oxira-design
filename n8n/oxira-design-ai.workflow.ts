import { workflow, node, trigger, sticky, ifElse, expr } from '@n8n/workflow-sdk';

// "Oxira Design — Plan AI": Claude helps the plan designer (design.oxira.sa/plan/).
//   kind "brief": the visitor describes the house in their own words → settings for the plan generator.
//   kind "image": a photo or PDF page of a floor plan → room rectangles in metres, which the site turns
//                 into an editable plan.
// Limits per IP address and per day are kept in the workflow static data.

const ORIGINS = 'https://design.oxira.sa,https://ibrasalato.github.io,http://localhost:4321';
const anthropic = { anthropicApi: { id: 'CnVH74DIvAt5ikNI', name: 'Anthropic oxira' } };

const respond = (name, body) => node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: { name, parameters: { respondWith: 'json', responseBody: expr(body), options: { responseCode: 200 } } }
});

const aiHook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Plan AI',
    parameters: { httpMethod: 'POST', path: 'oxira-plan-ai', responseMode: 'responseNode', options: { allowedOrigins: ORIGINS } }
  },
  output: [{ headers: {}, body: { kind: 'brief', text: 'فيلا دورين ٥ غرف نوم على أرض ٢٠ في ٣٠', lang: 'ar', region: 'SA', brief: {} } }]
});

const buildRequest = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build request',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `// Validates the request, applies the daily limits and writes the Claude request.
const LIMITS = { brief: { ip: 40, day: 1500 }, image: { ip: 8, day: 300 } };
const req = $input.first().json;
let b = req.body;
if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
b = b || {};
const h = req.headers || {};
const ip = String(h['cf-connecting-ip'] || h['x-real-ip'] || String(h['x-forwarded-for'] || '').split(',')[0] || '').trim().slice(0, 64) || 'unknown';
const kind = b.kind === 'image' ? 'image' : 'brief';
const lang = String(b.lang || 'en').slice(0, 5);
const region = String(b.region || '').replace(/[^A-Z]/g, '').slice(0, 2);
const day = $now.setZone('Asia/Riyadh').toFormat('yyyy-MM-dd');
const st = $getWorkflowStaticData('global');
if (!st.ai || st.ai.day !== day) st.ai = { day, n: { brief: 0, image: 0 }, ip: {} };
const key = kind + ':' + ip;
const used = st.ai.ip[key] || 0;
const fail = (reason) => [{ json: { ok: false, reason, kind } }];
if (used >= LIMITS[kind].ip || st.ai.n[kind] >= LIMITS[kind].day) return fail('limit');
const KINDS = 'entrance, hall, living, majlis, ladies, dining, kitchen, master, bedroom, guest, bath, wc, dress, maid, driver, laundry, store, office, prayer, stair, lift, landing, shop, parking, terrace, void, garage';
let request;
if (kind === 'brief') {
  const text = String(b.text || '').trim().slice(0, 2000);
  if (text.length < 4) return fail('empty');
  const current = JSON.stringify(b.brief || {}).slice(0, 4000);
  const system = 'You set up an automatic floor-plan generator from what a client says about the house they want. ' +
    'Reply with ONE JSON object and nothing else: {"patch": {...}, "reply": "..."}. ' +
    '"patch" contains only the settings the client actually implied, in this shape (all lengths in metres; convert feet with 1 ft = 0.3048 m): ' +
    '{"type": "villa"|"duplex"|"building"|"mixed"|"istiraha", "land": {"w": number (street frontage), "d": number (depth), "streets": 1-4, "streetW": number}, ' +
    '"villa": {"floors": 1-4 including ground, "roof": bool (roof annex), "bedrooms": 0-10 total, "masters": 0-4, "ensuiteAll": bool, "baths": 0-4 extra shared bathrooms, "majlis": bool, "ladies": bool, "dining": bool, "kitchen": "open"|"closed", "maid": bool, "driver": bool, "laundry": bool, "store": bool, "office": bool, "guestBed": bool (ground-floor guest bedroom), "prayer": bool, "lift": bool, "garage": bool}, ' +
    '"bld": {"floors": 1-20 typical floors, "perFloor": 1-4 apartments per floor, "beds": 1-5 bedrooms per apartment, "majlis": bool, "maid": bool, "ground": "parking"|"shops"|"apartments", "roof": bool, "lift": bool}, ' +
    '"planTypes": array of "arch","facade","structural","electrical","plumbing","hvac","exterior3d","interior","permit","landscape", "facade": "modern"|"classic"|"najdi"|"neoclassic"|"none"}. ' +
    'If the client gives only a plot area, choose a sensible width and depth for it. "reply" is one or two short sentences in the client\\'s language (page language: ' + lang + ') saying what you set and what is still open. ' +
    'Never invent personal details. Country of the client: ' + (region || 'unknown') + '.';
  request = { model: 'claude-sonnet-5', max_tokens: 900, system, messages: [{ role: 'user', content: 'Current settings: ' + current + '\\n\\nClient: ' + text }] };
} else {
  const m = String(b.image || '').match(/^data:image\\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/);
  if (!m || m[2].length > 5500000) return fail('image');
  const knownW = Number(b.knownWidth) > 2 && Number(b.knownWidth) < 300 ? Number(b.knownWidth) : 0;
  const system = 'You read architectural floor plans from images. Reply with ONE JSON object and nothing else: ' +
    '{"width": number, "depth": number, "rooms": [{"name": string, "type": string, "x": number, "y": number, "w": number, "h": number}], "notes": string}. ' +
    'Measure the main building outline only (one floor; if several floors are shown, use the ground floor). Units are metres. ' +
    'Origin is the bottom-left corner of the building outline, x grows to the right, y grows towards the TOP of the image. ' +
    'The rooms must tile the whole width x depth rectangle with no gaps and no overlaps: include halls and corridors (type hall), stairs (stair), balconies (terrace) and small rooms. Use wall centre lines. ' +
    'Use the dimension annotations and the scale written on the drawing; if there are none, assume typical sizes (a door is about 0.9 m, a bedroom about 3.5 to 4.5 m wide). ' +
    (knownW ? 'The client says the building is ' + knownW + ' m wide; use that for scale. ' : '') +
    '"type" is one of: ' + KINDS + '. Keep "name" as written on the plan (any language), or a short name if none. ' +
    '"notes" is one short sentence in language "' + lang + '" about anything uncertain.';
  request = { model: 'claude-sonnet-5', max_tokens: 4000, system, messages: [{ role: 'user', content: [
    { type: 'image', source: { type: 'base64', media_type: 'image/' + m[1], data: m[2] } },
    { type: 'text', text: 'Read this floor plan and return the JSON.' }
  ] }] };
}
st.ai.ip[key] = used + 1;
st.ai.n[kind] = (st.ai.n[kind] || 0) + 1;
return [{ json: { ok: true, kind, lang, request } }];`
    }
  },
  output: [{ ok: true, kind: 'brief', lang: 'ar', request: { model: 'claude-sonnet-5', max_tokens: 900, system: '...', messages: [] } }]
});

const isOk = ifElse({
  version: 2.2,
  config: {
    name: 'Request ok?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' },
        conditions: [{ leftValue: expr('{{ $json.ok }}'), operator: { type: 'boolean', operation: 'true', singleValue: true } }],
        combinator: 'and'
      }
    }
  }
});

const askClaude = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.5,
  config: {
    name: 'Ask Claude',
    parameters: {
      method: 'POST',
      url: 'https://api.anthropic.com/v1/messages',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'anthropicApi',
      sendHeaders: true,
      headerParameters: { parameters: [{ name: 'anthropic-version', value: '2023-06-01' }] },
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr('{{ JSON.stringify($json.request) }}'),
      options: { timeout: 120000, response: { response: { neverError: true } } }
    },
    credentials: anthropic
  },
  output: [{ content: [{ type: 'text', text: '{"patch":{"type":"villa"},"reply":"تم"}' }] }]
});

const parseAnswer = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Parse answer',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `// Pulls the JSON object out of Claude's answer and checks its shape.
const res = $input.first().json || {};
const kind = $('Build request').first().json.kind;
const text = Array.isArray(res.content) ? res.content.filter((c) => c.type === 'text').map((c) => c.text).join('') : '';
const a = text.indexOf('{'), z = text.lastIndexOf('}');
let data = null;
try { data = a >= 0 && z > a ? JSON.parse(text.slice(a, z + 1)) : null; } catch (e) { data = null; }
if (!data) return [{ json: { success: false, reason: res.error ? 'ai' : 'parse' } }];
if (kind === 'image') {
  const num = (v) => Math.round(Number(v) * 100) / 100;
  const rooms = (Array.isArray(data.rooms) ? data.rooms : []).slice(0, 80).map((r) => ({ name: String(r.name || '').slice(0, 40), type: String(r.type || '').slice(0, 12), x: num(r.x), y: num(r.y), w: num(r.w), h: num(r.h) }))
    .filter((r) => [r.x, r.y, r.w, r.h].every((v) => isFinite(v)) && r.w > 0.3 && r.h > 0.3);
  const width = num(data.width), depth = num(data.depth);
  if (!(width > 2 && width < 300 && depth > 2 && depth < 300) || rooms.length < 1) return [{ json: { success: false, reason: 'unreadable' } }];
  return [{ json: { success: true, kind, width, depth, rooms, notes: String(data.notes || '').slice(0, 300) } }];
}
return [{ json: { success: true, kind, patch: data.patch && typeof data.patch === 'object' ? data.patch : {}, reply: String(data.reply || '').slice(0, 500) } }];`
    }
  },
  output: [{ success: true, kind: 'brief', patch: { type: 'villa' }, reply: 'تم' }]
});

const sendAnswer = respond('Send answer', '{{ JSON.stringify($json) }}');
const sendRefusal = respond('Send refusal', '{{ JSON.stringify({ success: false, reason: $json.reason }) }}');

const note = sticky('## Oxira Design — Plan AI\n- `POST /webhook/oxira-plan-ai` from design.oxira.sa/plan/\n- **brief**: free text → settings patch for the plan generator + a short reply\n- **image**: floor-plan image (JPEG/PNG data URL, PDF pages are rendered in the browser) → room rectangles in metres\n- Limits per IP per day: 40 briefs, 8 images; per day overall: 1500 / 300 (static data)\n- Claude via the "Anthropic oxira" credential', [aiHook, buildRequest], { color: 4 });

export default workflow('oxira-plan-ai', 'Oxira Design — Plan AI')
  .add(aiHook)
  .to(buildRequest)
  .to(isOk
    .onTrue(askClaude.to(parseAnswer).to(sendAnswer))
    .onFalse(sendRefusal))
  .add(note);
