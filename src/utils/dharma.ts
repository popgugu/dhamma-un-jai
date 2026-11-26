import type { CardClip, DharmaCategory, DharmaGroup, DharmaItem } from '../data';

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

export interface CardClipsByLabel {
  key: string;
  category: CardClip['category'];
  clips: CardClip[];
}

/**
 * Group card clips by their Thai category label (category.th) in order of first appearance,
 * preserving the localized category object so headings display in the active language.
 */
export function groupCardClipsByCategory(clips: CardClip[]): CardClipsByLabel[] {
  if (clips.length === 0) {
    return [];
  }

  const groups = new Map<string, CardClipsByLabel>();
  for (const clip of clips) {
    const key = clip.category.th.trim();
    const existing = groups.get(key);
    if (existing) {
      existing.clips.push(clip);
      if (!existing.category.en && clip.category.en) {
        existing.category = { ...existing.category, en: clip.category.en };
      }
    } else {
      groups.set(key, {
        key,
        category: { ...clip.category },
        clips: [clip],
      });
    }
  }

  return Array.from(groups.values());
}
