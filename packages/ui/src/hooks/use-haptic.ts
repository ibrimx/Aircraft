// packages/ui/src/hooks/use-haptic.ts
import { useCallback, useMemo } from 'react';
import type { HapticPattern } from '@aircraft/shared-types';
import { triggerHaptic } from '../mobile/haptic-feedback';
import { useReducedMotion } from './use-reduced-motion';

// ── Hook ─────────────────────────────────────────────────
export function useHaptic(): { trigger: (pattern: HapticPattern) => void; isSupported: boolean } {
  const reducedMotion = useReducedMotion();

  const isSupported = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return typeof navigator !== 'undefined' && 'vibrate' in navigator;
  }, []);

  const trigger = useCallback(
    (pattern: HapticPattern) => {
      if (reducedMotion || !isSupported) return;
      triggerHaptic(pattern);
    },
    [reducedMotion, isSupported],
  );

  return { trigger, isSupported };
}
