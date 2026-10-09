// JSON-LD for the guide pages: BreadcrumbList, FAQPage, Service and (optionally) HowTo.
import { CONTACT } from '../i18n/content';
import { GUIDES, guideCopy, guidePath, HUB_PATH, ui, type GuideLang, type GuideMeta } from '../i18n/guides';
import { link, asset } from './routes';

const abs = (site: URL, lang: GuideLang, path: string) => new URL(link(lang, path), site).href;

const provider = (site: URL) => ({
  '@type': 'Organization',
  name: 'Oxira',
  alternateName: 'أوكسيرا',
  url: CONTACT.main,
  email: CONTACT.email,
  address: { '@type': 'PostalAddress', streetAddress: '426 Al Sulaymaniyah, Al Urubah Rd.', addressLocality: 'Riyadh', addressCountry: 'SA' },
  logo: new URL(asset('favicon.svg'), site).href,
});

export function breadcrumbLd(site: URL, lang: GuideLang, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(site, lang, it.path) })),
  };
}

export function guideLd(site: URL, lang: GuideLang, meta: GuideMeta) {
  const c = guideCopy[lang][meta.slug];
  const url = abs(site, lang, guidePath(meta.slug));
  const out: object[] = [
    breadcrumbLd(site, lang, [
      { name: ui[lang].home, path: '/' },
      { name: ui[lang].hub, path: HUB_PATH },
      { name: c.nav, path: guidePath(meta.slug) },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: c.h1,
      serviceType: meta.serviceType,
      description: c.description,
      url,
      inLanguage: lang,
      areaServed: meta.areaServed.map((name) => ({ '@type': 'Country', name })),
      provider: provider(site),
      brand: { '@type': 'Brand', name: 'Oxira Design' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: lang,
      mainEntity: c.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];
  const s = meta.howto !== undefined ? c.sections[meta.howto] : undefined;
  if (s?.steps) {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: s.h,
      inLanguage: lang,
      step: s.steps.map((st, i) => ({ '@type': 'HowToStep', position: i + 1, name: st.t, text: st.d, url: `${url}#s${meta.howto}` })),
    });
  }
  return out;
}

export function hubLd(site: URL, lang: GuideLang) {
  return [
    breadcrumbLd(site, lang, [{ name: ui[lang].home, path: '/' }, { name: ui[lang].hub, path: HUB_PATH }]),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: ui[lang].hubH1,
      description: ui[lang].hubDescription,
      url: abs(site, lang, HUB_PATH),
      inLanguage: lang,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: GUIDES.map((g, i) => ({ '@type': 'ListItem', position: i + 1, name: guideCopy[lang][g.slug].nav, url: abs(site, lang, guidePath(g.slug)) })),
      },
    },
  ];
}
