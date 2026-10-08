import { workflow, node, trigger, sticky, ifElse, switchCase, expr } from '@n8n/workflow-sdk';

// "Redesign my room": a visitor uploads a photo of a real room and gets it redesigned in a chosen style.
// One free render per visitor per day, then paid render packs (Moyasar) stored in a wallet.

const ORIGINS = 'https://design.oxira.sa,https://ibrasalato.github.io,http://localhost:4321';
const walletsTable = { __rl: true, mode: 'id', value: '01dw4c4cwoLBnVOI', cachedResultName: 'oxira_design_wallets' };
const purchasesTable = { __rl: true, mode: 'id', value: 'ghChv1ByONwGPXpc', cachedResultName: 'oxira_design_purchases' };
const rendersTable = { __rl: true, mode: 'id', value: 'Gws7LMwCihJk9UiZ', cachedResultName: 'oxira_design_renders' };
const smtp = { smtp: { id: 'Jd9L9EGYmDKHV0KB', name: 'SMTP account' } };
const moyasar = { httpBasicAuth: { id: 'CjK6licQa4dDZuNM', name: 'moyasar live' } };
const openai = { openAiApi: { id: 'u4tha4yxIAlqw6hy', name: 'OpenAI oxira' } };

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

// ---------------------------------------------------------------- render
const renderHook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Room render',
    parameters: { httpMethod: 'POST', path: 'oxira-redesign-render', responseMode: 'responseNode', options: { allowedOrigins: ORIGINS } }
  },
  output: [{ headers: {}, body: '{"sessionId":"abc123xyz","wallet":"w1234567890abcdefghij","image":"data:image/jpeg;base64,/9j/","style":"modern","room":"living","lang":"ar"}' }]
});

