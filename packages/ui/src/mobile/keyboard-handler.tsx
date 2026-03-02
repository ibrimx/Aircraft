// P65 — keyboard-handler.tsx
import { useState, useEffect, useCallback } from 'react';

/* ── Types ─────────────────────────────────────────────── */

export type KeyboardState = {
  visible: boolean;
  height: number;
};

/* ── Hook ──────────────────────────────────────────────── */

export function useKeyboardState(): KeyboardState {
  const [state, setState] = useState<KeyboardState>({ visible: false, height: 0 });

  const handleResize = useCallback(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const vpHeight = viewport.height;
    const windowHeight = window.innerHeight;
    const diff = windowHeight - vpHeight;
    const isVisible = diff > 100;
    setState({ visible: isVisible, height: isVisible ? diff : 0 });
  }, []);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    viewport.addEventListener('resize', handleResize);
    viewport.addEventListener('scroll', handleResize);
    return () => {
      viewport.removeEventListener('resize', handleResize);
      viewport.removeEventListener('scroll', handleResize);
    };
  }, [handleResize]);

  return state;
}

/* ── Utility ───────────────────────────────────────────── */

export function scrollInputIntoView(input: HTMLElement): void {
  requestAnimationFrame(() => {
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
