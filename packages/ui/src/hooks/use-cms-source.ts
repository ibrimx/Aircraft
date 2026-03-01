// packages/ui/src/hooks/use-cms-source.ts
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { CmsSource } from '@brimair/shared-types';

// ── Context ──────────────────────────────────────────────
type CmsContextValue = {
  fetchSources: (signal: AbortSignal) => Promise<CmsSource[]>;
};

const CmsContext = createContext<CmsContextValue | null>(null);
export { CmsContext };

// ── Types ────────────────────────────────────────────────
export type UseCmsSourceReturn = {
  sources: CmsSource[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getSource: (id: string) => CmsSource | undefined;
};

// ── Hook ─────────────────────────────────────────────────
export function useCmsSource(): UseCmsSourceReturn {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error('useCmsSource must be used within <CmsProvider>.');

  const [sources, setSources] = useState<CmsSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (signal: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ctx.fetchSources(signal);
      if (!signal.aborted) setSources(data);
    } catch (err: unknown) {
      if (!signal.aborted) setError(err instanceof Error ? err.message : 'Failed to load sources');
    } finally {
      if (!signal.aborted) setIsLoading(false);
    }
  }, [ctx]);

  useEffect(() => {
    const ac = new AbortController();
    void load(ac.signal);
    return () => ac.abort();
  }, [load]);

  const refresh = useCallback(async () => {
    const ac = new AbortController();
    await load(ac.signal);
  }, [load]);

  const getSource = useCallback(
    (id: string) => sources.find((s) => s.id === id),
    [sources],
  );

  return { sources, isLoading, error, refresh, getSource };
}
