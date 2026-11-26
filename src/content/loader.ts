import Papa from 'papaparse';
import type {
  CardClip,
  DharmaCategory,
  DharmaGroup,
  DharmaItem,
  DharmaSource,
} from '../data';
import type { LocalizedText } from '../i18n/types';
import { buildSheetCsvUrl, GIDS, SHEET_BASE, type SheetTabKey } from './config';

export interface ContentData {
  categories: DharmaCategory[];
  cardClips: CardClip[];
}

export interface SheetCsvBundle {
  categories: string;
  groups: string;
  items: string;
  sources: string;
  cardClips: string;
}

type RawRow = Record<string, string | undefined>;

const VALID_TONES = new Set<DharmaGroup['tone']>(['saffron', 'sage', 'stone']);
const FETCH_TIMEOUT_MS = 10_000;

function cell(row: RawRow, key: string): string {
  const value = row[key];
  return typeof value === 'string' ? value.trim() : '';
}

function isPublished(status: string): boolean {
  return status.trim().toLowerCase() === 'published';
}

function parseStrictNumber(raw: string): number | null {
  if (!raw) return null;
  const num = Number(raw);
  return Number.isFinite(num) ? num : null;
}

/**
 * Build a LocalizedText object from *_th and *_en columns.
 * Future languages (e.g. *_zh) can be mapped here in one place.
 * Empty cells are treated as missing; if *_th is empty but *_en exists,
 * *_en is also used as the canonical `th` value so text is never blank.
 */
function buildLocalized(thRaw: string, enRaw: string): LocalizedText | undefined {
  const th = thRaw.trim();
  const en = enRaw.trim();

  if (!th && !en) return undefined;
  if (!th && en) {
    return { th: en, en };
  }
  if (en) {
    return { th, en };
  }
  return { th };
}

function parseCsvRows(csvText: string, tabName: string): RawRow[] {
  if (!csvText.trim()) return [];
  const parsed = Papa.parse<RawRow>(csvText, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header) => header.trim(),
  });

  if (parsed.errors.length > 0) {
    for (const err of parsed.errors) {
      console.warn(`[content] CSV parse warning in ${tabName} row ${err.row ?? '?'}: ${err.message}`);
    }
  }

  return parsed.data;
}

