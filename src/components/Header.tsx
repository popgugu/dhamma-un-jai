import { Moon, Sun } from 'lucide-react';
import { Fragment, type MouseEvent } from 'react';
import { SUPPORTED_LOCALES, t, type Locale } from '../i18n';
import { buildUrl, type Route } from '../utils/routing';
import { LotusIcon } from './LotusIcon';

interface HeaderProps {
  locale: Locale;
  route: Route;
  isDark: boolean;
  onLocaleChange: (locale: Locale) => void;
  onToggleTheme: () => void;
  onNavigate: (route: Route) => void;
}

export function Header({
  locale,
  route,
  isDark,
  onLocaleChange,
  onToggleTheme,
  onNavigate,
}: HeaderProps) {
  const handleLinkClick = (target: Route) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    onNavigate(target);
  };

  const isTeachingsActive = route.page === 'teachings' || route.page === 'category';
  const isCardsActive = route.page === 'cards';

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F0]/92 dark:bg-[#161411]/92 backdrop-blur-md border-b border-[#E7DFD0]/80 dark:border-[#352F28]/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand mark & title */}
        <a
          href={buildUrl({ page: 'home' }, locale)}
          onClick={handleLinkClick({ page: 'home' })}
          className="inline-flex items-center gap-2.5 min-h-[44px] text-[#3E3A35] dark:text-[#EFEAE0] hover:opacity-85 transition-opacity whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8963E] rounded-lg"
        >
          <LotusIcon className="w-7 h-7 text-[#C8963E] dark:text-[#DFB15E] shrink-0" />
          <span className="font-serif text-lg sm:text-xl font-semibold tracking-tight">
            {t(locale, 'site.title')}
          </span>
        </a>

        {/* Zone 2: Calm single-line text navigation (tablet/desktop) */}
        <nav
          aria-label={t(locale, 'site.title')}
          className="hidden md:flex items-center gap-7 text-[15px]"
        >
          <a
            href={buildUrl({ page: 'teachings' }, locale)}
            onClick={handleLinkClick({ page: 'teachings' })}
            aria-current={isTeachingsActive ? 'page' : undefined}
            className={`py-2 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              isTeachingsActive
                ? 'border-[#C8963E] text-[#3E3A35] dark:text-[#EFEAE0] font-medium'
                : 'border-transparent text-[#6C655C] dark:text-[#B6AEA2] hover:text-[#3E3A35] dark:hover:text-[#EFEAE0]'
            }`}
          >
            {t(locale, 'nav.completeTeachings')}
          </a>
          <a
            href={buildUrl({ page: 'cards' }, locale)}
            onClick={handleLinkClick({ page: 'cards' })}
            aria-current={isCardsActive ? 'page' : undefined}
            className={`py-2 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              isCardsActive
                ? 'border-[#C8963E] text-[#3E3A35] dark:text-[#EFEAE0] font-medium'
                : 'border-transparent text-[#6C655C] dark:text-[#B6AEA2] hover:text-[#3E3A35] dark:hover:text-[#EFEAE0]'
            }`}
          >
            {t(locale, 'nav.cardTeachings')}
          </a>
        </nav>

        {/* Zone 3: Language switcher (TH | EN) & theme toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div
            role="group"
            aria-label={t(locale, 'nav.switchLanguage')}
            className="inline-flex items-center text-[15px]"
          >
            {SUPPORTED_LOCALES.map((option, index) => {
              const isActive = option.code === locale;
              return (
                <Fragment key={option.code}>
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="text-[#D4C9B6] dark:text-[#4A433A] select-none px-0.5"
                    >
                      |
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onLocaleChange(option.code)}
                    aria-pressed={isActive}
                    aria-label={`${option.nativeName} (${option.shortLabel})`}
                    className={`min-h-[44px] min-w-[38px] px-2 flex items-center justify-center transition-colors duration-150 whitespace-nowrap shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8963E] cursor-pointer ${
                      isActive
                        ? 'text-[#9A6D1F] dark:text-[#DFB15E] font-semibold underline decoration-[#C8963E] decoration-2 underline-offset-4'
                        : 'text-[#6C655C] dark:text-[#B6AEA2] hover:text-[#3E3A35] dark:hover:text-[#EFEAE0]'
                    }`}
                  >
                    {option.shortLabel}
                  </button>
                </Fragment>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? t(locale, 'nav.lightMode') : t(locale, 'nav.darkMode')}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#6C655C] dark:text-[#B6AEA2] hover:text-[#3E3A35] dark:hover:text-[#EFEAE0] hover:bg-[#F2ECE0]/70 dark:hover:bg-[#2B2722] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8963E] cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-[19px] h-[19px] text-[#DFB15E]" aria-hidden="true" />
            ) : (
              <Moon className="w-[19px] h-[19px]" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
