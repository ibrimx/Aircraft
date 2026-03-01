import { useState, useEffect, useMemo, useCallback } from 'react';
import type { BreakpointName } from '@brimair/shared-types';
import { BREAKPOINT_VALUES } from '@brimair/design-tokens';

export type BreakpointState = {
  current: BreakpointName;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  isAtLeast: (bp: BreakpointName) => boolean;
  isAtMost: (bp: BreakpointName) => boolean;
};

const BP_ORDER: readonly BreakpointName[] = ['mobile', 'tablet', 'desktop', 'wide'] as const;

function getBreakpoint(): BreakpointName {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w >= BREAKPOINT_VALUES.wide) return 'wide';
  if (w >= BREAKPOINT_VALUES.desktop) return 'desktop';
  if (w >= BREAKPOINT_VALUES.tablet) return 'tablet';
  return 'mobile';
}

export function useBreakpoint(): BreakpointState {
  const [current, setCurrent] = useState<BreakpointName>(getBreakpoint);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const queries = BP_ORDER.map((bp) => {
      const mql = window.matchMedia?.(`(min-width: ${BREAKPOINT_VALUES[bp]}px)`);
      return mql ?? null;
    });
    const update = () => setCurrent(getBreakpoint());
    queries.forEach((mql) => mql?.addEventListener('change', update));
    return () => {
      queries.forEach((mql) => mql?.removeEventListener('change', update));
    };
  }, []);

  const isAtLeast = useCallback(
    (bp: BreakpointName) => BP_ORDER.indexOf(current) >= BP_ORDER.indexOf(bp),
    [current],
  );

  const isAtMost = useCallback(
    (bp: BreakpointName) => BP_ORDER.indexOf(current) <= BP_ORDER.indexOf(bp),
    [current],
  );

  return useMemo<BreakpointState>(
    () => ({
      current,
      isMobile: current === 'mobile',
      isTablet: current === 'tablet',
      isDesktop: current === 'desktop',
      isWide: current === 'wide',
      isAtLeast,
      isAtMost,
    }),
    [current, isAtLeast, isAtMost],
  );
}
