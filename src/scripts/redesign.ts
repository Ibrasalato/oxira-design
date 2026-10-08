// Room photo redesign page. Talks to the n8n workflow "Oxira Design — Room redesign":
// oxira-redesign-render (photo → image), oxira-redesign-wallet (balance), oxira-redesign-buy (Moyasar link).
// The wallet id lives in localStorage and can be restored on another device with ?w=<id>.

interface Cfg {
  lang: string;
  render: string;
  wallet: string;
  buy: string;
  whatsapp: string;
  t: {
    credits: string; freeOne: string; freeNone: string; working: string;
    err: { invalid: string; failed: string; network: string; credits: string };
    bought: string; pending: string; cancel: string; copied: string; copy: string; unavailable: string;
    packs: Record<string, string>;
  };
}

const SID_KEY = 'oxira-design-sid';
const WALLET_KEY = 'oxira-design-wallet';
const EMAIL_KEY = 'oxira-design-email';
const MAX_SIDE = 1024;

const store = {
  get(k: string) { try { return localStorage.getItem(k) || ''; } catch { return ''; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};

const randomId = (n: number) => {
  const a = new Uint8Array(n);
  crypto.getRandomValues(a);
  const abc = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(a, (x) => abc[x % abc.length]).join('');
};

async function post<T>(url: string, body: unknown, timeout = 30000): Promise<T> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeout);
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctl.signal });
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

/** Reads an image file and returns a JPEG data URL no larger than MAX_SIDE on its long side. */
function shrink(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * k));
      const h = Math.max(1, Math.round(img.naturalHeight * k));
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      if (!ctx) { URL.revokeObjectURL(url); reject(new Error('canvas')); return; }
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.86));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image')); };
    img.src = url;
  });
}

