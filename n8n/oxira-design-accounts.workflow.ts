import { workflow, node, trigger, sticky, ifElse, switchCase, expr } from '@n8n/workflow-sdk';

// "Oxira Design — Accounts": sign in with an emailed link (same token table as the oxira.sa portal),
// saved plan projects with share links, the client's orders with a message thread and ratings,
// and the designer portal (open orders, claim, deliver files to the client).

const ORIGINS = 'https://design.oxira.sa,https://ibrasalato.github.io,http://localhost:4321';
const smtp = { smtp: { id: 'Jd9L9EGYmDKHV0KB', name: 'SMTP account' } };
const tokensTable = { __rl: true, mode: 'id', value: 'u6vv22LcKEn5MIIx', cachedResultName: 'oxira_portal_tokens' };
const projectsTable = { __rl: true, mode: 'id', value: 'X6k7SyQQoGAmf0rv', cachedResultName: 'oxira_design_projects' };
const commentsTable = { __rl: true, mode: 'id', value: 'pswJknyVNGLf7WIK', cachedResultName: 'oxira_design_comments' };
const designersTable = { __rl: true, mode: 'id', value: 'f0btqmWoVKQTrIcx', cachedResultName: 'oxira_design_designers' };
const ordersTable = { __rl: true, mode: 'id', value: '8aPzt7Ki9h8b4uDp', cachedResultName: 'oxira_design_orders' };
const waitlistTable = { __rl: true, mode: 'id', value: 'I6RXiokIRkjBrDJd', cachedResultName: 'oxira_design_waitlist' };

const col = (id, type = 'string') => ({ id, displayName: id, required: false, defaultMatch: false, display: true, type, canBeUsedToMatch: true });
const cond = (expression) => ({
  conditions: {
    options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' },
    conditions: [{ leftValue: expr(expression), operator: { type: 'boolean', operation: 'true', singleValue: true } }],
    combinator: 'and'
  }
});
const respond = (name, body) => node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: { name, parameters: { respondWith: 'json', responseBody: expr(body), options: { responseCode: 200 } } }
});
const rule = (key) => ({ outputKey: key, renameOutput: true, conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' }, conditions: [{ leftValue: expr('{{ $json.op.kind }}'), operator: { type: 'string', operation: 'equals' }, rightValue: key }], combinator: 'and' } });

// ================================================================ sign-in link
const loginHook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: { name: 'Sign-in request', parameters: { httpMethod: 'POST', path: 'oxira-design-login', responseMode: 'responseNode', options: { allowedOrigins: ORIGINS } } },
  output: [{ headers: {}, body: { email: 'client@example.com', lang: 'ar' } }]
});

