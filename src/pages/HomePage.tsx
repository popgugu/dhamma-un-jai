import { ArrowRight, BookOpen, Layers } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useContent } from '../content/ContentProvider';
import { t, type Locale } from '../i18n';
import { buildUrl, type Route } from '../utils/routing';
import { LotusIcon } from '../components/LotusIcon';

interface HomePageProps {
  locale: Locale;
  onNavigate: (route: Route) => void;
}

export function HomePage({ locale, onNavigate }: HomePageProps) {
  const { categories, cardClips } = useContent();
  const totalTeachings = categories.reduce((sum, cat) => sum + cat.items.length, 0);

  const handleCardClick = (target: Route) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    onNavigate(target);
  };

  return (
    <div className="animate-gentle-fade">
      {/* Dawn courtyard hero */}
      <section className="max-w-3xl mx-auto pt-12 sm:pt-20 pb-12 sm:pb-16 text-center">
        <div className="inline-flex items-center justify-center mb-6">
          <LotusIcon className="w-14 h-14 sm:w-16 sm:h-16 text-[#C8963E] dark:text-[#DFB15E]" />
        </div>

        <h1 className="font-serif text-[2.25rem] sm:text-[3rem] font-medium tracking-tight text-[#3E3A35] dark:text-[#EFEAE0] leading-[1.3]">
          {t(locale, 'site.title')}
        </h1>

        <p className="mt-2 font-serif text-[1.125rem] sm:text-[1.25rem] text-[#9A6D1F] dark:text-[#DFB15E]">
          {t(locale, 'site.subtitle')}
        </p>

        <div
          aria-hidden="true"
          className="w-12 h-px bg-[#C8963E]/45 dark:bg-[#DFB15E]/35 mx-auto my-6"
        />

        <p className="text-[18px] sm:text-[19px] text-[#5B554D] dark:text-[#C5BEB3] leading-[1.8] max-w-xl mx-auto">
          {t(locale, 'site.welcome')}
        </p>
      </section>

      {/* Two large entry cards */}
      <section
        aria-label={t(locale, 'site.title')}
        className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
      >
        <a
          href={buildUrl({ page: 'teachings' }, locale)}
          onClick={handleCardClick({ page: 'teachings' })}
          className="group flex flex-col justify-between p-7 sm:p-9 rounded-2xl bg-[#FFFDF8] dark:bg-[#211E1A] border border-[#E7DFD0] dark:border-[#352F28] shadow-[0_4px_20px_rgba(62,58,53,0.04)] dark:shadow-none hover:border-[#C8963E]/60 dark:hover:border-[#DFB15E]/50 hover:-translate-y-0.5 transition-[transform,border-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8963E]"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-[#FAF3E4] dark:bg-[#2F2920] flex items-center justify-center text-[#9A6D1F] dark:text-[#DFB15E] mb-6">
              <BookOpen className="w-5 h-5" aria-hidden="true" />
            </div>

            <h2 className="font-serif text-2xl sm:text-[1.65rem] font-medium text-[#3E3A35] dark:text-[#EFEAE0] leading-[1.4]">
              {t(locale, 'home.completeTitle')}
            </h2>

            <p className="mt-3 text-[17px] text-[#5B554D] dark:text-[#C5BEB3] leading-[1.8]">
              {t(locale, 'home.completeDescription')}
            </p>
          </div>

          <div className="mt-8 pt-5 border-t border-[#EFE9DC] dark:border-[#302B25] flex items-center justify-between gap-4">
            <span className="text-[15px] text-[#6C655C] dark:text-[#B6AEA2] tabular-nums">
              {t(locale, 'home.categoriesCount', { N: categories.length })}
              <span aria-hidden="true" className="mx-2 text-[#C8963E]/60">
                ·
              </span>
              {t(locale, 'home.teachingsCount', { N: totalTeachings })}
            </span>

            <span className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[#9A6D1F] dark:text-[#DFB15E] whitespace-nowrap shrink-0">
              <span>{t(locale, 'home.openSection')}</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </div>
        </a>

        <a
          href={buildUrl({ page: 'cards' }, locale)}
          onClick={handleCardClick({ page: 'cards' })}
          className="group flex flex-col justify-between p-7 sm:p-9 rounded-2xl bg-[#FFFDF8] dark:bg-[#211E1A] border border-[#E7DFD0] dark:border-[#352F28] shadow-[0_4px_20px_rgba(62,58,53,0.04)] dark:shadow-none hover:border-[#7A8B6F]/70 dark:hover:border-[#99AA8E]/60 hover:-translate-y-0.5 transition-[transform,border-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8963E]"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-[#EEF2EA] dark:bg-[#252B22] flex items-center justify-center text-[#56684C] dark:text-[#99AA8E] mb-6">
              <Layers className="w-5 h-5" aria-hidden="true" />
            </div>

            <h2 className="font-serif text-2xl sm:text-[1.65rem] font-medium text-[#3E3A35] dark:text-[#EFEAE0] leading-[1.4]">
              {t(locale, 'home.cardsTitle')}
            </h2>

            <p className="mt-3 text-[17px] text-[#5B554D] dark:text-[#C5BEB3] leading-[1.8]">
              {t(locale, 'home.cardsDescription')}
            </p>
          </div>

          <div className="mt-8 pt-5 border-t border-[#EFE9DC] dark:border-[#302B25] flex items-center justify-between gap-4">
            <span className="text-[15px] text-[#56684C] dark:text-[#99AA8E] tabular-nums">
              {cardClips.length === 0
                ? t(locale, 'home.comingSoonShort')
                : t(locale, 'home.clipsCount', { N: cardClips.length })}
            </span>

            <span className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[#56684C] dark:text-[#99AA8E] whitespace-nowrap shrink-0">
              <span>{t(locale, 'home.openSection')}</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </div>
        </a>
      </section>
    </div>
  );
}
