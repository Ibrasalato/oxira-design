import { workflow, node, trigger, sticky, ifElse, switchCase, expr } from '@n8n/workflow-sdk';

// "Oxira Design — Growth": scheduled follow-ups for design.oxira.sa.
// Daily 10:00 Riyadh: saved-plan follow-up (2–14 days old, no order yet), rating request 3 days after
// delivery, new unassigned orders announced to active designers. Each is sent once (flags in the tables).
// Weekly Sunday 09:00 Riyadh: numbers report + "plan of the week" social captions written by Claude, to info@.
// GET /oxira-design-optout?e=&t= stops follow-up emails for that address.

const dailyTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.2,
  config: { name: 'Every day 10:00', parameters: { rule: { interval: [{ field: 'cronExpression', expression: '0 7 * * *' }] } } }
});

const dProjects = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: { name: 'Projects', parameters: { resource: 'row', operation: 'get', dataTableId: { __rl: true, mode: 'id', value: 'X6k7SyQQoGAmf0rv', cachedResultName: 'oxira_design_projects' }, returnAll: true }, alwaysOutputData: true, executeOnce: true },
  output: [{ id: 1, pid: 'p1', owner: 'client@example.com', title: 'Villa', share_id: 's1', updated: '2026-10-07T10:00:00.000+03:00', lang: 'en', nudged: null }]
});
const dOrders = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: { name: 'Orders', parameters: { resource: 'row', operation: 'get', dataTableId: { __rl: true, mode: 'id', value: '8aPzt7Ki9h8b4uDp', cachedResultName: 'oxira_design_orders' }, returnAll: true }, alwaysOutputData: true, executeOnce: true },
  output: [{ id: 7, email: 'client@example.com', status: 'جديد', designer: null, delivered_at: null, rating: null, review_asked: null, notified_designers: null, lang: 'ar', package: 'plan', area: 400, city: 'Riyadh', createdAt: '2026-10-09T10:00:00.000Z' }]
});
const dDesigners = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: { name: 'Designers', parameters: { resource: 'row', operation: 'get', dataTableId: { __rl: true, mode: 'id', value: 'f0btqmWoVKQTrIcx', cachedResultName: 'oxira_design_designers' }, returnAll: true }, alwaysOutputData: true, executeOnce: true },
  output: [{ id: 1, email: 'designer@example.com', status: 'active' }]
});
const dOptout = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: { name: 'Opt-outs', parameters: { resource: 'row', operation: 'get', dataTableId: { __rl: true, mode: 'id', value: 'z8AgUqsAs8NMMBHL', cachedResultName: 'oxira_design_optout' }, returnAll: true }, alwaysOutputData: true, executeOnce: true },
  output: [{ id: 1, email: 'someone@example.com' }]
});

