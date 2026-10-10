// Embed code for a shared plan (/embed/?s=&l=), used in the account page and the plan designer.
import type { Lang } from '../i18n/content';

export const embedCode = (share: string, lang: Lang) =>
  `<iframe src="https://design.oxira.sa/embed/?s=${share}&l=${lang}" width="100%" height="560" style="border:0;border-radius:12px" loading="lazy" title="Floor plan · Oxira Design"></iframe>`;
