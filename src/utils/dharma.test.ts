import assert from 'node:assert/strict';
import test from 'node:test';
import { cardClips, categories, type CardClip } from '../data';
import {
  getCategoryClipProgress,
  getRelatedClipsForItem,
  groupCardClipsByCategory,
  groupCategoryItems,
} from './dharma';

test('categories are in the required order with exact item counts and empty clipIds', () => {
  assert.deepEqual(
    categories.map((c) => c.id),
    ['five-precepts', 'eight-precepts', 'noble-eightfold-path']
  );
  assert.deepEqual(
    categories.map((c) => c.items.length),
    [5, 8, 8]
  );

  for (const cat of categories) {
    assert.ok(cat.sources.length >= 2, `${cat.id} should include sources`);
    for (const item of cat.items) {
      assert.deepEqual(item.clipIds, []);
      assert.ok(item.pali.th.length > 0);
      assert.ok((item.pali.en ?? '').length > 0);
    }
  }

  assert.deepEqual(cardClips, []);
});

test('Noble Eightfold Path groups into three trainings (2, 3, 3 items)', () => {
  const pathCategory = categories.find((c) => c.id === 'noble-eightfold-path');
  assert.ok(pathCategory);

  const grouped = groupCategoryItems(pathCategory);
  assert.equal(grouped.length, 3);
  assert.deepEqual(
    grouped.map((g) => g.group?.id),
    ['wisdom', 'conduct', 'concentration']
  );
  assert.deepEqual(
    grouped.map((g) => g.items.length),
    [2, 3, 3]
  );
});

test('clip progress and card grouping handle empty and future populated clips', () => {
  const fivePrecepts = categories[0];
  assert.deepEqual(getCategoryClipProgress(fivePrecepts, []), {
    withClips: 0,
    total: 5,
    percent: 0,
  });

  const sampleClips: CardClip[] = [
    {
      clipNo: '01',
      title: { th: 'เมตตาต่อทุกชีวิต', en: 'Kindness to All Beings' },
      date: '2026-11-26',
      categoryId: 'five-precepts',
      relatedItemIds: ['five-precepts-1'],
    },
  ];

  assert.deepEqual(getCategoryClipProgress(fivePrecepts, sampleClips), {
    withClips: 1,
    total: 5,
    percent: 20,
  });
  assert.equal(getRelatedClipsForItem(fivePrecepts.items[0], sampleClips).length, 1);
  assert.equal(getRelatedClipsForItem(fivePrecepts.items[1], sampleClips).length, 0);

  const grouped = groupCardClipsByCategory(sampleClips, categories);
  assert.equal(grouped.length, 1);
  assert.equal(grouped[0].category?.id, 'five-precepts');
  assert.equal(grouped[0].clips.length, 1);
  assert.deepEqual(groupCardClipsByCategory([], categories), []);
});