const loginFields = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Sign-in fields',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `let b = $input.first().json.body;
if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
b = b || {};
const email = String(b.email || '').trim().toLowerCase().slice(0, 160);
const LANGS = ['ar', 'en', 'de', 'fr', 'ru', 'es', 'tr', 'zh', 'hi', 'ur'];
const lang = LANGS.includes(b.lang) ? b.lang : 'ar';
const valid = /^[^\\s@<>"'(),;:\\\\]{1,64}@[a-z0-9.-]{1,120}\\.[a-z]{2,24}$/i.test(email);
return [{ json: { email: valid ? email : '', lang, valid } }];`
    }
  },
  output: [{ email: 'client@example.com', lang: 'ar', valid: true }]
});

const recentTokens = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Recent sign-in tokens',
    parameters: {
      resource: 'row', operation: 'get', dataTableId: tokensTable, matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'email', condition: 'eq', keyValue: expr("{{ $json.valid ? $json.email : 'no-email' }}") }] },
      returnAll: false, limit: 10, orderBy: true, orderByColumn: 'createdAt', orderByDirection: 'DESC'
    },
    alwaysOutputData: true,
    executeOnce: true
  },
  output: [{ id: 1, email: 'client@example.com', token: 'abc', createdAt: '2026-10-09T10:00:00.000Z' }]
});

const makeLink = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Make sign-in link',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `// One link per email every 2 minutes, 5 per hour. Links work for 30 days.
const f = $('Sign-in fields').first().json;
const now = Date.now();
const recent = $('Recent sign-in tokens').all().map((i) => i.json).filter((r) => r && r.id && String(r.email || '').toLowerCase() === f.email).map((r) => new Date(r.createdAt).getTime()).filter((t) => !isNaN(t));
const send = f.valid && !recent.some((t) => now - t < 120000) && recent.filter((t) => now - t < 3600000).length < 5;
let token = '';
for (let i = 0; i < 40; i++) token += Math.floor(Math.random() * 16).toString(16);
const link = 'https://design.oxira.sa' + (f.lang === 'ar' ? '' : '/' + f.lang) + '/account/?k=' + token;
const T = {
  ar: { dir: 'rtl', subject: 'رابط الدخول إلى حسابك في Oxira Design', h: 'الدخول إلى حسابك', p: 'اضغط الزر لفتح حسابك: مخططاتك المحفوظة وطلباتك ورسائل المصمم. الرابط صالح 30 يوماً، لا تشاركه مع أحد.', b: 'افتح حسابي', n: 'إذا لم تطلب هذا الرابط تجاهل الرسالة.' },
  en: { dir: 'ltr', subject: 'Your Oxira Design sign-in link', h: 'Sign in to your account', p: 'Use the button to open your saved plans, your orders and messages from your designer. The link works for 30 days; do not share it.', b: 'Open my account', n: 'If you did not ask for this link, ignore this email.' },
}[f.lang === 'ar' ? 'ar' : 'en'];
const html = '<div dir="' + T.dir + '" style="font-family:Tahoma,Arial,sans-serif;font-size:15px;line-height:1.9;color:#0A253E;max-width:520px"><p style="font-size:20px;font-weight:bold;margin:0 0 6px">Oxira <span style="color:#007DB4">Design</span></p><h2 style="margin:0 0 10px">' + T.h + '</h2><p>' + T.p + '</p><p><a href="' + link + '" style="display:inline-block;background:#F5A800;color:#0A253E;font-weight:700;padding:12px 22px;border-radius:10px;text-decoration:none">' + T.b + '</a></p><p style="color:#556779;font-size:13px">' + T.n + '</p></div>';
return [{ json: { send, token, email: f.email, expires: DateTime.now().plus({ days: 30 }).toISO(), subject: T.subject, html } }];`
    }
  },
  output: [{ send: true, token: 'abc', email: 'client@example.com', expires: '2026-11-08T10:00:00.000Z', subject: 'x', html: '<p>x</p>' }]
});

const sendLink = ifElse({ version: 2.2, config: { name: 'Send link?', parameters: cond('{{ $json.send }}') } });

const saveToken = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Save sign-in token',
    parameters: {
      resource: 'row', operation: 'insert', dataTableId: tokensTable,
      columns: { mappingMode: 'defineBelow', value: { token: expr('{{ $json.token }}'), email: expr('{{ $json.email }}'), expires: expr('{{ $json.expires }}'), role: 'design' }, schema: [col('token'), col('email'), col('expires'), col('role')] },
      options: {}
    }
  },
  output: [{ id: 5, token: 'abc', email: 'client@example.com' }]
});

const emailLink = node({
  type: 'n8n-nodes-base.emailSend',
  version: 2.1,
  config: {
    name: 'Email sign-in link',
    parameters: {
      fromEmail: 'Oxira Design <info@oxira.sa>',
      toEmail: expr("{{ $('Make sign-in link').first().json.email }}"),
      subject: expr("{{ $('Make sign-in link').first().json.subject }}"),
      html: expr("{{ $('Make sign-in link').first().json.html }}"),
      options: { appendAttribution: false }
    },
    credentials: smtp,
    onError: 'continueRegularOutput'
  },
  output: [{ success: true }]
});

const replyLogin = respond('Reply sign-in', '{{ JSON.stringify({ success: true }) }}');
const replyLoginSkipped = respond('Reply sign-in (skipped)', '{{ JSON.stringify({ success: true }) }}');

// ================================================================ account
const accHook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: { name: 'Account request', parameters: { httpMethod: 'POST', path: 'oxira-design-account', responseMode: 'responseNode', options: { allowedOrigins: ORIGINS } } },
  output: [{ headers: {}, body: { k: 'abc', action: 'load', data: {} } }]
});

const findSession = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Find session',
    parameters: {
      resource: 'row', operation: 'get', dataTableId: tokensTable, matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'token', condition: 'eq', keyValue: expr("{{ /^[a-f0-9]{40}$/.test(String(($json.body || {}).k || '')) ? $json.body.k : 'invalid' }}") }] },
      returnAll: false, limit: 1
    },
    alwaysOutputData: true
  },
  output: [{ id: 5, token: 'abc', email: 'client@example.com', expires: '2026-11-08T10:00:00.000Z' }]
});

const checkSession = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Check session',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const row = $input.first().json || {};
let b = $('Account request').first().json.body;
if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
b = b || {};
const ok = !!row.email && !!row.expires && DateTime.fromISO(row.expires) > DateTime.now();
let data = b.data || {};
if (typeof data === 'string') { try { data = JSON.parse(data); } catch (e) { data = {}; } }
return [{ json: { ok, email: String(row.email || '').toLowerCase(), action: String(b.action || 'load').slice(0, 20), data, lang: String(b.lang || 'ar').slice(0, 5) } }];`
    }
  },
  output: [{ ok: true, email: 'client@example.com', action: 'load', data: {}, lang: 'ar' }]
});

const signedIn = ifElse({ version: 2.2, config: { name: 'Signed in?', parameters: cond('{{ $json.ok }}') } });

const myProjects = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'My projects',
    parameters: { resource: 'row', operation: 'get', dataTableId: projectsTable, matchType: 'allConditions', filters: { conditions: [{ keyName: 'owner', condition: 'eq', keyValue: expr("{{ $('Check session').first().json.email }}") }] }, returnAll: true },
    alwaysOutputData: true, executeOnce: true
  },
  output: [{ id: 1, pid: 'p1', owner: 'client@example.com', title: 'Villa', kind: 'plan', data: '{}', share_id: 's1', updated: '2026-10-09' }]
});

const myOrders = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'My orders',
    parameters: { resource: 'row', operation: 'get', dataTableId: ordersTable, matchType: 'allConditions', filters: { conditions: [{ keyName: 'email', condition: 'ilike', keyValue: expr("{{ $('Check session').first().json.email }}") }] }, returnAll: true },
    alwaysOutputData: true, executeOnce: true
  },
  output: [{ id: 7, email: 'client@example.com', package: 'plan', status: 'جديد' }]
});

const designerRow = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Designer',
    parameters: { resource: 'row', operation: 'get', dataTableId: designersTable, matchType: 'allConditions', filters: { conditions: [{ keyName: 'email', condition: 'ilike', keyValue: expr("{{ $('Check session').first().json.email }}") }] }, returnAll: false, limit: 1 },
    alwaysOutputData: true, executeOnce: true
  },
  output: [{ id: 1, email: 'designer@example.com', status: 'active' }]
});

const recentOrders = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Recent orders',
    parameters: { resource: 'row', operation: 'get', dataTableId: ordersTable, returnAll: false, limit: 80, orderBy: true, orderByColumn: 'createdAt', orderByDirection: 'DESC' },
    alwaysOutputData: true, executeOnce: true
  },
  output: [{ id: 8, email: 'other@example.com', package: 'plan', status: 'جديد' }]
});

const claimedOrders = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Claimed orders',
    parameters: { resource: 'row', operation: 'get', dataTableId: ordersTable, matchType: 'allConditions', filters: { conditions: [{ keyName: 'designer', condition: 'ilike', keyValue: expr("{{ $('Check session').first().json.email }}") }] }, returnAll: true },
    alwaysOutputData: true, executeOnce: true
  },
  output: [{ id: 9, email: 'other@example.com', designer: 'designer@example.com' }]
});

