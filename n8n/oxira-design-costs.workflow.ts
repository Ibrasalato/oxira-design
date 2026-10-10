import { workflow, node, trigger, sticky, ifElse, expr } from '@n8n/workflow-sdk';

// "Oxira Design — Build costs": backs the build-cost calculator on design.oxira.sa/cost/.
// - POST oxira-design-cost-rates: the latest approved rates (table oxira_design_cost_rates, status "active")
// - POST oxira-design-build-quote: contractor-quote request → oxira_design_build_leads + email to info@
// - Monthly (1st, 09:00 Riyadh): Claude with web search proposes new rates → saved as "pending" → email to info@
//   with an approve link; GET oxira-design-cost-approve?t=<token> makes them active. Changes over 35% are not taken.

const ORIGINS = 'https://design.oxira.sa,https://ibrasalato.github.io,http://localhost:4321';
const ratesTable = { __rl: true, mode: 'id', value: '5tlCKLgZ31TfBM3w', cachedResultName: 'oxira_design_cost_rates' };
const leadsTable = { __rl: true, mode: 'id', value: 'f8F0WOgsdmx7UoHr', cachedResultName: 'oxira_design_build_leads' };
const smtp = { smtp: { id: 'Jd9L9EGYmDKHV0KB', name: 'SMTP account' } };
const anthropic = { anthropicApi: { id: 'CnVH74DIvAt5ikNI', name: 'Anthropic oxira' } };
const col = (id, type = 'string') => ({ id, displayName: id, required: false, defaultMatch: false, display: true, type, canBeUsedToMatch: true });
const cond = (expression) => ({
  conditions: {
    options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' },
    conditions: [{ leftValue: expr(expression), operator: { type: 'boolean', operation: 'true', singleValue: true } }],
    combinator: 'and'
  }
});

