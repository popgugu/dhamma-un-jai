import { PlayCircle } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { LocalizedTextView } from '../components/LocalizedTextView';
import { LotusIcon } from '../components/LotusIcon';
import { useContent } from '../content/ContentProvider';
import { CHANNEL_LINKS } from '../content/links';
import { getLocalized, t, type Locale } from '../i18n';
import { groupCardClipsByCategory } from '../utils/dharma';
import type { Route } from '../utils/routing';

function YouTubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-[18px] h-[18px]"
      aria-hidden="true"
    >
      <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42a2.5 2.5 0 0 0-1.76 1.77C2 8.76 2 12 2 12s0 3.24.42 4.81a2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77C22 15.24 22 12 22 12s0-3.24-.42-4.81ZM10 15.1V8.9l5.2 3.1-5.2 3.1Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-[17px] h-[17px]"
      aria-hidden="true"
    >
      <path d="M13.5 21v-7.7h2.6l.4-3h-3V8.4c0-.87.24-1.46 1.49-1.46H16.6V4.25c-.28-.04-1.24-.12-2.36-.12-2.33 0-3.93 1.42-3.93 4.04v2.13H7.7v3h2.61V21h3.19Z" />
    </svg>
  );
}

function getSafeExternalUrl(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return trimmed;
  }
  return '';
}

interface CardTeachingsPageProps {
  locale: Locale;
  onNavigate: (route: Route) => void;
}

export function CardTeachingsPage({
  locale,
  onNavigate,
}: CardTeachingsPageProps) {
  const { cardClips } = useContent();
  const groupedClips = groupCardClipsByCategory(cardClips);
  const youtubeUrl = getSafeExternalUrl(CHANNEL_LINKS.youtube);
  const facebookUrl = getSafeExternalUrl(CHANNEL_LINKS.facebook);
  const hasChannelLinks = Boolean(youtubeUrl || facebookUrl);

  return (
    <div className="max-w-3xl mx-auto animate-gentle-fade">
      <div className="mb-6">
        <BackButton locale={locale} to={{ page: 'home' }} onNavigate={onNavigate} />
      </div>

      <header className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <h1 className="font-serif text-3xl sm:text-[2.25rem] font-medium text-[#3E3A35] dark:text-[#EFEAE0] leading-[1.35]">
            {t(locale, 'cards.title')}
          </h1>

          {hasChannelLinks && (
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="text-[14px] text-[#6C655C] dark:text-[#B6AEA2] whitespace-nowrap">
                {t(locale, 'cards.followChannel')}
              </span>
              <div className="flex items-center gap-2">
                {youtubeUrl && (
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t(locale, 'cards.youtubeAria')}
                    className="w-9 h-9 rounded-full inline-flex items-center justify-center bg-[#FFFDF8] dark:bg-[#211E1A] border border-[#E7DFD0] dark:border-[#352F28] text-[#6C655C] dark:text-[#B6AEA2] hover:text-[#C8963E] dark:hover:text-[#C8963E] hover:border-[#C8963E]/60 dark:hover:border-[#C8963E]/60 focus-visible:text-[#C8963E] dark:focus-visible:text-[#C8963E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8963E] transition-colors duration-150"
                  >
                    <YouTubeIcon />
                  </a>
                )}
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t(locale, 'cards.facebookAria')}
                    className="w-9 h-9 rounded-full inline-flex items-center justify-center bg-[#FFFDF8] dark:bg-[#211E1A] border border-[#E7DFD0] dark:border-[#352F28] text-[#6C655C] dark:text-[#B6AEA2] hover:text-[#C8963E] dark:hover:text-[#C8963E] hover:border-[#C8963E]/60 dark:hover:border-[#C8963E]/60 focus-visible:text-[#C8963E] dark:focus-visible:text-[#C8963E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8963E] transition-colors duration-150"
                  >
                    <FacebookIcon />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
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
          {groupedClips.map((group, groupIndex) => (
            <section
              key={group.key || `uncategorized-${groupIndex}`}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <h2 className="font-serif text-xl font-medium text-[#56684C] dark:text-[#99AA8E] whitespace-nowrap">
                  {group.key ? (
                    <LocalizedTextView value={group.category} locale={locale} />
                  ) : (
                    t(locale, 'cards.uncategorized')
                  )}
                </h2>
                <div
                  className="h-px flex-1 bg-[#7A8B6F]/30 dark:bg-[#99AA8E]/25"
                  aria-hidden="true"
                />
              </div>

              <div className="space-y-4">
                {group.clips.map((clip) => {
                  const quoteResult = clip.quote
                    ? getLocalized(clip.quote, locale)
                    : null;

                  return (
                    <article
                      key={clip.clipNo}
                      className="p-5 sm:p-6 rounded-2xl bg-[#FFFDF8] dark:bg-[#211E1A] border border-[#E7DFD0] dark:border-[#352F28] shadow-[0_2px_12px_rgba(62,58,53,0.03)] dark:shadow-none"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <div className="text-[14px] text-[#9A6D1F] dark:text-[#DFB15E] tabular-nums">
                          {t(locale, 'cards.clipNumberPrefix')} {clip.clipNo}
                        </div>
                        {clip.date && (
                          <time
                            dateTime={clip.date}
                            className="text-[14px] text-[#6C655C] dark:text-[#B6AEA2] tabular-nums whitespace-nowrap shrink-0"
                          >
                            {clip.date}
                          </time>
                        )}
                      </div>

                      <h3 className="mt-1 font-serif text-lg font-medium text-[#3E3A35] dark:text-[#EFEAE0] leading-[1.55]">
                        <LocalizedTextView value={clip.title} locale={locale} />
                      </h3>

                      {quoteResult && quoteResult.text && (
                        <blockquote className="mt-3.5 font-serif text-[18px] sm:text-[19px] leading-[1.85] text-[#6C655C] dark:text-[#B6AEA2]">
                          <p>“{quoteResult.text}”</p>
                          {quoteResult.isFallback && (
                            <span className="block text-xs text-[#6C655C] dark:text-[#B6AEA2] italic mt-1 font-sans font-normal">
                              {t(locale, 'fallback.shownInThai')}
                            </span>
                          )}
                        </blockquote>
                      )}

                      {clip.youtubeUrl && (
                        <div className="mt-4 flex justify-end">
                          <a
                            href={clip.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 -mr-1.5 rounded-xl text-[15px] font-medium text-[#9A6D1F] dark:text-[#DFB15E] hover:bg-[#FAF3E4]/80 dark:hover:bg-[#2F2920]/70 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8963E] whitespace-nowrap shrink-0"
                          >
                            <PlayCircle
                              className="w-[18px] h-[18px] shrink-0"
                              aria-hidden="true"
                            />
                            <span>{t(locale, 'cards.watchClip')}</span>
                          </a>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
