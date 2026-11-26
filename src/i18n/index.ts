import { en } from './en';
import { th } from './th';
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type Dictionary,
  type Locale,
  type LocalizedText,
} from './types';

export { DEFAULT_LOCALE, SUPPORTED_LOCALES };
export type { Dictionary, Locale, LocaleOption, LocalizedText } from './types';

const LOCALE_STORAGE_KEY = 'dhamma-un-jai-locale';

const dictionaries: Record<Locale, Dictionary> = {
  th,
  en,
};

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  if (!value) return false;
  return SUPPORTED_LOCALES.some((loc) => loc.code === value);
}

type NestedKeyOf<T> = {
  [K in keyof T & string]: T[K] extends Record<string, string>
    ? `${K}.${keyof T[K] & string}`
    : never;
}[keyof T & string];

export type TranslationKey = NestedKeyOf<Dictionary>;

/**
 * Look up a UI string by dot-path key (e.g. "teachings.clipProgress") with
 * optional {key} placeholder interpolation and fallback to Thai.
 */
export function t(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const [section, field] = key.split('.') as [keyof Dictionary, string];
  const currentDict = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
  const fallbackDict = dictionaries[DEFAULT_LOCALE];

  const sectionObj = currentDict[section] as Record<string, string> | undefined;
  const fallbackSectionObj = fallbackDict[section] as Record<string, string> | undefined;

  let template = sectionObj?.[field];
  if (template === undefined) {
    template = fallbackSectionObj?.[field] ?? key;
  }

  if (!params) return template;

  return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
    return acc.replaceAll(`{${paramKey}}`, String(paramValue));
  }, template);
}

export interface LocalizedResult {
  text: string;
  isFallback: boolean;
}

/**
 * Resolve a LocalizedText content object for the requested locale.
 * Never returns blank: falls back to Thai text and sets isFallback = true
 * when the current locale's translation is missing or empty.
 */
export function getLocalized(field: LocalizedText, locale: Locale): LocalizedResult {
  const value = field[locale];
  if (typeof value === 'string' && value.trim().length > 0) {
    return { text: value, isFallback: false };
  }
  return {
    text: field.th,
    isFallback: locale !== 'th',
  };
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/**
 * Resolve initial locale with strict precedence:
 * 1. URL query parameter (?lang=...)
 * 2. Saved localStorage preference (safely wrapped in try/catch)
 * 3. DEFAULT_LOCALE ("th")
 */
export function resolveInitialLocale(
  search: string,
  storage?: StorageLike | null
): Locale {
  const params = new URLSearchParams(search);
  const urlLang = params.get('lang')?.trim().toLowerCase();
  if (isSupportedLocale(urlLang)) {
    return urlLang;
  }

  const targetStorage =
    storage !== undefined
      ? storage
      : typeof window !== 'undefined'
        ? window.localStorage
        : null;

  if (targetStorage) {
    try {
      const saved = targetStorage.getItem(LOCALE_STORAGE_KEY)?.trim().toLowerCase();
      if (isSupportedLocale(saved)) {
        return saved;
      }
    } catch {
      // Ignore storage access errors (e.g. restricted iframe or private browsing)
    }
  }

  return DEFAULT_LOCALE;
}

export function saveLocale(locale: Locale, storage?: StorageLike | null): void {
  const targetStorage =
    storage !== undefined
      ? storage
      : typeof window !== 'undefined'
        ? window.localStorage
        : null;

  if (!targetStorage) return;

  try {
    targetStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Ignore storage write errors
  }
}
