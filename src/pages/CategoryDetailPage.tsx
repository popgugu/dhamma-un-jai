import { Leaf } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BackButton } from '../components/BackButton';
import { LocalizedTextView } from '../components/LocalizedTextView';
import { useContent } from '../content/ContentProvider';
import type { DharmaGroup } from '../data';
import { getLocalized, t, type Locale } from '../i18n';
import { groupCategoryItems } from '../utils/dharma';
import type { Route } from '../utils/routing';

interface CategoryDetailPageProps {
  categoryId: string;
  highlightItemId?: string;
  locale: Locale;
  onNavigate: (route: Route) => void;
}

function getGroupToneClasses(tone: DharmaGroup['tone']): {
  headerText: string;
  labelText: string;
  rule: string;
} {
  switch (tone) {
    case 'saffron':
      return {
        headerText: 'text-[#9A6D1F] dark:text-[#DFB15E]',
        labelText: 'text-[#9A6D1F] dark:text-[#DFB15E]',
        rule: 'bg-[#C8963E]/30 dark:bg-[#DFB15E]/25',
      };
    case 'sage':
      return {
        headerText: 'text-[#56684C] dark:text-[#99AA8E]',
        labelText: 'text-[#56684C] dark:text-[#99AA8E]',
        rule: 'bg-[#7A8B6F]/35 dark:bg-[#99AA8E]/30',
      };
    case 'stone':
    default:
      return {
        headerText: 'text-[#6C655C] dark:text-[#C5BEB3]',
        labelText: 'text-[#6C655C] dark:text-[#B6AEA2]',
        rule: 'bg-[#A69C8E]/35 dark:bg-[#8E867B]/30',
      };
  }
}

