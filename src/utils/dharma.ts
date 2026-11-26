import type { CardClip, DharmaCategory, DharmaGroup, DharmaItem } from '../data';

export interface CategoryProgress {
  withClips: number;
  total: number;
  percent: number;
}

export function getCategoryClipProgress(
  category: DharmaCategory,
  clips: CardClip[]
): CategoryProgress {
  const total = category.items.length;
  if (total === 0) {
    return { withClips: 0, total: 0, percent: 0 };
  }

  const clipIdsInCardClips = new Set(clips.map((c) => c.clipNo));
  const withClips = category.items.filter((item) => {
    const directClipMatch = item.clipIds.length > 0;
    const reverseClipMatch = clips.some(
      (clip) =>
        clipIdsInCardClips.has(clip.clipNo) &&
        clip.relatedItemIds.includes(item.id)
    );
    return directClipMatch || reverseClipMatch;
  }).length;

  return {
    withClips,
    total,
    percent: Math.round((withClips / total) * 100),
  };
}

export function getRelatedClipsForItem(
  item: DharmaItem,
  clips: CardClip[]
): CardClip[] {
  const explicitIds = new Set(item.clipIds);
  return clips.filter(
    (clip) =>
      explicitIds.has(clip.clipNo) || clip.relatedItemIds.includes(item.id)
  );
}

export interface GroupedItemsSection {
  group: DharmaGroup | null;
  items: DharmaItem[];
}

export function groupCategoryItems(category: DharmaCategory): GroupedItemsSection[] {
  if (!category.groups || category.groups.length === 0) {
    return [{ group: null, items: category.items }];
  }

  const sections: GroupedItemsSection[] = [];
  for (const group of category.groups) {
    const groupItems = category.items.filter((item) => item.groupId === group.id);
    if (groupItems.length > 0) {
      sections.push({ group, items: groupItems });
    }
  }

  const assignedIds = new Set(
    sections.flatMap((section) => section.items.map((item) => item.id))
  );
  const ungrouped = category.items.filter((item) => !assignedIds.has(item.id));
  if (ungrouped.length > 0) {
    sections.push({ group: null, items: ungrouped });
  }

  return sections;
}

export interface CardClipsByCategory {
  category: DharmaCategory | null;
  categoryId: string;
  clips: CardClip[];
}

export function groupCardClipsByCategory(
  clips: CardClip[],
  allCategories: DharmaCategory[]
): CardClipsByCategory[] {
  if (clips.length === 0) {
    return [];
  }

  const byId = new Map<string, CardClip[]>();
  for (const clip of clips) {
    const bucket = byId.get(clip.categoryId) ?? [];
    bucket.push(clip);
    byId.set(clip.categoryId, bucket);
  }

  const result: CardClipsByCategory[] = [];
  const handled = new Set<string>();

  for (const category of allCategories) {
    const categoryClips = byId.get(category.id);
    if (categoryClips && categoryClips.length > 0) {
      result.push({
        category,
        categoryId: category.id,
        clips: categoryClips,
      });
      handled.add(category.id);
    }
  }

  for (const [categoryId, categoryClips] of byId.entries()) {
    if (!handled.has(categoryId)) {
      result.push({
        category: null,
        categoryId,
        clips: categoryClips,
      });
    }
  }

  return result;
}
