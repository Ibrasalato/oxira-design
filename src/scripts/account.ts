// /account/ page controller. Everything the visitor sees comes from one "load" call to the
// n8n account webhook; each change (save, comment, claim…) is another call, then a reload.
import { acc as copy, STATUS_KEYS } from '../i18n/account';
import type { Lang } from '../i18n/content';
import { acc, requestLink, takeTokenFromUrl, setToken, deliver, type AccReply } from '../lib/account';

type Cfg = { lang: Lang; plan: string; pkgs: Record<string, string> };
type Msg = { role: string; text: string; at: string; mine: boolean };
type Order = {
  id: number; package: string; status: string; created: string; price_note: string; area: number; city: string; files: string; delivered_at: string;
  rating: number; review: string; has_designer: boolean; share: string; comments: Msg[]; notes?: string; client?: string; designer?: string; planTypes?: string[];
};
type View = AccReply & { email: string; designer: string; projects: { pid: string; title: string; kind: string; updated: string; share: string }[]; orders: Order[]; open?: Order[]; mine?: Order[] };

export function startAccount(root: HTMLElement) {
  const cfg: Cfg = JSON.parse(root.dataset.cfg!);
  const T = copy[cfg.lang];
  const $ = <E extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as E;
  const date = (s: string) => {
    const d = new Date(s);
    return isNaN(+d) ? '' : d.toLocaleDateString(cfg.lang === 'ar' ? 'ar-SA-u-nu-latn-ca-gregory' : cfg.lang, { year: 'numeric', month: 'short', day: 'numeric' });
  };
  const planUrl = (q: string) => `${location.origin}${cfg.plan}?${q}`;
  let view: View | null = null;
  let tab = 'projects';
  try { tab = sessionStorage.getItem('ox-acc-tab') || 'projects'; } catch { /* */ }

  /** element helper: text is always set with textContent */
  function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string> = {}, ...kids: (Node | string | null | false)[]) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    for (const c of kids) if (c) e.append(c);
    return e;
  }
  const btn = (label: string, cls = 'btn btn-ghost', on?: () => void) => {
    const b = h('button', { type: 'button', class: cls }, label);
    if (on) b.addEventListener('click', on);
    return b;
  };
  function say(text: string, err = false, id = 'acc-msg') {
    const m = $(id);
    m.textContent = text;
    m.classList.toggle('is-err', err);
    m.hidden = !text;
  }
  const busy = async (b: HTMLButtonElement | null, fn: () => Promise<void>) => {
    if (b) b.disabled = true;
    try { await fn(); } catch { say(T.err, true); } finally { if (b) b.disabled = false; }
  };

  // ---------------------------------------------------------------- sign-in
  const state = (s: 'loading' | 'signin' | 'app') => { root.dataset.state = s; };
  $<HTMLFormElement>('acc-signin').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.currentTarget as HTMLFormElement;
    const email = (f.elements.namedItem('email') as HTMLInputElement).value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return say(T.signIn.bad, true, 'acc-signin-msg');
    const b = f.querySelector('button')!;
    b.disabled = true;
    requestLink(email, cfg.lang)
      .then(() => say(T.signIn.sent, false, 'acc-signin-msg'))
      .catch(() => say(T.err, true, 'acc-signin-msg'))
      .finally(() => { b.disabled = false; });
  });
  $('acc-out').addEventListener('click', () => { setToken(''); view = null; state('signin'); });

  // ---------------------------------------------------------------- tabs
  function setTab(t: string) {
    tab = t;
    try { sessionStorage.setItem('ox-acc-tab', t); } catch { /* */ }
    root.querySelectorAll<HTMLElement>('[data-tab]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === t)));
    root.querySelectorAll<HTMLElement>('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== t; });
  }
  root.querySelectorAll<HTMLElement>('[data-tab]').forEach((b) => b.addEventListener('click', () => { say(''); setTab(b.dataset.tab!); }));

  // ---------------------------------------------------------------- data
  async function load(keepMsg = false) {
    const r = (await acc('load', {}, cfg.lang)) as View;
    if (!r.success) {
      state('signin');
      if (r.reason === 'session') say(T.signIn.expired, true, 'acc-signin-msg');
      return;
    }
    view = r;
    if (!keepMsg) say('');
    render();
    state('app');
  }
  async function act(action: string, data: object, ok?: string) {
    const r = await acc(action, data, cfg.lang);
    if (!r.success && r.reason === 'session') { state('signin'); say(T.signIn.expired, true, 'acc-signin-msg'); return null; }
    if (!r.success) { say(T.err, true); return null; }
    if (ok) say(ok);
    await load(!!ok);
    return r;
  }

  // ---------------------------------------------------------------- render
  function render() {
    if (!view) return;
    $('acc-email').textContent = view.email;
    $('acc-n-projects').textContent = view.projects.length ? String(view.projects.length) : '';
    $('acc-n-orders').textContent = view.orders.length ? String(view.orders.length) : '';
    renderProjects();
    renderOrders($('acc-orders'), view.orders, 'client');
    const d = view.designer;
    $('acc-apply').hidden = d !== '';
    $('acc-pending').hidden = d !== 'pending';
    $('acc-portal').hidden = !(d === 'active' || d === 'admin');
    if (view.open) renderOrders($('acc-open'), view.open, 'open');
    if (view.mine) renderOrders($('acc-mine'), view.mine, 'designer');
    setTab(tab);
  }

  function copyLink(url: string, b: HTMLButtonElement, done: string) {
    const label = b.textContent;
    const ok = () => { b.textContent = done; setTimeout(() => { b.textContent = label; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(ok, () => prompt('', url));
    else prompt('', url);
  }

  function renderProjects() {
    const box = $('acc-projects');
    box.replaceChildren();
    if (!view!.projects.length) { box.append(h('p', { class: 'acc-empty' }, T.projects.empty)); return; }
    for (const p of view!.projects) {
      const share = btn(T.projects.share);
      share.addEventListener('click', () => copyLink(planUrl('s=' + p.share), share, T.projects.copied));
      const del = btn(T.projects.del, 'btn btn-ghost');
      del.addEventListener('click', () => { if (confirm(T.projects.confirmDel)) busy(del, async () => { await act('delete', { pid: p.pid }); }); });
      box.append(h('article', { class: 'acc-item' },
        h('div', { class: 'acc-item-h' }, h('b', {}, p.title), h('span', { class: 'acc-small' }, `${T.projects.updated}: ${date(p.updated)}`)),
        h('div', { class: 'acc-actions' }, h('a', { class: 'btn btn-navy', href: `${cfg.plan}?p=${encodeURIComponent(p.pid)}` }, T.projects.open), share, del)));
    }
  }

  const statusOf = (s: string) => (STATUS_KEYS as Record<string, keyof typeof T.orders.status>)[s] || 'new';
  const roleName = (m: Msg, side: 'client' | 'designer' | 'open') => (m.mine ? T.orders.you : m.role === 'designer' ? T.orders.designer : side === 'client' ? T.orders.team : T.orders.client);

  function renderOrders(box: HTMLElement, list: Order[], side: 'client' | 'designer' | 'open') {
    box.replaceChildren();
    if (!list.length) { box.append(h('p', { class: 'acc-empty' }, side === 'client' ? T.orders.empty : T.des.none)); return; }
    for (const o of list) {
      const st = statusOf(o.status);
      const item = h('article', { class: 'acc-item' },
        h('div', { class: 'acc-item-h' },
          h('b', {}, `${T.orders.order} #${o.id} · ${cfg.pkgs[o.package] || o.package}`),
          h('span', { class: 'acc-badge', 'data-s': st }, T.orders.status[st])),
        h('p', { class: 'acc-small' }, [date(o.created), o.city, o.area ? `${o.area} m²` : '', o.price_note].filter(Boolean).join(' · ')));
      if (o.files) item.append(h('p', { class: 'acc-small' }, `${T.orders.files}: ${o.files}`));
      if (o.share) item.append(h('a', { class: 'acc-small', href: `${cfg.plan}?s=${encodeURIComponent(o.share)}` }, T.orders.plan));
      if (side !== 'client' && o.notes) item.append(h('details', {}, h('summary', {}, T.des.notes), h('div', { class: 'acc-notes' }, o.notes)));

      if (side === 'open') {
        const c = btn(T.des.claim, 'btn btn-amber');
        c.addEventListener('click', () => busy(c, async () => { if (await act('claim', { order_id: o.id }, T.des.claimed)) setTab('designer'); }));
        item.append(h('div', { class: 'acc-actions' }, c));
        box.append(item);
        continue;
      }

      // message thread
      const thread = h('div', { class: 'acc-thread' }, h('b', {}, T.orders.thread));
      for (const m of o.comments) {
        thread.append(h('div', { class: 'acc-bubble' + (m.mine ? ' is-mine' : '') }, h('small', {}, `${roleName(m, side)} · ${date(m.at)}`), m.text));
      }
      if (side === 'client' && !o.has_designer) thread.append(h('p', { class: 'acc-small' }, T.orders.noDesigner));
      const ta = h('textarea', { rows: '1', maxlength: '2000', placeholder: T.orders.write });
      const send = btn(T.orders.send, 'btn btn-navy');
      send.addEventListener('click', () => {
        const text = ta.value.trim();
        if (!text) return;
        busy(send, async () => { await act('comment', { order_id: o.id, text }); });
      });
      thread.append(h('div', { class: 'acc-send' }, ta, send));
      item.append(thread);

      // rating (client, after delivery)
      if (side === 'client' && o.delivered_at) {
        if (o.rating) item.append(h('p', { class: 'acc-small' }, `${'★'.repeat(o.rating)}${'☆'.repeat(5 - o.rating)} ${T.orders.thanks}`));
        else item.append(rateBox(o));
      }
      // delivery (designer)
      if (side === 'designer' && st !== 'cancelled') item.append(deliverBox(o));
      box.append(item);
    }
  }

  function rateBox(o: Order) {
    let r = 0;
    const stars = h('div', { class: 'acc-stars', role: 'radiogroup' });
    const paint = () => stars.querySelectorAll('button').forEach((b, i) => b.classList.toggle('is-on', i < r));
    for (let i = 1; i <= 5; i++) {
      const b = h('button', { type: 'button', 'aria-label': String(i) }, '★');
      b.addEventListener('click', () => { r = i; paint(); });
      stars.append(b);
    }
    const review = h('textarea', { rows: '2', maxlength: '1000', placeholder: T.orders.review });
    const send = btn(T.orders.rateSend, 'btn btn-amber');
    send.addEventListener('click', () => { if (r) busy(send, async () => { await act('rate', { order_id: o.id, rating: r, review: review.value }, T.orders.thanks); }); });
    return h('div', { class: 'acc-rate' }, h('b', {}, T.orders.rate), stars, review, h('div', {}, send));
  }

  function deliverBox(o: Order) {
    const files = h('input', { type: 'file', multiple: '', accept: '.pdf,.dwg,.dxf,.png,.jpg,.jpeg,.webp,.zip,.max,.skp,.rvt,.ifc,.glb' });
    const note = h('textarea', { rows: '2', maxlength: '2000', placeholder: T.des.deliverNote });
    const go = btn(T.des.deliverBtn, 'btn btn-navy');
    go.addEventListener('click', () => {
      const list = Array.from(files.files || []);
      if (!list.length) return files.click();
      if (list.reduce((s, f) => s + f.size, 0) > 20 * 1048576) return say(T.des.deliverHint, true);
      busy(go, async () => {
        const r = await deliver(o.id, note.value, list);
        if (!r.success) return say(T.err, true);
        say(T.des.delivered);
        await load(true);
      });
    });
    return h('details', { class: 'acc-deliver' }, h('summary', {}, h('b', {}, T.des.deliver)), h('p', { class: 'acc-small' }, T.des.deliverHint), files, note, h('div', {}, go));
  }

  // ---------------------------------------------------------------- designer application
  $<HTMLFormElement>('acc-apply').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.currentTarget as HTMLFormElement;
    const v = (n: string) => (f.elements.namedItem(n) as HTMLInputElement).value.trim();
    if (!v('name') || !v('skills')) { f.reportValidity(); return; }
    busy(f.querySelector('button'), async () => { await act('apply', { name: v('name'), skills: v('skills'), countries: v('countries'), note: v('note') }, T.des.applied); });
  });

  // ---------------------------------------------------------------- start
  if (takeTokenFromUrl()) load().catch(() => { state('signin'); say(T.err, true, 'acc-signin-msg'); });
  else state('signin');
}