const planDay = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Emails for today',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `// One item per email to send today, with what to mark afterwards.
const rows = (n) => $(n).all().map((i) => i.json).filter((r) => r && r.id);
const lc = (v) => String(v || '').trim().toLowerCase();
const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const now = Date.now(), DAY = 86400000;
const age = (t) => (now - new Date(t).getTime()) / DAY;
const off = new Set(rows('Opt-outs').map((r) => lc(r.email)));
const orders = rows('Orders');
const ordered = new Set(orders.map((o) => lc(o.email)));
const SITE = 'https://design.oxira.sa';
const sig = (e) => { let h = 2166136261; const s = 'oxira-optout:' + e; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return (h >>> 0).toString(36); };
const stop = (e, ar) => '<p style="color:#8796A5;font-size:12px;margin-top:22px">' + (ar ? 'لا تريد هذه الرسائل؟ ' : 'Don\\'t want these emails? ') + '<a style="color:#8796A5" href="https://api.oxira.sa/oxira-design-optout?e=' + encodeURIComponent(e) + '&t=' + sig(e) + '">' + (ar ? 'إيقاف الرسائل' : 'Unsubscribe') + '</a></p>';
const wrap = (ar, body) => '<div dir="' + (ar ? 'rtl' : 'ltr') + '" style="font-family:Tahoma,Arial,sans-serif;font-size:15px;line-height:1.8;color:#0A253E;max-width:560px"><p style="font-size:20px;font-weight:bold;margin:0 0 8px">Oxira <span style="color:#fff;background:#007DB4;padding:1px 6px;font-size:14px">Design</span></p>' + body + '</div>';
const btn = (href, t) => '<p><a href="' + href + '" style="display:inline-block;background:#F5A800;color:#0A253E;font-weight:700;padding:11px 20px;border-radius:10px;text-decoration:none">' + t + '</a></p>';
const out = [];

// 1. saved a plan 2–14 days ago, never ordered: one follow-up per owner
const seenOwner = new Set();
for (const p of rows('Projects').sort((a, b) => String(b.updated).localeCompare(String(a.updated)))) {
  const e = lc(p.owner);
  if (!e || p.nudged === true || off.has(e) || ordered.has(e) || seenOwner.has(e)) continue;
  const a = age(p.updated);
  if (!(a >= 2 && a <= 14)) continue;
  seenOwner.add(e);
  const ar = (p.lang || 'ar') === 'ar';
  const pre = ar ? '' : '/' + (p.lang || 'en');
  const body = ar
    ? '<h2 style="margin:0 0 8px">مخططك «' + esc(p.title) + '» محفوظ</h2><p>إذا عجبك المخطط، فريقنا يقدر يحوّله لمخططات معتمدة وواجهات ورندرات واقعية، ويراجعه مهندس حسب اشتراطات بلديتك. نرسل لك عرض السعر خلال يوم عمل.</p>' + btn(SITE + '/plan/?p=' + p.pid + '#pl-order', 'اطلب عرض سعر لمخططك') + '<p>أو كمّل التعديل عليه: <a href="' + SITE + '/plan/?p=' + p.pid + '">افتح المخطط</a></p>'
    : '<h2 style="margin:0 0 8px">Your plan “' + esc(p.title) + '” is saved</h2><p>If you like it, our team can turn it into approved drawings, facades and photoreal renders, reviewed by an engineer for your local rules. We send a quote within one working day.</p>' + btn(SITE + pre + '/plan/?p=' + p.pid + '#pl-order', 'Get a quote for your plan') + '<p>Or keep editing: <a href="' + SITE + pre + '/plan/?p=' + p.pid + '">open the plan</a></p>';
  out.push({ json: { kind: 'nudge', ref: p.pid, to: e, bcc: '', subject: ar ? 'مخططك جاهز للخطوة الجاية | Oxira Design' : 'Your plan is ready for the next step | Oxira Design', html: wrap(ar, body + stop(e, ar)) } });
}

// 2. delivered 3–30 days ago and not rated: ask once
for (const o of orders) {
  const e = lc(o.email);
  if (!e || !o.delivered_at || Number(o.rating) > 0 || o.review_asked === true || off.has(e)) continue;
  const a = age(String(o.delivered_at).replace(' ', 'T') + '+03:00');
  if (!(a >= 3 && a <= 30)) continue;
  const ar = (o.lang || 'ar') === 'ar';
  const pre = ar ? '' : '/' + (o.lang || 'en');
  const body = ar
    ? '<h2 style="margin:0 0 8px">كيف كان تصميمك؟</h2><p>سلّمنا طلبك #' + o.id + ' قبل أيام. تقييمك يساعد العملاء الجدد يختارون، ويساعد المصمم. يأخذ دقيقة.</p>' + btn(SITE + '/account/?tab=orders', 'قيّم الطلب')
    : '<h2 style="margin:0 0 8px">How was your design?</h2><p>We delivered order #' + o.id + ' a few days ago. Your rating helps new clients choose and helps your designer. It takes a minute.</p>' + btn(SITE + pre + '/account/?tab=orders', 'Rate your order');
  out.push({ json: { kind: 'review', ref: o.id, to: e, bcc: '', subject: ar ? 'قيّم طلبك #' + o.id + ' | Oxira Design' : 'Rate your order #' + o.id + ' | Oxira Design', html: wrap(ar, body + stop(e, ar)) } });
}

// 3. new orders without a designer (last 3 days): tell active designers once
const designers = rows('Designers').filter((d) => d.status === 'active').map((d) => lc(d.email)).filter(Boolean);
if (designers.length) {
  for (const o of orders) {
    if (o.designer || o.notified_designers === true || !['جديد', 'مدفوع'].includes(o.status) || age(o.createdAt) > 3) continue;
    const body = '<h2 style="margin:0 0 8px">طلب جديد #' + o.id + ' · New order #' + o.id + '</h2><p>' + esc(o.package) + ' · ' + esc(o.city || '') + (o.area ? ' · ' + o.area + ' m²' : '') + ' · ' + esc(o.lang || 'ar') + '</p><p>أول مصمم يستلمه من البوابة يكون له. The first designer to take it in the portal gets it.</p>' + btn(SITE + '/account/?tab=designer', 'افتح البوابة · Open the portal');
    out.push({ json: { kind: 'alert', ref: o.id, to: 'info@oxira.sa', bcc: designers.join(','), subject: 'طلب جديد متاح #' + o.id + ' | New order available | Oxira Design', html: wrap(true, body) } });
  }
}
return out;`
    }
  },
  output: [{ kind: 'nudge', ref: 'p1', to: 'client@example.com', bcc: '', subject: 'x', html: '<p>x</p>' }]
});

const sendDaily = node({
  type: 'n8n-nodes-base.emailSend',
  version: 2.1,
  config: {
    name: 'Send email',
    parameters: { fromEmail: 'Oxira Design <info@oxira.sa>', toEmail: expr('{{ $json.to }}'), subject: expr('{{ $json.subject }}'), html: expr('{{ $json.html }}'), options: { appendAttribution: false, bccEmail: expr('{{ $json.bcc }}') } },
    credentials: { smtp: { id: 'Jd9L9EGYmDKHV0KB', name: 'SMTP account' } },
    onError: 'continueRegularOutput'
  },
  output: [{ success: true }]
});

const whatSent = switchCase({
  version: 3.2,
  config: {
    name: 'Mark as sent',
    parameters: {
      rules: { values: [
        { outputKey: 'nudge', renameOutput: true, conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' }, conditions: [{ leftValue: expr("{{ $('Emails for today').item.json.kind }}"), operator: { type: 'string', operation: 'equals' }, rightValue: 'nudge' }], combinator: 'and' } },
        { outputKey: 'review', renameOutput: true, conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' }, conditions: [{ leftValue: expr("{{ $('Emails for today').item.json.kind }}"), operator: { type: 'string', operation: 'equals' }, rightValue: 'review' }], combinator: 'and' } },
        { outputKey: 'alert', renameOutput: true, conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' }, conditions: [{ leftValue: expr("{{ $('Emails for today').item.json.kind }}"), operator: { type: 'string', operation: 'equals' }, rightValue: 'alert' }], combinator: 'and' } }
      ] },
      options: {}
    }
  }
});

const markNudged = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Mark plan followed up',
    parameters: {
      resource: 'row', operation: 'update', dataTableId: { __rl: true, mode: 'id', value: 'X6k7SyQQoGAmf0rv', cachedResultName: 'oxira_design_projects' }, matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'owner', condition: 'eq', keyValue: expr("{{ $('Emails for today').item.json.to }}") }] },
      columns: { mappingMode: 'defineBelow', value: { nudged: true }, schema: [{ id: 'nudged', displayName: 'nudged', required: false, defaultMatch: false, display: true, type: 'boolean', canBeUsedToMatch: true }] },
      options: {}
    }
  },
  output: [{ id: 1 }]
});
const markAsked = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Mark rating asked',
    parameters: {
      resource: 'row', operation: 'update', dataTableId: { __rl: true, mode: 'id', value: '8aPzt7Ki9h8b4uDp', cachedResultName: 'oxira_design_orders' }, matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'id', condition: 'eq', keyValue: expr("{{ $('Emails for today').item.json.ref }}") }] },
      columns: { mappingMode: 'defineBelow', value: { review_asked: true }, schema: [{ id: 'review_asked', displayName: 'review_asked', required: false, defaultMatch: false, display: true, type: 'boolean', canBeUsedToMatch: true }] },
      options: {}
    }
  },
  output: [{ id: 7 }]
});
const markAlerted = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Mark designers told',
    parameters: {
      resource: 'row', operation: 'update', dataTableId: { __rl: true, mode: 'id', value: '8aPzt7Ki9h8b4uDp', cachedResultName: 'oxira_design_orders' }, matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'id', condition: 'eq', keyValue: expr("{{ $('Emails for today').item.json.ref }}") }] },
      columns: { mappingMode: 'defineBelow', value: { notified_designers: true }, schema: [{ id: 'notified_designers', displayName: 'notified_designers', required: false, defaultMatch: false, display: true, type: 'boolean', canBeUsedToMatch: true }] },
      options: {}
    }
  },
  output: [{ id: 7 }]
});

// ---------------------------------------------------------------- weekly report + social pack
const weeklyTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.2,
  config: { name: 'Sunday 09:00', parameters: { rule: { interval: [{ field: 'cronExpression', expression: '0 6 * * 0' }] } } }
});
const wProjects = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: { name: 'All projects', parameters: { resource: 'row', operation: 'get', dataTableId: { __rl: true, mode: 'id', value: 'X6k7SyQQoGAmf0rv', cachedResultName: 'oxira_design_projects' }, returnAll: true }, alwaysOutputData: true, executeOnce: true },
  output: [{ id: 1, createdAt: '2026-10-09T10:00:00.000Z', public: true }]
});
const wOrders = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: { name: 'All orders', parameters: { resource: 'row', operation: 'get', dataTableId: { __rl: true, mode: 'id', value: '8aPzt7Ki9h8b4uDp', cachedResultName: 'oxira_design_orders' }, returnAll: true }, alwaysOutputData: true, executeOnce: true },
  output: [{ id: 7, createdAt: '2026-10-09T10:00:00.000Z', status: 'جديد', package: 'plan', rating: 5 }]
});
const wDesigners = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: { name: 'All designers', parameters: { resource: 'row', operation: 'get', dataTableId: { __rl: true, mode: 'id', value: 'f0btqmWoVKQTrIcx', cachedResultName: 'oxira_design_designers' }, returnAll: true }, alwaysOutputData: true, executeOnce: true },
  output: [{ id: 1, status: 'pending', createdAt: '2026-10-09T10:00:00.000Z' }]
});
const wWaitlist = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: { name: 'Waitlist', parameters: { resource: 'row', operation: 'get', dataTableId: { __rl: true, mode: 'id', value: 'I6RXiokIRkjBrDJd', cachedResultName: 'oxira_design_waitlist' }, returnAll: true }, alwaysOutputData: true, executeOnce: true },
  output: [{ id: 1, email: 'pro@example.com', createdAt: '2026-10-09T10:00:00.000Z' }]
});

const weekNumbers = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Week in numbers',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `// Last 7 days vs all time, plus this week's featured plan and the Claude request for captions.
const rows = (n) => $(n).all().map((i) => i.json).filter((r) => r && r.id);
const week = (r) => Date.now() - new Date(r.createdAt).getTime() < 7 * 86400000;
const P = rows('All projects'), O = rows('All orders'), D = rows('All designers'), W = rows('Waitlist');
const rated = O.filter((o) => Number(o.rating) > 0);
const n = {
  plansWeek: P.filter(week).length, plansAll: P.length, published: P.filter((p) => p.public === true).length,
  ordersWeek: O.filter(week).length, ordersAll: O.length,
  deliveredWeek: O.filter((o) => o.delivered_at && Date.now() - new Date(String(o.delivered_at).replace(' ', 'T') + '+03:00').getTime() < 7 * 86400000).length,
  open: O.filter((o) => !o.designer && ['جديد', 'مدفوع'].includes(o.status)).length,
  rating: rated.length ? Math.round(rated.reduce((s, o) => s + Number(o.rating), 0) / rated.length * 10) / 10 : 0, ratings: rated.length,
  designersActive: D.filter((d) => d.status === 'active').length, designersPending: D.filter((d) => d.status === 'pending').length,
  waitWeek: W.filter(week).length, waitAll: W.length,
};
const PLANS = ['villa-20x30-4-bedrooms', 'villa-20x25-5-bedrooms', 'villa-15x30-4-bedrooms', 'house-15x30-3-bedrooms', 'villa-25x30-5-bedrooms', 'apartment-building-20x30-2-bedroom-units', 'villa-30x30-6-bedrooms', 'house-25x25-3-bedrooms', 'villa-20x20-4-bedrooms', 'apartment-building-25x35-3-bedroom-units', 'villa-15x25-4-bedrooms', 'house-30x30-4-bedrooms'];
const wk = Math.floor(Date.now() / (7 * 86400000));
const slug = PLANS[wk % PLANS.length];
const m = slug.match(/^(.+?)-(\\d+)x(\\d+)-(\\d)/);
const desc = m ? (m[1] === 'apartment-building' ? 'apartment building' : m[1] === 'house' ? 'single-storey house' : 'two-storey villa') + ' on a ' + m[2] + ' x ' + m[3] + ' m plot, ' + m[4] + (m[1] === 'apartment-building' ? '-bedroom apartments' : ' bedrooms') : slug;
const request = { model: 'claude-sonnet-5', max_tokens: 6000, system: 'You write social media posts for Oxira Design (design.oxira.sa), a free online tool that generates editable floor plans from a plot size, with 3D, DXF and IFC export, made in Saudi Arabia for the Gulf and the world. Reply with ONE JSON object only: {"instagram_ar": "...", "instagram_en": "...", "pinterest_title_en": "...", "pinterest_desc_en": "...", "tiktok_hook_ar": "...", "x_en": "..."}. Instagram posts: 3-5 short lines, a question to the audience, 5-8 relevant hashtags. Arabic in Gulf dialect. Pinterest title under 100 characters with the plot size. TikTok hook: one spoken sentence for the first 2 seconds of a screen recording. X post under 260 characters. Mention the link once in each.', messages: [{ role: 'user', content: 'Plan of the week: ' + desc + '. Link: https://design.oxira.sa/en/plans/' + slug + '/ (Arabic page: https://design.oxira.sa/plans/' + slug + '/).' }] };
return [{ json: { n, slug, desc, request } }];`
    }
  },
  output: [{ n: { plansWeek: 1 }, slug: 'villa-20x30-4-bedrooms', desc: 'two-storey villa', request: { model: 'claude-sonnet-5' } }]
});

const askClaude = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.5,
  config: {
    name: 'Write captions',
    parameters: {
      method: 'POST', url: 'https://api.anthropic.com/v1/messages', authentication: 'predefinedCredentialType', nodeCredentialType: 'anthropicApi',
      sendHeaders: true, headerParameters: { parameters: [{ name: 'anthropic-version', value: '2023-06-01' }] },
      sendBody: true, contentType: 'json', specifyBody: 'json', jsonBody: expr('{{ JSON.stringify($json.request) }}'),
      options: { timeout: 120000, response: { response: { neverError: true } } }
    },
    credentials: { anthropicApi: { id: 'CnVH74DIvAt5ikNI', name: 'Anthropic oxira' } }
  },
  output: [{ content: [{ type: 'text', text: '{"instagram_ar":"..."}' }] }]
});

const buildReport = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Weekly email',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const w = $('Week in numbers').first().json;
const n = w.n;
const res = $input.first().json || {};
const text = Array.isArray(res.content) ? res.content.filter((c) => c.type === 'text').map((c) => c.text).join('') : '';
let cap = {};
try { cap = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)); } catch (e) { cap = {}; }
const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\n/g, '<br>');
const row = (k, v) => '<tr><td style="padding:6px 10px;border-bottom:1px solid #E3E8EE">' + k + '</td><td style="padding:6px 10px;border-bottom:1px solid #E3E8EE;font-weight:700">' + v + '</td></tr>';
const block = (t, v) => v ? '<h3 style="margin:18px 0 6px">' + t + '</h3><div style="background:#F5F7F9;border-radius:10px;padding:10px 12px;white-space:normal">' + esc(v) + '</div>' : '';
const html = '<div style="font-family:Tahoma,Arial,sans-serif;font-size:14px;line-height:1.7;color:#0A253E;max-width:640px"><h2 style="margin:0 0 10px">Oxira Design · الأسبوع بالأرقام</h2><table style="border-collapse:collapse;width:100%">'
  + row('مخططات محفوظة هذا الأسبوع / الكل', n.plansWeek + ' / ' + n.plansAll)
  + row('منشورة في المعرض', n.published)
  + row('طلبات هذا الأسبوع / الكل', n.ordersWeek + ' / ' + n.ordersAll)
  + row('تم تسليمها هذا الأسبوع', n.deliveredWeek)
  + row('طلبات بدون مصمم', n.open)
  + row('متوسط التقييم', n.ratings ? n.rating + ' (' + n.ratings + ')' : '-')
  + row('مصممون نشطون / بانتظار الموافقة', n.designersActive + ' / ' + n.designersPending)
  + row('قائمة انتظار Pro هذا الأسبوع / الكل', n.waitWeek + ' / ' + n.waitAll)
  + '</table><h2 style="margin:24px 0 6px">مخطط الأسبوع للسوشيال</h2><p>' + esc(w.desc) + '<br><a href="https://design.oxira.sa/plans/' + w.slug + '/">design.oxira.sa/plans/' + w.slug + '/</a></p>'
  + block('Instagram (عربي)', cap.instagram_ar) + block('Instagram (English)', cap.instagram_en) + block('Pinterest', (cap.pinterest_title_en || '') + (cap.pinterest_desc_en ? '\\n' + cap.pinterest_desc_en : ''))
  + block('TikTok · أول ثانيتين', cap.tiktok_hook_ar) + block('X', cap.x_en)
  + '<p style="color:#556779;font-size:12px;margin-top:18px">صوّر الشاشة وأنت تفتح المخطط وتحرّك جدار وتشوفه 3D، 15 ثانية تكفي. هذا التقرير يوصلك كل أحد من n8n (Oxira Design — Growth).</p></div>';
return [{ json: { subject: 'Oxira Design · الأسبوع بالأرقام + مخطط الأسبوع', html } }];`
    }
  },
  output: [{ subject: 'x', html: '<p>x</p>' }]
});

