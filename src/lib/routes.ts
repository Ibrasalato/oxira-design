import type { Lang } from '../i18n/content';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Link to a page in the given language. path is like '/', '/studio/'. */
export const link = (lang: Lang, path: string) => `${base}${lang === 'ar' ? '' : '/' + lang}${path}`;

/** Link to a file in /public. */
export const asset = (p: string) => `${base}/${p.replace(/^\//, '')}`;
