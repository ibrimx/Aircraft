import { useState, useEffect, useRef, useCallback } from 'react';

export type OnlineState = {
  isOnline: boolean;
  wasOffline: boolean;
  lastOnlineAt: number | null;
};

const DEBOUNCE_MS = 500;

export function useOnlineStatus(): OnlineState {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  const [wasOffline, setWasOffline] = useState(false);
  const [lastOnlineAt, setLastOnlineAt] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyStatus = useCallback((online: boolean) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsOnline((prev) => {
        if (!online) setWasOffline(true);
        if (online && !prev) setLastOnlineAt(Date.now());
        return online;
      });
    }, DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onOnline = () => applyStatus(true);
    const onOffline = () => applyStatus(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [applyStatus]);

  return { isOnline, wasOffline, lastOnlineAt };
}
