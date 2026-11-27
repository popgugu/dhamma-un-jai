import { GA_MEASUREMENT_ID } from '../content/analytics';
import type { Locale } from '../i18n/types';
import { routeToPathname, type Route } from './routing';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export interface AnalyticsOptions {
  measurementId?: string;
  isProd?: boolean;
}

let initializedMeasurementId: string | null = null;
let lastTrackedPath: string | null = null;

function isProductionBuild(): boolean {
  try {
    return Boolean(
      typeof import.meta !== 'undefined' &&
        import.meta.env &&
        import.meta.env.PROD
    );
  } catch {
    return false;
  }
}

/**
 * Builds the GA4 page_path for an app route and locale, always including ?lang=
 * so Thai and English page views can be distinguished in reports.
 */
export function buildAnalyticsPagePath(route: Route, locale: Locale): string {
  const pathname = routeToPathname(route);
  const params = new URLSearchParams();

  if (route.page === 'search') {
    params.set('page', 'search');
  }
  params.set('lang', locale);

  return `${pathname}?${params.toString()}`;
}

export function initAnalytics(options: AnalyticsOptions = {}): boolean {
  try {
    const isProd = options.isProd ?? isProductionBuild();
    const id = (options.measurementId ?? GA_MEASUREMENT_ID).trim();

    if (!isProd || !id) {
      return false;
    }

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return false;
    }

    if (initializedMeasurementId === id) {
      return true;
    }

    const scriptSrc = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    const existingScript = document.querySelector?.(
      `script[src="${scriptSrc}"]`
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = scriptSrc;
      document.head.appendChild(script);
    }

    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
      window.gtag = function gtag() {
        // gtag.js requires pushing the Arguments object to dataLayer
        window.dataLayer?.push(arguments);
      };
    }

    window.gtag('js', new Date());
    window.gtag('config', id, { send_page_view: false });

    initializedMeasurementId = id;
    return true;
  } catch {
    return false;
  }
}

export function trackPageView(
  pagePath: string,
  options: AnalyticsOptions = {}
): boolean {
  try {
    const isProd = options.isProd ?? isProductionBuild();
    const id = (options.measurementId ?? GA_MEASUREMENT_ID).trim();

    if (!isProd || !id) {
      return false;
    }

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return false;
    }

    if (initializedMeasurementId !== id) {
      const ok = initAnalytics({ isProd, measurementId: id });
      if (!ok) return false;
    }

    if (lastTrackedPath === pagePath) {
      return false;
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: document.title,
      });
      lastTrackedPath = pagePath;
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export function resetAnalyticsStateForTests(): void {
  initializedMeasurementId = null;
  lastTrackedPath = null;
}