// ---------------------------------------------------------------- rates for the site
const ratesHook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: { name: 'Cost rates', parameters: { httpMethod: 'POST', path: 'oxira-design-cost-rates', responseMode: 'responseNode', options: { allowedOrigins: ORIGINS } } },
  output: [{ body: {} }]
});
const getActive = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Active rates',
    alwaysOutputData: true,
    executeOnce: true,
    parameters: { resource: 'row', operation: 'get', dataTableId: ratesTable, matchType: 'allConditions', filters: { conditions: [{ keyName: 'status', condition: 'eq', keyValue: 'active' }] }, returnAll: true }
  },
  output: [{ id: 1, rates: '{"updated":"2026-10"}', status: 'active', updated: '2026-10' }]
});
const pickRates = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Latest rates',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `// The newest active row wins (older active rows are kept as history).
const rows = $input.all().map((i) => i.json).filter((r) => r && r.id && r.rates).sort((a, b) => b.id - a.id);
let rates = null;
try { rates = rows.length ? JSON.parse(rows[0].rates) : null; } catch (e) { rates = null; }
return [{ json: { success: !!rates, rates, updated: rates ? rates.updated : null } }];`
    }
  },
  output: [{ success: true, rates: { updated: '2026-10' }, updated: '2026-10' }]
});
const replyRates = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: { name: 'Reply rates', parameters: { respondWith: 'json', responseBody: expr('{{ JSON.stringify($json) }}'), options: { responseCode: 200, responseHeaders: { entries: [{ name: 'Cache-Control', value: 'public, max-age=3600' }] } } } }
});

// ---------------------------------------------------------------- contractor quote requests
const quoteHook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: { name: 'Build quote request', parameters: { httpMethod: 'POST', path: 'oxira-design-build-quote', responseMode: 'responseNode', options: { allowedOrigins: ORIGINS } } },
  output: [{ body: '{"name":"Ahmed","phone":"0500000000","country":"SA","city":"riyadh","area":400,"level":"standard","low":638000,"high":986000,"currency":"SAR"}', headers: { 'x-real-ip': '1.1.1.1' } }]
});
const checkQuote = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Check quote request',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `// Validates the request; 5 per IP and 300 overall per day (workflow static data); honeypot field.
const req = $input.first().json;
let b = req.body;
if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
b = b || {};
const h = req.headers || {};
const ip = String(h['cf-connecting-ip'] || h['x-real-ip'] || String(h['x-forwarded-for'] || '').split(',')[0] || '').trim().slice(0, 64) || 'unknown';
const s = (v, n) => String(v == null ? '' : v).replace(/[<>]/g, '').trim().slice(0, n);
const num = (v) => { const x = Number(v); return Number.isFinite(x) ? Math.round(x) : 0; };
const name = s(b.name, 120), phone = String(b.phone || '').replace(/[^\\d+]/g, '').slice(0, 20);
const email = /^[^\\s@]{1,64}@[^\\s@]{1,120}\\.[^\\s@]{2,20}$/.test(String(b.email || '').trim()) ? String(b.email).trim().slice(0, 160) : '';
if (b.company_website) return [{ json: { valid: false, reason: 'invalid' } }];
if (name.length < 2 || phone.replace(/\\D/g, '').length < 8) return [{ json: { valid: false, reason: 'invalid' } }];
const day = $now.setZone('Asia/Riyadh').toFormat('yyyy-MM-dd');
const st = $getWorkflowStaticData('global');
if (!st.q || st.q.day !== day) st.q = { day, n: 0, ip: {} };
if ((st.q.ip[ip] || 0) >= 5 || st.q.n >= 300) return [{ json: { valid: false, reason: 'limit' } }];
st.q.ip[ip] = (st.q.ip[ip] || 0) + 1; st.q.n += 1;
const country = b.country === 'EG' ? 'EG' : 'SA';
const lang = ['ar', 'en', 'de', 'fr', 'ru', 'es', 'tr', 'zh', 'hi', 'ur'].includes(b.lang) ? b.lang : 'ar';
return [{ json: { valid: true, name, phone, email, country, city: s(b.city, 40), area: num(b.area), level: s(b.level, 20), soil: s(b.soil, 20),
  low: num(b.low), high: num(b.high), currency: country === 'EG' ? 'EGP' : 'SAR', plan: s(b.plan, 80), notes: s(b.notes, 2000), lang, page: s(b.page, 600), status: 'new' } }];`
    }
  },
  output: [{ valid: true, name: 'Ahmed', phone: '0500000000', email: '', country: 'SA', city: 'riyadh', area: 400, level: 'standard', soil: 'good', low: 638000, high: 986000, currency: 'SAR', plan: '', notes: '', lang: 'ar', page: '', status: 'new' }]
});
const validQuote = ifElse({ version: 2.2, config: { name: 'Valid quote?', parameters: cond('{{ $json.valid }}') } });
const saveLead = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Save build lead',
    parameters: {
      resource: 'row', operation: 'insert', dataTableId: leadsTable,
      columns: {
        mappingMode: 'defineBelow',
        value: {
          name: expr('{{ $json.name }}'), phone: expr('{{ $json.phone }}'), email: expr('{{ $json.email }}'), country: expr('{{ $json.country }}'), city: expr('{{ $json.city }}'),
          area: expr('{{ $json.area }}'), level: expr('{{ $json.level }}'), soil: expr('{{ $json.soil }}'), low: expr('{{ $json.low }}'), high: expr('{{ $json.high }}'),
          currency: expr('{{ $json.currency }}'), plan: expr('{{ $json.plan }}'), notes: expr('{{ $json.notes }}'), lang: expr('{{ $json.lang }}'), page: expr('{{ $json.page }}'), status: 'new'
        },
        schema: [col('name'), col('phone'), col('email'), col('country'), col('city'), col('area', 'number'), col('level'), col('soil'), col('low', 'number'), col('high', 'number'), col('currency'), col('plan'), col('notes'), col('lang'), col('page'), col('status')]
      },
      options: {}
    }
  },
  output: [{ id: 1 }]
});
const leadEmail = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Lead email',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const q = $('Check quote request').first().json;
const id = $input.first().json.id;
const esc = (v) => String(v == null || v === '' ? '-' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\n/g, '<br>');
const nf = (n) => Number(n || 0).toLocaleString('en-US');
const levels = { economy: 'اقتصادي', standard: 'متوسط', luxury: 'فاخر' };
const rows = [['رقم الطلب', '#' + id], ['الاسم', q.name], ['الجوال', q.phone], ['البريد', q.email], ['الدولة / المدينة', q.country + ' / ' + q.city],
  ['المساحة المبنية', q.area + ' م²'], ['مستوى التشطيب', levels[q.level] || q.level], ['التربة', q.soil], ['التقدير', nf(q.low) + ' – ' + nf(q.high) + ' ' + q.currency],
  ['المخطط', q.plan], ['ملاحظات', q.notes], ['اللغة', q.lang], ['الصفحة', q.page]];
const html = '<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;font-size:15px;line-height:1.7;color:#0A253E"><h2 style="margin:0 0 12px">طلب عروض مقاولين للبناء</h2><table style="border-collapse:collapse;width:100%;max-width:720px">'
  + rows.map(([k, v]) => '<tr><th style="text-align:right;padding:8px 12px;background:#F4F6F8;border:1px solid #DCE3EA;width:170px">' + k + '</th><td style="padding:8px 12px;border:1px solid #DCE3EA">' + esc(v) + '</td></tr>').join('')
  + '</table><p style="color:#556779;font-size:13px">من حاسبة تكلفة البناء في design.oxira.sa/cost/ — الجدول oxira_design_build_leads.</p></div>';
return [{ json: { id, subject: 'طلب عروض بناء #' + id + ' · ' + q.city + ' · ' + q.area + ' م²', html } }];`
    }
  },
  output: [{ id: 1, subject: 'طلب عروض بناء #1', html: '<div></div>' }]
});
const sendLead = node({
  type: 'n8n-nodes-base.emailSend',
  version: 2.1,
  config: {
    name: 'Email build lead',
    parameters: { fromEmail: 'Oxira Design <info@oxira.sa>', toEmail: 'info@oxira.sa', subject: expr('{{ $json.subject }}'), html: expr('{{ $json.html }}'), options: { appendAttribution: false } },
    credentials: smtp,
    onError: 'continueRegularOutput'
  },
  output: [{ success: true }]
});
const replyQuote = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: { name: 'Reply quote', parameters: { respondWith: 'json', responseBody: expr("{{ JSON.stringify({ success: true, id: $('Lead email').first().json.id }) }}"), options: { responseCode: 200 } } }
});
const replyQuoteBad = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: { name: 'Reply quote rejected', parameters: { respondWith: 'json', responseBody: expr('{{ JSON.stringify({ success: false, reason: $json.reason }) }}'), options: { responseCode: 200 } } }
});

