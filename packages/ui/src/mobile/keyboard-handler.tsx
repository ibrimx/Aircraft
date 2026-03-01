// P65 — keyboard-handler.tsx
import { useState, useEffect, useCallback, useMemo } from 'react';

/* ── Types ─────────────────────────────────────────────── */

export type KeyboardState = {
  visible: boolean;
  height: number;
};

/* ── Hook ──────────────────────────────────────────────── */

export function useKeyboardState(): KeyboardState {
  const [state, setState] = useState<KeyboardState>({ visible: false, height: 0 });

  const handleResize = useCallback(() => {
    if (typeof visualViewport === 'undefined') return;
    const vpHeight = visualViewport.height;
    const windowHeight = window.innerHeight;
    const diff = windowHeight - vpHeight;
    const isVisible = diff > 100;
    setState({ visible: isVisible, height: isVisible ? diff : 0 });
  }, []);

  useEffect(() => {
    if (typeof visualViewport === 'undefined') return;
    visualViewport.addEventListener('resize', handleResize);
    visualViewport.addEventListener('scroll', handleResize);
    return () => {
      visualViewport.removeEventListener('resize', handleResize);
      visualViewport.removeEventListener('scroll', handleResize);
    };
  }, [handleResize]);

  return state;
}

/* ── Utility ───────────────────────────────────────────── */

export function scrollInputIntoView(input: HTMLElement, extraPadding = 16): void {
  requestAnimationFrame(() => {
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
