import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildAnalyticsPagePath,
  initAnalytics,
  resetAnalyticsStateForTests,
  trackPageView,
} from './analytics';

function setupMockDom() {
  const scripts: Array<{ async: boolean; src: string }> = [];
  const win: {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  } = {};
  const doc = {
    title: 'ธรรมะอุ่นใจ · ที่พึ่งทางใจ',
    head: {
      appendChild(el: { async: boolean; src: string }) {
        scripts.push(el);
      },
    },
    createElement() {
      return { async: false, src: '' };
    },
    querySelector(selector: string) {
      const match = selector.match(/script\[src="(.+)"\]/);
      if (!match) return null;
      return scripts.find((s) => s.src === match[1]) ?? null;
    },
  };

  (globalThis as unknown as { window: unknown }).window = win;
  (globalThis as unknown as { document: unknown }).document = doc;

  return { win, doc, scripts };
}

function teardownMockDom() {
  delete (globalThis as unknown as { window?: unknown }).window;
  delete (globalThis as unknown as { document?: unknown }).document;
  resetAnalyticsStateForTests();
}

test('buildAnalyticsPagePath always includes ?lang for Thai and English across routes', () => {
  assert.equal(buildAnalyticsPagePath({ page: 'home' }, 'th'), '/?lang=th');
  assert.equal(buildAnalyticsPagePath({ page: 'home' }, 'en'), '/?lang=en');
  assert.equal(
    buildAnalyticsPagePath({ page: 'teachings' }, 'th'),
    '/teachings?lang=th'
  );
  assert.equal(
    buildAnalyticsPagePath(
      { page: 'category', categoryId: 'five-precepts', itemId: 'five-precepts-1' },
      'en'
    ),
    '/teachings/five-precepts?lang=en'
  );
  assert.equal(
    buildAnalyticsPagePath({ page: 'cards' }, 'th'),
    '/cards?lang=th'
  );
  assert.equal(
    buildAnalyticsPagePath({ page: 'search', query: 'Right View' }, 'en'),
    '/?page=search&lang=en'
  );
});

test('analytics does nothing outside production build or when measurement ID is empty', () => {
  const { win, scripts } = setupMockDom();
  try {
    assert.equal(
      initAnalytics({ isProd: false, measurementId: 'G-PDP92GTR4H' }),
      false
    );
    assert.equal(
      trackPageView('/?lang=th', { isProd: false, measurementId: 'G-PDP92GTR4H' }),
      false
    );
    assert.equal(initAnalytics({ isProd: true, measurementId: '   ' }), false);
    assert.equal(
      trackPageView('/?lang=th', { isProd: true, measurementId: '' }),
      false
    );
    assert.equal(scripts.length, 0);
    assert.equal(win.dataLayer, undefined);
  } finally {
    teardownMockDom();
  }
});

test('analytics loads gtag.js once in production, disables auto page_view, and tracks SPA page views', () => {
  const { win, scripts } = setupMockDom();
  try {
    const sent = trackPageView('/?lang=th', {
      isProd: true,
      measurementId: 'G-PDP92GTR4H',
    });
    assert.equal(sent, true);
    assert.equal(scripts.length, 1);
    assert.equal(scripts[0].async, true);
    assert.equal(
      scripts[0].src,
      'https://www.googletagmanager.com/gtag/js?id=G-PDP92GTR4H'
    );

    const calls = (win.dataLayer ?? []).map((entry) => Array.from(entry as ArrayLike<unknown>));
    assert.equal(calls.length, 3);
    assert.equal(calls[0][0], 'js');
    assert.deepEqual(calls[1], [
      'config',
      'G-PDP92GTR4H',
      { send_page_view: false },
    ]);
    assert.deepEqual(calls[2], [
      'event',
      'page_view',
      { page_path: '/?lang=th', page_title: 'ธรรมะอุ่นใจ · ที่พึ่งทางใจ' },
    ]);

    // Same path should not double-fire
    assert.equal(
      trackPageView('/?lang=th', {
        isProd: true,
        measurementId: 'G-PDP92GTR4H',
      }),
      false
    );

    // Switching language or route sends a new page_view without re-injecting script
    assert.equal(
      trackPageView('/?lang=en', {
        isProd: true,
        measurementId: 'G-PDP92GTR4H',
      }),
      true
    );
    assert.equal(
      trackPageView('/cards?lang=en', {
        isProd: true,
        measurementId: 'G-PDP92GTR4H',
      }),
      true
    );
    assert.equal(scripts.length, 1);
    assert.equal((win.dataLayer ?? []).length, 5);
  } finally {
    teardownMockDom();
  }
});

test('analytics swallows errors safely when script injection or gtag throws', () => {
  const { win, doc } = setupMockDom();
  try {
    doc.head.appendChild = () => {
      throw new Error('Blocked by content blocker');
    };
    assert.equal(
      initAnalytics({ isProd: true, measurementId: 'G-PDP92GTR4H' }),
      false
    );
    win.gtag = () => {
      throw new Error('Blocked gtag');
    };
    assert.equal(
      trackPageView('/?lang=th', {
        isProd: true,
        measurementId: 'G-PDP92GTR4H',
      }),
      false
    );
  } finally {
    teardownMockDom();
  }
});