const clientComments = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Client comments',
    parameters: { resource: 'row', operation: 'get', dataTableId: commentsTable, matchType: 'allConditions', filters: { conditions: [{ keyName: 'client', condition: 'ilike', keyValue: expr("{{ $('Check session').first().json.email }}") }] }, returnAll: true },
    alwaysOutputData: true, executeOnce: true
  },
  output: [{ id: 1, order_id: 7, client: 'client@example.com', author: 'client@example.com', role: 'client', text: 'hi' }]
});

const designerComments = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Designer comments',
    parameters: { resource: 'row', operation: 'get', dataTableId: commentsTable, matchType: 'allConditions', filters: { conditions: [{ keyName: 'designer', condition: 'ilike', keyValue: expr("{{ $('Check session').first().json.email }}") }] }, returnAll: true },
    alwaysOutputData: true, executeOnce: true
  },
  output: [{ id: 2, order_id: 9, designer: 'designer@example.com', author: 'designer@example.com', role: 'designer', text: 'hello' }]
});

const account = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Account',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `// Builds what the account page shows and decides the one change (op) this request makes.
const s = $('Check session').first().json;
const rows = (n) => $(n).all().map((i) => i.json).filter((r) => r && r.id);
const lc = (v) => String(v || '').trim().toLowerCase();
const clip = (v, n) => String(v == null ? '' : v).replace(/[<>]/g, '').trim().slice(0, n);
const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\n/g, '<br>');
const projects = rows('My projects').filter((p) => lc(p.owner) === s.email);
const orders = rows('My orders').filter((o) => lc(o.email) === s.email);
const des = rows('Designer').find((d) => lc(d.email) === s.email) || null;
const isAdmin = !!des && des.status === 'admin';
const isDesigner = !!des && (des.status === 'active' || isAdmin);
const byId = new Map();
for (const o of [...rows('Recent orders'), ...rows('Claimed orders'), ...orders]) byId.set(o.id, o);
const all = [...byId.values()];
const seen = new Set();
const comments = [...rows('Client comments'), ...rows('Designer comments')].filter((c) => (seen.has(c.id) ? false : seen.add(c.id)));
const thread = (id) => comments.filter((c) => c.order_id === id).sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt))).map((c) => ({ role: c.role, text: c.text, at: c.createdAt, mine: lc(c.author) === s.email }));
const sumOf = (o) => { try { return JSON.parse(o.summary || '{}'); } catch (e) { return {}; } };
const CLOSED = ['بانتظار الدفع', 'تم التسليم', 'ملغي'];
const pub = (o, designerView) => {
  const sm = sumOf(o);
  const v = { id: o.id, package: o.package || '', status: o.status || '', created: o.createdAt, price_note: o.price_note || '', area: o.area || 0, style: o.style || '', city: o.city || '', files: o.files || '', delivered_at: o.delivered_at || '', rating: Number(o.rating) || 0, review: o.review || '', has_designer: !!o.designer, share: sm.share || '', comments: thread(o.id) };
  if (designerView) { v.notes = clip(o.notes, 3000); v.client = clip(o.contact_name, 60); v.lang = o.lang || ''; v.designer = o.designer || ''; v.planTypes = sm.planTypes || []; }
  return v;
};
const view = {
  success: true,
  email: s.email,
  designer: des ? des.status : '',
  projects: projects.sort((a, b) => String(b.updated).localeCompare(String(a.updated))).map((p) => ({ pid: p.pid, title: p.title, kind: p.kind, updated: p.updated, share: p.share_id, public: !!p.public })),
  orders: orders.sort((a, b) => b.id - a.id).map((o) => pub(o, false)),
};
if (isDesigner) {
  view.open = all.filter((o) => !o.designer && !CLOSED.includes(o.status)).sort((a, b) => b.id - a.id).slice(0, 40).map((o) => pub(o, true));
  view.mine = all.filter((o) => lc(o.designer) === s.email || (isAdmin && o.designer)).sort((a, b) => b.id - a.id).map((o) => pub(o, true));
}
const d = s.data || {};
const rnd = (n) => { let t = ''; const a = 'abcdefghijkmnpqrstuvwxyz23456789'; for (let i = 0; i < n; i++) t += a[Math.floor(Math.random() * a.length)]; return t; };
let op = { kind: 'none' };
let error = '';
const mine = (id) => orders.find((o) => o.id === Number(id));
const asDesigner = (id) => { const o = byId.get(Number(id)); return o && isDesigner && (lc(o.designer) === s.email || isAdmin) ? o : null; };
if (s.action === 'project') {
  const p = projects.find((x) => x.pid === d.pid);
  if (!p) error = 'not_found'; else view.project = { pid: p.pid, title: p.title, data: p.data, share: p.share_id };
} else if (s.action === 'save') {
  const data = typeof d.data === 'string' ? d.data : JSON.stringify(d.data || {});
  const ex = projects.find((x) => x.pid === d.pid);
  if (data.length > 400000) error = 'too_big';
  else if (!ex && projects.length >= 50) error = 'limit';
  else op = { kind: 'save', pid: ex ? ex.pid : rnd(14), owner: s.email, title: clip(d.title, 80) || 'Plan', type: clip(d.kind, 20) || 'plan', data, share_id: ex ? ex.share_id : rnd(16), updated: DateTime.now().toISO(), lang: clip(s.lang, 5) };
} else if (s.action === 'publish') {
  // show a saved plan in the public gallery (the team gets an email and can unpublish it in the table)
  const ex = projects.find((x) => x.pid === d.pid);
  const on = !!d.public;
  if (!ex) error = 'not_found';
  else op = { kind: 'publish', pid: ex.pid, public: on, subject: (on ? 'مخطط جديد في المعرض: ' : 'أزيل من المعرض: ') + clip(ex.title, 80) + ' | Oxira Design',
    html: '<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;line-height:1.8">' + esc(s.email) + (on ? ' نشر' : ' أزال') + ' المخطط <b>' + esc(clip(ex.title, 80)) + '</b> ' + (on ? 'في' : 'من') + ' المعرض العام.<br><a href="https://design.oxira.sa/plan/?s=' + ex.share_id + '">افتح المخطط</a><br>لإخفائه: غيّر public إلى false في جدول oxira_design_projects.</div>' };
} else if (s.action === 'delete') {
  const ex = projects.find((x) => x.pid === d.pid);
  if (!ex) error = 'not_found'; else op = { kind: 'del', pid: ex.pid };
} else if (s.action === 'comment') {
  const text = clip(d.text, 2000);
  const o = mine(d.order_id) || asDesigner(d.order_id);
  if (!o || !text) error = 'not_found';
  else {
    const role = lc(o.email) === s.email ? 'client' : 'designer';
    const to = role === 'client' ? (o.designer || 'info@oxira.sa') : o.email;
    const ar = (o.lang || 'ar') === 'ar' || role === 'client';
    const link = 'https://design.oxira.sa' + (o.lang && o.lang !== 'ar' && role === 'designer' ? '/' + o.lang : '') + '/account/';
    op = { kind: 'comment', order_id: o.id, client: lc(o.email), designer: lc(o.designer), author: s.email, role, text, to: to || 'info@oxira.sa',
      subject: (ar ? 'رسالة جديدة على الطلب #' : 'New message on order #') + o.id + ' | Oxira Design',
      html: '<div dir="' + (ar ? 'rtl' : 'ltr') + '" style="font-family:Tahoma,Arial,sans-serif;font-size:15px;line-height:1.8;color:#0A253E;max-width:560px"><p style="font-size:18px;font-weight:bold;margin:0 0 6px">Oxira <span style="color:#007DB4">Design</span></p><p>' + (ar ? 'رسالة جديدة على الطلب #' : 'New message on order #') + o.id + ':</p><blockquote style="margin:0;padding:10px 14px;background:#F5F7F9;border-radius:10px">' + esc(text) + '</blockquote><p><a href="' + link + '">' + (ar ? 'افتح حسابك للرد' : 'Open your account to reply') + '</a></p></div>' };
  }
} else if (s.action === 'claim') {
  const o = byId.get(Number(d.order_id));
  if (!isDesigner || !o || o.designer || CLOSED.includes(o.status)) error = 'not_available';
  else op = { kind: 'claim', id: o.id, designer: s.email, status: 'قيد التنفيذ', subject: 'مصمم استلم الطلب #' + o.id + ' | Oxira Design', html: '<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;line-height:1.8">المصمم <b>' + esc(s.email) + '</b> استلم الطلب #' + o.id + ' (' + esc(o.package) + '). أرسل له ملفات العميل الأصلية من إيميل الطلب.</div>' };
} else if (s.action === 'rate') {
  const o = mine(d.order_id);
  const r = Math.round(Number(d.rating));
  if (!o || !o.delivered_at || !(r >= 1 && r <= 5)) error = 'not_found';
  else op = { kind: 'rate', id: o.id, rating: r, review: clip(d.review, 1000) };
} else if (s.action === 'apply') {
  if (des) error = 'exists';
  else op = { kind: 'apply', email: s.email, name: clip(d.name, 80), skills: clip(d.skills, 300), countries: clip(d.countries, 120), note: clip(d.note, 1000),
    subject: 'طلب انضمام مصمم: ' + clip(d.name, 80) + ' | Oxira Design',
    html: '<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;line-height:1.8"><b>' + esc(clip(d.name, 80)) + '</b> &lt;' + esc(s.email) + '&gt;<br>المهارات: ' + esc(clip(d.skills, 300)) + '<br>الدول: ' + esc(clip(d.countries, 120)) + '<br>' + esc(clip(d.note, 1000)) + '<br><br>للموافقة: غيّر الحالة إلى active في جدول oxira_design_designers.</div>' };
}
if (error) { view.success = false; view.reason = error; op = { kind: 'none' }; }
return [{ json: { view, op } }];`
    }
  },
  output: [{ view: { success: true }, op: { kind: 'none' } }]
});

const route = switchCase({
  version: 3.2,
  config: {
    name: 'Change',
    parameters: { rules: { values: [rule('save'), rule('del'), rule('comment'), rule('claim'), rule('rate'), rule('apply'), rule('publish')] }, options: { fallbackOutput: 'extra', renameFallbackOutput: 'view' } }
  }
});

const saveProject = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Save project',
    parameters: {
      resource: 'row', operation: 'upsert', dataTableId: projectsTable, matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'pid', condition: 'eq', keyValue: expr('{{ $json.op.pid }}') }] },
      columns: { mappingMode: 'defineBelow', value: { pid: expr('{{ $json.op.pid }}'), owner: expr('{{ $json.op.owner }}'), title: expr('{{ $json.op.title }}'), kind: expr('{{ $json.op.type }}'), data: expr('{{ $json.op.data }}'), share_id: expr('{{ $json.op.share_id }}'), updated: expr('{{ $json.op.updated }}'), lang: expr('{{ $json.op.lang }}') }, schema: [col('pid'), col('owner'), col('title'), col('kind'), col('data'), col('share_id'), col('updated'), col('lang')] },
      options: {}
    }
  },
  output: [{ id: 1, pid: 'p1' }]
});
const replySaved = respond('Reply project saved', "{{ JSON.stringify({ success: true, pid: $('Account').first().json.op.pid, share: $('Account').first().json.op.share_id }) }}");

const deleteProject = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Delete project',
    parameters: {
      resource: 'row', operation: 'deleteRows', dataTableId: projectsTable, matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'pid', condition: 'eq', keyValue: expr('{{ $json.op.pid }}') }, { keyName: 'owner', condition: 'eq', keyValue: expr("{{ $('Check session').first().json.email }}") }] },
      options: {}
    }
  },
  output: [{ id: 1 }]
});
const replyOk = respond('Reply ok', '{{ JSON.stringify({ success: true }) }}');

const saveComment = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Save message',
    parameters: {
      resource: 'row', operation: 'insert', dataTableId: commentsTable,
      columns: { mappingMode: 'defineBelow', value: { order_id: expr('{{ $json.op.order_id }}'), client: expr('{{ $json.op.client }}'), designer: expr('{{ $json.op.designer }}'), author: expr('{{ $json.op.author }}'), role: expr('{{ $json.op.role }}'), text: expr('{{ $json.op.text }}') }, schema: [col('order_id', 'number'), col('client'), col('designer'), col('author'), col('role'), col('text')] },
      options: {}
    }
  },
  output: [{ id: 3 }]
});
const notifyComment = node({
  type: 'n8n-nodes-base.emailSend',
  version: 2.1,
  config: {
    name: 'Notify about message',
    parameters: { fromEmail: 'Oxira Design <info@oxira.sa>', toEmail: expr("{{ $('Account').first().json.op.to }}"), subject: expr("{{ $('Account').first().json.op.subject }}"), html: expr("{{ $('Account').first().json.op.html }}"), options: { appendAttribution: false } },
    credentials: smtp,
    onError: 'continueRegularOutput'
  },
  output: [{ success: true }]
});
const replyComment = respond('Reply message sent', '{{ JSON.stringify({ success: true }) }}');

const claimOrder = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Claim order',
    parameters: {
      resource: 'row', operation: 'update', dataTableId: ordersTable, matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'id', condition: 'eq', keyValue: expr('{{ $json.op.id }}') }] },
      columns: { mappingMode: 'defineBelow', value: { designer: expr('{{ $json.op.designer }}'), status: expr('{{ $json.op.status }}') }, schema: [col('designer'), col('status')] },
      options: {}
    }
  },
  output: [{ id: 8 }]
});
const tellTeamClaim = node({
  type: 'n8n-nodes-base.emailSend',
  version: 2.1,
  config: {
    name: 'Tell the team (claim)',
    parameters: { fromEmail: 'Oxira Design <info@oxira.sa>', toEmail: 'info@oxira.sa', subject: expr("{{ $('Account').first().json.op.subject }}"), html: expr("{{ $('Account').first().json.op.html }}"), options: { appendAttribution: false } },
    credentials: smtp,
    onError: 'continueRegularOutput'
  },
  output: [{ success: true }]
});
const replyClaim = respond('Reply claimed', '{{ JSON.stringify({ success: true }) }}');

const rateOrder = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Save rating',
    parameters: {
      resource: 'row', operation: 'update', dataTableId: ordersTable, matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'id', condition: 'eq', keyValue: expr('{{ $json.op.id }}') }] },
      columns: { mappingMode: 'defineBelow', value: { rating: expr('{{ $json.op.rating }}'), review: expr('{{ $json.op.review }}') }, schema: [col('rating', 'number'), col('review')] },
      options: {}
    }
  },
  output: [{ id: 7 }]
});
const replyRated = respond('Reply rated', '{{ JSON.stringify({ success: true }) }}');

const applyDesigner = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Save designer application',
    parameters: {
      resource: 'row', operation: 'insert', dataTableId: designersTable,
      columns: { mappingMode: 'defineBelow', value: { email: expr('{{ $json.op.email }}'), name: expr('{{ $json.op.name }}'), skills: expr('{{ $json.op.skills }}'), countries: expr('{{ $json.op.countries }}'), note: expr('{{ $json.op.note }}'), status: 'pending' }, schema: [col('email'), col('name'), col('skills'), col('countries'), col('note'), col('status')] },
      options: {}
    }
  },
  output: [{ id: 2 }]
});
const tellTeamApply = node({
  type: 'n8n-nodes-base.emailSend',
  version: 2.1,
  config: {
    name: 'Tell the team (designer)',
    parameters: { fromEmail: 'Oxira Design <info@oxira.sa>', toEmail: 'info@oxira.sa', subject: expr("{{ $('Account').first().json.op.subject }}"), html: expr("{{ $('Account').first().json.op.html }}"), options: { appendAttribution: false } },
    credentials: smtp,
    onError: 'continueRegularOutput'
  },
  output: [{ success: true }]
});
const replyApplied = respond('Reply applied', '{{ JSON.stringify({ success: true }) }}');

const publishProject = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Publish project',
    parameters: {
      resource: 'row', operation: 'update', dataTableId: projectsTable, matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'pid', condition: 'eq', keyValue: expr('{{ $json.op.pid }}') }, { keyName: 'owner', condition: 'eq', keyValue: expr("{{ $('Check session').first().json.email }}") }] },
      columns: { mappingMode: 'defineBelow', value: { public: expr('{{ $json.op.public }}') }, schema: [col('public', 'boolean')] },
      options: {}
    }
  },
  output: [{ id: 1 }]
});
const tellTeamPublish = node({
  type: 'n8n-nodes-base.emailSend',
  version: 2.1,
  config: {
    name: 'Tell the team (gallery)',
    parameters: { fromEmail: 'Oxira Design <info@oxira.sa>', toEmail: 'info@oxira.sa', subject: expr("{{ $('Account').first().json.op.subject }}"), html: expr("{{ $('Account').first().json.op.html }}"), options: { appendAttribution: false } },
    credentials: smtp,
    onError: 'continueRegularOutput'
  },
  output: [{ success: true }]
});
const replyPublished = respond('Reply published', "{{ JSON.stringify({ success: true, public: $('Account').first().json.op.public }) }}");

const replyView = respond('Reply account', "{{ JSON.stringify($('Account').first().json.view) }}");
const replySignedOut = respond('Reply signed out', "{{ JSON.stringify({ success: false, reason: 'session' }) }}");

// ================================================================ deliver files to the client (designers)
const deliverHook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: { name: 'Deliver files', parameters: { httpMethod: 'POST', path: 'oxira-design-deliver', responseMode: 'responseNode', options: { allowedOrigins: ORIGINS, binaryPropertyName: 'file' } } },
  output: [{ headers: {}, body: { k: 'abc', order_id: '7', note: 'Here are the drawings' } }]
});

const deliverSession = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Deliver session',
    parameters: {
      resource: 'row', operation: 'get', dataTableId: tokensTable, matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'token', condition: 'eq', keyValue: expr("{{ /^[a-f0-9]{40}$/.test(String(($json.body || {}).k || '')) ? $json.body.k : 'invalid' }}") }] },
      returnAll: false, limit: 1
    },
    alwaysOutputData: true, executeOnce: true
  },
  output: [{ id: 5, email: 'designer@example.com', expires: '2026-11-08T10:00:00.000Z' }]
});

const deliverDesigner = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Deliver designer',
    parameters: { resource: 'row', operation: 'get', dataTableId: designersTable, matchType: 'allConditions', filters: { conditions: [{ keyName: 'email', condition: 'ilike', keyValue: expr("{{ $json.email || 'no-email' }}") }] }, returnAll: false, limit: 1 },
    alwaysOutputData: true, executeOnce: true
  },
  output: [{ id: 1, email: 'designer@example.com', status: 'active' }]
});

const deliverOrder = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Deliver order',
    parameters: { resource: 'row', operation: 'get', dataTableId: ordersTable, matchType: 'allConditions', filters: { conditions: [{ keyName: 'id', condition: 'eq', keyValue: expr("{{ Number($('Deliver files').first().json.body.order_id) || 0 }}") }] }, returnAll: false, limit: 1 },
    alwaysOutputData: true, executeOnce: true
  },
  output: [{ id: 7, email: 'client@example.com', designer: 'designer@example.com', lang: 'ar' }]
});

const checkDeliver = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Check delivery',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `// Only the designer who claimed the order (or an admin) can deliver. Files go to the client by email.
const hook = $('Deliver files').first();
const b = hook.json.body || {};
const sess = $('Deliver session').first().json || {};
const des = $('Deliver designer').first().json || {};
const o = $('Deliver order').first().json || {};
const lc = (v) => String(v || '').trim().toLowerCase();
const email = lc(sess.email);
const live = !!sess.expires && DateTime.fromISO(sess.expires) > DateTime.now();
const okDesigner = des.status === 'admin' || (des.status === 'active' && lc(o.designer) === email);
const binary = {};
const names = [];
let size = 0;
for (const [k, v] of Object.entries(hook.binary || {})) {
  const fn = String((v && v.fileName) || k);
  if (!/\\.(pdf|dwg|dxf|png|jpe?g|webp|zip|max|skp|rvt|ifc|glb)$/i.test(fn)) continue;
  binary[k] = v; names.push(fn);
}
const ok = live && okDesigner && !!o.id && !!o.email && names.length > 0;
const ar = (o.lang || 'ar') === 'ar';
const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\n/g, '<br>');
const note = String(b.note || '').slice(0, 2000);
const link = 'https://design.oxira.sa' + (ar ? '' : '/' + (o.lang || 'en')) + '/account/';
const html = '<div dir="' + (ar ? 'rtl' : 'ltr') + '" style="font-family:Tahoma,Arial,sans-serif;font-size:15px;line-height:1.8;color:#0A253E;max-width:600px"><p style="font-size:20px;font-weight:bold;margin:0 0 6px">Oxira <span style="color:#007DB4">Design</span></p><p>' + (ar ? 'تم تسليم ملفات طلبك #' : 'The files for your order #') + o.id + (ar ? '، تجدها مرفقة بهذه الرسالة.' : ' are attached to this email.') + '</p>' + (note ? '<blockquote style="margin:0;padding:10px 14px;background:#F5F7F9;border-radius:10px">' + esc(note) + '</blockquote>' : '') + '<p><a href="' + link + '">' + (ar ? 'قيّم التصميم أو اطلب تعديلاً من حسابك' : 'Rate the work or ask for changes in your account') + '</a></p></div>';
const out = { json: { ok, reason: ok ? '' : 'denied', id: o.id || 0, to: o.email || '', client: lc(o.email), designer: email, files: names.join(', '), attach: Object.keys(binary).join(','), subject: (ar ? 'ملفات طلبك #' : 'Your files, order #') + (o.id || '') + ' | Oxira Design', html, note: note || (ar ? 'تم تسليم الملفات: ' : 'Files delivered: ') + names.join(', '), at: DateTime.now().setZone('Asia/Riyadh').toFormat('yyyy-MM-dd HH:mm') } };
if (ok) out.binary = binary;
return [out];`
    }
  },
  output: [{ ok: true, id: 7, to: 'client@example.com', attach: 'file0', subject: 'x', html: 'x', note: 'x', at: '2026-10-09 22:00' }]
});

const deliverOk = ifElse({ version: 2.2, config: { name: 'Can deliver?', parameters: cond('{{ $json.ok }}') } });

const emailFiles = node({
  type: 'n8n-nodes-base.emailSend',
  version: 2.1,
  config: {
    name: 'Email files to client',
    parameters: { fromEmail: 'Oxira Design <info@oxira.sa>', toEmail: expr('{{ $json.to }}'), subject: expr('{{ $json.subject }}'), html: expr('{{ $json.html }}'), options: { appendAttribution: false, attachments: expr('{{ $json.attach }}'), bccEmail: 'info@oxira.sa' } },
    credentials: smtp
  },
  output: [{ success: true }]
});

const markDelivered = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Mark delivered',
    parameters: {
      resource: 'row', operation: 'update', dataTableId: ordersTable, matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'id', condition: 'eq', keyValue: expr("{{ $('Check delivery').first().json.id }}") }] },
      columns: { mappingMode: 'defineBelow', value: { status: 'تم التسليم', delivered_at: expr("{{ $('Check delivery').first().json.at }}") }, schema: [col('status'), col('delivered_at')] },
      options: {}
    }
  },
  output: [{ id: 7 }]
});

const logDelivery = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Log delivery message',
    parameters: {
      resource: 'row', operation: 'insert', dataTableId: commentsTable,
      columns: { mappingMode: 'defineBelow', value: { order_id: expr("{{ $('Check delivery').first().json.id }}"), client: expr("{{ $('Check delivery').first().json.client }}"), designer: expr("{{ $('Check delivery').first().json.designer }}"), author: expr("{{ $('Check delivery').first().json.designer }}"), role: 'designer', text: expr("{{ $('Check delivery').first().json.note }}") }, schema: [col('order_id', 'number'), col('client'), col('designer'), col('author'), col('role'), col('text')] },
      options: {}
    }
  },
  output: [{ id: 4 }]
});

const replyDelivered = respond('Reply delivered', '{{ JSON.stringify({ success: true }) }}');
const replyDenied = respond('Reply delivery denied', "{{ JSON.stringify({ success: false, reason: $json.reason }) }}");

// ================================================================ shared plan (read-only link)
const shareHook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: { name: 'Shared plan', parameters: { httpMethod: 'POST', path: 'oxira-design-share', responseMode: 'responseNode', options: { allowedOrigins: ORIGINS } } },
  output: [{ headers: {}, body: { s: 'abcdefghijkmnpqr' } }]
});

const getShared = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Find shared plan',
    parameters: { resource: 'row', operation: 'get', dataTableId: projectsTable, matchType: 'allConditions', filters: { conditions: [{ keyName: 'share_id', condition: 'eq', keyValue: expr("{{ /^[a-z0-9]{16}$/.test(String(($json.body || {}).s || '')) ? $json.body.s : 'invalid' }}") }] }, returnAll: false, limit: 1 },
    alwaysOutputData: true
  },
  output: [{ id: 1, title: 'Villa', data: '{}' }]
});

const replyShared = respond('Reply shared plan', "{{ JSON.stringify($json.id ? { success: true, title: $json.title, data: $json.data, updated: $json.updated } : { success: false, reason: 'not_found' }) }}");

// ================================================================ public gallery (published plans)
const galleryHook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: { name: 'Gallery', parameters: { httpMethod: 'POST', path: 'oxira-design-gallery', responseMode: 'responseNode', options: { allowedOrigins: ORIGINS } } },
  output: [{ headers: {}, body: {} }]
});
const galleryRows = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Published plans',
    parameters: { resource: 'row', operation: 'get', dataTableId: projectsTable, matchType: 'allConditions', filters: { conditions: [{ keyName: 'public', condition: 'eq', keyValue: expr('{{ true }}') }] }, returnAll: false, limit: 60, orderBy: true, orderByColumn: 'updatedAt', orderByDirection: 'DESC' },
    alwaysOutputData: true
  },
  output: [{ id: 1, title: 'Villa', data: '{}', share_id: 's1', public: true, updated: '2026-10-10' }]
});
const galleryList = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Gallery list',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `// Newest published plans; no owner details leave the server.
const items = $input.all().map((i) => i.json).filter((r) => r && r.id && r.public === true && r.share_id)
  .slice(0, 36).map((r) => ({ title: String(r.title || '').slice(0, 80), share: r.share_id, data: r.data, updated: r.updated, lang: r.lang || '' }));
