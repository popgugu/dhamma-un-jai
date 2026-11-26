import { Film } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { LocalizedTextView } from '../components/LocalizedTextView';
import { cardClips, categories, type DharmaGroup } from '../data';
import { t, type Locale } from '../i18n';
import { getRelatedClipsForItem, groupCategoryItems } from '../utils/dharma';
import type { Route } from '../utils/routing';

interface CategoryDetailPageProps {
  categoryId: string;
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
  locale,
  onNavigate,
}: CategoryDetailPageProps) {
  const category = categories.find((cat) => cat.id === categoryId);

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
                  const relatedClips = getRelatedClipsForItem(item, cardClips);

                  return (
                    <article
                      key={item.id}
                      className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF8] dark:bg-[#211E1A] border border-[#E7DFD0] dark:border-[#352F28] shadow-[0_2px_14px_rgba(62,58,53,0.035)] dark:shadow-none"
                    >
                      {/* Top editorial metadata line: item number & optional group label */}
                      <div className="flex items-baseline justify-between gap-4 mb-3">
                        <span className="font-serif text-[16px] font-medium text-[#9A6D1F] dark:text-[#DFB15E] tabular-nums">
                          {item.number}.
                        </span>

                        {section.group && groupTone && (
                          <span className={`text-[14px] font-medium ${groupTone.labelText}`}>
                            {t(locale, 'category.groupPrefix')}:{' '}
                            <LocalizedTextView value={section.group.label} locale={locale} />
                          </span>
                        )}
                      </div>

                      {/* Pali name (Thai script in TH; romanized Pali with diacritics followed by English name in EN) */}
                      <h3 className="font-serif text-[1.25rem] sm:text-[1.375rem] font-medium text-[#3E3A35] dark:text-[#EFEAE0] leading-[1.55]">
                        <LocalizedTextView value={item.pali} locale={locale} />
                      </h3>

                      <p className="mt-1.5 text-[18px] font-medium text-[#524C44] dark:text-[#DDD6CB] leading-[1.75]">
                        <LocalizedTextView value={item.shortMeaning} locale={locale} />
                      </p>

                      {/* Explanation */}
                      <p className="mt-3 text-[17px] text-[#5B554D] dark:text-[#C5BEB3] leading-[1.8]">
                        <LocalizedTextView value={item.explanation} locale={locale} />
                      </p>

                      {/* Related clips */}
                      <div className="mt-5 pt-4 border-t border-[#EFE9DC] dark:border-[#302B25]">
                        {relatedClips.length === 0 ? (
                          <div className="inline-flex items-center gap-2 text-[14px] text-[#7A7267] dark:text-[#9E968B]">
                            <Film className="w-4 h-4 opacity-70 shrink-0" aria-hidden="true" />
                            <span>{t(locale, 'category.noClipYet')}</span>
                          </div>
                        ) : (
                          <div>
                            <p className="text-[14px] text-[#6C655C] dark:text-[#B6AEA2] mb-2">
                              {t(locale, 'category.relatedClips')}
                            </p>
                            <ul className="space-y-1.5">
                              {relatedClips.map((clip) => (
                                <li
                                  key={clip.clipNo}
                                  className="text-[15px] text-[#3E3A35] dark:text-[#EFEAE0] flex items-baseline gap-2"
                                >
                                  <span className="text-[#9A6D1F] dark:text-[#DFB15E] tabular-nums shrink-0">
                                    {t(locale, 'cards.clipNumberPrefix')} {clip.clipNo}
                                  </span>
                                  <span aria-hidden="true" className="text-[#C8963E]/50">
                                    ·
                                  </span>
                                  <LocalizedTextView value={clip.title} locale={locale} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
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
        </section>
      )}
    </div>
  );
}
