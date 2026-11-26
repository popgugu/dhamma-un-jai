import { Leaf, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { BackButton } from '../components/BackButton';
import { HighlightedText } from '../components/HighlightedText';
import { useContent } from '../content/ContentProvider';
import { getLocalized, t, type Locale } from '../i18n';
import { buildUrl, type Route } from '../utils/routing';
import { createMatchSnippet, searchContent } from '../utils/search';

interface SearchPageProps {
  initialQuery: string;
  locale: Locale;
  onQueryChange: (query: string) => void;
  onNavigate: (route: Route) => void;
}

export function SearchPage({
  initialQuery,
  locale,
  onQueryChange,
  onNavigate,
}: SearchPageProps) {
  const content = useContent();
  const inputRef = useRef<HTMLInputElement>(null);
  const lastSyncedQueryRef = useRef(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Sync only when URL query changes externally (e.g. browser back/forward)
  useEffect(() => {
    if (initialQuery !== lastSyncedQueryRef.current) {
      lastSyncedQueryRef.current = initialQuery;
      setInputValue(initialQuery);
      setDebouncedQuery(initialQuery);
    }
  }, [initialQuery]);

  // Debounce search as user types (~200ms) and sync shareable URL
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
      if (inputValue !== lastSyncedQueryRef.current) {
        lastSyncedQueryRef.current = inputValue;
        onQueryChange(inputValue);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [inputValue, onQueryChange]);

  const trimmedQuery = debouncedQuery.trim();
  const results = useMemo(
    () => searchContent(content, trimmedQuery),
    [content, trimmedQuery]
  );

  const hasQuery = trimmedQuery.length > 0;
  const hasAnyResults =
    results.teachings.length > 0 || results.cardClips.length > 0;

  const handleLinkClick = (target: Route) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    onNavigate(target);
  };

  const handleClear = () => {
    lastSyncedQueryRef.current = '';
    setInputValue('');
    setDebouncedQuery('');
    onQueryChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-3xl mx-auto animate-gentle-fade">
      <div className="mb-6">
        <BackButton locale={locale} to={{ page: 'home' }} onNavigate={onNavigate} />
      </div>

      <header className="mb-7">
        <h1 className="font-serif text-3xl sm:text-[2.25rem] font-medium text-[#3E3A35] dark:text-[#EFEAE0] leading-[1.35]">
          {t(locale, 'search.title')}
        </h1>
      </header>

      {/* Soft rounded search input with gold focus ring */}
      <div className="relative mb-10">
        <label htmlFor="dharma-search-input" className="sr-only">
          {t(locale, 'search.inputLabel')}
        </label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9A6D1F]/80 dark:text-[#DFB15E]/80"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id="dharma-search-input"
          type="text"
          inputMode="search"
          role="searchbox"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t(locale, 'search.placeholder')}
          autoComplete="off"
          spellCheck={false}
          className="w-full min-h-[52px] pl-12 pr-12 py-3 rounded-2xl bg-[#FFFDF8] dark:bg-[#211E1A] border border-[#E7DFD0] dark:border-[#352F28] text-[17px] text-[#3E3A35] dark:text-[#EFEAE0] placeholder:text-[#8A8277] dark:placeholder:text-[#8E867B] shadow-[0_2px_12px_rgba(62,58,53,0.03)] dark:shadow-none focus:outline-none focus:border-[#C8963E] dark:focus:border-[#DFB15E] focus:ring-2 focus:ring-[#C8963E]/35 dark:focus:ring-[#DFB15E]/35 transition-[border-color,box-shadow] duration-150"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={t(locale, 'search.clear')}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#6C655C] dark:text-[#B6AEA2] hover:text-[#3E3A35] dark:hover:text-[#EFEAE0] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Empty results state */}
      {hasQuery && !hasAnyResults && (
        <section
          aria-live="polite"
          className="px-6 py-12 rounded-2xl bg-[#FFFDF8] dark:bg-[#211E1A] border border-[#E7DFD0] dark:border-[#352F28] text-center"
        >
          <p className="font-serif text-lg sm:text-xl text-[#5B554D] dark:text-[#C5BEB3] leading-[1.7]">
            {t(locale, 'search.emptyState', { q: trimmedQuery })}
          </p>
        </section>
      )}

      {/* Results: 1. Complete Teachings, 2. Teachings from the Cards */}
      {hasQuery && hasAnyResults && (
        <div className="space-y-12" aria-live="polite">
          {results.teachings.length > 0 && (
            <section aria-labelledby="search-teachings-heading">
              <div className="flex items-center gap-4 mb-5">
                <h2
                  id="search-teachings-heading"
                  className="font-serif text-xl font-medium text-[#9A6D1F] dark:text-[#DFB15E] whitespace-nowrap"
                >
                  {t(locale, 'search.completeSection')}
                </h2>
                <div
                  className="h-px flex-1 bg-[#C8963E]/30 dark:bg-[#DFB15E]/25"
                  aria-hidden="true"
                />
              </div>

              <div className="space-y-4">
                {results.teachings.map(({ category, item, matchedOnlyInExample }) => {
                  const catName = getLocalized(category.name, locale);
                  const pali = getLocalized(item.pali, locale);
                  const meaning = getLocalized(item.shortMeaning, locale);
                  const example = item.example
                    ? getLocalized(item.example, locale)
                    : null;
                  const targetRoute: Route = {
                    page: 'category',
                    categoryId: category.id,
                    itemId: item.id,
                  };

                  return (
                    <a
                      key={item.id}
                      href={buildUrl(targetRoute, locale)}
                      onClick={handleLinkClick(targetRoute)}
                      className="group block p-5 sm:p-6 rounded-2xl bg-[#FFFDF8] dark:bg-[#211E1A] border border-[#E7DFD0] dark:border-[#352F28] shadow-[0_2px_12px_rgba(62,58,53,0.03)] dark:shadow-none hover:border-[#C8963E]/60 dark:hover:border-[#DFB15E]/50 hover:-translate-y-0.5 transition-[transform,border-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8963E]"
                    >
                      <div className="flex items-baseline gap-2 text-[14px] text-[#6C655C] dark:text-[#B6AEA2]">
                        <span>
                          <HighlightedText text={catName.text} query={trimmedQuery} />
                        </span>
                        <span aria-hidden="true" className="text-[#C8963E]/60">
                          ·
                        </span>
                        <span className="font-serif text-[#9A6D1F] dark:text-[#DFB15E] tabular-nums">
                          {item.number}.
                        </span>
                      </div>

                      <h3 className="mt-1.5 font-serif text-lg sm:text-xl font-medium text-[#3E3A35] dark:text-[#EFEAE0] leading-[1.5]">
                        <HighlightedText text={pali.text} query={trimmedQuery} />
                        {pali.isFallback && (
                          <span className="block text-xs text-[#6C655C] dark:text-[#B6AEA2] italic mt-0.5 font-sans font-normal">
                            {t(locale, 'fallback.shownInThai')}
                          </span>
                        )}
                      </h3>

                      <p className="mt-1 text-[16.5px] text-[#524C44] dark:text-[#CFC8BC] leading-[1.75]">
                        <HighlightedText text={meaning.text} query={trimmedQuery} />
                      </p>

                      {matchedOnlyInExample && example && example.text && (
                        <div className="mt-3.5 pt-3 border-t border-[#EFE9DC] dark:border-[#302B25]">
                          <div className="rounded-xl bg-[#F5EFE2]/80 dark:bg-[#2A2621] px-3.5 py-2.5 text-[14.5px] text-[#524C44] dark:text-[#CFC8BC] leading-[1.7]">
                            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#56684C] dark:text-[#99AA8E] mr-2">
                              <Leaf className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                              {t(locale, 'search.exampleSnippetPrefix')}:
                            </span>
                            <HighlightedText
                              text={createMatchSnippet(example.text, trimmedQuery)}
                              query={trimmedQuery}
                            />
                          </div>
                        </div>
                      )}
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          {results.cardClips.length > 0 && (
            <section aria-labelledby="search-cards-heading">
              <div className="flex items-center gap-4 mb-5">
                <h2
                  id="search-cards-heading"
                  className="font-serif text-xl font-medium text-[#56684C] dark:text-[#99AA8E] whitespace-nowrap"
                >
                  {t(locale, 'search.cardsSection')}
                </h2>
                <div
                  className="h-px flex-1 bg-[#7A8B6F]/30 dark:bg-[#99AA8E]/25"
                  aria-hidden="true"
                />
              </div>

              <div className="space-y-3">
                {results.cardClips.map(({ clip }) => {
                  const clipTitle = getLocalized(clip.title, locale);
                  const clipCategory = clip.category.th
                    ? getLocalized(clip.category, locale)
                    : null;
                  const clipQuote = clip.quote
                    ? getLocalized(clip.quote, locale)
                    : null;
                  const targetRoute: Route = { page: 'cards' };

                  return (
                    <a
                      key={clip.clipNo}
                      href={buildUrl(targetRoute, locale)}
                      onClick={handleLinkClick(targetRoute)}
                      className="group block p-5 sm:p-6 rounded-2xl bg-[#FFFDF8] dark:bg-[#211E1A] border border-[#E7DFD0] dark:border-[#352F28] shadow-[0_2px_12px_rgba(62,58,53,0.03)] dark:shadow-none hover:border-[#7A8B6F]/70 dark:hover:border-[#99AA8E]/60 hover:-translate-y-0.5 transition-[transform,border-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8963E]"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2 text-[14px]">
                        <div className="flex items-baseline gap-2 text-[#6C655C] dark:text-[#B6AEA2]">
                          <span className="text-[#9A6D1F] dark:text-[#DFB15E] tabular-nums">
                            {t(locale, 'cards.clipNumberPrefix')}{' '}
                            <HighlightedText text={clip.clipNo} query={trimmedQuery} />
                          </span>
                          {clipCategory && clipCategory.text && (
                            <>
                              <span aria-hidden="true" className="text-[#7A8B6F]/50">
                                ·
                              </span>
                              <span className="text-[#56684C] dark:text-[#99AA8E]">
                                <HighlightedText
                                  text={clipCategory.text}
                                  query={trimmedQuery}
                                />
                              </span>
                            </>
                          )}
                        </div>
                        {clip.date && (
                          <time
                            dateTime={clip.date}
                            className="text-[#6C655C] dark:text-[#B6AEA2] tabular-nums"
                          >
                            {clip.date}
                          </time>
                        )}
                      </div>

                      <h3 className="mt-1.5 font-serif text-lg font-medium text-[#3E3A35] dark:text-[#EFEAE0]">
                        <HighlightedText text={clipTitle.text} query={trimmedQuery} />
                        {clipTitle.isFallback && (
                          <span className="block text-xs text-[#6C655C] dark:text-[#B6AEA2] italic mt-0.5 font-sans font-normal">
                            {t(locale, 'fallback.shownInThai')}
                          </span>
                        )}
                      </h3>

                      {clipQuote && clipQuote.text && (
                        <p className="mt-2 font-serif text-[16px] leading-[1.75] text-[#6C655C] dark:text-[#B6AEA2]">
                          “
                          <HighlightedText
                            text={createMatchSnippet(clipQuote.text, trimmedQuery)}
                            query={trimmedQuery}
                          />
                          ”
                        </p>
                      )}
                    </a>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
