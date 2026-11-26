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
  category: string;
  clips: CardClip[];
}

/**
 * Group card clips by their plain-text category label in order of first appearance.
 */
export function groupCardClipsByCategory(clips: CardClip[]): CardClipsByLabel[] {
  if (clips.length === 0) {
    return [];
  }

  const groups = new Map<string, CardClip[]>();
  for (const clip of clips) {
    const label = clip.category.trim();
    const bucket = groups.get(label);
    if (bucket) {
      bucket.push(clip);
    } else {
      groups.set(label, [clip]);
    }
  }

  return Array.from(groups.entries()).map(([category, categoryClips]) => ({
    category,
    clips: categoryClips,
  }));
}
