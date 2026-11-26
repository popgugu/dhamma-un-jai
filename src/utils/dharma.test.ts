import assert from 'node:assert/strict';
import test from 'node:test';
import { cardClips, categories, type CardClip } from '../data';
import { groupCardClipsByCategory, groupCategoryItems } from './dharma';

test('categories are in the required order with exact item counts', () => {
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

test('card clips group by Thai category label in order of first appearance with localized heading', () => {
  assert.deepEqual(groupCardClipsByCategory([]), []);

  const sampleClips: CardClip[] = [
    {
      clipNo: '01',
      title: { th: 'เมตตาต่อทุกชีวิต', en: 'Kindness to All Beings' },
      date: '2026-11-20',
      category: { th: 'สติในชีวิตประจำวัน', en: 'Daily Mindfulness' },
    },
    {
      clipNo: '02',
      title: { th: 'ปล่อยวางความโกรธ', en: 'Letting Go of Anger' },
      date: '2026-11-21',
      category: { th: 'ความสงบใจ', en: 'Peace of Mind' },
    },
    {
      clipNo: '03',
      title: { th: 'ลมหายใจที่ผ่อนคลาย', en: 'A Relaxed Breath' },
      date: '2026-11-22',
      category: { th: 'สติในชีวิตประจำวัน' },
    },
  ];

  const grouped = groupCardClipsByCategory(sampleClips);
  assert.equal(grouped.length, 2);
  assert.deepEqual(
    grouped.map((g) => g.category),
    [
      { th: 'สติในชีวิตประจำวัน', en: 'Daily Mindfulness' },
      { th: 'ความสงบใจ', en: 'Peace of Mind' },
    ]
  );
  assert.deepEqual(
    grouped[0].clips.map((c) => c.clipNo),
    ['01', '03']
  );
  assert.deepEqual(
    grouped[1].clips.map((c) => c.clipNo),
    ['02']
  );
});