const sendWeekly = node({
  type: 'n8n-nodes-base.emailSend',
  version: 2.1,
  config: {
    name: 'Send weekly report',
    parameters: { fromEmail: 'Oxira Design <info@oxira.sa>', toEmail: 'info@oxira.sa', subject: expr('{{ $json.subject }}'), html: expr('{{ $json.html }}'), options: { appendAttribution: false } },
    credentials: { smtp: { id: 'Jd9L9EGYmDKHV0KB', name: 'SMTP account' } }
  },
  output: [{ success: true }]
});

// ---------------------------------------------------------------- unsubscribe
const optoutHook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: { name: 'Unsubscribe', parameters: { httpMethod: 'GET', path: 'oxira-design-optout', responseMode: 'responseNode', options: {} } },
  output: [{ query: { e: 'client@example.com', t: 'abc' } }]
});
const checkOptout = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Check link',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const q = $input.first().json.query || {};
const e = String(q.e || '').trim().toLowerCase().slice(0, 160);
const sig = (x) => { let h = 2166136261; const s = 'oxira-optout:' + x; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return (h >>> 0).toString(36); };
return [{ json: { ok: !!e && String(q.t || '') === sig(e), email: e } }];`
    }
  },
  output: [{ ok: true, email: 'client@example.com' }]
});
const optoutOk = ifElse({ version: 2.2, config: { name: 'Valid link?', parameters: { conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' }, conditions: [{ leftValue: expr('{{ $json.ok }}'), operator: { type: 'boolean', operation: 'true', singleValue: true } }], combinator: 'and' } } } });
const saveOptout = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Save opt-out',
    parameters: {
      resource: 'row', operation: 'upsert', dataTableId: { __rl: true, mode: 'id', value: 'z8AgUqsAs8NMMBHL', cachedResultName: 'oxira_design_optout' }, matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'email', condition: 'eq', keyValue: expr('{{ $json.email }}') }] },
      columns: { mappingMode: 'defineBelow', value: { email: expr('{{ $json.email }}'), reason: 'link' }, schema: [{ id: 'email', displayName: 'email', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }, { id: 'reason', displayName: 'reason', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true }] },
      options: {}
    }
  },
  output: [{ id: 1 }]
});
const replyOptout = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: { name: 'Reply unsubscribed', parameters: { respondWith: 'text', responseBody: '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Oxira Design</title></head><body style="font-family:Tahoma,Arial,sans-serif;color:#0A253E;max-width:520px;margin:15vh auto;padding:0 20px;text-align:center"><h2>تم إيقاف الرسائل · You are unsubscribed</h2><p>لن تصلك رسائل المتابعة من Oxira Design. ستصلك فقط رسائل طلباتك.<br>You will not get follow-up emails from Oxira Design, only emails about your orders.</p><p><a href="https://design.oxira.sa/">design.oxira.sa</a></p></body></html>', options: { responseCode: 200, responseHeaders: { entries: [{ name: 'Content-Type', value: 'text/html; charset=utf-8' }] } } } }
});
const replyBadLink = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: { name: 'Reply bad link', parameters: { respondWith: 'text', responseBody: 'Invalid link. Email info@oxira.sa to unsubscribe.', options: { responseCode: 400 } } }
});

const note = sticky('## Oxira Design — Growth\n- Daily 10:00 Riyadh: follow-up for saved plans without an order (column `nudged`), rating request after delivery (`review_asked`), new unassigned orders emailed (bcc) to active designers (`notified_designers`)\n- Sunday 09:00: numbers + plan-of-the-week captions (Claude) to info@\n- `GET oxira-design-optout?e=&t=` → **oxira_design_optout**', [dailyTrigger, weeklyTrigger], { color: 4 });

export default workflow('oxira-design-growth', 'Oxira Design — Growth')
  .add(dailyTrigger)
  .to(dProjects)
  .to(dOrders)
  .to(dDesigners)
  .to(dOptout)
  .to(planDay)
  .to(sendDaily)
  .to(whatSent
    .onCase(0, markNudged)
    .onCase(1, markAsked)
    .onCase(2, markAlerted))
  .add(weeklyTrigger)
  .to(wProjects)
  .to(wOrders)
  .to(wDesigners)
  .to(wWaitlist)
  .to(weekNumbers)
  .to(askClaude)
  .to(buildReport)
  .to(sendWeekly)
  .add(optoutHook)
  .to(checkOptout)
  .to(optoutOk
    .onTrue(saveOptout.to(replyOptout))
    .onFalse(replyBadLink))
  .add(note);