return [{ json: { success: true, items } }];`
    }
  },
  output: [{ success: true, items: [] }]
});
const replyGallery = respond('Reply gallery', '{{ JSON.stringify($json) }}');

// ================================================================ public designer directory
const designersHook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: { name: 'Designer directory', parameters: { httpMethod: 'POST', path: 'oxira-design-designers', responseMode: 'responseNode', options: { allowedOrigins: ORIGINS } } },
  output: [{ headers: {}, body: {} }]
});
const activeDesigners = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Active designers',
    parameters: { resource: 'row', operation: 'get', dataTableId: designersTable, matchType: 'allConditions', filters: { conditions: [{ keyName: 'status', condition: 'eq', keyValue: 'active' }] }, returnAll: true },
    alwaysOutputData: true, executeOnce: true
  },
  output: [{ id: 1, email: 'designer@example.com', name: 'Sara', skills: 'Interior design, 3ds Max', countries: 'SA, AE', status: 'active' }]
});
const ratedOrders = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Rated orders',
    parameters: { resource: 'row', operation: 'get', dataTableId: ordersTable, matchType: 'allConditions', filters: { conditions: [{ keyName: 'rating', condition: 'gt', keyValue: '0' }] }, returnAll: true },
    alwaysOutputData: true, executeOnce: true
  },
  output: [{ id: 7, designer: 'designer@example.com', rating: 5, review: 'Great' }]
});
const directory = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Directory',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `// Public profile: name, skills, countries, rating, delivered reviews. Never the email.
const lc = (v) => String(v || '').trim().toLowerCase();
const des = $('Active designers').all().map((i) => i.json).filter((d) => d && d.id && d.status === 'active');
const orders = $('Rated orders').all().map((i) => i.json).filter((o) => o && o.id && Number(o.rating) > 0);
const items = des.map((d) => {
  const mine = orders.filter((o) => lc(o.designer) === lc(d.email));
  const n = mine.length;
  const avg = n ? Math.round((mine.reduce((s, o) => s + Number(o.rating), 0) / n) * 10) / 10 : 0;
  return { id: d.id, name: String(d.name || '').slice(0, 60), skills: String(d.skills || '').slice(0, 300), countries: String(d.countries || '').slice(0, 120), rating: avg, reviews: n,
    quotes: mine.filter((o) => o.review).slice(-3).map((o) => String(o.review).slice(0, 240)) };
}).filter((d) => d.name).sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
return [{ json: { success: true, items } }];`
    }
  },
  output: [{ success: true, items: [] }]
});
const replyDirectory = respond('Reply directory', '{{ JSON.stringify($json) }}');

// ================================================================ Pro waitlist
const waitHook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: { name: 'Pro waitlist', parameters: { httpMethod: 'POST', path: 'oxira-design-waitlist', responseMode: 'responseNode', options: { allowedOrigins: ORIGINS } } },
  output: [{ headers: {}, body: { email: 'pro@example.com', plan: 'pro', role: 'architect', lang: 'en', country: 'AE' } }]
});
const waitFields = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Waitlist fields',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `let b = $input.first().json.body;
if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
b = b || {};
const clip = (v, n) => String(v == null ? '' : v).replace(/[<>]/g, '').trim().slice(0, n);
const email = clip(b.email, 160).toLowerCase();
const ok = /^[^\\s@<>"'(),;:\\\\]{1,64}@[a-z0-9.-]{1,120}\\.[a-z]{2,24}$/i.test(email) && !b.company_website;
return [{ json: { ok, email, plan: clip(b.plan, 20) || 'pro', role: clip(b.role, 40), lang: clip(b.lang, 5), country: clip(b.country, 2).toUpperCase() } }];`
    }
  },
  output: [{ ok: true, email: 'pro@example.com', plan: 'pro', role: 'architect', lang: 'en', country: 'AE' }]
});
const waitOk = ifElse({ version: 2.2, config: { name: 'Valid email?', parameters: cond('{{ $json.ok }}') } });
const saveWait = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Save waitlist',
    parameters: {
      resource: 'row', operation: 'upsert', dataTableId: waitlistTable, matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'email', condition: 'eq', keyValue: expr('{{ $json.email }}') }] },
      columns: { mappingMode: 'defineBelow', value: { email: expr('{{ $json.email }}'), plan: expr('{{ $json.plan }}'), role: expr('{{ $json.role }}'), lang: expr('{{ $json.lang }}'), country: expr('{{ $json.country }}') }, schema: [col('email'), col('plan'), col('role'), col('lang'), col('country')] },
      options: {}
    }
  },
  output: [{ id: 1 }]
});
const tellTeamWait = node({
  type: 'n8n-nodes-base.emailSend',
  version: 2.1,
  config: {
    name: 'Tell the team (Pro)',
    parameters: { fromEmail: 'Oxira Design <info@oxira.sa>', toEmail: 'info@oxira.sa', subject: expr("{{ 'Pro waitlist: ' + $('Waitlist fields').first().json.email }}"), html: expr("{{ 'New Pro waitlist sign-up: ' + $('Waitlist fields').first().json.email + ' · ' + $('Waitlist fields').first().json.role + ' · ' + $('Waitlist fields').first().json.country + ' · ' + $('Waitlist fields').first().json.lang }}"), options: { appendAttribution: false } },
    credentials: smtp,
    onError: 'continueRegularOutput'
  },
  output: [{ success: true }]
});
const replyWait = respond('Reply waitlist', '{{ JSON.stringify({ success: true }) }}');
const replyWaitBad = respond('Reply waitlist (invalid)', "{{ JSON.stringify({ success: false, reason: 'email' }) }}");

const note = sticky('## Oxira Design — Accounts\n- `oxira-design-login` emails a sign-in link (tokens in **oxira_portal_tokens**, shared with the oxira.sa portal; role `design`)\n- `oxira-design-account` {k, action, data}: load, project, save, delete (plans in **oxira_design_projects**), comment (thread per order in **oxira_design_comments**, email to the other side), rate, apply (designer application), claim (designers)\n- Designers: **oxira_design_designers**, status `pending` → set `active` (or `admin`) by hand to approve\n- `oxira-design-deliver` multipart: the designer of the order sends files; the client gets them by email (bcc info@), order marked تم التسليم\n- `oxira-design-share` {s}: read-only shared plan\n- `oxira-design-gallery`: published plans (action publish; column public)\n- `oxira-design-designers`: public designer directory (no emails)\n- `oxira-design-waitlist`: Pro waitlist (**oxira_design_waitlist**)', [loginHook, accHook], { color: 4 });

export default workflow('oxira-design-accounts', 'Oxira Design — Accounts')
  .add(loginHook)
  .to(loginFields)
  .to(recentTokens)
  .to(makeLink)
  .to(sendLink
    .onTrue(saveToken.to(emailLink).to(replyLogin))
    .onFalse(replyLoginSkipped))
  .add(accHook)
  .to(findSession)
  .to(checkSession)
  .to(signedIn
    .onTrue(myProjects.to(myOrders).to(designerRow).to(recentOrders).to(claimedOrders).to(clientComments).to(designerComments).to(account).to(route
      .onCase(0, saveProject.to(replySaved))
      .onCase(1, deleteProject.to(replyOk))
      .onCase(2, saveComment.to(notifyComment).to(replyComment))
      .onCase(3, claimOrder.to(tellTeamClaim).to(replyClaim))
      .onCase(4, rateOrder.to(replyRated))
      .onCase(5, applyDesigner.to(tellTeamApply).to(replyApplied))
      .onCase(6, publishProject.to(tellTeamPublish).to(replyPublished))
      .onCase(7, replyView)))
    .onFalse(replySignedOut))
  .add(deliverHook)
  .to(deliverSession)
  .to(deliverDesigner)
  .to(deliverOrder)
  .to(checkDeliver)
  .to(deliverOk
    .onTrue(emailFiles.to(markDelivered).to(logDelivery).to(replyDelivered))
    .onFalse(replyDenied))
  .add(shareHook)
  .to(getShared)
  .to(replyShared)
  .add(galleryHook)
  .to(galleryRows)
  .to(galleryList)
  .to(replyGallery)
  .add(designersHook)
  .to(activeDesigners)
  .to(ratedOrders)
  .to(directory)
  .to(replyDirectory)
  .add(waitHook)
  .to(waitFields)
  .to(waitOk
    .onTrue(saveWait.to(tellTeamWait).to(replyWait))
    .onFalse(replyWaitBad))
  .add(note);
