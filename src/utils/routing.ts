import { DEFAULT_LOCALE, type Locale } from '../i18n/types';

export type Route =
  | { page: 'home' }
  | { page: 'teachings' }
  | { page: 'category'; categoryId: string }
  | { page: 'cards' };

export function parseRoute(pathname: string): Route {
  const normalized = pathname.replace(/\/+$/, '') || '/';

  if (normalized === '/' || normalized === '') {
    return { page: 'home' };
  }
  if (normalized === '/teachings') {
    return { page: 'teachings' };
  }
  if (normalized.startsWith('/teachings/')) {
    const categoryId = decodeURIComponent(normalized.slice('/teachings/'.length));
    if (categoryId) {
      return { page: 'category', categoryId };
    }
  }
  if (normalized === '/cards') {
    return { page: 'cards' };
  }

  return { page: 'home' };
}

export function routeToPathname(route: Route): string {
  switch (route.page) {
    case 'home':
      return '/';
    case 'teachings':
      return '/teachings';
    case 'category':
      return `/teachings/${encodeURIComponent(route.categoryId)}`;
    case 'cards':
      return '/cards';
  }
}

/**
 * Build a URL path preserving the active language query parameter.
 * Always appends ?lang=<locale> when non-default (e.g. ?lang=en), or when
 * explicitly requested so shared links always open in the right language.
 */
export function buildUrl(route: Route, locale: Locale, includeDefaultParam = false): string {
  const pathname = routeToPathname(route);
  if (locale !== DEFAULT_LOCALE || includeDefaultParam) {
    return `${pathname}?lang=${encodeURIComponent(locale)}`;
  }
  return pathname;
}
