import type { ContentData } from '../content/loader';
import type {
  CardClip,
  DharmaCategory,
  DharmaGroup,
  DharmaItem,
} from '../data';
import type { LocalizedText } from '../i18n/types';

export interface TextRange {
  start: number;
  end: number;
}

export interface TeachingSearchResult {
  category: DharmaCategory;
  item: DharmaItem;
  group: DharmaGroup | null;
  matchedOnlyInExample: boolean;
}

export interface CardClipSearchResult {
  clip: CardClip;
}

export interface SearchResults {
  teachings: TeachingSearchResult[];
  cardClips: CardClipSearchResult[];
}

const COMBINING_DIACRITICS_RE = /[\u0300-\u036f]/g;
const IGNORED_PUNCTUATION_OR_SPACE_RE = /[-\u2010-\u2015\s]/;

/**
 * Normalize text for bilingual and Pali diacritic-insensitive matching:
 * - NFD decompose and strip Latin combining diacritical marks (preserves Thai marks)
 * - Lowercase
 * - Ignore hyphens and spaces
 */
export function normalizeForSearch(text: string): string {
  const stripped = text
    .normalize('NFD')
    .replace(COMBINING_DIACRITICS_RE, '')
    .toLowerCase();

  let out = '';
  for (const ch of stripped) {
    if (!IGNORED_PUNCTUATION_OR_SPACE_RE.test(ch)) {
      out += ch;
    }
  }
  return out;
}

/**
 * Find original character index ranges in `text` that match `query` under
 * diacritic/hyphen/space-insensitive substring comparison.
 */
export function findMatchRanges(text: string, query: string): TextRange[] {
  const normQuery = normalizeForSearch(query);
  if (!normQuery || !text) return [];

  let normStr = '';
  const origStarts: number[] = [];
  const origEnds: number[] = [];

  for (let i = 0; i < text.length; ) {
    const codePoint = text.codePointAt(i)!;
    const charLen = codePoint > 0xffff ? 2 : 1;
    const slice = text.slice(i, i + charLen);

    // If this is a standalone Latin combining mark (decomposed input), extend previous char end
    if (
      slice.length === 1 &&
      codePoint >= 0x0300 &&
      codePoint <= 0x036f
    ) {
      if (origEnds.length > 0) {
        origEnds[origEnds.length - 1] = i + charLen;
      }
      i += charLen;
      continue;
    }

    const normalizedPiece = slice
      .normalize('NFD')
      .replace(COMBINING_DIACRITICS_RE, '')
      .toLowerCase();

    for (const ch of normalizedPiece) {
      if (!IGNORED_PUNCTUATION_OR_SPACE_RE.test(ch)) {
        normStr += ch;
        origStarts.push(i);
        origEnds.push(i + charLen);
      }
    }

    i += charLen;
  }

  if (!normStr) return [];

  const ranges: TextRange[] = [];
  let searchFrom = 0;
  while (searchFrom <= normStr.length - normQuery.length) {
    const idx = normStr.indexOf(normQuery, searchFrom);
    if (idx === -1) break;
    const start = origStarts[idx];
    const end = origEnds[idx + normQuery.length - 1];
    ranges.push({ start, end });
    searchFrom = idx + normQuery.length;
  }

  return ranges;
}

function localizedMatches(
  field: LocalizedText | undefined,
  normQuery: string
): boolean {
  if (!field) return false;
  for (const val of Object.values(field)) {
    if (typeof val === 'string' && normalizeForSearch(val).includes(normQuery)) {
      return true;
    }
  }
  return false;
}

function stringMatches(value: string | undefined, normQuery: string): boolean {
  if (!value) return false;
  return normalizeForSearch(value).includes(normQuery);
}

/**
 * Extract a short readable snippet centered around the first match in `text`.
 */
export function createMatchSnippet(
  text: string,
  query: string,
  maxLength = 140
): string {
  if (text.length <= maxLength) {
    return text;
  }

  const ranges = findMatchRanges(text, query);
  if (ranges.length === 0) {
    return `${text.slice(0, maxLength).trimEnd()}…`;
  }

  const first = ranges[0];
  const matchMid = Math.floor((first.start + first.end) / 2);
  const half = Math.floor(maxLength / 2);

  let start = Math.max(0, matchMid - half);
  let end = Math.min(text.length, start + maxLength);
  if (end - start < maxLength) {
    start = Math.max(0, end - maxLength);
  }

  const prefix = start > 0 ? '…' : '';
  const suffix = end < text.length ? '…' : '';
  return `${prefix}${text.slice(start, end).trim()}${suffix}`;
}

export function searchContent(
  content: ContentData,
  rawQuery: string
): SearchResults {
  const normQuery = normalizeForSearch(rawQuery);
  if (!normQuery) {
    return { teachings: [], cardClips: [] };
  }

  const teachings: TeachingSearchResult[] = [];

  for (const category of content.categories) {
    const categoryMatched =
      localizedMatches(category.name, normQuery) ||
      localizedMatches(category.intro, normQuery);

    const groupById = new Map<string, DharmaGroup>();
    for (const group of category.groups ?? []) {
      groupById.set(group.id, group);
    }

    for (const item of category.items) {
      const group = item.groupId ? (groupById.get(item.groupId) ?? null) : null;
      const groupMatched =
        group !== null &&
        (localizedMatches(group.label, normQuery) ||
          localizedMatches(group.header, normQuery));

      const primaryMatched =
        categoryMatched ||
        groupMatched ||
        localizedMatches(item.pali, normQuery) ||
        localizedMatches(item.shortMeaning, normQuery) ||
        localizedMatches(item.explanation, normQuery);

      const exampleMatched = localizedMatches(item.example, normQuery);

      if (primaryMatched || exampleMatched) {
        teachings.push({
          category,
          item,
          group,
          matchedOnlyInExample: !primaryMatched && exampleMatched,
        });
      }
    }
  }

  const cardClips: CardClipSearchResult[] = [];
  for (const clip of content.cardClips) {
    const matched =
      localizedMatches(clip.title, normQuery) ||
      stringMatches(clip.clipNo, normQuery) ||
      stringMatches(clip.category, normQuery);

    if (matched) {
      cardClips.push({ clip });
    }
  }

  return { teachings, cardClips };
}
