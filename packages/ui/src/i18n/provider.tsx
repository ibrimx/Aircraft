import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Direction } from '@aircraft/shared-types';
import { useDirection } from '../hooks/use-direction';

export type Locale = 'ar' | 'en';
type Messages = Record<string, unknown>;
export type I18nContextValue = {
  locale: Locale;
  direction: Direction;
  t: (key: string, params?: Record<string, string | number>) => string;
  setLocale: (locale: Locale) => void;
};

const STORAGE_KEY = 'aircraft-locale';
const IS_SSR = typeof window === 'undefined';

const readStoredLocale = (): Locale | null => {
  if (IS_SSR) return null;
  try { const v = localStorage.getItem(STORAGE_KEY); return v === 'ar' || v === 'en' ? v : null; }
  catch { return null; }
};

const writeStoredLocale = (l: Locale): void => {
  if (IS_SSR) return;
  try { localStorage.setItem(STORAGE_KEY, l); } catch { /* incognito */ }
};

const detectBrowserLocale = (): Locale | null => {
  if (IS_SSR) return null;
  const lang = navigator.language ?? '';
  if (lang.startsWith('ar')) return 'ar';
  if (lang.startsWith('en')) return 'en';
  return null;
};

const resolve = (obj: Messages, key: string): string | undefined => {
  const parts = key.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur === null || cur === undefined || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === 'string' ? cur : undefined;
};

const loaders: Record<Locale, () => Promise<Messages>> = {
  ar: () => import('./ar.json').then((m) => (m as Record<string, unknown>).default ?? m) as Promise<Messages>,
  en: () => import('./en.json').then((m) => (m as Record<string, unknown>).default ?? m) as Promise<Messages>,
};

export const I18nContext = createContext<I18nContextValue | null>(null);
I18nContext.displayName = 'I18nContext';

export function I18nProvider({ children, defaultLocale = 'ar' }: { children: React.ReactNode; defaultLocale?: Locale }): React.JSX.Element {
  const initial = readStoredLocale() ?? detectBrowserLocale() ?? defaultLocale;
  const [locale, setLocaleState] = useState<Locale>(initial);
  const [msgs, setMsgs] = useState<Messages>({});
  const { direction } = useDirection();
  const loaded = useRef<Locale | null>(null);

  useEffect(() => {
    if (loaded.current === locale) return;
    let cancelled = false;
    loaders[locale]().then((m) => { if (!cancelled) { setMsgs(m); loaded.current = locale; } });
    return () => { cancelled = true; };
  }, [locale]);

  const setLocale = useCallback((l: Locale) => { writeStoredLocale(l); setLocaleState(l); }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const val = resolve(msgs, key);
    if (val === undefined) {
      if (process.env.NODE_ENV !== 'production') console.warn(`[i18n] missing key: ${key}`);
      return key;
    }
    if (!params) return val;
    return val.replace(/\{\{(\w+)\}\}/g, (_, k: string) => (k in params ? String(params[k]) : `{{${k}}}`));
  }, [msgs]);

  const value = useMemo<I18nContextValue>(() => ({ locale, direction, t, setLocale }), [locale, direction, t, setLocale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
