import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getLocalized,
  resolveInitialLocale,
  saveLocale,
  SUPPORTED_LOCALES,
  t,
  type StorageLike,
} from '../i18n';
import { buildUrl, parseRoute } from './routing';

function createMemoryStorage(initial: Record<string, string> = {}): StorageLike {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
  };
}

test('supported locales list defines Thai first and English second', () => {
  assert.deepEqual(
    SUPPORTED_LOCALES.map((l) => l.code),
    ['th', 'en']
  );
});

test('URL ?lang parameter wins over saved localStorage preference', () => {
  const storageEn = createMemoryStorage({ 'dhamma-un-jai-locale': 'en' });
  const storageTh = createMemoryStorage({ 'dhamma-un-jai-locale': 'th' });

  assert.equal(resolveInitialLocale('?lang=th', storageEn), 'th');
  assert.equal(resolveInitialLocale('?lang=en', storageTh), 'en');
  assert.equal(resolveInitialLocale('', storageEn), 'en');
  assert.equal(resolveInitialLocale('?lang=invalid', storageEn), 'en');
  assert.equal(resolveInitialLocale('', createMemoryStorage()), 'th');
});

test('localStorage errors are caught safely without crashing', () => {
  const brokenStorage: StorageLike = {
    getItem() {
      throw new Error('Storage blocked');
    },
    setItem() {
      throw new Error('Storage blocked');
    },
  };

  assert.equal(resolveInitialLocale('', brokenStorage), 'th');
  assert.equal(resolveInitialLocale('?lang=en', brokenStorage), 'en');
  assert.doesNotThrow(() => saveLocale('en', brokenStorage));
});

test('t() formats bilingual strings and interpolates parameters', () => {
  assert.equal(t('th', 'site.title'), 'ธรรมะอุ่นใจ');
  assert.equal(t('en', 'site.title'), 'Dhamma Un Jai');
  assert.equal(t('th', 'teachings.clipProgress', { X: 0, N: 5 }), 'มีคลิปแล้ว 0 จาก 5');
  assert.equal(t('en', 'teachings.clipProgress', { X: 0, N: 5 }), '0 of 5 have clips');
  assert.equal(
    t('en', 'category.translationNote'),
    'English text is translated from the original Thai.'
  );
  assert.equal(t('th', 'category.translationNote'), '');
});

test('getLocalized falls back to Thai text with isFallback flag when translation is missing', () => {
  const complete = { th: 'ศีล 5', en: 'The Five Precepts' };
  const missingEn = { th: 'ข้อธรรมตัวอย่าง' };

  assert.deepEqual(getLocalized(complete, 'en'), {
    text: 'The Five Precepts',
    isFallback: false,
  });
  assert.deepEqual(getLocalized(missingEn, 'en'), {
    text: 'ข้อธรรมตัวอย่าง',
    isFallback: true,
  });
  assert.deepEqual(getLocalized(missingEn, 'th'), {
    text: 'ข้อธรรมตัวอย่าง',
    isFallback: false,
  });
});

test('routing parses paths and preserves ?lang when building URLs', () => {
  assert.deepEqual(parseRoute('/'), { page: 'home' });
  assert.deepEqual(parseRoute('/teachings'), { page: 'teachings' });
  assert.deepEqual(parseRoute('/teachings/five-precepts'), {
    page: 'category',
    categoryId: 'five-precepts',
  });
  assert.deepEqual(parseRoute('/cards'), { page: 'cards' });

  assert.equal(buildUrl({ page: 'home' }, 'th'), '/');
  assert.equal(buildUrl({ page: 'home' }, 'en'), '/?lang=en');
  assert.equal(
    buildUrl({ page: 'category', categoryId: 'noble-eightfold-path' }, 'en'),
    '/teachings/noble-eightfold-path?lang=en'
  );
  assert.equal(buildUrl({ page: 'cards' }, 'en'), '/cards?lang=en');
});
