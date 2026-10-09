import { languages, langPath, type Lang } from '../i18n/content';
import { GUIDES, GUIDE_LANGS, GUIDES_UPDATED, HUB_PATH } from '../i18n/guides';

const site = 'https://design.oxira.sa';
// Pages that exist in every language.
const pages = ['', 'studio/', 'redesign/', 'privacy/'];
// Guide pages exist in Arabic and English only.
const guides = [HUB_PATH, ...GUIDES.map((g) => `/${g.slug}/`)].map((p) => p.replace(/^\//, ''));

const entry = (p: string, langs: Lang[], priority: string, lastmod?: string) =>
  langs.map((l) => {
    const alts = langs.map((a) => `<xhtml:link rel="alternate" hreflang="${a}" href="${site}${langPath(a)}${p}"/>`).join('');
    return `<url><loc>${site}${langPath(l)}${p}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}${alts}<xhtml:link rel="alternate" hreflang="x-default" href="${site}/${p}"/><priority>${priority}</priority></url>`;
  });

export function GET() {
  const all = languages.map((l) => l.code);
  const urls = [
    ...pages.flatMap((p) => entry(p, all, p === '' ? '1.0' : p === 'studio/' || p === 'redesign/' ? '0.8' : '0.3')),
    ...guides.flatMap((p) => entry(p, GUIDE_LANGS, '0.7', GUIDES_UPDATED)),
  ];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
}
