import { BackButton } from '../components/BackButton';
import { LocalizedTextView } from '../components/LocalizedTextView';
import { LotusIcon } from '../components/LotusIcon';
import { cardClips, categories } from '../data';
import { t, type Locale } from '../i18n';
import { groupCardClipsByCategory } from '../utils/dharma';
import type { Route } from '../utils/routing';

interface CardTeachingsPageProps {
  locale: Locale;
  onNavigate: (route: Route) => void;
}

export function CardTeachingsPage({
  locale,
  onNavigate,
}: CardTeachingsPageProps) {
  const groupedClips = groupCardClipsByCategory(cardClips, categories);

  return (
    <div className="max-w-3xl mx-auto animate-gentle-fade">
      <div className="mb-6">
        <BackButton locale={locale} to={{ page: 'home' }} onNavigate={onNavigate} />
      </div>

      <header className="mb-10">
        <h1 className="font-serif text-3xl sm:text-[2.25rem] font-medium text-[#3E3A35] dark:text-[#EFEAE0] leading-[1.35]">
          {t(locale, 'cards.title')}
        </h1>
        <p className="mt-3 text-[17px] text-[#5B554D] dark:text-[#C5BEB3] leading-[1.8]">
          {t(locale, 'cards.description')}
        </p>
      </header>

      {groupedClips.length === 0 ? (
        <section
          aria-live="polite"
          className="px-6 py-14 sm:px-12 sm:py-20 rounded-2xl bg-[#FFFDF8] dark:bg-[#211E1A] border border-[#E7DFD0] dark:border-[#352F28] shadow-[0_3px_16px_rgba(62,58,53,0.03)] dark:shadow-none text-center"
        >
          <div className="inline-flex items-center justify-center mb-5">
            <LotusIcon className="w-11 h-11 text-[#7A8B6F] dark:text-[#99AA8E]" />
          </div>
          <p className="font-serif text-xl sm:text-[1.35rem] text-[#3E3A35] dark:text-[#EFEAE0] leading-[1.7] max-w-lg mx-auto">
            {t(locale, 'cards.emptyState')}
          </p>
        </section>
      ) : (
        <div className="space-y-10">
          {groupedClips.map((group) => (
            <section key={group.categoryId} className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="font-serif text-xl font-medium text-[#56684C] dark:text-[#99AA8E] whitespace-nowrap">
                  {group.category ? (
                    <LocalizedTextView value={group.category.name} locale={locale} />
                  ) : (
                    t(locale, 'cards.uncategorized')
                  )}
                </h2>
                <div
                  className="h-px flex-1 bg-[#7A8B6F]/30 dark:bg-[#99AA8E]/25"
                  aria-hidden="true"
                />
              </div>

              <div className="space-y-3">
                {group.clips.map((clip) => (
                  <article
                    key={clip.clipNo}
                    className="p-5 sm:p-6 rounded-2xl bg-[#FFFDF8] dark:bg-[#211E1A] border border-[#E7DFD0] dark:border-[#352F28] flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6"
                  >
                    <div className="min-w-0">
                      <div className="text-[14px] text-[#9A6D1F] dark:text-[#DFB15E] tabular-nums">
                        {t(locale, 'cards.clipNumberPrefix')} {clip.clipNo}
                      </div>
                      <h3 className="mt-1 font-serif text-lg font-medium text-[#3E3A35] dark:text-[#EFEAE0]">
                        <LocalizedTextView value={clip.title} locale={locale} />
                      </h3>
                    </div>
                    <time
                      dateTime={clip.date}
                      className="text-[14px] text-[#6C655C] dark:text-[#B6AEA2] tabular-nums whitespace-nowrap shrink-0"
                    >
                      {clip.date}
                    </time>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