const checkRequest = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Check request',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `// Validates the photo, decides between a free render and a paid one, and writes the prompt.
// Free: 1 per visitor and 2 per IP address per day, 60 per day for the whole site (workflow static data).
// Cost: free renders use gpt-image-1-mini (medium, low fidelity, about $0.015).
// Paid renders use gpt-image-1 with high input fidelity so the room stays the same (about $0.09).
const FREE_PER_VISITOR = 1, FREE_PER_IP = 2, FREE_PER_DAY = 60;
const FREE_MODEL = 'gpt-image-1-mini', PAID_MODEL = 'gpt-image-1', QUALITY = 'medium';
const req = $input.first().json;
let b = req.body;
if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
b = b || {};
const h = req.headers || {};
const ip = String(h['cf-connecting-ip'] || h['x-real-ip'] || String(h['x-forwarded-for'] || '').split(',')[0] || '').trim().slice(0, 64) || 'unknown';
const sid = String(b.sessionId || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 64);
const wallet = /^[a-zA-Z0-9]{16,48}$/.test(String(b.wallet || '')) ? String(b.wallet) : '';
const m = String(b.image || '').match(/^data:image\\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/);
const lang = ['ar', 'en', 'de', 'fr', 'ru'].includes(b.lang) ? b.lang : 'ar';
const day = $now.setZone('Asia/Riyadh').toFormat('yyyy-MM-dd');
const styles = {
  modern: 'modern minimalist: warm white walls, light oak wood, grey fabric upholstery, black metal details, clean lines, hidden LED lighting',
  classic: 'classic elegant: cream walls with wall mouldings, walnut wood, marble, burgundy and gold upholstery, crystal chandelier',
  najdi: 'contemporary Najdi Saudi: earthy beige plaster walls, terracotta and stone, low Arabic majlis seating with red patterned cushions, carved dark wood, brass lanterns',
  scandi: 'Scandinavian: white walls, pale ash wood, light grey and beige textiles, plants, airy and bright',
  luxury: 'luxury: polished marble, warm grey walls, dark wood panels, emerald velvet, gold accents, designer lighting',
};
const rooms = { living: 'living room', bedroom: 'bedroom', majlis: 'majlis (Arabic guest sitting room)', kitchen: 'kitchen', bathroom: 'bathroom', dining: 'dining room', office: 'home office', kids: "children's bedroom" };
const style = styles[b.style] ? b.style : 'modern';
const room = rooms[b.room] ? b.room : 'living';
const test = $execution.mode !== 'production';
const base = { session_id: sid, wallet, style, room, lang, day, ip, quality: QUALITY };
if (!sid || sid.length < 6 || !m || m[2].length > 3000000) return [{ json: Object.assign(base, { model: FREE_MODEL, fidelity: 'low', mode: 'none', reason: 'invalid', free_left: 0 }) }];
const st = $getWorkflowStaticData('global');
if (!st.free || st.free.day !== day) st.free = { day, total: 0, by: {}, ip: {} };
const f = st.free;
const usedV = f.by[sid] || 0, usedI = f.ip[ip] || 0;
const canFree = (usedV < FREE_PER_VISITOR && usedI < FREE_PER_IP && f.total < FREE_PER_DAY) && !(test && b.forcePaid);
let mode = canFree ? 'free' : (wallet ? 'paid' : 'none');
if (mode === 'free') { f.by[sid] = usedV + 1; f.ip[ip] = usedI + 1; f.total += 1; }
const freeLeft = Math.max(0, Math.min(FREE_PER_VISITOR - (f.by[sid] || 0), FREE_PER_IP - (f.ip[ip] || 0), FREE_PER_DAY - f.total));
const prompt = 'Redesign this photo of a real ' + rooms[room] + ' as a professionally designed interior. Keep exactly the same room: the same walls, windows, doors, ceiling height, floor area, camera position and perspective. Only change finishes, furniture, lighting and decor. Style: ' + styles[style] + '. Photorealistic high-end interior photography, natural daylight, realistic materials and proportions. No people, no text, no watermark.';
let model = mode === 'paid' ? PAID_MODEL : FREE_MODEL;
if (test && b.model) model = String(b.model);
let fidelity = model === 'gpt-image-1-mini' ? 'low' : 'high';
if (test && b.fidelity) fidelity = String(b.fidelity);
Object.assign(base, { model, fidelity });
return [{ json: Object.assign(base, { mode, reason: mode === 'none' ? 'credits' : '', free_left: freeLeft, prompt }), binary: { image: { data: m[2], mimeType: 'image/' + m[1], fileName: 'room.' + (m[1] === 'jpeg' ? 'jpg' : m[1]), fileExtension: m[1] === 'jpeg' ? 'jpg' : m[1] } } }];
`
    }
  },
  output: [{ session_id: 'abc123xyz', wallet: 'w1234567890abcdefghij', style: 'modern', room: 'living', lang: 'ar', day: '2026-10-08', ip: '1.1.1.1', model: 'gpt-image-1-mini', quality: 'medium', fidelity: 'high', mode: 'free', reason: '', free_left: 0, prompt: '...' }]
});

const routeMode = switchCase({
  version: 3.2,
  config: {
    name: 'Free or paid?',
    parameters: {
      rules: {
        values: [
          { outputKey: 'free', conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' }, conditions: [{ leftValue: expr('{{ $json.mode }}'), operator: { type: 'string', operation: 'equals' }, rightValue: 'free' }], combinator: 'and' } },
          { outputKey: 'paid', conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' }, conditions: [{ leftValue: expr('{{ $json.mode }}'), operator: { type: 'string', operation: 'equals' }, rightValue: 'paid' }], combinator: 'and' } }
        ]
      },
      options: { fallbackOutput: 'extra', renameFallbackOutput: 'none' }
    }
  }
});

const getWallet = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Get wallet',
    alwaysOutputData: true,
    parameters: {
      resource: 'row',
      operation: 'get',
      dataTableId: walletsTable,
      matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'wallet_id', condition: 'eq', keyValue: expr('{{ $json.wallet }}') }] },
      limit: 1
    }
  },
  output: [{ id: 1, wallet_id: 'w1234567890abcdefghij', credits: 10, purchased: 10, used: 0, email: '' }]
});

const hasCredit = ifElse({ version: 2.2, config: { name: 'Has credit?', parameters: cond('{{ Number($json.credits || 0) > 0 }}') } });

const spendCredit = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Spend credit',
    parameters: {
      resource: 'row',
      operation: 'update',
      dataTableId: walletsTable,
      matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'id', condition: 'eq', keyValue: expr('{{ $json.id }}') }] },
      columns: {
        mappingMode: 'defineBelow',
        value: { credits: expr('{{ Number($json.credits || 0) - 1 }}'), used: expr('{{ Number($json.used || 0) + 1 }}') },
        schema: [col('credits', 'number'), col('used', 'number')]
      },
      options: {}
    }
  },
  output: [{ id: 1 }]
});

const attachImage = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Attach photo',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `// Brings the uploaded photo back (data-table steps drop binary data) and works out the credits left.
const req = $('Check request').first();
let credits = null;
if (req.json.mode === 'paid') { try { credits = Number($('Get wallet').first().json.credits || 0) - 1; } catch (e) { credits = null; } }
return [{ json: Object.assign({}, req.json, { credits_left: credits }), binary: req.binary }];
`
    }
  },
  output: [{ mode: 'free', prompt: '...', model: 'gpt-image-1-mini', quality: 'medium', fidelity: 'high', credits_left: null }]
});

const aiRender = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.5,
  config: {
    name: 'Redesign with OpenAI',
    onError: 'continueErrorOutput',
    parameters: {
      method: 'POST',
      url: 'https://api.openai.com/v1/images/edits',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'openAiApi',
      sendBody: true,
      contentType: 'multipart-form-data',
      bodyParameters: {
        parameters: [
          { parameterType: 'formBinaryData', name: 'image', inputDataFieldName: 'image' },
          { name: 'model', value: expr('{{ $json.model }}') },
          { name: 'prompt', value: expr('{{ $json.prompt }}') },
          { name: 'size', value: 'auto' },
          { name: 'quality', value: expr('{{ $json.quality }}') },
          { name: 'output_format', value: 'jpeg' },
          { name: 'output_compression', value: '82' },
          { name: 'input_fidelity', value: expr('{{ $json.fidelity }}') },
          { name: 'n', value: '1' }
        ]
      },
      options: { timeout: 180000 }
    },
    credentials: openai
  },
  output: [{ data: [{ b64_json: '/9j/' }], usage: { input_tokens: 400, output_tokens: 1500 } }]
});

const renderResult = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Render result',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `// Returns the new photo as a data URL, with what the visitor has left.
const r = $input.first().json || {};
const req = $('Attach photo').first().json;
const b64 = r.data && r.data[0] && r.data[0].b64_json;
const u = r.usage || {};
return [{ json: { ok: !!b64, image: b64 ? 'data:image/jpeg;base64,' + b64 : '', free_left: req.free_left, credits: req.credits_left, mode: req.mode, session_id: req.session_id, style: req.style, room: req.room, lang: req.lang, day: req.day, usage: { input: u.input_tokens || 0, output: u.output_tokens || 0 } } }];
`
    }
  },
  output: [{ ok: true, image: 'data:image/jpeg;base64,/9j/', free_left: 0, credits: 9, mode: 'paid', session_id: 'abc123xyz', style: 'modern', room: 'living', lang: 'ar', day: '2026-10-08' }]
});

const replyRender = respond('Reply render', '{{ JSON.stringify({ success: !!$json.ok, image: $json.image, free_left: $json.free_left, credits: $json.credits, reason: $json.ok ? undefined : "failed" }) }}');

const logRender = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Log render',
    onError: 'continueRegularOutput',
    parameters: {
      resource: 'row',
      operation: 'insert',
      dataTableId: rendersTable,
      columns: {
        mappingMode: 'defineBelow',
        value: {
          session_id: expr('{{ $json.session_id }}'),
          style: expr("{{ 'room:' + $json.style }}"),
          view: expr("{{ $json.room + ':' + $json.mode }}"),
          lang: expr('{{ $json.lang }}'),
          day: expr('{{ $json.day }}'),
          result: expr("{{ $json.ok ? 'ok' : 'failed' }}")
        },
        schema: [col('session_id'), col('style'), col('view'), col('lang'), col('day'), col('result')]
      }
    }
  },
  output: [{ id: 1 }]
});

const wasPaid = ifElse({ version: 2.2, config: { name: 'Paid render failed?', parameters: cond("{{ $('Attach photo').first().json.mode === 'paid' }}") } });

const getWalletRefund = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Get wallet for refund',
    parameters: {
      resource: 'row',
      operation: 'get',
      dataTableId: walletsTable,
      matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'wallet_id', condition: 'eq', keyValue: expr("{{ $('Attach photo').first().json.wallet }}") }] },
      limit: 1
    }
  },
  output: [{ id: 1, credits: 9, used: 1 }]
});

const refundCredit = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Give credit back',
    parameters: {
      resource: 'row',
      operation: 'update',
      dataTableId: walletsTable,
      matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'id', condition: 'eq', keyValue: expr('{{ $json.id }}') }] },
      columns: {
        mappingMode: 'defineBelow',
        value: { credits: expr('{{ Number($json.credits || 0) + 1 }}'), used: expr('{{ Math.max(0, Number($json.used || 0) - 1) }}') },
        schema: [col('credits', 'number'), col('used', 'number')]
      },
      options: {}
    }
  },
  output: [{ id: 1 }]
});

const replyFailed = respond('Reply render failed', "{{ JSON.stringify({ success: false, reason: 'failed', free_left: $('Attach photo').first().json.free_left, credits: $('Attach photo').first().json.mode === 'paid' ? $('Attach photo').first().json.credits_left + 1 : null }) }}");
const replyNoCredit = respond('Reply needs credits', "{{ JSON.stringify({ success: false, reason: $('Check request').first().json.reason || 'credits', free_left: 0, credits: 0 }) }}");

// ---------------------------------------------------------------- wallet balance
const walletHook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Wallet balance',
    parameters: { httpMethod: 'POST', path: 'oxira-redesign-wallet', responseMode: 'responseNode', options: { allowedOrigins: ORIGINS } }
  },
  output: [{ headers: {}, body: '{"wallet":"w1234567890abcdefghij","sessionId":"abc123xyz"}' }]
});

const walletRequest = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Wallet request',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `// Free renders left today for this visitor, and the wallet to look up.
const FREE_PER_VISITOR = 1, FREE_PER_IP = 2, FREE_PER_DAY = 60;
const req = $input.first().json;
let b = req.body;
if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
b = b || {};
const h = req.headers || {};
const ip = String(h['cf-connecting-ip'] || h['x-real-ip'] || String(h['x-forwarded-for'] || '').split(',')[0] || '').trim().slice(0, 64) || 'unknown';
const sid = String(b.sessionId || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 64);
const wallet = /^[a-zA-Z0-9]{16,48}$/.test(String(b.wallet || '')) ? String(b.wallet) : 'none';
const day = $now.setZone('Asia/Riyadh').toFormat('yyyy-MM-dd');
const st = $getWorkflowStaticData('global');
const f = st.free && st.free.day === day ? st.free : { total: 0, by: {}, ip: {} };
const free_left = Math.max(0, Math.min(FREE_PER_VISITOR - (f.by[sid] || 0), FREE_PER_IP - (f.ip[ip] || 0), FREE_PER_DAY - f.total));
return [{ json: { wallet, free_left } }];
`
    }
  },
  output: [{ wallet: 'w1234567890abcdefghij', free_left: 1 }]
});

const getBalance = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Get balance',
    alwaysOutputData: true,
    parameters: {
      resource: 'row',
      operation: 'get',
      dataTableId: walletsTable,
      matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'wallet_id', condition: 'eq', keyValue: expr('{{ $json.wallet }}') }] },
      limit: 1
    }
  },
  output: [{ id: 1, credits: 10 }]
});

const replyBalance = respond('Reply balance', "{{ JSON.stringify({ success: true, credits: Number($json.credits || 0), free_left: $('Wallet request').first().json.free_left }) }}");

// ---------------------------------------------------------------- buy a pack
const buyHook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Buy renders',
    parameters: { httpMethod: 'POST', path: 'oxira-redesign-buy', responseMode: 'responseNode', options: { allowedOrigins: ORIGINS } }
  },
  output: [{ body: '{"wallet":"w1234567890abcdefghij","pack":"p10","email":"a@example.com","lang":"ar","returnUrl":"https://design.oxira.sa/redesign/"}' }]
});

const pricePack = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Price pack',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `// Render packs, SAR including VAT. Keep in sync with REDESIGN_PACKS in the website repo (src/i18n/redesign.ts).
const PACKS = { p10: { renders: 10, price: 29 }, p30: { renders: 30, price: 69 }, p100: { renders: 100, price: 179 } };
const ALLOWED = ['https://design.oxira.sa/', 'https://ibrasalato.github.io/', 'http://localhost:4321/'];
let b = $input.first().json.body;
if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
b = b || {};
const wallet = /^[a-zA-Z0-9]{16,48}$/.test(String(b.wallet || '')) ? String(b.wallet) : '';
const pack = PACKS[b.pack] ? b.pack : '';
const email = /^[^\\s@]{1,64}@[^\\s@]{1,120}\\.[^\\s@]{2,20}$/.test(String(b.email || '').trim()) ? String(b.email).trim().slice(0, 160) : '';
const lang = ['ar', 'en', 'de', 'fr', 'ru'].includes(b.lang) ? b.lang : 'ar';
let ret = String(b.returnUrl || '').split('?')[0].split('#')[0].slice(0, 300);
if (!ALLOWED.some((a) => ret.startsWith(a))) ret = 'https://design.oxira.sa/redesign/';
return [{ json: { valid: !!(wallet && pack), wallet, pack, renders: pack ? PACKS[pack].renders : 0, amount: pack ? PACKS[pack].price : 0, email, lang, return_url: ret } }];
`
    }
  },
  output: [{ valid: true, wallet: 'w1234567890abcdefghij', pack: 'p10', renders: 10, amount: 29, email: 'a@example.com', lang: 'ar', return_url: 'https://design.oxira.sa/redesign/' }]
});

const validBuy = ifElse({ version: 2.2, config: { name: 'Valid pack?', parameters: cond('{{ $json.valid }}') } });

const savePurchase = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Save purchase',
    parameters: {
      resource: 'row',
      operation: 'insert',
      dataTableId: purchasesTable,
      columns: {
        mappingMode: 'defineBelow',
        value: {
          wallet_id: expr('{{ $json.wallet }}'),
          pack: expr('{{ $json.pack }}'),
          renders: expr('{{ $json.renders }}'),
          amount: expr('{{ $json.amount }}'),
          email: expr('{{ $json.email }}'),
          lang: expr('{{ $json.lang }}'),
          status: 'pending'
        },
        schema: [col('wallet_id'), col('pack'), col('renders', 'number'), col('amount', 'number'), col('email'), col('lang'), col('status')]
      }
    }
  },
  output: [{ id: 1 }]
});

const createInvoice = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.5,
  config: {
    name: 'Create Moyasar invoice',
    onError: 'continueErrorOutput',
    parameters: {
      method: 'POST',
      url: 'https://api.moyasar.com/v1/invoices',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpBasicAuth',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr("{{ JSON.stringify({ amount: Math.round($('Price pack').first().json.amount * 100), currency: 'SAR', description: 'Oxira Design - ' + $('Price pack').first().json.renders + ' AI room renders (#' + $json.id + ')', callback_url: 'https://ibrasalato.app.n8n.cloud/webhook/oxira-redesign-moyasar-callback', success_url: $('Price pack').first().json.return_url + '?bought=' + $json.id, back_url: $('Price pack').first().json.return_url + '?cancel=1', metadata: { kind: 'redesign', purchase_id: String($json.id), wallet: $('Price pack').first().json.wallet } }) }}"),
      options: { timeout: 20000 }
    },
    credentials: moyasar
  },
  output: [{ id: 'inv_123', url: 'https://checkout.moyasar.com/invoices/inv_123' }]
});

const saveInvoice = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Save invoice id',
    parameters: {
      resource: 'row',
      operation: 'update',
      dataTableId: purchasesTable,
      matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'id', condition: 'eq', keyValue: expr("{{ $('Save purchase').first().json.id }}") }] },
      columns: { mappingMode: 'defineBelow', value: { invoice_id: expr('{{ $json.id }}') }, schema: [col('invoice_id')] },
      options: {}
    }
  },
  output: [{ id: 1 }]
});

const replyPay = respond('Reply pay link', "{{ JSON.stringify({ success: true, payUrl: $('Create Moyasar invoice').first().json.url }) }}");
const replyPayDown = respond('Reply payments unavailable', "{{ JSON.stringify({ success: false, reason: 'payments' }) }}");
const replyBuyBad = respond('Reply pack invalid', "{{ JSON.stringify({ success: false, reason: 'invalid' }) }}");

// ---------------------------------------------------------------- payment callback
const payHook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Moyasar callback (redesign)',
    parameters: { httpMethod: 'POST', path: 'oxira-redesign-moyasar-callback', responseMode: 'onReceived', options: {} }
  },
  output: [{ body: { id: 'inv_123', status: 'paid' } }]
});

const fetchInvoice = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.5,
  config: {
    name: 'Fetch invoice from Moyasar',
    parameters: {
      method: 'GET',
      url: expr("{{ 'https://api.moyasar.com/v1/invoices/' + encodeURIComponent(String($json.body.id || ($json.body.data && $json.body.data.invoice_id) || ($json.body.data && $json.body.data.id) || '')).slice(0, 64) }}"),
      authentication: 'genericCredentialType',
      genericAuthType: 'httpBasicAuth',
      options: { timeout: 20000 }
    },
    credentials: moyasar
  },
  output: [{ id: 'inv_123', status: 'paid', amount: 2900, metadata: { kind: 'redesign', purchase_id: '1', wallet: 'w1234567890abcdefghij' } }]
});

const isPaid = ifElse({ version: 2.2, config: { name: 'Paid redesign invoice?', parameters: cond("{{ $json.status === 'paid' && !!$json.metadata && $json.metadata.kind === 'redesign' }}") } });

const getPurchase = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Get pending purchase',
    parameters: {
      resource: 'row',
      operation: 'get',
      dataTableId: purchasesTable,
      matchType: 'allConditions',
      filters: { conditions: [
        { keyName: 'id', condition: 'eq', keyValue: expr('{{ String($json.metadata.purchase_id || 0) }}') },
        { keyName: 'invoice_id', condition: 'eq', keyValue: expr('{{ $json.id }}') },
        { keyName: 'status', condition: 'eq', keyValue: 'pending' }
      ] },
      limit: 1
    }
  },
  output: [{ id: 1, wallet_id: 'w1234567890abcdefghij', pack: 'p10', renders: 10, amount: 29, email: 'a@example.com', lang: 'ar', status: 'pending' }]
});

const markPaid = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Mark purchase paid',
    parameters: {
      resource: 'row',
      operation: 'update',
      dataTableId: purchasesTable,
      matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'id', condition: 'eq', keyValue: expr('{{ $json.id }}') }] },
      columns: {
        mappingMode: 'defineBelow',
        value: { status: 'paid', paid_at: expr("{{ $now.setZone('Asia/Riyadh').toFormat('yyyy-MM-dd HH:mm') }}") },
        schema: [col('status'), col('paid_at')]
      },
      options: {}
    }
  },
  output: [{ id: 1 }]
});

const getPayWallet = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Get buyer wallet',
    alwaysOutputData: true,
    parameters: {
      resource: 'row',
      operation: 'get',
      dataTableId: walletsTable,
      matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'wallet_id', condition: 'eq', keyValue: expr("{{ $('Get pending purchase').first().json.wallet_id }}") }] },
      limit: 1
    }
  },
  output: [{ id: 1, wallet_id: 'w1234567890abcdefghij', credits: 0, purchased: 0, used: 0 }]
});

const newBalance = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'New balance',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const p = $('Get pending purchase').first().json;
const w = $input.first().json || {};
const add = Number(p.renders || 0);
return [{ json: { wallet_id: p.wallet_id, credits: Number(w.credits || 0) + add, purchased: Number(w.purchased || 0) + add, used: Number(w.used || 0), email: p.email || w.email || '' } }];
`
    }
  },
  output: [{ wallet_id: 'w1234567890abcdefghij', credits: 10, purchased: 10, used: 0, email: 'a@example.com' }]
});

