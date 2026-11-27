import { useCallback, useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ContentProvider } from './content/ContentProvider';
import { resolveInitialLocale, saveLocale, t, type Locale } from './i18n';
import { CardTeachingsPage } from './pages/CardTeachingsPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { CompleteTeachingsPage } from './pages/CompleteTeachingsPage';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { buildAnalyticsPagePath, trackPageView } from './utils/analytics';
import { buildUrl, parseRoute, type Route } from './utils/routing';

const THEME_STORAGE_KEY = 'dhamma-un-jai-theme';

function getInitialDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
  } catch {
    // Ignore storage access errors
  }
  return false;
}

function AppShell() {
  const [locale, setLocale] = useState<Locale>(() =>
    typeof window !== 'undefined'
      ? resolveInitialLocale(window.location.search)
      : 'th'
  );
  const [route, setRoute] = useState<Route>(() =>
    typeof window !== 'undefined'
      ? parseRoute(
          window.location.pathname,
          window.location.search,
          window.location.hash
        )
      : { page: 'home' }
  );
  const [isDark, setIsDark] = useState<boolean>(getInitialDarkMode);

  // Sync <html lang>, document.title, and URL ?lang parameter with active locale
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = `${t(locale, 'site.title')} · ${t(locale, 'site.subtitle')}`;

    const currentParams = new URLSearchParams(window.location.search);
    const hasExplicitParam = currentParams.has('lang');
    const desiredUrl = buildUrl(
      route,
      locale,
      hasExplicitParam && locale === 'th'
    );
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (currentUrl !== desiredUrl) {
      window.history.replaceState(null, '', desiredUrl);
    }
  }, [locale, route]);

  // Send GA4 page_view on initial load and on every route or locale change (production only)
  const analyticsPagePath = buildAnalyticsPagePath(route, locale);
  useEffect(() => {
    trackPageView(analyticsPagePath);
  }, [analyticsPagePath]);

  // Sync dark mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage write errors
    }
  }, [isDark]);

  // Handle browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setRoute(
        parseRoute(
          window.location.pathname,
          window.location.search,
          window.location.hash
        )
      );
      setLocale(resolveInitialLocale(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLocaleChange = useCallback(
    (nextLocale: Locale) => {
      if (nextLocale === locale) return;
      saveLocale(nextLocale);
      setLocale(nextLocale);
      const nextUrl = buildUrl(route, nextLocale);
      window.history.replaceState(null, '', nextUrl);
    },
    [locale, route]
  );

  const handleNavigate = useCallback(
    (nextRoute: Route) => {
      const nextUrl = buildUrl(nextRoute, locale);
      window.history.pushState(null, '', nextUrl);
      setRoute(nextRoute);
      if (!(nextRoute.page === 'category' && nextRoute.itemId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [locale]
  );

  const handleSearchQueryChange = useCallback(
    (query: string) => {
      const nextRoute: Route = { page: 'search', query };
      const currentParams = new URLSearchParams(window.location.search);
      const hasExplicitParam = currentParams.has('lang');
      const nextUrl = buildUrl(
        nextRoute,
        locale,
        hasExplicitParam && locale === 'th'
      );
      window.history.replaceState(null, '', nextUrl);
      setRoute(nextRoute);
    },
    [locale]
  );

  const handleToggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#3E3A35] dark:bg-[#161411] dark:text-[#EFEAE0]">
      <Header
        locale={locale}
        route={route}
        isDark={isDark}
        onLocaleChange={handleLocaleChange}
        onToggleTheme={handleToggleTheme}
        onNavigate={handleNavigate}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-8">
        {route.page === 'home' && (
          <HomePage locale={locale} onNavigate={handleNavigate} />
        )}
        {route.page === 'teachings' && (
          <CompleteTeachingsPage locale={locale} onNavigate={handleNavigate} />
        )}
        {route.page === 'category' && (
          <CategoryDetailPage
            categoryId={route.categoryId}
            highlightItemId={route.itemId}
            locale={locale}
            onNavigate={handleNavigate}
          />
        )}
        {route.page === 'cards' && (
          <CardTeachingsPage locale={locale} onNavigate={handleNavigate} />
        )}
        {route.page === 'search' && (
          <SearchPage
            initialQuery={route.query}
            locale={locale}
            onQueryChange={handleSearchQueryChange}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      <Footer locale={locale} />
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <AppShell />
    </ContentProvider>
  );
}
