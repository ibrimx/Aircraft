// packages/ui/src/hooks/use-safe-area.ts
import { useEffect, useState } from 'react';

// ── Types ────────────────────────────────────────────────
export type SafeAreaInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

const ZERO_INSETS: SafeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 };

// ── Helper ───────────────────────────────────────────────
function readInsets(): SafeAreaInsets {
  if (typeof document === 'undefined') return ZERO_INSETS;
  const el = document.createElement('div');
  el.style.position = 'fixed';
  el.style.top = 'env(safe-area-inset-top, 0px)';
  el.style.right = 'env(safe-area-inset-right, 0px)';
  el.style.bottom = 'env(safe-area-inset-bottom, 0px)';
  el.style.left = 'env(safe-area-inset-left, 0px)';
  el.style.visibility = 'hidden';
  el.style.pointerEvents = 'none';
  document.body.appendChild(el);
  const cs = getComputedStyle(el);
  const insets: SafeAreaInsets = {
    top: parseFloat(cs.top) || 0,
    right: parseFloat(cs.right) || 0,
    bottom: parseFloat(cs.bottom) || 0,
    left: parseFloat(cs.left) || 0,
  };
  document.body.removeChild(el);
  return insets;
}

// ── Hook ─────────────────────────────────────────────────
export function useSafeArea(): SafeAreaInsets {
  const [insets, setInsets] = useState<SafeAreaInsets>(ZERO_INSETS);

  useEffect(() => {
    setInsets(readInsets());
    const mq = typeof window !== 'undefined' ? window.matchMedia('(orientation: portrait)') : null;
    const handler = () => setInsets(readInsets());
    mq?.addEventListener('change', handler);
    return () => mq?.removeEventListener('change', handler);
  }, []);

  return insets;
}
