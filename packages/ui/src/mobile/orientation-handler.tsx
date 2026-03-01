// P65 — orientation-handler.tsx
import { useState, useEffect, useCallback } from 'react';

/* ── Types ─────────────────────────────────────────────── */

export type Orientation = 'portrait' | 'landscape';

export type UseOrientationReturn = {
  orientation: Orientation;
  angle: number;
};

/* ── Hook ──────────────────────────────────────────────── */

function getOrientation(): UseOrientationReturn {
  if (typeof screen !== 'undefined' && screen.orientation) {
    const angle = screen.orientation.angle;
    return {
      orientation: angle === 0 || angle === 180 ? 'portrait' : 'landscape',
      angle,
    };
  }
  return {
    orientation: typeof window !== 'undefined' && window.innerWidth > window.innerHeight
      ? 'landscape'
      : 'portrait',
    angle: 0,
  };
}

export function useOrientation(): UseOrientationReturn {
  const [state, setState] = useState<UseOrientationReturn>(getOrientation);

  const update = useCallback(() => {
    setState(getOrientation());
  }, []);

  useEffect(() => {
    if (screen.orientation) {
      screen.orientation.addEventListener('change', update);
      return () => screen.orientation.removeEventListener('change', update);
    }
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  return state;
}
