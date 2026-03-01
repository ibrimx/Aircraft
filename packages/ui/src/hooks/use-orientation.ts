// packages/ui/src/hooks/use-orientation.ts
import { useEffect, useState } from 'react';

// ── Types ────────────────────────────────────────────────
export type Orientation = 'portrait' | 'landscape';

type OrientationState = {
  orientation: Orientation;
  angle: number;
  isPortrait: boolean;
  isLandscape: boolean;
};

function getState(): OrientationState {
  if (typeof screen !== 'undefined' && screen.orientation) {
    const isPort = screen.orientation.type.startsWith('portrait');
    return { orientation: isPort ? 'portrait' : 'landscape', angle: screen.orientation.angle, isPortrait: isPort, isLandscape: !isPort };
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    const isPort = window.matchMedia('(orientation: portrait)').matches;
    return { orientation: isPort ? 'portrait' : 'landscape', angle: 0, isPortrait: isPort, isLandscape: !isPort };
  }
  return { orientation: 'portrait', angle: 0, isPortrait: true, isLandscape: false };
}

// ── Hook ─────────────────────────────────────────────────
export function useOrientation(): OrientationState {
  const [state, setState] = useState<OrientationState>(getState);

  useEffect(() => {
    const update = () => setState(getState());
    const so = typeof screen !== 'undefined' ? screen.orientation : undefined;
    so?.addEventListener('change', update);
    return () => so?.removeEventListener('change', update);
  }, []);

  return state;
}