const saveWallet = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Save wallet',
    parameters: {
      resource: 'row',
      operation: 'upsert',
      dataTableId: walletsTable,
      matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'wallet_id', condition: 'eq', keyValue: expr('{{ $json.wallet_id }}') }] },
      columns: {
        mappingMode: 'defineBelow',
        value: { wallet_id: expr('{{ $json.wallet_id }}'), credits: expr('{{ $json.credits }}'), purchased: expr('{{ $json.purchased }}'), used: expr('{{ $json.used }}'), email: expr('{{ $json.email }}') },
        schema: [col('wallet_id'), col('credits', 'number'), col('purchased', 'number'), col('used', 'number'), col('email')]
      },
      options: {}
    }
  },
  output: [{ id: 1 }]
});

const buildEmails = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build purchase emails',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `// A note to the team, and a receipt with the wallet code to the buyer (so they can restore credits on another device).
const p = $('Get pending purchase').first().json;
const bal = $('New balance').first().json;
const out = [{ json: { to: 'info@oxira.sa', subject: 'شراء ريندرات ✅ ' + p.renders + ' ريندر - ' + p.amount + ' ريال', html: '<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;font-size:15px;line-height:1.8;color:#0A253E">تم شراء باقة <b>' + p.renders + '</b> ريندر بقيمة <b>' + p.amount + ' ريال</b> (طلب #' + p.id + ').<br>المحفظة: ' + p.wallet_id + '<br>الرصيد الآن: ' + bal.credits + '<br>البريد: ' + (p.email || '-') + '</div>' } }];
if (p.email) {
  const ar = p.lang === 'ar';
  const link = 'https://design.oxira.sa' + (ar ? '' : '/' + p.lang) + '/redesign/?w=' + p.wallet_id;
  out.push({ json: { to: p.email, subject: ar ? 'تم شحن رصيدك: ' + p.renders + ' ريندر | Oxira Design' : 'Your ' + p.renders + ' room renders are ready | Oxira Design', html: '<div dir="' + (ar ? 'rtl' : 'ltr') + '" style="font-family:Tahoma,Arial,sans-serif;font-size:15px;line-height:1.8;color:#0A253E;max-width:620px"><p style="font-size:20px;font-weight:bold;margin:0 0 6px">Oxira <span style="color:#007DB4">Design</span></p><p>' + (ar ? 'شكراً لك! أضفنا ' + p.renders + ' ريندر لرصيدك، ورصيدك الآن ' + bal.credits + '.' : 'Thank you! We added ' + p.renders + ' renders to your balance. You now have ' + bal.credits + '.') + '</p><p><a href="' + link + '" style="display:inline-block;background:#F5A800;color:#0A253E;padding:10px 18px;border-radius:10px;font-weight:bold;text-decoration:none">' + (ar ? 'صمّم غرفتك الآن' : 'Redesign a room now') + '</a></p><p style="color:#556779;font-size:13px">' + (ar ? 'احتفظ بهذا الرابط، يفتح رصيدك على أي جهاز.' : 'Keep this link: it opens your balance on any device.') + '</p></div>' } });
}
return out;
`
    }
  },
  output: [{ to: 'info@oxira.sa', subject: 'شراء', html: '<div>...</div>' }]
});

const sendEmails = node({
  type: 'n8n-nodes-base.emailSend',
  version: 2.1,
  config: {
    name: 'Send purchase emails',
    onError: 'continueRegularOutput',
    parameters: {
      fromEmail: 'Oxira Design <info@oxira.sa>',
      toEmail: expr('{{ $json.to }}'),
      subject: expr('{{ $json.subject }}'),
      emailFormat: 'html',
      html: expr('{{ $json.html }}'),
      options: { appendAttribution: false, replyTo: 'info@oxira.sa' }
    },
    credentials: smtp
  }
});

const note = sticky('## Room redesign (design.oxira.sa/redesign/)\n- **Room render**: photo of a real room → redesigned in a chosen style (gpt-image-1-mini). 1 free per visitor per day (2 per IP, 60 per day overall), then 1 credit per render from the wallet in **oxira_design_wallets**. A failed paid render gives the credit back.\n- **Wallet balance**: credits + free renders left.\n- **Buy renders**: pack prices in **Price pack** (keep in sync with the website) → **oxira_design_purchases** → Moyasar invoice (metadata kind = redesign).\n- **Moyasar callback (redesign)**: confirms with Moyasar, credits the wallet once, emails the team and a receipt with a restore link to the buyer.', [renderHook, checkRequest], { color: 4 });

export default workflow('oxira-design-redesign', 'Oxira Design — Room redesign')
  .add(renderHook)
  .to(checkRequest)
  .to(routeMode
    .onCase(0, attachImage)
    .onCase(1, getWallet.to(hasCredit.onTrue(spendCredit.to(attachImage)).onFalse(replyNoCredit)))
    .onCase(2, replyNoCredit))
  .add(attachImage)
  .to(aiRender.onError(wasPaid.onTrue(getWalletRefund.to(refundCredit).to(replyFailed)).onFalse(replyFailed)).to(renderResult))
  .add(renderResult)
  .to(replyRender)
  .add(renderResult)
  .to(logRender)
  .add(walletHook)
  .to(walletRequest)
  .to(getBalance)
  .to(replyBalance)
  .add(buyHook)
  .to(pricePack)
  .to(validBuy
    .onTrue(savePurchase.to(createInvoice.onError(replyPayDown).to(saveInvoice).to(replyPay)))
    .onFalse(replyBuyBad))
  .add(payHook)
  .to(fetchInvoice)
  .to(isPaid.onTrue(getPurchase.to(markPaid).to(getPayWallet).to(newBalance).to(saveWallet).to(buildEmails).to(sendEmails)))
  .add(note);