// ---------------------------------------------------------------- monthly rate research
const monthly = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.2,
  config: { name: 'Monthly 1st 09:00', parameters: { rule: { interval: [{ field: 'cronExpression', expression: '0 9 1 * *' }] } } }
});
const getActiveM = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Current rates',
    alwaysOutputData: true,
    executeOnce: true,
    parameters: { resource: 'row', operation: 'get', dataTableId: ratesTable, matchType: 'allConditions', filters: { conditions: [{ keyName: 'status', condition: 'eq', keyValue: 'active' }] }, returnAll: true }
  },
  output: [{ id: 1, rates: '{"updated":"2026-10"}', status: 'active' }]
});
const buildResearch = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Research request',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `// Asks Claude (with web search) for current villa construction prices, starting from the active rates.
const rows = $input.all().map((i) => i.json).filter((r) => r && r.id && r.rates).sort((a, b) => b.id - a.id);
const current = JSON.parse(rows[0].rates);
const pick = (c) => ({ shell: c.shell, finish: c.finish, steelTon: c.steelTon, cementTon: c.cementTon });
const now = { SA: pick(current.SA), EG: pick(current.EG) };
const month = $now.setZone('Asia/Riyadh').toFormat('LLLL yyyy');
const system = 'You keep a construction-cost calculator up to date. Use web search to find prices published in the last few months for building private villas. '
  + 'Values are per square metre of built area, materials and labour included: shell = structure with materials (excavation, foundations, reinforced concrete frame, slabs, block/brick walls); '
  + 'finish = finishing work added on top of the shell (plaster, MEP, tiles, paint, doors, windows, kitchens, bathrooms) at three levels. Also steel rebar price per ton and (Egypt) cement per ton. '
  + 'Saudi Arabia in SAR, Egypt in EGP. Prefer several independent recent sources (contractors, price bulletins, official statistics) and give ranges [low, high] as integers. '
  + 'If you cannot find reliable newer data for a value, return the current value unchanged. Reply with ONE JSON object only, no prose: '
  + '{"SA": {"shell": [lo, hi], "finish": {"economy": [lo, hi], "standard": [lo, hi], "luxury": [lo, hi]}, "steelTon": [lo, hi]}, '
  + '"EG": {"shell": [lo, hi], "finish": {"economy": [lo, hi], "standard": [lo, hi], "luxury": [lo, hi]}, "steelTon": [lo, hi], "cementTon": [lo, hi]}, '
  + '"notes": "two or three sentences in Arabic on what changed and why", "sources": [{"title": "...", "url": "https://..."}]}';
