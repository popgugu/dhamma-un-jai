import assert from 'node:assert/strict';
import test from 'node:test';
import type { ContentData } from '../content/loader';
import { categories as snapshotCategories } from '../data';
import {
  createMatchSnippet,
  findMatchRanges,
  normalizeForSearch,
  searchContent,
} from './search';

const TEST_CONTENT: ContentData = {
  categories: snapshotCategories.map((cat) => ({
    ...cat,
    items: cat.items.map((item) =>
      item.id === 'five-precepts-1'
        ? {
            ...item,
            example: {
              th: 'เมื่อเห็นมดเดินบนโต๊ะ ค่อยๆ ปัดหรือพาออกไปแทนการบี้',
              en: 'Gently guiding an ant off the table instead of crushing it.',
            },
          }
        : item
    ),
  })),
  cardClips: [
    {
      clipNo: '0001',
      date: '2026-11-20',
      category: {
        th: 'สติในชีวิตประจำวัน',
        en: 'Daily Mindfulness',
      },
      title: {
        th: 'หยุดพักหายใจเมื่อใจวุ่นวาย',
        en: 'Pausing to Breathe When Restless',
      },
      quote: {
        th: 'ลมหายใจคือบ้านที่เรากลับมาพักได้เสมอ',
        en: 'The breath is a quiet home we can always return to.',
      },
      youtubeUrl: 'https://www.youtube.com/watch?v=example',
    },
  ],
};

test('search matches Thai text across teachings and card clips', () => {
  const result = searchContent(TEST_CONTENT, 'สัมมาทิฏฐิ');
  assert.equal(result.teachings.length, 1);
  assert.equal(result.teachings[0].item.id, 'noble-eightfold-path-1');
  assert.equal(result.teachings[0].matchedOnlyInExample, false);

  const clipResult = searchContent(TEST_CONTENT, 'หายใจ');
  assert.equal(clipResult.cardClips.length, 1);
  assert.equal(clipResult.cardClips[0].clip.clipNo, '0001');
});

test('search matches English text including English clip category label', () => {
  const result = searchContent(TEST_CONTENT, 'right view');
  assert.equal(result.teachings.length, 1);
  assert.equal(result.teachings[0].item.id, 'noble-eightfold-path-1');

  const clipResult = searchContent(TEST_CONTENT, 'daily mindfulness');
  assert.equal(clipResult.cardClips.length, 1);
  assert.equal(clipResult.cardClips[0].clip.clipNo, '0001');
});

test('search matches Pali diacritics ignoring marks, hyphens, and spaces', () => {
  assert.equal(normalizeForSearch('Sammā-diṭṭhi'), 'sammaditthi');
  const result = searchContent(TEST_CONTENT, 'sammaditthi');
  assert.equal(result.teachings.length, 1);
  assert.equal(result.teachings[0].item.id, 'noble-eightfold-path-1');

  const ranges = findMatchRanges('Sammā-diṭṭhi', 'sammaditthi');
  assert.deepEqual(ranges, [{ start: 0, end: 'Sammā-diṭṭhi'.length }]);
});

test('search matches inside an everyday example and flags matchedOnlyInExample', () => {
  const thResult = searchContent(TEST_CONTENT, 'มดเดินบนโต๊ะ');
  assert.equal(thResult.teachings.length, 1);
  assert.equal(thResult.teachings[0].item.id, 'five-precepts-1');
  assert.equal(thResult.teachings[0].matchedOnlyInExample, true);

  const enResult = searchContent(TEST_CONTENT, 'guiding an ant');
  assert.equal(enResult.teachings.length, 1);
  assert.equal(enResult.teachings[0].item.id, 'five-precepts-1');
  assert.equal(enResult.teachings[0].matchedOnlyInExample, true);

  const snippet = createMatchSnippet(
    'Gently guiding an ant off the table instead of crushing it.',
    'guiding an ant',
    40
  );
  assert.ok(snippet.includes('guiding an ant'));
});

test('search matches inside a card clip quote in both Thai and English', () => {
  const thQuoteResult = searchContent(TEST_CONTENT, 'บ้านที่เรากลับมาพัก');
  assert.equal(thQuoteResult.cardClips.length, 1);
  assert.equal(thQuoteResult.cardClips[0].clip.clipNo, '0001');
  assert.equal(thQuoteResult.cardClips[0].matchedInQuote, true);

  const enQuoteResult = searchContent(TEST_CONTENT, 'quiet home');
  assert.equal(enQuoteResult.cardClips.length, 1);
  assert.equal(enQuoteResult.cardClips[0].clip.clipNo, '0001');
  assert.equal(enQuoteResult.cardClips[0].matchedInQuote, true);
});

test('search returns empty arrays when nothing matches or query is blank', () => {
  assert.deepEqual(searchContent(TEST_CONTENT, ''), {
    teachings: [],
    cardClips: [],
  });
  assert.deepEqual(searchContent(TEST_CONTENT, '   '), {
    teachings: [],
    cardClips: [],
  });
  assert.deepEqual(searchContent(TEST_CONTENT, 'ไม่มีคำนี้แน่นอนxyz'), {
    teachings: [],
    cardClips: [],
  });
});