export function CategoryDetailPage({
  categoryId,
  highlightItemId,
  locale,
  onNavigate,
}: CategoryDetailPageProps) {
  const { categories } = useContent();
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);

  const category = categories.find((cat) => cat.id === categoryId);

  useEffect(() => {
    if (!highlightItemId || !category) return;

    let clearTimer: ReturnType<typeof setTimeout> | undefined;
    const raf = requestAnimationFrame(() => {
      const target = document.getElementById(highlightItemId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setActiveHighlightId(highlightItemId);
        clearTimer = setTimeout(() => {
          setActiveHighlightId((prev) =>
            prev === highlightItemId ? null : prev
          );
        }, 2200);
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      if (clearTimer) clearTimeout(clearTimer);
    };
  }, [highlightItemId, category]);

  if (!category) {
    return (
      <div className="max-w-3xl mx-auto animate-gentle-fade">
        <div className="mb-6">
          <BackButton
            locale={locale}
            to={{ page: 'teachings' }}
            onNavigate={onNavigate}
          />
        </div>
        <div className="p-10 rounded-2xl bg-[#FFFDF8] dark:bg-[#211E1A] border border-[#E7DFD0] dark:border-[#352F28] text-center">
          <p className="text-[18px] text-[#5B554D] dark:text-[#C5BEB3]">
            {t(locale, 'category.notFound')}
          </p>
        </div>
      </div>
    );
  }

  const sections = groupCategoryItems(category);
  const translationNote = t(locale, 'category.translationNote');

  return (
    <div className="max-w-3xl mx-auto animate-gentle-fade">
      <div className="mb-6">
        <BackButton
          locale={locale}
          to={{ page: 'teachings' }}
          onNavigate={onNavigate}
        />
      </div>

      {/* Category header */}
      <header className="mb-10 sm:mb-12">
        <h1 className="font-serif text-[1.85rem] sm:text-[2.35rem] font-medium text-[#3E3A35] dark:text-[#EFEAE0] leading-[1.35]">
          <LocalizedTextView value={category.name} locale={locale} />
        </h1>

        <p className="mt-4 text-[18px] text-[#5B554D] dark:text-[#C5BEB3] leading-[1.8]">
          <LocalizedTextView value={category.intro} locale={locale} />
        </p>

        {translationNote && (
          <p className="mt-3 text-[14px] italic text-[#6C655C] dark:text-[#B6AEA2]">
            {translationNote}
          </p>
        )}
      </header>

      {/* Teaching items, grouped softly when the category defines groups */}
      <div className="space-y-10">
        {sections.map((section, sectionIndex) => {
          const groupTone = section.group
            ? getGroupToneClasses(section.group.tone)
            : null;

          return (
            <section
              key={section.group?.id ?? `section-${sectionIndex}`}
              aria-labelledby={
                section.group ? `group-heading-${section.group.id}` : undefined
              }
            >
              {section.group && groupTone && (
                <div className="flex items-center gap-4 mb-5 pt-2">
                  <h2
                    id={`group-heading-${section.group.id}`}
                    className={`font-serif text-lg sm:text-xl font-medium whitespace-nowrap ${groupTone.headerText}`}
                  >
                    <LocalizedTextView value={section.group.header} locale={locale} />
                  </h2>
                  <div className={`h-px flex-1 ${groupTone.rule}`} aria-hidden="true" />
                </div>
              )}

              <div className="space-y-5">
                {section.items.map((item) => {
                  const hasExample =
                    item.example !== undefined &&
                    getLocalized(item.example, locale).text.trim().length > 0;
                  const isHighlighted = activeHighlightId === item.id;

                  return (
                    <article
                      key={item.id}
                      id={item.id}
                      className={`scroll-mt-24 p-6 sm:p-8 rounded-2xl border shadow-[0_2px_14px_rgba(62,58,53,0.035)] dark:shadow-none transition-[border-color,box-shadow,background-color] duration-500 ${
                        isHighlighted
                          ? 'bg-[#FBF4E4] dark:bg-[#2B251B] border-[#C8963E] dark:border-[#DFB15E] ring-2 ring-[#C8963E]/35 dark:ring-[#DFB15E]/35'
                          : 'bg-[#FFFDF8] dark:bg-[#211E1A] border-[#E7DFD0] dark:border-[#352F28]'
                      }`}
                    >
                      {/* Pali name with inline number prefix & optional group label */}
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="font-serif text-[1.25rem] sm:text-[1.375rem] font-medium text-[#3E3A35] dark:text-[#EFEAE0] leading-[1.55]">
                          <span className="text-[#9A6D1F] dark:text-[#DFB15E] tabular-nums">
                            {item.number}.
                          </span>{' '}
                          <LocalizedTextView value={item.pali} locale={locale} />
                        </h3>

                        {section.group && groupTone && (
                          <span className={`text-[14px] font-medium shrink-0 ${groupTone.labelText}`}>
                            {t(locale, 'category.groupPrefix')}:{' '}
                            <LocalizedTextView value={section.group.label} locale={locale} />
                          </span>
                        )}
                      </div>

                      <p className="mt-1.5 text-[18px] font-medium text-[#524C44] dark:text-[#DDD6CB] leading-[1.75]">
                        <LocalizedTextView value={item.shortMeaning} locale={locale} />
                      </p>

                      {/* Explanation */}
                      <p className="mt-3 text-[17px] text-[#5B554D] dark:text-[#C5BEB3] leading-[1.8]">
                        <LocalizedTextView value={item.explanation} locale={locale} />
                      </p>

                      {/* Everyday example (shown only if present) */}
                      {hasExample && item.example && (
                        <div className="mt-5 pt-4 border-t border-[#EFE9DC] dark:border-[#302B25]">
                          <div className="rounded-xl bg-[#F5EFE2]/80 dark:bg-[#2A2621] px-4 py-3.5">
                            <div className="flex items-center gap-2 text-[14px] font-medium text-[#56684C] dark:text-[#99AA8E]">
                              <Leaf className="w-4 h-4 shrink-0" aria-hidden="true" />
                              <span>{t(locale, 'category.exampleLabel')}</span>
                            </div>
                            <p className="mt-1.5 text-[15.5px] text-[#524C44] dark:text-[#CFC8BC] leading-[1.75]">
                              <LocalizedTextView value={item.example} locale={locale} />
                            </p>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Sources */}
      {category.sources.length > 0 && (
        <section
          aria-labelledby="category-sources-heading"
          className="mt-14 pt-8 border-t border-[#E7DFD0] dark:border-[#36312A]"
        >
          <h2
            id="category-sources-heading"
            className="font-serif text-lg font-medium text-[#3E3A35] dark:text-[#EFEAE0] mb-4"
          >
            {t(locale, 'category.sources')}
          </h2>
          <ul className="space-y-2.5 text-[15px] text-[#5B554D] dark:text-[#B6AEA2] leading-[1.8]">
            {category.sources.map((source) => (
              <li key={source.id} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="text-[#C8963E] dark:text-[#DFB15E] select-none"
                >
                  —
                </span>
                <LocalizedTextView value={source.text} locale={locale} />
              </li>
            ))}
          </ul>

          <p className="mt-5 text-[13.5px] text-[#7A7267] dark:text-[#9E968B] leading-[1.7]">
            {t(locale, 'category.exampleDisclaimer')}
          </p>
        </section>
      )}
    </div>
  );
}
