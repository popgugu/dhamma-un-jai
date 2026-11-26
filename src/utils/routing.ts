import { DEFAULT_LOCALE, type Locale } from '../i18n/types';

export type Route =
  | { page: 'home' }
  | { page: 'teachings' }
  | { page: 'category'; categoryId: string; itemId?: string }
  | { page: 'cards' }
  | { page: 'search'; query: string };

export function parseRoute(pathname: string, search = '', hash = ''): Route {
  const params = new URLSearchParams(search);
  if (params.get('page') === 'search') {
    return {
      page: 'search',
      query: params.get('q') ?? '',
    };
  }

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
      const cleanHash = hash.startsWith('#') ? decodeURIComponent(hash.slice(1)) : '';
      return cleanHash
        ? { page: 'category', categoryId, itemId: cleanHash }
        : { page: 'category', categoryId };
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
    case 'search':
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
 * Search routes use ?page=search&q=... and preserve ?lang.
 * Category routes preserve optional #itemId anchors for smooth scroll targets.
 */
export function buildUrl(
  route: Route,
  locale: Locale,
  includeDefaultParam = false
): string {
  const pathname = routeToPathname(route);
  const params = new URLSearchParams();

  if (route.page === 'search') {
    params.set('page', 'search');
    if (route.query) {
      params.set('q', route.query);
    }
  }

  if (locale !== DEFAULT_LOCALE || includeDefaultParam) {
    params.set('lang', locale);
  }

  const queryString = params.toString();
  const hash =
    route.page === 'category' && route.itemId
      ? `#${encodeURIComponent(route.itemId)}`
      : '';

  return `${pathname}${queryString ? `?${queryString}` : ''}${hash}`;
}
