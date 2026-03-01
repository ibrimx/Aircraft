import { useState, useCallback, useEffect, useMemo } from 'react';

export type Direction = 'ltr' | 'rtl';

export type UseDirectionReturn = {
  direction: Direction;
  isRTL: boolean;
  isLTR: boolean;
  toggle: () => void;
  setDirection: (dir: Direction) => void;
};

const STORAGE_KEY = 'aircraft-direction';

function readStored(): Direction | null {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem(STORAGE_KEY) as Direction | null; }
  catch { return null; }
}

export function useDirection(): UseDirectionReturn {
  const [direction, setDirState] = useState<Direction>(() => readStored() ?? 'rtl');

  const setDirection = useCallback((dir: Direction) => {
    setDirState(dir);
    if (typeof document === 'undefined') return;
    document.documentElement.dir = dir;
    document.documentElement.lang = dir === 'rtl' ? 'ar' : 'en';
    try { localStorage.setItem(STORAGE_KEY, dir); } catch { /* incognito */ }
  }, []);

  const toggle = useCallback(() => setDirection(direction === 'rtl' ? 'ltr' : 'rtl'), [direction, setDirection]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dir = direction;
    document.documentElement.lang = direction === 'rtl' ? 'ar' : 'en';
  }, [direction]);

  return useMemo(() => ({
    direction, isRTL: direction === 'rtl', isLTR: direction === 'ltr',
    toggle, setDirection,
  }), [direction, toggle, setDirection]);
}