const request = {
  model: 'claude-sonnet-5', max_tokens: 16000, system,
  tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 10 }],
  messages: [{ role: 'user', content: 'Month: ' + month + '. Current values: ' + JSON.stringify(now) }]
};
return [{ json: { current, request } }];`
    }
  },
  output: [{ current: { updated: '2026-10' }, request: {} }]
});
const askClaude = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.2,
  config: {
    name: 'Research with Claude',
    parameters: {
      method: 'POST', url: 'https://api.anthropic.com/v1/messages', authentication: 'predefinedCredentialType', nodeCredentialType: 'anthropicApi',
      sendHeaders: true, headerParameters: { parameters: [{ name: 'anthropic-version', value: '2023-06-01' }] },
      sendBody: true, specifyBody: 'json', jsonBody: expr('{{ JSON.stringify($json.request) }}'),
      options: { timeout: 600000 }
    },
    credentials: anthropic
  },
  output: [{ content: [{ type: 'text', text: '{}' }] }]
});
const proposal = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Proposed rates',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `// Merges Claude's figures into the current rates. A value is taken only if it is a sane range
// that moves the midpoint by at most 35%; anything else keeps the current value and is listed for review.
const cur = $('Research request').first().json.current;
const res = $input.first().json || {};
const text = Array.isArray(res.content) ? res.content.filter((c) => c.type === 'text').map((c) => c.text).join('') : '';
let p = {};
try { p = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)); } catch (e) { p = {}; }
const next = JSON.parse(JSON.stringify(cur));
const skipped = [], changed = [];
const ok = (r) => Array.isArray(r) && r.length === 2 && r.every((n) => Number.isFinite(Number(n)) && Number(n) > 0) && Number(r[0]) <= Number(r[1]);
const mid = (r) => (Number(r[0]) + Number(r[1])) / 2;
const take = (country, path, label) => {
  let a = cur[country], b = p[country];
  for (const k of path.slice(0, -1)) { a = a && a[k]; b = b && b[k]; }
  const k = path[path.length - 1];
  const oldR = a && a[k], newR = b && b[k];
  if (!oldR) return;
  if (!ok(newR)) { skipped.push(label + ': no usable value'); return; }
  const move = Math.abs(mid(newR) / mid(oldR) - 1);
  if (move > 0.35) { skipped.push(label + ': change of ' + Math.round(move * 100) + '% not taken (' + newR.join('–') + ')'); return; }
  let t = next[country];
  for (const kk of path.slice(0, -1)) t = t[kk];
  const v = [Math.round(Number(newR[0])), Math.round(Number(newR[1]))];
  if (v[0] !== oldR[0] || v[1] !== oldR[1]) changed.push({ label, from: oldR, to: v });
  t[k] = v;
};
for (const c of ['SA', 'EG']) {
  take(c, ['shell'], c + ' shell');
  for (const l of ['economy', 'standard', 'luxury']) take(c, ['finish', l], c + ' finish ' + l);
  take(c, ['steelTon'], c + ' steel/ton');
}
take('EG', ['cementTon'], 'EG cement/ton');
next.updated = $now.setZone('Asia/Riyadh').toFormat('yyyy-MM');
const token = [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
const sources = Array.isArray(p.sources) ? p.sources.filter((s) => s && /^https?:\\/\\//.test(String(s.url || ''))).slice(0, 12) : [];
const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmt = (r) => r.map((n) => Number(n).toLocaleString('en-US')).join(' – ');
const link = 'https://api.oxira.sa/oxira-design-cost-approve?t=' + token;
const html = '<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;font-size:15px;line-height:1.7;color:#0A253E;max-width:680px"><h2 style="margin:0 0 8px">تحديث أسعار حاسبة تكلفة البناء</h2>'
  + '<p>' + esc(p.notes || 'لم يرجع البحث ملاحظات.') + '</p>'
  + (changed.length ? '<table style="border-collapse:collapse;width:100%"><tr><th style="text-align:right;padding:6px 10px;background:#F4F6F8;border:1px solid #DCE3EA">البند</th><th style="padding:6px 10px;background:#F4F6F8;border:1px solid #DCE3EA">الحالي</th><th style="padding:6px 10px;background:#F4F6F8;border:1px solid #DCE3EA">المقترح</th></tr>'
    + changed.map((c) => '<tr><td style="padding:6px 10px;border:1px solid #DCE3EA">' + esc(c.label) + '</td><td dir="ltr" style="padding:6px 10px;border:1px solid #DCE3EA">' + fmt(c.from) + '</td><td dir="ltr" style="padding:6px 10px;border:1px solid #DCE3EA;font-weight:700">' + fmt(c.to) + '</td></tr>').join('') + '</table>'
    : '<p>لا يوجد تغيير مقترح هذا الشهر.</p>')
  + (skipped.length ? '<p style="color:#8A5A00">لم تُؤخذ: ' + skipped.map(esc).join('، ') + '</p>' : '')
  + (sources.length ? '<p><b>المصادر:</b><br>' + sources.map((s) => '<a href="' + esc(s.url) + '">' + esc(s.title || s.url) + '</a>').join('<br>') + '</p>' : '')
  + (changed.length ? '<p style="margin-top:18px"><a href="' + link + '" style="background:#F5A800;color:#0A253E;padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:700">اعتمد الأسعار الجديدة</a></p><p style="color:#556779;font-size:13px">لن تتغير الأسعار في الموقع قبل الضغط على الرابط. لو تجاهلت الرسالة تبقى الأسعار الحالية.</p>' : '')
  + '</div>';
return [{ json: { rates: JSON.stringify(next), status: 'pending', updated: next.updated, token, notes: String(p.notes || '').slice(0, 1500), sources: JSON.stringify(sources).slice(0, 4000), changes: changed.length,
  subject: changed.length ? 'اعتماد أسعار البناء لشهر ' + next.updated + ' (' + changed.length + ' تغيير)' : 'أسعار البناء لشهر ' + next.updated + ': لا تغيير', html } }];`
    }
  },
  output: [{ rates: '{}', status: 'pending', updated: '2026-11', token: 'abc', notes: '', sources: '[]', changes: 1, subject: 'اعتماد', html: '<div></div>' }]
});
const savePending = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Save proposed rates',
    parameters: {
      resource: 'row', operation: 'insert', dataTableId: ratesTable,
      columns: {
        mappingMode: 'defineBelow',
        value: { rates: expr('{{ $json.rates }}'), status: 'pending', updated: expr('{{ $json.updated }}'), token: expr('{{ $json.token }}'), notes: expr('{{ $json.notes }}'), sources: expr('{{ $json.sources }}') },
        schema: [col('rates'), col('status'), col('updated'), col('token'), col('notes'), col('sources')]
      },
      options: {}
    }
  },
  output: [{ id: 2 }]
});
const sendProposal = node({
  type: 'n8n-nodes-base.emailSend',
  version: 2.1,
  config: {
    name: 'Email proposed rates',
    parameters: { fromEmail: 'Oxira Design <info@oxira.sa>', toEmail: 'info@oxira.sa', subject: expr("{{ $('Proposed rates').first().json.subject }}"), html: expr("{{ $('Proposed rates').first().json.html }}"), options: { appendAttribution: false } },
    credentials: smtp
  },
  output: [{ success: true }]
});

// ---------------------------------------------------------------- approval
const approveHook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: { name: 'Approve rates', parameters: { httpMethod: 'GET', path: 'oxira-design-cost-approve', responseMode: 'responseNode', options: {} } },
  output: [{ query: { t: 'abc' } }]
});
const getPending = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Find proposed rates',
    alwaysOutputData: true,
    parameters: {
      resource: 'row', operation: 'get', dataTableId: ratesTable, matchType: 'allConditions',
      filters: { conditions: [
        { keyName: 'token', condition: 'eq', keyValue: expr("{{ /^[a-f0-9]{32}$/.test(String($json.query.t || '')) ? $json.query.t : 'none' }}") },
        { keyName: 'status', condition: 'eq', keyValue: 'pending' }
      ] },
      limit: 1
    }
  },
  output: [{ id: 2, status: 'pending' }]
});
const found = ifElse({ version: 2.2, config: { name: 'Found?', parameters: cond('{{ !!$json.id }}') } });
const activate = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Make rates active',
    parameters: {
      resource: 'row', operation: 'update', dataTableId: ratesTable, matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'id', condition: 'eq', keyValue: expr('{{ $json.id }}') }] },
      columns: { mappingMode: 'defineBelow', value: { status: 'active', token: '' }, schema: [col('status'), col('token')] },
      options: {}
    }
  },
  output: [{ id: 2 }]
});
const page = (title, body) => '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Oxira Design</title></head><body style="font-family:Tahoma,Arial,sans-serif;color:#0A253E;max-width:520px;margin:15vh auto;padding:0 20px;text-align:center"><h2>' + title + '</h2><p>' + body + '</p><p><a href="https://design.oxira.sa/cost/">design.oxira.sa/cost/</a></p></body></html>';
const htmlHeaders = { entries: [{ name: 'Content-Type', value: 'text/html; charset=utf-8' }] };
const replyApproved = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: { name: 'Reply approved', parameters: { respondWith: 'text', responseBody: page('تم اعتماد الأسعار الجديدة', 'الحاسبة في الموقع تستخدمها الآن (قد يستغرق ظهورها حتى ساعة).'), options: { responseCode: 200, responseHeaders: htmlHeaders } } }
});
const replyNotFound = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: { name: 'Reply link used', parameters: { respondWith: 'text', responseBody: page('الرابط غير صالح أو استُخدم من قبل', 'لم يتغير شيء في الأسعار.'), options: { responseCode: 404, responseHeaders: htmlHeaders } } }
});

const note = sticky('## Oxira Design — Build costs\n- `POST oxira-design-cost-rates` → latest **active** row of **oxira_design_cost_rates** (site falls back to bundled rates)\n- `POST oxira-design-build-quote` → **oxira_design_build_leads** + email to info@ (5/IP/day)\n- Monthly 1st 09:00 Riyadh: Claude + web search → **pending** row + approval email\n- `GET oxira-design-cost-approve?t=` → pending row becomes active', [ratesHook, quoteHook, monthly, approveHook], { color: 4 });

export default workflow('oxira-design-costs', 'Oxira Design — Build costs')
  .add(ratesHook)
  .to(getActive)
  .to(pickRates)
  .to(replyRates)
  .add(quoteHook)
  .to(checkQuote)
  .to(validQuote
    .onTrue(saveLead.to(leadEmail).to(sendLead).to(replyQuote))
    .onFalse(replyQuoteBad))
  .add(monthly)
  .to(getActiveM)
  .to(buildResearch)
  .to(askClaude)
  .to(proposal)
  .to(savePending)
  .to(sendProposal)
  .add(approveHook)
  .to(getPending)
  .to(found
    .onTrue(activate.to(replyApproved))
    .onFalse(replyNotFound))
  .add(note);
