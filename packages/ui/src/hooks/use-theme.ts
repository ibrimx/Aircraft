import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ThemeMode } from '@brimair/shared-types';

const STORAGE_KEY = 'brimair-theme';
const DARK_MQ = '(prefers-color-scheme: dark)';

function readStored(): ThemeMode | null {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem(STORAGE_KEY) as ThemeMode | null; }
  catch { return null; }
}

function getSystemPref(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia?.(DARK_MQ).matches ? 'dark' : 'light';
}

export type UseThemeReturn = {
  mode: ThemeMode;
  isDark: boolean;
  isLight: boolean;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
  systemPreference: ThemeMode;
};

export function useTheme(): UseThemeReturn {
  const [mode, setModeState] = useState<ThemeMode>(() => readStored() ?? getSystemPref() ?? 'dark');
  const [systemPreference, setSystemPref] = useState<ThemeMode>(getSystemPref);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    if (typeof document !== 'undefined') document.documentElement.dataset.theme = m;
    try { localStorage.setItem(STORAGE_KEY, m); } catch { /* incognito */ }
  }, []);

  const toggle = useCallback(() => setMode(mode === 'dark' ? 'light' : 'dark'), [mode, setMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.dataset.theme = mode;
    const mql = window.matchMedia?.(DARK_MQ);
    if (!mql) return;
    const handler = (e: MediaQueryListEvent) => setSystemPref(e.matches ? 'dark' : 'light');
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [mode]);

  return useMemo(() => ({
    mode, isDark: mode === 'dark', isLight: mode === 'light',
    toggle, setMode, systemPreference,
  }), [mode, toggle, setMode, systemPreference]);
}
