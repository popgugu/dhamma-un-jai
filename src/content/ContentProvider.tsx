import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  cardClips as snapshotCardClips,
  categories as snapshotCategories,
} from '../data';
import { loadContentFromSheet, type ContentData } from './loader';

const CONTENT_CACHE_KEY = 'duj-content-v1';

const BUILT_IN_SNAPSHOT: ContentData = {
  categories: snapshotCategories,
  cardClips: snapshotCardClips,
};

function isValidContentData(value: unknown): value is ContentData {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  if (!Array.isArray(candidate.categories) || !Array.isArray(candidate.cardClips)) {
    return false;
  }
  return candidate.cardClips.every((clip) => {
    if (!clip || typeof clip !== 'object') return false;
    const cat = (clip as Record<string, unknown>).category;
    return (
      typeof cat === 'object' &&
      cat !== null &&
      typeof (cat as Record<string, unknown>).th === 'string'
    );
  });
}

function readCachedContent(): ContentData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONTENT_CACHE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (isValidContentData(parsed) && parsed.categories.length > 0) {
      return parsed;
    }
  } catch {
    // Ignore storage or JSON parse errors
  }
  return null;
}

function writeCachedContent(data: ContentData): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage write errors
  }
}

const ContentContext = createContext<ContentData>(BUILT_IN_SNAPSHOT);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentData>(
    () => readCachedContent() ?? BUILT_IN_SNAPSHOT
  );

  useEffect(() => {
    let cancelled = false;

    void loadContentFromSheet().then((fresh) => {
      if (cancelled || !fresh) return;
      if (fresh.categories.length === 0 && fresh.cardClips.length === 0) {
        return;
      }
      setContent(fresh);
      writeCachedContent(fresh);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): ContentData {
  return useContext(ContentContext);
}
