// packages/ui/src/hooks/use-thumb-zone.ts
import { useCallback, useEffect, useState } from 'react';
import type { RefObject } from 'react';

// ── Types ────────────────────────────────────────────────
export type ThumbZone = 'easy' | 'stretch' | 'hard';

// ── Hook ─────────────────────────────────────────────────
export function useThumbZone(elementRef: RefObject<HTMLElement>): ThumbZone {
  const [zone, setZone] = useState<ThumbZone>('easy');

  const calculate = useCallback(() => {
    if (typeof window === 'undefined') return;
    const el = elementRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const vh = window.innerHeight;
    const third = vh / 3;
    if (center >= third * 2) {
      setZone('easy');    // bottom third
    } else if (center >= third) {
      setZone('stretch'); // middle third
    } else {
      setZone('hard');    // top third
    }
  }, [elementRef]);

  useEffect(() => {
    calculate();
    if (typeof window === 'undefined') return;
    window.addEventListener('scroll', calculate, { passive: true });
    window.addEventListener('resize', calculate);
    return () => {
      window.removeEventListener('scroll', calculate);
      window.removeEventListener('resize', calculate);
    };
  }, [calculate]);

  return zone;
}
