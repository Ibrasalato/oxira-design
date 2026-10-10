// Client account session (sign-in link token kept in this browser) and calls to the
// n8n "Oxira Design — Accounts" workflow.
import { N8N, type Lang } from '../i18n/content';

const KEY = 'ox-acc-k';

export function getToken(): string {
  try { return localStorage.getItem(KEY) || ''; } catch { return ''; }
}
export function setToken(k: string) {
  try { if (k) localStorage.setItem(KEY, k); else localStorage.removeItem(KEY); } catch { /* private mode */ }
}
/** Takes ?k= from the sign-in link, stores it and removes it from the address bar. */
export function takeTokenFromUrl(): string {
  const u = new URL(location.href);
  const k = u.searchParams.get('k') || '';
  if (/^[a-f0-9]{40}$/.test(k)) {
    setToken(k);
    u.searchParams.delete('k');
    history.replaceState(null, '', u.pathname + (u.search ? u.search : '') + u.hash);
  }
  return getToken();
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error('http ' + res.status);
  return res.json() as Promise<T>;
}

export type AccReply = { success: boolean; reason?: string; [k: string]: any };

export const requestLink = (email: string, lang: Lang) => post<AccReply>(N8N.login, { email, lang });

/** Signed-in call. A reply with reason "session" means the token is gone or expired. */
export async function acc(action: string, data: object = {}, lang?: Lang): Promise<AccReply> {
  const r = await post<AccReply>(N8N.account, { k: getToken(), action, data, lang });
  if (!r.success && r.reason === 'session') setToken('');
  return r;
}

export const sharedPlan = (s: string) => post<AccReply>(N8N.share, { s });
export const galleryList = () => post<AccReply>(N8N.gallery, {});
export const designerList = () => post<AccReply>(N8N.designers, {});
export const joinWaitlist = (b: { email: string; role: string; lang: Lang; country: string; company_website?: string }) => post<AccReply>(N8N.waitlist, { plan: 'pro', ...b });

export async function deliver(orderId: number, note: string, files: File[]): Promise<AccReply> {
  const fd = new FormData();
  fd.set('k', getToken());
  fd.set('order_id', String(orderId));
  fd.set('note', note);
  files.forEach((f, i) => fd.append('file' + i, f, f.name));
  const res = await fetch(N8N.deliver, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('http ' + res.status);
  return res.json();
}