function compareClipNo(a: string, b: string): number {
  const numA = Number(a);
  const numB = Number(b);
  if (a !== '' && b !== '' && Number.isFinite(numA) && Number.isFinite(numB)) {
    return numA - numB;
  }
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

export function parseSheetContent(bundle: SheetCsvBundle): ContentData {
  // 1. Parse Categories
  const categoryRows = parseCsvRows(bundle.categories, 'Categories');
  const allCategoryIds = new Set<string>();

  interface PendingCategory {
    order: number;
    category: DharmaCategory;
    groupsWithOrder: Array<{ order: number; group: DharmaGroup }>;
    sourcesWithOrder: Array<{ order: number; source: DharmaSource }>;
  }

  const publishedCategories = new Map<string, PendingCategory>();

  categoryRows.forEach((row, index) => {
    const sheetRow = index + 2;
    const id = cell(row, 'id');
    const orderRaw = cell(row, 'order');
    const status = cell(row, 'status');
    const name = buildLocalized(cell(row, 'name_th'), cell(row, 'name_en'));
    const intro = buildLocalized(cell(row, 'intro_th'), cell(row, 'intro_en'));

    if (!id) {
      console.warn(`[content] Skipping Categories row ${sheetRow}: missing required "id".`);
      return;
    }

    const order = parseStrictNumber(orderRaw);
    if (order === null) {
      console.warn(
        `[content] Skipping Categories row ${sheetRow} (${id}): non-numeric "order" ("${orderRaw}").`
      );
      return;
    }

    if (!name) {
      console.warn(
        `[content] Skipping Categories row ${sheetRow} (${id}): missing required "name_th".`
      );
      return;
    }

    allCategoryIds.add(id);

    if (!isPublished(status)) {
      return;
    }

    publishedCategories.set(id, {
      order,
      category: {
        id,
        name,
        intro: intro ?? { th: '' },
        items: [],
        sources: [],
      },
      groupsWithOrder: [],
      sourcesWithOrder: [],
    });
  });

  // 2. Parse Groups (attach to category_id, no status column)
  const groupRows = parseCsvRows(bundle.groups, 'Groups');
  groupRows.forEach((row, index) => {
    const sheetRow = index + 2;
    const categoryId = cell(row, 'category_id');
    const id = cell(row, 'id');
    const orderRaw = cell(row, 'order');
    const toneRaw = cell(row, 'tone').toLowerCase();
    const header = buildLocalized(cell(row, 'header_th'), cell(row, 'header_en'));
    const label = buildLocalized(cell(row, 'label_th'), cell(row, 'label_en'));

    if (!categoryId || !id) {
      console.warn(
        `[content] Skipping Groups row ${sheetRow}: missing required "category_id" or "id".`
      );
      return;
    }

    const order = parseStrictNumber(orderRaw);
    if (order === null) {
      console.warn(
        `[content] Skipping Groups row ${sheetRow} (${id}): non-numeric "order" ("${orderRaw}").`
      );
      return;
    }

    if (!header && !label) {
      console.warn(
        `[content] Skipping Groups row ${sheetRow} (${id}): missing required "header_th"/"label_th".`
      );
      return;
    }

    if (!allCategoryIds.has(categoryId)) {
      console.warn(
        `[content] Skipping Groups row ${sheetRow} (${id}): unknown category_id "${categoryId}".`
      );
      return;
    }

    const target = publishedCategories.get(categoryId);
    if (!target) {
      // Parent category exists but is not published -> hide quietly.
      return;
    }

    const tone: DharmaGroup['tone'] = VALID_TONES.has(toneRaw as DharmaGroup['tone'])
      ? (toneRaw as DharmaGroup['tone'])
      : 'stone';

    const resolvedHeader = header ?? label!;
    const resolvedLabel = label ?? header!;

    target.groupsWithOrder.push({
      order,
      group: {
        id,
        header: resolvedHeader,
        label: resolvedLabel,
        tone,
      },
    });
  });

  // Finalize sorted groups per published category and track valid group IDs
  const validGroupIdsByCategory = new Map<string, Set<string>>();
  for (const [categoryId, entry] of publishedCategories.entries()) {
    entry.groupsWithOrder.sort((a, b) => a.order - b.order);
    if (entry.groupsWithOrder.length > 0) {
      entry.category.groups = entry.groupsWithOrder.map((g) => g.group);
      validGroupIdsByCategory.set(
        categoryId,
        new Set(entry.groupsWithOrder.map((g) => g.group.id))
      );
    } else {
      validGroupIdsByCategory.set(categoryId, new Set());
    }
  }

  // 3. Parse Items
  const itemRows = parseCsvRows(bundle.items, 'Items');
  itemRows.forEach((row, index) => {
    const sheetRow = index + 2;
    const categoryId = cell(row, 'category_id');
    const numberRaw = cell(row, 'number');
    const groupIdRaw = cell(row, 'group_id');
    const status = cell(row, 'status');
    const pali = buildLocalized(cell(row, 'pali_th'), cell(row, 'pali_en'));
    const shortMeaning = buildLocalized(cell(row, 'meaning_th'), cell(row, 'meaning_en'));
    const explanation = buildLocalized(
      cell(row, 'explanation_th'),
      cell(row, 'explanation_en')
    );
    const example = buildLocalized(cell(row, 'example_th'), cell(row, 'example_en'));

    if (!categoryId) {
      console.warn(`[content] Skipping Items row ${sheetRow}: missing required "category_id".`);
      return;
    }

    const number = parseStrictNumber(numberRaw);
    if (number === null) {
      console.warn(
        `[content] Skipping Items row ${sheetRow}: non-numeric "number" ("${numberRaw}").`
      );
      return;
    }

    if (!pali) {
      console.warn(
        `[content] Skipping Items row ${sheetRow} (${categoryId}-${number}): missing required "pali_th".`
      );
      return;
    }

    if (!allCategoryIds.has(categoryId)) {
      console.warn(
        `[content] Skipping Items row ${sheetRow} (${categoryId}-${number}): unknown category_id "${categoryId}".`
      );
      return;
    }

    if (!isPublished(status)) {
      return;
    }

    const target = publishedCategories.get(categoryId);
    if (!target) {
      // Category is not published -> hide item.
      return;
    }

    const validGroups = validGroupIdsByCategory.get(categoryId);
    const groupId =
      groupIdRaw && validGroups?.has(groupIdRaw) ? groupIdRaw : undefined;

    const item: DharmaItem = {
      id: `${categoryId}-${number}`,
      number,
      pali,
      shortMeaning: shortMeaning ?? { th: '' },
      explanation: explanation ?? { th: '' },
      ...(example ? { example } : {}),
      ...(groupId ? { groupId } : {}),
    };

    target.category.items.push(item);
  });

  // 4. Parse Sources (no status column)
  const sourceRows = parseCsvRows(bundle.sources, 'Sources');
  sourceRows.forEach((row, index) => {
    const sheetRow = index + 2;
    const categoryId = cell(row, 'category_id');
    const orderRaw = cell(row, 'order');
    const text = buildLocalized(cell(row, 'text_th'), cell(row, 'text_en'));

    if (!categoryId) {
      console.warn(`[content] Skipping Sources row ${sheetRow}: missing required "category_id".`);
      return;
    }

    const order = parseStrictNumber(orderRaw);
    if (order === null) {
      console.warn(
        `[content] Skipping Sources row ${sheetRow}: non-numeric "order" ("${orderRaw}").`
      );
      return;
    }

    if (!text) {
      console.warn(
        `[content] Skipping Sources row ${sheetRow}: missing required "text_th".`
      );
      return;
    }

    if (!allCategoryIds.has(categoryId)) {
      console.warn(
        `[content] Skipping Sources row ${sheetRow}: unknown category_id "${categoryId}".`
      );
      return;
    }

    const target = publishedCategories.get(categoryId);
    if (!target) {
      return;
    }

    target.sourcesWithOrder.push({
      order,
      source: {
        id: `${categoryId}-src-${order}-${sheetRow}`,
        text,
      },
    });
  });

  // Finalize sorted categories, items, and sources
  const categories = Array.from(publishedCategories.values())
    .sort((a, b) => a.order - b.order)
    .map((entry) => {
      entry.category.items.sort((a, b) => a.number - b.number);
      entry.sourcesWithOrder.sort((a, b) => a.order - b.order);
      entry.category.sources = entry.sourcesWithOrder.map((s) => s.source);
      return entry.category;
    });

  // 5. Parse CardClips (independent from Categories)
  const clipRows = parseCsvRows(bundle.cardClips, 'CardClips');
  const cardClips: CardClip[] = [];

  clipRows.forEach((row, index) => {
    const sheetRow = index + 2;
    const clipNo = cell(row, 'clip_no');
    const date = cell(row, 'date');
    const status = cell(row, 'status');
    const category = cell(row, 'category');
    const title = buildLocalized(cell(row, 'title_th'), cell(row, 'title_en'));

    if (!clipNo) {
      console.warn(`[content] Skipping CardClips row ${sheetRow}: missing required "clip_no".`);
      return;
    }

    if (!title) {
      console.warn(
        `[content] Skipping CardClips row ${sheetRow} (${clipNo}): missing required "title_th".`
      );
      return;
    }

    if (!isPublished(status)) {
      return;
    }

    cardClips.push({
      clipNo,
      date,
      category,
      title,
    });
  });

  cardClips.sort((a, b) => compareClipNo(a.clipNo, b.clipNo));

  return { categories, cardClips };
}

export interface LoadContentOptions {
  sheetBase?: string;
  gids?: Record<SheetTabKey, string>;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export async function loadContentFromSheet(
  options: LoadContentOptions = {}
): Promise<ContentData | null> {
  const sheetBase = (options.sheetBase ?? SHEET_BASE).trim();
  if (!sheetBase) {
    return null;
  }

  const gids = options.gids ?? GIDS;
  const timeoutMs = options.timeoutMs ?? FETCH_TIMEOUT_MS;
  const fetchFn = options.fetchImpl ?? fetch;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const tabs: SheetTabKey[] = [
      'categories',
      'groups',
      'items',
      'sources',
      'cardClips',
    ];

    const results = await Promise.all(
      tabs.map(async (tab) => {
        const url = buildSheetCsvUrl(gids[tab], sheetBase);
        const response = await fetchFn(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to fetch ${tab} CSV (HTTP ${response.status})`);
        }
        return [tab, await response.text()] as const;
      })
    );

    const bundle = Object.fromEntries(results) as unknown as SheetCsvBundle;
    return parseSheetContent(bundle);
  } catch (error) {
    console.warn('[content] Failed to refresh content from Google Sheet:', error);
    return null;
  } finally {
    clearTimeout(timer);
  }
}
