/**
 * Central locale definition.
 * To add a new language (e.g. "zh"):
 * 1. Add "zh" to the Locale union type below.
 * 2. Append an entry to SUPPORTED_LOCALES.
 * 3. Add a dictionary file in src/i18n/zh.ts and register it in src/i18n/index.ts.
 * 4. Add optional "zh" fields to content items in src/data.ts.
 */
export type Locale = 'th' | 'en';

export const DEFAULT_LOCALE: Locale = 'th';

export interface LocaleOption {
  code: Locale;
  shortLabel: string;
  nativeName: string;
}

export const SUPPORTED_LOCALES: readonly LocaleOption[] = [
  { code: 'th', shortLabel: 'TH', nativeName: 'ไทย' },
  { code: 'en', shortLabel: 'EN', nativeName: 'English' },
] as const;

/**
 * Every translatable content field uses this shape.
 * Thai ("th") is the canonical base text; additional locales are optional so
 * missing translations fall back cleanly to Thai with a subtle notice.
 */
export type LocalizedText = { th: string } & Partial<Record<Exclude<Locale, 'th'>, string>>;

export interface Dictionary {
  site: {
    title: string;
    subtitle: string;
    welcome: string;
    footer: string;
  };
  nav: {
    home: string;
    completeTeachings: string;
    cardTeachings: string;
    back: string;
    switchLanguage: string;
    darkMode: string;
    lightMode: string;
  };
  home: {
    completeTitle: string;
    completeDescription: string;
    cardsTitle: string;
    cardsDescription: string;
    categoriesCount: string;
    teachingsCount: string;
    comingSoonShort: string;
    clipsCount: string;
    openSection: string;
  };
  teachings: {
    title: string;
    description: string;
    itemCount: string;
    clipProgress: string;
    viewCategory: string;
  };
  category: {
    translationNote: string;
    groupPrefix: string;
    relatedClips: string;
    noClipYet: string;
    sources: string;
    notFound: string;
    backToList: string;
  };
  cards: {
    title: string;
    description: string;
    emptyState: string;
    clipNumberPrefix: string;
    uncategorized: string;
  };
  fallback: {
    shownInThai: string;
  };
}
