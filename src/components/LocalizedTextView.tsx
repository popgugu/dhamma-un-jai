import { getLocalized, t, type Locale, type LocalizedText } from '../i18n';

interface LocalizedTextViewProps {
  value: LocalizedText;
  locale: Locale;
  className?: string;
  noteClassName?: string;
}

export function LocalizedTextView({
  value,
  locale,
  className,
  noteClassName = 'block text-xs text-[#6C655C] dark:text-[#B6AEA2] italic mt-0.5 font-sans font-normal',
}: LocalizedTextViewProps) {
  const { text, isFallback } = getLocalized(value, locale);

  return (
    <span className={className}>
      {text}
      {isFallback && (
        <span className={noteClassName}>{t(locale, 'fallback.shownInThai')}</span>
      )}
    </span>
  );
}