export function initRedesign() {
  const root = document.getElementById('rd');
  if (!root) return;
  const cfg = JSON.parse(root.dataset.cfg || '{}') as Cfg;
  const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

  const notice = $('rd-notice');
  const fileInput = $<HTMLInputElement>('rd-file');
  const drop = $('rd-drop');
  const go = $<HTMLButtonElement>('rd-go');
  const quota = $('rd-quota');
  const compare = $('rd-compare');
  const before = $<HTMLImageElement>('rd-before');
  const after = $<HTMLImageElement>('rd-after');
  const slider = $<HTMLInputElement>('rd-slider');
  const actions = $('rd-actions');
  const download = $<HTMLAnchorElement>('rd-download');
  const email = $<HTMLInputElement>('rd-email');
  const restore = $('rd-restore');
  const restoreUrl = $<HTMLInputElement>('rd-restore-url');

  let sid = store.get(SID_KEY);
  if (!sid) { sid = randomId(24); store.set(SID_KEY, sid); }

  // Wallet: from ?w= (restore link), else localStorage. Created on the first purchase.
  const params = new URLSearchParams(location.search);
  const fromUrl = params.get('w') || '';
  if (/^[a-zA-Z0-9]{16,48}$/.test(fromUrl)) store.set(WALLET_KEY, fromUrl);
  let wallet = store.get(WALLET_KEY);
  email.value = store.get(EMAIL_KEY);

  let image = '';
  let room = 'living';
  let style = 'modern';
  let credits = 0;
  let freeLeft = 0;
  let busy = false;

  const say = (msg: string, err = false, html = false) => {
    if (!msg) { notice.hidden = true; return; }
    if (html) notice.innerHTML = msg; else notice.textContent = msg;
    notice.classList.toggle('is-err', err);
    notice.hidden = false;
  };

  const showQuota = () => {
    const parts: string[] = [];
    if (credits > 0) parts.push(cfg.t.credits.replace('{n}', String(credits)));
    parts.push(freeLeft > 0 ? cfg.t.freeOne : (credits > 0 ? '' : cfg.t.freeNone));
    quota.textContent = parts.filter(Boolean).join(' · ');
    if (wallet && credits > 0) {
      restoreUrl.value = `${location.origin}${location.pathname}?w=${wallet}`;
      restore.hidden = false;
    }
  };

  const refresh = async () => {
    try {
      const r = await post<{ success?: boolean; credits?: number; free_left?: number }>(cfg.wallet, { wallet, sessionId: sid });
      credits = Number(r.credits || 0);
      freeLeft = Number(r.free_left || 0);
      showQuota();
    } catch { /* balance stays as is */ }
  };

  const ready = () => { go.disabled = busy || !image; };

  // After returning from Moyasar.
  if (params.has('bought')) {
    say(cfg.t.pending);
    let tries = 0;
    const poll = async () => {
      await refresh();
      tries += 1;
      if (credits > 0) say(cfg.t.bought);
      else if (tries < 6) setTimeout(poll, 4000);
    };
    poll();
  } else {
    if (params.has('cancel')) say(cfg.t.cancel);
    refresh();
  }
  if (params.has('w') || params.has('bought') || params.has('cancel')) history.replaceState(null, '', location.pathname);

  // Photo
  const usePhoto = async (file?: File | null) => {
    if (!file || !/^image\//.test(file.type)) { if (file) say(cfg.t.err.invalid, true); return; }
    try {
      image = await shrink(file);
      before.src = image;
      compare.dataset.state = 'photo';
      actions.hidden = true;
      say('');
      ready();
    } catch {
      say(cfg.t.err.invalid, true);
    }
  };
  fileInput.addEventListener('change', () => usePhoto(fileInput.files && fileInput.files[0]));
  ['dragenter', 'dragover'].forEach((e) => drop.addEventListener(e, (ev) => { ev.preventDefault(); drop.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach((e) => drop.addEventListener(e, (ev) => { ev.preventDefault(); drop.classList.remove('is-over'); }));
  drop.addEventListener('drop', (ev) => usePhoto((ev as DragEvent).dataTransfer?.files[0]));

  // Room and style chips
  const chips = (id: string, attr: string, set: (v: string) => void) => {
    const box = $(id);
    box.addEventListener('click', (ev) => {
      const b = (ev.target as HTMLElement).closest('button');
      if (!b) return;
      box.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      set(b.getAttribute(attr) || '');
    });
  };
  chips('rd-rooms', 'data-room', (v) => { room = v; });
  chips('rd-styles', 'data-style', (v) => { style = v; });

  // Before / after slider
  const setCut = () => compare.style.setProperty('--cut', `${slider.value}%`);
  slider.addEventListener('input', setCut);
  setCut();

  // Render
  const packs = document.getElementById('packs');
  go.addEventListener('click', async () => {
    if (!image || busy) return;
    if (freeLeft <= 0 && credits <= 0) {
      say(cfg.t.err.credits, true);
      packs?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    busy = true; ready();
    say('');
    compare.dataset.state = 'busy';
    actions.hidden = true;
    compare.scrollIntoView({ behavior: 'smooth', block: 'center' });
    try {
      const r = await post<{ success?: boolean; image?: string; reason?: string; free_left?: number; credits?: number | null }>(
        cfg.render, { sessionId: sid, wallet, style, room, lang: cfg.lang, image }, 170000,
      );
      if (typeof r.free_left === 'number') freeLeft = r.free_left;
      if (typeof r.credits === 'number') credits = r.credits;
      if (r.success && r.image) {
        after.src = r.image;
        download.href = r.image;
        download.download = `oxira-${room}-${style}.jpg`;
        slider.value = '50'; setCut();
        compare.dataset.state = 'done';
        actions.hidden = false;
      } else {
        compare.dataset.state = 'photo';
        if (r.reason === 'credits') { say(cfg.t.err.credits, true); packs?.scrollIntoView({ behavior: 'smooth' }); }
        else say(r.reason === 'invalid' ? cfg.t.err.invalid : cfg.t.err.failed, true);
      }
    } catch {
      compare.dataset.state = 'photo';
      say(cfg.t.err.network, true);
    }
    busy = false; ready();
    showQuota();
  });

  $('rd-again').addEventListener('click', () => {
    compare.dataset.state = 'photo';
    actions.hidden = true;
    $('rd-styles').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Buy a pack
  document.querySelectorAll<HTMLButtonElement>('[data-pack]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const pack = btn.dataset.pack || '';
      if (!wallet) { wallet = randomId(24); store.set(WALLET_KEY, wallet); }
      const mail = email.value.trim();
      if (mail) store.set(EMAIL_KEY, mail);
      btn.disabled = true;
      try {
        const r = await post<{ success?: boolean; payUrl?: string; reason?: string }>(cfg.buy, {
          wallet, pack, email: mail, lang: cfg.lang, returnUrl: location.origin + location.pathname,
        });
        if (r.success && r.payUrl) { location.href = r.payUrl; return; }
        const text = encodeURIComponent(`${cfg.t.packs[pack] || pack} — Oxira Design (${wallet})`);
        say(`${cfg.t.unavailable} <a href="${cfg.whatsapp}?text=${text}" target="_blank" rel="noopener">WhatsApp</a>`, true, true);
        notice.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch {
        say(cfg.t.err.network, true);
        notice.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      btn.disabled = false;
    });
  });

  $('rd-copy').addEventListener('click', async (ev) => {
    const b = ev.currentTarget as HTMLButtonElement;
    try { await navigator.clipboard.writeText(restoreUrl.value); } catch { restoreUrl.select(); }
    b.textContent = cfg.t.copied;
    setTimeout(() => { b.textContent = cfg.t.copy; }, 1800);
  });
}
