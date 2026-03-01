// P65 — safe-area-provider.tsx
import {
  type ReactNode,
  type CSSProperties,
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';

/* ── Types ─────────────────────────────────────────────── */

export type SafeAreaInsets = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

type SafeAreaContextValue = SafeAreaInsets;

export type SafeAreaProviderProps = {
  children: ReactNode;
};

/* ── Context ───────────────────────────────────────────── */

const DEFAULT_INSETS: SafeAreaInsets = { top: 0, bottom: 0, left: 0, right: 0 };
const SafeAreaCtx = createContext<SafeAreaContextValue>(DEFAULT_INSETS);

/* ── Hook ──────────────────────────────────────────────── */

export function useSafeAreaInsets(): SafeAreaInsets {
  return useContext(SafeAreaCtx);
}

/* ── Provider ──────────────────────────────────────────── */

export function SafeAreaProvider(props: SafeAreaProviderProps) {
  const { children } = props;
  const [insets, setInsets] = useState<SafeAreaInsets>(DEFAULT_INSETS);

  useEffect(() => {
    const measure = () => {
      const cs = getComputedStyle(document.documentElement);
      setInsets({
        top: parseFloat(cs.getPropertyValue('env(safe-area-inset-top)') || '0'),
        bottom: parseFloat(cs.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
        left: parseFloat(cs.getPropertyValue('env(safe-area-inset-left)') || '0'),
        right: parseFloat(cs.getPropertyValue('env(safe-area-inset-right)') || '0'),
      });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return <SafeAreaCtx.Provider value={insets}>{children}</SafeAreaCtx.Provider>;
}
