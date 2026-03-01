// packages/ui/src/hooks/use-collection.ts
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { CmsCollection, CmsRecord } from '@brimair/shared-types';

// ── Context ──────────────────────────────────────────────
type CollectionContextValue = {
  fetchCollection: (sourceId: string, collectionId: string, signal: AbortSignal) => Promise<CmsCollection>;
  fetchRecords: (sourceId: string, collectionId: string, cursor: string | null, signal: AbortSignal) => Promise<{ records: CmsRecord[]; nextCursor: string | null }>;
};

const CollectionContext = createContext<CollectionContextValue | null>(null);
export { CollectionContext };

// ── Types ────────────────────────────────────────────────
export type UseCollectionReturn = {
  collection: CmsCollection | null;
  records: CmsRecord[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
};

// ── Hook ─────────────────────────────────────────────────
export function useCollection(sourceId: string, collectionId: string): UseCollectionReturn {
  const ctx = useContext(CollectionContext);
  if (!ctx) throw new Error('useCollection must be used within <CollectionProvider>.');

  const [collection, setCollection] = useState<CmsCollection | null>(null);
  const [records, setRecords] = useState<CmsRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cursorRef = useRef<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const load = useCallback(async (signal: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    setRecords([]);
    cursorRef.current = null;
    try {
      const [col, page] = await Promise.all([
        ctx.fetchCollection(sourceId, collectionId, signal),
        ctx.fetchRecords(sourceId, collectionId, null, signal),
      ]);
      if (signal.aborted) return;
      setCollection(col);
      setRecords(page.records);
      cursorRef.current = page.nextCursor;
      setHasMore(page.nextCursor !== null);
    } catch (err: unknown) {
      if (!signal.aborted) setError(err instanceof Error ? err.message : 'Failed to load collection');
    } finally {
      if (!signal.aborted) setIsLoading(false);
    }
  }, [ctx, sourceId, collectionId]);

  useEffect(() => {
    const ac = new AbortController();
    void load(ac.signal);
    return () => ac.abort();
  }, [load]); // resets on sourceId/collectionId change via load deps

  const refresh = useCallback(async () => {
    const ac = new AbortController();
    await load(ac.signal);
  }, [load]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    const ac = new AbortController();
    try {
      const page = await ctx.fetchRecords(sourceId, collectionId, cursorRef.current, ac.signal);
      if (!ac.signal.aborted) {
        setRecords((prev) => [...prev, ...page.records]);
        cursorRef.current = page.nextCursor;
        setHasMore(page.nextCursor !== null);
      }
    } catch (err: unknown) {
      if (!ac.signal.aborted) setError(err instanceof Error ? err.message : 'Failed to load more');
    }
  }, [ctx, sourceId, collectionId, hasMore, isLoading]);

  return { collection, records, isLoading, error, refresh, hasMore, loadMore };
}
