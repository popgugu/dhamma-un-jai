import { ChevronRight } from 'lucide-react';
import type { MouseEvent } from 'react';
import { BackButton } from '../components/BackButton';
import { LocalizedTextView } from '../components/LocalizedTextView';
import { useContent } from '../content/ContentProvider';
import { t, type Locale } from '../i18n';
import { buildUrl, type Route } from '../utils/routing';

interface CompleteTeachingsPageProps {
  locale: Locale;
  onNavigate: (route: Route) => void;
}

export function CompleteTeachingsPage({
  locale,
  onNavigate,
}: CompleteTeachingsPageProps) {
  const { categories } = useContent();

  const handleCategoryClick = (categoryId: string) => (
    e: MouseEvent<HTMLAnchorElement>
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    onNavigate({ page: 'category', categoryId });
  };

  return (
    <div className="max-w-3xl mx-auto animate-gentle-fade">
      <div className="mb-6">
        <BackButton locale={locale} to={{ page: 'home' }} onNavigate={onNavigate} />
      </div>

      <header className="mb-8">
        <h1 className="font-serif text-3xl sm:text-[2.25rem] font-medium text-[#3E3A35] dark:text-[#EFEAE0] leading-[1.35]">
          {t(locale, 'teachings.title')}
        </h1>
        <p className="mt-2.5 text-[17px] text-[#5B554D] dark:text-[#C5BEB3] leading-[1.8]">
          {t(locale, 'teachings.description')}
        </p>
      </header>

      <div className="space-y-4 sm:space-y-5">
        {categories.map((category, index) => {
          const href = buildUrl({ page: 'category', categoryId: category.id }, locale);

          return (
            <a
              key={category.id}
              href={href}
              onClick={handleCategoryClick(category.id)}
              className="group block p-6 sm:p-7 rounded-2xl bg-[#FFFDF8] dark:bg-[#211E1A] border border-[#E7DFD0] dark:border-[#352F28] shadow-[0_3px_16px_rgba(62,58,53,0.035)] dark:shadow-none hover:border-[#C8963E]/60 dark:hover:border-[#DFB15E]/50 hover:-translate-y-0.5 transition-[transform,border-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8963E]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-sm text-[#9A6D1F] dark:text-[#DFB15E] tabular-nums shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#3E3A35] dark:text-[#EFEAE0] leading-[1.45]">
                      <LocalizedTextView value={category.name} locale={locale} />
                    </h2>
                  </div>

                  <p className="mt-2.5 sm:pl-7 text-[17px] text-[#5B554D] dark:text-[#C5BEB3] leading-[1.8]">
                    <LocalizedTextView value={category.intro} locale={locale} />
                  </p>
                </div>

                <ChevronRight
                  className="w-5 h-5 mt-1.5 text-[#9A6D1F]/70 dark:text-[#DFB15E]/70 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </div>

              <div className="mt-5 sm:pl-7 text-[15px] text-[#6C655C] dark:text-[#B6AEA2] tabular-nums">
                {t(locale, 'teachings.itemCount', { N: category.items.length })}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
